const getBaseTemplate = (title, preheader, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #09090B;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background-color: #111113;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: 900;
      color: #f97316;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .content {
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.8);
      font-size: 16px;
    }
    .content h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 800;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content p {
      margin-bottom: 20px;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      display: inline-block;
      background-color: #f97316;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: #ea580c;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.4);
    }
    .preheader {
      display: none;
      max-height: 0px;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="container">
    <div class="card">
      <div class="header">
        <a href="#" class="logo">Stack Adda</a>
      </div>
      <div class="content">
        ${content}
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Stack Adda. All rights reserved.</p>
      <p>If you have any questions, reply to this email or contact support.</p>
    </div>
  </div>
</body>
</html>
`;

const getWelcomeEmail = (name) => {
  const content = `
    <h1>Welcome to Stack Adda, ${name}!</h1>
    <p>We're thrilled to have you join our community. You've taken the first step towards mastering modern web development.</p>
    <p>Get ready to build amazing projects and advance your career with our hands-on courses.</p>
    <div class="btn-container">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses" class="btn">Explore Courses</a>
    </div>
  `;
  return getBaseTemplate("Welcome to Stack Adda", "We're thrilled to have you join our community.", content);
};

const getEnrollmentEmail = (name, courseTitle, courseId) => {
  const content = `
    <h1>You're Enrolled! 🎉</h1>
    <p>Hi ${name},</p>
    <p>Congratulations on enrolling in <strong>${courseTitle}</strong>! You now have lifetime access to the course material.</p>
    <p>You can start learning right away by visiting your student dashboard.</p>
    <div class="btn-container">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/student/course/${courseId}" class="btn">Start Learning</a>
    </div>
  `;
  return getBaseTemplate("Course Enrollment Confirmation", `You are now enrolled in ${courseTitle}.`, content);
};

const getPasswordResetEmail = (resetUrl) => {
  const content = `
    <h1>Password Reset Request</h1>
    <p>We received a request to reset your password for your Stack Adda account.</p>
    <p>Click the button below to choose a new password. This link will expire in 15 minutes.</p>
    <div class="btn-container">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div>
    <p style="font-size: 14px; color: rgba(255,255,255,0.5);">If you didn't request this, you can safely ignore this email.</p>
  `;
  return getBaseTemplate("Reset Your Password", "Action required to reset your Stack Adda password.", content);
};

const getVerificationEmail = (name, verifyUrl) => {
  const content = `
    <h1>Verify Your Email Address</h1>
    <p>Hi ${name},</p>
    <p>Please click the button below to verify your email address and secure your Stack Adda account. This link will expire in 24 hours.</p>
    <div class="btn-container">
      <a href="${verifyUrl}" class="btn">Verify Email</a>
    </div>
  `;
  return getBaseTemplate("Verify Your Stack Adda Account", "Please verify your email address.", content);
};

const getRefundEmail = (courseTitle) => {
  const content = `
    <h1>Refund Processed</h1>
    <p>Your refund for <strong>${courseTitle}</strong> has been successfully processed.</p>
    <p>The amount should appear in your original payment method shortly. Access to the course has been removed from your account.</p>
    <p>We're sorry to see you go, but we hope you'll explore other courses with us in the future!</p>
  `;
  return getBaseTemplate("Refund Confirmation", `Your refund for ${courseTitle} has been processed.`, content);
};

const getContactEmail = (name) => {
  const content = `
    <h1>Thanks for reaching out!</h1>
    <p>Hi ${name},</p>
    <p>We have successfully received your message and our team will get back to you as soon as possible.</p>
    <p>In the meantime, feel free to browse our latest courses.</p>
  `;
  return getBaseTemplate("We received your message", "Thanks for contacting Stack Adda.", content);
};

const getAdminMessageEmail = (subject, message) => {
  const formattedMessage = message.replace(/\n/g, "<br/>");
  const content = `
    <h1>Important Update</h1>
    <p>${formattedMessage}</p>
  `;
  return getBaseTemplate(subject, subject, content);
};

const getLiveClassScheduledEmail = (courseTitle, classTitle, topic, scheduledAt, loginUrl) => {
  const content = `
    <h1>Live Class Scheduled</h1>
    <p>A new live session has been scheduled for your course: <strong>${courseTitle}</strong>.</p>
    
    <div style="background: rgba(255, 255, 255, 0.05); border-left: 4px solid #f97316; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 10px 0;"><strong>Class Title:</strong> ${classTitle}</p>
      ${topic ? `<p style="margin: 0 0 10px 0;"><strong>Topic:</strong> ${topic}</p>` : ''}
      <p style="margin: 0;"><strong>Date & Time:</strong> ${new Date(scheduledAt).toLocaleString()}</p>
    </div>

    <p>You can join this live session directly inside your learning portal. Simply log in when the class begins and click the <strong>Join Now</strong> button.</p>

    <div class="btn-container">
      <a href="${loginUrl}" class="btn">Go to Learning Portal</a>
    </div>
  `;
  return getBaseTemplate("Live Class Scheduled 🔴", `A new live class "${classTitle}" has been scheduled for ${courseTitle}.`, content);
};

module.exports = {
  getWelcomeEmail,
  getEnrollmentEmail,
  getPasswordResetEmail,
  getVerificationEmail,
  getRefundEmail,
  getContactEmail,
  getAdminMessageEmail,
  getLiveClassScheduledEmail
};
