describe('TMDb - Fitur Ubah Bahasa (Negative Case)', () => {
  it('Sistem tidak crash dan kembali ke bahasa Inggris jika parameter bahasa tidak valid', () => {
    // akses dengan kode bahasa yang tidak valid
    cy.visit('/?language=xx-XX');
    cy.dismissCookieBanner();

    // halaman harus tetap muncul normal, bukan error
    cy.get('body').should('be.visible');
    cy.get('header').should('be.visible');
    cy.contains('Movies').should('be.visible');
  });
});