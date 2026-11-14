package com.retail.billing.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private Integer quantity;
    private Double gst;
    private String barcode;
}
