# Aset Flappy Plane

Semua grafis dalam game saat ini digambar langsung menggunakan HTML5 Canvas API (lihat `game.js`). Ini membuat game langsung playable tanpa perlu mengunduh file aset eksternal.

## Referensi Aset CC0 / Royalty-Free (opsional)

Jika ingin mengganti grafis canvas dengan sprite gambar, berikut beberapa sumber bebas lisensi yang dapat dijadikan referensi:

- **Awan (CC0):** [Clouds with Transparency - OpenGameArt.org](https://opengameart.org/content/clouds-with-transparency)
- **Pesawat (CC0):** [Free Plane Sprite - OpenGameArt.org](https://opengameart.org/content/free-plane-sprite)
- **Daftar aset CC0 lainnya:** [OpenGameArt CC0 resources](https://opengameart.org/content/cc0-resources)

> Catatan: lisensi dan ketersediaan aset di situs pihak ketiga dapat berubah. Pastikan untuk memeriksa lisensi sebelum menggunakannya dalam proyek komersial.

## Menggunakan Aset Gambar

Jika ingin menambahkan sprite PNG:

1. Simpan gambar ke folder ini, misalnya `assets/plane.png`, `assets/cloud.png`, `assets/tower.png`.
2. Edit `game.js` untuk memuat gambar dengan `new Image()` dan mengganti fungsi `draw()` pesawat/awan/menara dengan `ctx.drawImage(...)`.
3. Commit dan push perubahan ke repo.
