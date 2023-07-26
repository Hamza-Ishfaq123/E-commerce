import React, { useEffect, useState } from "react";
import styles from './CheckoutForm.module.scss'
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import CheckoutSummary from "../checkoutSummary/CheckoutSummary";
import Card from "../card/Card";
import spinnerImg from '../../assets/spinner.jpg'
import { toast } from "react-toastify";
import { useSelector, UseSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { selectEmail, selectUserId } from "../../redux/slice/authSlice";
import { selectCartItems, selectCartTotalAmount } from "../../redux/slice/cartSlice";
import { selectShippingAddress } from "../../redux/slice/checkoutSlice";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { CLEAR_CART } from "../../redux/slice/cartSlice";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
    const [message, setMessage] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate=useNavigate();
    const userId = useSelector(selectUserId);
    const userEmail = useSelector(selectEmail);
    const cartItems = useSelector(selectCartItems);
    const cartTotalAmount = useSelector(selectCartTotalAmount);
    const shippingAddress = useSelector(selectShippingAddress);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }


    }, [stripe]);

    const saveOrder = () => {
        const today = new Date();
        const date = today.toDateString();
        const time = today.toLocaleTimeString();

        const orderConfig = {
            userId,
            userEmail,
            orderDate: date,
            orderTime: time,
            orderAmount: cartTotalAmount,
            orderStatus: "order Placed...",
            cartItems,
            shippingAddress,
            createdAt: Timestamp.now().toDate(),
        };

        try {
            addDoc(collection(db, "orders"), orderConfig);
            dispatch(CLEAR_CART());
            navigate('/checkout-success');
            toast.success("order saved");
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const confirmPayment = await stripe
            .confirmPayment({
                elements,
                confirmParams: {
                    // Make sure to change this to your payment completion page
                    return_url: "http://localhost:3000/checkout-success",
                },
                redirect: "if_required",
            })
            .then((result) => {
                //ok = payment intent
                //bad = error
                if (result.error) {
                    toast.error(result.error.message);
                    setMessage(result.error.message);
                    return;
                }
                if (result.paymentIntent) {
                    if (result.paymentIntent.status === "succeeded") {
                        setIsLoading(false);
                        toast.success("payment successful");
                        saveOrder();
                    }
                }
            })
        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <section>
            <div className={`container ${styles.checkout}`}>
                <h2>Checkout</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Card cardClass={styles.card}>
                            <CheckoutSummary />
                        </Card>
                    </div>

                    <div>
                        <Card cardClass={`${styles.card} ${styles.pay}`}>
                            <h3>Stripe payment checkout</h3>
                            <PaymentElement id={styles["payment-element"]} options={paymentElementOptions} />
                            <button disabled={isLoading || !stripe || !elements} id="submit" className={styles.button}>
                                <span id="button-text">
                                    {isLoading ? (<img src={spinnerImg} alt="loading..." style={{ width: "20px" }} />) : "Pay now"}
                                </span>
                            </button>
                            {/* Show any error or success messages */}
                            {message && <div id={styles["payment-message"]}>{message}</div>}
                        </Card>
                    </div>
                </form>

            </div>
        </section>
    );
}

export default CheckoutForm



{/* <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement
                id="link-authentication-element"
                onChange={(e) => setEmail(e.target.value)}
            />
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
// { message && <div id="payment-message">{message}</div> }
        // </form> */}