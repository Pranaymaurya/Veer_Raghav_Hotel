'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import { loginUser } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);
      if(data.user.role === 'admin') {
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white roooms"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <motion.input
          id="email"
          type="email"
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variants={inputVariants}
          whileFocus="focus"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <motion.input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variants={inputVariants}
            whileFocus="focus"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      {error && (
        <motion.p
          className="text-red-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
      <motion.button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Log in
      </motion.button>
      <div className="flex items-center justify-center mt-4 gap-1">
        Don't have an account?
        <Link href="/register" className="text-sm underline text-orange-600 hover:text-orange-500">
          Create an account
        </Link>
      </div>
    </motion.form>
  );
}

