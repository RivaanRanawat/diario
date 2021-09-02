import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";
import { useHistory, useParams } from "react-router";
import { db } from "../../../services/firebase";
import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import Sidebar from "../Sidebar/Sidebar";
import SectionsSidebar from "../Sidebar/SectionsSidebar";

// const useStyles = makeStyles((theme) => ({
//   margin: {
//     margin: theme.spacing(1),
//   },
// }));

function TextEditor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const { diary, chapter } = useParams();
  const [quill, setQuill] = useState();
  const [titleQuill, setTitleQuill] = useState();
  const [paraContent, setParaContent] = useState();
  const history = useHistory();

  // const classes = useStyles();

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
    setIsLoading(true);
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    setQuill(q);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (quill == null) return;
    quill.setContents(paraContent);
    quill.enable();
  }, [quill]);

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
        setParaContent(querySnapshot.data().content);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        alert(err.message);
      }
    }

    fetchDiary().then(() => {
      const q = new Quill("#editor", {
        modules: {
          toolbar: null,
          keyboard: {
            bindings: {
              tab: false,
              handleEnter: {
                key: 13,
                handler: function () {
                  // Do nothing
                },
              },
            },
          },
        },
        theme: "snow",
      });
      setTitleQuill(q);
    });
  }, []);

  async function handleSave() {
    console.log(titleQuill.getContents().ops[0]["insert"]);
    console.log(quill.getContents().ops);
    try {
      setIsSaving(true);
      if (quill.getContents().ops == null) return alert("Please start typing!");
      // delete the previous titled document
      await db
        .collection("diaries")
        .doc(diary)
        .collection("entries")
        .doc(chapter)
        .delete();
      // adding new chapter
      await db
        .collection("diaries")
        .doc(diary)
        .collection("entries")
        .doc(titleQuill.getContents().ops[0]["insert"])
        .set({
          name: titleQuill.getContents().ops[0]["insert"],
          content: quill.getContents().ops,
          createdAt: new Date(),
        });
      setIsSaving(false);
      history.push(`/chapters/${diary}`);
    } catch (err) {
      setIsSaving(false);
      alert(err.message);
    }
  }

  return !isLoading ? (
    <div>
      <SectionsSidebar diary={diary} />
      <center>
        <Button
          onClick={handleSave}
          style={{ marginTop: "10px" }}
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
        >
          {isSaving? "Saving" : "Save"}
        </Button>
      </center>
      <div id="editor" style={{ margin: "1rem", width: "8.5in" }}>
        <h1>{name != "" ? name : "Entry Title"}</h1>
      </div>
      <div className="container-a" ref={ref}></div>
    </div>
  ) : (
    <CircularProgress />
  );
}

export default TextEditor;
