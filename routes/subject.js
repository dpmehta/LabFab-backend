const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

// POST route to create a new subject
router.post("/addSubject", async (req, res) => {
  try {
    const { subjectName, semester, labName } = req.body;

    const newSubject = new Subject({
      subjectName,
      semester,
      labName,
    });

    const savedSubject = await newSubject.save();

    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal Server Error" });
  }
});

module.exports = router;
