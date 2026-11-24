import "./Admin.css"
import logoicon from "../assets/pexels-bookspace-36452123-Photoroom.png"
import profilelogo from "../assets/profileimage.png"
import { IoIosArrowDown } from "react-icons/io";

function AdminPage() {
    return (
        <>
            <div className="admin-page-class">
                <div className="header-page">
                    <img className="image-profile" src={logoicon} alt="logo" />
                    <h1>vyvera</h1>
                    <p>admin portal login</p>
                    <img className="profilelogo" src={profilelogo} alt="profile" />
                    <IoIosArrowDown />
                </div>

            </div>
        </>
    )
}

export default AdminPage