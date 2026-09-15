# Polski Express 24 — demo

Demo dla leada z kampanii: **Polski Express 24** — kurier · transport · logistyka.
Tel. **690 757 344**.

Live: https://impulseo-pl.github.io/kurier-ekspresowy/

## Kierunek wizualny

Jasny układ wzorowany na zipmend.com (wskazanie Szymona z 15.09): biel i bardzo jasny błękit,
granat z logo na tekst, czerwień wyłącznie na akcenty i wezwania do działania.
Bez ciemnych sekcji, bez ekranu ładowania — ma być proste i przejrzyste.

## Dane od klienta

- **Usługa główna: transport dedykowany — jeden samochód, jeden klient**
- Przewozi: dzieła sztuki w skrzyniach transportowych, dokumenty, sprzęt elektroniczny,
  przesyłki kurierskie, sprzęt eventowy
- Trasy: cała Polska, Niemcy, Dania, Finlandia, Szwecja, Norwegia, Austria
- Dostawa tego samego dnia, gdy adres dostawy leży w promieniu 100 km od miejsca odbioru
- Zdjęcia: własna flota (Kangoo, Trafic, Caddy), skrzynia transportowa, kurs promowy

## Logo

`img/logo.png` — wycięte z fotografii logotypu klienta, **w oryginalnych barwach**
(wcześniejsza wersja z przemalowanym granatem została odrzucona).
Tło usunięte wypełnieniem od krawędzi, na dwukrotnym powiększeniu, z rozmyciem maski —
stąd gładka krawędź bez schodków. Wnętrza znaku (biała cyfra „24" na czerwieni) nietknięte.

## Mapa tras

Jedna mapa — Europy Północnej. Kontury z Natural Earth 50m, przeliczane skryptem
(`buduj.py` + `mapy.json` w katalogu roboczym sesji), odwzorowanie Merkatora,
kadr lon 4,5–31,5°, lat 46–62,8°. Polska w granacie, kraje obsługiwane jaśniejszym błękitem,
trasy jako łuki z animowanym przepływem. Najechanie na wiersz listy krajów podświetla kraj.

**Nie edytować `d="..."` ręcznie.** Zmiana kadru = ponowne uruchomienie skryptu.

Mapa Polski ze sprawdzarką promienia została **usunięta** (decyzja Szymona: jedna mapa,
prościej). Sama reguła 100 km została w treści: hero, plakietka przy zdjęciu, karty usług.

## Do uzupełnienia

1. **Adres siedziby i NIP** — stopka + blok JSON-LD
2. **E-mail** — formularz na razie tylko potwierdza zgłoszenie na ekranie,
   bo nie ma adresu, na który miałby wysyłać (`app.js`, sekcja 4)
3. **Opinie** — sekcja `#opinie`, trzy cytaty i ocena z wizytówki Google
4. **Godziny pracy** — w górnym pasku stoi „zgłoszenia przyjmujemy całą dobę", do potwierdzenia

## SEO

- `title` + `meta description` z frazami: transport dedykowany, kurier ekspresowy, kierunki
- JSON-LD `MovingCompany` z `hasOfferCatalog` (7 usług) i `areaServed` (7 krajów)
- jeden `H1`, `H2` na sekcję, `H3` na usługę; każda usługa ma własny akapit z frazą
- `robots.txt` + `sitemap.xml`, opisowe `alt`, `loading="lazy"` poza hero

## Podgląd lokalny

```powershell
python -m http.server 8099   # w katalogu projektu
```

Po zmianie CSS lub JS podbij `?v=` przy `styles.css` i `app.js` w `index.html`
(i w szablonie), inaczej przeglądarki podadzą starą wersję.
