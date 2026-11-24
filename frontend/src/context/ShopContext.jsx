
import React, { useState, createContext, useEffect } from "react";
import { API } from "../config";

export const ShopContext = createContext(null);


const ShopContextProvider = (props) => {

    const [cartItem, setCartItem] = useState({});
    const [allproducts, setAllProducts] = useState([])
    useEffect(() => {
        fetch(`${API}/allproductsdata`)
            .then((Response) => Response.json())
            .then((data) => setAllProducts(data))

        if(localStorage.getItem('auth-token')){
            fetch(`${API}/getcart`,{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:""
            }).then((responce)=>responce.json())
              .then((data)=>setCartItem(data))
        }    
    }, [])


    // Increase quantity
    const AddToCart = (id) => {
        setCartItem((prev) => ({...prev,[id]: (prev[id] || 0) + 1}))

        const token =localStorage.getItem('auth-token')
        if(token){
            fetch(`${API}/addtocart`,{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    'auth-token':`${localStorage.getItem(('auth-token'))}`,
                    'Content-type':'application/json',
                },
                body:JSON.stringify({"itemId":id})
            }).then((responce)=>responce.json())
               .then((data)=>console.log(data))
        }
    };

    // Decrease quantity
    const RemoveToCart = (id) => {
        setCartItem((prev) => ({...prev,[id]: Math.max(0, (prev[id] || 0) - 1)}))
    };

    // Remove the entire product
    const DeleteFromCart = (id) => {
        setCartItem((prev) => ({...prev,[id]: 0}));
        const token =localStorage.getItem('auth-token')
        if(token){
            fetch(`${API}/removefromcart`,{
                method:"POST",
                headers:{
                    Accept:"application/form-data",
                    'auth-token':token,
                    'Content-type':'application/json',
                },
                body:JSON.stringify({"itemId":id})
            }).then((responce)=>responce.json())
               .then((data)=>console.log(data))
        }
    };

    const getTotalCartItem = () => {
        let totalItem = 0;

        for (const item in cartItem) {
            totalItem += cartItem[item];
        }

        return totalItem;
    };

    const contextValue = {
        allproducts,
        cartItem,
        AddToCart,
        RemoveToCart,
        DeleteFromCart,
        getTotalCartItem
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
