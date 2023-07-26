import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Cart.module.scss'
import { CLEAR_CART, selectCartItems, selectCartTotalAmount, selectCartTotalQuantity } from '../../redux/slice/cartSlice'
import { FaTrashAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'
import { ADD_TO_CART, DECREASE_CART, REMOVE_FROM_CART, CALCULATE_SUBTOTAL, CALCULATE_TOTAL_QUANTITY } from '../../redux/slice/cartSlice'
import { useEffect } from 'react'
import { SAVE_URL } from '../../redux/slice/cartSlice'
import { selectIsLoggedIn } from '../../redux/slice/authSlice'


const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotalAmount = useSelector(selectCartTotalAmount);
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(CALCULATE_SUBTOTAL());
    dispatch(CALCULATE_TOTAL_QUANTITY());
    dispatch(SAVE_URL(url));
  }, [dispatch, cartItems])

  const increaseCart = (cartItem) => {
    dispatch(ADD_TO_CART(cartItem));
  }
  const decreaseCart = (cartItem) => {
    dispatch(DECREASE_CART(cartItem));
  }
  const removeFromCart = (cartItem) => {
    dispatch(REMOVE_FROM_CART(cartItem));
  }
  const clearCart = () => {
    dispatch(CLEAR_CART());
  }
  const url = window.location.href;
  const checkout = () => {
    if (isLoggedIn) {
      navigate('/checkout-details')
    } else {
      dispatch(SAVE_URL(url));
      navigate('/login');
    }
  };

  return <section>


    <div className={`container ${styles.table}`}>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <>
          <p>Your cart is currently empty</p>
          <div>
            <Link to="/#products">&larr;Continue shopping</Link>
          </div>
        </>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Number</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((cartItem, index) => {
                const { id, name, price, imageURL, cartQuantity } = cartItem;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <p><b>{name}</b></p>
                      <img src={imageURL} alt={name} style={{ width: "150px" }} />
                    </td>
                    <td>{price}</td>
                    <td>
                      <div className={styles.count}>
                        <button className='--btn' onClick={() => decreaseCart(cartItem)}>-</button>
                        <p>
                          <b>{cartQuantity}</b>
                        </p>
                        <button className='--btn' onClick={() => increaseCart(cartItem)}>+</button>
                      </div>
                    </td>
                    <td>
                      {(price * cartQuantity).toFixed(2)}
                    </td>
                    <td className={styles.icons}>
                      <FaTrashAlt size={19} color="red" onClick={() => removeFromCart(cartItem)} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className={styles.summary}>
            <button className="--btn --btn-danger" onClick={clearCart}>Clear Cart</button>
            <div className={styles.checkout}>
              <div>
                <Link to="/#products">&larr; Continue shopping</Link>
              </div>
              <br />
              <Card cardClass={styles.card}>
                <p>
                  <b> {`Cart item(s): ${cartTotalQuantity}`}</b>
                </p>
                <div className={styles.text}>
                  <h4>Subtotal:</h4>
                  <h3>{`$${cartTotalAmount.toFixed(2)}`}</h3>
                </div>
                <p>Tax an shipping calculated at checkout</p>
                <button className="--btn --btn-primary --btn-block" onClick={checkout}>
                  Checkout
                </button>
              </Card>
            </div>
          </div>
        </>
      )}

    </div>
  </section>

}

export default Cart
