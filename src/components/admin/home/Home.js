import React, { useState } from 'react'
import InfoBox from '../../infoBox/InfoBox'
import styles from './Home.module.scss'
import { AiFillDollarCircle } from 'react-icons/ai'
import {BsCart4} from 'react-icons/bs'
import {FaCartArrowDown} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import productSlice, {selectProducts, STORE_PRODUCTS} from '../../../redux/slice/productSlice'
import {selectOrderHistory,selectTotalOrderAmount,STORE_ORDERS,CALCULATE_ORDER_AMOUNT} from '../../../redux/slice/orderSlice'
import { useEffect } from 'react'
import useFetchCollection from '../../../cutomHooks/useFetchCollection'
import Chart from '../../chart/Chart'

//icons
const earning = <AiFillDollarCircle size={30} color={'#b624ff'} />
const product=  <BsCart4 size={30}  color="#1f93ff" /> 
const order=   <FaCartArrowDown size={30} color="orangered" />


const Home = () => {
  const dispatch=useDispatch();


  const products=useSelector(selectProducts);
  const orders=useSelector(selectOrderHistory);
  const fbProducts=useFetchCollection("products")
  const {data}=useFetchCollection("orders");
  const totalOrderAmount=useSelector(selectTotalOrderAmount);
  
  useEffect(()=>{
       dispatch(STORE_PRODUCTS({
        products:fbProducts.data,
       }));
       dispatch(STORE_ORDERS(data));
       dispatch(CALCULATE_ORDER_AMOUNT());
  },[dispatch,data,fbProducts])
  return (
    <div className={styles.home}> 
      <h2>Admin Home</h2>
      <div className={styles["info-box"]}>
        <InfoBox
          cardClass={`${styles.card} ${styles.card1}`}
          title={"Earnings"}
          count={`$${totalOrderAmount}`}
          icon={earning}
        />
        <InfoBox
          cardClass={`${styles.card} ${styles.card2}`}
          title={"Products"}
          count={products.length}
          icon={product}
        />
        <InfoBox
          cardClass={`${styles.card} ${styles.card1}`}
          title={"Orders"}
          count={orders.length}
          icon={order}
        />

      </div>

      <div>
        <Chart/>
      </div>
    </div>
  )
}

export default Home
