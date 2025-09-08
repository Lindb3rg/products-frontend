import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { api } from '../services/api';

interface OrderUpdateData {
    customer_name: string;
    customer_email: string;
}

const UpdateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<OrderUpdateData>({
    customer_name: '',
    customer_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>('/orders/');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setFormData({
        customer_name: order.customer_name,
        customer_email: order.customer_email,
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value  // Simplified - removed unnecessary processedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder) return;
    
    if (!formData.customer_name.trim()) {
      setError('Customer name is required');
      return;
    }

    if (!formData.customer_email.trim()) {
        setError('Customer email is required'); // Fixed error message
        return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.patch(`/orders/${selectedOrder.id}`, formData);
      
      // Update the order in the list
      setOrders(orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, ...formData }
          : order
      ));
      
      setSelectedOrder(null);
      setFormData({ customer_name: '', customer_email: '' }); // Reset form
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Order with this name already exists');
      } else if (err.response?.status === 404) {
        setError('Order not found');
      } else {
        setError('Failed to update order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelUpdate = () => {
    setSelectedOrder(null);
    setFormData({ customer_name: '', customer_email: ''});
    setError('');
  };

  if (orders.length === 0 && !error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Update Order</h2>
        <p>No orders available to update.</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Update Order</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee' }}>
          {error}
        </div>
      )}

      {!selectedOrder ? (
        <>
          <p>Select an order to update:</p>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginTop: '1rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem' }}>{order.customer_name}</td>
                  <td style={{ padding: '0.75rem' }}>{order.customer_email}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() => handleOrderSelect(order)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div style={{ maxWidth: '500px' }}>
          <h3>Update: {selectedOrder.customer_name}</h3>
          
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="customer_name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Customer Name *
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"  // Fixed: was "name", now matches formData key
                value={formData.customer_name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="customer_email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Customer Email *
              </label>
              <input
                type="email"  // Changed to email type for better validation
                id="customer_email"
                name="customer_email"  // Fixed: was "email", now matches formData key
                value={formData.customer_email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Updating...' : 'Update Order'}
              </button>
              
              <button
                type="button"
                onClick={cancelUpdate}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateOrder;