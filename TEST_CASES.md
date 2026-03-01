# Test Cases — TMDb Mark as Favorite

Dokumen ini berisi seluruh skenario pengujian berdasarkan User Stories dan Acceptance Criteria yang diberikan.

---

## User Story 1: Mark as Favorite

Sebagai user yang sudah login, saya ingin bisa menandai film sebagai favorit agar film yang saya suka tersimpan dan mudah ditemukan kembali.

```gherkin
Feature: Mark as Favorite

  Background:
    Given saya sudah login ke akun TMDb saya

  # --- Positive ---

  Scenario: Menambahkan film ke favorit dari halaman detail film
    When saya buka halaman detail sebuah film
    And saya klik tombol favorit yang ada di halaman tersebut
    Then ikon tombol favorit berubah menjadi aktif
    And film tersebut muncul di halaman /u/<username>/favorites

  Scenario: Menambahkan film ke favorit dari halaman listing film
    When saya buka halaman daftar film, misalnya halaman Popular Movies
    And saya klik ikon favorit yang muncul saat hover pada salah satu film
    Then ikon favorit film tersebut berubah menjadi aktif
    And film tersebut muncul di halaman /u/<username>/favorites

  Scenario: Indikator favorit tampil konsisten di halaman listing dan detail
    Given saya sudah menandai film "Inside Out 2" sebagai favorit
    When saya lihat film tersebut di halaman listing
    Then ikon favorit film tersebut tampil dalam kondisi aktif
    When saya buka halaman detail film tersebut
    Then tombol favorit di halaman detail juga tampil dalam kondisi aktif

  Scenario: Bisa menambahkan lebih dari satu film ke favorit
    When saya tandai film pertama sebagai favorit
    And saya tandai film kedua yang berbeda sebagai favorit
    Then kedua film tersebut muncul di halaman /u/<username>/favorites

  Scenario: Film yang sama tidak muncul dua kali di daftar favorit
    Given film "Inside Out 2" sudah ada di daftar favorit saya
    When saya buka halaman detail film tersebut
    And saya klik tombol favorit sekali lagi
    Then film tersebut tidak muncul dua kali di halaman /u/<username>/favorites

  # --- Negative ---

  Scenario: Tidak bisa menambahkan favorit jika belum login
    Given saya belum login ke akun apapun
    When saya buka halaman detail film
    And saya klik tombol favorit
    Then muncul pesan yang meminta saya untuk login terlebih dahulu
    And film tidak tersimpan ke daftar favorit manapun
```

---

## User Story 2: View Favorite Movie List

Sebagai user, saya ingin bisa melihat daftar film favorit saya agar mudah mengakses film yang sudah saya tandai.

```gherkin
Feature: Melihat Daftar Film Favorit

  Background:
    Given saya sudah login ke akun TMDb saya

  # --- Positive ---

  Scenario: Membuka halaman daftar film favorit
    When saya buka halaman /u/<username>/favorites/movies
    Then halaman berhasil dimuat tanpa error
    And daftar film yang pernah saya favorit tampil di sana

  Scenario: Film terbaru yang di-favorit muncul paling atas
    Given saya sudah punya beberapa film di daftar favorit
    When saya menambahkan satu film baru ke favorit
    And saya buka halaman /u/<username>/favorites/movies
    Then film yang baru saja saya tambahkan muncul di urutan paling atas daftar

  Scenario: Informasi film di halaman favorit konsisten dengan halaman listing
    When saya buka halaman /u/<username>/favorites/movies
    Then judul, poster, dan informasi film yang tampil sama dengan yang ada di halaman listing

  # --- Negative ---

  Scenario: Halaman favorit tidak bisa diakses tanpa login
    Given saya belum login ke akun apapun
    When saya coba akses langsung halaman /u/<username>/favorites/movies
    Then server menolak permintaan saya
    And saya tidak bisa melihat isi daftar favorit tersebut
```

---

## User Story 3: Remove Movie from Favorite

Sebagai user, saya ingin bisa menghapus film dari daftar favorit agar daftarnya tetap relevan dengan selera saya sekarang.

```gherkin
Feature: Menghapus Film dari Daftar Favorit

  Background:
    Given saya sudah login ke akun TMDb saya
    And sudah ada minimal satu film di daftar favorit saya

  # --- Positive ---

  Scenario: Menghapus film dari halaman favorites list
    When saya buka halaman /u/<username>/favorites/movies
    And saya klik tombol hapus pada salah satu film
    Then film tersebut langsung hilang dari daftar
    And setelah halaman di-reload, film itu memang sudah tidak ada

  Scenario: Menghapus film dari halaman detail film
    When saya buka halaman detail film yang sudah ada di favorit saya
    And saya klik ulang tombol favorit untuk menonaktifkannya
    Then tombol favorit kembali ke kondisi tidak aktif
    And film tersebut sudah tidak ada lagi di halaman /u/<username>/favorites

  Scenario: Menghapus film dari halaman listing film
    When saya buka halaman listing yang menampilkan film yang ada di favorit saya
    And saya klik ikon favorit film tersebut untuk menonaktifkannya
    Then ikon favorit film itu kembali ke kondisi tidak aktif
    And film tersebut sudah tidak ada lagi di halaman /u/<username>/favorites

  Scenario: Status favorit berubah di semua halaman setelah dihapus
    Given film "Inside Out 2" ada di daftar favorit saya
    When saya hapus film tersebut dari halaman favorites list
    Then tombol favorit di halaman detail film tersebut juga sudah tidak aktif
    And ikon favorit di halaman listing juga sudah tidak aktif
```

---

