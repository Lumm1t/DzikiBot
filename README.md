# DzikiBot

# PL docs

Komendy
  - $publicznelogi #kanał - Po dodaniu bota musisz podać kanał gdzie będą gromadzone logi odnośnie np. banów warnów itp. - wymaga uprawnienia: 'administrator'.
  
  - $prywatnelogi #kanal - Powoduje że na podany kanał będą wysyłane prywatne logi takie jak: edytowane wiadomości, usuwane wiadomości, wychodzenie i wchodzenie użytkowników na serwer - wymaga uprawnienia: 'administrator'.
  - $blacklist [dodaj/usun/list] - wymaga uprawnienia 'administrator' // do późniejszej zmiany na 'zarządzanie kanałami'.
    * $blacklist dodaj #kanal - dodaje kanał do blacklisty kanałów skąd nie będą pobierane informacje takie jak edytowanie i usuwanie wiadomości.
    * $blacklist usun ID_kanału_tekstowego - usuwa kanał z blacklisty kanałów.
    * $blacklist list - wyświetla listę kanałów na blackliście wraz z ich ID.
  - $kick @ktoś ?powod - Wyrzuca daną osobę i jeśli powód został wpisany wyświetli go jeśli nie, wyświetli "Nie podano powodu", taka sama wiadomość zostanie dostarczona do osoby która została wyrzucona - wymaga uprawnienia: 'KICK_MEMBERS' jak również osoba kickowana nie może być administratorem.
  - $ban @ktoś ?powód - pemamentnie banuje daną osobę i jeśli powód został wpisany wyświetli go jeśli nie, wyświetli "Nie podano powodu", taka sama wiadomość zostanie dostarczona do osoby która została zbanowana - wymaga uprawnienia: 'BAN_MEMBERS' jak również osoba banowana nie może być administratorem.
  - $tempaban @ktoś ~czas ?powód - tymczasowo banuję daną osobę. Definicja czasu znajduje się na samym dole tego tesktu. Jeśli powód został wpisany wyświetli go jeśli nie, wyświetli "Nie podano powodu", taka sama wiadomość zostanie dostarczona do osoby która została zbanowana - wymaga uprawnienia: 'KICK_MEMBERS' jak również osoba banowana nie może być administratorem.
  - $mute @ktoś ?~czas ?powód - tymczasowo lub permamentnie mutuje daną osobę, wyświetla powód jeśli istnieje - wymaga uprawnienia: 'MANAGE_MESSAGES'.
  - $unmute @ktoś - odmutowuje daną osobe - wymaga uprawnienia: 'MANAGE_MESSAGES' - wymaga uprawnienia: 'MANAGE_MESSAGES'.
  - $mutetime ~czas - ustawia czas mute po osiągnięciu 3 warnów przez użytkownika, ustaw '0m' by wyłączyć muta. - wymaga uprawnienia: 'administrator'.
  - $warn @ktoś ?powód - warnuje danego używkonika po 3 warnach zostaje zmutowany na czas określony przez użytkownika przy komendzie $mutetime, domyślnie 12 godzin - wymaga uprawnienia: 'MANAGE_MESSAGES'.
  - $statystyki [data/czlonkowie/online/rekord_online/bany/dzien] ID_Kanału_Głosowego - ustawia wybraną statystykę na wybrany kanał pamiętaj by w nazwie kanału dać $ w jego miejsce pojawi się wybrana rzecz - wymaga uprawnienia: 'administrator'
  - $mention @ktos [1-99] ?tekst - wysyła co 2 sekundy ping z wiadomością nadaną przez użytkownika - wymaga uprawnienia: 'administrator'
  
  
czas - [1-99]m/h/d - najpierw podajemy liczbę od 1-99 następnie bez spacji wpisujemy 'm' dla minut, 'h' dla godzin i 'd' dla dni.
? jeśli znak zapytania pojawia się przed zmienna oznacza to że jest ona opcjonalna.
