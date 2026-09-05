const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken.js');
const User = require('../models/User');

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const rawToken = crypto.randomBytes(40).toString('hex');

  await RefreshToken.create({
    token: rawToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { accessToken, refreshToken: rawToken };
};

const signup = async (req, res) => {
  try{
    const { username, email, password } = req.body;

    const user = await User.create({ username, email, password });
    
    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ accessToken, user: { id: user._id, username: user.username, role: user.role } });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken, user: { id: user._id, username: user.username, role: user.role } });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if(!token) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    const storedToken = await RefreshToken.findOne({ token });

    if(!storedToken){
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    await RefreshToken.findByIdAndDelete(storedToken._id);

    const user = await User.findById(storedToken.userId);

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken, user: { id: user._id, username: user.username, role: user.role } });
    
  }catch (err){
    res.status(401).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token){
      await RefreshToken.findOneAndDelete({ token });
    }

    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out' });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login, refresh, logout };