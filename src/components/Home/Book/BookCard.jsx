import React, { useState } from "react";
import { useHistory } from "react-router";
import styles from "./BookCard.module.css";
import LockIcon from "@material-ui/icons/Lock";
import { IconButton } from "@material-ui/core";
import { db } from "../../../services/firebase";

function BookCard({ bookName, date, id, constructorIsLocked }) {
  const history = useHistory();

  async function handleBookClick() {
    const querySnapshot = await db.collection("diaries").doc(id).get();
    if (querySnapshot.data().isLocked) {
      let password = prompt("Please enter your password");
      if (!password) {
        return;
      }
      if (querySnapshot.data().password === password) {
        return history.push(`/chapters/${id}`);
      }
      if (password.trim() !== "") {
        return alert("Incorrect Password!");
      }
    }
    history.push(`/chapters/${id}`);
  }

  async function lockBook() {
    let password = prompt(
      "What do you want as your password? \r\nNote: Password cannot be removed or changed later."
    );
    if (password && password.trim() != "") {
      await db.collection("diaries").doc(id).update({
        isLocked: true,
        password,
      });
    }
  }

  return (
    <div className={styles.book} onClick={handleBookClick}>
      <div className={styles.front}>
        <div className={styles.cover}>
          <div className={styles.textName}>
            <h1
              style={{
                fontSize: 40,
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              {bookName}
            </h1>
          </div>
          <div>
            <p className={styles.author}>{date}</p>
            {!constructorIsLocked ? (
              <IconButton
                color="primary"
                aria-label="Lock Book"
                style={{
                  position: "absolute",
                  top: "480px",
                  left: "140px",
                }}
                onClick={lockBook}
              >
                <LockIcon />
              </IconButton>
            ) : (
              <div></div>
            )}
          </div>
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
