import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { API } from "../../config";
import "./CheckoutFlow.css";

// Keep these the same as the cart page and the backend
const FREE_SHIPPING_MIN = 599;
const DELIVERY_CHARGE = 50;
const DISCOUNT_PERCENT = 10;

const emptyAddress = {
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
};

function Field({ label, name, value, onChange, error, ...rest }) {
    return (
        <div className="field">
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} value={value} onChange={onChange} {...rest} />
            {error && <span className="field-error">{error}</span>}
        </div>
    );
}

function CheckoutPage() {
    const { allproducts, cartItem, clearCart } = useContext(ShopContext);
    const navigate = useNavigate();
    const orderPlaced = useRef(false);
    const token = localStorage.getItem("auth-token"); // CHANGE if you store it under another name

    const [address, setAddress] = useState(emptyAddress);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const cartProducts = allproducts.filter((p) => (cartItem[p.id] || 0) > 0);

    const subtotal = cartProducts.reduce((t, p) => t + p.price * cartItem[p.id], 0);
    const discount = subtotal * (DISCOUNT_PERCENT / 100);
    const deliveryCharge = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : DELIVERY_CHARGE;
    const total = subtotal - discount + deliveryCharge;

    // Must be logged in and must have items
    useEffect(() => {
        if (orderPlaced.current || allproducts.length === 0) return;
        if (!token) navigate("/signin");
        else if (cartProducts.length === 0) navigate("/cartpage");
    }, [token, allproducts.length, cartProducts.length, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const found = {};
        if (!address.fullName.trim()) found.fullName = "Enter your full name";
        if (!/^\d{10}$/.test(address.phone)) found.phone = "Enter a 10 digit phone number";
        if (!address.street.trim()) found.street = "Enter your address";
        if (!address.city.trim()) found.city = "Enter your city";
        if (!address.state.trim()) found.state = "Enter your state";
        if (!/^\d{6}$/.test(address.pincode)) found.pincode = "Enter a 6 digit pincode";
        return found;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        const found = validate();
        if (Object.keys(found).length > 0) {
            setErrors(found);
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`${API}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "auth-token": token },
                body: JSON.stringify({ address, paymentMethod }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Could not place the order");
            }

            orderPlaced.current = true; // stops the "empty cart" redirect above
            clearCart();
            navigate(`/order-success/${data.orderId}`);
        } catch (err) {
            setServerError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (allproducts.length === 0) return <p className="flow-message">Loading...</p>;

    return (
        <div className="checkout-page">
            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
                <h2>Delivery address</h2>

                <Field label="Full name" name="fullName" value={address.fullName} onChange={handleChange} error={errors.fullName} autoComplete="name" />
                <Field label="Phone number" name="phone" value={address.phone} onChange={handleChange} error={errors.phone} inputMode="numeric" maxLength={10} autoComplete="tel" />
                <Field label="Address (house no, street, area)" name="street" value={address.street} onChange={handleChange} error={errors.street} autoComplete="street-address" />

                <div className="field-row">
                    <Field label="City" name="city" value={address.city} onChange={handleChange} error={errors.city} autoComplete="address-level2" />
                    <Field label="State" name="state" value={address.state} onChange={handleChange} error={errors.state} autoComplete="address-level1" />
                </div>

                <Field label="Pincode" name="pincode" value={address.pincode} onChange={handleChange} error={errors.pincode} inputMode="numeric" maxLength={6} autoComplete="postal-code" />

                <h2>Payment method</h2>
                <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                        <span>Cash on delivery</span>
                    </label>
                    <label className={`payment-option ${paymentMethod === "online" ? "selected" : ""}`}>
                        <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                        <span>Pay online (demo)</span>
                    </label>
                </div>

                {serverError && <p className="server-error">{serverError}</p>}

                <button type="submit" className="place-order-btn" disabled={submitting}>
                    {submitting ? "Placing order..." : `Place order · ₹${total.toFixed(2)}`}
                </button>
            </form>

            <aside className="checkout-summary">
                <h2>Order summary</h2>

                {cartProducts.map((p) => (
                    <div className="summary-item" key={p.id}>
                        <img src={p.image} alt={p.name} />
                        <div>
                            <p className="summary-item-name">{p.name}</p>
                            <p className="summary-item-qty">Qty {cartItem[p.id]}</p>
                        </div>
                        <span>₹{(p.price * cartItem[p.id]).toFixed(2)}</span>
                    </div>
                ))}

                <hr />
                <div className="summary-line"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="summary-line"><span>Discount ({DISCOUNT_PERCENT}%)</span><span className="green">-₹{discount.toFixed(2)}</span></div>
                <div className="summary-line"><span>Delivery</span><span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}</span></div>
                <hr />
                <div className="summary-line total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </aside>
        </div>
    );
}

export default CheckoutPage;