import React, {useState} from 'react'
import { useAuth } from '../../context/AuthContext';
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const { resetPassword } = useAuth();

    async function handleFormSubmit(e) {
        e.preventDefault();
        if(!email){
            return alert("Please enter your email");
        }
        try {
            setIsLoading(true);
            await resetPassword(email);
            alert("Please check your inbox for further instructions");
        } catch(err) {
            setEmail("");
            alert(err.message);
        }
        setIsLoading(false);
    }

    return (
        <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.headline}>
          <h1>Forgot Password</h1>
        </div>
        <div className={styles.signin}>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.btn}>
            {isLoading ? "Loading..." : "Forgot Password"}
          </button>
        </div>
      </form>
    </div>
    )
}

export default ForgotPassword
