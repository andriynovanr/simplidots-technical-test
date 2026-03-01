describe('TMDb - Fitur Mark as Favorite Movies (Positive Case)', () => {
  const username = Cypress.env('TMDB_USERNAME');

  beforeEach(() => {
    cy.login();
  });

  it('Berhasil menambahkan film ke daftar favorite', () => {
    const movieTitle = 'Inside Out 2';

    cy.dismissCookieBanner();

    // cari film lewat search
    cy.get('a.search').click();
    cy.get('#search_v4').should('exist').type(`${movieTitle}{enter}`);

    // masuk ke halaman detail film pertama
    cy.get('.results .card a.result').first().click();

    // klik tombol favorite dan pastikan statusnya aktif
    cy.get('#favourite').should('be.visible').click();
    cy.get('#favourite .glyphicons_v2').should('have.class', 'true');

    // navigasi ke halaman user profile 
    cy.get(`a[title="${username}"]`).click({ force: true });
    cy.get('a[title="View profile"]').click({ force: true });
    cy.url().should('include', `/u/${username}`);

     // navigasi ke halaman favorite movies
    cy.contains('Overview').click();
    cy.contains('Favorites').click();
    cy.get('a.k-menu-link[href*="/favorites"]').contains('Movies').click({ force: true });

    // verifikasi film ada di list movies, ke TV Shows kalau tidak ketemu di Movies
    cy.reload();
    cy.get('body').then(($body) => {
      if (!$body.find('.card').text().includes(movieTitle)) {
        cy.contains('Overview').click();
        cy.contains('Favorites').click();
        cy.get('a.k-menu-link[href*="/favorites"]').contains('TV Shows').click({ force: true });
        cy.reload();
      }
      cy.get('.card').contains(movieTitle).should('be.visible');
    });
  });
});
