import { ethers } from "ethers";

// Components
import Rating from "./Rating";

const Section = ({ title, items, togglePop }) => {
  console.log(items.image);
  return (
    <div className="cards__section">
      <h3>{title}</h3>

      <hr />

      <div className="cards">
        {items.map((item, index) => (
          <div className="card" key={index} onClick={() => togglePop(item)}>
            <div>
              <img src={item.image} alt="Item" />
            </div>
            <div className="card__info">
              <h4>{item.name}</h4>
              <Rating value={item.rating} />
              <p>
                {ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section;
