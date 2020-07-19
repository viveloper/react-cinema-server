const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const jsonData = fs.readFileSync(
    path.resolve(__dirname, '../data/users/users.json')
  );
  const usersData = JSON.parse(jsonData);
  if (usersData.users.find((user) => user.email === email)) {
    res.status(200).json({ success: false, error: 'exist user' });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    usersData.users.push({ name, email, password: hash });
    fs.writeFileSync(
      path.resolve(__dirname, '../data/users/users.json'),
      JSON.stringify(usersData)
    );
    const token = getToken({ name, email });
    res.status(200).json({ success: true, token });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const jsonData = fs.readFileSync(
    path.resolve(__dirname, '../data/users/users.json')
  );
  const usersData = JSON.parse(jsonData);
  const user = usersData.users.find((user) => user.email === email);

  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, error: 'Please provide an email and password' });
  if (!user)
    return res
      .status(401)
      .json({ success: false, error: 'Invalid credentials(not exist email)' });
  if (!(await matchPassword(password, user.password)))
    return res
      .status(401)
      .json({ success: false, error: 'Invalid credentials(wrong password)' });

  const token = getToken({ name: user.name, email: user.email });
  res.status(200).json({ success: true, token });
};

function getToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
}

async function matchPassword(enteredPassword, hashedPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
}
