import React, { useState } from 'react'
import styles from './Product.module.scss'
import ProductFilter from './productFilter/ProductFilter'
import ProductList from './productList/ProductList'
import useFetchCollection from '../../cutomHooks/useFetchCollection'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useDispatch } from 'react-redux'
import { STORE_PRODUCTS } from '../../redux/slice/productSlice'
import { useEffect } from 'react'
import { selectProducts } from '../../redux/slice/productSlice'
import spinnerImg from '../../assets/spinner.jpg'
import { FaCogs } from 'react-icons/fa'

const Product = () => {

  const { data, isLoading } = useFetchCollection("products");
  const [showFilter,setShowFilter]=useState(false);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(STORE_PRODUCTS({
      products: data,
    }))
  });
  
  const toggleFilter=()=>{
    setShowFilter(!showFilter);
  }

  return (
    <section>
      <div className={`container ${styles.product}`}>
        <aside className={showFilter ? `${styles.filter} ${styles.show}` : `${styles.filter}`}>
           {isLoading ? null : <ProductFilter /> }
          
        </aside>
        <div className={styles.content}>
          {isLoading ?
            (<img src={spinnerImg} alt="Loading..." style={{ width: "50px" }} className="--center-all"></img>) :
            (
              <ProductList products={products} />
            )
          }
          <div className={styles.icon} onClick={toggleFilter}>
            <FaCogs size={20} color="orangered"/>
            <b>{showFilter ? "Hide Filter" : "Show Filter"}</b>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Product
