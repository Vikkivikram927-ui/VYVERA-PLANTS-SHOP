import React, { useContext, useRef, useState, useEffect } from "react";   // NEW: added useEffect
import './Navbar.css'
import logo from "../Assets/pexels-bookspace-36452123-Photoroom.png"
import { FaShoppingCart } from "react-icons/fa";
import { RxChevronDown } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { FiAlignJustify, FiSearch, FiX } from "react-icons/fi"            // NEW: added FiSearch, FiX

function Navbar() {

    const { getTotalCartItem } = useContext(ShopContext);

    const menuRef = useRef(null);

    const Dropdowntoggle = (e) => {
        menuRef.current.classList.toggle('menu-ref-visible')
        e.target.classList.toggle('open');
    }

    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);                  // NEW
    const searchInputRef = useRef(null);                                  // NEW
    const navigate = useNavigate();

    // NEW: focus the input automatically when it opens
    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
        setQuery("");
        setShowSearch(false);                                             // NEW: close box after searching
    };

    return (
        <>
            <div className="navbar">
                <div className="bottom-navbar-first-one">
                    <div className="scroll-text">
                        <span>🚚 Free shipping on orders above ₹599</span>
                        <span>🚚 Free shipping on orders above ₹599</span>
                        <span>🚚 Free shipping on orders above ₹599</span>
                        <span>🚚 Free shipping on orders above ₹599</span>
                    </div>
                </div>

                <div className="navbar-vikram"></div>
                <div className="navbar-bottom">
                    <div className="navbar-bottom-frist">
                        <img src={logo} alt="shopers" />
                        <p>vyvera</p>
                    </div>

                    <ul ref={menuRef} className="navbar-menu">
                        <Link style={{ textDecoration: "none" }} to="/"><li>home <RxChevronDown /></li></Link>
                        <Link style={{ textDecoration: "none" }} to="/plants" ><li>plants <RxChevronDown /></li></Link>
                        <Link style={{ textDecoration: "none" }} to="/seeds"><li>seeds <RxChevronDown /></li></Link>
                        <Link style={{ textDecoration: "none" }} to="/pots"><li>pots <RxChevronDown /></li></Link>
                        <Link style={{ textDecoration: "none" }} to="/products"><li>products <RxChevronDown /></li></Link>
                        <Link style={{ textDecoration: "none" }} to="/plantcare"><li>plant care <RxChevronDown /></li></Link>
                        <Link style={{ textDecoration: "none" }} to="/stores"><li>stores <RxChevronDown /></li></Link>
                    </ul>

                    {/* CHANGED: added dynamic className and the ref on the input */}
                    <form
                        className={`navbar-search-place ${showSearch ? "search-open" : ""}`}
                        onSubmit={handleSearch}
                    >
                        <input
                            ref={searchInputRef}
                            type="search"
                            placeholder="Search seeds, plants, pots..."
                            aria-label="Search plants"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    <div className="Navbar-head-sign">
                        {/* NEW: search icon button, only visible on small screens (CSS controls this) */}
                        <button
                            type="button"
                            className="search-icon-btn"
                            aria-label="Toggle search"
                            onClick={() => setShowSearch((prev) => !prev)}
                        >
                            {showSearch ? <FiX /> : <FiSearch />}
                        </button>

                        <Link style={{ textDecoration: "none", color: "black" }} to="/signin"><p><CgProfile /></p></Link>
                        <Link style={{ textDecoration: "none", color: "black" }} to="/cartpage"><p><FaShoppingCart /></p></Link>
                        <div className="navbar-count-button">{getTotalCartItem()}</div>
                    </div>

                    <div className="navigation-bar">
                        <p onClick={Dropdowntoggle}><FiAlignJustify /></p>
                    </div>
                </div>
                <br />
            </div>
        </>
    )
}

export default Navbar