const asyncHandler = require("express-async-handler");
const Contact = require("../Models/Contact");
const sendEmail = require("../Utils/sendEmail");
const { getContactEmail } = require("../Utils/emailTemplates");

const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ success: false, message: "Name, email and message are required." });
  const contact = await Contact.create({ name, email, subject, message });
  await sendEmail({ 
    to: email, 
    subject: "We received your Stack Adda message", 
    html: getContactEmail(name)
  });
  res.status(201).json({ success: true, message: "Message sent successfully. We will get back to you soon.", contact });
});
const getContacts = asyncHandler(async (req, res) => { const contacts = await Contact.find().sort({ createdAt: -1 }); res.json({ success: true, contacts }); });
const updateContact = asyncHandler(async (req, res) => { const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }); if (!contact) return res.status(404).json({ success: false, message: "Message not found." }); res.json({ success: true, contact }); });
module.exports = { createContact, getContacts, updateContact };
