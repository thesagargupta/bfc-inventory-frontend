import { useState, useEffect } from "react";
import "./Home.css";
import { categoryMap, allCategories } from "./data";
import logo from "../assets/logo.png";
import toast, { Toaster } from "react-hot-toast";
import { IoLogOutOutline } from "react-icons/io5";

const LOGIN_EMAIL = import.meta.env.VITE_LOGIN_EMAIL;
const LOGIN_PASSWORD = import.meta.env.VITE_LOGIN_PASSWORD;

const BACKEND_URL = "https://bfc-inventory-backend.onrender.com";
const branchOptions = ["Chandigarh", "Delhi", "Gurugram"];

// Kitchen locations for each branch (latitude, longitude)
const branchLocations = {
  Chandigarh: { lat:  30.7102145, lng: 76.8070178, name: "Chandigarh Kitchen" },
  Delhi: { lat: 28.556680, lng: 77.237307, name: "Delhi Kitchen" },
  Gurugram: { lat: 28.4734084, lng: 77.0804124, name: "Gurugram Kitchen" },
};

const scheduledTimes = {
  Chandigarh: { hour: 0, minute: 0 },
  Delhi: { hour: 0, minute: 0 },
  Gurugram: { hour: 0, minute: 0 },
};

const getTodayDateString = () => new Date().toISOString().split("T")[0];

