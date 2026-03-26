# Projekt z użyciem Express + EJS + SQL - Dynamiczna strona z sesjami i formularzem zapisujacym dane w bazie danych.
Program urachamiany po przez pisanie komendy node index.js w terminalu.
Aby użyć narzędzia deweloperskiego który wypełni bazę danymi testowymi należy uruchomić program używając komendy POPULATE_DB=1 node index.js (zadziała tylko jeśli w bazie nie ma żadnych rekordów)
Strona główna jest dynamiczna, umozliwia użytkownikom logowanie się, dodawanie wiadomości przez formularz, wyświetla je, pozwala na edycje jak i usunięcie tylko przez administratora badź użytkowika który zamieścił wiadomość.
# W bazie danych automatycznie utworzy się 3 testowych użytkowników, administartor- login: admin, hasło: admin123 i 2 uzytkowników- login: user1, hasło: user123 ; login: user2, hasło: user456
Uzyte npm: better-sqlite3@12.8.0, ejs@3.1.10, express@5.1.0, morgan@1.10.1, bcrypt@6.0.0 oraz cookie-parser@1.4.7
