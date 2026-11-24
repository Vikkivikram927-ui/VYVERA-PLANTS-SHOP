
import React, { useState, createContext, useEffect } from "react";

export const ShopContext = createContext(null);


const ShopContextProvider = (props) => {

    const [cartItem, setCartItem] = useState({});
    const [allproducts, setAllProducts] = useState([])
    useEffect(() => {
        fetch('http://localhost:4000/allproductsdata')
            .then((Response) => Response.json())
            .then((data) => setAllProducts(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart',{
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
            fetch('http://localhost:4000/addtocart',{
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
            fetch('http://localhost:4000/removefromcart',{
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

    // const getDefaultCart = () => {
    //     let cart = {};

    //     for (let index = 0; index < allproducts.length; index++) {
    //         cart[allproducts[index].id] = 0;
    //     }

    //     return cart;
    // };

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
