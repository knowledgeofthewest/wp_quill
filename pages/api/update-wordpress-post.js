import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { postId, title, content } = req.body;
  const WP_USERNAME = process.env.WP_USERNAME;
  const WP_PASSWORD = process.env.APPLICATION_PASSWORD;
  const auth = Buffer.from(`${WP_USERNAME}:${WP_PASSWORD}`).toString("base64");

  try {
    const response = await fetch(`https://knowledgeofthewest.com/wp-json/wp/v2/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        status: "publish",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.message || "Failed to update post" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error updating WordPress post:", error);
    res.status(500).json({ message: "Server error" });
  }
}
