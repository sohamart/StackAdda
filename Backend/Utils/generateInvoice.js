const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Colors
      const primaryColor = "#4F46E5"; // Indigo
      const secondaryColor = "#6B7280"; // Gray
      const darkColor = "#111827"; // Almost black
      const lightGray = "#F3F4F6";

      // Top colored bar
      doc.rect(0, 0, 595, 8).fill(primaryColor);

      // Add Logo
      const logoPath = path.join(__dirname, "../../Frontend/public/favicon.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 60 });
      } else {
        doc.fillColor(primaryColor).fontSize(24).font("Helvetica-Bold").text("STACK", 50, 50).fillColor(darkColor).text("ADDA", 130, 50);
      }

      // Company Details
      doc
        .fillColor(secondaryColor)
        .fontSize(10)
        .font("Helvetica")
        .text("Stack Adda", 50, 115)
        .text("contact@stackadda.com", 50, 130)
        .text("www.stackadda.com", 50, 145);

      // Invoice Header
      doc
        .fillColor(primaryColor)
        .fontSize(28)
        .font("Helvetica-Bold")
        .text("INVOICE", 50, 50, { align: "right" })
        .fillColor(secondaryColor)
        .fontSize(10)
        .font("Helvetica")
        .text(`Invoice #: ${invoiceData.invoiceId}`, 50, 85, { align: "right" })
        .text(`Date: ${new Date(invoiceData.date).toLocaleDateString()}`, 50, 100, { align: "right" });

      doc.moveDown(3);

      // Billed To Section
      doc
        .fillColor(darkColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Billed To:", 50, 180)
        .fillColor(secondaryColor)
        .fontSize(10)
        .font("Helvetica")
        .text(invoiceData.customerName, 50, 200)
        .text(invoiceData.customerEmail, 50, 215);

      // Table Header Background
      doc.rect(50, 260, 495, 30).fill(primaryColor);

      // Table Header Text
      doc
        .fillColor("#FFFFFF")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Description", 60, 270)
        .text("Amount", 440, 270, { align: "right" });

      // Table Row
      doc
        .fillColor(darkColor)
        .fontSize(10)
        .font("Helvetica")
        .text(invoiceData.courseTitle, 60, 310, { width: 350 })
        .text(`Rs ${invoiceData.amount}`, 440, 310, { align: "right" });

      // Table Bottom Border
      doc.moveTo(50, 340).lineTo(545, 340).lineWidth(1).stroke(lightGray);

      // Total Section
      doc.rect(345, 360, 200, 40).fill(lightGray);
      doc
        .fillColor(darkColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Total:", 360, 375)
        .fillColor(primaryColor)
        .text(`Rs ${invoiceData.amount}`, 440, 375, { align: "right" });

      // Footer
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor(secondaryColor)
        .text(
          "Thank you for choosing Stack Adda! If you have any questions about this invoice, please contact support.",
          50,
          750,
          { align: "center", width: 495 }
        );
        
      // Bottom colored bar
      doc.rect(0, 834, 595, 8).fill(primaryColor);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateInvoice;
