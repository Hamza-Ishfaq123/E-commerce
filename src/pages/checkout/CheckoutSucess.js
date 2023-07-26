import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutSucess = () => {
  return (
    <section>
      <div className="container">
        <h2>Checkout success</h2>
        <p>Thank you for purchasing</p>
        <br />

        <button className="--btn --btn-primary"><Link to="/order-history">View Order Status</Link></button>

      </div> 
    </section>
  )
}

export default CheckoutSucess
