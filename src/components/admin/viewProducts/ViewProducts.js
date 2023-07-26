import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify';
import styles from './ViewProduct.module.scss'
import { db, storage } from "../../../firebase/config";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import Loader from "../../loader/Loader";
import { async } from '@firebase/util';
import { deleteObject, ref } from 'firebase/storage';
import Notiflix from 'notiflix';
import { useDispatch } from 'react-redux';
import { selectProducts, STORE_PRODUCTS } from '../../../redux/slice/productSlice';
import useFetchCollection from '../../../cutomHooks/useFetchCollection';
import { useSelector } from 'react-redux';
import { FILTER_BY_SEARCH, selectFilteredProducts } from '../../../redux/slice/filterSlice';
import Search from '../../search/Search';
import Pagination from '../../pagination/Pagination';



const ViewProducts = () => {
  const { data, isLoading } = useFetchCollection("products");
  const [search, setSearch] = useState("");
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  const filteredProducts = useSelector(selectFilteredProducts);

 
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const indexOfLastProduct = currentPage * productsPerPage; 
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    dispatch(STORE_PRODUCTS({
      products: data,
    }))
  }, [data]);

  useEffect(() => {
    dispatch(FILTER_BY_SEARCH({ products, search }));
  }, [dispatch, products, search]);


  const confirmDelete = (id, imageURL) => {
    Notiflix.Confirm.show(
      "Delete Product!!!",
      "You are about to delete this product",
      "Delete",
      "Cancel",
      function okCb() {
        deleteProduct(id, imageURL);
      },
      function cancelCb() {
        console.log("Delete Canceled");
      },
      {
        width: "320px",
        borderRadius: "3px",
        titleColor: "orangered",
        okButtonBackground: "orangered",
        cssAnimationStyle: "zoom",
      }
    );
  };

  const deleteProduct = async (id, imageURL) => {
    try {
      deleteDoc(doc(db, "products", id));
      const storageRef = ref(storage, imageURL);
      await deleteObject(storageRef);
      toast.success("product deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.table}>
        <h2>All Product</h2>

        <div className={styles.search}>
          <p>
            <b>{filteredProducts.length}</b> Products found
          </p>
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Image</th>
                <th>Category</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => {
                const { id, name, price, imageURL, category } = product;
                return (

                  <tr key={id}>
                    <td>
                      {index + 1}
                    </td>
                    <td>
                      <img src={imageURL} alt={name} style={{ width: "100px" }} />
                    </td>
                    <td>
                      {name}
                    </td>
                    <td>
                      {category}
                    </td>
                    <td>
                      {`$${price}`}
                    </td>
                    <td className={styles.icons}>
                      <Link to={`/admin/add-product/${id}`}>
                        <FaEdit size={20} color="green" />
                      </Link>
                      &nbsp;
                      <FaTrashAlt onClick={() => confirmDelete(id, imageURL)} size={20} color="green" />
                    </td>
                  </tr>

                )
              })}
            </tbody>
          </table>
        )}
        <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
        totalProducts={filteredProducts.length}
      />
      </div>
    </>
  )
}

export default ViewProducts
