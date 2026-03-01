describe('TMDb - Fitur Mark as Favorite (Negative Case)', () => {

  it('Gagal menambahkan movie ke favorite jika user belum login', () => {
    cy.visit('/movie/1022789-inside-out-2');
    cy.dismissCookieBanner();

    // klik favorite tanpa login
    cy.get('#favourite').should('be.visible').click();

    // harus muncul pesan login, bukan langsung tersimpan
    cy.contains('Masuk untuk menambahkan film ke daftar sukaan anda').should('be.visible');
    cy.url().should('not.include', '/favorites');
  });
});