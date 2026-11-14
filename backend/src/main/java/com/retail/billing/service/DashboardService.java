package com.retail.billing.service;

import com.retail.billing.entity.Invoice;
import com.retail.billing.entity.Product;
import com.retail.billing.repository.InvoiceRepository;
import com.retail.billing.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private InvoiceRepository invoiceRepository;
    @Autowired private ProductRepository productRepository;

    public Map<String, Object> getDashboardStats() {
        List<Invoice> invoices = invoiceRepository.findAll();
        List<Product> lowStockProducts = productRepository.findAll().stream()
                .filter(p -> p.getQuantity() < 10)
                .toList();

        BigDecimal totalRevenue = invoices.stream()
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Group sales by date for the chart
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM");
        Map<String, BigDecimal> salesTrend = invoices.stream()
                .sorted(Comparator.comparing(Invoice::getInvoiceDate))
                .collect(Collectors.groupingBy(
                        inv -> inv.getInvoiceDate().format(formatter),
                        LinkedHashMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Invoice::getTotalAmount, BigDecimal::add)
                ));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalInvoices", invoices.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("lowStockCount", lowStockProducts.size());
        stats.put("recentInvoices", invoices.stream()
                .sorted((a, b) -> b.getInvoiceDate().compareTo(a.getInvoiceDate()))
                .limit(5)
                .toList());
        stats.put("salesTrend", salesTrend);
        return stats;
    }
}
