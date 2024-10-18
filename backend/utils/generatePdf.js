const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit');
const formatDate = require('../utils/formatDate')
exports.createInvoice = async (businessEntry) => {
    console.log(businessEntry, 'businessEntry params')
    try {
        const { invoiceNo, date, customerName, contactNo, passportNo, nationality, category, subCategory, notes, items, totalAmount } = businessEntry;
        const invoiceName = `Invoice-${invoiceNo}.pdf`;
        const invoicePath = path.join('data', 'invoices', invoiceName);

        const docInvoice = new PDFDocument({ size: 'A4' });


        docInvoice.pipe(fs.createWriteStream(invoicePath))

        docInvoice.rect(12, 26, 570, 770).stroke("#000000")
        docInvoice.font('Times-Bold').fontSize(20).text(' Invoice', 26, 5, { align: 'center' });


        let spaceFromTop = 32;

        docInvoice.image(path.join(__dirname, 'assets', 'Travis_Logo.jpeg'), 23, 32, { height: 55, width: 126, align: 'left' })
        docInvoice.font('Times-Bold').fontSize(18).text(`STARS FOR TRAVEL ,TOURISM AND INVESTMENT LLC`, 595 - 300 - 20, spaceFromTop + 14, { align: 'right', width: 300 });

        spaceFromTop += 60;


        // let invoiceDatePdf = date.split('-');

        //2 Rectangles for  Bill To and Invoice Details
        docInvoice.rect(12, spaceFromTop, 270, 120).stroke("#000000");
        docInvoice.rect(282, spaceFromTop, 300, 120).stroke("#000000");
        spaceFromTop += 4

        //Heading Sections
        docInvoice.font('Helvetica-Bold').fontSize(12).text('Bill-To', 20, spaceFromTop, { align: 'left' });
        docInvoice.font('Helvetica-Bold').fontSize(12).text('Invoice Details', 290, spaceFromTop);

        docInvoice.moveTo(12, spaceFromTop + 15)
            .lineTo(582, spaceFromTop + 15)
            .stroke();

        spaceFromTop += 20
        docInvoice.font('Helvetica-Bold').fontSize(10).text(customerName, 17, spaceFromTop, { width: 150 });

        //On the right side
        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Invoice No.      : `, 285, spaceFromTop, { width: 150 })
            .font('Helvetica').text(invoiceNo, 362, spaceFromTop);

        spaceFromTop += 18
        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Nationality    :`, 17, spaceFromTop + 2, { width: 140 })
            .font('Helvetica').text(nationality, 88, spaceFromTop + 2);

        //On the right side
        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Invoice Date.   : `, 285, spaceFromTop + 3)
            .font('Helvetica').text(formatDate(date), 362, spaceFromTop + 3);

        spaceFromTop += 17
        //new row

        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Passport No. :`, 17, spaceFromTop + 6)
            .font('Helvetica').text(passportNo, 88, spaceFromTop + 7);

        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Category         :`, 285, spaceFromTop + 5)
            .font('Helvetica').text(category, 362, spaceFromTop + 5);


        spaceFromTop += 17

        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Sub-Category :`, 285, spaceFromTop + 8)
            .font('Helvetica').text(subCategory, 362, spaceFromTop + 8);

        //new row
        spaceFromTop += 12
        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Contact No.   :`, 17, spaceFromTop)
            .font('Helvetica').text(contactNo, 88, spaceFromTop);;

        //new row
        spaceFromTop += 14
        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Notes               :`, 285, spaceFromTop+3)
            .font('Helvetica').text(notes, 362, spaceFromTop+3);

        spaceFromTop += 25;

        //Table

        //Table Header

        //Table Columns Seperations Lines
        docInvoice.rect(12, spaceFromTop + 5, 42, 215).stroke("#000000")//sr No
        docInvoice.rect(54, spaceFromTop + 5, 180, 215).stroke("#000000")//Item
        docInvoice.rect(234, spaceFromTop + 5, 67, 215).stroke("#000000")//unit
        docInvoice.rect(301, spaceFromTop + 5, 62, 215).stroke("#000000")//price
        docInvoice.rect(363, spaceFromTop + 5, 62, 215).stroke("#000000")//discount
        docInvoice.rect(425, spaceFromTop + 5, 62, 215).stroke("#000000")//vat
        docInvoice.rect(487, spaceFromTop + 5, 95, 215).stroke("#000000")//amount

        //horizontal Line
        // docInvoice.rect(70, spaceFromTop + 5, 440, 215).stroke("#000000")//Amount

        docInvoice.moveTo(12, spaceFromTop + 25)   // Starting point (x1, y1)
            .lineTo(582, spaceFromTop + 25)  // Ending point (x2, y2) based on A4 width
            .stroke();
        //Text
        spaceFromTop += 5
        docInvoice
            .font('Helvetica-Bold')
            .fontSize(9.5)
            .text('SI No', 20, spaceFromTop + 7)
            .text('Description', 120, spaceFromTop + 7)
            .text('Nos', 255, spaceFromTop + 7)
            .text('Price', 322, spaceFromTop + 7)
            .text('Discount %', 370, spaceFromTop + 7)
            .text('VAT %', 445, spaceFromTop + 7)
            .text('Total', 530, spaceFromTop + 7)

        let index = 1
        let tableHeight = spaceFromTop;
        for (const data of items) {

            index == 1 ? tableHeight += 27 : tableHeight += 23
            docInvoice
                .font('Helvetica-Bold')
                .fontSize(9.7)
                .text(index, 24, tableHeight,)
                .text(data.name, -250, tableHeight, { align: 'center', })
                .text(data.units, 260, tableHeight)
                .text(parseFloat(data.price).toFixed(2), 316, tableHeight)
                .text(data.discountPercent, 382, tableHeight)
                .text(data.vatPercent, 448, tableHeight)
                .text(parseFloat(data.amount).toFixed(2), 530, tableHeight);

            index += 1

            docInvoice.moveTo(12, tableHeight + 15)   // Starting point (x1, y1)
                .lineTo(582, tableHeight + 15)  // Ending point (x2, y2) based on A4 width
                .stroke();               // Render the line

        }

        spaceFromTop += 215;

        // docInvoice.rect(12, spaceFromTop, 570, 20).stroke("#000000")//Amount
        spaceFromTop += 6;

        docInvoice
            .font('Helvetica-Bold')
            .fontSize(10)
            .text("Total", 448, spaceFromTop)
            .text(parseFloat(totalAmount).toFixed(2), 530, spaceFromTop, { width: 70 })

        spaceFromTop += 14

        //Bank
        docInvoice.rect(12, spaceFromTop, 570, 77).stroke("#000000")//Amount
        // docInvoice.rect(340, spaceFromTop, 242, 80).stroke("#000000")//Amount


        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Bank Name     : `, 17, spaceFromTop + 5, { width: 150 })
            .font('Helvetica').text('Bank Muscat', 92, spaceFromTop + 5);


        docInvoice.font('Helvetica-Bold').fontSize(10).text(`A/C No.            : `, 17, spaceFromTop + 23, { width: 150 })
            .font('Helvetica').text('0303064730030011', 92, spaceFromTop + 23);

        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Name               : `, 17, spaceFromTop + 42, { width: 150 })
            .font('Helvetica').text('Stars for Travel Tourism and Invest', 92, spaceFromTop + 42);

        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Branch Name  : `, 17, spaceFromTop + 60, { width: 150 })
            .font('Helvetica').text('Burj al Sahwa', 92, spaceFromTop + 60);


        spaceFromTop += 77
        //Signature

        //Rectangle
        docInvoice.rect(12, spaceFromTop, 570, 77).stroke("#000000");



        docInvoice.font('Helvetica-Bold').fontSize(10).text(`Signature:`, 17, spaceFromTop + 45)
            .font('Helvetica-Bold').text('Client Signature:', 400, spaceFromTop + 45);

        //Line before thanks
        docInvoice.moveTo(12, spaceFromTop + 55)
            .lineTo(582, spaceFromTop + 55)
            .stroke();

        docInvoice.font('Times-Bold').fontSize(13).text(`Thank you for your business!`, 330, spaceFromTop + 59);


        //Horizontal Line before Address
        docInvoice.moveTo(12, 735)
            .lineTo(582, 735)
            .stroke();
        //Address Footer
        docInvoice.font('Times-Roman').fontSize(10.5).text(`C.R : 1486204, Office No. : 533, Maktabi Business Centre, Al Wattayah, PO Box : 1966, PC: 111, Sultanate of Oman`, 35, 740, { width: 580 });
        docInvoice.font('Times-Roman').fontSize(10.5).text(`Tel. : +968 9199 9185, E-mail : info@travisoman.com`, 35, 755, { align: 'center' });

        docInvoice.end();

        docInvoice.on('finish', () => {
            console.log('PDF generated successfully');

        });

        // Pdf End 
        return `data/invoices/${invoiceName}`
    } catch (error) {
        console.log(error, 'Error')
    }

}
