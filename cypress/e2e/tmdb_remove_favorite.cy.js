describe('TMDb - Fitur Remove from Favorite', () => {
  const username = Cypress.env('TMDB_USERNAME');

  beforeEach(() => {
    cy.login();
  });

  it('Berhasil menghapus film dari halaman Favorite List', () => {
    cy.url().should('include', `/u/${username}`);

    // navigasi ke Favorites > Movies
    cy.contains('Overview').click();
    cy.contains('Favorites').click();
    cy.get('a.k-menu-link[href*="/favorites"]').contains('Movies').click({ force: true });

    cy.url().should('include', `/u/${username}/favorites`);

    // hapus film pertama di list movies yang ada, cek TV Shows jika movies kosong
    cy.get('body').then(($body) => {
      if ($body.find('.remove').length > 0) {
        cy.get('.remove').first().click();
      } else {
        cy.contains('Overview').click();
        cy.contains('Favorites').click();
        cy.get('a.k-menu-link[href*="/favorites"]').contains('TV Shows').click({ force: true });
        cy.get('.remove').first().click();
      }
    });

    // setelah dihapus, list harus kosong
    cy.reload();
    cy.get('.card').should('not.exist');
  });
});