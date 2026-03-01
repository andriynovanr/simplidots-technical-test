# Test Cases — TMDb Automation

Skenario pengujian untuk 5 user story fitur TMDb.

---

## User Story 1: View Favorite Movie List

> Sebagai user yang sudah login, saya ingin bisa melihat daftar film favorit saya, supaya mudah dicari lagi nanti.

```gherkin
Feature: View Favorite Movie List

  Scenario: Melihat daftar film favorit
    Given saya sudah login ke TMDb
    When saya buka halaman /u/<username>/favorites/movies
    Then halaman terbuka dengan normal
    And URL mengandung "/favorites"

  Scenario: Melihat daftar TV Shows favorit
    Given saya sudah login ke TMDb
    When saya buka halaman /u/<username>/favorites/tv
    Then halaman terbuka dengan normal
    And URL mengandung "/favorites"

  Scenario: Akses halaman favorit tanpa login
    Given saya belum login
    When saya request langsung ke /u/<username>/favorites/movies
    Then server menolak dengan status 401 Unauthorized
```

---

## User Story 2: Mark as Favorite

> Sebagai user yang sudah login, saya ingin menandai film sebagai favorit dari halaman detail filmnya.

```gherkin
Feature: Mark as Favorite

  Scenario: Menambahkan film ke daftar favorit
    Given saya sudah login ke TMDb
    When saya cari film "Inside Out 2" lewat fitur search
    And saya buka halaman detail film pertama dari hasil pencarian
    And saya klik tombol favorite
    Then tombol favorite aktif
    And film muncul di halaman /u/<username>/favorites

  Scenario: Tidak bisa tambah favorit sebelum login
    Given saya belum login
    When saya buka halaman detail /movie/1022789-inside-out-2
    And saya klik tombol favorite
    Then muncul pesan "Masuk untuk menambahkan film ke daftar sukaan anda"
    And tidak ada redirect ke halaman favorites
```

---

## User Story 3: Remove from Favorite

> Sebagai user yang sudah login, saya ingin menghapus film dari daftar favorit kalau sudah tidak relevan.

```gherkin
Feature: Remove from Favorite

  Scenario: Menghapus film dari daftar favorit
    Given saya sudah login ke TMDb
    And ada minimal satu film di halaman /u/<username>/favorites/movies
    When saya klik tombol remove pada film pertama
    Then film tersebut hilang dari daftar
    And setelah halaman di-reload, tidak ada card film yang tersisa
```

---

## User Story 4: Ubah Bahasa UI

> Sebagai user yang sudah login, saya ingin mengubah bahasa tampilan TMDb sesuai preferensi saya.

```gherkin
Feature: Ubah Bahasa UI

  Scenario: Mengubah bahasa ke Indonesia
    Given saya sudah login ke TMDb
    When saya buka /settings/account
    And saya ganti preferred language ke "id-ID"
    And saya simpan perubahan
    Then halaman utama menampilkan kata "Film" di navigasi

  Scenario: Mengembalikan bahasa ke Inggris
    Given bahasa UI saat ini sudah diset ke Indonesia
    When saya buka /settings/account
    And saya ganti preferred language kembali ke "en-US"
    And saya simpan perubahan
    Then halaman utama menampilkan kata "Movies" di navigasi

  Scenario: Data favorit tetap ada setelah ganti bahasa
    Given saya sudah login dan mengganti bahasa ke Indonesia
    When saya buka /u/<username>/favorites/movies
    Then halaman favorit tetap bisa diakses dan tampil normal

  Scenario: Halaman tidak error dengan parameter bahasa tidak valid
    Given saya tidak perlu login untuk skenario ini
    When saya akses /?language=xx-XX
    Then halaman tetap terbuka, tidak ada error 500
    And browser menampilkan halaman dengan bahasa default-nya
```

---

## User Story 5: Sorting Daftar Favorite

> Sebagai user yang sudah login, saya ingin bisa mengurutkan daftar favorit supaya lebih mudah dicari.

```gherkin
Feature: Sorting Daftar Favorite

  Scenario: Sorting berdasarkan Popularity
    Given saya sudah login ke TMDb
    When saya buka /u/<username>/favorites
    And saya klik filter Popularity
    Then URL berubah dan mengandung "sort_by=popularity"
    And halaman tetap tampil normal

  Scenario: Sorting berdasarkan Release Date
    Given saya sudah login ke TMDb
    When saya buka /u/<username>/favorites
    And saya klik filter Release Date
    Then URL berubah dan mengandung "sort_by=release_date"
    And halaman tetap tampil normal

  Scenario: Sorting tetap bisa dipakai setelah login ulang
    Given saya sudah login dan membuka halaman favorites dengan sort_by=popularity
    When saya logout lalu login kembali
    And saya buka lagi URL dengan parameter sort_by=popularity
    Then halaman terbuka dengan benar dan URL masih mengandung "sort_by=popularity"

  Scenario: Parameter sorting tidak valid tidak menyebabkan crash
    Given saya sudah login ke TMDb
    When saya akses /u/<username>/favorites?sort_by=invalid_column&sort_order=desc
    Then server merespons dengan 4xx, bukan 500 atau blank page
    And halaman masih render dengan normal
```

---

## Ringkasan

| ID     | Fitur                               | Tipe     | File                          |
|--------|-------------------------------------|----------|-------------------------------|
| TC-01a | View Favorite List (Movies)         | Positive | tmdb_view_favorite.cy.js      |
| TC-01b | View Favorite List (TV Shows)       | Positive | tmdb_view_favorite.cy.js      |
| TC-01c | View Favorite tanpa login           | Negative | tmdb_view_favorite.cy.js      |
| TC-02a | Tambah Favorite                     | Positive | tmdb_favorite_positive.cy.js  |
| TC-02b | Tambah Favorite tanpa login         | Negative | tmdb_favorite_negative.cy.js  |
| TC-03  | Hapus dari Favorite                 | Positive | tmdb_remove_favorite.cy.js    |
| TC-04a | Ubah Bahasa ke Indonesia            | Positive | tmdb_language_positive.cy.js  |
| TC-04b | Kembalikan Bahasa ke Inggris        | Positive | tmdb_language_positive.cy.js  |
| TC-04c | Favorit tetap ada setelah ganti bahasa | Positive | tmdb_language_positive.cy.js |
| TC-04d | Bahasa param tidak valid            | Negative | tmdb_language_negative.cy.js  |
| TC-05a | Sorting Popularity                  | Positive | tmdb_sorting_positive.cy.js   |
| TC-05b | Sorting Release Date                | Positive | tmdb_sorting_positive.cy.js   |
| TC-05c | Sorting setelah re-login            | Positive | tmdb_sorting_positive.cy.js   |
| TC-05d | Sorting param tidak valid           | Negative | tmdb_sorting_negative.cy.js   |
