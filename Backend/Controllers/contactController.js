const asyncHandler = require("express-async-handler");
const Contact = require("../Models/Contact");
const User = require("../Models/User");
const sendEmail = require("../Utils/sendEmail");
const { getContactEmail, getNewContactAdminAlertEmail, getContactReadEmail, getContactResolvedEmail } = require("../Utils/emailTemplates");

const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ success: false, message: "Name, email and message are required." });
  const contact = await Contact.create({ name, email, subject, message });
  
  await sendEmail({ 
    to: email, 
    subject: "We received your Stack Adda message", 
    html: getContactEmail(name)
  });

  try {
    const admins = await User.find({ role: "admin" }).select("email");
    const adminEmails = admins.map(admin => admin.email).filter(Boolean);
    
    if (adminEmails.length > 0) {
      await sendEmail({
        to: adminEmails.join(", "),
        subject: `New Contact Submission from ${name}`,
        html: getNewContactAdminAlertEmail(name, email, subject, message)
      });
    }
  } catch (error) {
    console.error("Failed to send admin notification for contact:", error);
  }

  res.status(201).json({ success: true, message: "Message sent successfully. We will get back to you soon.", contact });
});
const getContacts = asyncHandler(async (req, res) => { const contacts = await Contact.find().sort({ createdAt: -1 }); res.json({ success: true, contacts }); });
const updateContact = asyncHandler(async (req, res) => { 
  const { status, replyMessage } = req.body;
  const contact = await Contact.findById(req.params.id); 
  
  if (!contact) return res.status(404).json({ success: false, message: "Message not found." }); 

  // If status changes to 'read'
  if (status === 'read' && contact.status !== 'read' && contact.status !== 'closed') {
    await sendEmail({
      to: contact.email,
      subject: "We're reviewing your message",
      html: getContactReadEmail(contact.name, contact.subject)
    });
  }

  // If status changes to 'closed'
  if (status === 'closed' && contact.status !== 'closed') {
    await sendEmail({
      to: contact.email,
      subject: `Update on your message: ${contact.subject || 'General enquiry'}`,
      html: getContactResolvedEmail(contact.name, contact.subject, replyMessage)
    });
  }

  contact.status = status;
  await contact.save();

  res.json({ success: true, contact }); 
});
module.exports = { createContact, getContacts, updateContact };
