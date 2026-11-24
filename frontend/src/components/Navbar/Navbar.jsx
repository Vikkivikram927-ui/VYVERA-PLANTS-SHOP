import React, { useContext, useRef,useState} from "react";
import './Navbar.css'
import logo from "../Assets/pexels-bookspace-36452123-Photoroom.png"
import { FaShoppingCart } from "react-icons/fa";
import { RxChevronDown } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { Link,useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { FiAlignJustify } from "react-icons/fi"
function Navbar() {

    const { getTotalCartItem } = useContext(ShopContext);

    const menuRef = useRef(null);

    const Dropdowntoggle = (e) => {
        menuRef.current.classList.toggle('menu-ref-visible')
        e.target.classList.toggle('open');
    }

    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();                      // stops the page reload
        const q = query.trim();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
        setQuery("");                            // optional: clear the box after searching
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
                    <form className="navbar-search-place" onSubmit={handleSearch}>
                        <input
                            type="search"
                            placeholder="Search seeds, plants, pots..."
                            aria-label="Search plants"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                    <div className="Navbar-head-sign">
                        <Link style={{ textDecorationL: "none", color: "black" }} to="/signin"><p><CgProfile /></p></Link>
                        <Link style={{ textDecorationL: "none", color: "black" }} to="/cartpage"><p><FaShoppingCart /></p></Link>
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