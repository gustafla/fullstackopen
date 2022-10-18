describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Lauri Gustafsson',
      username: 'gustafla',
      password: 'password',
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('login page is shown', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('fails with wrong username', function() {
      cy.get('#username').type('gustafa')
      cy.get('#password').type('password')
      cy.get('#loginButton').click()

      cy.contains('invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })

    it('fails with wrong password', function() {
      cy.get('#username').type('gustafla')
      cy.get('#password').type('passwodr')
      cy.get('#loginButton').click()

      cy.contains('invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })

    it('succeeds with correct creds', function() {
      cy.get('#username').type('gustafla')
      cy.get('#password').type('password')
      cy.get('#loginButton').click()

      cy.contains('Lauri Gustafsson')
      cy.get('.notification')
        .should('have.css', 'color', 'rgb(0, 128, 0)')
    })
  })
})
