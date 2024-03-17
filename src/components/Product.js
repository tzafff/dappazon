import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Swal from 'sweetalert2';

// Components
import Rating from "./Rating";

import close from "../assets/close.svg";

const Product = ({ item, provider, account, dappazon, togglePop }) => {
  const [order, setOrder] = useState(null)
  const [hasBought, setHasBought] = useState(false)
  

  const fetchDetails = async () => {
    try {
      
      const blockNumber = await provider.getBlockNumber();
      const targetBlockNumber = blockNumber - 1000; // Adjust as needed
      const events = await dappazon.queryFilter("Buy", targetBlockNumber);
  
      const orders = events.filter(
        (event) =>
          event.args.buyer === account &&
          event.args.itemId.toString() === item.id.toString()
      );
      if (orders.length === 0) {
        return;
      }
  
      const order = await dappazon.orders(account, orders[0].args.orderId);
      setOrder(order);
    } catch (error) {
      console.error("Error fetching details:", error);
      // Handle the error accordingly, e.g., throw the error or display a message to the user.
    }
  };
  

  const buyHandler = async () => {
    try{
      const signer = await provider.getSigner();
      let transaction = await dappazon.connect(signer).buy(item.id, {value: item.cost})
      await transaction.wait()
      Swal.fire({
        title: "Item Bought",
        text: "Item Bought Successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error.message)
      if (error.message.includes('insufficient funds')) {
        // Display a customized error message for insufficient funds using SweetAlert2
        Swal.fire({
            title: 'Insufficient Funds',
            text: 'You do not have enough funds to complete the transaction.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    } else {
        // Display a generic error message for other errors using SweetAlert2
        Swal.fire({
            title: 'Error',
            text: 'An error occurred while processing your request. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
    }
    

    setHasBought(true)
  }

  useEffect(() => {
    fetchDetails()
  },[hasBought])

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>

          <Rating value={item.rating} />

          <hr />

          <p>{item.address}</p>

          <h2>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH </h2>

          <hr />

          <h2>Overview</h2>

          <p>
            {item.description}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima rem,
            iusto, consectetur inventore quod soluta quos qui assumenda aperiam,
            eveniet doloribus commodi error modi eaque! Iure repudiandae
            temporibus ex? Optio!
          </p>
        </div>

        <div className="product__order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), "ether")} ETH</h1>
          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>
          </p>

          {item.stock > 0 ? <p>In Stock.</p> : <p>Out of Stock.</p>}

          <button className="product__buy" onClick={buyHandler}>
            Buy Now
          </button>

          <p><small>Ships from</small> Dappazon</p>
          <p><small>Sold by</small> Dappazon</p>

          {order && (
            <div className='product__bought'>
              Item bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                  undefined,
                  {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
              </strong>
            </div>
          )}
          
        </div>

        <button onClick={togglePop} className="product__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Product;
