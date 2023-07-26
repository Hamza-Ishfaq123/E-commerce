import { useDispatch, useSelector } from 'react-redux'
import styles from './ProductFilter.module.scss'
import { selectProducts } from '../../../redux/slice/productSlice'
import { useState } from 'react'
import { FILTER_BY_CATEGORY,FILTER_BY_BRAND } from '../../../redux/slice/filterSlice'
import { useEffect } from 'react'

const ProductFilter = () => {
  const [category, setCategory] = useState("ALL");
  const [brand, setBrand] = useState("ALL");
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category))
  ]
  const allBrands = [
    "All",
    ...new Set(products.map((product) => product.brand))
  ]
  

  useEffect(()=>{
    dispatch(FILTER_BY_BRAND({products,brand}))
  },[dispatch,products,brand]); 

  const filterProducts = (cat) => {
    
    dispatch(FILTER_BY_CATEGORY({ category: cat, products }));
  };

  const clearFilters=()=>{
    console.log("hello");
    setCategory("All");
    setBrand("All");
  }


  return (
    <div className={styles.filter}>
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`${category}` === cat ? `${styles.active}` : null}
              onClick={() => filterProducts(cat)}>
              {cat}
            </button>
          )
        })}
      </div>
      <h4>Brand</h4>
      <div className={styles.brand}>
        <select name="brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
          {allBrands.map((brand,index) => {
            return <option key={index} value={brand} onClick={()=>setBrand(brand)}>{brand}</option>
          })}
        </select>
        
        <button className='--btn --btn-danger' onClick={clearFilters}>Clear filter</button>
      </div>
    </div>
  )
}

export default ProductFilter
