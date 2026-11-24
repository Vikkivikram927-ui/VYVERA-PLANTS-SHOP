
import "./RelatedProducts.css"
import ProductItem from "../productitem/Productitems";


function RelatedProcts({product,allproducts}){

  const similar = allproducts
    .filter((p) => p.categery === product.categery && p.id !== product.id)
    .slice(0, 8);

    return(
        <>
        <div className="related-product-item">
            <h1>similar products</h1>
        </div>
        
        <div className="product-items-related">
        {similar.map((product,i)=>{
            return <ProductItem  key={i} id={product.id} name={product.name} image={product.image} price={product.price} description={product.description} qty={product.qty}/>

        })}
        </div>
        </>
    )
}


export default RelatedProcts