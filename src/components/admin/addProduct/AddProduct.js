import { useState } from "react";
import styles from "./AddProduct.module.scss"
import React from 'react'
import Card from "../../card/Card";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from "../../../firebase/config";
import { toast } from "react-toastify";
import { addDoc, collection, setDoc, Timestamp,doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loader from "../../loader/Loader";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectProducts } from "../../../redux/slice/productSlice";

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const productEdit = products.find((product) => product.id === id)
  console.log(productEdit);
  
  const initialState = {
    name: " ",
    imageURL: "",
    price: 0,
    category: "",
    brand: "",
    desc: "",
  }
  const [product, setProduct] = useState(()=>{
    const newState=detectForm(id,{...initialState},productEdit);
    return newState;
  })

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function detectForm(id, f1, f2) {
    if (id === "ADD") {
      return f1
    }
    return f2;
  }

  const categories = [
    { id: 1, name: "Laptop" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Fashion" },
    { id: 4, name: "Phone" },
  ];

  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setProduct({ ...product, [name]: value })
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file.name);
    const storageRef = ref(storage, `eshop/${Date.now()} ${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);


    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress)
      },
      (error) => {
        // Handle unsuccessful uploads
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({ ...product, imageURL: downloadURL })
          toast.success("Image uploaded successfully.");
        });
      }
    );
  }



  const addProduct = (e) => {
    e.preventDefault();
    // console.log(product);
    setIsLoading(true);

    try {
      const docRef = addDoc(collection(db, "products"), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt: Timestamp.now().toDate()
      });
      setIsLoading(false);
      setProduct({ ...initialState });
      setUploadProgress(0)
      toast.success("Product added successfully");
      navigate("/admin/all-products");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  const editProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    

    if(product.imageURL !== productEdit.imageURL) {
      const storageRef = ref(storage, productEdit.imageURL);
       deleteObject(storageRef);
    }
    try {
      setDoc(doc(db, "products", id), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        createdAt:productEdit.createdAt, 
        editedAt:Timestamp.now().toDate(),
      });
      setIsLoading(true);
      toast.success("Product Edited successfully");
      navigate("/admin/all-products");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }

  }

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.product}>
        <h2>{detectForm(id, "ADD new product", "edit")}</h2>
        <Card cardClass={styles.card}>
          <form onSubmit={detectForm(id, addProduct, editProduct)}>
            <label>Product Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Product name"
              required
              value={product.name}
              onChange={(e) => handleInputChange(e)}
            />
            <label>Product image:</label>
            <Card cardClass={styles.group}>
              {uploadProgress === 0 ? null : (
                <div className={styles.progress}>
                  <div className={styles["progress-bar"]} style={{ width: `${uploadProgress}%` }}>
                    {uploadProgress < 100 ? `Uploading ${uploadProgress}` : `Upload complete ${uploadProgress}%`}
                  </div>
                </div>
              )};


              <input
                type="file"
                accept="image/*"
                placeholder="Product Image"
                name="image"
                onChange={(e) => handleImageChange(e)}
              />

              {product.imageURL === "" ? null : (<input
                type="text"
                // required
                placeholder="Image URL"
                name="imageURL"
                value={product.imageURL}
                disabled
              />)}

            </Card>

            <label>Product price:</label>
            <input
              type="number"
              placeholder="Product price"
              required
              name="price"
              value={product.price}
              onChange={(e) => handleInputChange(e)}
            />

            <label>Product Category:</label>
            <select
              required
              name="category"
              value={product.category}
              onChange={(e) => handleInputChange(e)}
            >
              <option value="" disabled>
                -- choose product category --
              </option>
              {categories.map((cat) => {
                return (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                );
              })}
            </select>



            <label>Product Company/Brand:</label>
            <input
              type="text"
              placeholder="Product brand"
              required
              name="brand"
              value={product.brand}
              onChange={(e) => handleInputChange(e)}
            />

            <label>Product Description</label>
            <textarea
              name="desc"
              required
              value={product.desc}
              onChange={(e) => handleInputChange(e)}
              cols="30"
              rows="10"
            ></textarea>

            <button type="submit" className="--btn --btn-primary">
              {detectForm(id, "Save Product", "Edit Product")}
            </button>
          </form>
        </Card>
      </div>
    </>
  )
}

export default AddProduct
