// Login ke TMDb menggunakan kredensial dari cypress.env.json
Cypress.Commands.add('login', () => {
  const username = Cypress.env('TMDB_USERNAME');
  const password = Cypress.env('TMDB_PASSWORD');

  cy.visit('/login');
  cy.dismissCookieBanner();
  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('#login_button').click();
  cy.url().should('include', `/u/${username}`);
});

// Tutup cookie consent banner jika muncul
Cypress.Commands.add('dismissCookieBanner', () => {
  cy.wait(1000);
  cy.get('body').then(($body) => {
    const btn = $body.find('#onetrust-accept-btn-handler');
    if (btn.length && btn.is(':visible')) {
      btn.click();
    }
  });
});