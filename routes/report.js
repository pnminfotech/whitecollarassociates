// const express = require('express');
// const router = express.Router();
// const PDFDocument = require('pdfkit');
// const moment = require('moment');
// const Form = require('../models/Form'); // your existing model

// router.get('/generate-report', async (req, res) => {
//     try {
//         const { roomNo, tenantName } = req.query;

//         if (!roomNo || !tenantName) {
//             return res.status(400).json({ message: 'roomNo and tenantName are required' });
//         }

//         // Get tenant data
//         const tenant = await Form.findOne({ roomNo, name: tenantName });


//         if (!tenant) {
//             return res.status(404).json({ message: 'Tenant not found' });
//         }

//         // Start PDF doc
//         const doc = new PDFDocument();
//         const filename = `Rent_Report_${tenant.name}_${tenant.roomNo}.pdf`;

//         res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
//         res.setHeader('Content-type', 'application/pdf');

//         doc.pipe(res);

//         // Header
//         doc.fontSize(20).text(`Rent Report`, { align: 'center' });
//         doc.moveDown();

//         // Tenant info
//         doc.fontSize(12).text(`Name: ${tenant.name}`);
//         doc.text(`Room No: ${tenant.roomNo}`);
//         doc.text(`Phone: ${tenant.phoneNo}`);
//         doc.text(`Joining Date: ${moment(tenant.joiningDate).format('YYYY-MM-DD')}`);
//         doc.moveDown();

//         // Rent Table Header
//         doc.fontSize(14).text(`Rent Details`, { underline: true });
//         doc.moveDown(0.5);

//         tenant.rents.forEach((rent, index) => {
//             doc
//                 .fontSize(12)
//                 .text(
//                     `${index + 1}. Month: ${rent.month || '-'}, Amount: ₹${rent.rentAmount || 0}, Received On: ${rent.date ? moment(rent.date).format('YYYY-MM-DD') : 'Not Paid'}`
//                 );
//         });

//         doc.end();

//     } catch (error) {
//         console.error('PDF generation error:', error);
//         res.status(500).json({ message: 'Server error during PDF generation' });
//     }
// });

// module.exports = router;
