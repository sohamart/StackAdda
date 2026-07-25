const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://StackAdda_Admin:cn0mmzE2vxlYMLYL@stackadda.lppuecn.mongodb.net/test";

// User schema definition
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #09090b;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #0c0c0e;
      border: 1px solid #27272a;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      color: #f97316;
      text-decoration: none;
      letter-spacing: -0.05em;
    }
    .header {
      margin-top: 30px;
      border-bottom: 1px solid #27272a;
      padding-bottom: 20px;
    }
    h1 {
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 10px 0;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #a1a1aa;
      margin: 0 0 20px 0;
    }
    .feature-list {
      margin-top: 30px;
    }
    .feature-item {
      margin-bottom: 24px;
    }
    .feature-title {
      font-size: 16px;
      font-weight: 700;
      color: #f97316;
      margin-bottom: 6px;
    }
    .feature-desc {
      font-size: 14px;
      line-height: 1.5;
      color: #d4d4d8;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #27272a;
      padding-top: 20px;
      font-size: 12px;
      color: #71717a;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background: #f97316;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      font-weight: bold;
      font-size: 14px;
      border-radius: 12px;
      margin-top: 20px;
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Stack Adda</div>
    <div class="header">
      <h1>New Features & System Upgrades!</h1>
      <p>Hello there,</p>
      <p>We are excited to share a series of updates and premium upgrades implemented on the Stack Adda platform today to elevate your software development learning experience.</p>
    </div>
    
    <div class="feature-list">
      <div class="feature-item">
        <div class="feature-title">1. Mobile-Friendly Image Cropper (1:1 Aspect Ratio)</div>
        <div class="feature-desc">Students and admins can now crop their profile pictures locally inside a premium 1:1 rounded square crop window before uploading, preventing scaling/rotation issues and failed uploads.</div>
      </div>
      
      <div class="feature-item">
        <div class="feature-title">2. In-App Classroom Video Player</div>
        <div class="feature-desc">Watch coding lessons directly within Stack Adda without leaving the platform. Seamlessly stream course videos using our custom video player integrated with the syllabus interface.</div>
      </div>
      
      <div class="feature-item">
        <div class="feature-title">3. Live YouTube Statistics Integration</div>
        <div class="feature-desc">Our home page statistics (Subscribers, Total Views, Total Videos) are now synchronized in real-time using direct API calls, showcasing live growth statistics.</div>
      </div>
      
      <div class="feature-item">
        <div class="feature-title">4. Instructors Directory & Direct Contacts</div>
        <div class="feature-desc">A new "Instructors" view is available in the student dashboard where students can find verified teachers and contact them directly via Telegram, Instagram, or Email.</div>
      </div>
      
      <div class="feature-item">
        <div class="feature-title">5. Auto-Scrolling Branded Sponsor Banner</div>
        <div class="feature-desc">A premium infinite scrolling logo marquee showcasing world-class developer tools and platforms (Google, Vercel, Stripe, GitHub, etc.) has been added to the landing page.</div>
      </div>
      
      <div class="feature-item">
        <div class="feature-title">6. Multi-Channel Directory</div>
        <div class="feature-desc">Explore different parts of the Stack Adda network using our new "Channels" navigation directory, grouping official playlists, shorts, and live hubs.</div>
      </div>

      <div class="feature-item">
        <div class="feature-title">7. Admin Google Authentication & Redirections</div>
        <div class="feature-desc">Administrators can now authenticate securely using Google Sign-In. Password reset flow paths and redirectional pathways have also been fully fixed.</div>
      </div>
    </div>
    
    <center>
      <p style="color: #ffffff; font-size: 16px; margin-bottom: 25px;">
        Live Website Link: <a href="https://stack-adda.vercel.app" style="color: #f97316; font-weight: bold; text-decoration: underline;">https://stack-adda.vercel.app</a>
      </p>
      <a href="https://stack-adda.vercel.app" class="btn">Explore New Upgrades</a>
    </center>
    
    <div class="footer">
      This is a system notification from Stack Adda. Please do not reply directly to this email.<br/>
      &copy; 2026 Stack Adda. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

async function run() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully!");

    console.log("Fetching users list...");
    const users = await User.find({}).select("email name");
    console.log(`Found ${users.length} users in the database.`);

    if (users.length === 0) {
      console.log("No users found. Aborting broadcast.");
      return;
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
      console.error("Missing SMTP credentials in process.env. Aborting.");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false }
    });

    console.log("Starting email broadcast...");
    let sentCount = 0;
    
    for (const u of users) {
      try {
        console.log(`Sending email to: ${u.email} (${u.name})...`);
        await transporter.sendMail({
          from: SMTP_FROM,
          to: u.email,
          subject: "Stack Adda - New Features & Upgrades Live Now!",
          html: emailHtml
        });
        sentCount++;
        console.log(`Successfully sent email to ${u.email}`);
      } catch (sendErr) {
        console.error(`Failed to send email to ${u.email}:`, sendErr.message);
      }
    }

    console.log(`Broadcast completed! Total sent: ${sentCount}/${users.length}`);
  } catch (err) {
    console.error("Error running email script:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

run();
