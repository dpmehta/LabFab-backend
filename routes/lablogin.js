const express = require("express");
const { body, validationResult } = require("express-validator");
const LabLogin = require("../models/LabLogin");
const bcrypt = require("bcryptjs");

const router = express.Router();

// POST endpoint to add lab login data
router.post(
  "/",
  [
    // Validate request body
    body("adminId").notEmpty().withMessage("Admin ID is required"),
    body("labNumber").notEmpty().withMessage("Lab Number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { adminId, labNumber, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new lab login instance with hashed password
      const labLogin = new LabLogin({
        adminId,
        labNumber,
        password: hashedPassword,
      });

      // Save lab login data to the database
      await labLogin.save();

      // Send success response
      res.status(201).json({
        success: true,
        message: "Lab Login data added successfully",
      });
    } catch (error) {
      console.error(error);
      // Send error response
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

router.post(
  "/verify",
  [
    body("adminId").notEmpty().withMessage("Admin ID is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { adminId, password, labNumber } = req.body;

    try {
      const labLogin = await LabLogin.findOne({ adminId });

      if (!labLogin) {
        return res.status(404).json({ message: "Lab login not found" });
      }

      const passwordMatch = await bcrypt.compare(password, labLogin.password);

      if (passwordMatch) {
        return res
          .status(200)
          .json({ success: true, message: "Login verified" });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

module.exports = router;
