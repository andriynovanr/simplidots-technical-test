describe('TMDb - Fitur Sorting Favorite (Positive Case)', () => {
  const username = Cypress.env('TMDB_USERNAME');

  beforeEach(() => {
    cy.login();
  });

  it('Berhasil melakukan sorting berdasarkan Popularity', () => {
    cy.visit(`/u/${username}/favorites`);
    cy.dismissCookieBanner();

    // pakai data attribute agar tidak bergantung pada teks label yang bisa berubah per bahasa
    cy.get('a.filter_list[data-sort-by="popularity"]').click({ force: true });

    cy.url().should('include', 'sort_by=popularity');
    cy.get('#main').should('be.visible');
  });

  it('Berhasil melakukan sorting berdasarkan Release Date', () => {
    cy.visit(`/u/${username}/favorites`);
    cy.dismissCookieBanner();

    cy.get('a.filter_list[data-sort-by="release_date"]').click({ force: true });

    cy.url().should('include', 'sort_by=release_date');
    cy.get('#main').should('be.visible');
  });

  it('Sorting tetap berfungsi setelah user login kembali', () => {
    cy.visit(`/u/${username}/favorites?sort_by=popularity&sort_order=desc`);
    cy.dismissCookieBanner();
    cy.url().should('include', 'sort_by=popularity');
    cy.get('#main').should('be.visible');

    // simulasi logout dengan clear session
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.login();

    // akses kembali dengan parameter sorting yang sama
    cy.visit(`/u/${username}/favorites?sort_by=popularity&sort_order=desc`);
    cy.dismissCookieBanner();

    cy.url().should('include', 'sort_by=popularity');
    cy.get('#main').should('be.visible');
  });
});
