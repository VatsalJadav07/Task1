const User = require('../Model/user.model');
const Role = require('../Model/role.model');
const UserRole = require('../Model/userRole');
const bcrypt = require('bcrypt')

const addRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    if (!roleName) {
      return res.status(400).json({ error: 'Role name is required.' });
    }
    const newRole = new Role({ roleName });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roles } = req.body;

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one digit and one uppercase letter' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    for (const roleName of roles) {
      const role = await Role.findOne({ roleName: roleName });
      if (!role) {
        return res.status(400).json({ message: `Role ${roleName} does not exist` });
      }
      await UserRole.create({ userId: user._id, roleId: role._id });
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const userRoles = await UserRole.find({ userId: user._id }).populate('roleId');
    const roles = userRoles.map(userRole => userRole.roleId.roleName);

    if (!roles.length) {
      return res.status(400).json({ message: "User roles not found" });
    }

    const token = user.generateAuthToken();

    return res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getUsersList = async (req, res) => {
  try {
    const userRoles = await UserRole.find().populate('userId roleId');
    const users = userRoles.map(userRole => ({
      firstName: userRole.userId.firstName,
      lastName: userRole.userId.lastName,
      email: userRole.userId.email,
      roles: [userRole.roleId.roleName]
    }));
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRoles = await UserRole.find({ userId: user._id }).populate('roleId');
    const roles = userRoles.map(userRole => userRole.roleId.roleName);

    return res.status(200).json({ user: { firstName: user.firstName, lastName: user.lastName, email: user.email }, roles });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addRole,
  Register,
  login,
  getUsersList,
  getUser
};