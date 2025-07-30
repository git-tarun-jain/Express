import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function registerUser(req, res) {
    const { fname, lname, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.send('Email already exists. <a href="/register">Try again</a>');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fname, lname, email, password: hashedPassword });
    await newUser.save();
    res.send('User registered! <a href="/">Login</a>');
}

export async function changePasswordPage(req, res) {
    const uid = req.params.id;
    res.render('change-password.ejs', { uid });
}

export async function changePassword(req, res) {
    const { oldPass, newPass, confirmNewPass } = req.body;
    const uid = req.params.id;
    const user = req.session.user;
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if(!isMatch || (newPass !== confirmNewPass)) {
        return res.send('Incorrect password or mismatch. <a href="/change-password/'+ uid +'">Try again</a>');
    }
    const hashedPassword = await bcrypt.hash(newPass, 10);
    await User.findByIdAndUpdate(uid, { 
        fname: user.fname, 
        lname: user.lname, 
        email: user.email, 
        password: hashedPassword 
    });
    res.redirect('/dashboard');
}

export function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        res.redirect('/');
    });
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.send('User not found. <a href="/">Try again</a>');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.send('Incorrect password. <a href="/">Try again</a>');
    req.session.user = user;
    res.redirect('/dashboard');
}

export async function welcomeUser(req, res) {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('dashboard.ejs', {
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        id: req.session.user._id
    });
}

export function registerPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
}

export function loginPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}