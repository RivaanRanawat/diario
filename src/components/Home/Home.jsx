import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext";
import TextEditor from "./TextEditor/TextEditor";

function Home() {
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  useEffect(() => {
    if (!currentUser) {
      history.push("/signup");
    } else {
      console.log(currentUser.uid);
    }
  }, []);
  return <TextEditor />;
}

export default Home;
