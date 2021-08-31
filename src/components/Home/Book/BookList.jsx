import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import styles from "./BookCard.module.css";
import { db } from "../../../services/firebase";
import { useAuth } from "../../../context/AuthContext";

function BookList() {
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchUserDiaries() {
      try {
        setIsLoading(true);
        const querySnapshot = await db
          .collection("diaries")
          .where("createdBy", "==", currentUser.uid)
          .get();
        querySnapshot.forEach((snapshot) => {
          setInfo((arr) => [...arr, snapshot.data()]);
        });
      } catch (err) {
        setIsLoading(false);
        alert(err.message); //
      }
    }
    fetchUserDiaries().then(() => {
      setIsLoading(false);
      console.log(info); //
    });
  }, []);

  return !isLoading && info !== [] ? (
    <div class={styles.container} style={{ display: "flex", flexWrap: "wrap" }}>
      {info.map((data) => (
        <BookCard
          bookName={data.name}
          date={data.createdAt.toDate().toLocaleDateString()}
          id={data.diaryId}
        />
      ))}
    </div>
  ) : (
    <div>Loading..</div>
  );
}

export default BookList;
