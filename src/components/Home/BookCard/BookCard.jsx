import React from "react";
import styles from "./BookCard.module.css";

function BookCard({bookName, usename}) {
  return (
    <div class={styles.container}>
      <div class={styles.book}>
        <div class={styles.front}>
          <div class={styles.cover}>
            <div className={styles.textName}>
              <h1 style={{fontSize: 40}}>Book Name</h1>
            </div>
            <p class={styles.author}>User Name</p>
          </div>
        </div>
        <div class={styles.leftSide}>
          <h2>
            <span>Book Name</span>
            <span>User Name</span>
          </h2>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
