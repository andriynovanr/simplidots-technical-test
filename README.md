# TMDb Automation Test

Automation testing untuk [TMDb](https://www.themoviedb.org) menggunakan Cypress, dibuat sebagai bagian dari technical test Simplidots.

---

## Persiapan

Pastikan sudah ada Node.js di sistem, lalu install dependency:

```bash
npm install
```

Buat file `cypress.env.json` di root project dan isi dengan akun TMDb:

```json
{
  "TMDB_USERNAME": "username_kamu",
  "TMDB_PASSWORD": "password_kamu"
}
```

---

## Cara Run

Jalankan semua test:

```bash
npx cypress run
```

Buka GUI Cypress untuk run secara interaktif:

```bash
npx cypress open
```

Run satu file saja:

```bash
npx cypress run --spec "cypress/e2e/tmdb_favorite_positive.cy.js"
```

Run beberapa file sekaligus:

```bash
npx cypress run --spec "cypress/e2e/tmdb_language_positive.cy.js,cypress/e2e/tmdb_language_negative.cy.js"
```

---

Skenario pengujian lengkap ada di [TEST_CASES.md](TEST_CASES.md).
