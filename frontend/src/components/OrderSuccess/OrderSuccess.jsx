import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../../config";
import "../CheckoutPage/CheckoutFlow.css";

function OrderSuccess() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("auth-token"); // CHANGE if needed
        fetch(`${API}/orders/${id}`, { headers: { "auth-token": token || "" } })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) throw new Error(data.message || "Order not found");
                setOrder(data.order);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="flow-message">Loading your order...</p>;
    if (error) {
        return (
            <div className="flow-message">
                <p>{error}</p>
                <Link to="/" className="flow-btn secondary">Go to home</Link>
            </div>
        );
    }

    const { address } = order;

    return (
        <div className="success-page">
            <div className="success-icon">✓</div>
            <h1>Order confirmed!</h1>
            <p className="success-sub">
                Thank you for shopping with Vyvera. Your order <strong>#{order._id.slice(-8).toUpperCase()}</strong> has been placed.
            </p>

            <div className="success-card">
                <h3>Items</h3>
                {order.items.map((item) => (
                    <div className="summary-item" key={item.productId}>
                        <img src={item.image} alt={item.name} />
                        <div>
                            <p className="summary-item-name">{item.name}</p>
                            <p className="summary-item-qty">Qty {item.quantity}</p>
                        </div>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <hr />
                <div className="summary-line total"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
            </div>

            <div className="success-grid">
                <div className="success-card">
                    <h3>Delivering to</h3>
                    <p>{address.fullName}</p>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>Phone: {address.phone}</p>
                </div>
                <div className="success-card">
                    <h3>Payment</h3>
                    <p>{order.paymentMethod === "cod" ? "Cash on delivery" : "Paid online (demo)"}</p>
                    <p>Status: <strong>{order.paymentStatus === "paid" ? "Paid" : "Pay on delivery"}</strong></p>
                </div>
            </div>

            <div className="success-actions">
                <Link to="/my-orders" className="flow-btn">View my orders</Link>
                <Link to="/plants" className="flow-btn secondary">Continue shopping</Link>
            </div>
        </div>
    );
}

export default OrderSuccess;