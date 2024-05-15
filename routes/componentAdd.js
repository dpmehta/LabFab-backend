const express = require("express");
const router = express.Router();
const multer = require("multer");
const Component = require("../models/Component");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images/component-images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, location } = req.body;
    const imageUpload = req.file
      ? `/assets/images/component-images/${req.file.filename}`
      : "";

    const component = new Component({
      name,
      description,
      location,
      imageUpload,
    });
    await component.save();

    res
      .status(201)
      .json({ message: "Component added successfully", component });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
