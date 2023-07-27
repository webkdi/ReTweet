const express = require("express");
const router = express.Router();
const tw = require("../components/twitter");

// Define the timeout duration in milliseconds
const TIMEOUT_DURATION = 15000; // 10 seconds

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

router.post("/tweets", async (req, res) => {
  try {
    // Set up a timer for the specified duration
    const timeout = setTimeout(() => {
      // If the timeout is reached, return an error response and end the request
      res.status(500).json({ error: "Request timed out" });
    }, TIMEOUT_DURATION);

    const { text, mediaType, mediaUrl } = req.body;
    console.log("Trying to create tweet with", mediaType, text, mediaUrl);

    // Check if mediaType is available, must be a string, and can only contain "text", "image", or "video"
    if (
      !mediaType ||
      typeof mediaType !== "string" ||
      !["text", "image", "video"].includes(mediaType)
    ) {
      // Clear the timeout before sending the response to avoid headers already sent error
      clearTimeout(timeout);

      return res.status(400).json({
        error:
          "Invalid mediaType. It must be a string and can only be 'text', 'image', or 'video'.",
      });
    }

    const tweet = await tw.tweetPost(text, mediaType, mediaUrl);

    // Clear the timeout before sending the response to avoid headers already sent error
    clearTimeout(timeout);

    res.send(tweet);
  } catch (error) {
    // If there's an error during tweetPost or other parts of the try block, handle it appropriately
    console.error("Error while creating tweet:", error);
    res.status(500).json({ error: "An error occurred while creating the tweet." });
  }
});

module.exports = router;
