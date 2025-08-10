import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchNotifications = async () => {
    try {
      if (!user?.email) return;

      const res = await axios.get(`http://localhost:5000/api/notifications?email=${encodeURIComponent(user.email)}`);

      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.email]);

  if (!user?.email) return <p>Technician email not found.</p>;

  return (
    <div className="p-4 bg-white shadow rounded max-w-lg">
      <h2 className="text-2xl font-bold mb-4">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map(({ _id, message, createdAt }) => (
            <li key={_id} className="border rounded p-3 bg-gray-50">
              <p className="text-gray-800">{message}</p>
              <small className="text-gray-500">{new Date(createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
