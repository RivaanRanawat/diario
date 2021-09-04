import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import styles from "./StickyNotes.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Button, CircularProgress, Input } from "@material-ui/core";
import { db } from "../../../services/firebase";
import firebase from "firebase";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import SectionsSidebar from "../Sidebar/SectionsSidebar";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function StickyNotes() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [notes, setNotes] = useState([]);
  const [descriptionInput, setDescriptionInput] = useState("");
  const { diary, name } = useParams();
  const { currentUser } = useAuth();

  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function saveNote() {
    try {
      const data = {
        title: titleInput,
        description: descriptionInput,
        createdAt: new Date(),
      };
      await db
        .collection("diaries")
        .doc(diary)
        .collection("entries")
        .doc(name)
        .update({
          notes: firebase.firestore.FieldValue.arrayUnion(data),
        });
      setNotes((prevArr) => [...prevArr, data]);
      setTitleInput("");
      setDescriptionInput("");
      handleClose();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteNote(note) {
    const index = notes.findIndex((notePar) => notePar === note);
    try {
      await db
        .collection("diaries")
        .doc(diary)
        .collection("entries")
        .doc(name)
        .update({
          notes: firebase.firestore.FieldValue.arrayRemove(note),
        });
      notes.splice(index, 1);
      setNotes((prevArr) => [...prevArr]);
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    db.collection("diaries")
      .doc(diary)
      .get()
      .then((snap) => {
        if (currentUser.uid !== snap.data().createdBy) {
          alert("You have no such diary!");
          history.push("/");
        }
      }).catch(err => {
        alert("You have no such diary!")
      });
    db.collection("diaries")
      .doc(diary)
      .collection("entries")
      .doc(name)
      .get()
      .then((snap) => {
        setIsLoading(false);
        setNotes(snap.data().notes);
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err.message);
      });
  }, []);

  return !isLoading ? (
    <>
      <SectionsSidebar diary={diary} />
      <button className={styles.stickyButton} onClick={handleOpen}>
        Create Note
      </button>
      <ul className={styles.stickyNotes}>
        {notes.map((note) => (
          <li
            className={styles.stickNote}
            onDoubleClick={() => deleteNote(note)}
          >
            <a href="#">
              <h2 className={styles.stickyBoldText}>{note.title}</h2>
              <p className={styles.stickyText}>{note.description}</p>
            </a>
          </li>
        ))}
      </ul>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Create Note</h2>
            <p id="transition-modal-description">
              Type in the content of your stick note.
            </p>
            <div>
              <Input
                required
                fullWidth
                className={styles.stickyNoteTitleInput}
                type="text"
                value={titleInput}
                placeholder="Enter Title"
                style={{ marginBottom: "10px" }}
                onChange={(e) => setTitleInput(e.target.value)}
              />
            </div>
            <div>
              <Input
                required
                fullWidth
                inputProps={{ maxLength: 25 }}
                className={styles.stickyNoteTitleInput}
                type="text"
                value={descriptionInput}
                placeholder="Enter Description"
                style={{ marginBottom: "10px" }}
                onChange={(e) => setDescriptionInput(e.target.value)}
              />
            </div>
            <Button color="primary" onClick={saveNote}>
              Save
            </Button>
          </div>
        </Fade>
      </Modal>
    </>
  ) : (
    <CircularProgress />
  );
}

export default StickyNotes;
