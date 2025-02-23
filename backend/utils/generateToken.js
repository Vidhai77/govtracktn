import jwt from 'jsonwebtoken';

export const generateToken = _id => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
