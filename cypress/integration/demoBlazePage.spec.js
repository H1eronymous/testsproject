//Test for ui without user login or for functionality that is not impacted by login status
const defaultEntries = require('../fixtures/entries.json')
const phoneCatjson = require('../fixtures/phoneCat.json')
const laptopCatjson = require('../fixtures/laptopCat.json')
const monitorCatjson = require('../fixtures/monitorCat.json')
const paginationjson = require('../fixtures/pagination.json')
const username = Date.now() + 'username'

describe('Demo Blaze Page Test', () => {


    beforeEach(() => {
        cy.visit('https://demoblaze.com/')
    })

    it('Home Navbar', () => {
        cy.get('li.nav-item.active > a').should('have.text', 'Home (current)') // (current) doesn't serve any purpose, text stays the same on cart page for example.
        cy.get('li.nav-item.active > a').click()
        cy.url().should('eq', 'https://demoblaze.com/index.html')
    })

    it('Navbar Contact', () => {
        cy.get('[data-target="#exampleModal"]').should('have.text', 'Contact').then(() => {
            cy.get('[data-target="#exampleModal"]').click()
            cy.get('[id="exampleModal"]').should('have.attr', 'style', 'display: block;')
            cy.get('[id="exampleModalLabel"]').should('have.text', 'New message')
            cy.get('#exampleModal > div > div > div.modal-footer > button.btn.btn-secondary').should('be.visible')
            cy.wait(1000) // let modal transition in
            cy.get('#exampleModal > div > div > div.modal-footer > button.btn.btn-secondary').click()
            cy.get('[id="exampleModal"]').should('not.be.visible')
            cy.get('[data-target="#exampleModal"]').click()
            cy.wait(1000) // let modal transition in
            cy.get('#exampleModal > div > div > div.modal-footer > button.btn.btn-primary').click()
            cy.get('[id="exampleModal"]').should('not.be.visible')
        })
    })

    it('Navbar About us',() => {
        cy.get('[data-target="#videoModal"]').should('have.text', 'About us').then(() => {
            cy.get('[data-target="#videoModal"]').click()
            cy.get('[id="videoModal"]').should('have.attr', 'style', 'display: block;')
            cy.get('[id="videoModalLabel"]').should('have.text', 'About us')
            cy.wait(1000) // let modal transition in
            cy.get('#videoModal > div > div > div.modal-footer > button.btn.btn-secondary').click()
            cy.get('[id="videoModal"]').should('have.attr', 'style', 'display: none;')
        })
    })

    it('Navbar Cart', () => {
        cy.get('[id="cartur"]').should('have.text', 'Cart') // doesn't match pattern and weird id
        cy.get('[id="cartur"]').click()
        cy.url().should('eq', 'https://demoblaze.com/cart.html')
    })

    it('Navbar Login', () => {
        cy.get('[data-target="#logInModal"]').should('have.text', 'Log in').then(() => {
            cy.get('[data-target="#logInModal"]').click()
            cy.get('[id="logInModal"]').should('have.attr', 'style', 'display: block;')
            cy.wait(1000) // let modal transition in
            cy.get('#logInModal > div > div > div.modal-footer > button.btn.btn-secondary').click()
            cy.get('[id="logInModal"]').should('have.attr', 'style', 'display: none;')
            cy.get('[data-target="#logInModal"]').click()
            cy.get('[id="loginusername"]').click().type('fad')
            cy.get('[id="loginusername"]').should('have.value', 'fad')
            cy.get('[id="loginpassword"]').click().type('test1234')
            cy.get('[id="loginpassword"]').should('have.value', 'test1234')
            cy.get('#logInModal > div > div > div.modal-footer > button.btn.btn-primary').click()
            cy.get('[id="logout2"]').should('have.attr', 'style', 'display: block;')
            cy.get('[id="nameofuser"]').should('have.attr', 'style', 'display: block;')

        })
    })

    it('Navbar Guest Hidden', () => {
        cy.get('[id="logout2"]').should('have.attr', 'style', 'display:none') // validate hidden without login
        cy.get('[id="nameofuser"]').should('have.attr', 'style', 'display:none') // validate hidden without login
    })

    it('Navbar Sign In', () => {
        cy.get('[data-target="#signInModal"]').should('have.text', 'Sign up').then(() => {
            cy.get('[data-target="#signInModal"]').click()
            cy.get('[id="signInModal"]').should('have.attr', 'style', 'display: block;')
            cy.wait(1000) // let modal transition in
            cy.get('#signInModal > div > div > div.modal-footer > button.btn.btn-secondary').click()
            cy.get('[id="signInModal"]').should('have.attr', 'style', 'display: none;')
            cy.intercept('POST', 'https://api.demoblaze.com/signup').as('signUp')
            cy.get('[data-target="#signInModal"]').click()
            cy.get('[id="sign-username"]').click().type(username)
            cy.get('[id="sign-username"]').should('have.value', username)
            cy.get('[id="sign-password"]').type('test1234')
            cy.get('[id="sign-password"]').should('have.value', 'test1234')
            cy.get('#signInModal > div > div > div.modal-footer > button.btn.btn-primary').click()
            cy.wait('@signUp').its('response.statusCode').should('eq', 200)
        })
    })

    it('Home Page Carousel', () => {
        cy.get('div.carousel-item.active > img').should('have.attr', 'alt', 'First slide')
        cy.get('[class="carousel-control-next-icon"]').click()
        cy.get('div.carousel-item.active > img').should('have.attr', 'alt', 'Second slide')
        cy.get('[class="carousel-control-prev-icon"]').click()
        cy.get('div.carousel-item.active > img').should('have.attr', 'alt', 'First slide')
        cy.get('[class="carousel-control-prev-icon"]').click()
        cy.get('div.carousel-item.active > img').should('have.attr', 'alt', 'Third slide')
    })

    it('Home Page Categories', () => {
        cy.intercept('GET', 'https://api.demoblaze.com/entries').as('homeEntries')
        cy.get('li.nav-item.active > a').click()
        cy.wait('@homeEntries').its('response.body').should('deep.equal', defaultEntries)
        cy.intercept('POST', 'https://api.demoblaze.com/bycat').as('byCat')
        cy.get('[onclick="byCat(\'phone\')"]').click()
        cy.wait('@byCat').its('response.body').should('deep.equal', phoneCatjson)
        cy.get('[onclick="byCat(\'notebook\')"]').click()
        cy.wait('@byCat').its('response.body').should('deep.equal', laptopCatjson)
        cy.get('[onclick="byCat(\'monitor\')"]').click()
        cy.wait('@byCat').its('response.body').should('deep.equal', monitorCatjson)
    })

    it('Home Page Pagination', () => {
        cy.intercept('POST', 'https://api.demoblaze.com/pagination').as('pagination')
        cy.get('[id="tbodyid"]').should('be.visible') // wait for data to load into ui so button location is stable
        cy.get('[id="next2"]').click()
        cy.wait('@pagination').its('response.body').should('deep.equal', paginationjson)
        cy.get('[id="prev2"]').click()
        cy.wait('@pagination').its('response.body').should('deep.equal', defaultEntries) //expected to fail, bug in page
    })

})