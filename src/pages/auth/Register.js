import React, { useState } from 'react'
import styles from './auth.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import registerImg from '../../assets/register.png'
import Card from '../../components/card/Card'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'
import Loader from '../../components/loader/Loader'
import { toast } from 'react-toastify'
//component
const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cPassword, setCPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const registerUser = (e) => {
        e.preventDefault();
        if (password !== cPassword) {
            toast.error("Password do not match");
        }
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
                setIsLoading(false);
                toast.success("Registration successful")
                navigate("/login");
                // ...
            })
            .catch((error) => {
                // const errorCode = error.code;
                // const errorMessage = error.message;
                setIsLoading(false);
                toast.error(error.message);
            });

    }
    return (
        <>
            {isLoading && <Loader />}
            <section className={`container ${styles.auth}`}>
                <Card>
                    <div className={styles.form}>
                        <h2>Register</h2>
                        <form onSubmit={registerUser}>
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                            <input
                                type="password"
                                name=""
                                id=""
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} required />
                            <input
                                type="password"
                                name=""
                                id=""
                                placeholder='Confirm Password'
                                value={cPassword}
                                onChange={(e) => setCPassword(e.target.value)} required />
                            <button
                                className='--btn --btn-primary --btn-block'
                                type="submit"
                            >
                                Register
                            </button>

                        </form>
                        <span className={styles.register}>
                            <p>Already have an account?</p>
                            <Link to="/login">Login</Link>
                        </span>
                    </div>
                </Card>
                <div className={styles.img}>
                    <img src={registerImg} alt="Register" width="400px" />
                </div>
            </section>
        </>
    )
}

export default Register
