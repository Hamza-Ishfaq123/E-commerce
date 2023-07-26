import React from 'react'
import styles from './Chart.module.scss'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from '../card/Card';
import { selectOrderHistory } from '../../redux/slice/orderSlice';
import { useSelector } from 'react-redux';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {

  responsive: true,
  plugins: {
    legend: {
      position: 'top', 
    },
    title: {
      display: false,
      text: 'Chart.js Bar Chart',
    },
  },
};





//component
const Chart = () => {
  const orders=useSelector(selectOrderHistory);
  
  const array=[];
  orders.map((item)=>{
    const {orderStatus}=item;
    array.push(orderStatus);
  });
  console.log(array);
  //getting order status count
  const getCount=(arr,value)=>{
     return arr.filter((n)=>n===value).length;
  };

   
   
  const placed=getCount(array,"Order Placed...");
  const processing=getCount(array,"Processing...");
  const shipped=getCount(array,"Shipped...");
  const delivered=getCount(array,"Delivered...");

  const data = {
    labels:["Placed Orders","Processing","Shipped","Delivered"],
    datasets: [
      {
        label: 'Orders count',
        data:[placed,processing,shipped,delivered],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
     
    ],
  };

  return (
    <div className={styles.chart}>
      <Card cardClass={styles.card}>
          <h3>Orders chart</h3>
          <Bar options={options} data={data} />
      </Card>
    </div>
  )
}

export default Chart
