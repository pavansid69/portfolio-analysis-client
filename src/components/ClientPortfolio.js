import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClientPortfolio.css';

const ClientPortfolio = () => {
  const { id } = useParams(); // Get client_id from URL params
  const [portfolio, setPortfolio] = useState(null); // Portfolio data
  const [dailyRisks, setDailyRisks] = useState([]); // Daily risks data
  const [dailySentiments, setDailySentiments] = useState([]); // Daily sentiments data
  const [satisfaction, setSatisfaction] = useState(null); // Satisfaction data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioResponse = await axios.get(`/api/portfolios/${id}`);
        const risksResponse = await axios.get(`/api/dailyrisks/${id}`);
        const sentimentsResponse = await axios.get(`/api/dailysentiments/${id}`);
        const satisfactionResponse = await axios.get(`/api/clientSatisfactions/${id}`); // Fetch satisfaction data

        setPortfolio(portfolioResponse.data);
        setDailyRisks(risksResponse.data);
        setDailySentiments(sentimentsResponse.data[0]?.daily_sentiments || []);
        setSatisfaction(satisfactionResponse.data); // Set satisfaction data

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching portfolio, risks, sentiments, or satisfaction');
        setLoading(false);
      }
    };

    fetchData(); // Fetch data when component mounts or id changes
  }, [id]);

  if (loading) return <p>Loading portfolio...</p>;
  if (error) return <p>{error}</p>;
  if (!portfolio) return <p>Portfolio data not available.</p>;

  // Helper function to summarize daily sentiment counts
  const calculateSentimentSummary = (dailySentiments) => {
    const sentimentSummary = {
      emails: { Positive: 0, Negative: 0 },
      phone_calls: { Positive: 0, Negative: 0 },
      chats: { Positive: 0, Negative: 0 },
    };

    dailySentiments.forEach((sentiment) => {
      const { emails, phone_calls, chats } = sentiment.sentiment_summary || {};

      emails?.forEach(email => {
        sentimentSummary.emails[email.sentiment] += 1;
      });

      phone_calls?.forEach(call => {
        sentimentSummary.phone_calls[call.sentiment] += 1;
      });

      chats?.forEach(chat => {
        sentimentSummary.chats[chat.sentiment] += 1;
      });
    });

    return sentimentSummary;
  };

  const overallSentimentSummary = calculateSentimentSummary(dailySentiments);

  return (
    <div className="card">
      <h1>Portfolio for Client {id}</h1>
      <p>Portfolio ID: {portfolio?.portfolio_id}</p>
      <p>Total Portfolio Value: ${portfolio?.total_portfolio_value}</p>
      <p>Total Purchase Value: ${portfolio?.total_purchase_value}</p>
      <p>Profit/Loss: ${portfolio?.profit_loss} ({portfolio?.p_l_percent}%)</p>

      {/* Satisfaction Score in Top Right */}
      {satisfaction && (
        <div className="satisfaction-score">
          Satisfaction: {satisfaction.overall_satisfaction_score}%<br />
          Level: {satisfaction.satisfaction_level}
        </div>
      )}

      <h2>Daily Portfolio Changes and Sentiments</h2>
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Portfolio Value</th>
            <th>Profit/Loss</th>
            <th>Overall Sentiment</th>
            <th>Reason for Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {portfolio?.daily_changes?.length > 0 ? (
            portfolio.daily_changes.map((change, index) => {
              const dailySentiment = dailySentiments.find(sentiment =>
                new Date(sentiment.date).toLocaleDateString() === new Date(change.date).toLocaleDateString()
              );
              const sentimentSummary = dailySentiment?.sentiment_summary || {}; // Ensure sentiment_summary exists

              return (
                <tr key={index}>
                  <td>{new Date(change.date).toLocaleDateString()}</td>
                  <td>${change.portfolio_value}</td>
                  <td>${change.profit_loss}</td>
                  <td>{sentimentSummary?.overall_daily_sentiment || 'N/A'}</td>
                  <td>{dailySentiment?.reason_for_sentiment || 'N/A'}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Sentiment Summary Section */}
      <h2>Sentiment Summary</h2>
      <table className="sentiment-summary-table">
        <thead>
          <tr>
            <th>Communication Type</th>
            <th>Positive</th>
            <th>Negative</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Emails</td>
            <td>{overallSentimentSummary.emails.Positive}</td>
            <td>{overallSentimentSummary.emails.Negative}</td>
          </tr>
          <tr>
            <td>Phone Calls</td>
            <td>{overallSentimentSummary.phone_calls.Positive}</td>
            <td>{overallSentimentSummary.phone_calls.Negative}</td>
          </tr>
          <tr>
            <td>Chats</td>
            <td>{overallSentimentSummary.chats.Positive}</td>
            <td>{overallSentimentSummary.chats.Negative}</td>
          </tr>
        </tbody>
      </table>

      {/* Risk Analysis Section */}
      <h2>Risk Analysis</h2>
      {dailyRisks.length > 0 ? (
        dailyRisks.map((risk, index) => (
          <div key={index} className="risk-analysis">
            <h3>Date: {new Date(risk.date).toLocaleDateString()}</h3>
            <p><strong>Risk Score:</strong> {risk.risk_analysis.risk_score}</p>
            <p><strong>Risk Level:</strong> {risk.risk_analysis.risk_level}</p>
            <p><strong>Trend Analysis:</strong> {risk.risk_analysis.trend_analysis}</p>
          </div>
        ))
      ) : (
        <p>No risk analysis data available</p>
      )}
    </div>
  );
};

export default ClientPortfolio;