// Units mapping for each inventory item
const itemUnits = {
"Milk":"ml",
"Low Fat Butter":"gm",
"CREAM":"gm",
"Curd":"gm",
"Greek Yogurt":"gm",
"Paneer":"gm",
"Tofu":"gm",
"Custard Coolem":"ml",
"Ice Cream Milk":"ml",
"Ice cube":"gm",
"Eggs":"pc",
"FISH":"gm",
"Chicken Breast":"gm",
"Chicken Keema":"gm",
"Chicken Wings":"gm",
"Brown Bread Jumbo":"pc",
"Pizza Base Wheat":"pc",
"Burger Bun Wheat":"pc",
"Museli":"gm",
"ajinomoto":"gm",
"dates":"gm",
"Aata":"gm",
"Maida":"gm",
"Bajra Aata":"gm",
"Besan":"gm",
"Baking Powder":"gm",
"Brown Rice":"gm",
"White Rice (Golden Sella Double Chabbi)":"gm",
"Coffee":"gm",
"Pineapple Slice Tin":"gm",
"Tomato Puree":"tin",
"DryYeist":"gm",
"Quinua/ Foxtail / Kudos":"gm",
"Couc Cous":"gm",
"Red Beans":"gm",
"White Kidney Beans":"gm",
"Kabuli Chana":"gm",
"Moong Whole (Sprouts)":"gm",
"Chocolate Syrup":"gm",
"Kevada Water":"ml",
"Rose Water":"ml",
"Mix Seeds (Sunflower, Pumpkin, Flex)":"gm",
"Seasme Seeds":"gm",
"Chia Seeds":"gm",
"Hemp Seeds":"gm",
"Jeerawan Powder":"gm",
"Sugar":"gm",
"Dhania Whole":"gm",
"Mustard Seeds":"gm",
"Peanuts Raw":"gm",
"King Soya Oil":"ml",
"Olive Oil":"ml",
"Mustard Oil":"ml",
"Peanut Butter":"gm",
"Coco Powder":"gm",
"Poha":"gm",
"Oats":"gm",
"Rolled Oats":"gm",
"Honey":"gm",
"Milkmaid":"gm",
"Dark Compound":"gm",
"Kismish":"gm",
"Black Raisin":"gm",
"Kaju":"gm",
"Magaj":"gm",
"Almonds":"gm",
"Wallnuts":"gm",
"Custard Powder":"gm",
"Nachos":"gm",
"Beetroot Chips":"gm",
"Daliya":"gm",
"HOT GARLIC SAUCE":"gm",
"Haldiram Salted Peanuts":"gm",
"Red Chilly Whole":"gm",
"Coconut Milk Powder":"gm",
"Coconut Powder":"gm",
"Vanilla Frappe":"gm",
"Vanilla Essence":"gm",
"Parley Ji Buiscuit":"pack",
"Black Olives":"gm",
"Alipino":"gm",
"Oregano":"gm",
"Chilly Flakes":"gm",
"Black Pepper":"gm",
"Rock Salt":"gm",
"Salt":"gm",
"Haldi":"gm",
"Kitchen King":"gm",
"Degi Mirch":"gm",
"Rajma Masala":"gm",
"Jeera":"gm",
"Maggi Masala":"gm",
"Ghee":"gm",
"Badi Elaichi":"gm",
"Elachi Powder":"gm",
"Staff Rice":"gm",
"Staff Tea":"gm",
"Phynile":"ml",
"Pasta":"gm",
"Clove":"gm",
"Tej Patta":"gm",
"Sooji":"gm",
"Smokey Barbeque Masala":"gm",
"Chat Masala":"gm",
"Chicken Tikka Masala (Shan)":"gm",
"Kebab Masala (Shan)":"gm",
"Kasturi Methi":"gm",
"Biryani Masala":"gm",
"Peri Peri Masala":"gm",
"Italian Mix Seasoning":"gm",
"Garlic Powder":"gm",
"Thai Curry Masala":"gm",
"Caramel Syrup":"gm",
"Cheese Cake Casata Syrup":"gm",
"Tomato Ketchup":"gm",
"TObasco":"gm",
"Vinegar":"gm",
"Soya Sauce":"ml",
"Teriyaki Sauce":"gm",
"Thai Sweet Chilly Sauce":"gm",
"Kasundi Mustard":"gm",
"English Mustard":"gm",
"Barbeque Sauce":"gm",
"Thousand Sauce":"gm",
"Chilly Garlic Sauce":"gm",
"Chipotle Sauce":"gm",
"Sweet Onion Sauce":"gm",
"Red Chilly Sauce":"gm",
"Mayonese":"gm",
"Strawberry Crush":"gm",
"Blueberry Crush":"gm",
"Hazelnut Syrup":"ml",
"Cajun Powder":"gm",
"Pineapple Juice Tetra":"pack",
"Mix Berries Frozen":"gm",
"BlueBerries Frozen":"gm",
"Strawberry Frozen":"gm",
"Soya Tikka Frozen (Vegley)":"gm",
"Cheddar Cheese Slice":"pc",
"Mozerella Cheese":"gm",
"Cheese Block":"gm",
"Pancake Mix":"gm",
"Origano Mix Sachet":"pack",
"Chilly Flakes Sachet":"pack",
"sabudana":"gm",
"Bhuna Chana":"gm",
"Silver Foil":"gm",
"soya chunks":"gm",
"water":"ltr",
"Apple (Imp.)":"gm",
"Banana":"pc",
"Pomegranate":"gm",
"Papaya":"gm",
"Watermelon":"gm",
"Dragon Fruit":"pc",
"Kiwi (zespari)":"gm",
"Grapes":"gm",
"Red Globe":"gm",
"Khajur (Kimia)":"gm",
"Orange/Malta":"gm",
"Sharda":"gm",
"Guvava":"gm",
"Pineapple":"gm",
"Avacado":"pc",
"Pears Indian":"gm",
"Aamla":"gm",
"Curry Patta":"gm",
"arbi":"gm",
"Onion":"gm",
"Tomato":"gm",
"Potato":"gm",
"Zuccini":"gm",
"Brokli":"gm",
"Carrot":"gm",
"Beans":"gm",
"Cucumber":"gm",
"Mushroom":"gm",
"Capsicum":"gm",
"Lemon":"gm",
"Mint":"gm",
"Red Cabbage":"gm",
"Ice Berg":"gm",
"Cherry Tomato":"gm",
"Garlic (Peeled)":"gm",
"Ginger":"gm",
"Pumpkin":"gm",
"Celery":"gm",
"Basil":"gm",
"Sweet Corn (Frozen)":"gm",
"Peas (Frozen)":"gm",
"Sweet Potato":"gm",
"Beetroot":"gm",
"Cauliflower":"gm",
"Cabbage":"gm",
"Parseley":"gm",
"Baby Corn":"gm",
"Green Chilly":"gm",
"Baby Spinach":"gm",
"Spinach":"gm",
"Bellpepper (Red,Yellow)":"gm",
"Coriander":"gm",
"Lettuce":"gm",
"Spring Onion":"gm",
"Kale":"gm",
"650 ML Flat Round Paper Container":"pc",
"500 ML Flat Round Paper Container":"pc",
"350 ML Flat Round Paper Container":"pc",
"100 ML Flat Round Paper Container":"pc",
"Wooden Spork":"pc",
"Sanitizer":"pc",
"Tissue":"pc",
"Straw Packed":"pc",
"Glass Bottle 350 ML":"pc",
"Glass Salsa Jar 350 ML":"pc",
"Glass Salsa Jar 100 ML":"pc",
"Carry Bag":"pc",
"Burger Box":"pc",
"Pizza Box 10 inch":"pc",
"Tape":"pc",
"Cuttlery Pouch":"pc",
"Sleeves":"pc",
"ButterPaper":"pc",
"Kot Roll":"pc",
"Whole Wheat Pita":"pc",
"beetroot roti":"pc",
"beetroot wrap roti":"pc",
"Spinach Patty":"pc",
"Chop Masala":"gm",
"ITALIAN GRAVY":"gm",
"pizza sauce":"gm",
"indian gravy":"gm",
"Spinach Paste":"gm",
"salsa sauce":"gm",
"Hawaain Dressing":"gm",
"chilly lime dressing":"gm",
"Mint Sauce":"gm",
"peanut sauce":"gm",
"Truffles":"gm",};

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
    const hasData = Object.values(quantities).some(
      (val) => val && val.quantity
    );
    if (!selectedBranch) return toast.error("Please select a branch.");
    if (!hasData) return toast.error("No data to save.");
    
    // Additional location validation before submission
    if (!userLocation) {
      return toast.error("Location verification required. Please enable location services.");
    }
    
    if (!accessibleBranches.includes(selectedBranch)) {
      return toast.error("You are not within 5km radius of the selected branch kitchen.");
    }

    updateGoogleSheets(quantities, () => {
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
