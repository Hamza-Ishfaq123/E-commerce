import React from 'react'
import styles from './auth.module.scss'
import loginImg from '../../assets/login.png'
import { Link } from 'react-router-dom'
import { FaGoogle } from 'react-icons/fa'
import Card from '../../components/card/Card'
import { useState } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider,signInWithPopup } from "firebase/auth"
import { auth } from '../../firebase/config'
import { toast, ToastContainer } from 'react-toastify'
import Loader from '../../components/loader/Loader'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, UseSelector } from 'react-redux/es/hooks/useSelector'
import { selectPreviousURL } from '../../redux/slice/cartSlice'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const previousURL=useSelector(selectPreviousURL);
    const navigate = useNavigate();

    const redirectUser=()=>{
        console.log(previousURL);
        if(previousURL.includes("cart")){
            return navigate('/cart')
        }else{
            return navigate('/')
        }
    }
    const loginUser = (e) => {
        e.preventDefault();
        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                // const user = userCredential.user;
                setIsLoading(false);
                toast.success("login successful");
                redirectUser();
            })
            .catch((error) => {
                // const errorCode = error.code;
                // const errorMessage = error.message;
                setIsLoading(false);
                toast.error(error.message);

            });
    }

    const provider = new GoogleAuthProvider();
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // const user = result.user;
                toast.success('Login successfully')
                redirectUser();
            }).catch((error) => {
                toast.error(error.message);
            });
    }

    return (
        <>
            {isLoading && <Loader />}
            <ToastContainer />
            <section className={`container ${styles.auth}`}>
                <div className={styles.img}>
                    <img src={loginImg} alt="login" width="400px" />
                </div>
                <Card>
                    <div className={styles.form}>
                        <h2>Login</h2>
                        <form onSubmit={loginUser}>
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
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                            <button className='--btn --btn-primary --btn-block'>Login</button>
                            <div className={styles.links}>
                                <Link to='/reset'>Reset password</Link>
                            </div>
                            <p>--or--</p>
                        </form>
                        <button type='submit' className='--btn --btn-danger --btn-block' onClick={signInWithGoogle}><FaGoogle color='#fff' />Login With Google</button>
                        <span className={styles.register}>
                            <p>Don't have an account</p>
                            <Link to="/Register">Register</Link>
                        </span>
                    </div>
                </Card>
            </section>
        </>
    )
}

export default Login
