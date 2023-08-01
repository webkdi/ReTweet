require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");
const axios = require("axios");

const client_InfoDefense = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
const client_Polk = new TwitterApi({
  appKey: process.env.TWITTER_POLK_APP_KEY,
  appSecret: process.env.TWITTER_POLK_APP_SECRET,
  accessToken: process.env.TWITTER_POLK_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_POLK_ACCESS_SECRET,
});

const rwClient_InfoDefense = client_InfoDefense.readWrite;
const rwClient_Polk = client_Polk.readWrite;

async function tweetPost(text, mediaType, mediaeUrl, channel) {
  // Upload media (image, video) to twitter
  let mediaId;
  if (mediaType != "text") {
    const response = await axios.get(mediaeUrl, {
      responseType: "arraybuffer",
    });
    const mediaBuffer = Buffer.from(response.data);
    var mediaTypeDesc = "";
    if (mediaType == "image") {
      mediaTypeDesc = "image/jpeg";
    } else if (mediaType == "video") {
      mediaTypeDesc = "video/mp4";
    }
    try {
      console.log("Trying to upload media", mediaeUrl);
      // Create an object to hold the media data and mimeType
      const mediaData = { mimeType: mediaTypeDesc };
      if (channel === "infodefense") {
        mediaId = await client_InfoDefense.v1.uploadMedia(
          mediaBuffer,
          mediaData
        );
      } else if (channel === "polk") {
        mediaId = await client_Polk.v1.uploadMedia(mediaBuffer, mediaData);
      }
      console.log("Twitter: media uploaded with id", mediaId);
    } catch (error) {
      // Code to handle errors here
      console.error("Error uploading media:", error.message);
      return error.message;
    }
  }

  //Tweet!
  try {
    let tweet;
    if (mediaType != "text") {
      if (channel === "infodefense") {
        tweet = await client_InfoDefense.v2.tweet({
          text,
          media: { media_ids: [mediaId] },
        });
      } else if (channel === "polk") {
        tweet = await client_Polk.v2.tweet({
          text,
          media: { media_ids: [mediaId] },
        });
      }
    } else {
      if (channel === "infodefense") {
        tweet = await client_InfoDefense.v2.tweet({
          text,
        });
      } else if (channel === "polk") {
        tweet = await client_Polk.v2.tweet({
          text,
        });
      }
    }
    console.log(
      "Twitter: tweet created with id",
      tweet.data.id,
      "and text '",
      tweet.data.text,
      "'"
    );
    return tweet;
  } catch (error) {
    // const errorMessage = 'An error occurred while posting the tweet: ' + error.data + ', ' + error.rateLimit;
    console.error(error);
    return error.data;
  }
}

module.exports = {
  tweetPost,
};
