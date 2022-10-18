describe('Blog ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('login page can be opened', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })
})
