import { useEffect, useState } from 'react';
import { dbank_backend } from 'declarations/dbank_backend';
import './index.scss';
import dbank from './assets/dbank.jpg';

function App() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const fetchBalance = async () => {
    try {
      const balanceValue = await dbank_backend.currentBalance();
      setBalance(balanceValue);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();

    const intervalId = setInterval(async () => {
      await dbank_backend.applyInterest();
      fetchBalance();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (depositAmount) {
      try {
        await dbank_backend.deposit(Number(depositAmount));
        fetchBalance();
        setDepositAmount('');
      } catch (error) {
        console.error("Error during deposit:", error);
      }
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (withdrawAmount) {
      try {
        await dbank_backend.withdraw(Number(withdrawAmount));
        fetchBalance();
        setWithdrawAmount('');
      } catch (error) {
        console.error("Error during withdrawal:", error);
      }
    }
  };

  return (
    <main>
      <div className="container">
        <img src={dbank} alt="dbank logo" />
        <p className="balance">Current Balance: ${balance.toFixed(4)}</p>
        <form>
          <label>Deposit Money:</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button onClick={handleDeposit}>Deposit</button>

          <label>Withdraw Money:</label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button onClick={handleWithdraw}>Withdraw</button>
        </form>
      </div>
    </main>
  );
}

export default App;
