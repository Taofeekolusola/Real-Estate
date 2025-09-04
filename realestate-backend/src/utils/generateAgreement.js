// utils/generateAgreement.js
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

async function generateAgreement({
  tenant,
  landlord,
  property,
  rentDuration,
  rentAmount,
  leaseStartDate,
  leaseEndDate,
  digitallySigned = true,
}) {
  const doc = new PDFDocument();
  let buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(20).text("Tenancy Agreement", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Tenant: ${tenant.name}`);
  doc.text(`Landlord: ${landlord.name}`);
  doc.text(`Property: ${property.title}`);
  doc.text(`Rent Duration: ${rentDuration} months`);
  doc.text(`Rent Amount: ₦${rentAmount}`);
  if (leaseStartDate) doc.text(`Lease Start Date: ${leaseStartDate}`);
  if (leaseEndDate) doc.text(`Lease End Date: ${leaseEndDate}`);
  doc.text(`Complies with Lagos Tenancy Law.`);

  doc.moveDown();

  if (digitallySigned) {
    const now = new Date().toLocaleDateString();
    doc.moveDown();
    doc.fontSize(12).text(`Digitally Signed by: ${tenant.name}`);
    doc.text(`Email: ${tenant.email}`);
    doc.text(`Date: ${now}`);
    doc.text(`Signature: __________________________`);
  }

  doc.end();
  const buffer = await getStream.buffer(doc);
  return buffer;
}

module.exports = generateAgreement;