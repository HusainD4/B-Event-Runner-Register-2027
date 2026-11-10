@echo off
echo ==========================================
echo SINKRONISASI DATABASE ^& SEED DATA TEGAL RUN
echo ==========================================
cd /d "%~dp0"
echo 1. Memeriksa koneksi dan membuat tabel di MySQL...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Gagal terhubung ke MySQL di localhost:3306.
    echo Pastikan modul MySQL di XAMPP Control Panel sudah diklik START (Hijau).
    echo Pastikan juga konfigurasi DATABASE_URL di file .env sudah sesuai.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo 2. Mengisi akun default Superadmin, Administrator, Keuangan, dan Event...
call npm run db:seed

echo.
echo [SUKSES] Seluruh tabel dan data awal berhasil dibuat!
pause

