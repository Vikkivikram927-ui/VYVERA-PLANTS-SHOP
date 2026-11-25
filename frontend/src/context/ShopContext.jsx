import React, { useState, createContext, useEffect } from "react";
import { API } from "../config";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItem, setCartItem] = useState({});
    const [allproducts, setAllProducts] = useState([]);

    // Load products + the logged-in user's saved cart once on mount.
    useEffect(() => {
        fetch(`${API}/allproductsdata`)
            .then((response) => response.json())
            .then((data) => setAllProducts(data));

        const token = localStorage.getItem("auth-token");
        if (token) {
            fetch(`${API}/getcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": token,
                    "Content-Type": "application/json",
                },
                body: "",
            })
                .then((response) => response.json())
                .then((data) => setCartItem(data));
        }
    }, []);

    // Increase quantity (UI + server)
    const AddToCart = (id) => {
        setCartItem((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

        const token = localStorage.getItem("auth-token");
        if (token) {
            fetch(`${API}/addtocart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId: id }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    // Decrease quantity by 1 (UI + server).
    // FIX: this now also calls /removefromcart so the server cart stays in sync.
    const RemoveToCart = (id) => {
        setCartItem((prev) => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) - 1),
        }));

        const token = localStorage.getItem("auth-token");
        if (token) {
            fetch(`${API}/removefromcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId: id }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    // Remove the entire product (set quantity to 0).
    // FIX: this now calls the new /deletefromcart endpoint (sets qty to 0 on the
    // server) instead of /removefromcart (which only decrements by 1).
    const DeleteFromCart = (id) => {
        setCartItem((prev) => ({ ...prev, [id]: 0 }));

        const token = localStorage.getItem("auth-token");
        if (token) {
            fetch(`${API}/deletefromcart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId: id }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    };

    const getTotalCartItem = () => {
        let totalItem = 0;
        for (const item in cartItem) {
            totalItem += cartItem[item];
        }
        return totalItem;
    };

    // Local-only clear. The /orders endpoint already empties the server cart
    // after creating the order, so we just reset the UI here.
    const clearCart = () => {
        const empty = {};
        for (let i = 0; i < 300; i++) empty[i] = 0;
        setCartItem(empty);
    };

    const contextValue = {
        allproducts,
        cartItem,
        AddToCart,
        RemoveToCart,
        DeleteFromCart,
        getTotalCartItem,
        clearCart,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;