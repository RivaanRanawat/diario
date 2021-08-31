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

  async function handleLogOut() {
    try {
      await logout();
    } catch (err) {
      alert(err.message);
    }
  }

  const createNewDiary = () => history.push("/create-new-diary");

  return (
    <div>
      <BookList />
      <div id={styles.logOut}>
        <button className={styles.logOutBtn} onClick={handleLogOut}>
          Log Out
        </button>
      </div>
      <div id={styles.mybutton}>
        <button className={styles.createDiary} onClick={createNewDiary}>
          Create New Diary
        </button>
      </div>
    </div>
  );
}

export default Home;
