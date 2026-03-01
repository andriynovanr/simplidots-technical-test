describe('TMDb - Fitur View Favorite Movie List (Positive Case)', () => {
  const username = Cypress.env('TMDB_USERNAME');

  beforeEach(() => {
    cy.login();
  });

  it('Berhasil melihat daftar film favorite', () => {
    cy.visit(`/u/${username}/favorites/movies`);
    cy.dismissCookieBanner();

    // halaman favorites harus berhasil dimuat
    cy.url().should('include', `/u/${username}/favorites`);
    cy.get('#main').should('be.visible');
  });

  it('Berhasil melihat daftar TV Shows favorite', () => {
    cy.visit(`/u/${username}/favorites/tv`);
    cy.dismissCookieBanner();

    cy.url().should('include', `/u/${username}/favorites`);
    cy.get('#main').should('be.visible');
  });
});

describe('TMDb - Fitur View Favorite Movie List (Negative Case)', () => {
  const username = Cypress.env('TMDB_USERNAME');

  it('Tidak dapat mengakses halaman favorite, server mengembalikan 401', () => {
    // TMDb return 401 Unauthorized langsung tanpa redirect saat tidak ada session
    cy.request({
      url: `https://www.themoviedb.org/u/${username}/favorites/movies`,
      failOnStatusCode: false,
    }).its('status').should('eq', 401);
  });
});
