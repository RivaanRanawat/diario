import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import styles from "./CreateNew.module.css";

function CreateNewChapter() {
  const [isLoading, setIsLoading] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const {slug} = useParams();
  const history = useHistory();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      await db.collection("diaries").doc(slug).collection("entries").doc(chapterName).set({
          "createdAt": new Date(),
          "name": chapterName
      });
      setIsLoading(false);
      history.push(`/text-editor/${slug}/${chapterName}`);
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.headline}>
          <h1>Create New Chapter.</h1>
        </div>
        <div className={styles.signin}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Chapter Name"
              required
              onChange={(e) => setChapterName(e.target.value)}
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

export default CreateNewChapter;
