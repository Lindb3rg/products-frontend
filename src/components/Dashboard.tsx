import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Product Management Dashboard</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginTop: '2rem' 
      }}>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '1.5rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📦 Products</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Manage Inventory Products</div>
        </button>

        <button
          onClick={() => navigate('/orders')}
          style={{
            padding: '1.5rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📋 Orders</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Manage Product Orders</div>
        </button>


      </div>
    </div>
  );
};

export default Dashboard;