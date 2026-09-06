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
    <div>
      <h1>Products</h1>
      {orderMessage && <p>{orderMessage}</p>}
      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <p>In stock: {product.stock}</p>

          {user && user.role === 'customer' && (
            <>
              <input
                type="number"
                min="1"
                value={quantities[product._id] || 1}
                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
              />
              <button onClick={() => handleOrder(product._id)}>Add to Order</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Products;