import { useState } from 'react';
import api from '../api/axios';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('electronics');
  const [imageURL, setImageURL] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.post('/products', {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        imageURL
      });
      setMessage('Product created successfully!');
      setIsError(false);
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setImageURL('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create product');
      setIsError(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Create Product</h1>
        {message && <p className={isError ? 'text-red-600 mb-4' : 'text-green-600 mb-4'}>{message}</p>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="w-full border rounded-lg p-3 mb-4"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full border rounded-lg p-3 mb-4"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          min="0"
          step="0.01"
          required
          className="w-full border rounded-lg p-3 mb-4"
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          min="0"
          required
          className="w-full border rounded-lg p-3 mb-4"
        />
        <select className="w-full border rounded-lg p-3 mb-4" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="food">Food</option>
          <option value="books">Books</option>
        </select>
        <input
          type="text"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          placeholder="Image URL"
          className="w-full border rounded-lg p-3 mb-4"
        />
        {imageURL && (
          <img
            src={imageURL}
            alt="Preview"
            onError={(e) => { e.target.style.display = 'none'; }}
            onLoad={(e) => { e.target.style.display = 'block'; }}
            className="w-full h-40 object-cover rounded mb-4"
          />
        )}
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;