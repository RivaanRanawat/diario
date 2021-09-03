import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import styles from "./CreateNew.module.css";

function CreateNewChapter() {
  const [isLoading, setIsLoading] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const {slug} = useParams();
  const history = useHistory();
  const {currentUser} = useAuth();

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

  useEffect(() => {
    db.collection("diaries")
      .doc(slug)
      .get()
      .then((snap) => {
        if (currentUser.uid !== snap.data().createdBy) {
          alert("You have no such diary!");
          history.push("/");
        }
      }).catch(err => {
        alert("You have no such diary!")
      });
  }, []);

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
