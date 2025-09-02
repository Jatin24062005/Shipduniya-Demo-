const RemittanceRequest = require("../models/RemittanceRequest");
const Remittance = require("../models/Remittance");
const { ConversationRelay } = require("twilio/lib/twiml/VoiceResponse");

const AdminActionForApprove = async (req, res) => {
  const Id = req.user.id;
  const { remittanceRequestIds, remark } = req.body;

  if (!Id) {
    return res.status(400).JSON({
      message: "User Not FOund",
    });
  }
  try {
    const remittanceRequests = await RemittanceRequest.find({
      _id: { $in: remittanceRequestIds },
      adminId: Id,
    });

    if (!remittanceRequests || remittanceRequests.length === 0) {
      return res.status(400).json({
        message: "No Remittance Requests",
      });
    }

    // Group remittance requests by userId and calculate totalDeliveredCod per user
    const requestsByUser = {};
    const deliveredCodByUser = {};

    // Update all selected RemittanceRequests to status 'approval_pending' in the DB
    await RemittanceRequest.updateMany(
      { _id: { $in: remittanceRequestIds }, adminId: Id },
      { $set: { status: "approval_pending" } }
    );

    for (const remittance of remittanceRequests) {
      const userId = remittance.userId.toString();
      // status already updated in DB
      if (!requestsByUser[userId]) {
        requestsByUser[userId] = [];
        deliveredCodByUser[userId] = 0;
      }
      requestsByUser[userId].push(remittance._id);
      deliveredCodByUser[userId] += remittance.codAmount || 0;
    }

    // Create a new Remittance for each userId with their remittanceRequest IDs and totalDeliveredCod
    const createdRemittances = [];
    for (const userId in requestsByUser) {
      const remittanceIds = requestsByUser[userId];
      const totalAwb = remittanceIds.length;
      const totalDeliveredCod = deliveredCodByUser[userId];
      const newRemittance = await Remittance.create({
        sellerId: userId,
        remittanceRequestIds: remittanceIds,
        totalAwb: totalAwb,
        totalDeliveredCod: totalDeliveredCod,
        remark: remark,
      });
      createdRemittances.push(newRemittance);
      if (newRemittance) {
        console.log(
          `Remittance Created For User ${userId} With TotalCODDelivered:`,
          totalDeliveredCod
        );
      }
    }
    res.send({
      status: "success",
      message: "Remittance Created Successfully!",
      Remittances: createdRemittances,
    });
  } catch (error) {
    console.log("Failed to Take Action: ", error);
  }
};

