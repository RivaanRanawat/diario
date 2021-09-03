import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import CreateIcon from "@material-ui/icons/Create";
import {
  CloudUpload,
  Delete,
  DeleteForever,
  LibraryBooks,
  List,
  Notes,
  NotesSharp,
  Palette,
  Refresh,
} from "@material-ui/icons";
import BookIcon from "@material-ui/icons/Book";
import { useHistory } from "react-router";
import { db, storage } from "../../../services/firebase";
import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Sidebar({ slug }) {
  const [uploading, setUploading] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const history = useHistory();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createNewChapter = () => history.push(`/create-new-chapter/${slug}`);

  async function deletePhoto() {
    try {
      const querySnapshot = await db.collection("diaries").doc(slug).get();
      const imageUrl = querySnapshot.data().coverImage;
      await storage.refFromURL(imageUrl).delete();
      await db.collection("diaries").doc(slug).update({
        coverImage: "",
      });
      alert("Cover Image has been removed!");
    } catch (err) {
      alert("You don't have a cover page!");
    }
  }

  function handleInput(e) {
    const image = e.target.files[0];
    if (image == null) return;
    setUploading(true);
    const uploadTask = storage.ref(`/cover-images/${slug}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapShot) => {},
      (err) => {
        setUploading(false);
        alert(err.message);
      },
      () => {
        storage
          .ref("cover-images")
          .child(slug)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            db.collection("diaries")
              .doc(slug)
              .update({
                coverImage: fireBaseUrl,
              })
              .then(() => {
                setUploading(false);
                alert("Your Cover Page has been updated!");
              })
              .catch((err) => {
                setUploading(false);
                alert(err.message);
              });
          });
      }
    );
  }

  async function saveBackgroundColor(paraColor) {
    try {
      await db.collection("diaries").doc(slug).update({
        backgroundColor: paraColor,
      });
      setOpen(false);
      alert("Color of your book has been changed!");
    } catch (err) {
      alert(err.message);
    }
  }

  function handleColorChange() {
    var color1 = document.querySelector(".leftColour");
    setColor(color1.value);
  }

  async function removeDiary() {
    try {
      await db.collection("diaries").doc(slug).delete();
      alert("Your Diary has been deleted!");
      history.push("/");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <a href="/">
          <center>
            <img src="/images/diary.png" alt="Diario" className={styles.logo} />
          </center>
        </a>
      </div>
      <nav>
        <ul>
          <li onClick={createNewChapter}>
            <a>
              <CreateIcon className={styles.icons} />
              <p>Create Chapter</p>
            </a>
          </li>
          <li onClick={() => history.push(`/create-new-todo/${slug}`)}>
            <a>
              <List className={styles.icons} />
              <p>Create To-Do</p>
            </a>
          </li>
          <li onClick={() => history.push(`/create-new-sticky-notes/${slug}`)}>
            <a>
              <LibraryBooks className={styles.icons} />
              <p>Create Sticky Notes</p>
            </a>
          </li>
          <li>
            <a>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                accept="image/png, image/jpeg"
                onInput={(e) => handleInput(e)}
              />
              <label htmlFor="raised-button-file">
                {uploading ? (
                  <>
                    <CircularProgress className={styles.icons} />
                    <p>Uploading</p>
                  </>
                ) : (
                  <>
                    <CloudUpload className={styles.icons} />
                    <p>Upload Cover</p>
                  </>
                )}
              </label>
            </a>
          </li>
          <li onClick={deletePhoto}>
            <a>
              <DeleteForever className={styles.icons} />
              <p>Delete Cover</p>
            </a>
          </li>
          <li onClick={handleOpen}>
            <a>
              <Palette className={styles.icons} />
              <p>Select Colour</p>
            </a>
          </li>
          <li onClick={() => saveBackgroundColor("")}>
            <a>
              <Refresh className={styles.icons} />
              <p>Reset Colour</p>
            </a>
          </li>
          <li onClick={removeDiary}>
            <a>
              <Delete className={styles.icons} />
              <p>Delete Diary</p>
            </a>
          </li>
        </ul>
      </nav>

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
            <h2 id="transition-modal-title">Select Colour</h2>
            <p id="transition-modal-description">
              Select background colour for your diary!
            </p>
            <center>
              <input
                className="leftColour"
                type="color"
                name="color1"
                value={color}
                onInput={handleColorChange}
              />
            </center>
            <Button color="primary" onClick={() => saveBackgroundColor(color)}>
              Save
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default Sidebar;
