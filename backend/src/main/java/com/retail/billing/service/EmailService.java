package com.retail.billing.service;

import com.retail.billing.entity.Invoice;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvoiceWithAttachment(Invoice invoice, byte[] pdfBytes, String targetEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(targetEmail);
            helper.setSubject("Invoice " + invoice.getInvoiceNumber() + " - Retail Billing System");
            helper.setText("Dear Customer,\n\nPlease find your invoice attached below.\n\nTotal Amount: ₹" + invoice.getTotalAmount() + "\n\nThank you for your business!");

            helper.addAttachment("Invoice_" + invoice.getInvoiceNumber() + ".pdf", new ByteArrayResource(pdfBytes));

            mailSender.send(message);
            System.out.println("Email sent successfully to: " + targetEmail);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
