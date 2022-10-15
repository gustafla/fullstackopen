describe('Blog ', function() {
  it('login page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })
})
