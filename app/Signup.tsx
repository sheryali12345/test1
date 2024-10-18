import React, { useState } from 'react';

interface SignupProps {
  onSignup: (email: string, password: string, name: string) => Promise<void>;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSignup(email, password, name);
      // Handle successful signup (e.g., redirect to login page or dashboard)
    } catch (error) {
      // Handle signup error (e.g., show error message)
      console.error('Signup failed:', error);
    }
  };

  return (
    <div>
      {/* Signup form UI will be added here later */}
    </div>
  );
};

export default Signup;