import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext";
import BookCard from "./BookCard/BookCard";
import TextEditor from "./TextEditor/TextEditor";

function Home() {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  useEffect(() => {
    if (!currentUser) {
      history.push("/signup");
    }
  }, []);
  return <BookCard />;
}

export default Home;
