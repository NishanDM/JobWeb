import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { X, ChevronRight } from 'lucide-react';
import JobForm from '../components/JobForm';
import AllJobs from '../components/AllJobs'; // Assuming you have an AllJobs component
import Register from '../components/Register';
import MyJobs from '../components/MyJobs';
import CompletedJobs from '../components/CompletedJobs'; // Assuming you have a CompletedJobs component
import { NavLink } from 'react-router-dom';


const CreatorProfile = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('welcome');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.type !== 'job_creator') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { id: 'createJob', label: 'New Job' },
    { id: 'myJobs', label: 'My Jobs' },
    { id: 'allJobs', label: 'All Jobs' },
    { id: 'registerTechnician', label: 'Register' },
    { id: 'editProfile', label: 'Edit Profile' },
    { id: 'completedJobs', label: 'Completed Jobs' },
  ];

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-300 shadow-md px-6 py-4 flex justify-between items-center">
  <div
    // onClick={() => (window.location.href = '/creator/dashboard')}
    className="text-xl font-bold text-gray-900"
  >
    Job Creator Dashboard
  </div>

  <div className="flex items-center space-x-4">
    <span className="hidden sm:inline text-gray-700 font-medium">
      {user?.email}
    </span>
    <strong className="hidden sm:inline text-gray-700 font-medium">
      {user?.type}
    </strong>

    <div onClick={() => (window.location.href = '/creator/profile')}>
      <FaUserCircle size={28} className="text-gray-700" />
    </div>

    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold transition cursor-pointer hover:bg-red-600"
    >
      Logout
    </button>
  </div>
</nav>



      {/* Page Content */}
      <div className="flex flex-1 relative">
        {/* Sidebar Toggle Button */}
        <div className="absolute top-6 left-2 z-50">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-700 bg-gray-300 border border-gray-300 p-2 rounded-full shadow hover:bg-gray-200 transition"
          >
            {showSidebar ? <X size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-40 bg-gray-900 p-6 shadow-md min-h-full pt-12 hidden md:block">
            <div className="flex flex-col gap-2 text-sm">
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 rounded-md font-medium transition text-white ${
                    activeTab === id ? 'bg-red-600 text-white' : 'bg-blue-500 hover:bg-red-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-10 transition-all duration-300 overflow-y-auto">
          {activeTab === 'welcome' && (
            <>
              <h1 className="text-3xl font-bold text-black mb-2">
                Welcome, {user?.username}!
              </h1>
              <p className="text-gray-800 text-lg">
                Use the sidebar to manage jobs, technicians, and your profile.
              </p>
            </>
          )}

          {activeTab === 'createJob' && <JobForm />}

          {activeTab === 'myJobs' && <MyJobs />}

          {activeTab === 'allJobs' && <AllJobs />}

          {activeTab === 'registerTechnician' && <Register/>}

          {activeTab === 'editProfile' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">📝 Edit Profile</h2>
              <p className="text-gray-600">Edit form goes here.</p>
              {/* TODO: Add edit profile form */}
            </div>
          )}
          {activeTab === 'completedJobs' && <CompletedJobs />}
          
        </main>
      </div>
    </div>
  );
};

export default CreatorProfile;
