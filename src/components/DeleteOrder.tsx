import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, Product } from '../types';
import { api } from '../services/api';
import { getProductName } from '../utils/productUtils';

const DeleteOrder: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); 

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>('/orders/');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>('/products/');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      await api.delete(`/orders/${selectedOrder.id}`);
      

      setOrders(orders.filter(p => p.id !== selectedOrder.id));
      setSelectedOrder(null);
      setShowConfirmation(false);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Order not found');
      } else {
        setError('Failed to delete order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  const cancelDelete = () => {
    setSelectedOrder(null);
    setShowConfirmation(false);
  };

  if (orders.length === 0 && !error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Delete Order</h2>
        <p>No orders available to delete.</p>
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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Delete Order</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee' }}>
          {error}
        </div>
      )}

      {!showConfirmation ? (
        <>
          <p>Select a order to delete:</p>
          <div style={{ marginTop: '1rem' }}>
            {orders.map((order) => (
              <div 
                key={order.id}
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                onClick={() => handleOrderSelect(order)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{order.customer_name}</h4>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{order.customer_email}</h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      Order ID: {order.id.toFixed(2)} | Order Batch ID: {order.order_batch_id} |
                      Total amount: {order.total_amount.toFixed(2)} | Status: {order.status}
                      
                      <div style={{ marginTop: '0.5rem' }}>
                        <strong>Order Details:</strong>
                        <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                          {order.order_details.map((detail, index) => (
                            <li key={index} style={{ fontSize: '0.9rem', color: '#666' }}>

                              <li>Product ID: {detail.product_id}</li>
                              <li>Product Name: {getProductName(detail.product_id,products)}</li>
                              <li>Qty: {detail.quantity}</li>
                              <li>Price {detail.unit_price}</li>
                            </li>
                          ))}
                        </ul>
                      </div>



                    </p>
                  </div>
                  <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    Delete
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this order?</p>
          
          <div style={{
            border: '2px solid #dc3545',
            padding: '1rem',
            margin: '1rem 0',
            borderRadius: '4px',
            backgroundColor: '#fff5f5'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#dc3545' }}>
              {selectedOrder?.id}
            </h4>
            <p style={{ margin: 0 }}>
              Price: ${selectedOrder?.total_amount.toFixed(2)} | 
              Stock: {selectedOrder?.status}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={confirmDelete}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            
            <button
              onClick={cancelDelete}
              disabled={loading}
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
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
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
    </div>
  );
};

export default DeleteOrder;