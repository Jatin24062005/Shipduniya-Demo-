const { CreateWeightReconciliation, CreateWeightReconciliationBulk, getWeightReconcilition, getWeightReconcilitionForAdmin, UserRaisedAction, RejectDispute, ResolveDispute } = require("../controllers/weightReconciliationController");
const { authMiddleware } = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");

const router = require("express").Router();

router.post("/extra-weight-reconciliation", authMiddleware, CreateWeightReconciliation);
router.post("/extra-weight-reconciliation-bulk", authMiddleware, upload.single("file"),CreateWeightReconciliationBulk);
router.get("/get-weight-reconciliation-for-admin", authMiddleware, getWeightReconcilitionForAdmin);
router.get("/get-weight-reconciliation", authMiddleware, getWeightReconcilition);
router.post("/raised-action", authMiddleware, upload.single("file"), UserRaisedAction);
router.post("/reject-action", authMiddleware, RejectDispute);
router.post("/resolve-action", authMiddleware, ResolveDispute);

module.exports = router;
