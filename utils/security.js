// Security utilities for validation and sanitization
const validator = require('validator');

// Password strength validation
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

// Validate credit amount (prevent negative or excessive amounts)
const validateCreditAmount = (amount) => {
  const num = parseInt(amount);
  return num > 0 && num <= 1000; // Max 1000 credits per transaction
};

module.exports = {
  validatePassword,
  validateEmail,
  sanitizeInput,
  validateCreditAmount
};
