package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.ResourceNotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private SessionService sessionService;

    private Session mockSession;
    private User mockUser;

    @BeforeEach
    public void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@test.com");

        mockSession = new Session();
        mockSession.setId(1L);
        mockSession.setName("Session Test");
        mockSession.setUsers(new ArrayList<>()); 
    }

    @Test
    public void testCreate_shouldReturnCreatedSession() {
        when(sessionRepository.save(mockSession)).thenReturn(mockSession);
        Session result = sessionService.create(mockSession);
        assertNotNull(result);
        assertEquals("Session Test", result.getName());
    }

    @Test
    public void testFindAll_shouldReturnAllSessions() {
        when(sessionRepository.findAll()).thenReturn(Arrays.asList(mockSession));
        List<Session> result = sessionService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    public void testGetById_whenSessionExists_shouldReturnSession() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));
        Session result = sessionService.getById(1L);
        assertNotNull(result);
    }

    @Test
    public void testGetById_whenSessionDoesNotExist_shouldThrowException() {
        when(sessionRepository.findById(0L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> sessionService.getById(0L));
    }

    @Test
    public void testUpdate_shouldReturnUpdatedSession() {
        when(sessionRepository.save(any(Session.class))).thenReturn(mockSession);
        Session result = sessionService.update(1L, mockSession);
        assertEquals(1L, result.getId());
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    public void testDelete_whenSessionExists_shouldDeleteSession() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));
        sessionService.delete(1L);
        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    public void testParticipate_whenUserNotAlreadyParticipating_shouldAddUser() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));
        when(userService.findById(1L)).thenReturn(mockUser);

        sessionService.participate(1L, 1L);

        assertTrue(mockSession.getUsers().contains(mockUser));
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    public void testParticipate_whenUserAlreadyParticipating_shouldThrowBadRequestException() {
        mockSession.getUsers().add(mockUser); 
        
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));
        when(userService.findById(1L)).thenReturn(mockUser);

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    public void testNoLongerParticipate_whenUserIsParticipating_shouldRemoveUserAndSave() {
        mockSession.getUsers().add(mockUser);
        
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));

        sessionService.noLongerParticipate(1L, 1L);

        assertFalse(mockSession.getUsers().contains(mockUser));
        verify(sessionRepository, times(1)).save(mockSession);
    }

    @Test
    public void testNoLongerParticipate_whenUserIsNotParticipating_shouldThrowBadRequestException() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));
        verify(sessionRepository, never()).save(any(Session.class));
    }
}