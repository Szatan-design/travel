# Instrukcja Wdrożenia na Vercel

Twoja aplikacja jest teraz gotowa do działania na Vercel!
Ponieważ Vercel nie ma trwałego dysku, aplikacja została przerobiona tak, aby:
1. Trzymać dane (wpisy, trasy) w bazie **Vercel Postgres**.
2. Trzymać zdjęcia na **Google Drive**.

## Krok 1: GitHub
1. Wrzuć kod tej aplikacji na swoje konto GitHub (utwórz nowe repozytorium i wypchnij kod).

## Krok 2: Vercel - Nowy Projekt
1. Zaloguj się na [Vercel.com](https://vercel.com).
2. Kliknij **"Add New..."** -> **"Project"**.
3. Wybierz swoje repozytorium z GitHub i kliknij **Import**.

## Krok 3: Baza Danych (Vercel Postgres)
1. Po zaimportowaniu (lub w trakcie konfiguracji) w panelu Vercel wejdź w zakładkę **Storage**.
2. Kliknij **"Create Database"** -> Wybierz **Postgres**.
3. Zaakceptuj domyślne ustawienia i kliknij **Create**.
4. Po utworzeniu, Vercel automatycznie doda zmienne środowiskowe (jak `POSTGRES_URL`) do Twojego projektu. Nie musisz ich wpisywać ręcznie.

## Krok 4: Zmienne Środowiskowe (Environment Variables)
W ustawieniach projektu na Vercel (Settings -> Environment Variables) musisz dodać dane do Google Drive (te same, które przygotowałeś wcześniej):

| Nazwa | Wartość |
|-------|---------|
| `GOOGLE_CLIENT_EMAIL` | Twój e-mail konta serwisowego |
| `GOOGLE_PRIVATE_KEY` | Twój klucz prywatny (cały tekst z `-----BEGIN...`) |
| `GOOGLE_DRIVE_FOLDER_ID` | ID folderu na Dysku Google |

## Krok 5: Wdrożenie (Deploy)
1. Kliknij **Deploy**.
2. Vercel zbuduje aplikację. Może to potrwać chwilę.
3. Po zakończeniu otrzymasz adres swojej strony (np. `travel-tracker.vercel.app`).

## Ważne uwagi
- **Zdjęcia:** Musisz mieć skonfigurowany Google Drive (wg instrukcji powyżej), inaczej zdjęcia nie będą się zapisywać na Vercel.
- **Śledzenie:** Adres do wpisania w aplikacji GPS na telefonie to teraz: `https://twoja-nazwa.vercel.app/api/track/update`.
