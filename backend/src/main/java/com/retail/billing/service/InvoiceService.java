package com.retail.billing.service;

import com.retail.billing.dto.InvoiceRequestDTO;
import com.retail.billing.entity.*;
import com.retail.billing.repository.*;
import com.retail.billing.util.InvoiceNumberGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class InvoiceService {

    @Autowired private InvoiceRepository invoiceRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private InvoiceNumberGenerator numberGenerator;
    @Autowired private PdfService pdfService;
    @Autowired private EmailService emailService;
    @Autowired private UserService userService;

    private String getCurrentUsername() {
        return org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Transactional
    public Invoice createInvoice(InvoiceRequestDTO request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(numberGenerator.generate());
        invoice.setCustomer(customer);
        invoice.setInvoiceDate(LocalDateTime.now());
        invoice.setPaymentMethod(request.getPaymentMethod());

        List<InvoiceItem> items = new ArrayList<>();
        BigDecimal subTotal = BigDecimal.ZERO;
        BigDecimal gstTotal = BigDecimal.ZERO;

        for (InvoiceRequestDTO.ItemRequestDTO itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Update stock
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            BigDecimal lineGst = lineTotal.multiply(BigDecimal.valueOf(product.getGst() / 100));

            InvoiceItem item = InvoiceItem.builder()
                    .invoice(invoice)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .gstRate(product.getGst())
                    .totalPrice(lineTotal.add(lineGst))
                    .build();

            items.add(item);
            subTotal = subTotal.add(lineTotal);
            gstTotal = gstTotal.add(lineGst);
        }

        invoice.setItems(items);
        invoice.setSubTotal(subTotal);
        invoice.setGstAmount(gstTotal);
        invoice.setTotalAmount(subTotal.add(gstTotal));

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // Check user preference for auto-email
        try {
            User currentUser = userService.getByUsername(getCurrentUsername()).orElse(null);
            if (currentUser != null && currentUser.isAutoEmailPdf() && customer.getEmail() != null && !customer.getEmail().isEmpty()) {
                System.out.println("Auto-email enabled for user " + currentUser.getUsername() + ". Sending to " + customer.getEmail());
                java.io.ByteArrayInputStream pdfStream = pdfService.generateInvoicePdf(savedInvoice);
                byte[] pdfBytes = pdfStream.readAllBytes();
                emailService.sendInvoiceWithAttachment(savedInvoice, pdfBytes, customer.getEmail());
            }
        } catch (Exception e) {
            System.err.println("Error sending auto-email: " + e.getMessage());
        }

        return savedInvoice;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id).orElseThrow(() -> new RuntimeException("Invoice not found"));
    }
}
