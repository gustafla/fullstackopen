describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user1 = {
      name: 'Lauri Gustafsson',
      username: 'gustafla',
      password: 'password',
    }
    cy.request('POST', 'http://localhost:3001/api/users', user1)

    const user2 = {
      name: 'Matti Luukkainen',
      username: 'luukkainen',
      password: 'matti',
    }
    cy.request('POST', 'http://localhost:3001/api/users', user2)

    cy.visit('http://localhost:3000')
  })

  it('login page is shown', function () {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('fails with wrong username', function () {
      cy.get('#username').type('gustafa')
      cy.get('#password').type('password')
      cy.get('#loginButton').click()

      cy.contains('invalid username or password').should(
        'have.css',
        'color',
        'rgb(255, 0, 0)',
      )
    })

    it('fails with wrong password', function () {
      cy.get('#username').type('gustafla')
      cy.get('#password').type('passwodr')
      cy.get('#loginButton').click()

      cy.contains('invalid username or password').should(
        'have.css',
        'color',
        'rgb(255, 0, 0)',
      )
    })

    it('succeeds with correct creds', function () {
      cy.get('#username').type('gustafla')
      cy.get('#password').type('password')
      cy.get('#loginButton').click()

      cy.contains('Lauri Gustafsson')
      cy.get('.notification').should('have.css', 'color', 'rgb(0, 128, 0)')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'gustafla',
        password: 'password',
      }).then(function (response) {
        localStorage.setItem('loggedUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    function createBlog(title, author, url) {
      cy.contains('new blog').click()
      cy.contains('new blog').should('not.be.visible')
      cy.get('.blogTitleInput').type(title)
      cy.get('.blogAuthorInput').type(author)
      cy.get('.blogUrlInput').type(url)
      cy.get('.blogCreateButton').click()

      cy.contains('new blog').should('be.visible')
      cy.get('.blogTitleInput').should('not.be.visible').and('be.empty')
      cy.get('.blogAuthorInput').should('not.be.visible').and('be.empty')
      cy.get('.blogUrlInput').should('not.be.visible').and('be.empty')
    }

    it('a blog can be created and seen immediately as well as permanently', function () {
      createBlog('Hello World', 'Testers', 'http://localhost:3000')

      cy.contains('p', 'Hello World')
      cy.contains('p', 'Tester')

      cy.visit('http://localhost:3000')
      cy.contains('Hello World')
      cy.contains('Tester')
    })

    it('a created blog can be liked and the like is saved', function () {
      createBlog('Hello World', 'Testers', 'http://localhost:3000')

      cy.get('.blog').click()
      cy.get('.blogLikeButton').click()
      cy.contains('likes 1')

      cy.visit('http://localhost:3000')
      cy.get('.blog').click()
      cy.contains('likes 1')
    })

    it('a created blog can be deleted permanently', function () {
      createBlog('Hello World', 'Testers', 'http://localhost:3000')

      cy.visit('http://localhost:3000')
      cy.get('.blog').click()
      cy.get('.blogRemoveButton').click()

      cy.get('.blog').should('not.exist')
      cy.visit('http://localhost:3000')
      cy.get('.blog').should('not.exist')
      cy.contains('Hello World').should('not.exist')
    })

    it('a created blog cannot be deleted by a different user', function () {
      createBlog('Hello World', 'Testers', 'http://localhost:3000')

      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'luukkainen',
        password: 'matti',
      }).then(function (response) {
        localStorage.setItem('loggedUser', JSON.stringify(response.body))
      })

      cy.visit('http://localhost:3000')
      cy.get('.blog').click()
      cy.get('.blogRemoveButton').should('not.exist')
    })

    it('blogs are ordered by likes', function () {
      createBlog('Hello World 1', 'Testers', 'http://localhost:3001')
      createBlog('Hello World 2', 'Testers', 'http://localhost:3002')
      createBlog('Hello World 3', 'Testers', 'http://localhost:3003')
      createBlog('Hello World 4', 'Testers', 'http://localhost:3004')

      cy.get('.blog').each(function (e) {
        e.click()
      })

      // second twice
      cy.contains('.blogTitle', 'Hello World 2')
        .parent()
        .within(function () {
          cy.get('.blogLikeButton').click()
          cy.contains('likes 1')
          cy.get('.blogLikeButton').click()
          cy.contains('likes 2')
        })

      // third 5 times
      cy.contains('.blogTitle', 'Hello World 3')
        .parent()
        .within(function () {
          cy.get('.blogLikeButton').click()
          cy.contains('likes 1')
          cy.get('.blogLikeButton').click()
          cy.contains('likes 2')
          cy.get('.blogLikeButton').click()
          cy.contains('likes 3')
          cy.get('.blogLikeButton').click()
          cy.contains('likes 4')
          cy.get('.blogLikeButton').click()
          cy.contains('likes 5')
        })

      // fourth 1 times
      cy.contains('.blogTitle', 'Hello World 4')
        .parent()
        .within(function () {
          cy.get('.blogLikeButton').click()
          cy.contains('likes 1')
        })

      cy.get('.blog').eq(0).should('include.text', 'likes 5')
      cy.get('.blog').eq(1).should('include.text', 'likes 2')
      cy.get('.blog').eq(2).should('include.text', 'likes 1')
      cy.get('.blog').eq(3).should('include.text', 'likes 0')

      cy.visit('http://localhost:3000')

      cy.get('.blog').each(function (e) {
        e.click()
      })

      cy.get('.blog').eq(0).should('include.text', 'likes 5')
      cy.get('.blog').eq(1).should('include.text', 'likes 2')
      cy.get('.blog').eq(2).should('include.text', 'likes 1')
      cy.get('.blog').eq(3).should('include.text', 'likes 0')
    })
  })
})
