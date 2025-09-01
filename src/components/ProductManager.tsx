import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';
import UpdateProduct from './UpdateProduct';

type ProductView = 'list' | 'add' | 'delete' | 'update';

const ProductManager: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ProductView>('list');

  const renderActiveView = () => {
    switch (activeView) {
    case 'add':
        return <AddProduct onSuccess={() => setActiveView('list')} />;
      case 'delete':
        return <DeleteProduct />;
      case 'update':
        return <UpdateProduct />;
      default:
        return <ProductList />;
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div style={{
        padding: '1rem',
        borderBottom: '2px solid #dee2e6',
        backgroundColor: '#f8f9fa',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Product Management</h1>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
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
        
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginTop: '1rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveView('list')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeView === 'list' ? '#007bff' : '#e9ecef',
              color: activeView === 'list' ? 'white' : '#495057',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📋 List Products
          </button>
          
          <button
            onClick={() => setActiveView('add')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeView === 'add' ? '#007bff' : '#e9ecef',
              color: activeView === 'add' ? 'white' : '#495057',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ➕ Add Product
          </button>
          
          <button
            onClick={() => setActiveView('update')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeView === 'update' ? '#007bff' : '#e9ecef',
              color: activeView === 'update' ? 'white' : '#495057',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✏️ Update Product
          </button>
          
          <button
            onClick={() => setActiveView('delete')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeView === 'delete' ? '#007bff' : '#e9ecef',
              color: activeView === 'delete' ? 'white' : '#495057',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Delete Product
          </button>
        </div>
      </div>

      {/* Active View Content */}
      <div>
        {renderActiveView()}
      </div>
    </div>
  );
};

export default ProductManager;