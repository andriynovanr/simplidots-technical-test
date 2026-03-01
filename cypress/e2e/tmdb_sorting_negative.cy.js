describe('TMDb - Fitur Sorting Favorite (Negative Case)', () => {
  const username = Cypress.env('TMDB_USERNAME');

  beforeEach(() => {
    cy.login();
  });

  it('Sistem tidak crash saat parameter sorting tidak valid', () => {
    // server akan return, failOnStatusCode: false agar Cypress tidak langsung fail
    cy.visit(`/u/${username}/favorites?sort_by=invalid_column&sort_order=desc`, { failOnStatusCode: false });
    cy.dismissCookieBanner();

    // halaman tetap harus render
    cy.get('body').should('be.visible');
    cy.get('#main').should('be.visible');
  });
});
