import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext";
import BookList from "./Book/BookList";
import styles from "./Home.module.css";

function Home() {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  useEffect(() => {
    if (!currentUser) {
      history.push("/signup");
    }
  }, []);
  return (
    <div>
    <BookList />
      <div id={styles.logOut}>
        <button class={styles.logOutBtn}>Log Out</button>
      </div>
      <div id={styles.mybutton}>
        <button class={styles.createDiary}>Create New Diary</button>
      </div>
    </div>
  );
}

export default Home;
