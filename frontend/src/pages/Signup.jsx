import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUser] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(username, email, password);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-w-sm mx-auto mt-20 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign up</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Username"
        required
        className="w-full border rounded-lg p-3 mb-4"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full border rounded-lg p-3 mb-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full border rounded-lg p-3 mb-4"
      />
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">Sign up</button>
    </form>
  );
};

export default Signup;