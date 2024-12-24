import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
// import { registerUser } from './api'; // Adjust the path to your API file

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userData = { name, email, password, phoneno, gender, age };
      const data = await register(userData);
      // Simulate login and navigate to the home page
      // console.log('User registered:', data);
      if (data.success) {
        toast({
          title: 'Registration successful',
          description: 'You have successfully registered.',
          variant: 'success',
        })
        navigate('/auth/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <motion.input
          id="name"
          type="text"
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variants={inputVariants}
          whileFocus="focus"
        />
      </div>
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
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <motion.input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variants={inputVariants}
            whileFocus="focus"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff className="h-5 w-5 text-gray-400" /> : <FiEye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <motion.input
          id="phoneno"
          type="tel"
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          value={phoneno}
          onChange={(e) => setPhoneno(e.target.value)}
          variants={inputVariants}
          whileFocus="focus"
        />
      </div>
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <motion.select
          id="gender"
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          variants={inputVariants}
          whileFocus="focus"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </motion.select>
      </div>
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Age
        </label>
        <motion.input
          id="age"
          type="number"
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          variants={inputVariants}
          whileFocus="focus"
        />
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
        Create Account
      </motion.button>
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <a href="/auth/login" className="font-medium text-orange-600 hover:text-orange-500">
          Log in
        </a>
      </p>
    </motion.form>
  );
}
