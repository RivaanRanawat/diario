import { useState } from "react";
import styles from "./Login.module.css";
import {signInWithEmailAndPassword} from "../../services/firebase.js";
import { useHistory } from "react-router";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const history = useHistory();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password) {
      return alert("Please enter email and password.");
    }
    signInWithEmailAndPassword(email, password);
  };

  const handleLoginChange = (e) => {
    history.push("/signup");
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.headline}>
          <h1>Welcome to Diaro, your Personal Diary.</h1>
        </div>
          <div className={styles.signin}>
            <div className={styles.formGroup}>
              <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className={styles.formGroup}>
              <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className={styles.forgetPassword}>
              <a>Forgot password?</a>
            </div>
            <button type="submit" className={styles.btn}>
              LOGIN
            </button>
            <div className={styles.accountExist}>
              Create New account?{" "}
              <a
                id={styles.signup}
                onClick={handleLoginChange}
                style={{ cursor: "pointer" }}
              >
                Signup
              </a>
            </div>
          </div>
      </form>
    </div>
  );
}

export default Login;