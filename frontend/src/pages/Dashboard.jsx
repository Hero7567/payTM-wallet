import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useEffect, useState } from "react";
import axios from "axios";

export const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
        setBalance(response.data.balance);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
        setError("Failed to load balance. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="m-8">
        {loading ? (
          <div className="text-gray-500">Loading balance...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Balance value={balance !== null ? formatBalance(balance) : "0"} />
        )}
        <Users />
      </div>
    </div>
  );
};