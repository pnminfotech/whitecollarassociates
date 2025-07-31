const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
// const Rent = require('../models/Rent'); // Replace with your model path
router.get('/generate-pdf-report', async (req, res) => {
    const { roomNo, tenantName } = req.query;

    try {
        const records = await Rent.find({ roomNo, tenantName }).sort({ paymentDate: 1 });

        if (!records.length) {
            return res.status(404).json({ message: 'No rent data found' });
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Disposition', `attachment; filename=${tenantName}_Rent_Report.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Tenant Rent Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12)
            .text(`Tenant Name: ${tenantName}`)
            .text(`Room No: ${roomNo}`)
            .moveDown();

        // Table header
        doc.font('Helvetica-Bold').text('Month', 100)
            .text('Rent Status', 200)
            .text('Due Amount', 300)
            .text('Paid On', 400);
        doc.moveDown();

        records.forEach(r => {
            doc.font('Helvetica')
                .text(new Date(r.paymentDate).toLocaleString('default', { month: 'long', year: 'numeric' }), 100)
                .text(r.rentStatus, 200)
                .text(`₹${r.dueAmount || 0}`, 300)
                .text(r.paymentDate ? new Date(r.paymentDate).toDateString() : 'N/A', 400);
            doc.moveDown();
        });

        doc.end();
    } catch (err) {
        console.error('PDF generation error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
