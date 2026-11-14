package com.retail.billing.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
