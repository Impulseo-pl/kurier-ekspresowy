# Kurier ekspresowy — demo

Demo dla leada z kampanii marketingowej: kurier ekspresowy, kraj i międzynarodowo,
USP = **dostawa tego samego dnia, jeśli adres dostawy leży w promieniu 100 km od miejsca odbioru**.

Silnik ten sam co `wozniewski-instalacje` (loader, ziarno zamiast poświat, sekcje ciemna/jasna,
wjazdy w kadr, lupa do zdjęć).

## Zasada: na stronie tylko to, co da się sprawdzić

Pierwsza wersja miała kalkulator z godzinami podstawienia auta i tablicę czasów dojazdu
do miast. **Wyrzucone** — te liczby były zmyślone, klient ich nie podał. Zostało to,
co wynika z jego własnej oferty i z geometrii.

## Co jest na stronie

| Sekcja | Po co |
|---|---|
| Hero | zdjęcie auta w trasie + jedno zdanie z USP |
| Pasek techniczny | promień 100 km · 0 przeładunków · zasięg · wycena przez telefon |
| **Sprawdzarka promienia** | dwa listy miast → odległość w linii prostej + werdykt „mieści się / poza promieniem". Mapa Polski rysuje okrąg 100 km wokół **miejsca odbioru** i trasę do punktu dostawy |
| Co wozimy | 6 pozycji z rysunkami SVG |
| W trasie | galeria 6 zdjęć z powiększeniem (klik w kafel) |
| Proces | 4 kroki od telefonu do podpisu odbiorcy |
| Opinie | **puste, do wklejenia z wizytówki Google klienta** |
| Kontakt | wielki telefon, formularz oddzwonienia, dane, mapa |

## Zdjęcia

`img/` — 8 zdjęć z Unsplash (licencja Unsplash, użycie komercyjne bez atrybucji),
każde w dwóch rozmiarach: `-sm` do siatki, pełne do powiększenia.
Pod stopką galerii jest zdanie, że to zdjęcia poglądowe — **nie kasuj go, dopóki klient
nie dosłał własnych fotografii.**

## Do podmiany przed pokazaniem klientowi

1. **Nazwa firmy** — `KURIER` / `EKSPRESOWY` w trzech miejscach (loader, nawigacja, stopka)
2. **Telefon** — `500 100 200` i `tel:+48500100200`
3. **E-mail** — `biuro@example.pl` (HTML + `app.js`)
4. **Miasta startowe sprawdzarki** — w `app.js`, funkcja `promien()`, linie z `selA.value` /
   `selB.value` (teraz Łódź → Piotrków Trybunalski). Ustaw miasto klienta.
5. **Adres w mapie Google** — iframe w sekcji kontakt
6. **Opinie** — sekcja `#opinie`, trzy cytaty + ocena z profilu Google
7. **Zdjęcia** — gdy klient dośle swoje, podmienić pliki w `img/` i skasować zdanie o zdjęciach poglądowych

Podmiana nazwy i telefonu:

```bash
cd C:/Users/kluch/kurier-ekspresowy
sed -i 's/KURIER<\/span>/NAZWA<\/span>/g; s/EKSPRESOWY/DRUGI CZLON/g; s/500 100 200/XXX XXX XXX/g; s/+48500100200/+48XXXXXXXXX/g' index.html assets/app.js
```

## Sprawdzarka — skąd liczby

- lista 53 miast ze współrzędnymi geograficznymi w `app.js`
- odległość liczona wzorem haversine, **w linii prostej** — bo promień to promień
- porównanie z jedną stałą: `PROMIEN = 100`
- mapa: te same wzory przeliczają współrzędne na piksele, którymi narysowany jest kontur Polski,
  więc okrąg i punkty zawsze siedzą w prawidłowym miejscu

Kontrola: Warszawa–Łódź 118 km, Warszawa–Radom 93 km, Kraków–Katowice 69 km,
Warszawa–Gdańsk 283 km. Zgadza się z rzeczywistością.

## Podgląd

```powershell
python -m http.server 8099   # w katalogu projektu
```
potem `http://localhost:8099`.
