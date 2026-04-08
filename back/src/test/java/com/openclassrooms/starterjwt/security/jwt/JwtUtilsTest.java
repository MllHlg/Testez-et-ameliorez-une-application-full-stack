package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private final String jwtSecret = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJodHRwczovL2RldmdsYW4uY29tIiwiYXVkIjoiZGV2Z2xhbi1hcGkiLCJzdWIiOiJ1c2VyXzEyMzQ1IiwibmFtZSI6IkRldmdsYW4gVXNlciIsInJvbGUiOiJkZXZlbG9wZXIiLCJpYXQiOjE3NzU2MzM2OTMsIm5iZiI6MTc3NTYzMzY5MywiZXhwIjoxNzc1NjM3MjkzfQXEJCIYzzPFRT9FE0EsSE1zq0NOxkBQNt3f4ZrzoaNghmHScuKej36E3ebpADvoXCHCodKwsEpqUGZjQrJCudgceP";

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", jwtSecret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000);
    }

    @Test
    public void testGenerateAndValidateJwtToken() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().username("user@test.com").build();
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        assertNotNull(token);
        assertEquals("user@test.com", jwtUtils.getUserNameFromJwtToken(token));
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    public void testValidateJwtToken_withMalformedToken_shouldReturnFalse() {
        assertFalse(jwtUtils.validateJwtToken("a.fake.token"));
    }

    @Test
    public void testValidateJwtToken_withEmptyToken_shouldReturnFalse() {
        assertFalse(jwtUtils.validateJwtToken(""));
    }

    @Test
    public void testValidateJwtToken_withExpiredToken_shouldReturnFalse() {
        String expiredToken = Jwts.builder()
                .setSubject("user@test.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() - 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        assertFalse(jwtUtils.validateJwtToken(expiredToken));
    }

    @Test
    public void testValidateJwtToken_withWrongSignature_shouldReturnFalse() {
        String wrongSecret = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJodHRwczovL2RldmdsYW4uY29tIiwiYXVkIjoiZGV2Z2xhbi1hcGkiLCJzdWIiOiJ1c2VyXzEyMzQ1IiwibmFtZSI6IkRldmdsYW4gVXNlciIsInJvbGUiOiJkZXZlbG9wZXIiLCJpYXQiOjE3NzU2MzM3MDUsIm5iZiI6MTc3NTYzMzcwNSwiZXhwIjoxNzc1NjM3MzA1fQURtEjk2z3YP3owrMMbM7f5Bg6KAvR0RoECiuKQFDO0EOfnbZsoMFGPHE9p4wz8X55qltnhIsTpSLL3QwtAefZlst";
        String tokenWithWrongSignature = Jwts.builder()
                .setSubject("user@test.com")
                .signWith(SignatureAlgorithm.HS512, wrongSecret)
                .compact();

        assertFalse(jwtUtils.validateJwtToken(tokenWithWrongSignature));
    }
}