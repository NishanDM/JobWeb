import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchNotifications = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications?username=${user?.username}`);
    setNotifications(res.data);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};




  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
    }
  }, [user?.email]);

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold border-b pb-2 mb-2">🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((note, idx) => (
            <li key={idx} className="bg-yellow-100 text-yellow-900 px-3 py-2 rounded">
              {note.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
