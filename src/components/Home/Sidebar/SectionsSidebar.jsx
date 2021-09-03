import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { useHistory } from "react-router";
import { db } from "../../../services/firebase";

function SectionsSidebar({ diary }) {
  const [title, setTitle] = useState([]);
  const [type, setType] = useState([]);
  const history = useHistory();

  function createNewChapter(typePar, name) {
    if(!typePar) {
        history.push(`/text-editor/${diary}/${name}`);
        window.location.reload();
      } else if(typePar === "To-Do"){
        history.push(`/todo-list/${diary}/${name}`);
        window.location.reload();
      } else {
        history.push(`/sticky-notes/${diary}/${name}`);
        window.location.reload();
      }
  }

  useEffect(() => {
    db.collection("diaries")
      .doc(diary)
      .collection("entries")
      .orderBy("createdAt", "asc")
      .get()
      .then((snapshots) => {
        snapshots.forEach((querySnapshot) => {
          setTitle((prevArr) => [...prevArr, querySnapshot.data().name]);
          setType((prev) => [...prev, querySnapshot.data().type]);
        });
      }).catch((err) => {
          alert(err.message);
      });
  }, []);

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
          {title.map((t, index) => (
            <li onClick={() => createNewChapter(type[index],t)} key={index}>
              <a>
                <h1 className={styles.icons}>{index + 1}</h1>
                <p>{t}</p>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default SectionsSidebar;
