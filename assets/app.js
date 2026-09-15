/* ==========================================================================
   Kurier ekspresowy — logika strony
   ========================================================================== */
(function () {
  'use strict';

  var spokojnie = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     1. EKRAN ŁADOWANIA
     ---------------------------------------------------------------------- */
  (function loader() {
    var el = document.getElementById('loader');
    if (!el) return;

    el.querySelectorAll('path').forEach(function (p) {
      p.style.setProperty('--dl', p.getTotalLength());
    });

    var proc = document.getElementById('loader-proc');
    var etap = document.getElementById('loader-etap');
    var etapy = ['Przyjęcie zlecenia', 'Podstawienie auta', 'W trasie', 'Dostarczone'];

    function koniec() {
      el.classList.add('znika');
      document.body.style.overflow = '';
      if (window.przegladajWjazdy) window.przegladajWjazdy();
      setTimeout(function () { el.remove(); }, 900);
    }

    if (spokojnie || sessionStorage.getItem('ke-loader') === '1') {
      el.remove();
      return;
    }
    sessionStorage.setItem('ke-loader', '1');

    document.body.style.overflow = 'hidden';

    var n = 0;
    var tik = setInterval(function () {
      n += Math.random() * 9 + 5;
      if (n >= 100) { n = 100; clearInterval(tik); setTimeout(koniec, 320); }
      proc.textContent = Math.floor(n);
      etap.textContent = etapy[Math.min(3, Math.floor(n / 27))];
    }, 95);

    setTimeout(function () { if (document.getElementById('loader')) koniec(); }, 4200);
  })();

  /* ----------------------------------------------------------------------
     2. NAWIGACJA
     ---------------------------------------------------------------------- */
  (function nawigacja() {
    var nav = document.getElementById('nawigacja');
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');

    function przyScrollu() {
      nav.classList.toggle('przyklejona', window.scrollY > 40);
    }
    przyScrollu();
    window.addEventListener('scroll', przyScrollu, { passive: true });

    burger.addEventListener('click', function () {
      var otwarte = menu.classList.toggle('otwarte');
      burger.classList.toggle('otwarty', otwarte);
      burger.setAttribute('aria-expanded', otwarte ? 'true' : 'false');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('otwarte');
        burger.classList.remove('otwarty');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* ----------------------------------------------------------------------
     3. WEJŚCIA W KADR
     ---------------------------------------------------------------------- */
  (function wKadrze() {
    if (!('IntersectionObserver' in window) || spokojnie) {
      document.querySelectorAll('.wjazd, .siatka-wjazd').forEach(function (n) { n.classList.add('widac'); });
      return;
    }

    var obs = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        if (!w.isIntersecting) return;
        w.target.classList.add('widac');
        obs.unobserve(w.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    var doOdsloniecia = [].slice.call(document.querySelectorAll('.wjazd, .siatka-wjazd'));
    doOdsloniecia.forEach(function (n) { obs.observe(n); });

    // Zabezpieczenie: przy starcie z kotwicą albo pod zasłoną ekranu ładowania
    // obserwator potrafi policzyć pozycje, zanim układ się ustali.
    function dolicz() {
      var h = window.innerHeight;
      doOdsloniecia = doOdsloniecia.filter(function (n) {
        if (n.classList.contains('widac')) return false;
        var r = n.getBoundingClientRect();
        if (r.top < h - 40 && r.bottom > 0) { n.classList.add('widac'); obs.unobserve(n); return false; }
        return true;
      });
    }
    window.przegladajWjazdy = dolicz;
    window.addEventListener('load', dolicz);
    window.addEventListener('scroll', dolicz, { passive: true });
    setTimeout(dolicz, 1200);
  })();

  /* ----------------------------------------------------------------------
     4. SPRAWDZARKA PROMIENIA 100 KM
     Liczy odległość w linii prostej między dwiema miejscowościami i zestawia
     ją z promieniem z oferty. Żadnych szacowanych godzin — tylko geometria.
     ---------------------------------------------------------------------- */
  (function promien() {
    var selA = document.getElementById('miasto-a');
    if (!selA) return;
    var selB = document.getElementById('miasto-b');

    var PROMIEN = 100; // km — obietnica z oferty

    // [nazwa, długość geogr., szerokość geogr.]
    var MIASTA = [
      ['Warszawa', 21.01, 52.23], ['Kraków', 19.94, 50.06], ['Łódź', 19.46, 51.76],
      ['Wrocław', 17.04, 51.11], ['Poznań', 16.93, 52.41], ['Gdańsk', 18.65, 54.35],
      ['Gdynia', 18.53, 54.52], ['Szczecin', 14.55, 53.43], ['Bydgoszcz', 18.00, 53.12],
      ['Toruń', 18.60, 53.01], ['Lublin', 22.57, 51.25], ['Białystok', 23.16, 53.13],
      ['Katowice', 19.02, 50.26], ['Gliwice', 18.67, 50.29], ['Tychy', 18.99, 50.13],
      ['Rybnik', 18.55, 50.10], ['Bielsko-Biała', 19.05, 49.82], ['Częstochowa', 19.12, 50.81],
      ['Kielce', 20.63, 50.87], ['Radom', 21.15, 51.40], ['Rzeszów', 22.00, 50.04],
      ['Tarnów', 20.99, 50.01], ['Nowy Sącz', 20.70, 49.62], ['Olsztyn', 20.49, 53.78],
      ['Elbląg', 19.40, 54.16], ['Opole', 17.93, 50.67], ['Wałbrzych', 16.28, 50.77],
      ['Legnica', 16.16, 51.21], ['Jelenia Góra', 15.73, 50.90], ['Zielona Góra', 15.51, 51.94],
      ['Gorzów Wielkopolski', 15.24, 52.74], ['Koszalin', 16.19, 54.19], ['Słupsk', 17.03, 54.46],
      ['Piła', 16.74, 53.15], ['Kalisz', 18.09, 51.76], ['Konin', 18.25, 52.22],
      ['Włocławek', 19.07, 52.65], ['Płock', 19.71, 52.55], ['Grudziądz', 18.75, 53.48],
      ['Ciechanów', 20.62, 52.88], ['Ostrołęka', 21.57, 53.09], ['Siedlce', 22.29, 52.17],
      ['Zamość', 23.25, 50.72], ['Suwałki', 22.93, 54.10], ['Mielec', 21.42, 50.29],
      ['Piotrków Trybunalski', 19.70, 51.41], ['Sieradz', 18.73, 51.60],
      ['Skierniewice', 20.16, 51.96], ['Żyrardów', 20.44, 52.05], ['Sochaczew', 20.24, 52.23],
      ['Pruszków', 20.81, 52.17], ['Jaworzno', 19.27, 50.20], ['Ostrowiec Świętokrzyski', 21.39, 50.93]
    ].sort(function (a, b) { return a[0].localeCompare(b[0], 'pl'); });

    // mapa: te same wzory, którymi narysowany jest kontur Polski w SVG
    function mx(lon) { return (lon - 14.0) * 55; }
    function my(lat) { return (55.0 - lat) * 90; }

    function odleglosc(a, b) {                       // haversine, kilometry
      var R = 6371, rad = Math.PI / 180;
      var dLat = (b[2] - a[2]) * rad, dLon = (b[1] - a[1]) * rad;
      var s1 = Math.sin(dLat / 2), s2 = Math.sin(dLon / 2);
      var h = s1 * s1 + Math.cos(a[2] * rad) * Math.cos(b[2] * rad) * s2 * s2;
      return 2 * R * Math.asin(Math.sqrt(h));
    }

    MIASTA.forEach(function (m, i) {
      selA.add(new Option(m[0], i));
      selB.add(new Option(m[0], i));
    });
    selA.value = MIASTA.findIndex(function (m) { return m[0] === 'Łódź'; });
    selB.value = MIASTA.findIndex(function (m) { return m[0] === 'Piotrków Trybunalski'; });

    var krag = document.getElementById('krag');
    var kragOpis = document.getElementById('krag-opis');
    var tor = document.getElementById('tor');
    var trasa = document.getElementById('trasa');
    var aPkt = document.getElementById('a-punkt');
    var aObw = document.getElementById('a-obwod');
    var aOpis = document.getElementById('a-opis');
    var bPkt = document.getElementById('b-punkt');
    var bOpis = document.getElementById('b-opis');
    var werdykt = document.getElementById('werdykt');
    var werdyktTxt = document.getElementById('werdykt-txt');
    var werdyktPod = document.getElementById('werdykt-pod');
    var poleKm = document.getElementById('f-km');

    function pokazKm(el, docelowo) {
      var start = parseFloat(el.dataset.v || '0');
      el.dataset.v = docelowo;
      if (spokojnie) { el.textContent = docelowo; return; }
      var t0 = performance.now(), czas = 400;
      cancelAnimationFrame(el._raf);
      function krok(t) {
        var p = Math.min(1, (t - t0) / czas);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(start + (docelowo - start) * e);
        if (p < 1) el._raf = requestAnimationFrame(krok);
      }
      el._raf = requestAnimationFrame(krok);
    }

    function licz() {
      var a = MIASTA[+selA.value];
      var b = MIASTA[+selB.value];
      var km = Math.round(odleglosc(a, b));

      var ax = mx(a[1]), ay = my(a[2]);
      var bx = mx(b[1]), by = my(b[2]);

      // promień w pikselach: w pionie stały, w poziomie zależny od szerokości geogr.
      var ry = PROMIEN / 111.32 * 90;
      var rx = PROMIEN / (111.32 * Math.cos(a[2] * Math.PI / 180)) * 55;

      krag.setAttribute('cx', ax.toFixed(1));
      krag.setAttribute('cy', ay.toFixed(1));
      krag.setAttribute('rx', rx.toFixed(1));
      krag.setAttribute('ry', ry.toFixed(1));
      kragOpis.setAttribute('x', (ax - rx + 4).toFixed(1));
      kragOpis.setAttribute('y', (ay - ry - 10).toFixed(1));

      aPkt.setAttribute('cx', ax.toFixed(1)); aPkt.setAttribute('cy', ay.toFixed(1));
      aObw.setAttribute('cx', ax.toFixed(1)); aObw.setAttribute('cy', ay.toFixed(1));
      aOpis.setAttribute('x', (ax - 10).toFixed(1));
      aOpis.setAttribute('y', (ay + 32).toFixed(1));
      aOpis.setAttribute('text-anchor', 'middle');
      aOpis.textContent = a[0];

      bPkt.setAttribute('cx', bx.toFixed(1)); bPkt.setAttribute('cy', by.toFixed(1));
      bOpis.setAttribute('x', (bx + (bx > ax ? 14 : -14)).toFixed(1));
      bOpis.setAttribute('y', (by - 12).toFixed(1));
      bOpis.setAttribute('text-anchor', bx > ax ? 'start' : 'end');
      bOpis.textContent = b[0];

      var d = 'M' + ax.toFixed(1) + ' ' + ay.toFixed(1) + ' L' + bx.toFixed(1) + ' ' + by.toFixed(1);
      tor.setAttribute('d', d);
      trasa.setAttribute('d', d);

      pokazKm(poleKm, km);

      if (a[0] === b[0]) {
        werdykt.classList.remove('nie');
        werdyktTxt.textContent = 'Kurs miejski';
        werdyktPod.textContent = 'Odbiór i dostawa w tej samej miejscowości — najkrótszy możliwy kurs.';
      } else if (km <= PROMIEN) {
        werdykt.classList.remove('nie');
        werdyktTxt.textContent = 'Mieści się w promieniu';
        werdyktPod.textContent = 'Od ' + a[0] + ' do ' + b[0] + ' jest ' + km +
          ' km — mniej niż 100. Przesyłka jedzie tego samego dnia.';
      } else {
        werdykt.classList.add('nie');
        werdyktTxt.textContent = 'Poza promieniem — kurs dedykowany';
        werdyktPod.textContent = 'Od ' + a[0] + ' do ' + b[0] + ' jest ' + km +
          ' km. Jedziemy i tam, osobnym autem — termin ustala dyspozytor przy zleceniu.';
      }
    }

    selA.addEventListener('change', licz);
    selB.addEventListener('change', licz);
    licz();
  })();

  /* ----------------------------------------------------------------------
     5. FORMULARZ „ODDZWOŃCIE"
     ---------------------------------------------------------------------- */
  (function oddzwon() {
    var f = document.getElementById('oddzwon');
    if (!f) return;

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var imie = f.imie.value.trim();
      var tel = f.telefon.value.trim();
      if (!imie || !tel) return;

      var tresc =
        'Dzień dobry,\n\n' +
        'proszę o kontakt w sprawie kursu.\n\n' +
        'Imię: ' + imie + '\n' +
        'Telefon: ' + tel + '\n';

      window.location.href =
        'mailto:biuro@example.pl' +
        '?subject=' + encodeURIComponent('Prośba o kontakt — kurs ekspresowy') +
        '&body=' + encodeURIComponent(tresc);

      document.getElementById('oddzwon-info').innerHTML =
        'Dziękujemy, ' + imie.replace(/[<>]/g, '') +
        '. Oddzwaniamy najszybciej jak się da. Pilne? <a href="tel:+48500100200" style="color:var(--sygnal)">500 100 200</a>.';
      f.reset();
    });
  })();

  /* ----------------------------------------------------------------------
     6. POWIĘKSZANIE ZDJĘĆ
     ---------------------------------------------------------------------- */
  (function lupa() {
    var box = document.getElementById('lupa');
    var img = document.getElementById('lupa-img');
    var podpis = document.getElementById('lupa-podpis');
    var zamknij = document.getElementById('lupa-zamknij');
    var galeria = document.getElementById('galeria');
    if (!box || !galeria) return;

    function otworz(kafel) {
      img.src = kafel.dataset.duze;
      img.alt = kafel.dataset.podpis;
      podpis.textContent = kafel.dataset.podpis;
      box.classList.add('widoczna');
      document.body.style.overflow = 'hidden';
      zamknij.focus();
    }
    function zamknijLupe() {
      box.classList.remove('widoczna');
      document.body.style.overflow = '';
      img.src = '';
    }

    galeria.addEventListener('click', function (e) {
      var kafel = e.target.closest('.kafel');
      if (kafel) otworz(kafel);
    });
    zamknij.addEventListener('click', zamknijLupe);
    box.addEventListener('click', function (e) { if (e.target === box) zamknijLupe(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('widoczna')) zamknijLupe();
    });
  })();

  /* ----------------------------------------------------------------------
     7. ROK W STOPCE
     ---------------------------------------------------------------------- */
  (function rok() {
    var el = document.getElementById('rok');
    if (el) el.textContent = new Date().getFullYear();
  })();

})();
