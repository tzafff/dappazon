import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Dappazon from "./abis/Dappazon.json";

// Config
import config from "./config.json";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [dappazon, setDappazon] = useState(null);
  const [owner, setOwner] = useState(null);

  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const [toggle, setToggle] = useState(false);
  const [item, setItem] = useState({});

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };

  const loadBlockchainData = async () => {
    // Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    // Connect to Contract
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon.address,
      Dappazon,
      provider
    );

    console.log("owner");
    const owner = await dappazon.owner();
    console.log(owner);
    setOwner(owner);

    // console.log(dappazon)
    // console.log(network)
    // console.log(provider)
    setDappazon(dappazon);

    // Load products

    const items = [];
    for (var i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1);
      items.push(item);
    }

    const electronics = items.filter((item) => item.category === "electronics");
    const clothing = items.filter((item) => item.category === "clothing");
    const toys = items.filter((item) => item.category === "toys");

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
  };

  useEffect(() => {
    loadBlockchainData();

    window.ethereum.on("accountsChanged", (accounts) => {
      const newAccount = ethers.utils.getAddress(accounts[0]);
      setAccount(newAccount);
      console.log("Account changed:", newAccount);
    });
  }, []);

  const withdrawHandler = async () => {
    console.log("withdraw")
    const signer = await provider.getSigner();
    const transaction = await dappazon.connect(signer).withdraw()
    await transaction.wait()

    setHasBought(true)
  }

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dappazon Best Sellers</h2>

      {owner === account && (
        <>
          <h2>Withdraw Funds from Sales (Only Owner of Contract)</h2>
          <button type="button" className="nav__connect" style={{ margin: '10px 150px' }} onClick={withdrawHandler}>
            Withdraw
          </button>
        </>
      )}

      {electronics && clothing && toys && (
        <>
          <Section
            title={"Clothing & Jewelry"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics & Gadgets"}
            items={electronics}
            togglePop={togglePop}
          />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          dappazon={dappazon}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;
