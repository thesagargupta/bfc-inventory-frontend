import { useState, useEffect } from "react";
import "./Home.css";
import logo from "../assets/logo.png";
import toast, { Toaster } from "react-hot-toast";
import { IoLogOutOutline } from "react-icons/io5";

const LOGIN_EMAIL = import.meta.env.VITE_LOGIN_EMAIL;
const LOGIN_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD;

const BACKEND_URL = "https://bfc-inventory-backend.onrender.com";
const branchOptions = ["Chandigarh", "Delhi", "Gurugram"];

// Kitchen locations for each branch (latitude, longitude)
const branchLocations = {
  Chandigarh: { lat: 30.7102145, lng: 76.8070178, name: "Chandigarh Kitchen" },
  Delhi: { lat: 28.556680, lng: 77.237307, name: "Delhi Kitchen" },
  Gurugram: { lat: 28.4734084, lng: 77.0804124, name: "Gurugram Kitchen" },
};

const scheduledTimes = {
  Chandigarh: { hour: 0, minute: 0 },
  Delhi: { hour: 0, minute: 0 },
  Gurugram: { hour: 0, minute: 0 },
};

const getTodayDateString = () => new Date().toISOString().split("T")[0];




// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Check if user is within 5km radius of any branch
const isWithinRadius = (userLat, userLng, branchName) => {
  const branch = branchLocations[branchName];
  if (!branch) return false;
  const distance = calculateDistance(userLat, userLng, branch.lat, branch.lng);
  return distance <= 5;
};



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

  // Geolocation states
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [accessibleBranches, setAccessibleBranches] = useState([]);

  // Dynamic inventory data from backend
  const [categories, setCategories] = useState([]); // array of category names
  const [categoryMap, setCategoryMap] = useState({}); // { category: [item, ...] }
  const [itemUnits, setItemUnits] = useState({}); // { item: unit }

  // Category loading state
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");
  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      setCatError("");
      try {
        const res = await fetch(`${BACKEND_URL}/api/categories`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setCategories(data.map(cat => cat.name));
        // Build categoryMap and itemUnits
        const catMap = {};
        const unitsMap = {};
        data.forEach(cat => {
          catMap[cat.name] = cat.items.map(i => i.name);
          cat.items.forEach(i => { unitsMap[i.name] = i.unit; });
        });
        setCategoryMap(catMap);
        setItemUnits(unitsMap);
      } catch (err) {
        setCatError("Failed to load categories from backend");
        toast.error("Failed to load categories from backend");
      }
      setCatLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  // Get user's current location and determine accessible branches
  useEffect(() => {
    if (!isAuthenticated) return;

    const getCurrentLocation = () => {
      setLocationLoading(true);
      setLocationError("");

      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by this browser.");
        setLocationLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Check which branches are accessible
          const accessible = branchOptions.filter((branch) =>
            isWithinRadius(latitude, longitude, branch)
          );
          
          setAccessibleBranches(accessible);
          setLocationLoading(false);

          if (accessible.length === 0) {
            setLocationError("You are not within 5km of any branch kitchen.");
          }
        },
        (error) => {
          setLocationLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access denied. Please enable location services.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out.");
              break;
            default:
              setLocationError("An unknown error occurred while getting location.");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    };

    getCurrentLocation();
  }, [isAuthenticated]);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!selectedBranch) {
        setCanSubmit(false);
        setAlreadySubmitted(false);
        return;
      }

      const now = new Date();
      const { hour, minute } = scheduledTimes[selectedBranch];
      const isAfterTime =
        now.getHours() > hour ||
        (now.getHours() === hour && now.getMinutes() >= minute);

      try {
        const response = await fetch(
          `${BACKEND_URL}/last-submission/${selectedBranch}`
        );
        const result = await response.json();
        const today = getTodayDateString();
        const lastDate = result?.date;

        if (lastDate === today) {
          setAlreadySubmitted(true);
          setCanSubmit(false);
        } else {
          setAlreadySubmitted(false);
          setCanSubmit(isAfterTime);
        }
      } catch (err) {
        console.error("Error checking submission status:", err);
        setAlreadySubmitted(false);
        setCanSubmit(isAfterTime);
      }
    };

    checkEligibility();
    const interval = setInterval(checkEligibility, 60000); // Check every 1 min
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
    // Reset location states
    setUserLocation(null);
    setLocationError("");
    setLocationLoading(false);
    setAccessibleBranches([]);
  };

  const refreshLocation = () => {
    setLocationError("");
    setUserLocation(null);
    setAccessibleBranches([]);
    setSelectedBranch("");
    
    // Trigger location fetch again
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        const accessible = branchOptions.filter((branch) =>
          isWithinRadius(latitude, longitude, branch)
        );
        
        setAccessibleBranches(accessible);
        setLocationLoading(false);

        if (accessible.length === 0) {
          setLocationError("You are not within 5km of any branch kitchen.");
        }
      },
      (error) => {
        setLocationLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable location services.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred while getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // 1 minute for refresh
      }
    );
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
    // Accept both integer and float values (e.g., 4, 4.5)
    if (!/^\d*\.?\d*$/.test(value)) return;
    setQuantities((prev) => ({
      ...prev,
      [item]: { quantity: value, category },
    }));
  };



  const updateGoogleSheets = async (dataMap, successCallback) => {
    const toastId = toast.loading("Updating Google Sheets...");
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/update-sheets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: dataMap,
          branch: selectedBranch,
        }),
      });
      const result = await response.json();
      setLoading(false);
      toast.dismiss(toastId);
      if (response.ok) {
        toast.success("Google Sheets updated successfully!");
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
    // Filter out items with empty or zero quantities
    const filteredQuantities = Object.keys(quantities).reduce((acc, item) => {
      const quantityValue = quantities[item]?.quantity;
      if (quantityValue !== "" && quantityValue !== null && quantityValue !== undefined) {
        acc[item] = quantities[item];
      }
      return acc;
    }, {});

    const hasData = Object.keys(filteredQuantities).length > 0;
    
    if (!selectedBranch) return toast.error("Please select a branch.");
    if (!hasData) return toast.error("No data to save. Please enter quantities for at least one item.");
    
    // Additional location validation before submission
    if (!userLocation) {
      return toast.error("Location verification required. Please enable location services.");
    }
    
    if (!accessibleBranches.includes(selectedBranch)) {
      return toast.error("You are not within 5km radius of the selected branch kitchen.");
    }

    // Pass the filtered quantities to the update function
    updateGoogleSheets(filteredQuantities, () => {
      setQuantities({});
      setSelectedCategory("");
      setAlreadySubmitted(true);
      setCanSubmit(false);
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
          <div className="password-field" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{ width: "100%", paddingRight: "40px" }}
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

      {locationLoading && (
        <div className="location-status" style={{ textAlign: "center", margin: "10px 0", color: "#007bff" }}>
          📍 Getting your location...
        </div>
      )}
      
      {locationError && (
        <div className="location-error" style={{ textAlign: "center", margin: "10px 0" }}>
          <div style={{ color: "#dc3545", fontSize: "14px", marginBottom: "8px" }}>
            ⚠️ {locationError}
          </div>
          <button
            onClick={refreshLocation}
            className="refresh-location-btn"
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            🔄 Retry Location
          </button>
        </div>
      )}

      {userLocation && accessibleBranches.length > 0 && (
        <div className="location-info" style={{ textAlign: "center", margin: "10px 0", color: "#28a745", fontSize: "14px" }}>
          ✅ Location verified. You can access {accessibleBranches.length} branch(es).
          <br />
          <small style={{ color: "#666" }}>
            {accessibleBranches.map((branch) => {
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                branchLocations[branch].lat,
                branchLocations[branch].lng
              );
              return `${branch}: ${distance.toFixed(1)}km`;
            }).join(" | ")}
          </small>
        </div>
      )}

      <select
        className="category-select"
        value={selectedBranch}
        onChange={handleBranchChange}
        disabled={locationLoading || accessibleBranches.length === 0}
      >
        <option value="">
          {locationLoading 
            ? "Getting location..." 
            : accessibleBranches.length === 0 
            ? "No accessible branches" 
            : "Select Branch"}
        </option>
        {accessibleBranches.map((branch) => (
          <option key={branch} value={branch}>
            {branch} ({branchLocations[branch].name})
          </option>
        ))}
      </select>

      {catLoading ? (
        <div style={{ textAlign: "center", color: "#007bff", margin: "10px 0" }}>Loading categories...</div>
      ) : catError ? (
        <div style={{ textAlign: "center", color: "#dc3545", margin: "10px 0" }}>{catError}</div>
      ) : (
        <select
          className="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      )}

      <div className="item-list-wrapper">
        <div className="item-list">
          {selectedCategory &&
            (categoryMap[selectedCategory] || []).map((item) => (
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
                  placeholder={`Qty (${itemUnits[item] || "kg"})`}
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
          ? "Updating..."
          : alreadySubmitted
          ? "Already Submitted Today"
          : canSubmit
          ? "Submit to Google Sheets"
          : "Submit available after scheduled time"}
      </button>
    </div>
  );
};

export default Home;