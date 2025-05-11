import React, { useState, useEffect } from 'react';
import API from '../api';
import '../styles/Dashboard.css';

function Dashboard() {
  const [salesData, setSalesData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2025-05-09'); // Set the default date

  useEffect(() => {
    // Fetch the dashboard data for the selected date
    API.get(`/orders/dashboard/${selectedDate}`)
      .then((response) => {
        setSalesData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="dashboard">
      <h1>Sales Dashboard</h1>
      <label htmlFor="date">Select Date: </label>
      <input
        type="date"
        id="date"
        value={selectedDate}
        onChange={handleDateChange}
      />
      {salesData ? (
        <div className="dashboard-content">
          <h2>Total Revenue: ${salesData.totalRevenue.toFixed(2)}</h2>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity Sold</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.totalQuantity}</td>
                  <td>${(item.totalRevenue * item.totalQuantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading sales data...</p>
      )}
    </div>
  );
}

export default Dashboard;
