
import React, { useContext } from "react";
import "./CartItemPage.css";
import { MdDelete } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { ShopContext } from "../../context/ShopContext";

function CartItemPage() {
    const {
        allproducts,
        cartItem,
        AddToCart,
        RemoveToCart,
        DeleteFromCart
    } = useContext(ShopContext);

    // Total quantity
    const totalCartItems = Object.values(cartItem).reduce(
        (total, quantity) => total + quantity,
        0
    );

    // Subtotal
    const subtotal = allproducts.reduce((total, product) => {
        const quantity = cartItem[product.id] || 0;
        return total + product.price * quantity;
    }, 0);

    // Discount: 10%
    const discountPercentage = 10;
    const discount = subtotal * (discountPercentage / 100);

    // Delivery charge
    const deliveryCharge =
        subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 50;

    // Final total
    const finalTotal = subtotal - discount + deliveryCharge;

    return (
        <div className="cart-page">

            {/* Cart Products */}
            <div className="cart-products">
                {allproducts.map((e) => {
                    if ((cartItem[e.id] || 0) > 0) {
                        return (
                            <div className="cart-product" key={e.id}>

                                <div className="cartitems-format">
                                    <img
                                        src={e.image}
                                        alt={e.name}
                                        className="image-cart-item"
                                    />

                                    <div className="puma-qty-pass">
                                        <h4>{e.name}</h4>
                                        <p>{e.description}</p>
                                        <i>
                                            ${(e.price * cartItem[e.id]).toFixed(2)}
                                        </i>
                                    </div>
                                </div>

                                <div className="qty-and-cart">
                                    <div className="qty-icons-button">

                                        <button
                                            type="button"
                                            className="qty-button"
                                            onClick={() =>
                                                RemoveToCart(e.id)
                                            }
                                            disabled={cartItem[e.id] <= 1}
                                        >
                                            <FaMinus />
                                        </button>

                                        <span className="quantity-number">
                                            {cartItem[e.id]}
                                        </span>

                                        <button
                                            type="button"
                                            className="qty-button-query"
                                            onClick={() =>
                                                AddToCart(e.id)
                                            }
                                        >
                                            <FaPlus />
                                        </button>

                                    </div>

                                    <button
                                        type="button"
                                        className="delete-icon"
                                        onClick={() =>
                                            DeleteFromCart(e.id)
                                        }
                                        aria-label={`Remove ${e.name} from cart`}
                                    >
                                        <MdDelete />
                                    </button>
                                </div>

                            </div>
                        );
                    }

                    return null;
                })}
            </div>

            {/* Cart Summary - OUTSIDE map */}
            <div className="cart-summary">
                <h2>Cart Summary</h2>

                <div className="summary-row">
                    <span>Total Cart Items</span>
                    <span>{totalCartItems}</span>
                </div>

                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                    <span>Discount ({discountPercentage}%)</span>
                    <span className="discount">
                        -${discount.toFixed(2)}
                    </span>
                </div>

                <div className="summary-row">
                    <span>Delivery Charge</span>
                    <span>
                        {deliveryCharge === 0
                            ? "FREE"
                            : `$${deliveryCharge.toFixed(2)}`}
                    </span>
                </div>

                <hr />

                <div className="summary-row final-total">
                    <h3>Total</h3>
                    <h3>${finalTotal.toFixed(2)}</h3>
                </div>

                {subtotal > 0 && (
                    <p className="delivery-message">
                        {subtotal >= 999
                            ? "Congratulations! You got free delivery."
                            : `Shop for $${(999 - subtotal).toFixed(2)} more to get free delivery.`}
                    </p>
                )}

                <button
                    type="button"
                    className="checkout-btn"
                    disabled={totalCartItems === 0}
                    onClick={() =>
                        alert("Connect your checkout page here!")
                    }
                >
                    Proceed to Checkout
                </button>
            </div>

        </div>
    );
}

export default CartItemPage;
