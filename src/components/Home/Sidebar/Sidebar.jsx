import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import CreateIcon from "@material-ui/icons/Create";
import { CloudUpload, DeleteForever } from "@material-ui/icons";
import BookIcon from "@material-ui/icons/Book";
import { useHistory } from "react-router";
import { db, storage } from "../../../services/firebase";
import { CircularProgress } from "@material-ui/core";

function Sidebar({ slug }) {
  const [uploading, setUploading] = useState(false);
  const history = useHistory();

  const createNewChapter = () => history.push(`/create-new-chapter/${slug}`);

  async function deletePhoto() {
    try {
      const querySnapshot = await db.collection("diaries").doc(slug).get();
      const imageUrl = querySnapshot.data().coverImage;
      await storage.refFromURL(imageUrl).delete();
      await db.collection("diaries").doc(slug).update({
        coverImage: "",
      });
      alert("Cover Image has been removed!")
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
      (snapShot) => {
        console.log(snapShot);
      },
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
              <CreateIcon className="icons" />
              <p>Create New Chapter</p>
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
                    <CircularProgress className="icons" />
                    <p>Uploading</p>
                  </>
                ) : (
                  <>
                    <CloudUpload className="icons" />
                    <p>Upload Cover Photo</p>
                  </>
                )}
              </label>
            </a>
          </li>
          <li onClick={deletePhoto}>
            <a>
              <DeleteForever className="icons" />
              <p>Delete Cover Photo</p>
            </a>
          </li>
          <li>
            <a>
              <BookIcon className="icons" />
              <p>Read Diary</p>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
