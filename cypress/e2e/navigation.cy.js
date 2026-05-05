describe('template spec', () => {
  it('passes', () => {
    cy.visit('localhost:8081/')
    cy.get('#root div.mb-8 > div:nth-child(1) > div.\\[\\&\\:last-child\\]\\:pb-6 > div.space-y-3 > div:nth-child(1)').click();
    cy.get('#root tr:nth-child(1) span.font-medium').click();
    cy.get('#root button._small_dx36y_157').click();
    cy.get('#root div.editor-content-editable').click();
    cy.get('#root div.editor-content-editable').clear();
    cy.get('#root div.editor-content-editable').type('123123');
    cy.get('#root button._small_dx36y_157').click();
    cy.get('#root div._navBar_m7dys_53 a:nth-child(1)').click();
    cy.get('#root a[href="/test"]').click();
    cy.get('#root a:nth-child(1)').click();
  })
})