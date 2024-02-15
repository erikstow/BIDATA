describe('Form Validation', () => {
  it('Submit button should be disabled if the form is invalid', () => {
    cy.visit('localhost:8080/contact');
    cy.get('#name').type('Test User');
    cy.get('#email').type('test'); // Ugyldig e-post
    cy.get('#message').type('This is a test message.');
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
