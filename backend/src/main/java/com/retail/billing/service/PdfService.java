package com.retail.billing.service;

import com.retail.billing.entity.Invoice;
import com.retail.billing.entity.InvoiceItem;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public ByteArrayInputStream generateInvoicePdf(Invoice invoice) {
        System.out.println("Generating Professional PDF for Invoice: " + invoice.getInvoiceNumber());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            document.setMargins(20, 20, 20, 20);

            // Header Section
            Table headerTable = new Table(new float[]{1, 1});
            headerTable.setWidth(UnitValue.createPercentValue(100));
            
            // Business Info
            Cell businessCell = new Cell().add(new Paragraph("RETAIL BILLING SYSTEM")
                    .setBold().setFontSize(18).setMarginBottom(0))
                    .add(new Paragraph("123, Business Park, Rajkot, Gujarat, India")
                    .setFontSize(9).setMarginBottom(0))
                    .add(new Paragraph("GSTIN: 24ABCDE1234F1Z5 | Phone: +91 98765 43210")
                    .setFontSize(9))
                    .setBorder(Border.NO_BORDER);
            headerTable.addCell(businessCell);
            
            // Empty cell or Logo placeholder
            headerTable.addCell(new Cell().setBorder(Border.NO_BORDER));
            document.add(headerTable);

            document.add(new Paragraph("\n"));
            
            // Tax Invoice Title
            Paragraph title = new Paragraph("TAX INVOICE")
                    .setBold().setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBorderBottom(new SolidBorder(0.5f));
            document.add(title);

            // Invoice & Customer Info Grid
            Table infoTable = new Table(new float[]{1, 1});
            infoTable.setWidth(UnitValue.createPercentValue(100)).setMarginTop(10);
            
            // Left Side: Invoice Details
            Cell invoiceInfo = new Cell().add(new Paragraph("Invoice No: " + invoice.getInvoiceNumber()).setBold())
                    .add(new Paragraph("Date: " + (invoice.getInvoiceDate() != null ? invoice.getInvoiceDate().toString().substring(0, 10) : "N/A")))
                    .setFontSize(10).setBorder(Border.NO_BORDER);
            infoTable.addCell(invoiceInfo);
            
            // Right Side: Customer Details
            Cell customerInfo = new Cell().add(new Paragraph("Customer: " + (invoice.getCustomer() != null ? invoice.getCustomer().getName() : "Cash Sale")).setBold())
                    .add(new Paragraph("Phone: " + (invoice.getCustomer() != null ? invoice.getCustomer().getPhone() : "N/A")))
                    .add(new Paragraph("Address: " + (invoice.getCustomer() != null ? invoice.getCustomer().getAddress() : "N/A")))
                    .setFontSize(10).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
            infoTable.addCell(customerInfo);
            
            document.add(infoTable);
            document.add(new Paragraph("\n"));

            // Items Table
            Table table = new Table(new float[]{1, 4, 1, 2, 2});
            table.setWidth(UnitValue.createPercentValue(100));
            
            // Table Header
            String[] headers = {"Sr", "Item Description", "Qty", "Rate", "Total"};
            for (String h : headers) {
                table.addHeaderCell(new Cell().add(new Paragraph(h).setBold().setFontSize(10))
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY));
            }

            // Table Rows
            int srNo = 1;
            for (InvoiceItem item : invoice.getItems()) {
                table.addCell(new Cell().add(new Paragraph(String.valueOf(srNo++)).setFontSize(9)));
                table.addCell(new Cell().add(new Paragraph(item.getProduct().getName()).setFontSize(9)));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(item.getQuantity())).setFontSize(9)));
                table.addCell(new Cell().add(new Paragraph("₹" + item.getUnitPrice()).setFontSize(9)));
                table.addCell(new Cell().add(new Paragraph("₹" + item.getTotalPrice()).setFontSize(9)));
            }
            document.add(table);

            // Totals Section
            Table totalsTable = new Table(new float[]{1});
            totalsTable.setWidth(200).setHorizontalAlignment(HorizontalAlignment.RIGHT).setMarginTop(10);
            
            double subTotal = invoice.getSubTotal() != null ? invoice.getSubTotal().doubleValue() : 0;
            double gst = invoice.getGstAmount() != null ? invoice.getGstAmount().doubleValue() : 0;
            double grandTotal = invoice.getTotalAmount() != null ? invoice.getTotalAmount().doubleValue() : 0;

            totalsTable.addCell(new Cell().add(new Paragraph("Subtotal: ₹" + String.format("%.2f", subTotal))).setBorder(Border.NO_BORDER));
            totalsTable.addCell(new Cell().add(new Paragraph("GST (CGST+SGST): ₹" + String.format("%.2f", gst))).setBorder(Border.NO_BORDER));
            totalsTable.addCell(new Cell().add(new Paragraph("GRAND TOTAL: ₹" + String.format("%.2f", grandTotal)).setBold().setFontSize(12)));
            
            document.add(totalsTable);

            // Footer
            document.add(new Paragraph("\n\n"));
            Table footerTable = new Table(new float[]{1, 1});
            footerTable.setWidth(UnitValue.createPercentValue(100));
            
            footerTable.addCell(new Cell().add(new Paragraph("Terms & Conditions:")
                    .setBold().setFontSize(8))
                    .add(new Paragraph("1. Goods once sold will not be taken back.\n2. Subject to Rajkot Jurisdiction.")
                    .setFontSize(8))
                    .setBorder(Border.NO_BORDER));
            
            footerTable.addCell(new Cell().add(new Paragraph("For RETAIL BILLING SYSTEM")
                    .setBold().setFontSize(9).setTextAlignment(TextAlignment.RIGHT))
                    .add(new Paragraph("\n\nAuthorized Signatory")
                    .setFontSize(9).setTextAlignment(TextAlignment.RIGHT))
                    .setBorder(Border.NO_BORDER));
            
            document.add(footerTable);
            document.add(new Paragraph("\nThank you for your business!").setTextAlignment(TextAlignment.CENTER).setFontSize(10).setItalic());

            document.close();
        } catch (Exception e) {
            System.err.println("Error generating PDF: " + e.getMessage());
            e.printStackTrace();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }
}
