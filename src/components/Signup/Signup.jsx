import { useState } from "react";
import styles from "./Signup.module.css";
import {registerWithEmailAndPassword} from "../../services/firebase.js";
import { useHistory } from "react-router";

function Signup() {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const history = useHistory();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    registerWithEmailAndPassword(name, email, password);
  };

  const handleLoginChange = (e) => {
    history.push("/login");
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.headline}>
          <h1>Welcome to Diaro, your Personal Diary.</h1>
        </div>
          <div className={styles.signup}>
            <div className={styles.formGroup}>
              <input type="text" placeholder="Full name" required />
            </div>
            <div className={styles.formGroup}>
              <input type="email" placeholder="Email" required />
            </div>
            <div className={styles.formGroup}>
              <input type="password" placeholder="Password" required />
            </div>
            <button type="submit" className={styles.btn}>
              SIGN UP
            </button>
            <div className={styles.accountExist}>
              Already have an account?{" "}
              <a
                id={styles.login}
                onClick={handleLoginChange}
                style={{ cursor: "pointer" }}
                href=""
              >
                Login
              </a>
            </div>
          </div>
      </form>
    </div>
  );
}

export default Signup;
