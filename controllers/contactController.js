import Contact from '../models/Contact.js';
import { sendMail } from '../models/Mailer.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function contactPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'contact.html'));
}

export async function sendEmail(req, res) {
    const { to, subject, message } = req.body;
    const file = req.file;
    const attachment = req.file.path;
    try {
        await sendMail(to, subject, message, file);
        const newContact = new Contact({ to, subject, message, attachment });
        await newContact.save();
        res.send('Email sent successfully');
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).send('Email failed');
    }
}