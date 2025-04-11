import { createClient } from "contentful-management";
import "dotenv/config";

async function updateDeltaJsonContent(entryId, newContent) {
  try {
    const client = createClient({
      accessToken: process.env.CMA_TOKEN,
    });

    const space = await client.getSpace(process.env.SPACE_ID);
    const environment = await space.getEnvironment("master");
    const entry = await environment.getEntry(entryId);

    entry.fields.content = {
      "en-US": newContent,
    };

    const updatedEntry = await entry.update();
    console.log(`✅ Content updated for entry ${entryId}`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const publishedEntry = await updatedEntry.publish();
      console.log(`✅ Entry ${entryId} published successfully`);
    } catch (publishError) {
      console.error(`⚠️ Error publishing entry ${entryId}:`, publishError);

      return {
        success: true,
        entryId,
        publishSuccess: false,
        publishError: publishError.message,
      };
    }

    return { success: true, entryId };
  } catch (error) {
    console.error(`❌ Error updating entry ${entryId}:`, error);
    return { success: false, error: error.message };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { delta } = req.body;
    const entryId = "tJecCVwnwoJ2DVxoKH97U";

    const result = await updateDeltaJsonContent(entryId, delta);

    if (result.success) {
      return res
        .status(200)
        .json({ message: "Document saved successfully", entryId });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({
      message: "Error saving document",
      error: error.message,
    });
  }
}
