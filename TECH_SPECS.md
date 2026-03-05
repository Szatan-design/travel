# Travel Tracker - Specyfikacja Techniczna

## Języki i Technologie
- **Język programowania:** TypeScript (kompilowany do JavaScript)
- **Środowisko uruchomieniowe:** Node.js (wersja 18 lub nowsza)
- **Framework backendowy:** Express.js
- **Framework frontendowy:** React (z Vite)
- **Baza danych:** SQLite (plik `travel.db`)
- **Biblioteki map:** Leaflet (OpenStreetMap)

## Wymagania Systemowe
1. **Trwały system plików (Persistent Storage):**
   - Aplikacja zapisuje dane w pliku bazy danych (`travel.db`) oraz zdjęcia w folderze `uploads/`.
   - **Kluczowe:** Serwer MUSI pozwalać na zachowanie tych plików po restarcie. Większość darmowych hostingów typu "Serverless" (Vercel, Netlify, Heroku Free) tego NIE oferuje (pliki znikają).

2. **Zasoby:**
   - RAM: Min. 512MB (zalecane 1GB dla stabilności przy przetwarzaniu zdjęć).
   - CPU: 1 vCPU wystarczy.
   - Dysk: Zależy od ilości zdjęć. Na start 1GB wystarczy na setki zdjęć (jeśli są kompresowane).

## Struktura Aplikacji
- **Frontend (React):** Budowany do plików statycznych w folderze `dist/`.
- **Backend (Express):** Serwuje API (`/api/posts`, `/api/track`) oraz pliki statyczne frontendu.
- **Port:** Aplikacja nasłuchuje na porcie 3000 (można zmienić zmienną środowiskową `PORT`).

## Polecenia Uruchomieniowe
- **Instalacja:** `npm install`
- **Budowanie:** `npm run build` (tworzy frontend w `dist/`)
- **Uruchomienie:** `npm start` (uruchamia serwer Node.js)

## Sugerowane Rozwiązania Hostingowe (z trwałym dyskiem)
1. **VPS (Virtual Private Server):**
   - Np. Mikr.us (bardzo tani polski VPS), Hetzner, OVH, DigitalOcean (Droplet).
   - Masz pełny dostęp do systemu plików.
   - Wymaga podstawowej znajomości Linuxa (SSH, instalacja Node.js).

2. **Kontenery z Wolumenami (CaaS):**
   - **Fly.io:** Pozwala podpiąć "Volume" do aplikacji. Darmowy limit (Free Tier) obejmuje małe VM i 1GB wolumenu.
   - **Railway:** Oferuje dyski, ale w płatnym planie (lub trialu).
   - **Render:** Płatny plan "Disk" (darmowy plan nie ma dysku).

3. **Rozwiązanie "Self-Hosted" (Własny serwer w domu):**
   - Raspberry Pi / Stary Laptop / NAS (Synology/QNAP z Dockerem).
   - Wystawienie na świat przez **Cloudflare Tunnel** (bezpieczne, darmowe, bez publicznego IP).

## Docker (Opcjonalnie, ale zalecane)
Aplikację łatwo zapakować w kontener Docker. Obraz powinien:
1. Skopiować pliki źródłowe.
2. Zainstalować zależności (`npm install`).
3. Zbudować frontend (`npm run build`).
4. Uruchomić serwer (`npm start`).
5. **Ważne:** Folder `uploads` i plik `travel.db` muszą być zamontowane jako wolumeny (Volumes) poza kontenerem, aby dane przetrwały aktualizację kontenera.
