import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import './ClientList.css'; // Assuming there's some custom CSS for styling

const ClientList = () => {
  const [clients, setClients] = useState([]); // For storing the list of clients
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [pythonOutput, setPythonOutput] = useState(''); // State to store Python script output
  const navigate = useNavigate(); // Use navigate to handle routing

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients'); // Fetch clients from the backend
        setClients(response.data); // Update clients with response data
        setLoading(false); // Stop loading
      } catch (err) {
        setError('Error fetching client data');
        setLoading(false);
      }
    };

    fetchClients();
  }, []); // Empty dependency array means this will run only once when the component mounts

  // Event handler to select a client and navigate to ClientDetails page
  const handleClientClick = (client) => {
    navigate(`/client/${client.client_id}`); // Navigate to client details page using client_id
  };

  // Function to run the Python script by calling the API
  const runPythonScript = async () => {
    try {
      alert('Running Python script...'); // Display alert when button is clicked
      const response = await axios.get('/run-python');
      setPythonOutput(response.data); // Store Python script output
    } catch (err) {
      setPythonOutput('Error running Python script');
    }
  };

  if (loading) return <p>Loading clients...</p>; // Show loading message
  if (error) return <p>{error}</p>; // Show error message

  return (
    <div>
      <h1>Client List</h1>
      <div className="client-list">
        {clients.map((client) => (
          <div className="client-item card" key={client.client_id}>
            <h2>{client.name}</h2>
            <p>Age: {client.age}</p>
            <p>Risk Tolerance: {client.risk_tolerance}</p>
            {/* Button to navigate to ClientDetails */}
            <button className="button" onClick={() => handleClientClick(client)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Button to run Python script */}
      <button className="python-button" onClick={runPythonScript}>
        Run Python Script
      </button>

      {/* Display Python script output */}
      {pythonOutput && <p className="python-output">{pythonOutput}</p>}
    </div>
  );
};

export default ClientList;
