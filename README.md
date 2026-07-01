# Flappy Plane 🛫

Flappy Bird versi pesawat penumpang. Hindari menara dan gedung bandara, kumpulkan skor, dan kalahkan rekor terbaikmu!

## Fitur

- Karakter: pesawat penumpang (digambar di canvas).
- Rintangan: menara/gedung bandara atas dan bawah.
- Kontrol: klik, tap, atau tombol **Spasi**.
- Skor bertambah setiap berhasil melewati rintangan.
- Game over saat tabrakan, menampilkan skor + skor terbaik + tombol restart.
- Gameplay responsif untuk desktop dan mobile.

## Cara Menjalankan

1. Clone repo ini:

```bash
git clone https://github.com/launcerid1/flappy-plane.git
cd flappy-plane
```

2. Jalankan server Python:

```bash
python server.py
```

3. Buka browser dan akses:

```
http://localhost:8000
```

## Struktur File

| File | Deskripsi |
|------|-----------|
| `index.html` | Canvas + UI game |
| `game.js` | Logika game: physics, collision, render loop |
| `server.py` | Server lokal Python untuk menjalankan game |
| `assets/` | Direktori aset (README penjelasan) |
| `README.md` | Dokumentasi ini |
| `LICENSE` | Lisensi MIT |

## Aset / Kredit

Semua grafis (pesawat, awan, menara bandara, latar) digambar langsung dengan HTML5 Canvas API. Tidak ada aset eksternal yang digunakan, sehingga bebas lisensi dan tidak memerlukan atribusi.

## Lisensi

[MIT License](LICENSE)
