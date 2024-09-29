import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use useParams to get the client ID
import axios from 'axios';
import './ClientDetails.css'; // Assuming there's custom CSS for styling

const ClientDetails = () => {
  const { id } = useParams(); // Get the client_id from the URL
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate to handle navigation to portfolio

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`/api/clients/${id}`);
        setClient(response.data);
        setLoading(false);
      } catch (err) {
        setError('Client not found or error fetching client data');
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]); // Re-run when the id changes

  if (loading) return <p>Loading client details...</p>;
  if (error) return <p>{error}</p>;

  if (!client) return <p>Client not found</p>;

  const handleViewPortfolio = () => {
    navigate(`/portfolio/${id}`); // Navigate to portfolio view for the client
  };

  return (
    <div className="card">
      <h1>{client.name}</h1>
      <p>Age: {client.age}</p>
      <p>Risk Tolerance: {client.risk_tolerance}</p>
      <p>Investment Goal: {client.investment_goal}</p>
      <p>Email: {client.email}</p>
      <p>Phone: {client.phone}</p>
      <p>Account Status: {client.account_status}</p>
      <button className="button" onClick={handleViewPortfolio}>View Portfolio</button>
    </div>
  );
};

export default ClientDetails;
