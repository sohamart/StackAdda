const mongoose = require("mongoose");
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, default: "General enquiry", trim: true, maxlength: 150 },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, enum: ["new", "read", "closed"], default: "new" },
}, { timestamps: true });
module.exports = mongoose.model("Contact", ContactSchema);
