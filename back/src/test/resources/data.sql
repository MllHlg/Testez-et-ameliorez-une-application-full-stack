INSERT INTO `teachers` (`first_name`, `last_name`) 
VALUES ('First', 'TEACHER');

INSERT INTO `users` (`admin`, `email`, `first_name`, `last_name`, `password`) 
VALUES (1, 'admin@test.com', 'Admin', 'Test', 'admin_password');

INSERT INTO `users` (`admin`, `email`, `first_name`, `last_name`, `password`) 
VALUES (0, 'user@test.com', 'User', 'Test', 'user_password');

INSERT INTO `sessions` (`date`, `description`, `name`, `teacher_id`) 
VALUES ('2026-04-15 10:00:00', 'Description de la session', 'Session Test', 1);

INSERT INTO `participate` (`session_id`, `user_id`) 
VALUES (1, 2);