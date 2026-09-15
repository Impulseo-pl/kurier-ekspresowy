# Polski Express 24 — demo

Demo dla leada z kampanii: **Polski Express 24**, kurier · transport · logistyka.
Tel. **690 757 344**. Silnik ten sam co `wozniewski-instalacje`.

Live: https://impulseo-pl.github.io/kurier-ekspresowy/

## Dane od klienta (15.09.2026)

- **Usługa główna: transport dedykowany — jeden samochód, jeden klient**
- Przewozi: dzieła sztuki w skrzyniach transportowych, dokumenty, sprzęt elektroniczny,
  przesyłki kurierskie, sprzęt eventowy
- Trasy: cała Polska, Niemcy, Dania, Finlandia, Szwecja, Norwegia, Austria
- Dostawa tego samego dnia, gdy adres dostawy leży w promieniu 100 km od miejsca odbioru
- Zdjęcia: własna flota (Kangoo, Trafic, Caddy), skrzynia transportowa, kurs promowy
- Logo wycięte z białego tła do PNG z przezroczystością — `img/logo.png` (na jasne tło)
  i `img/logo-ciemne.png` (granat zamieniony na biel, na ciemne tło)

## Zasada: na stronie tylko to, co da się sprawdzić

Wcześniejsza wersja miała kalkulator z godzinami podstawienia i tabelę czasów dojazdu —
wyrzucone, bo te liczby były zmyślone. Zostało to, co wynika z oferty klienta i z geometrii.

## Mapy — generowane, nie rysowane ręcznie

Oba kontury pochodzą z Natural Earth 50m i są przeliczane skryptem
(`scratchpad/buduj.py` + `mapy.json` w katalogu roboczym sesji):

- **Mapa Polski** (sekcja „Dostawa tego samego dnia") — odwzorowanie równoodległościowe
  `x=(lon-14)*55, y=(55-lat)*90`, te same wzory, którymi `app.js` przelicza miasta.
  Dzięki temu okrąg promienia i punkty miast zawsze siedzą tam, gdzie powinny.
- **Mapa Europy Północnej** (sekcja „Trasy") — odwzorowanie Merkatora, kadr
  lon 3–32,5°, lat 44,5–62,5°. Kraje obsługiwane wyróżnione, Polska w granacie marki,
  trasy jako łuki z animowanym przepływem. Najechanie na wiersz listy krajów podświetla kraj.

**Nie edytować `d="..."` ręcznie.** Zmiana kadru = ponowne uruchomienie skryptu.

## Do uzupełnienia

1. **Adres siedziby i NIP** — sekcja kontakt + blok JSON-LD
2. **E-mail** — formularz oddzwonienia na razie tylko potwierdza zgłoszenie na ekranie,
   bo nie ma adresu, na który miałby wysyłać (`app.js`, sekcja 5)
3. **Opinie** — sekcja `#opinie`, trzy cytaty i ocena z wizytówki Google
4. **Mapa dojazdu** w kontakcie — gdy będzie adres, wstawić iframe Google Maps

## SEO

- `title` + `meta description` z frazami: transport dedykowany, kurier ekspresowy, kierunki
- JSON-LD `MovingCompany` z `hasOfferCatalog` (6 usług) i `areaServed` (7 krajów)
- jeden `H1`, `H2` na sekcję, `H3` na usługę — każda usługa ma 40–90 słów treści z frazą
- `robots.txt` + `sitemap.xml`
- opisowe `alt` przy każdym zdjęciu, `loading="lazy"` poza hero

## Podgląd lokalny

```powershell
python -m http.server 8099   # w katalogu projektu
```
