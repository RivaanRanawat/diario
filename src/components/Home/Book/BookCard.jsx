import React from "react";
import { useHistory } from "react-router";
import styles from "./BookCard.module.css";

function BookCard({ bookName, date, id }) {
  const history = useHistory();
  
  function handleBookClick() {
    history.push(`/chapters/${id}`);
  }
  
  return (
    <div className={styles.book} onClick={handleBookClick}>
      <div className={styles.front}>
        <div className={styles.cover}>
          <div className={styles.textName}>
            <h1 style={{ fontSize: 40 }}>{bookName}</h1>
          </div>
          <p className={styles.author}>{date}</p>
        </div>
      </div>
      <div className={styles.leftSide}>
        <h2>
          <span>{bookName}</span>
          <span>{date}</span>
        </h2>
      </div>
    </div>
  );
}

export default BookCard;
