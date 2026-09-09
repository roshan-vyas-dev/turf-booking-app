const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Enter required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "user already existed" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const { password: hashedPassword, ...safeUser } = user.toObject();

    return res.status(201).json(safeUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


module.exports ={registerUser};
