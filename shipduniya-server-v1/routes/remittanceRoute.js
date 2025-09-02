const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const { AdminActionForApprove, getAdminRemittanceData, AdminActionForReject ,getSuperAdminRemittanceData, SuperAdminActionForMarkPaid} = require("../controllers/remittanceController");
const router = express.Router();

router.post("/approval-pending-action", authMiddleware,  roleMiddleware(["admin", "superadmin"]), AdminActionForApprove);
router.get("/getRemittances", authMiddleware,  roleMiddleware(["admin", "superadmin"]), getAdminRemittanceData);
router.get("/getSuperRemittances", authMiddleware,  roleMiddleware([ "superadmin"]), getSuperAdminRemittanceData);
router.post("/reject-action", authMiddleware,  roleMiddleware(["admin", "superadmin"]), AdminActionForReject);
router.post("/paid-action", authMiddleware,  roleMiddleware(["superadmin"]), SuperAdminActionForMarkPaid);

module.exports = router;