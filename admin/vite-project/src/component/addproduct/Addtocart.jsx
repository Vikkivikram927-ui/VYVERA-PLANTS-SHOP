import { useState } from "react";
import "./Addtocart.css"
import { FaCloudUploadAlt } from "react-icons/fa";


function AddtocartPage() {

    const [image, setImage] = useState(null)
    const [productItem, setProductsItems] = useState({
        name: "",
        price: "",
        description: "",
        categery: "plants",
        image: "",
    })

    const hadnlerImage = (e) => {
        setImage(e.target.files[0])
    }

    const ListofProductItmes = (e) => {
        setProductsItems({ ...productItem, [e.target.name]: e.target.value })

    }

    const Add_product = async () => {
        console.log(productItem)

        let responceData;
        let product = productItem;

        let formData = new FormData();
        formData.append('productimage', image);

        await fetch('http://localhost:4000/upload',
            {
                method: "POST",
                headers: {
                    Accept: "application/json"
                },
                body: formData
            }
        ).then((resp) => resp.json())
            .then((data) => responceData = data)

        if (responceData.success) {
            product.image = responceData.image_URL;
            await fetch('http://localhost:4000/addproducts', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(product),
            }).then((resp) => resp.json())
                .then((data) => {
                    data.success ? alert("Product added") : alert("Failed: " + data.message)
                })
        }
    }

    return (
        <>
            <div className="entry-column">
                <div className="product-name">
                    <p>Product  Name</p>
                    <input name="name" value={productItem.name} onChange={ListofProductItmes} type="text" placeholder="type here" />
                </div>
                <div className="product-price">
                    <p>Product Price </p>
                    <input name="price" value={productItem.price} onChange={ListofProductItmes} type="number" placeholder="type here" />
                </div>
                <div className="product-decription">
                    <p>Description </p>
                    <input name="description" value={productItem.description} onChange={ListofProductItmes} type="text" placeholder="type here" />
                </div>
                <div className="products-catgery">
                    <p>Products Categery </p>
                    <select name="categery" value={productItem.categery} onChange={ListofProductItmes} className="select-categry">
                        <option value="plants">Plants</option>
                        <option value="seeds">Seeds</option>
                        <option value="pots">Pots</option>
                        <option value="products">Products</option>
                        <option value="Plantcare">Plantcare</option>
                        <option value="Stores">Stores</option>
                    </select>
                </div>
                <br></br><p>Image Upload</p>
                <div className="upload-form">
                    <label htmlFor="file-input">
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="preview" className="upload-preview" />
                        ) : (
                            <FaCloudUploadAlt size={50} />
                        )}
                    </label>
                    <input onChange={hadnlerImage} type="file" name="image" id="file-input" hidden />
                </div><br></br>


                <button onClick={Add_product} className="buttob-add-image">Add</button>

            </div>


        </>
    )
}


export default AddtocartPage