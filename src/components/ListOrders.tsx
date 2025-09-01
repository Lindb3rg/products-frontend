import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  order_batch_id: number;
  order_date: string;
}

const ListOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get<Order[]>('/orders/');
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'completed':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    
  

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginTop: '1rem'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Order ID
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Customer
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Email
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Total
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Status
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Batch ID
              </th>
              <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '2px solid #dee2e6' 
              }}>
                Order Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id}
                style={{ borderBottom: '1px solid #dee2e6' }}
              >
                <td style={{ padding: '0.75rem' }}>
                  #{order.id}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {order.customer_name}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {order.customer_email}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  ${order.total_amount.toFixed(2)}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(order.status),
                    color: 'white',
                    fontSize: '0.875rem'
                  }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {order.order_batch_id}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {order.order_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListOrders;