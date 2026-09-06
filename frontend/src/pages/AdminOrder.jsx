import { useState, useEffect } from 'react';
import api from '../api/axios';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/all');
        setOrders(res.data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
      try {
        await api.put(`/orders/${orderId}/status`, { status: newStatus });
        setOrders(orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } catch (err) {
        console.error('Failed to update status');
      }
    };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-500 mb-1">Order ID: {order._id}</p>
            <p className="text-sm text-gray-500 mb-1">User: {order.user}</p>
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[order.status]}`}>
                {order.status}
              </span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border rounded p-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <p className="text-xl font-bold mb-3">Total: ${order.totalAmount}</p>
            <ul className="border-t pt-3 space-y-1">
              {order.items.map((item) => (
                <li key={item._id} className="text-sm text-gray-700">
                  Product: {item.product.name} — Qty: {item.quantity} — Price: ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;