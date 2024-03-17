import { ethers } from "ethers";

const Navigation = ({ account, setAccount, dappazon, provider, owner }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
    localStorage.setItem("walletAccount", account);
  };

  const storedAccount = localStorage.getItem("walletAccount");

  const handleWithdraw =  async () => {
    try{
      const signer = await provider.getSigner();
      const transaction = await dappazon.connect(signer).withdraw();
      await transaction.wait()

      Swal.fire({
        title: "Withdraw",
        text: "Withdraw Funds Successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while processing your request. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
    });
    }
    
  }

  return (
    <nav>
      <div className="nav__brand">
        <h1>Dappazon</h1>
        
        {owner === account && (
          <button className="nav__connect" onClick={() => handleWithdraw()}>Withdraw</button>
        )}

      </div>

      <input type="text" className="nav__search" />

      {account || storedAccount ? (
        <button type="button" className="nav__connect">
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : `${storedAccount.slice(0, 6)}...${storedAccount.slice(-4)}`}
        </button>
      ) : (
        // Display the connect button if no account is connected
        <button type="button" className="nav__connect" onClick={connectHandler}>
          Connect
        </button>
      )}

      <ul className="nav__links">
        <li>
          <a href="#Clothing & Jewelry">Clothing & Jewelry</a>
        </li>
        <li>
          <a href="#Electronics & Gadgets">Electronics & Gadgets</a>
        </li>
        <li>
          <a href="#Toys & Gaming">Toys & Gaming</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
