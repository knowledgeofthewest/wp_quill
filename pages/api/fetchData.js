import "dotenv/config";

const POST_ID = 4213;

const fetchData = async () => {
  try {
    const url = `https://knowledgeofthewest.com/wp-json/wp/v2/posts/${POST_ID}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const htmlContent = data.content?.rendered || "";

    return htmlContent;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export default fetchData;