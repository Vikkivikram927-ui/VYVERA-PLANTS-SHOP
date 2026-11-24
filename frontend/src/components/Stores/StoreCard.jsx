import { IoLocationSharp, IoTimeOutline } from "react-icons/io5";
import { MdAddIcCall } from "react-icons/md";

function StoreCard({ name = "", address = [], phone = "", timing = "" }) {
  return (
    <div className="stores-one">
      <h2>{name}</h2>

      <div className="store-row">
        <IoLocationSharp className="store-icon" />
        <p>
          {address.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>

      <div className="store-row">
        <MdAddIcCall className="store-icon" />
        <p>{phone}</p>
      </div>

      <div className="store-row">
        <IoTimeOutline className="store-icon" />
        <i>{timing}</i>
      </div>
    </div>
  );
}

export default StoreCard;