import axios from "axios";
import "dotenv/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { title, content } = req.body;

    const username = "knowledgeofthewest";
    const appPassword = process.env.APPLICATION_PASSWORD;

    const credentials = Buffer.from(`${username}:${appPassword}`).toString("base64");

    const response = await axios.post(
      "https://knowledgeofthewest.com/wp-json/wp/v2/posts",
      {
        title,
        content,
        status: "publish",
      },
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      message: "Post published to WordPress",
      postId: response.data.id,
      postLink: response.data.link,
    });
  } catch (error) {
    console.error("WordPress Publish Error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to publish post",
      error: error.response?.data || error.message,
    });
  }
}
