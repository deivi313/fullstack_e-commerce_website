import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ where: { email } });

    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user.id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //checking user already exist or not
    const exist = await userModel.findOne({ where: { email } });

    if (exist) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // validation email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user.id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//route for admin login
const adminLogin = async (req, res) => {
  try {

    const { email, password } = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })

    } else {
      res.json({ success: false, message: "Invalid credencials" })
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get the logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findByPk(userId, {
      attributes: ["name", "email", "address"],
    });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: { name: user.name, email: user.email, address: user.address || {} },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update the logged-in user's name and delivery details
const addressFields = [
  "firstName",
  "lastName",
  "street",
  "city",
  "state",
  "zipcode",
  "country",
  "phone",
];

const updateProfile = async (req, res) => {
  try {
    const { userId, name, address } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.json({ success: false, message: "Name is required" });
    }

    // keep only the known fields, as trimmed strings
    const cleanAddress = {};
    for (const field of addressFields) {
      const value = address?.[field];
      cleanAddress[field] =
        typeof value === "string" || typeof value === "number"
          ? String(value).trim().slice(0, 100)
          : "";
    }

    await userModel.update(
      { name: name.trim(), address: cleanAddress },
      { where: { id: userId } },
    );

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export { loginUser, registerUser, adminLogin, getProfile, updateProfile };