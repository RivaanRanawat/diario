import React from "react";
import NavBar from "../NavBar/NavBar";
import BookCard from "./BookCard";
import styles from "./BookCard.module.css";

function BookList() {
  return (
    <div class={styles.container} style={{ display: "flex", flexWrap: "wrap" }}>
      <BookCard bookName={"Rivaan Notes"} date={"22/07/21"} />
    </div>
  );
}

export default BookList;
