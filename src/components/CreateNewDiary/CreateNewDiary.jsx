import React, { useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import styles from "../ForgotPassword/ForgotPassword.module.css";
import { v4 as uuidv4 } from "uuid";

function CreateNewDiary() {
  const [isLoading, setIsLoading] = useState(false);
  const [diaryName, setDiaryName] = useState("");
  const [firstEntry, setFirstEntry] = useState("");

  const { currentUser } = useAuth();
  const history = useHistory();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const diaryId = uuidv4();
      await db.collection("diaries").doc(diaryId).set({
        name: diaryName,
        createdAt: new Date(),
        isLocked: false,
        createdBy: currentUser.uid,
        diaryId,
      });
      await db.collection("diaries").doc(diaryId).collection("entries").doc(firstEntry).set({
          name: firstEntry,
          createdAt: new Date()
      })
      setIsLoading(false);
      history.push(`/text-editor/${diaryId}`);
    } catch (err) {
      setIsLoading(false);
      alert(err.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.headline}>
          <h1>Create New Diary.</h1>
        </div>
        <div className={styles.signin}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Diary Name"
              required
              onChange={(e) => setDiaryName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="First Chapter"
              required
              onChange={(e) => setFirstEntry(e.target.value)}
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

export default CreateNewDiary;
