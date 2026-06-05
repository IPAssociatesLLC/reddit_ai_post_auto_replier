import { useState } from "react";
import { useNavigate } from "react-router-dom";
 
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/popup");
    }, 1500);
  };
 
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      {/* Sign In Form, Google OAuth, Remember me, Info Box */}
    </div>
  );
}
