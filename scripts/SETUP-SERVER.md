# Setup Pustaka Setia pada Ubuntu 22.04

Skrip ini untuk VPS baru dengan systemd dan akses sudo. Instalasi memakai Node.js 22,
Next.js, PostgreSQL bawaan Ubuntu, Nginx, dan sertifikat Let's Encrypt.
Siapkan minimal 2 vCPU dan RAM 4 GB untuk proses build.

1. Atur DNS `A` domain ke IPv4 VPS. Jika memakai `AAAA`, IPv6 harus menuju VPS yang
   sama dan dapat diakses. Untuk Cloudflare, gunakan DNS only selama setup.
2. Pastikan SSH sudah berjalan pada port **22**. Buka port TCP 22, 80, dan 443
   pada firewall provider. Jika SSH memakai port lain, buka dan masukkan port itu.
   Skrip memeriksa konfigurasi dan listener SSH sebelum
   mengaktifkan UFW. Skrip tidak mengganti port atau metode login SSH.
3. Upload source proyek ke server, misalnya `/root/Pustakasetia`. Tidak perlu
   mengunggah `.env`, database SQLite, `node_modules`, atau `.next`.
4. Jalankan dari folder proyek melalui terminal interaktif:

   ```bash
   cd /root/Pustakasetia
   sudo bash scripts/setup-server.sh
   ```

Masukkan domain tanpa `https://`, email sertifikat, port SSH (mengikuti sesi aktif,
atau default 22 jika informasi sesi tidak tersedia), serta
username dan password admin. Password minimal 16 karakter, maksimal 72 byte.
Periksa hasil DNS yang ditampilkan, lalu ketik `YA` jika sudah benar.
Sertifikat diterbitkan untuk domain yang dimasukkan saja; `www` tidak otomatis ditambahkan.

Skrip memasang aplikasi pada `/opt/pustakasetia`, membuat database kosong dan admin,
lalu memeriksa API buku melalui localhost dan HTTPS. Source disalin tanpa `.env`
dan database lama. Password database dan JWT dibuat acak, disimpan di server dengan
izin terbatas, dan tidak ditampilkan. Jangan jalankan skrip dengan `bash -x`.

Schema asli tetap SQLite. Pada salinan server, skrip menghasilkan
`prisma-postgresql/schema.prisma`, `prisma-postgresql.config.ts`, dan migrasi awal
PostgreSQL terpisah. Migrasi SQLite dan demo seed tidak dijalankan. Data buku maupun
transaksi SQLite lama tidak otomatis dipindahkan. Simpan salinan schema dan migrasi
PostgreSQL server sebagai dasar pengembangan migrasi berikutnya.

Pengamanan mencakup aplikasi non-root yang hanya mendengarkan di `127.0.0.1:3000`,
PostgreSQL di `127.0.0.1:5432`, role database tanpa superuser, source aplikasi milik
root, pembatasan tulis systemd, UFW, Fail2ban SSH, dan pembaruan keamanan Ubuntu
otomatis. Header keamanan mengikuti konfigurasi Next.js proyek. Paket npm tetap
perlu diperbarui dan diperiksa secara berkala; setup ini bukan audit keamanan aplikasi.
Skrip tidak menonaktifkan password SSH atau root login karena kesiapan SSH key belum
diketahui. Terapkan pembatasan tersebut setelah login dengan key berhasil diuji.

Perintah operasional:

```bash
sudo systemctl status pustakasetia nginx postgresql fail2ban
sudo journalctl -u pustakasetia -n 100 --no-pager
sudo ufw status verbose
sudo fail2ban-client status sshd
sudo certbot renew --dry-run
sudo systemctl restart pustakasetia
```

Renewal sertifikat dijadwalkan melalui `certbot.timer`. Jadwalkan backup PostgreSQL
dan `/opt/pustakasetia/uploads` ke penyimpanan terpisah dan uji restore sebelum
operasional. Google Analytics bersifat opsional dan belum dikonfigurasi.

Skrip memakai akun layanan terpisah `pustakasetia-app`. Akun login `pustakasetia`
tidak diperiksa atau diubah. Nama database tetap `pustakasetia`.
User layanan `pustakasetia-app` yang sudah ada dapat dipakai kembali jika UID bukan root,
home `/var/lib/pustakasetia-app`, shell `nologin` atau `/bin/false`, dan hanya memiliki
group utama `pustakasetia-app` tanpa anggota lain. Akun login atau akun dengan group
tambahan ditolak; skrip tidak mengubah akun tersebut.

Skrip menolak target aplikasi, role, atau database yang sudah ada. Ini bukan
skrip update maupun migrasi data. Jika gagal di tengah proses, jangan menghapus
database atau menjalankan ulang secara buta: periksa pesan terakhir, layanan, dan
artefak yang sudah dibuat, lalu lanjutkan langkah yang belum selesai secara terarah.
Pemasangan paket dan perubahan konfigurasi tidak otomatis dibatalkan saat gagal.
UFW yang sudah memiliki aturan akan mempertahankan aturan tersebut.

Acuan: [NodeSource](https://github.com/nodesource/distributions),
[Prisma CLI v6](https://www.prisma.io/docs/orm/v6/reference/prisma-cli-reference),
dan [sertifikat TLS Ubuntu](https://ubuntu.com/server/docs/how-to/security/obtain-tls-certificates/).
