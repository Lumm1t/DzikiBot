enum EndingMessage {
  NoPermissions = 'Nie masz uprawnień',
  NoPermissionOrUserIsAdmin = 'Nie masz uprawnień lub osoba jest administratorem.',
  IncorrectUserData = 'Nie podano użytkownika lub go nie znaleziono :c',
  MutedRoleNotFound = "Nie znaleziono roli 'Muted', stwórz ją żebym mógł wykonać swoje zadanie.",
  NoAccessToLogChannel = 'Kanał z publicznymi logami nie istnieje lub nie mam do niego dostępu, żebym mógł pracować musisz to naprawić. Jeśli nie wiesz jak to zrobić wpisz $pomoc',
  SuccessfulSetPublicLogs = 'Udane ustawienie publicznych logów na kanał: ',
  BlacklistArgsException = 'komenda blacklist przyjmuje 3 arugmenty: list, dodaj, usun',
  BlacklistLengthException = 'Osiągnąłeś limit kanałów w blackliście (50), spróbuj usunąć jakieś kanały z blacklisty',
  BlacklistchannelException = 'Nie oznaczyłeś kanału lub nie jest on kanałem tekstowym',
  BlacklistChannelInDB = 'Kanał jest już w bazie danych',
  BlacklistChannelNotInDB = 'Kanał nie znajduję się w bazie danych',
  BlacklistChannelAdded = 'Kanał pomyślnie został dodany do blacklisty',
  BlacklistNullException = 'Nie dodałeś jeszcze żadnego kanału do blacklisty',
  MentionArgException = 'Nie podałeś ile razy mam kogoś oznaczyć.',
  MentionNumberException = 'Podana liczba musi być w przedziale [1-99] albo to co podałeś nie jest liczbą',
  DocsMessage = 'Wszelkie komendy i ich zastosowanie możesz znaleźć tutaj: https://github.com/MrDzik/DzikiBot/blob/main/README.md',
}
export default EndingMessage;
