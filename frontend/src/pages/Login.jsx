import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import image from '../assets/idevice-logo-1.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    type: 'technician',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.type !== formData.type) {
        setError('Incorrect user type selected');
        return;
      }

      localStorage.setItem('user', JSON.stringify(response.data));

      if (response.data.type === 'job_creator') {
        navigate('/job-creator');
      } else if (response.data.type === 'technician') {
        navigate('/technician');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-4"
        style={{  backgroundImage: `url(${image})` }} // File in public folder
      >
        <h1 className="text-3xl font-bold text-amber-50 text-center mb-6">
          Welcome to i Device Solutions Job Management System
        </h1>

        <div className="w-full max-w-md p-8 space-y-6 bg-white/90 rounded shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-600">Select User Type</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="technician"
                    checked={formData.type === 'technician'}
                    onChange={handleChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Technician</span>
                </label>

                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="job_creator"
                    checked={formData.type === 'job_creator'}
                    onChange={handleChange}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Job Creator</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
