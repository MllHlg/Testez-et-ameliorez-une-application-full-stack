package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.ResourceNotFoundException;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    public void testFindAll_shouldReturnAllTeachers() {
        Teacher firstTeacher = new Teacher();
        firstTeacher.setId(1L);
        firstTeacher.setFirstName("First");
        
        Teacher secondTeacher = new Teacher();
        secondTeacher.setId(2L);
        secondTeacher.setFirstName("Second");
        
        when(teacherRepository.findAll()).thenReturn(Arrays.asList(firstTeacher, secondTeacher));

        List<Teacher> result = teacherService.findAll();

        assertEquals(2, result.size());
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    public void testFindById_whenTeacherExists_shouldReturnTeacher() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("First");
        
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher result = teacherService.findById(1L);

        assertNotNull(result);
        assertEquals("First", result.getFirstName());
        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindById_whenTeacherDoesNotExist_shouldThrowException() {
        when(teacherRepository.findById(0L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            teacherService.findById(0L);
        });
        verify(teacherRepository, times(1)).findById(0L);
    }
}