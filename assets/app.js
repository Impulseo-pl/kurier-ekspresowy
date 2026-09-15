/* ==========================================================================
   Polski Express 24 — logika strony
   ========================================================================== */
(function () {
  'use strict';

  var spokojnie = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     1. NAWIGACJA
     ---------------------------------------------------------------------- */
  (function nawigacja() {
    var nav = document.getElementById('nawigacja');
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');
    if (!nav) return;

    function przyScrollu() {
      nav.classList.toggle('przyklejona', window.scrollY > 10);
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
     2. WEJŚCIA W KADR
     ---------------------------------------------------------------------- */
  (function wKadrze() {
    var cele = [].slice.call(document.querySelectorAll('.wjazd, .siatka-wjazd'));

    if (!('IntersectionObserver' in window) || spokojnie) {
      cele.forEach(function (n) { n.classList.add('widac'); });
      return;
    }

    var obs = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        if (!w.isIntersecting) return;
        w.target.classList.add('widac');
        obs.unobserve(w.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    cele.forEach(function (n) { obs.observe(n); });

    // Zabezpieczenie: przy starcie z kotwicą obserwator potrafi policzyć
    // pozycje, zanim układ się ustali, i nigdy nie odpalić.
    function dolicz() {
      var h = window.innerHeight;
      cele = cele.filter(function (n) {
        if (n.classList.contains('widac')) return false;
        var r = n.getBoundingClientRect();
        if (r.top < h - 40 && r.bottom > 0) { n.classList.add('widac'); obs.unobserve(n); return false; }
        return true;
      });
    }
    window.addEventListener('load', dolicz);
    window.addEventListener('scroll', dolicz, { passive: true });
    setTimeout(dolicz, 900);
  })();

  /* ----------------------------------------------------------------------
     3. MAPA TRAS: wiersz listy podświetla kraj
     ---------------------------------------------------------------------- */
  (function trasy() {
    var lista = document.querySelector('.kraje');
    var mapa = document.querySelector('.europa');
    if (!lista || !mapa) return;

    lista.querySelectorAll('li').forEach(function (li) {
      var kod = li.querySelector('.kod');
      if (!kod) return;
      var kraj = mapa.querySelector('[data-kraj="' + kod.textContent.trim().toLowerCase() + '"]');
      if (!kraj || kraj.classList.contains('baza-kraj')) return;
      li.addEventListener('mouseenter', function () { kraj.classList.add('zywy'); });
      li.addEventListener('mouseleave', function () { kraj.classList.remove('zywy'); });
    });
  })();

  /* ----------------------------------------------------------------------
     4. FORMULARZ „ODDZWOŃCIE"
     ---------------------------------------------------------------------- */
  (function oddzwon() {
    var f = document.getElementById('oddzwon');
    if (!f) return;

    // UWAGA: klient nie podał adresu e-mail. Do czasu jego podania formularz
    // tylko potwierdza zgłoszenie na ekranie i kieruje na telefon.
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var imie = f.imie.value.trim().replace(/[<>]/g, '');
      var tel = f.telefon.value.trim().replace(/[<>]/g, '');
      if (!imie || !tel) return;

      document.getElementById('oddzwon-info').innerHTML =
        '<b style="color:var(--granat)">Dziękujemy, ' + imie + '.</b> Oddzwonimy pod ' + tel +
        '. Pilne? <a href="tel:+48690757344" style="color:var(--czerwien);font-weight:700">690 757 344</a>.';
      f.reset();
    });
  })();

  /* ----------------------------------------------------------------------
     5. POWIĘKSZANIE ZDJĘĆ
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
     6. ROK W STOPCE
     ---------------------------------------------------------------------- */
  (function rok() {
    var el = document.getElementById('rok');
    if (el) el.textContent = new Date().getFullYear();
  })();

})();
