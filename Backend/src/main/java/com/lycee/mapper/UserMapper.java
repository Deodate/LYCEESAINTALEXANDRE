package com.lycee.mapper;

import com.lycee.dto.request.SignupRequest;
import com.lycee.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(SignupRequest request) {
        if (request == null) {
            return null;
        }
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setGender(request.getGender());
        user.setPosition(request.getPosition());
        user.setPhoneNumber(request.getPhoneNumber());
        return user;
    }
} 