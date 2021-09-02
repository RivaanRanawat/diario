import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import styles from "./BookCard.module.css";
import { db } from "../../../services/firebase";
import { useAuth } from "../../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";

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
          .orderBy("createdAt", "asc")
          .get();
        querySnapshot.forEach((snapshot) => {
          setInfo((arr) => [...arr, snapshot.data()]);
        });
      } catch (err) {
        setIsLoading(false);
        console.error(err.message);
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
      {info.map(function (data) {
        console.log(data.backgroundColor);
        return (
        <BookCard
          bookName={data.name}
          date={data.createdAt.toDate().toLocaleDateString()}
          id={data.diaryId}
          constructorIsLocked={data.isLocked}
          coverImage={!data.coverImage ? "" : data.coverImage}
          color={!data.backgroundColor? "linear-gradient(45deg, #f3f3f3 0%, #fff 100%)": data.backgroundColor}
        />
      )})}
    </div>
  ) : (
    <CircularProgress />
  );
}

export default BookList;
