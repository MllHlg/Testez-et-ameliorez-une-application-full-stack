package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.EmailAlreadyUsedException;
import com.openclassrooms.starterjwt.exception.ResourceNotFoundException;
import com.openclassrooms.starterjwt.exception.UnauthorizedException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User mockUser;

    @BeforeEach
    public void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@test.com");
        mockUser.setFirstName("User");
        mockUser.setLastName("Test");
        mockUser.setPassword("user_password");
    }

    @Test
    public void testFindById_whenUserExists_shouldReturnUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        User result = userService.findById(1L);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindById_whenUserDoesNotExist_shouldThrowException() {
        when(userRepository.findById(0L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> userService.findById(0L));
        verify(userRepository, times(1)).findById(0L);
    }

    @Test
    public void testFindByEmail_whenUserExists_shouldReturnUser() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(mockUser));
        User result = userService.findByEmail("test@test.com");

        assertNotNull(result);
        assertEquals("User", result.getFirstName());
        verify(userRepository, times(1)).findByEmail("test@test.com");
    }

    @Test
    public void testRegister_whenEmailNotUsed_shouldSaveAndReturnUser() {
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(mockUser)).thenReturn(mockUser);

        User result = userService.register(mockUser);

        assertNotNull(result);
        verify(userRepository, times(1)).save(mockUser);
    }

    @Test
    public void testRegister_whenEmailAlreadyUsed_shouldThrowException() {
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));
        assertThrows(EmailAlreadyUsedException.class, () -> userService.register(mockUser));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testDelete_whenUserIsAuthorized_shouldDeleteUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        userService.delete(1L, "test@test.com");
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testDelete_whenUserIsUnauthorized_shouldThrowException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        assertThrows(UnauthorizedException.class, () -> userService.delete(1L, "bad_user@test.com"));
        verify(userRepository, never()).deleteById(anyLong());
    }
}