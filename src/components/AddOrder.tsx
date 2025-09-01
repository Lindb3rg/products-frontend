import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, OrderItem } from '../types';
import { api } from '../services/api';

interface OrderFormData {
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
}

interface AddOrderProps {
    onSuccess?: () => void;
  }

const AddOrder: React.FC<AddOrderProps> = ({onSuccess}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    customer_email: '',
    items: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>('/products/');
      setProducts(response.data.filter(p => p.stock_quantity > 0));
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addOrderItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_id: 0, quantity: 1 }]
    }));
  };

  const removeOrderItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id);
      return total + (product ? product.unit_price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name.trim()) {
      setError('Customer name is required');
      return;
    }
    
    if (!formData.customer_email.trim()) {
      setError('Customer email is required');
      return;
    }
    
    if (formData.items.length === 0) {
      setError('At least one item is required');
      return;
    }
    
    for (const item of formData.items) {
      if (item.product_id === 0) {
        setError('Please select products for all items');
        return;
      }
      if (item.quantity <= 0) {
        setError('Quantity must be greater than 0');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      
      const orderBatch = {
        order_list: [formData]
      };
      
      await api.post('/orders/', orderBatch);
      console.log(orderBatch.order_list)

      if (onSuccess) {
        onSuccess(); 
      } else {
        navigate('/orders');
      }

    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('One or more products not found');
      } else if (err.response?.status === 400) {
        setError(err.response.data.detail || 'Insufficient stock for one or more items');
      } else {
        setError('Failed to create order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getAvailableStock = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.stock_quantity : 0;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add New Order</h2>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="customer_name" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Customer Name *
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            required
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
            type="email"
            id="customer_email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label>Order Items *</label>
            <button
              type="button"
              onClick={addOrderItem}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Item
            </button>
          </div>
          
          {formData.items.map((item, index) => (
            <div key={index} style={{
              border: '1px solid #ddd',
              padding: '1rem',
              marginBottom: '0.5rem',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label>Product</label>
                  <select
                    value={item.product_id}
                    onChange={(e) => updateOrderItem(index, 'product_id', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value={0}>Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock_quantity})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={{ width: '100px' }}>
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={getAvailableStock(item.product_id)}
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeOrderItem(index)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {formData.items.length > 0 && (
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Order Summary</h4>
            {formData.items.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{getProductName(item.product_id)} x {item.quantity}</span>
                <span>${(products.find(p => p.id === item.product_id)?.unit_price || 0) * item.quantity}</span>
              </div>
            ))}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/orders')}
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
  );
};

export default AddOrder;