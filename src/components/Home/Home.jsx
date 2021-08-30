import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext";

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
  return <div>Welcome to Home Screen</div>;
}

export default Home;
