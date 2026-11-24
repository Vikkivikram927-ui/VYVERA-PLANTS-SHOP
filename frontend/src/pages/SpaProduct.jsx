
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import SpaPlantProduct from "../components/spaPlantproducts/SpaPlantProducts";
import RelatedProcts from "../components/relatedproducts/RelatedProducts";

function SpaProduct() {
  const {allproducts} = useContext(ShopContext);
  const { id } = useParams();
  const product = allproducts?.find((e) => e.id === Number(id));
    if (!product) return <p>Loading...</p>;

  return (
    <>
    <SpaPlantProduct SpaProduct={product} />
    <RelatedProcts product={product} allproducts={allproducts} />
    </>
  );
}

export default SpaProduct;