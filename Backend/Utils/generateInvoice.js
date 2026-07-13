const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add Logo
      const logoPath = path.join(__dirname, "../../Frontend/public/favicon.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 50 });
      }

      // Header
      doc
        .fillColor("#444444")
        .fontSize(20)
        .text("INVOICE", 50, 50, { align: "right" })
        .fontSize(10)
        .text("Stack Adda", 50, 75, { align: "right" })
        .text("stackadda@example.com", 50, 90, { align: "right" })
        .moveDown();

      // Line
      doc.moveTo(50, 130).lineTo(550, 130).stroke();

      // Customer Info & Invoice Details
      doc
        .fontSize(10)
        .fillColor("#000000")
        .text(`Invoice Number: ${invoiceData.invoiceId}`, 50, 150)
        .text(`Date: ${new Date(invoiceData.date).toLocaleDateString()}`, 50, 165)
        .text(`Billed To:`, 300, 150)
        .text(invoiceData.customerName, 300, 165)
        .text(invoiceData.customerEmail, 300, 180)
        .moveDown();

      // Table Header
      doc.moveTo(50, 220).lineTo(550, 220).stroke();
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Item", 50, 230)
        .text("Amount", 450, 230, { align: "right" });
      doc.moveTo(50, 250).lineTo(550, 250).stroke();

      // Table Row
      doc
        .font("Helvetica")
        .text(invoiceData.courseTitle, 50, 260, { width: 350 })
        .text(`Rs ${invoiceData.amount}`, 450, 260, { align: "right" });

      // Total
      doc.moveTo(50, 300).lineTo(550, 300).stroke();
      doc
        .font("Helvetica-Bold")
        .text("Total", 350, 315)
        .text(`Rs ${invoiceData.amount}`, 450, 315, { align: "right" });

      // Footer
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#888888")
        .text(
          "Thank you for your business. For any questions, please contact support.",
          50,
          700,
          { align: "center", width: 500 }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateInvoice;
