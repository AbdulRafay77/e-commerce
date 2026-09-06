import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/products" className="text-lg font-bold hover:text-slate-300">
        E-Shop
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-slate-300">Welcome, {user.username}</span>
            <Link to="/my-orders" className="hover:text-slate-300">My Orders</Link>
            {user.role === 'admin' && (
              <Link to="/admin/create-product" className="hover:text-slate-300">
                Create Product
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-slate-300">Log In</Link>
            <Link to="/signup" className="hover:text-slate-300">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;