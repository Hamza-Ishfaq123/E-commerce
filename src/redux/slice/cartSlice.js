import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
    previousURL:"",
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        ADD_TO_CART(state, action) {
            console.log(action.payload);
            const productIndex = state.cartItems.findIndex((item) => item.id === action.payload.id)

            if (productIndex >= 0) {
                //item that already exits in cart
                //item is already added just increase the quantity value
                state.cartItems[productIndex].cartQuantity += 1;
                toast.info(`${action.payload.name} increased by one`, { position: "top-left" });
            } else {
                // item that is not present in cart
                // add that new item into cart
                const tempProduct = { ...action.payload, cartQuantity: 1, };
                state.cartItems.push(tempProduct);
                toast.success(`${action.payload.name} Product added to the cart`, { position: "top-left" });
            }
            //save cart to local storage
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        DECREASE_CART(state, action) {
            const productIndex = state.cartItems.findIndex((item) => item.id === action.payload.id)
            if (state.cartItems[productIndex].cartQuantity > 1) {
                state.cartItems[productIndex].cartQuantity -= 1;
                toast.info(`${action.payload.name} decreased by one`, { position: "top-left" });
            } else if (state.cartItems[productIndex].cartQuantity === 1) {
                const newCartItem = state.cartItems.filter((cartItem) => cartItem.id !== action.payload.id)
                state.cartItems = newCartItem;
                toast.success(`${action.payload.name} deleted from your cart`, { position: "top-left" });
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        REMOVE_FROM_CART(state, action) {
            const newCartItem = state.cartItems.filter((cartItem) => cartItem.id !== action.payload.id)
            state.cartItems = newCartItem;
            toast.success(`${action.payload.name} deleted from your cart`, { position: "top-left" });
        },
        CLEAR_CART(state) {
            console.log("clear");
            state.cartItems = [];
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            toast.success(`cart is clear`, { position: "top-left" });
        },
        CALCULATE_SUBTOTAL(state){
            if (state.cartItems.length > 0) {
                const array = [];
                state.cartItems.map((cartItem) => {
                    const { price, cartQuantity } = cartItem;
                    const cartItemAmount = price * cartQuantity;
                    return array.push(cartItemAmount);
                })
                const totalAmount = array.reduce((total, item) => {
                    return total + item;
                })
                state.cartTotalAmount = totalAmount;
            }
        },

        CALCULATE_TOTAL_QUANTITY(state, action) {

            if (state.cartItems.length > 0) {
                console.log("hello world");
                const array = [];
                state.cartItems.map((cartItem) => {
                    const { cartQuantity } = cartItem;
                    const cartItemQuantity = cartQuantity;
                    return array.push(cartItemQuantity);
                })
                const totalQuantity = array.reduce((total, item) => {
                    return total + item;
                })
                state.cartTotalQuantity = totalQuantity;
            }
        },
        SAVE_URL(state,action){
            state.previousURL=action.payload;
        }

    }
});

export const { ADD_TO_CART, DECREASE_CART, REMOVE_FROM_CART, CLEAR_CART, CALCULATE_SUBTOTAL, CALCULATE_TOTAL_QUANTITY,SAVE_URL} = cartSlice.actions;
export const selectCartItems = (state) => state.cart.cartItems
export const selectCartTotalQuantity = (state) => state.cart.cartTotalQuantity;
export const selectCartTotalAmount = (state) => state.cart.cartTotalAmount;
export const selectPreviousURL=(state)=> state.cart.previousURL;

export default cartSlice.reducer;