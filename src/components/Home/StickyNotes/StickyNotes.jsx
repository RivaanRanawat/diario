import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import styles from "./StickyNotes.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Button, Input } from "@material-ui/core";
import { db } from "../../../services/firebase";
import firebase from "firebase";

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
  const [titleInput, setTitleInput] = useState("");
  const [notes, setNotes] = useState([]);
  const [descriptionInput, setDescriptionInput] = useState("");
  const { diary, name } = useParams();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function saveNote() {
    console.log(titleInput);
    console.log(descriptionInput);
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
          names: firebase.firestore.FieldValue.arrayUnion(data),
        });
      setNotes((prevArr) => [...prevArr, data]);
      setTitleInput("");
      setDescriptionInput("");
      handleClose();
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    db.collection("diaries")
      .doc(diary)
      .collection("entries")
      .doc(name)
      .get()
      .then((snap) => {
        setNotes(snap.data().names);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  return (
    <>
      <button className={styles.stickyButton} onClick={handleOpen}>
        Create Note
      </button>
      <ul className={styles.stickyNotes}>
        {notes.map((note) => (
          <li className={styles.stickNote}>
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
                multiline
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
  );
}

export default StickyNotes;
