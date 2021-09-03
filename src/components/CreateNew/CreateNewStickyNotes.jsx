import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { db } from "../../services/firebase";
import styles from "./CreateNew.module.css";

function CreateNewStickyNotes() {
  const [isLoading, setIsLoading] = useState(false);
  const [stickyNotesTitle, setStickyNotesTitle] = useState("");
  const { slug } = useParams();
  const history = useHistory();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      await db
        .collection("diaries")
        .doc(slug)
        .collection("entries")
        .doc(stickyNotesTitle)
        .set({
          createdAt: new Date(),
          name: stickyNotesTitle,
          type: "Sticky Notes",
          notes: [],
        });
      setIsLoading(false);
      history.push(`/sticky-notes/${slug}/${stickyNotesTitle}`);
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.headline}>
          <h1>Create New Sticky Notes List.</h1>
        </div>
        <div className={styles.signin}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Title"
              required
              onChange={(e) => setStickyNotesTitle(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.btn}>
            {isLoading ? "Loading..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNewStickyNotes;
