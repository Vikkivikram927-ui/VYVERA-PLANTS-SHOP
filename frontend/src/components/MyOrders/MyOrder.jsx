import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../config";
import "../CheckoutPage/CheckoutFlow.css";

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("auth-token"); // CHANGE if needed
        if (!token) {
            navigate("/signin");
            return;
        }
        fetch(`${API}/orders/my`, { headers: { "auth-token": token } })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) throw new Error(data.message || "Could not load orders");
                setOrders(data.orders);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return <p className="flow-message">Loading your orders...</p>;
    if (error) return <p className="flow-message">{error}</p>;

    return (
        <div className="orders-page">
            <h1>My orders</h1>

            {orders.length === 0 ? (
                <div className="flow-message">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/plants" className="flow-btn">Start shopping</Link>
                </div>
            ) : (
                orders.map((order) => (
                    <div className="order-card" key={order._id}>
                        <div className="order-card-head">
                            <div>
                                <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <span className={`status-badge ${order.status}`}>{order.status}</span>
                        </div>

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
                        <div className="order-card-foot">
                            <span>
                                {order.paymentMethod === "cod" ? "Cash on delivery" : "Paid online"}
                            </span>
                            <strong>Total ₹{order.total.toFixed(2)}</strong>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default MyOrders;