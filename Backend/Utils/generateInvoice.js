// generateInvoice.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
 
const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
 
module.exports = function generateInvoice(invoiceData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        bufferPages: true,
      });
 
      const chunks = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
 
      const C = {
        primary: "#F97316",
        dark: "#111827",
        gray: "#6B7280",
        light: "#F3F4F6",
        border: "#E5E7EB",
        green: "#16A34A",
      };
 
      const logo = path.join(__dirname, "../../Frontend/public/favicon.png");
 
      // Header
      doc.rect(0, 0, 595, 12).fill(C.primary);
 
      if (fs.existsSync(logo)) {
        doc.image(logo, 40, 28, { width: 55 });
      }
 
      doc.fillColor(C.dark)
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("STACK ADDA", 105, 35);
 
      doc.font("Helvetica")
        .fontSize(10)
        .fillColor(C.gray)
        .text("Premium Learning Platform", 105, 60)
        .text("support@stackadda.com", 105, 75)
        .text("www.stackadda.com", 105, 90);
 
      doc.font("Helvetica-Bold")
        .fontSize(28)
        .fillColor(C.primary)
        .text("TAX INVOICE", 0, 35, { align: "right" });
 
      doc.fontSize(10)
        .fillColor(C.dark)
        .font("Helvetica")
        .text(`Invoice No : ${invoiceData.invoiceId}`, 350, 85)
        .text(`Date : ${formatDate(invoiceData.date)}`, 350, 100)
        .text(`Status : PAID`, 350, 115);
 
      // Customer Box
      doc.roundedRect(40, 145, 515, 90, 8).fillAndStroke("#FFF7ED", C.border);
 
      doc.fillColor(C.primary)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("BILLED TO", 55, 160);
 
      doc.fillColor(C.dark)
        .font("Helvetica")
        .fontSize(11)
        .text(`Name : ${invoiceData.customerName}`, 55, 182)
        .text(`Email : ${invoiceData.customerEmail}`, 55, 198);
 
      // Table
      const y = 260;



 
      doc.roundedRect(40, y, 515, 28, 4).fill(C.primary);
 
      doc.fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Description", 50, y + 9)
        .text("Qty", 330, y + 9)
        .text("Price", 395, y + 9)
        .text("Total", 500, y + 9, { width: 45, align: "right" });
 
      doc.fillColor(C.dark)
        .font("Helvetica")
        .fontSize(10);
 
      doc.rect(40, y + 28, 515, 42).stroke(C.border);
 
      doc.text(invoiceData.courseTitle || "Course Purchase", 50, y + 42, { width: 250 });
      doc.text("1", 335, y + 42);
      doc.text(`Rs ${invoiceData.amount}`, 395, y + 42);
      doc.text(`Rs ${invoiceData.amount}`, 500, y + 42, { width: 45, align: "right" });
 
      const totalY = y + 95;
 
      doc.roundedRect(325, totalY, 230, 95, 6).fill("#F9FAFB").stroke(C.border);
 
      doc.fillColor(C.gray)
        .font("Helvetica")
        .text("Subtotal", 340, totalY + 15)
        .text(`Rs ${invoiceData.amount}`, 470, totalY + 15, { width: 70, align: "right" });
 
      doc.text("Discount", 340, totalY + 38)
        .text("Rs 0", 470, totalY + 38, { width: 70, align: "right" });
 
      doc.font("Helvetica-Bold")
        .fillColor(C.primary)
        .fontSize(13)
        .text("Grand Total", 340, totalY + 65)
        .text(`Rs ${invoiceData.amount}`, 450, totalY + 65, { width: 90, align: "right" });
 
      // Payment info
      doc.roundedRect(40, totalY, 255, 95, 6).fill("#FFFFFF").stroke(C.border);
 
      doc.fillColor(C.primary)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("PAYMENT DETAILS", 55, totalY + 15);
 
      doc.fillColor(C.dark)
        .font("Helvetica")
        .fontSize(10)
        .text(`Method : ${invoiceData.paymentMethod || "Razorpay"}`, 55, totalY + 38)
        .text(`Payment ID : ${invoiceData.paymentId || "-"}`, 55, totalY + 55)
        .fillColor(C.green)
        .text("Status : SUCCESS", 55, totalY + 72);
 
      // Notes
      const noteY = totalY + 125;
 
      doc.roundedRect(40, noteY, 515, 130, 6).fill("#FFF7ED").stroke(C.border);
 
      doc.fillColor(C.primary)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Terms & Conditions", 55, noteY + 15);
 
      doc.fillColor(C.dark)
        .font("Helvetica")
        .fontSize(9)
        .text("• This invoice is computer generated and does not require a physical signature."
, 55, noteY + 40)
        .text("• This purchase grants lifetime access to the purchased course.", 55, noteY + 58
)
        .text("• Digital products may not be refundable according to the platform policy.", 55,
 noteY + 76)
        .text("• For any billing issue, contact support@stackadda.com.", 55, noteY + 94);
 
      doc.fontSize(10)
        .fillColor(C.gray)
        .text("Thank you for learning with Stack Adda ❤�", 40, 760, {
          width: 515,
          align: "center",
        });
 
      doc.rect(0, 830, 595, 12).fill(C.primary);



 
      doc.end();
    } catch (e) {
      reject(e);
    }
  });
};
