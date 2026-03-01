describe('TMDb - Fitur Ubah Bahasa (Positive Case)', () => {
  const username = Cypress.env('TMDB_USERNAME');

  beforeEach(() => {
    cy.login();
  });

  it('Berhasil mengubah bahasa UI ke Bahasa Indonesia dan kembali ke Inggris tanpa logout', () => {
    cy.visit('/settings/account');
    cy.dismissCookieBanner();
    cy.wait(2000); 

    // TMDb pakai Kendo UI, selector #preferred_language bukan #language biasa
    cy.window().then($win => {
      $win.$('#preferred_language').data('kendoDropDownList').value('id-ID');
    });
    cy.get('input[type="submit"]').first().click({ force: true });

    // cek UI sudah berubah ke Indonesia
    cy.visit('/');
    cy.dismissCookieBanner();
    cy.contains('Film').should('be.visible');

    // kembalikan ke Inggris agar tes lain tidak terpengaruh
    cy.visit('/settings/account');
    cy.wait(2000);
    cy.window().then($win => {
      $win.$('#preferred_language').data('kendoDropDownList').value('en-US');
    });
    cy.get('input[type="submit"]').first().click({ force: true });

    cy.visit('/');
    cy.dismissCookieBanner();
    cy.contains('Movies').should('be.visible');
  });

  it('TC-04b: Data favorite tetap tersedia setelah perubahan bahasa', () => {
    cy.visit('/settings/account');
    cy.dismissCookieBanner();
    cy.wait(2000);
    cy.window().then($win => {
      $win.$('#preferred_language').data('kendoDropDownList').value('id-ID');
    });
    cy.get('input[type="submit"]').first().click({ force: true });

    // pastikan bahasa sudah berganti
    cy.visit('/');
    cy.dismissCookieBanner();
    cy.contains('Film').should('be.visible');

    // halaman favorites harus tetap bisa diakses
    cy.visit(`/u/${username}/favorites/movies`);
    cy.get('#main').should('be.visible');

    // kembalikan ke Inggris
    cy.visit('/settings/account');
    cy.wait(2000);
    cy.window().then($win => {
      $win.$('#preferred_language').data('kendoDropDownList').value('en-US');
    });
    cy.get('input[type="submit"]').first().click({ force: true });
    cy.visit('/');
    cy.dismissCookieBanner();
    cy.contains('Movies').should('be.visible');
  });
});
