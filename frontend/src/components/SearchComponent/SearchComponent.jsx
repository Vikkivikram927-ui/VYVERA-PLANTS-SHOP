import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductItem from "../productitem/Productitems";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/searchproducts?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("search failed:", err))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div>
      {loading && <p style={{ padding: 20 }}>Searching...</p>}
      {!loading && products.length === 0 && <p style={{ padding: 20 }}>No products found.</p>}

      <div className="shop-cetegary-page" style={{ marginTop: 0 }}>
        {products.map((p) => (
          <ProductItem
            key={p.id}
            id={p.id}
            name={p.name}
            description={p.description}
            image={p.image}
            price={p.price}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;