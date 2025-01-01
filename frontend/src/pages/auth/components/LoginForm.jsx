import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(email, password);

      if (response.success) {
        toast({
          title: 'Login successful',
          description: 'You have successfully logged in.',
          variant: 'success',
          className: 'bg-green-200 border-green-400 text-black',
          duration: 3000,
        });
        

      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Error logging in:', err);
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
      className="space-y-6 bg-white"
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
            type={showPassword ? 'text' : 'password'}
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
            {showPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
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
        <Link to="/auth/register" className="text-sm underline text-orange-600 hover:text-orange-500">
          Create an account
        </Link>
      </div>
    </motion.form>
  );
}
