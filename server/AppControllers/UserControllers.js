import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

dotenv.config(); 


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const getToken = (user) => {
    return jwt.sign(
        { id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }
    );        
};

export const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const token = getToken(newUser);

        res.status(201).json({
            status: 1,
            message: 'User registered successfully',
            token,
            user: { 
                id: newUser._id, 
                email: newUser.email,
                fullName: `${newUser.firstName} ${newUser.lastName}`
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 0,
            message: 'Server error',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = getToken(user);

        res.status(200).json({
            status: 1,
            message: 'Login successful',
            token,
            user: { 
                id: user._id, 
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 0,
            message: 'Server error',
            error: error.message
        });
    }
};
