// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password (plaintext for simplicity; better to hash in real apps)
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Return user type and basic info, no token
  res.json({
    email: user.email,
    type: user.type,
    username: user.username, // optional
  });
});
