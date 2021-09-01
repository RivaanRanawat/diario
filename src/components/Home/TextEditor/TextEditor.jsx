import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";
import { useParams } from "react-router";
import { db } from "../../../services/firebase";

function TextEditor() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const { diary, chapter } = useParams();
  console.log(diary);
  console.log(chapter);

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ];

  // using callback not use effect because of the error of innerhtml by ref created using useRef
  // pararaph section of entry
  const ref = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow", modules: { toolbar: toolbarOptions } });
  }, []);

  // title section of entry
  useEffect(() => {
    async function fetchDiary() {
      try {
        setIsLoading(true);
        const querySnapshot = await db
          .collection("diaries")
          .doc(diary)
          .collection("entries")
          .doc(chapter)
          .get();
        setName(querySnapshot.data().name);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        alert(err.message);
      }
    }

    fetchDiary().then(() => {
      new Quill("#editor", {
        modules: {
          toolbar: null,
        },
        theme: "snow",
      });
    });
  }, [name]);

  return !isLoading ? (
    <div>
      <div id="editor" style={{ margin: "1rem", width: "8.5in" }}>
        <h1>{name != "" ? name : "Entry Title"}</h1>
      </div>
      <div className="container-a" ref={ref}></div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default TextEditor;
