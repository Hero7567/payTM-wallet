import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
        username: email,
        password
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signin failed:", err);
      setError(err.response?.data?.message || "Signin failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="rounded-lg bg-white w-80 text-center p-6 shadow-md">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <InputBox 
          placeholder="shreyanshsinha10@gmail.com" 
          label={"Email"} 
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
        />
        
        <InputBox 
          placeholder="123456" 
          label={"Password"} 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
        />
        
        <div className="pt-4">
          <Button 
            label={loading ? "Signing in..." : "Sign in"} 
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
        
        <BottomWarning 
          label={"Don't have an account?"} 
          buttonText={"Sign up"} 
          to={"/signup"} 
        />
      </div>
    </div>
  );
};