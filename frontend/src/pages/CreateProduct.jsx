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
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setImageURL('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div>
      <h1>Create Product</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          min="0"
          step="0.01"
          required
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          min="0"
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
        />
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;