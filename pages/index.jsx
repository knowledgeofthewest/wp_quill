import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import fetchData from "./api/fetchData.js"; 
import styles from '../styles/Home.module.css'

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function Home() {
  const [editorContent, setEditorContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const handleChange = (content) => {
    setEditorContent(content);
  };

  useEffect(() => {
    const fetchAndSetContent = async () => {
      const fetchedContent = await fetchData();
      if (fetchedContent) {
        
        setEditorContent(fetchedContent); 
      }
    };

    fetchAndSetContent();
  }, []);

  const saveToWordPress = async () => {
    try {
      setSaveStatus("Publishing to WordPress...");
  
      const response = await fetch("/api/post-to-wordpress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Quill Post",
          content: editorContent,
        }),
      });
  
      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`
        );
      }
  
      const data = await response.json();
      setSaveStatus(`✅ Published! Post ID: ${data.postId}`);
    } catch (error) {
      console.error("Error publishing to WordPress:", error);
      setSaveStatus(`❌ Error: ${error.message}`);
    }
  };
  
  return (
    <div className={styles.editor}>
      <h1>Quill Editor - Create Post</h1>
      <ReactQuill
        className={styles.quill}
        onChange={handleChange}
        modules={{
          toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [{ header: [1, 2, 3, false] }],
            [{ align: [] }],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["blockquote", "code-block"],
            ["link", "image", "video", "formula"],
            ["clean"],
          ],
        }}
      />
      <div className="mt-4">
        <button
          onClick={saveToWordPress}
        >
          Save to Wordpress
        </button>
        {saveStatus && <span>{saveStatus}</span>}
      </div>
    </div>
  );
}
