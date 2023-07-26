import React from 'react'
import resetImg from '../../assets/forgot.png'
import styles from './auth.module.scss'
import { Link } from 'react-router-dom'
import Card from '../../components/card/Card'
import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { auth } from '../../firebase/config'
import Loader from '../../components/loader/Loader'
const Reset = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const resetPassword = (e) => {
    e.preventDefault();
    alert(email);
    setIsLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('Check your email for a reset link')
        setIsLoading(false);
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        toast.success(error.message);
        setIsLoading(false);
      });
  }
  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <div className={styles.img}>
          <img src={resetImg} alt="Reset Password" width="400px" />
        </div>
        <Card>
          <div className={styles.form}>
            <h2>Reset Password</h2>
            <form onSubmit={resetPassword}>
              <input
                type="text"
                name="" id=""
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className='--btn --btn-primary --btn-block' type='submit'>Reset Password</button>
              <div className={styles.links}>
                <p>
                  <Link to='./login'>Login</Link>
                </p>
                <p>
                  <Link to='./register'>Register</Link>
                </p>
              </div>
            </form>
          </div>
        </Card>
      </section>
    </>
  )
}

export default Reset
