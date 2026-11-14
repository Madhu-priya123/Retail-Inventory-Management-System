package com.retail.billing.repository;

import com.retail.billing.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<LocalDateTime> findByInvoiceDateBetween(LocalDateTime start, LocalDateTime end);
}
