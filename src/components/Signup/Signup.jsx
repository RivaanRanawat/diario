import { useState } from "react";
import styles from "./Signup.module.css";
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const { signup } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return alert("Please fill in all the fields.");
    }
    try {
      setIsLoading(true);
      const data = await signup(email, password);
      await db.collection("users").doc(data.user.uid).set({
        email,
        name,
        uid: data.user.uid
      });
      history.push("/");
    } catch (err) {
      alert(err.message);
    }

    setIsLoading(false);
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
            <input
              type="text"
              placeholder="Full name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.btn}>
            {isLoading ? "Loading..." : "SIGN UP"}
          </button>
          <div className={styles.accountExist}>
            Already have an account?{" "}
            <a
              id={styles.login}
              onClick={handleLoginChange}
              style={{ cursor: "pointer" }}
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
