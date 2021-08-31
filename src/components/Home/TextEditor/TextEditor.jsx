import React, { useCallback, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";

function TextEditor() {
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
    new Quill("#editor", {
      modules: {
        toolbar: null
      },
      theme: "snow",
    });
  }, []);

  return (
    <div>
      <div id="editor" style={{margin: "1rem", width: "8.5in",}}>
        <h1>Entry Title</h1>
      </div>
      <div className="container-a" ref={ref}></div>
    </div>
  );
}

export default TextEditor;
