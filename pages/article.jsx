import React, { useEffect, useRef, useState } from 'react';
import fetchData from './api/fetchData.js';
import styles from '../styles/Article.module.css'
import 'quill/dist/quill.snow.css';


const DeltaJsonRenderer = ({ deltaJson }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && quillRef.current) {
      import('quill').then((QuillModule) => {
        const Quill = QuillModule.default || QuillModule; 
        const quill = new Quill(quillRef.current, {
          theme: 'snow', 
          readOnly: true,
          modules: {
            toolbar: false, 
          },
        });

        quill.setContents(deltaJson);
      });
    }
  }, [deltaJson]);

  return <div ref={quillRef} />;
};


// const sampleDeltaJson = {
//   "ops": [
//     { "insert": "Hello, this is a " },
//     { "insert": "bold text", "attributes": { "bold": true } },
//     { "insert": " and some " },
//     { "insert": "italic text", "attributes": { "italic": true } },
//     { "insert": " with a " },
//     { "insert": "link", "attributes": { "link": "https://www.example.com" } },
//     { "insert": ". This is the end of the example." }
//   ]
// };

const App = () => {
    const [deltaJson, setDeltaJson] = useState(null);

    useEffect(() => {
        
        const fetchDataFromContentful = async () => {
          const data = await fetchData(); 
          if (data) {
            setDeltaJson(data); 
          }
        };
    
        fetchDataFromContentful();
      }, []); 
    
      if (!deltaJson) {
        return <div>Loading...</div>; 
      }

  return (
    <div className={styles.article}>
      <h1>Delta JSON Renderer</h1>
      <DeltaJsonRenderer deltaJson={deltaJson} />
    </div>
  );
};

export default App;
