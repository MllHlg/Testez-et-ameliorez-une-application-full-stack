describe('App Spec', () => {

    const mockUser = {
        token: 'token',
        type: 'Bearer',
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
    };

    it('should log out the user', () => {
        cy.intercept('POST', '/api/auth/login', { body: mockUser }).as('login');
        cy.intercept('GET', '/api/session', { body: [] }).as('sessions');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('yoga@studio.com');
        cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);
        cy.wait('@login');

        cy.get('[data-testid="sessions-page"]').should('be.visible');
        cy.get('[data-testid="account-page"]').should('be.visible');
        cy.get('[data-testid="logout"]').should('be.visible');

        cy.get('[data-testid="logout"]').click();

        cy.url().should('eq', Cypress.config().baseUrl + 'login');
        cy.get('[data-testid="login"]').should('be.visible');
        cy.get('[data-testid="register"]').should('be.visible');
    });

    it('should redirect to the login page if not connected', () => {
        cy.visit('/sessions');
        cy.url().should('include', '/login');
    });

    it('should unable a connected user to go to the login page', () => {
        cy.intercept('POST', '/api/auth/login', { body: mockUser }).as('login');
        cy.intercept('GET', '/api/session', { body: [] }).as('sessions');

        cy.visit('/login');
        cy.get('input[formControlName="email"]').type('yoga@studio.com');
        cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);
        cy.wait('@login');

        cy.wait('@sessions');
        cy.url().should('include', '/sessions');

        cy.go('back');

        cy.url().should('include', '/sessions');
    });

});