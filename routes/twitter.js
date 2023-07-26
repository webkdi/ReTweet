const express = require("express");
const router = express.Router();
const tw = require("../components/twitter")

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

router.post("/tweets", async (req, res) => {
  const text = req.body.text;
  const mediaType = req.body.mediaType;
  const mediaeUrl = req.body.mediaeUrl;
  console.log(text, mediaType, mediaeUrl);

  // Check if mediaType is available, must be a string, and can contain "text", "image", or "video"
  if (
    !mediaType ||
    typeof mediaType !== "string" ||
    !["text", "image", "video"].includes(mediaType)
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid mediaType. It must be a string and can only be 'text', 'image', or 'video'.",
      });
  }

  const tweet = await tw.tweetPost(text, mediaType, mediaeUrl);
  res.send(tweet);
});

module.exports = router;
