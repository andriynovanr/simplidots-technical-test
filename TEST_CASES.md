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
    When saya cari film "Inside Out 2" menggunakan fitur search
    And saya masuk ke halaman detail film dari hasil pencarian pertama
    And saya klik tombol favorit di halaman detail
    Then ikon tombol favorit berubah menjadi aktif
    And film "Inside Out 2" muncul di halaman /u/<username>/favorites/movies

  # --- Negative ---

  Scenario: Tidak bisa menambahkan favorit jika belum login
    Given saya belum login ke akun apapun
    When saya buka halaman detail film "Inside Out 2"
    And saya klik tombol favorit
    Then muncul tooltip "Masuk untuk menambahkan film ke daftar sukaan anda"
    And URL tidak berpindah ke halaman favorites
```

---

## User Story 2: View Favorite Movie List

Sebagai user, saya ingin bisa melihat daftar film favorit saya agar mudah mengakses film yang sudah saya tandai.

```gherkin
Feature: Melihat Daftar Film Favorit

  Background:
    Given saya sudah login ke akun TMDb saya

  # --- Positive ---

  Scenario: Membuka halaman daftar film favorit (Movies)
    When saya akses langsung halaman /u/<username>/favorites/movies
    Then halaman berhasil dimuat
    And konten utama halaman favorit terlihat

  Scenario: Membuka halaman daftar TV Shows favorit
    When saya akses langsung halaman /u/<username>/favorites/tv
    Then halaman berhasil dimuat
    And konten utama halaman favorit terlihat

  # --- Negative ---

  Scenario: Halaman favorit tidak bisa diakses tanpa login
    Given saya belum login ke akun apapun
    When saya kirim HTTP request ke halaman /u/<username>/favorites/movies
    Then server mengembalikan status 401 Unauthorized
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
    When saya navigasi ke halaman /u/<username>/favorites/movies
    And saya klik tombol hapus pada film pertama di daftar
    And halaman di-reload
    Then film yang dihapus sudah tidak ada di daftar
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

  Scenario: Sorting tetap berfungsi setelah session dibersihkan dan login ulang
    Given saya sudah berada di halaman /u/<username>/favorites dengan parameter sort_by=popularity
    When session dibersihkan (cookies dan localStorage dihapus)
    And saya login ulang ke akun yang sama
    And saya akses kembali halaman /u/<username>/favorites dengan parameter sort_by=popularity
    Then URL tetap mengandung parameter "sort_by=popularity"
    And halaman berhasil dimuat

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