const AdminActionForReject = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const { rejectRemittanceIds } = req.body;

    if (!adminId) {
      return res.status(400).json({ message: "Admin not authenticated" });
    }

    if (!Array.isArray(rejectRemittanceIds) || rejectRemittanceIds.length === 0) {
      return res.status(400).json({ message: "No remittance IDs provided for rejection" });
    }

    let updatedCount = 0;
    const affectedRemittanceIds = new Set();

    for (const reqId of rejectRemittanceIds) {
      const remittanceRequest = await RemittanceRequest.findById(reqId);
      if (!remittanceRequest) continue;

      const remittance = await Remittance.findOne({
        remittanceRequestIds: reqId,
      });
      if (!remittance) continue;

      const codAmount = remittanceRequest.codAmount || 0;

      affectedRemittanceIds.add(remittance._id.toString());

      await RemittanceRequest.updateOne(
        { _id: reqId },
        { $set: { status: "unpaid" } }
      );

      const result = await Remittance.findOneAndUpdate(
        { _id: remittance._id },
        {
          $pull: { remittanceRequestIds: reqId },
          $inc: { totalDeliveredCod: -codAmount },
          $inc:{totalAwb: -1} // 🔻 Decrease COD amount
        }
      );

      if (result) updatedCount++;
    }

    for (const remittanceId of affectedRemittanceIds) {
      const updatedRemittance = await Remittance.findById(remittanceId);

      if (updatedRemittance.remittanceRequestIds.length === 0) {
        await Remittance.updateOne(
          { _id: remittanceId },
          { $set: { status: "rejected" } }
        );
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Sub-remittances rejected and removed successfully",
      removedSubRequests: updatedCount,
    });
  } catch (error) {
    console.error("Error in AdminActionForReject:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAdminRemittanceData = async (req, res) => {
  const Id = req.user.id;

  if (!Id) {
    return res.status(400).json({
      message: "User Not Found",
    });
  }

  const Remittances = await Remittance.find()
  .populate({
    path: "sellerId",
    select: "-avatar" 
  })
  .populate("remittanceRequestIds");

  if (!Remittances || Remittances.length == 0) {
    return res.status(200).json({
      status: "success",
      message: "No Remittances Found",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "Remittance Found",
    Remittances: Remittances,
  });
};
const getSuperAdminRemittanceData = async (req, res) => {
  try {
    const superAdminId = req.user.id;
    console.log("superAdminId:", superAdminId);

    if (!superAdminId) {
      return res.status(400).json({ message: "User Not Found" });
    }

    // Fetch all remittances under the current super admin
    const remittances = await Remittance.find({ superAdminId })
  .populate({
    path: "sellerId",
    select: "-avatar" // exclude the avatar field from sellerId
  }).populate("adminId")
      .populate({
        path: "remittanceRequestIds",
        populate: {
          path: "orderId", // Optional: populate order info
        },
      });

    if (!remittances || remittances.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No Remittances Found",
        data: [],
      });
    }

    // Step 1: Group by admin
    const adminGrouped = {};

    for (const rem of remittances) {
      const adminId = rem.adminId._id.toString();
      const sellerId = rem.sellerId._id.toString();

      if (!adminGrouped[adminId]) {
        adminGrouped[adminId] = {
          adminId: rem.adminId._id,
          adminInfo: rem.adminId,
          users: {},
          totalUser:0,
         totalUsersCOD:0
        };
      }

      // Step 2: Group inside admin by seller
      if (!adminGrouped[adminId].users[sellerId]) {
        adminGrouped[adminId].users[sellerId] = {
          sellerId: rem.sellerId._id,
          sellerInfo: rem.sellerId,
          totalDeliveredCod: 0,
          remittances: [],
        };
      }

      // Accumulate totalDeliveredCod per user
      adminGrouped[adminId].users[sellerId].totalDeliveredCod += rem.totalDeliveredCod;
      adminGrouped[adminId].users[sellerId].remittances.push({
        _id: rem._id,
        totalDeliveredCod: rem.totalDeliveredCod,
        totalAwb: rem.totalAwb,
        status: rem.status,
        paymentDate: rem.paymentDate,
        remark: rem.remark,
        transactionId: rem.transactionId,
        createdAt: rem.createdAt,
        remittanceRequests: rem.remittanceRequestIds, // nested requests
      });
    }

const finalData = Object.values(adminGrouped).map(admin => {
  const usersArray = Object.values(admin.users);
  admin.totalUser = usersArray.length;
  admin.totalUsersCOD = usersArray.reduce((sum, user) => sum + (user.totalDeliveredCod || 0), 0);

  return {
    ...admin,
    users: usersArray,
  };
});

    return res.status(200).json({
      status: "success",
      message: "Grouped Remittances by Admin and Users",
      data: finalData,
    });

  } catch (error) {
    console.error("Error fetching remittance data:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const SuperAdminActionForMarkPaid = async (req, res) => {
  try {
    const superAdminId = req.user?.id;
    if (!superAdminId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { payRemittanceId, remark, transactionId } = req.body;

    const remittance = await Remittance.findOneAndUpdate(
      { superAdminId, _id: payRemittanceId },
      {
        status: "paid",
        transactionId: transactionId,
        remark: remark,
      },
      { new: true }
    );

    if (!remittance) {
      return res.status(404).json({ message: "Remittance not found or unauthorized" });
    }

    const remittanceRequest = remittance.remittanceRequestIds || [];

    console.log(remittanceRequest);

    for (const id of remittanceRequest) {
      await RemittanceRequest.findByIdAndUpdate(id, {
        status: "paid",
      });
    }

    return res.status(200).json({ message: "Remittance marked as paid successfully", remittance });
  } catch (error) {
    console.error("Error in SuperAdminActionForMarkPaid:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = {
  AdminActionForApprove,
  AdminActionForReject,
  getAdminRemittanceData,
  getSuperAdminRemittanceData,
  SuperAdminActionForMarkPaid
};
