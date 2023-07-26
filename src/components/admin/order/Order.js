import React, { useEffect } from 'react'
import useFetchCollection from '../../../cutomHooks/useFetchCollection';
import styles from  './Order.module.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectOrderHistory, STORE_ORDERS } from '../../../redux/slice/orderSlice';
import { selectUserId } from '../../../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';
import Loader from "../../loader/Loader";


const Order = () => {
  const { data, isLoading } = useFetchCollection("orders");
  const orders = useSelector(selectOrderHistory);
  const userId = useSelector(selectUserId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(STORE_ORDERS(data));
  }, [dispatch, data]);

  const handleClick = (id) => {
    console.log("please click");
    navigate(`/admin/order-details/${id}`);
  }

  // const filteredOrders = orders.filter((order) => order.userId === userId)

  return <section>
    <div className={`container ${styles.order}`}>
      <h2>All orders</h2>
      <p>Click on an order to change <b>order status</b> </p>
      <br />
      <>
        {isLoading && <Loader />}
        <div className={styles.table}>
          {orders.length === 0 ? (
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
                {orders.map((order, index) => {
                  const { id, orderDate, orderTime, orderAmount, orderStatus } = order;

                  return (
                    <tr key={id} onClick={() => handleClick(id)}>
                      <td>{index + 1}</td>
                      <td>{orderDate} at {orderTime}</td>
                      <td>{id}</td>
                      <td>{"$"}{orderAmount}</td>
                      <td>
                        <p className={orderStatus !== "Delivered" ? `${styles.pending}` : `${styles.delivered}`}>
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

export default Order
