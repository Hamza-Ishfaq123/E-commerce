import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import useFetchCollection from "../../cutomHooks/useFetchCollection";
import { selectUserId } from "../../redux/slice/authSlice";
import { selectOrderHistory, STORE_ORDERS } from "../../redux/slice/orderSlice";
import styles from "./OrderHistory.module.scss";

const OrderHistory = () => {
  const { data, isLoading } = useFetchCollection("orders");
  const orders = useSelector(selectOrderHistory);
  const userId = useSelector(selectUserId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
  }, [dispatch, data]);

  const handleClick=(id)=>{
    console.log("please click");
    navigate(`/order-details/${id}`);            
  }
  
  const filteredOrders=orders.filter((order)=> order.userId === userId)
  
  return <section>
    <div className={`container ${styles.order}`}>
      <h2>Order History</h2>
      <br />
      <>
        {isLoading && <Loader />}
        <div className={styles.table}>
          {filteredOrders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Date</th>
                  <th>Order Id</th>
                  <th>Order Amount</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => {
                  const { id, orderDate, orderTime, orderAmount, orderStatus } = order;

                  return (
                    <tr key={id} onClick={()=>handleClick(id)}>
                      <td>{index + 1}</td>
                      <td>{orderDate} at {orderTime}</td>
                      <td>{id}</td>
                      <td>{"$"}{orderAmount}</td>
                      <td>
                        <p className={orderStatus !== "Delivered" ? `${styles.pending}` : `${styles.delivered}` }>
                           {orderStatus}
                        </p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </>
    </div>
  </section>
}

export default OrderHistory
