describe('Session List Spec', () => {

    const mockSessions = [
        {
            id: 1,
            name: 'Yoga Session 1',
            description: 'Session 1 descrition',
            date: '2026-04-01',
            teacher_id: 1,
            users: [],
            createdAt: '2026-04-01',
            updatedAt: '2026-04-01'
        },
        {
            id: 2,
            name: 'Yoga Session 2',
            description: 'Session 2 descrition',
            date: '2026-04-01',
            teacher_id: 2,
            users: [],
            createdAt: '2026-04-01',
            updatedAt: '2026-04-01'
        }
    ];

    const getMockSessionInfo = (isAdmin: boolean) => ({
        token: 'token',
        type: 'Bearer',
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: isAdmin
    });

    it('should show the list of sessions without admin buttons', () => {
        cy.intercept('POST', '/api/auth/login', { body: getMockSessionInfo(false) }).as('login');
        cy.intercept('GET', '/api/session', { body: mockSessions }).as('sessions');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('yoga@studio.com');
        cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);

        cy.wait('@login');
        cy.wait('@sessions');

        cy.contains('Yoga Session 1').should('be.visible');
        cy.contains('Session 1 descrition').should('be.visible');
        cy.contains('Yoga Session 2').should('be.visible');
        cy.contains('Session 2 descrition').should('be.visible');

        cy.get('[data-testid="add-button"]').should('not.exist');
        cy.get('[data-testid="edit-button"]').should('not.exist');

        cy.get('[data-testid="detail-button"]').should('be.visible');
    });

    it('should show admin buttons', () => {
        cy.intercept('POST', '/api/auth/login', { body: getMockSessionInfo(true) }).as('login');
        cy.intercept('GET', '/api/session', { body: mockSessions }).as('sessions');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('yoga@studio.com');
        cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);

        cy.wait('@login');
        cy.wait('@sessions');

        cy.get('[data-testid="add-button"]').should('be.visible');
        cy.get('[data-testid="edit-button"]').should('be.visible');
        cy.get('[data-testid="edit-button"]').should('have.length', 2);
    });
});