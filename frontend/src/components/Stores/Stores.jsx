import './Stores.css'
import { useEffect, useState } from "react";
import StoreCard from "./StoreCard";
import { API } from '../../config';

function Stores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetch(`${API}/allstores`)
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("failed to fetch stores:", err));
  }, []);

  return (
    <div className="stores-wrapper">
      {stores.map((store) => (
        <StoreCard
          key={store._id}
          name={store.name}
          address={store.address}
          phone={store.phone}
          timing={store.timing}
        />
      ))}
    </div>
  );
}

export default Stores;