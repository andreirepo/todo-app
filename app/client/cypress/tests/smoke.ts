describe('Todo App Smoke Tests', () => {
    beforeEach(() => {
        cy.visit('/')
    })
    it('can remove a note', () => {
        const myNote = 'My Awesome Note!'
        cy.intercept('http://localhost:5000/api/todos').as('getAllTodos')
        // assert spinner not shown
        cy.get('[data-testid=spinner]').should('not.exist')

        // wait for todos 
        cy.wait('@getAllTodos')

        // create new todo
        cy.get('input[placeholder="What would you like to do?"]').type(myNote)
        cy.get('[data-testid=create-todo]').click()

        // remove created todo
        cy.findByText(myNote).parent().within(() => {
            cy.get('.remove-button').click()
        })

        // assert todo removed
        cy.findByText(myNote).should('not.exist')
    });
})
