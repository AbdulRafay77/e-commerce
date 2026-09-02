const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if ( !authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Header does not exists.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded
    next();

  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;