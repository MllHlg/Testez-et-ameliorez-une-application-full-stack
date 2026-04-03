describe('Session Form Spec', () => {
  const mockAdminSession = {
    token: 'token',
    type: 'Bearer',
    id: 1,
    username: 'yoga@studio.com',
    firstName: 'Yoga',
    lastName: 'Admin',
    admin: true
  };

  const mockTeachers = [
    { id: 1, lastName: 'Teacher', firstName: 'First', createdAt: '2026-04-01', updatedAt: '2026-04-01' },
    { id: 2, lastName: 'Teacher', firstName: 'Second', createdAt: '2026-04-01', updatedAt: '2026-04-01' }
  ];
  
  const mockSessionDetail = {
    id: 1,
    name: 'Yoga Session 1',
    description: 'Session 1 description',
    date: '2026-04-01',
    teacher_id: 1,
    users: [],
    createdAt: '2026-04-01',
    updatedAt: '2026-04-01'
  };

  const mockSessionsList = [mockSessionDetail];

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', { body: mockAdminSession }).as('login');
    cy.intercept('GET', '/api/session', { body: mockSessionsList }).as('sessions');
    cy.intercept('GET', '/api/teacher', { body: mockTeachers }).as('teachers');

    cy.visit('/login');
    cy.get('input[formControlName="email"]').type('admin@studio.com');
    cy.get('input[formControlName="password"]').type(`${"test!1234"}{enter}{enter}`);

    cy.wait('@login');
    cy.wait('@sessions');
  });

  it('should create a session', () => {
    cy.intercept('POST', '/api/session', []).as('createSession');

    cy.get('[data-testid="add-button"]').click();
    cy.wait('@teachers');

    cy.get('[data-testid="save-button"]').should('be.disabled');

    cy.get('input[formControlName="name"]').type('Yoga Session 2');
    cy.get('input[formControlName="date"]').type('2026-04-02');
    
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Second Teacher').click();

    cy.get('textarea[formControlName="description"]').type('Session 2 description');

    cy.get('[data-testid="save-button"]')
      .should('not.be.disabled')
      .click();

    cy.wait('@createSession').then((interception) => {
      expect(interception.request.body.name).to.eq('Yoga Session 2');
    });

    cy.contains('Session created !').should('be.visible');
    cy.url().should('include', '/sessions');
  });

  it('should update a session', () => {
    cy.intercept('GET', '/api/session/1', { body: mockSessionDetail }).as('sessionDetail');
    cy.intercept('PUT', '/api/session/1', { statusCode: 200, body: mockSessionDetail }).as('updateSession');

    cy.get('[data-testid="edit-button"]').first().click();
    
    cy.wait('@sessionDetail');
    cy.wait('@teachers');

    cy.get('input[formControlName="name"]').should('have.value', 'Yoga Session 1');

    cy.get('input[formControlName="name"]').clear().type('Yoga Session 1 edited');

    cy.get('[data-testid="save-button"]').click();

    cy.wait('@updateSession').then((interception) => {
      expect(interception.request.body.name).to.eq('Yoga Session 1 edited');
    });

    cy.contains('Session updated !').should('be.visible');
    cy.url().should('include', '/sessions');
  });
});