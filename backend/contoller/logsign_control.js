const log_reg = require('../model/logsign');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtsecret='lifs123'

// Fetch all users
const getusers = async (req, res) => {
    try {
        const data = await log_reg.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getus= async (req, res) => {
  try {
    const user = await log_reg.findOne({ email: req.params.email }, 'name email mob image');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user by email
const user = async (req, res) => {
    const { email } = req.body;
    try {
        const chkuser = await log_reg.findOne({ email });
        if (!chkuser) {
            return res.status(400).send("Email does not exist");
        }
        res.json(chkuser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Register new user
const postuser = async (req, res) => {
    const { name, email, password,mob } = req.body;
    try {
        const chkuser = await log_reg.findOne({ email });
        if (chkuser) {
            return res.status(400).send("Email already exists");
        }

        const hashpwd = await bcrypt.hash(password, 10);
        const user = new log_reg({ name, email, password: hashpwd ,mob,image:req.file.filename});
        await user.save();
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
const loginuser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await log_reg.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email ");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid password");
        }

        const token = jwt.sign({ id: user._id }, jwtsecret, { expiresIn: "1d" });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getusers, user, postuser, loginuser,getus };
