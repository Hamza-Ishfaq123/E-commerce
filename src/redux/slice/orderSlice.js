import { createSlice } from "@reduxjs/toolkit";

const initialState={
    orderHistory:[],  
    totalOrderAmount:null,
};

const orderSlice=createSlice({
    name:"orders",
    initialState,
    reducers:{
    STORE_ORDERS(state,action){
        console.log(action.payload);
        state.orderHistory=action.payload; 
    },
    CALCULATE_ORDER_AMOUNT(state,action){
        if (state.orderHistory.length > 0) {
            const array = [];
            state.orderHistory.map((item) => {
                const { orderAmount} = item;
                return array.push(orderAmount);
            })
            const totalAmount = array.reduce((total, item) => {
                return total + item;
            })
            state.totalOrderAmount = totalAmount;
        }
    }
    },
});

export  const  {STORE_ORDERS,CALCULATE_ORDER_AMOUNT}=orderSlice.actions;
export  const  selectOrderHistory=(state)=>state.orders.orderHistory;
export  const  selectTotalOrderAmount=(state)=>state.orders.totalOrderAmount;

export default  orderSlice.reducer;