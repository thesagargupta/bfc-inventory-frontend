import React, { useState } from 'react';
import './Home.css';
import { categoryMap, allCategories } from './data';
import logo from '../assets/logo.png';
import toast, { Toaster } from 'react-hot-toast';

const BACKEND_URL = 'https://bfc-inventory-backend.onrender.com/send-email';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    const newItems = categoryMap[cat] || [];
    const updatedQuantities = { ...quantities };
    newItems.forEach(item => {
      if (!(item in updatedQuantities)) {
        updatedQuantities[item] = '';
      }
    });
    setQuantities(updatedQuantities);
  };

  const handleQtyChange = (category, item, value) => {
    if (!/^\d*$/.test(value)) return; // allow only digits or empty string
    setQuantities(prev => ({
      ...prev,
      [item]: { quantity: value, category }
    }));
  };

  const generateCSV = (dataMap) => {
    const headers = ['Category', 'Item', 'Quantity (Kg)'];
    const rows = Object.entries(dataMap)
      .filter(([, val]) => val.quantity)
      .map(([item, { quantity, category }]) => `${category},${item},${quantity}`);
    return [headers.join(','), ...rows].join('\n');
  };


  const sendCSVEmail = async (csvStr) => {
    const toastId = toast.loading('Sending email...');
    setLoading(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csv: csvStr }),
      });
      const result = await response.json();
      setLoading(false);
      toast.dismiss(toastId);

      if (response.ok) {
        toast.success('Email sent successfully!');
      } else {
        toast.error('Failed to send email: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      setLoading(false);
      toast.dismiss(toastId);
      toast.error('Error sending email: ' + err.message);
    }
  };

  const handleSubmit = () => {
    const hasData = Object.values(quantities).some(val => val && val.quantity);
    if (!hasData) {
      toast.error('No data to save.');
      return;
    }

    const csvString = generateCSV(quantities);
    sendCSVEmail(csvString);
  };

  return (
    <div className="home-container">
      <Toaster position="top-center" />
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="home-title">Food Inventory Entry</h1>

      <select className="category-select" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {allCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <div className="item-list-wrapper">
        <div className="item-list">
          {selectedCategory && categoryMap[selectedCategory].map(item => (
            <div className="item-row" key={item}>
              <label>{item}</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantities[item]?.quantity || ''}
                onChange={e => handleQtyChange(selectedCategory, item, e.target.value)}
                placeholder="Qty (Kg)"
              />
            </div>
          ))}
        </div>
      </div>

      <button className="submit-button" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Sending...' : 'Save & Email Data'}
      </button>
    </div>
  );
};

export default Home;
