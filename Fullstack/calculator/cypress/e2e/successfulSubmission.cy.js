describe('Successful Submission', () => {
  it('should show a success message upon form submission', () => {
    cy.visit('localhost:8080/contact');
    cy.get('#name').type('Test User');
    cy.get('#email').type('test@example.com');
    cy.get('#message').type('This is a test message.');
    cy.get('button[type="submit"]').click();
    // Anta at suksessmeldingen vises som en alert; må endres basert på faktisk implementasjon
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Skjema sendt suksessfullt!');
    });
  });
});
