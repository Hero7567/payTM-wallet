import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name") || "";
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleTransfer = async () => {
        if (!amount || amount <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        setLoading(true);
        setError("");
        
        try {
            await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount: parseFloat(amount)
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            
            setSuccess(true);
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            console.error("Transfer failed:", err);
            setError(err.response?.data?.message || "Transfer failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">
                                    {name[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name || "User"}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                    min="1"
                                />
                            </div>
                            
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            {success && (
                                <p className="text-green-500 text-sm">
                                    Transfer successful! Redirecting to dashboard...
                                </p>
                            )}
                            
                            <button
                                onClick={handleTransfer}
                                disabled={loading || success}
                                className={`justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full ${
                                    loading || success 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-500 hover:bg-green-600'
                                } text-white`}
                            >
                                {loading ? 'Processing...' : 'Initiate Transfer'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};