import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [orderMessage, setOrderMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [imgError, setImgError] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
  };

  const handleOrder = async (productId) => {
    setOrderMessage('');
    const quantity = Number(quantities[productId]) || 1;
    try {
      await api.post('/orders', { items: [{ productId, quantity }] });
      setOrderMessage('Order placed successfully!');
    } catch (err) {
      setOrderMessage(err.response?.data?.message || 'Order failed');
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const saveEdit = async (productId) => {
    try {
      const res = await api.put(`/products/${productId}`, {
        ...editForm,
        price: Number(editForm.price),
        stock: Number(editForm.stock)
      });
      setProducts(products.map((p) => (p._id === productId ? res.data : p)));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to update product');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.error('Failed to delete product');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      {orderMessage && <p className="mb-4 text-green-600 font-medium">{orderMessage}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg shadow-md p-4 flex flex-col">
            {editingId === product._id ? (
              <>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="border rounded p-2 mb-2"
                />
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="border rounded p-2 mb-2"
                />
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => handleEditChange('price', e.target.value)}
                  className="border rounded p-2 mb-2"
                />
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => handleEditChange('stock', e.target.value)}
                  className="border rounded p-2 mb-2"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => saveEdit(product._id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={imgError[product._id] ? 'https://placehold.co/300x200?text=No+Image' : (product.imageURL || 'https://placehold.co/300x200?text=No+Image')}
                  alt={product.name}
                  onError={() => setImgError((prev) => ({ ...prev, [product._id]: true }))}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-xl font-bold mb-1">${product.price}</p>
                <p className="text-sm text-gray-500 mb-3">In stock: {product.stock}</p>

                {user && (
                  <div className="mt-auto flex gap-2 mb-2">
                    <input
                      type="number"
                      min="1"
                      value={quantities[product._id] || 1}
                      onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                      className="w-16 border rounded p-2"
                    />
                    <button
                      onClick={() => handleOrder(product._id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                    >
                      Add to Order
                    </button>
                  </div>
                )}

                {user?.role === 'admin' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(product)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;