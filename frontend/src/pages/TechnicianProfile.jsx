// src/TechnicianProfile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { X, ChevronRight } from 'lucide-react';
import MyJobsForTechnician from '../components/for_technician/MyJobsForTechnician' // Add this import at the top
import Notification from '../components/for_technician/Notification';


const TechnicianProfile = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('welcome');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.type !== 'technician') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { id: 'viewJobs', label: 'View My Jobs' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'contactCreator', label: 'Contact Job Creator' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">Technician Dashboard</div>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-gray-700 font-medium">{user?.email}</span>
          <strong className="hidden sm:inline text-gray-700 font-medium">{user?.type}</strong>
          <FaUserCircle size={28} className="text-gray-700" />
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-semibold transition"
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
            className="text-gray-700 bg-white border border-gray-300 p-2 rounded-full shadow hover:bg-gray-200 transition"
          >
            {showSidebar ? <X size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 bg-white p-6 shadow-md min-h-full pt-12 hidden md:block">
            <div className="flex flex-col gap-2 text-sm">
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2 rounded-md font-medium transition text-white ${
                    activeTab === id ? 'bg-black' : 'bg-blue-500 hover:bg-green-500'
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
              <h1 className="text-3xl font-semibold text-gray-800 mb-2">
                Welcome, {user?.username}!
              </h1>
              <p className="text-gray-600 text-lg">
                This is your Technician profile page. Use the sidebar to navigate your tasks.
              </p>
            </>
          )}
      {/* Add MyTasks component for viewing jobs */}
          {activeTab === 'viewJobs' && (<div><MyJobsForTechnician /></div> )}
          
          {activeTab === 'notifications' && (
            <div>
              {/* <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>
              <p className="text-gray-600">Your latest updates and alerts will appear here.</p> */}
              {/* TODO: Add notifications component */}
              <Notification />
              {/* <Notification /> */}
            </div>
          )}

          {activeTab === 'contactCreator' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">📞 Contact Job Creator</h2>
              <p className="text-gray-600">Contact form or chat interface goes here.</p>
              {/* TODO: Add contact form component */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TechnicianProfile;
