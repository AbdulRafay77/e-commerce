// components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/products">Products</Link>
      {user ? (
        <>
          <span>Welcome, {user.username}</span>
          <button onClick={logout}>Log Out</button>
          <Link to="/my-orders">My Orders</Link>
          {user.role === 'admin' && <Link to="/admin/create-product">Create Product</Link>}
        </>
      ) : (
        <>
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;