const express = require("express");
const router = express.Router();
const upload = require("../utils/cloudinary");
const verifyToken = require("../middleware/auth");

router.post(
  "/upload",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    return res.json({ image: req.file.path });
  }
);

router.post("/upload-multiple", upload.array("images"), async (req, res) => {
  const images = req.files.map((file) => file.path);
  return res.json({ images });
});

module.exports = router;
