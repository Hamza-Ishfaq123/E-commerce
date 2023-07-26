import React from 'react'
import { useSelector } from 'react-redux'
import { selectCartItems, selectCartTotalAmount, selectCartTotalQuantity } from '../../redux/slice/cartSlice';
import { Link } from 'react-router-dom';
import styles from './CheckoutSummary.module.scss'
import Card from '../card/Card';
const CheckoutSummary = () => {
    const cartItems = useSelector(selectCartItems);
    const cartTotalQuantity = useSelector(selectCartTotalQuantity);
    const cartTotalAmount=useSelector(selectCartTotalAmount);
    return (
        <div>
            <h3>Checkout Summary</h3>
            <div>
                {cartItems.length === 0 ? (
                    <>
                        <p>No Items in your cart</p>
                        <button className='--btn'>
                            <Link to="/#products">Back to shopping</Link>
                        </button>
                    </>
                ) : (
                    <div>
                        <p>
                            <b>
                                  {`Cart Items: ${cartTotalQuantity}`}
                            </b>
                        </p>
                        <div className={styles.text}>
                            <h4>Subtotal:</h4>
                            <h3>{cartTotalAmount}</h3>
                        </div>
                        {cartItems.map((item,index)=>{
                            const {name,id,price,cartQuantity}=item;

                            return (
                                <Card  key={id} cardClass={styles.card}>
                                     <h4>Product : {name}</h4>
                                     <p>Quantity : {cartQuantity}</p>
                                     <p>unit price : ${price}</p>
                                     <p>Total price : ${price * cartQuantity}</p>
                                </Card> 
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CheckoutSummary
