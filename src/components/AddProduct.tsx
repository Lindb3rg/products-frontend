import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface ProductFormData {
  name: string;
  category: string;
  unit_price: number;
  stock_quantity: number;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    unit_price: 0,
    stock_quantity: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get<string[]>('/categories/');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let processedValue: string | number = value;
  
    if (name === 'unit_price' || name === 'stock_quantity') {
        const numValue = parseFloat(value);
        processedValue = isNaN(numValue) ? 0 : numValue;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    
    if (formData.unit_price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    
    if (formData.stock_quantity < 0) {
      setError('Stock quantity cannot be negative');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.post('/products/', formData);
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Product with this name already exists');
      } else {
        setError('Failed to create product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add New Product</h2>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
          <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Category *
          </label>
          {categories.length > 0 ? (
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter new category"
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="unit_price" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Price ($) *
          </label>
          <input
            type="text"
            id="unit_price"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            min="0"
            step="0.1"
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
          <label htmlFor="stock_quantity" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Stock Quantity *
          </label>
          <input
            type="text"
            id="stock_quantity"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            min="0"
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

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
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          
          <button
            type="button"
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
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;