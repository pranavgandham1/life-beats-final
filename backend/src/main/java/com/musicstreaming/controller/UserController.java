package com.musicstreaming.controller;

import com.musicstreaming.model.User;
import com.musicstreaming.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        boolean success = userService.registerUser(user);
        return success ? "Registration successful" : "Username already exists";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        boolean authenticated = userService.authenticateUser(user.getUsername(), user.getPassword());
        return authenticated ? "Login successful" : "Invalid username or password";
    }
}