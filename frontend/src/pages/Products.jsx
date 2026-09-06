import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const [orderMessage, setOrderMessage] = useState('');
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
      await api.post('/orders', {
        items: [{ productId, quantity }]
      });
      setOrderMessage('Order placed successfully!');
    } catch (err) {
      setOrderMessage(err.response?.data?.message || 'Order failed');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      {orderMessage && (
        <p className="mb-4 text-green-600 font-medium">{orderMessage}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg shadow-md p-4 flex flex-col">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <p className="text-xl font-bold mb-1">${product.price}</p>
            <p className="text-sm text-gray-500 mb-3">In stock: {product.stock}</p>

            {user && (
              <div className="mt-auto flex gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;