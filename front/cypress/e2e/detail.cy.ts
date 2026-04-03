describe('Session Detail Spec', () => {

    const mockTeacher = {
        id: 1,
        lastName: 'Teacher',
        firstName: 'First',
        createdAt: '2026-04-01',
        updatedAt: '2026-04-01'
    };

    const mockSession = {
        id: 1,
        name: 'Yoga Session 1',
        description: 'Session 1 description',
        date: '2026-04-01',
        teacher_id: 1,
        users: [],
        createdAt: '2026-04-01',
        updatedAt: '2026-04-01'
    };

    const mockSessionParticipating = { ...mockSession, users: [1] };

    const setupUserAndNavigation = (isAdmin: boolean) => {
        const mockUser = {
            token: 'token',
            type: 'Bearer',
            id: 1,
            username: 'yoga@studio.com',
            firstName: 'Yoga',
            lastName: 'User',
            admin: isAdmin
        };

        cy.intercept('POST', '/api/auth/login', { body: mockUser }).as('login');
        cy.intercept('GET', '/api/session', { body: [mockSession] }).as('sessionsList');
        cy.intercept('GET', '/api/session/1', { body: mockSession }).as('sessionDetail');
        cy.intercept('GET', '/api/teacher/1', { body: mockTeacher }).as('teacher');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('yoga@studio.com');
        cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);
        cy.wait('@login');
        cy.wait('@sessionsList');

        cy.get('[data-testid="detail-button"]').click();
        cy.wait('@sessionDetail');
        cy.wait('@teacher');
    };

    describe('Admin tests', () => {
        beforeEach(() => {
            setupUserAndNavigation(true);
        });

        it('should show session information and delete button', () => {
            cy.get('[data-testid="session-name"]').should('contain', 'Yoga Session 1');
            cy.get('[data-testid="teacher-name"]').should('contain', 'First TEACHER');
            cy.get('[data-testid="session-description"]').should('contain', 'Session 1 description');
            cy.get('[data-testid="session-users-length"]').should('contain', '0 attendees');

            cy.get('[data-testid="delete-button"]').should('be.visible');
            cy.get('[data-testid="participate-button"]').should('not.exist');
        });

        it('should delete session', () => {
            cy.intercept('DELETE', '/api/session/1', { statusCode: 200, body: {} }).as('deleteSession');

            cy.get('[data-testid="delete-button"]').click();
            cy.wait('@deleteSession');

            cy.contains('Session deleted !').should('be.visible');
            cy.url().should('include', '/sessions');
        });
    });

    describe('User tests', () => {
        beforeEach(() => {
            setupUserAndNavigation(false);
        });

        it('should not show the delete button', () => {
            cy.get('[data-testid="delete-button"]').should('not.exist');
        });

        it('should allow the user to subscribe or unsubscribe to a session', () => {
            cy.get('[data-testid="delete-button"]').should('not.exist');
            cy.get('[data-testid="session-users-length"]').should('contain', '0 attendees');
            cy.get('[data-testid="participate-button"]').should('be.visible');
            cy.get('[data-testid="unparticipate-button"]').should('not.exist');

            cy.intercept('POST', '/api/session/1/participate/1', { statusCode: 200, body: {} }).as('participate');
            cy.intercept('GET', '/api/session/1', { body: mockSessionParticipating }).as('sessionDetailParticipating');

            cy.get('[data-testid="participate-button"]').click();
            cy.wait('@participate');
            cy.wait('@sessionDetailParticipating');

            cy.get('[data-testid="session-users-length"]').should('contain', '1 attendees');
            cy.get('[data-testid="unparticipate-button"]').should('be.visible');
            cy.get('[data-testid="participate-button"]').should('not.exist');

            cy.intercept('DELETE', '/api/session/1/participate/1', { statusCode: 200, body: {} }).as('unParticipate');
            cy.intercept('GET', '/api/session/1', { body: mockSession }).as('sessionDetailUnParticipating');

            cy.get('[data-testid="unparticipate-button"]').click();
            cy.wait('@unParticipate');
            cy.wait('@sessionDetailUnParticipating');

            cy.get('[data-testid="session-users-length"]').should('contain', '0 attendees');
            cy.get('[data-testid="participate-button"]').should('be.visible');
        });
    });
});