## User Story 4: Sorting Favorite Movies

Sebagai user, saya ingin bisa mengurutkan daftar film favorit saya sesuai preferensi agar lebih mudah menemukannya.

```gherkin
Feature: Mengurutkan Daftar Favorit

  Background:
    Given saya sudah login ke akun TMDb saya
    And saya berada di halaman /u/<username>/favorites

  # --- Positive ---

  Scenario: Mengurutkan daftar berdasarkan Popularity
    When saya pilih opsi sorting "Popularity"
    Then daftar film diurutkan berdasarkan popularitas
    And URL halaman mengandung parameter "sort_by=popularity"

  Scenario: Mengurutkan daftar berdasarkan Release Date
    When saya pilih opsi sorting "Release Date"
    Then daftar film diurutkan berdasarkan tanggal rilis
    And URL halaman mengandung parameter "sort_by=release_date"

  Scenario: Preferensi sorting tersimpan untuk sesi berikutnya
    Given saya sudah memilih sorting "Popularity" sebelumnya
    When saya logout lalu login kembali ke akun yang sama
    And saya buka halaman /u/<username>/favorites dengan parameter sort_by=popularity
    Then halaman tetap menampilkan hasil dengan urutan sesuai popularity

  # --- Negative ---

  Scenario: Parameter sorting yang tidak valid tidak menyebabkan crash
    When saya akses halaman /u/<username>/favorites dengan parameter sort_by=invalid_column
    Then halaman tidak blank dan tidak menampilkan error 500
    And konten halaman masih bisa terlihat, meski parameter sorting ditolak server
```

---

## User Story 5: Ubah Bahasa Tampilan

Sebagai user, saya ingin bisa mengganti bahasa tampilan TMDb sesuai preferensi bahasa saya.

```gherkin
Feature: Mengubah Bahasa Tampilan

  Background:
    Given saya sudah login ke akun TMDb saya

  # --- Positive ---

  Scenario: Mengubah bahasa tampilan ke Bahasa Indonesia
    When saya buka halaman /settings/account
    And saya pilih "Indonesian" pada pengaturan bahasa
    And saya simpan perubahan
    Then seluruh UI langsung berganti ke Bahasa Indonesia tanpa perlu logout
    And menu navigasi menampilkan tulisan "Film" sebagai pengganti "Movies"

  Scenario: Mengubah bahasa kembali ke Bahasa Inggris
    Given bahasa tampilan saat ini sudah diset ke Bahasa Indonesia
    When saya buka lagi /settings/account
    And saya ganti kembali ke "English"
    And saya simpan perubahan
    Then UI kembali tampil dalam Bahasa Inggris
    And menu navigasi kembali menampilkan tulisan "Movies"

  Scenario: Data favorit tetap ada setelah ganti bahasa
    Given saya punya beberapa film di daftar favorit
    When saya ganti bahasa ke Bahasa Indonesia
    And saya buka halaman /u/<username>/favorites/movies
    Then daftar favorit saya masih tampil dengan lengkap
    And tidak ada data yang hilang akibat perubahan bahasa

  # --- Negative ---

  Scenario: Membuka TMDb dengan kode bahasa yang tidak valid
    Given saya tidak harus login untuk skenario ini
    When saya akses TMDb dengan menambahkan parameter ?language=xx-XX di URL
    Then halaman tetap terbuka dan tidak menampilkan error
    And TMDb menggunakan bahasa default (sesuai pengaturan browser) sebagai fallback
```

---

## Catatan & Temuan Selama Pengujian

Beberapa hal yang ditemukan selama proses eksplorasi dan automation yang mungkin relevan sebagai masukan:

### Untuk Tim Developer

1. **Parameter `?language=` tidak di-validasi di sisi server.**
   Ketika user mengakses halaman dengan kode bahasa tidak valid seperti `?language=xx-XX`, server tidak memberikan respon error atau peringatan apapun. Halaman tetap muncul dengan fallback ke bahasa browser. Sebaiknya ada penanganan eksplisit, misalnya mengabaikan parameter tidak valid dan redirect ke URL tanpa parameter tersebut, supaya URL tetap bersih.

### Untuk Tim UI/UX

1. **Tidak ada Notifikasi visual saat bahasa berhasil disimpan atau diganti.**
   Setelah klik "Save" di halaman pengaturan bahasa, tidak ada pop up notification atau pesan konfirmasi yang muncul. User tidak tahu apakah perubahannya berhasil tersimpan sampai mereka membuka halaman lain dan melihat sendiri. Menambahkan konfirmasi singkat akan sangat membantu.

2. **Aksi favorit dari halaman listing tersembunyi di balik menu titik tiga (`...`).**
   Untuk menandai film sebagai favorit dari halaman listing, user harus klik tombol `...` di pojok kanan atas poster movies terlebih dahulu, baru muncul dropdown yang berisi opsi Favorite. Alur ini kurang intuitif karena tidak langsung terlihat, user yang baru pertama kali pakai TMDb kemungkinan tidak akan tahu cara ini ada dan langsung masuk ke halaman detail untuk favoritkan filmnya.

3. **Navigasi menuju halaman daftar favorit terlalu banyak langkah.**
   Untuk membuka daftar favorit, user harus melewati beberapa lapis navigasi: klik menu profil → masuk ke halaman Overview → klik submenu Favorites → baru pilih kategori Movies atau TV Shows. Alur ini terasa tidak efisien, terutama untuk fitur yang kemungkinan sering diakses. Akan lebih nyaman jika ada shortcut langsung ke halaman favorit, misalnya dari menu dropdown profil atau menu navigasi utama.
