package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {

    @Test
    public void testUserDetailsImplMethods() {
        UserDetailsImpl user1 = UserDetailsImpl.builder()
                .id(1L)
                .username("test@test.com")
                .firstName("User")
                .lastName("Test")
                .password("user_password")
                .build();

        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();
        
        UserDetailsImpl user3 = UserDetailsImpl.builder().id(2L).build();

        assertTrue(user1.isAccountNonExpired());
        assertTrue(user1.isAccountNonLocked());
        assertTrue(user1.isCredentialsNonExpired());
        assertTrue(user1.isEnabled());
        assertTrue(user1.getAuthorities().isEmpty());

        assertEquals(user1, user1);
        assertEquals(user1, user2);
        assertNotEquals(user1, user3);
        assertNotEquals(user1, null);
        assertNotEquals(user1, new Object());
    }
}