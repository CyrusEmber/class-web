package com.ke;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class KeApplication {

    public static void main(String[] args) {
        SpringApplication.run(KeApplication.class, args);
    }


}