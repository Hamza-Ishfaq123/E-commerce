import React from 'react'
import styles from './Admin.module.scss'
import Navbar from '../../components/admin/navbar/NavBar'
import { Routes, Route } from 'react-router-dom'
import Home from '../../components/admin/home/Home'
import ViewProducts from '../../components/admin/viewProducts/ViewProducts'
import AddProduct from '../../components/admin/addProduct/AddProduct'
import Order from '../../components/admin/order/Order'
import OrderDetails from '../../components/admin/orderDetails/OrderDetails'

const Admin = () => {
  return <div className={styles.admin}>
    <div className={styles.navbar}>
      <Navbar />
    </div>
    <div className={styles.content}>
      <Routes >
        <Route path="home" element={<Home />} />
        <Route path="all-products" element={<ViewProducts/>} />
        <Route path="add-product/:id" element={<AddProduct/>} />
        <Route path="orders" element={<Order/>} />
        <Route path="order-details/:id" element={<OrderDetails/>} />
      </Routes>
    </div>
  </div>
}

export default Admin
