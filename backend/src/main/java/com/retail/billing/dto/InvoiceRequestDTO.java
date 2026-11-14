package com.retail.billing.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceRequestDTO {
    private Long customerId;
    private List<ItemRequestDTO> items;
    private String paymentMethod;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemRequestDTO {
        private Long productId;
        private Integer quantity;
    }
}
