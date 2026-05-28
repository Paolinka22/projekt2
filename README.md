# Guestbook App — Express + SQLite

Aplikacja umożliwia użytkownikom tworzenie wpisów pamiątkowych po zalogowaniu.  
Każdy użytkownik może zarządzać własnymi wiadomościami, natomiast administrator posiada pełne uprawnienia do moderacji wszystkich wpisów.

Projekt wykorzystuje:
- Express.js
- EJS
- SQLite (`better-sqlite3`)
- Sesje oparte o cookies
- Hashowanie haseł przy użyciu Argon2

---

# Funkcjonalności

## Rejestracja i logowanie użytkowników
- tworzenie nowych kont
- walidacja loginu i hasła
- bezpieczne hashowanie haseł (`argon2`)
- obsługa sesji użytkownika przy pomocy cookies

## Zarządzanie wiadomościami
Niezalogowany użytkownik może:
- tylko przeglądać treści zamieszczone przez innych

Po zalogowaniu użytkownik może:
- dodawać nowe wpisy
- edytować własne wpisy
- usuwać własne wpisy

Administrator może:
- usuwać dowolne wiadomości
- edytować dowolne wiadomości

## Dynamiczna strona główna
Strona główna:
- wyświetla wszystkie zapisane wiadomości
- renderuje dane dynamicznie przy użyciu EJS
- pokazuje różne opcje w zależności od zalogowanego użytkownika

## Automatyczne seedowanie danych
Przy pierwszym uruchomieniu aplikacja:
- tworzy tabele w bazie danych
- dodaje testowych użytkowników
- opcjonalnie może wypełnić bazę przykładowymi wiadomościami

---

# Technologie

- Node.js
- Express 5
- EJS
- SQLite
- better-sqlite3
- Argon2
- cookie-parser
- Morgan

---

# Instalacja

## 1. Klonowanie repozytorium

```bash
git clone 
cd projekt04
```

## 2. Instalacja zależności

```bash
npm install
```

## 3. Uruchomienie aplikacji

```bash
node index.js
```

Aplikacja będzie dostępna pod adresem:

```txt
http://localhost:8000
```

---

# Tryb developerski — przykładowe dane

Aby automatycznie wypełnić bazę przykładowymi wiadomościami:

```bash
POPULATE_DB=1 node index.js
```

Przykładowe wiadomości zostaną dodane tylko wtedy, gdy tabela `messages` jest pusta.

---

# Testowi użytkownicy

## Administrator

```txt
login: admin
hasło: admin123
```

## Użytkownicy

```txt
login: user1
hasło: user123
```

```txt
login: user2
hasło: user456
```

---

# Struktura projektu

```txt
project/
│
├── public/              # Pliki statyczne
├── views/               # Widoki EJS
│   └── forms/
│
├── index.js             # Główny plik aplikacji
├── bd.js                # Obsługa bazy danych i sesji
├── db.sqlite            # Baza SQLite
├── package.json
└── README.md
```

---

# Obsługiwane ścieżki

## GET

| Ścieżka | Opis |
|---|---|
| `/` | Strona główna z wiadomościami |
| `/register` | Formularz rejestracji |
| `/login` | Formularz logowania |
| `/logout` | Wylogowanie użytkownika |

## POST

| Ścieżka | Opis |
|---|---|
| `/register` | Tworzenie nowego konta |
| `/login` | Logowanie użytkownika |
| `/` | Dodawanie wiadomości |
| `/edit` | Edycja wiadomości |
| `/delete` | Usuwanie wiadomości |

---

# Walidacja danych

Podczas rejestracji aplikacja sprawdza:
- minimalną długość loginu
- minimalną długość hasła
- zgodność haseł
- siłę hasła:
  - mała litera
  - wielka litera
  - cyfra
  - znak specjalny

---

# Bezpieczeństwo

Projekt wykorzystuje:
- hashowanie haseł przy użyciu Argon2
- sesje przechowywane w cookies
- autoryzację użytkowników
- sprawdzanie właściciela wiadomości przed edycją/usunięciem

---

# Możliwe rozszerzenia projektu

- CSRF protection
- rate limiting
- wygasanie sesji
- panel administratora
- paginacja wiadomości
- REST API
- Docker
- testy automatyczne
