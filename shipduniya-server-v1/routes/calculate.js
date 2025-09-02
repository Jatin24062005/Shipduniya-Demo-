const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const {
  calculateCharges,
  calculateShippingCharges,
} = require("../controllers/calculateCharges");

// Route to calculate the charges
router.post("/calculate-charges", authMiddleware, calculateCharges);

router.post("/calculate-OnBackend-charges", calculateCharges);

// Route to calculate shipping charges for multiple orders and carriers
router.post(
  "/calculate-shipping-charges",
  authMiddleware,
  calculateShippingCharges
);

module.exports = router;
