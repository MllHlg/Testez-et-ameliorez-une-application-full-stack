describe('Me spec', () => {
    const mockSession = {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
    };

    const mockUserData = {
        id: 1,
        email: 'yoga@studio.com',
        lastName: 'lastName',
        firstName: 'firstName',
        admin: true,
        password: 'test!1234',
        createdAt: '2026-04-01',
        updatedAt: '2026-04-01'
    };
    beforeEach(() => {
        cy.intercept('POST', '/api/auth/login', { body: mockSession }).as('login');
    });

    it('should show user information', () => {
        cy.intercept('GET', '/api/user/1', { body: mockUserData }).as('user');
        cy.intercept('GET', '/api/session', []).as('session')

        cy.visit('/login');

        cy.get('input[formControlName="email"]').type('yoga@studio.com');
        cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);

        cy.wait('@login');
        cy.wait('@session');

        cy.get('[data-testid="account-page"]').click();

        cy.wait('@user');

        cy.contains('yoga@studio.com').should('be.visible');
        cy.contains('firstName').should('be.visible');
    });

    it('should delet user', () => {
        mockUserData.admin = false;
        cy.intercept('GET', '/api/user/1', { body: mockUserData }).as('user');
        cy.intercept('GET', '/api/session', []).as('session')
        cy.intercept('DELETE', '/api/user/1', []).as('deleteAccount');

        cy.visit('/login');

        cy.get('input[formControlName="email"]').type('yoga@studio.com');
        cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);

        cy.wait('@login');
        cy.wait('@session');

        cy.get('[data-testid="account-page"]').click();

        cy.wait('@user');

        cy.get('[data-testid="delete-button"]')
            .should('be.visible')
            .click();

        cy.wait('@deleteAccount');

        cy.contains("Your account has been deleted !").should('be.visible');

        cy.url().should('include', '/login')
    });

    it('should go back when back button is clicked', () => {
        cy.intercept('GET', '/api/user/1', { body: mockUserData }).as('user');
        cy.intercept('GET', '/api/session', []).as('session');

        cy.visit('/login');

        cy.get('input[formControlName="email"]').type('yoga@studio.com');
        cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);

        cy.wait('@login');
        cy.wait('@session');

        cy.get('[data-testid="account-page"]').click();
        cy.wait('@user');

        cy.window().then((win) => {
            cy.spy(win.history, 'back').as('historyBack');
        });

        cy.get('[data-testid="back-button"]').click();

        cy.get('@historyBack').should('have.been.calledOnce');
    });
});