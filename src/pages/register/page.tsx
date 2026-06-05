import { useState } from "react";
import { useNavigate } from "react-router-dom";
 
export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/onboarding");
    }, 1500);
  };
 
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      {/* Register Form, Terms, Google OAuth, Info Box */}
    </div>
  );
}
