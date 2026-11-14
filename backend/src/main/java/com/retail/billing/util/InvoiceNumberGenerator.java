package com.retail.billing.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class InvoiceNumberGenerator {

    @Value("${app.invoice.prefix:INV-}")
    private String prefix;

    public String generate() {
        return prefix + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
