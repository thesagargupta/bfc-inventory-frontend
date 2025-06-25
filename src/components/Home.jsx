import { useState, useEffect } from "react";
import "./Home.css";
import { categoryMap, allCategories } from "./data";
import logo from "../assets/logo.png";
import toast, { Toaster } from "react-hot-toast";
import { IoLogOutOutline } from "react-icons/io5";

// Use import.meta.env in Vite
const LOGIN_EMAIL = import.meta.env.VITE_LOGIN_EMAIL;
const LOGIN_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD;

const BACKEND_URL = "https://bfc-inventory-backend.onrender.com/send-email";

const branchOptions = ["Chandigarh", "Delhi", "Gurugram"];

const scheduledTimes = {
  Chandigarh: { hour: 0, minute: 0 },
  Delhi: { hour: 0, minute: 0 },
  Gurugram: { hour: 0, minute: 0 },
};

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedBranch) {
        const now = new Date();
        const { hour, minute } = scheduledTimes[selectedBranch];
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const isAfterTime =
          currentHour > hour ||
          (currentHour === hour && currentMinute >= minute);

        const lastSentDate = localStorage.getItem(
          `submitted-${selectedBranch}`
        );
        const today = getTodayDateString();
        const isSubmittedToday = lastSentDate === today;

        setAlreadySubmitted(isSubmittedToday);
        setCanSubmit(isAfterTime && !isSubmittedToday);
      } else {
        setCanSubmit(false);
        setAlreadySubmitted(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedBranch]);

  const handleLogin = () => {
    if (loginEmail === LOGIN_EMAIL && loginPassword === LOGIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Login successful!");
      setLoginEmail("");
      setLoginPassword("");
    } else {
      toast.error("Invalid credentials!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    setSelectedBranch("");
    setSelectedCategory("");
    setQuantities({});
  };

  const handleBranchChange = (e) => setSelectedBranch(e.target.value);

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    const newItems = categoryMap[cat] || [];
    const updatedQuantities = { ...quantities };
    newItems.forEach((item) => {
      if (!(item in updatedQuantities)) {
        updatedQuantities[item] = "";
      }
    });
    setQuantities(updatedQuantities);
  };

  const handleQtyChange = (category, item, value) => {
    if (!/^\d*$/.test(value)) return;
    setQuantities((prev) => ({
      ...prev,
      [item]: { quantity: value, category },
    }));
  };

  const generateCSV = (dataMap, branchName = selectedBranch) => {
    const headers = ["Category", "Item", "Quantity (Kg)"];
    const rows = Object.entries(dataMap)
      .filter(([, val]) => val.quantity)
      .map(
        ([item, { quantity, category }]) => `${category},${item},${quantity}`
      );
    return [`Branch: ${branchName || "N/A"}`, headers.join(","), ...rows].join(
      "\n"
    );
  };

  const sendCSVEmail = async (csvStr, successCallback) => {
    const toastId = toast.loading("Sending email...");
    setLoading(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvStr }),
      });
      const result = await response.json();
      setLoading(false);
      toast.dismiss(toastId);
      if (response.ok) {
        toast.success("Email sent successfully!");
        if (successCallback) successCallback();
      } else {
        toast.error("Failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      setLoading(false);
      toast.dismiss(toastId);
      toast.error("Error: " + err.message);
    }
  };

  const handleSubmit = () => {
    const hasData = Object.values(quantities).some(
      (val) => val && val.quantity
    );
    if (!selectedBranch) return toast.error("Please select a branch.");
    if (!hasData) return toast.error("No data to save.");

    const csvString = generateCSV(quantities);
    sendCSVEmail(csvString, () => {
      localStorage.setItem(`submitted-${selectedBranch}`, getTodayDateString());
      setQuantities({});
      setSelectedCategory("");
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="home-container login-container">
        <Toaster position="top-center" />
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="home-title">Login to Inventory</h2>
        <div className="login-box">
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <div
            className="password-field"
            style={{ position: "relative", width: "100%" }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{
                width: "100%",
                paddingRight: "40px", // space for the eye icon
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="eye-toggle"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#555",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button onClick={handleLogin} className="submit-button">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Toaster position="top-center" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 400,
          margin: "0 auto 10px",
          position: "relative",
        }}
      >
        <img src={logo} alt="Logo" className="logo" />
        <IoLogOutOutline
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.8rem",
            color: "#333",
            zIndex: 1000,
          }}
        />
      </div>
      <h1 className="home-title">Food Inventory Entry</h1>

      <select
        className="category-select"
        value={selectedBranch}
        onChange={handleBranchChange}
      >
        <option value="">Select Branch</option>
        {branchOptions.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>

      <select
        className="category-select"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">Select Category</option>
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="item-list-wrapper">
        <div className="item-list">
          {selectedCategory &&
            categoryMap[selectedCategory].map((item) => (
              <div className="item-row" key={item}>
                <label>{item}</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantities[item]?.quantity || ""}
                  onChange={(e) =>
                    handleQtyChange(selectedCategory, item, e.target.value)
                  }
                  placeholder="Qty (Kg)"
                />
              </div>
            ))}
        </div>
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={loading || !canSubmit}
      >
        {loading
          ? "Sending..."
          : alreadySubmitted
          ? "Already Submitted Today"
          : canSubmit
          ? "Submit & Email Data"
          : "Submit available after scheduled time"}
      </button>
    </div>
  );
};

export default Home;
