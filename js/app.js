/* =========================================================
   KHÁM PHÁ VIỆT NAM – Lõi ứng dụng
   (giọng đọc, bản đồ, hành trình 7 bước, sao vàng, hộ chiếu, huy hiệu,
    bằng khen, bưu thiếp gửi ông bà)
   ========================================================= */
(function () {
  const KP = window.KP = window.KP || {};
  const STOPS = window.STOPS, CHANG = window.CHANG, M = window.MAPDATA, PH = KP.PH;
  const N_STOPS = STOPS.length;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[rand(a.length)];
  KP.$ = $; KP.esc = esc; KP.rand = rand; KP.shuffle = shuffle;

  /* Ảnh Trâu Con & logo chính thức: ưu tiên file trong thư mục assets/,
     nếu chưa có thì lấy từ trang Trường Tiếng Việt Của Em. */
  const ASSET = {
    mascot: ['assets/trau-con.png', 'https://truongtiengvietcuaem.cvcec.org/assets/wave-BxRGaky7.png'],
    logo: ['assets/logo-wordmark.png', 'https://truongtiengvietcuaem.cvcec.org/assets/logo-wordmark-B0AAq1bv.png']
  };
  KP.img = { mascot: '', logo: '', mascotLocal: false };
  function resolveImg(key) {
    return new Promise(res => {
      const list = ASSET[key].slice();
      const tryNext = () => {
        if (!list.length) return res('');
        const src = list.shift(), im = new Image();
        im.onload = () => res(src); im.onerror = tryNext; im.src = src;
      };
      tryNext();
    });
  }

  /* ---------------- Lưu tiến trình (trên máy này) ---------------- */
  const KEY = 'kpvn-tien-trinh-v1';
  let memState = null;
  function fresh() { return { v: 1, stars: {}, manual: 0, name: '', sound: true, seen: false }; }
  function load() {
    try { const v = JSON.parse(localStorage.getItem(KEY)); if (v && v.v === 1 && v.stars) return Object.assign(fresh(), v); } catch (e) { }
    return memState || fresh();
  }
  const state = KP.state = load();
  function save() { memState = state; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } }
  KP.save = save;
  const starCount = () => STOPS.filter(s => state.stars[s.id]).length;
  function unlockedIdx() { let i = 0; while (i < N_STOPS - 1 && state.stars[STOPS[i].id]) i++; return Math.max(i, state.manual || 0); }
  const isUnlocked = i => i <= unlockedIdx();
  function currentIdx() { for (let i = 0; i < N_STOPS; i++) if (!state.stars[STOPS[i].id]) return i; return N_STOPS - 1; }

  /* ---------------- Âm thanh hiệu ứng ---------------- */
  const Snd = KP.Snd = {
    ctx: null,
    get() {
      if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (C) this.ctx = new C(); }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    tone(freqs, dur, type, gap, vol) {
      if (!state.sound) return; const c = this.get(); if (!c) return;
      const t0 = c.currentTime;
      freqs.forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain(), t = t0 + i * (gap || .09);
        o.type = type || 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .16, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + (dur || .15));
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + (dur || .15) + .05);
      });
    },
    ok() { this.tone([660, 880], .18, 'triangle', .1); },
    no() { this.tone([240, 190], .22, 'sine', .12, .12); },
    pop() { this.tone([520], .08, 'triangle'); },
    star() { this.tone([523, 659, 784, 1047, 1319], .32, 'triangle', .09, .14); },
    gong(f) {
      if (!state.sound) return; const c = this.get(); if (!c) return; const t = c.currentTime;
      [1, 2.01, 2.76, 4.1].forEach((m, i) => {
        const o = c.createOscillator(), g = c.createGain(), v = [.3, .12, .08, .04][i];
        o.type = 'sine'; o.frequency.value = f * m;
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 1.6 / (i + 1));
        o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 1.8);
      });
    }
  };

  /* ---------------- Giọng đọc ----------------
     Mỗi câu nói là một danh sách "mảnh". Mảnh nào đã có file giọng Elio
     (js/audio-manifest.js) thì phát file; mảnh nào chưa có thì đọc bằng giọng
     máy của thiết bị, chia thành từng câu ngắn để không bị ngắt giữa chừng. */
  const Voice = KP.Voice = {
    token: 0, vi: null, en: null, hasVi: false, audio: null,
    keep: [], stat: { ok: 0, fail: 0, last: '' }, warned: 0, log: [],
    init() {
      if (!('speechSynthesis' in window)) return;
      /* Bỏ các giọng "vui" của macOS (Albert, Bubbles…) khi chọn giọng tiếng Anh */
      const ODD = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Pipe Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Deranged|Hysterical|Junior|Ralph|Fred|Kathy|Princess|Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley)\b/i;
      const rank = (v, lang) => {
        if (lang === 'en' && ODD.test(v.name)) return -100;
        let r = 0;
        if (/natural|online|neural/i.test(v.name)) r += 50;
        if (/enhanced|premium/i.test(v.name)) r += 30;
        if (/google/i.test(v.name)) r += 20;
        if (lang === 'vi' && /NamMinh|HoaiMy|Linh/i.test(v.name)) r += 10;
        if (lang === 'en' && /en[-_]US/i.test(v.lang)) r += 8;
        if (lang === 'en' && /Samantha|Aria|Jenny|Guy|Ava|Allison|Daniel|Karen/i.test(v.name)) r += 6;
        return r;
      };
      const pickV = () => {
        const all = speechSynthesis.getVoices();
        const vi = all.filter(v => /^vi/i.test(v.lang)).sort((a, b) => rank(b, 'vi') - rank(a, 'vi'));
        const en = all.filter(v => /^en/i.test(v.lang) && rank(v, 'en') > -100).sort((a, b) => rank(b, 'en') - rank(a, 'en'));
        this.hasVi = vi.length > 0; this.vi = vi[0] || null; this.en = en[0] || null;
      };
      pickV(); speechSynthesis.onvoiceschanged = pickV;
      /* Lần chạm đầu tiên: "mở khoá" giọng đọc (iPad, iPhone chỉ cho đọc khi có chạm) */
      const evs = ['pointerdown', 'touchend', 'keydown'];
      const unlock = () => {
        evs.forEach(ev => document.removeEventListener(ev, unlock, true));
        try {
          if (speechSynthesis.speaking || speechSynthesis.pending) return;
          const u = new SpeechSynthesisUtterance(' '); u.volume = 0; this.hold(u); speechSynthesis.speak(u);
        } catch (e) { }
      };
      evs.forEach(ev => document.addEventListener(ev, unlock, { capture: true, passive: true }));
    },
    /* Giữ tham chiếu tới câu đang đọc (Chrome hay "quên" câu đọc nên không báo xong) */
    hold(u) { this.keep.push(u); if (this.keep.length > 12) this.keep.shift(); },
    /* Máy không đọc được: báo một lần, phụ đề vẫn chạy theo nhịp đọc */
    fail(code) {
      this.stat.fail++; this.stat.last = code;
      if (code === 'nostart') {
        if (this.jamWarned) return; this.jamWarned = true;
        if (typeof toast === 'function') toast('🔇 Bộ đọc giọng của máy đang bị kẹt nên Trâu Con chưa nói được. Bạn hãy thoát hẳn trình duyệt (trên Mac bấm ⌘Q) rồi mở lại. Phụ đề vẫn chạy để bé đọc theo.', 9000);
        return;
      }
      if (this.warned >= 2 || (this.warned && this.stat.ok)) return;
      this.warned++;
      const msg = this.warned === 1
        ? '🔇 Máy chưa phát được giọng đọc. Bạn bấm nút 🔊 hoặc ▶ để nghe lại nhé.'
        : '🔇 Trình duyệt này đang chặn giọng đọc. Hãy mở trang vietnam.cvcec.org bằng Chrome, Safari hoặc Edge (không mở trong khung xem trước), và kiểm tra loa của máy.';
      if (typeof toast === 'function') toast(msg, 6000);
    },
    /* Tìm file giọng thu sẵn của một mảnh câu.
       AUDIO_FILES[mã] = [nhóm, giây bắt đầu, độ dài]  (gói giọng theo từng trạm)
                       hoặc 'audio/ten-file.mp3'        (file lẻ)            */
    file(t, lang) { const k = KP.speechKey(t, lang); return window.AUDIO_FILES ? window.AUDIO_FILES[k] || null : null; },
    bufs: {},
    loadGroup(g) {
      if (this.bufs[g]) return this.bufs[g];
      const url = window.AUDIO_SPRITES && window.AUDIO_SPRITES[g];
      const ctx = Snd.get();
      if (!url || !ctx) return Promise.reject(new Error('no audio'));
      const p = fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(ab => new Promise((ok, err) => ctx.decodeAudioData(ab, ok, err)));
      p.catch(() => { delete this.bufs[g]; });
      return (this.bufs[g] = p);
    },
    preload(groups) { if (!window.AUDIO_SPRITES || !state.sound) return; groups.forEach(g => { if (window.AUDIO_SPRITES[g]) this.loadGroup(g).catch(() => { }); }); },
    playSprite(entry, done, fail) {
      const my = this.token, [g, start, dur] = entry;
      this.loadGroup(g).then(buf => {
        if (my !== this.token) return;
        const ctx = Snd.get(), src = ctx.createBufferSource();
        if (ctx.state === 'suspended') ctx.resume();
        src.buffer = buf; src.connect(ctx.destination);
        src.onended = () => { if (this.src === src) this.src = null; done(); };
        this.src = src; src.start(0, start, dur); this.stat.ok++;
      }).catch(() => { if (my === this.token) fail(); });
    },
    busy() {
      try { return !!(this.src || this.audio || ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending))); } catch (e) { return false; }
    },
    say(parts, opts) {
      opts = opts || {};
      const wasBusy = this.busy();
      this.stop();
      this.cur = opts;
      const my = this.token, lang = opts.lang || 'vi';
      const list = (Array.isArray(parts) ? parts : [parts]).filter(x => x != null && String(x).trim()).map(String);
      if (!state.sound || !list.length) { if (opts.onend) setTimeout(opts.onend, 0); return; }
      let i = 0;
      const next = () => {
        if (my !== this.token) return;
        if (i >= list.length) { if (this.cur === opts) this.cur = null; if (opts.onend) opts.onend(); return; }
        const idx = i++, t = list[idx];
        if (opts.onpart) opts.onpart(idx);
        const f = this.file(t, lang), fb = () => this.tts(t, lang, next, my);
        if (Array.isArray(f)) this.playSprite(f, next, fb);
        else if (typeof f === 'string') this.playFile(f, next, fb);
        else fb();
      };
      /* Vừa dừng câu cũ thì chờ một chút rồi mới đọc (tránh lỗi mất tiếng của Chrome) */
      setTimeout(next, wasBusy ? 150 : 30);
    },
    playFile(src, done, fail) {
      let ok = false;
      const a = new Audio(src); this.audio = a;
      a.onended = () => { ok = true; done(); };
      a.onerror = () => { if (!ok) fail(); };
      const p = a.play(); if (p && p.then) p.then(() => { this.stat.ok++; }, () => fail());
    },
    pace(t) { return 600 + String(t).length * 75; },
    tts(t, lang, done, my) {
      if (!('speechSynthesis' in window)) { this.fail('none'); setTimeout(() => { if (my === this.token) done(); }, this.pace(t)); return; }
      const chunks = [];
      KP.splitSentences(t).forEach(c => {
        if (c.length <= 160) return chunks.push(c);
        c.split(/(?<=[,;:–])\s+/).forEach(x => chunks.push(x));
      });
      let j = 0;
      const one = () => {
        if (my !== this.token) return;
        if (j >= chunks.length) { done(); return; }
        const text = chunks[j++];
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === 'en' ? 'en-US' : 'vi-VN';
        const v = lang === 'en' ? this.en : this.vi; if (v) u.voice = v;
        u.rate = lang === 'en' ? .92 : .88; u.pitch = 1.1;
        this.hold(u);
        let fired = false, started = false;
        const t0 = Date.now();
        const note = by => { this.log.push({ n: text.length, ms: Date.now() - t0, by }); if (this.log.length > 8) this.log.shift(); };
        const go = by => { if (fired) return; fired = true; clearTimeout(guard); note(by || 'end'); one(); };
        /* Không có tiếng: vẫn chờ đúng nhịp đọc rồi mới sang câu sau */
        const later = code => {
          if (fired) return; fired = true; clearTimeout(guard); note(code); this.fail(code);
          setTimeout(one, Math.max(0, this.pace(text) - (Date.now() - t0)));
        };
        const guard = setTimeout(() => go('guard'), 3000 + text.length * 140);
        u.onstart = () => { started = true; this.stat.ok++; };
        /* Một số trình duyệt (ví dụ Chrome trên Mac khi trang nằm trong khung) không báo "đọc xong".
           Vì vậy trang tự kiểm tra: máy thôi đọc thì coi như xong câu. */
        const iv = setInterval(() => {
          if (fired) { clearInterval(iv); return; }
          const el = Date.now() - t0; let sp = true;
          try { sp = speechSynthesis.speaking || speechSynthesis.pending; } catch (e) { }
          if (!sp && el > 350) { clearInterval(iv); if (started) go('poll'); else if (el > 1200) later('poll0'); }
        }, 200);
        u.onend = () => { if (!started && Date.now() - t0 < 300 && text.length > 3) later('silent'); else go('end'); };
        u.onerror = e => {
          const c = (e && e.error) || 'error';
          if (c === 'interrupted' || c === 'canceled') { if (my !== this.token) return; return go(c); }
          later(c);
        };
        try { if (speechSynthesis.paused) speechSynthesis.resume(); speechSynthesis.speak(u); }
        catch (e) { later('exception'); }
        /* Máy nhận câu nhưng 2 giây vẫn chưa đọc: bộ đọc của máy đang bị kẹt */
        setTimeout(() => { if (!fired && !started) { try { speechSynthesis.cancel(); } catch (e) { } later('nostart'); } }, 2000);
      };
      one();
    },
    stop() {
      this.token++;
      /* Báo cho phần đang đọc dở biết là đã bị dừng (ví dụ phim tự chuyển sang "tạm dừng") */
      const c = this.cur; this.cur = null;
      if (c && c.onstop) { try { c.onstop(); } catch (e) { } }
      try { if ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending || speechSynthesis.paused)) speechSynthesis.cancel(); } catch (e) { }
      if (this.audio) { try { this.audio.pause(); } catch (e) { } this.audio = null; }
      if (this.src) { try { this.src.onended = null; this.src.stop(); } catch (e) { } this.src = null; }
    }
  };
  KP.say = (parts, opts) => Voice.say(parts, opts);
  KP.speak = (parts, key, cb) => Voice.say(parts, { onend: cb });

  /* Nút loa nhỏ */
  KP.speakBtn = (parts, lang) => {
    const b = document.createElement('button');
    b.className = 'speak-btn'; b.type = 'button'; b.setAttribute('aria-label', lang === 'en' ? 'Listen' : 'Nghe đọc'); b.innerHTML = '<span class="emo">🔊</span>';
    b.onclick = e => { e.stopPropagation(); b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); Voice.say(typeof parts === 'function' ? parts() : parts, { lang }); };
    return b;
  };
  /* Nút "EN" – giải thích ngắn bằng tiếng Anh */
  KP.enBtn = (text, opts) => {
    opts = opts || {};
    const w = document.createElement('div'); w.className = 'en-wrap' + (opts.inline ? ' inline' : '');
    w.innerHTML = `<button type="button" class="en-btn" aria-label="Explain in English"><b>EN</b><span>Explain in English</span></button><div class="en-box hidden" lang="en"></div>`;
    const box = w.querySelector('.en-box'); box.textContent = text;
    w.querySelector('.en-btn').onclick = e => {
      e.stopPropagation();
      const open = box.classList.contains('hidden');
      box.classList.toggle('hidden', !open);
      if (open) Voice.say(text, { lang: 'en' }); else Voice.stop();
    };
    return w;
  };
  /* Dòng hướng dẫn có loa */
  function hintLine(text) {
    const p = document.createElement('div'); p.className = 'hint-line';
    p.innerHTML = `<span>${esc(text)}</span>`; p.insertBefore(KP.speakBtn(text), p.firstChild);
    return p;
  }

  /* ---------------- Tiện ích giao diện ---------------- */
  function toast(msg, ms) {
    $$('.toast').forEach(t => t.remove());
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), ms || 2600);
  }
  KP.toast = toast;

  function modal(html, opts) {
    opts = opts || {};
    const back = document.createElement('div'); back.className = 'modal-back';
    back.innerHTML = `<div class="modal ${opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true">${opts.noX ? '' : '<button class="x" data-close aria-label="Đóng">✕</button>'}${html}</div>`;
    const close = () => { back.remove(); document.removeEventListener('keydown', onKey); if (opts.onclose) opts.onclose(); };
    const onKey = e => { if (e.key === 'Escape' && !opts.noX) close(); };
    back.addEventListener('click', e => { if ((e.target === back && !opts.noX) || e.target.closest('[data-close]')) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(back);
    back.close = close;
    const f = back.querySelector('input, .btn'); if (f && opts.focus !== false) setTimeout(() => f.focus({ preventScroll: true }), 50);
    return back;
  }
  KP.modal = modal;

  function parentGate(reason, onOk) {
    const a = 6 + rand(4), b = 6 + rand(4);
    const m = modal(`<h2>Dành cho bố mẹ / thầy cô</h2><p>${esc(reason)}</p>
      <div class="field"><label for="pgIn">Hãy tính: ${a} × ${b} = ?</label><input id="pgIn" inputmode="numeric" autocomplete="off" pattern="[0-9]*"></div>
      <p class="g-msg no" id="pgMsg"></p>
      <div class="row"><button class="btn" id="pgOk">Xác nhận</button><button class="btn ghost" data-close>Huỷ</button></div>`);
    const go = () => {
      if (parseInt($('#pgIn', m).value, 10) === a * b) { m.close(); onOk(); }
      else { $('#pgMsg', m).textContent = 'Chưa đúng, thử lại nhé.'; $('#pgIn', m).value = ''; }
    };
    $('#pgOk', m).onclick = go;
    $('#pgIn', m).onkeydown = e => { if (e.key === 'Enter') go(); };
  }

  /* ---------------- Bản đồ ---------------- */
  const D2R = Math.PI / 180;
  const merc = lat => Math.log(Math.tan(Math.PI / 4 + lat * D2R / 2));
  const SCALE = M.W / ((M.lon1 - M.lon0) * D2R);
  const MY1 = merc(M.lat1);
  const P = (lon, lat) => [(lon - M.lon0) * D2R * SCALE, (MY1 - merc(lat)) * SCALE];
  KP.project = P;
  KP.unproject = (x, y) => [x / SCALE / D2R + M.lon0, (2 * Math.atan(Math.exp(MY1 - y / SCALE)) - Math.PI / 2) / D2R];
  const mkPos = s => { const p = P(s.pos[0], s.pos[1]); return [p[0] + (s.off ? s.off[0] : 0), p[1] + (s.off ? s.off[1] : 0)]; };
  KP.mkPos = mkPos;

  KP.mapBase = function (opts) {
    opts = opts || {};
    const L = (lon, lat, txt, cls, extra) => { const [x, y] = P(lon, lat); return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" class="m-lbl ${cls}" ${extra || ''}>${txt}</text>`; };
    let s = `<defs>
      <linearGradient id="seaG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CDEBF3"/><stop offset="1" stop-color="#A9DAE8"/></linearGradient>
      <filter id="mkShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity=".28"/></filter>
      <filter id="landShadow" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#2F6F86" flood-opacity=".25"/></filter>
      <pattern id="wv" width="90" height="60" patternUnits="userSpaceOnUse"><path d="M8 20 q7 -6 14 0 t14 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".55"/><path d="M52 48 q7 -6 14 0 t14 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".45"/></pattern>
    </defs>
    <rect width="${M.W}" height="${M.H}" fill="url(#seaG)"/><rect width="${M.W}" height="${M.H}" fill="url(#wv)"/>`;
    for (const k in M.nb) s += `<path class="m-nb" d="${M.nb[k]}"/>`;
    s += `<path class="m-land" d="${M.vn}" filter="url(#landShadow)"/>`;
    if (!opts.simple) {
      M.rivers.forEach(r => { s += `<path class="m-river" d="${r.d}"/>`; });
      const mts = [[104.0, 22.85], [104.65, 22.55], [103.15, 21.75], [104.25, 21.55], [106.3, 22.35], [103.45, 22.65], [102.75, 21.45], [105.5, 19.35], [105.55, 18.45], [106.7, 16.95], [107.55, 15.85], [107.9, 15.0], [108.05, 14.1], [107.9, 13.45], [107.85, 11.85]];
      mts.forEach(([lo, la]) => {
        const [x, y] = P(lo, la);
        s += `<path d="M${(x - 9).toFixed(1)} ${(y + 5).toFixed(1)} l7 -11 l4 5 l3 -4 l7 10Z" fill="#9DBF86" stroke="#6E9A55" stroke-width=".8" opacity=".85"/>`;
      });
      s += L(108.2, 23.85, 'TRUNG QUỐC', 'm-country') + L(103.0, 19.0, 'LÀO', 'm-country') + L(104.75, 12.85, 'CAMPUCHIA', 'm-country') + L(101.85, 15.6, 'THÁI LAN', 'm-country');
      s += L(113.7, 14.3, 'Biển Đông', 'm-sea') + L(107.65, 19.55, 'Vịnh Bắc Bộ', 'm-sea sm') + L(102.35, 9.35, 'Vịnh Thái Lan', 'm-sea sm');
      const [cx, cy] = P(115.7, 20.4);
      s += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})" opacity=".85"><circle r="26" fill="#fff" opacity=".7"/><polygon points="0,-24 6,0 0,24 -6,0" fill="#C68B59"/><polygon points="0,-24 6,0 -6,0" fill="#DA251D"/><polygon points="-24,0 0,-5 24,0 0,5" fill="#DDAA55" opacity=".7"/><text y="-30" text-anchor="middle" class="m-lbl" style="font-size:13px;fill:#DA251D">B</text></g>`;
      const [bx, by] = P(110.9, 14.5); s += `<text x="${bx}" y="${by}" font-size="22" class="emo">⛵</text>`;
      const [fx, fy] = P(110.6, 19.0); s += `<text x="${fx}" y="${fy}" font-size="16" class="emo" opacity=".8">🐟</text>`;
    }
    const arch = (lon, lat, rxDeg, ryDeg) => { const [x, y] = P(lon, lat); const rx = rxDeg * D2R * SCALE, ry = ryDeg * D2R * SCALE * 1.04; return `<ellipse class="m-arch" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}"/>`; };
    s += arch(111.98, 16.42, 1.2, 0.95) + arch(113.9, 9.66, 2.35, 2.15);
    M.islands.forEach(([x, y, k]) => { s += `<circle class="m-isl-${k}" cx="${x}" cy="${y}" r="${k === 'vn' ? 2.2 : 2.6}"/>`; });
    if (!opts.simple) {
      s += L(112.05, 17.72, 'Quần đảo Hoàng Sa', 'm-arch-lbl') + L(112.05, 17.45, '(Việt Nam)', 'm-arch-sub');
      s += L(114.1, 12.25, 'Quần đảo Trường Sa', 'm-arch-lbl') + L(114.1, 11.98, '(Việt Nam)', 'm-arch-sub');
    } else if (opts.labels !== false) {
      s += L(112.0, 17.6, 'Hoàng Sa', 'm-arch-lbl') + L(114.1, 12.1, 'Trường Sa', 'm-arch-lbl');
    }
    return s;
  };

  /* Đường hành trình mượt đi qua các trạm và các điểm "via" */
  function routeNodes(pts) {
    const nodes = [], nodeOf = [];
    STOPS.forEach((st, i) => { (st.via || []).forEach(v => nodes.push(P(v[0], v[1]))); nodeOf[i] = nodes.length; nodes.push(pts[i]); });
    return { nodes, nodeOf };
  }
  function segPath(R, i) {
    const N = R.nodes, a = R.nodeOf[i - 1], b = R.nodeOf[i], t = .17;
    const f = v => v.toFixed(1);
    let d = `M${f(N[a][0])} ${f(N[a][1])}`, mid = null;
    for (let j = a + 1; j <= b; j++) {
      const p0 = N[Math.max(0, j - 2)], p1 = N[j - 1], p2 = N[j], p3 = N[Math.min(N.length - 1, j + 1)];
      const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
      const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
      d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
      if (j === a + 1 + Math.floor((b - a - 1) / 2)) mid = [(p1[0] + 3 * c1[0] + 3 * c2[0] + p2[0]) / 8, (p1[1] + 3 * c1[1] + 3 * c2[1] + p2[1]) / 8];
    }
    return { d, mid };
  }

  function markerSVG(s, i, st) {
    const [x, y] = mkPos(s);
    const col = CHANG[s.chang - 1].color;
    let badge;
    if (st.done) badge = `<polygon class="star" points="${KP.starPts(13, -13, 11)}" fill="#F7C531" stroke="#C98400" stroke-width="1.6" stroke-linejoin="round"/>`;
    else if (st.locked) badge = `<circle cx="13" cy="-13" r="8.5" fill="#fff" stroke="#CFC8BB"/><text x="13" y="-12.5" font-size="9.5" text-anchor="middle" dominant-baseline="central" class="emo">🔒</text>`;
    else badge = `<circle class="numbg" cx="13" cy="-13" r="8.5"/><text class="num" x="13" y="-12.6">${i + 1}</text>`;
    const lp = { r: ['22', '4.5', 'start'], l: ['-22', '4.5', 'end'], t: ['0', '-26', 'middle'], b: ['0', '34', 'middle'] }[s.lab || 'r'];
    const label = s.sea ? '' : `<text class="lbl" x="${lp[0]}" y="${lp[1]}" text-anchor="${lp[2]}">${esc(s.mapName || s.name)}</text>`;
    return `<g class="mk ${st.locked ? 'locked' : ''} ${st.done ? 'done' : ''} ${st.current ? 'current' : ''}" data-i="${i}" tabindex="0" role="button"
      aria-label="Trạm ${i + 1}: ${esc(s.name)}${st.done ? ', đã có sao vàng' : st.locked ? ', chưa mở' : ''}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle class="pulse" r="17"/><circle class="disc" r="17" fill="${col}"/>
      ${KP.iconIn(s.icon, -13.5, -13.5, 27, 'ico-svg') || `<text class="ico emo">${s.icon}</text>`}${badge}${label}</g>`;
  }

  let mapZoom = null;
  function renderMap(opts) {
    opts = opts || {};
    const holder = $('#mapScroll');
    const pts = STOPS.map(mkPos);
    const cur = currentIdx();
    let s = `<svg id="mapSvg" viewBox="0 0 ${M.W} ${M.H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bản đồ Việt Nam với hành trình ${N_STOPS} trạm từ Lũng Cú đến Cà Mau, có quần đảo Hoàng Sa và Trường Sa">`;
    s += KP.mapBase();
    const RN = routeNodes(pts);
    for (let i = 1; i < N_STOPS; i++) {
      const sp = segPath(RN, i), leg = STOPS[i].leg;
      const traveled = !!state.stars[STOPS[i - 1].id] && !(opts.flyFrom === i - 1);
      s += `<path class="m-route ${leg === 'sea' ? 'sea' : leg === 'air' ? 'air' : ''} ${traveled ? 'done' : ''}" d="${sp.d}"/>`;
      if ((leg === 'sea' || leg === 'air') && sp.mid) s += `<text x="${sp.mid[0].toFixed(1)}" y="${sp.mid[1].toFixed(1)}" font-size="15" text-anchor="middle" dominant-baseline="central" class="emo" opacity=".9">${leg === 'air' ? '✈️' : '⛴️'}</text>`;
    }
    STOPS.forEach(st => {
      if (st.off && Math.hypot(st.off[0], st.off[1]) > 9) {
        const [tx, ty] = P(st.pos[0], st.pos[1]), [mx, my] = mkPos(st);
        s += `<line class="mk-leader" x1="${tx.toFixed(1)}" y1="${ty.toFixed(1)}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}"/><circle class="mk-dot" cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="2.2"/>`;
      }
    });
    STOPS.forEach((st, i) => {
      const done = !!state.stars[st.id] && opts.flyFrom !== i;
      s += markerSVG(st, i, { done, locked: !isUnlocked(i), current: i === cur && !state.stars[st.id] });
    });
    const mi = opts.flyFrom != null ? opts.flyFrom : cur;
    const [mx, my] = mkPos(STOPS[mi]);
    if (KP.img.mascot) s += `<g id="mapMascot" style="transform:translate(${mx}px,${my}px)"><image href="${KP.img.mascot}" x="-23" y="-71" width="44" height="51"/></g>`;
    s += `</svg>`;
    holder.innerHTML = s;
    applyZoom(mapZoom == null ? 1 : mapZoom, true);
    renderHeader();
  }

  function baseW() { return Math.max($('#mapScroll').clientWidth, 860); }
  function fitZoom() { return $('#mapScroll').clientWidth / baseW(); }
  function applyZoom(z, silent) {
    const el = $('#mapScroll'), svg = $('#mapSvg'); if (!svg) return;
    const r0 = svg.getBoundingClientRect(), oldW = r0.width || 1;
    const cxr = (el.scrollLeft + el.clientWidth / 2) / oldW;
    const cyr = (window.innerHeight / 2 - r0.top) / (r0.height || 1);
    mapZoom = Math.min(3, Math.max(fitZoom(), z));
    const w = baseW() * mapZoom;
    svg.style.width = w + 'px'; svg.style.height = (w * M.H / M.W) + 'px';
    if (!silent) {
      el.scrollLeft = cxr * w - el.clientWidth / 2;
      const r1 = svg.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + r1.top + cyr * r1.height - window.innerHeight / 2);
    }
  }
  function centerOn(x, y, smooth) {
    const el = $('#mapScroll'), svg = $('#mapSvg'); if (!svg) return;
    const r = svg.getBoundingClientRect(), k = r.width / M.W;
    el.scrollTo({ left: x * k - el.clientWidth / 2, behavior: smooth ? 'smooth' : 'auto' });
    window.scrollTo({ top: window.scrollY + r.top + y * k - window.innerHeight * .45, behavior: smooth ? 'smooth' : 'auto' });
  }
  KP.centerOnCurrent = smooth => { const p = mkPos(STOPS[currentIdx()]); centerOn(p[0], p[1], smooth); };

  function renderHeader() {
    const n = starCount();
    $('#starCount').textContent = `${n}/${N_STOPS}`;
    const cur = currentIdx(), cs = STOPS[cur];
    const h = $('#heroTitle'), p = $('#heroText');
    if (n === 0) { h.textContent = 'Chào các bạn! Mình là Trâu Con.'; p.textContent = `Cùng mình đi dọc chữ S qua ${N_STOPS} trạm, từ Cột cờ Lũng Cú tới Đất Mũi Cà Mau nhé! Mỗi trạm khám phá xong, các bạn nhận được một ngôi sao vàng.`; }
    else if (n < N_STOPS) { h.textContent = `Bạn đã có ${n} ngôi sao vàng!`; p.textContent = `Trạm tiếp theo: ${cs.name} (${cs.place}). Chạm vào trạm có Trâu Con đứng để đi tiếp nhé.`; }
    else { h.textContent = `Hoan hô${state.name ? ' ' + state.name : ''}! Bạn đã đi trọn hành trình chữ S!`; p.textContent = 'Bạn đã trở thành Nhà thám hiểm nhí Việt Nam. In bằng khen thôi!'; }
    $('#changRow').innerHTML = CHANG.map(c => {
      const list = STOPS.filter(s => s.chang === c.id), got = list.filter(s => state.stars[s.id]).length;
      return `<span class="chip ${got === list.length ? 'done' : ''}"><i style="background:${c.color}"></i>${c.name} · ${got}/${list.length} ⭐</span>`;
    }).join('');
    const nb = $('#nextBtn');
    if (n === N_STOPS) { nb.innerHTML = '<span class="emo">🏅</span> In bằng khen Nhà thám hiểm nhí'; nb.onclick = showCertificate; nb.className = 'btn gold'; }
    else { nb.innerHTML = `<span class="emo">▶</span> ${n ? 'Đi tiếp' : 'Bắt đầu'}: ${cur + 1}. ${esc(cs.name)}`; nb.onclick = () => openStop(cur); nb.className = 'btn'; }
  }

  function onMapClick(e) {
    const g = e.target.closest('.mk'); if (!g) return;
    const i = +g.dataset.i;
    if (isUnlocked(i)) openStop(i); else lockedInfo(i);
  }
  function lockedInfo(i) {
    const s = STOPS[i], cur = STOPS[currentIdx()];
    const m = modal(`<div class="welcome"><div class="emo" style="font-size:56px">🔒</div><h2 style="margin:6px 0">${esc(s.name)} chưa mở</h2>
      <p>Trâu Con đang đợi ở <b>${esc(cur.name)}</b>. Hãy hoàn thành các trạm trước để đi tiếp tới đây nhé!</p>
      <div class="row" style="justify-content:center"><button class="btn" id="goCur">▶ Tới trạm ${currentIdx() + 1}</button><button class="btn ghost sm" id="adultUnlock">Bố mẹ / thầy cô mở khoá</button></div></div>`);
    $('#goCur', m).onclick = () => { m.close(); openStop(currentIdx()); };
    $('#adultUnlock', m).onclick = () => { m.close(); parentGate(`Mở khoá đến trạm ${i + 1}: ${s.name}? (Dùng khi bé chuyển sang máy khác hoặc học cùng lớp.)`, () => { state.manual = Math.max(state.manual || 0, i); save(); renderMap(); toast('Đã mở khoá đến trạm ' + (i + 1)); }); };
  }

  /* ---------------- Màn hình trạm: 7 bước ---------------- */
  const STEPS = [
    { k: 'video', t: 'Phim', i: '🎬' }, { k: 'keys', t: 'Ghi nhớ', i: '🔑' }, { k: 'cards', t: 'Thẻ từ', i: '🃏' },
    { k: 'game', t: 'Trò chơi', i: '🎮' }, { k: 'food', t: 'Ăn gì, có gì', i: '🍜' }, { k: 'quiz', t: 'Đố vui', i: '❓' }, { k: 'star', t: 'Nhận sao', i: '⭐' }
  ];
  let SV = null;

  function openStop(i) {
    const s = STOPS[i];
    Voice.stop();
    const already = !!state.stars[s.id];
    SV = { i, s, cur: 0, max: already ? STEPS.length - 1 : 0, ok: {}, already, earned: false };
    Voice.preload(['chung', s.id]);
    const ch = CHANG[s.chang - 1];
    const ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'stopView';
    ov.innerHTML = `<div class="ov-top"><button class="icon-btn close" id="svClose" aria-label="Về bản đồ"><span class="emo">🗺️</span><span class="lbl">Bản đồ</span></button>
      <div class="ov-title"><b>${i + 1}. ${esc(s.name)}</b><span><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${ch.color}"></i> Chặng ${ch.id}: ${esc(ch.name)} · ${esc(s.place)}</span></div>
      <span class="star-pill">${KP.goldStarSVG(22)}<span>${starCount()}</span></span></div>
      <div class="steps" id="svSteps"></div>
      <div class="ov-body" id="svBody"><div class="ov-inner" id="svInner"></div><div class="copyline">Copyrighted by CVCEC Trường Tiếng Việt Của Em 2026</div></div>
      <div class="ov-foot" id="svFoot"></div>`;
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    $('#svClose').onclick = closeStop;
    try { history.replaceState(null, '', '#tram-' + s.id); } catch (e) { }
    goStep(0);
  }

  function closeStop() {
    Voice.stop();
    const ov = $('#stopView'); if (!ov) return;
    const earned = SV && SV.earned ? SV.i : null;
    ov.remove(); document.body.style.overflow = '';
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
    SV = null;
    if (earned != null) flyStar(earned); else renderMap();
  }

  function renderSteps() {
    $('#svSteps').innerHTML = STEPS.map((st, k) =>
      `<button type="button" data-k="${k}" class="${k === SV.cur ? 'cur' : ''} ${k < SV.max || SV.already ? 'ok' : ''}" ${k > SV.max ? 'disabled' : ''} aria-label="${st.t}"><span class="emo">${st.i}</span><span class="t">${st.t}</span></button>`).join('');
    $$('#svSteps button').forEach(b => b.onclick = () => { const k = +b.dataset.k; if (k <= SV.max) goStep(k); });
  }

  function setFoot(html) { $('#svFoot').innerHTML = html; }
  function stepOk() {
    if (!SV) return;
    SV.ok[SV.cur] = true;
    const b = $('#svNext'); if (b) { b.disabled = false; b.classList.add('ready'); }
    const h = $('#svHint'); if (h) h.remove();
  }
  function nextFoot(label, hint) {
    const ready = SV.ok[SV.cur] || SV.already;
    setFoot(`${hint && !ready ? `<span id="svHint" class="hint" style="margin:0;flex:1;text-align:left;font-size:14px">${hint}</span>` : ''}<button class="btn" id="svNext" ${ready ? '' : 'disabled'}>${label || 'Tiếp tục'} <span class="emo">▶</span></button>`);
    $('#svNext').onclick = () => { if (!SV.ok[SV.cur] && !SV.already) return; goStep(SV.cur + 1); };
  }

  function goStep(k) {
    Voice.stop();
    SV.cur = k; SV.max = Math.max(SV.max, k);
    renderSteps();
    const box = $('#svInner'), s = SV.s;
    $('#svBody').scrollTop = 0;
    box.innerHTML = '';
    ({ video: stepVideo, keys: stepKeys, cards: stepCards, game: stepGame, food: stepFood, quiz: stepQuiz, star: stepStar })[STEPS[k].k](box, s);
  }
  KP._dbg = { goStep: k => goStep(k), sv: () => SV, renderMap: () => renderMap() };

  /* --- Bước 1: Phim giới thiệu ---
     Có file video MP4 (js/video-manifest.js) thì phát video; chưa có thì chiếu
     phim hoạt hình: các cảnh minh hoạ + lời Trâu Con + phụ đề, cuối phim là
     các từ khoá cần nhớ. */
  function stepVideo(box, s) {
    box.innerHTML = `<div class="step-h"><h2>🎬 Phim: ${esc(s.name)}</h2></div>`;
    const vf = window.VIDEO_FILES && window.VIDEO_FILES[s.id];
    if (vf) {
      /* Video MP4 (phim Trâu Con 3D). Phim chỉ có hình và phụ đề; Trâu Con đọc từng câu
         đúng lúc phụ đề hiện ra (giọng Elio nếu đã có, chưa có thì giọng máy).
         Nếu đọc chưa xong mà phim đã tới câu sau, phim tạm chờ đọc xong rồi chạy tiếp. */
      const src = typeof vf === 'string' ? vf : vf.src, cues = (typeof vf === 'object' && vf.cues) || [];
      const v = document.createElement('video');
      v.className = 'vfile'; v.controls = true; v.playsInline = true; v.muted = true; v.preload = 'auto'; v.src = src;
      if (vf.poster) v.poster = vf.poster;
      v.setAttribute('playsinline', '');
      box.appendChild(v);
      const wait = document.createElement('div'); wait.className = 'vwait hidden'; wait.textContent = '🗣️ Trâu Con đang đọc, phim chờ một chút nhé…';
      box.appendChild(wait);
      box.appendChild(KP.enBtn(s.en.story));
      let k = 0, speaking = -1, hold = false, selfStop = false, extPause = false, holdResume = false, raf = 0;
      const resync = () => {
        const t = v.currentTime; let i = -1;
        cues.forEach((c, n) => { if (c.t <= t + 0.05) i = n; });
        k = (i >= 0 && t < cues[i].t + cues[i].d - 0.3) ? i : i + 1;
      };
      const sayCue = i => {
        speaking = i; selfStop = true;
        Voice.say(cues[i].say || cues[i].sub, {
          onend: () => { speaking = -1; if (hold) { hold = false; wait.classList.add('hidden'); holdResume = true; const pr = v.play(); if (pr && pr.catch) pr.catch(() => { }); } },
          onstop: () => { if (selfStop) return; speaking = -1; hold = false; wait.classList.add('hidden'); if (!v.paused) { extPause = true; v.pause(); } }
        });
        selfStop = false;
      };
      const tick = () => {
        if (!v.isConnected) { cancelAnimationFrame(raf); return; }
        raf = requestAnimationFrame(tick);
        if (!cues.length || !state.sound || v.paused || k >= cues.length) return;
        const t = v.currentTime;
        if (t < cues[k].t) return;
        if (speaking >= 0) { hold = true; extPause = true; v.pause(); wait.classList.remove('hidden'); return; }
        sayCue(k++);
      };
      v.addEventListener('play', () => { if (holdResume) { holdResume = false; return; } resync(); });
      v.addEventListener('pause', () => { if (hold || extPause) { extPause = false; return; } selfStop = true; Voice.stop(); selfStop = false; speaking = -1; });
      v.addEventListener('seeked', () => { if (v.paused) return; selfStop = true; Voice.stop(); selfStop = false; speaking = -1; hold = false; wait.classList.add('hidden'); resync(); });
      v.addEventListener('ended', () => { stepOk(); });
      raf = requestAnimationFrame(tick);
      const pr = v.play(); if (pr && pr.catch) pr.catch(() => { });
      nextFoot('Ghi nhớ', 'Xem hết phim để đi tiếp nhé!');
      setTimeout(() => { if (SV && SV.s === s) stepOk(); }, 40000);
      return;
    }
    const lines = [{ parts: [s.travel.text], scene: 'travel', sub: s.travel.text }]
      .concat(KP.splitSentences(s.story).map(t => ({ parts: [t], scene: 'post', sub: t })))
      .concat([{ parts: [PH.recap].concat(s.keys.map(k => k.vi)), scene: 'keys', sub: PH.recap }]);
    const pl = document.createElement('div'); pl.className = 'vplayer';
    pl.innerHTML = `<div class="vstage"><div class="vscene"></div>${KP.img.mascot ? `<img class="vmascot" src="${KP.img.mascot}" alt="">` : ''}
      <button class="vbig hidden" type="button" aria-label="Xem lại">↻</button></div>
      <div class="vsub" aria-live="polite"></div>
      <div class="vctrl"><button type="button" class="vbtn" data-a="prev" aria-label="Cảnh trước">⏮</button><button type="button" class="vbtn main" data-a="play" aria-label="Phát / tạm dừng">⏸</button><button type="button" class="vbtn" data-a="next" aria-label="Cảnh sau">⏭</button>
      <div class="vdots">${lines.map(() => '<i></i>').join('')}</div></div>`;
    box.appendChild(pl);
    box.appendChild(KP.enBtn(s.en.story));
    const scene = $('.vscene', pl), sub = $('.vsub', pl), big = $('.vbig', pl), playB = $('[data-a="play"]', pl);
    let idx = 0, playing = false, timer = null, shown = -1, selfStop = false;
    const draw = i => {
      const L = lines[i];
      if (shown !== i) {
        if (L.scene === 'travel') {
          scene.innerHTML = `<div class="travel-road ${s.leg === 'sea' ? 'sea' : ''}" style="height:100%;margin:0;border:0;border-radius:0"><span class="cloud" style="left:20%;top:8%">☁️</span><span class="cloud" style="left:58%;top:4%;animation-delay:-4s">☁️</span><div class="path"></div><span class="veh emo">${s.travel.icon}</span>${KP.icon(s.icon, 'dest')}</div>`;
        } else if (L.scene === 'post') {
          scene.innerHTML = `<div class="kb kb${i % 3}">${KP.sceneSVG(s)}</div><div class="vplace">📍 ${esc(s.name)}</div>`;
        } else {
          scene.innerHTML = `<div class="board"><b>Các bạn hãy nhớ nhé!</b><ol>${s.keys.map(k => `<li>${KP.icon(k.i)}<span>${esc(k.vi)}</span></li>`).join('')}</ol></div>`;
        }
        shown = i;
      }
      sub.textContent = L.sub;
      $$('.vdots i', pl).forEach((d, k) => { d.className = k < i ? 'ok' : k === i ? 'cur' : ''; });
    };
    const after = () => { if (!playing) return; if (idx < lines.length - 1) { idx++; run(); } else finish(); };
    const run = () => {
      clearTimeout(timer); draw(idx); big.classList.add('hidden');
      const L = lines[idx];
      if (!state.sound) { timer = setTimeout(after, 1400 + L.parts.join(' ').length * 55); return; }
      selfStop = true;
      Voice.say(L.parts, {
        onstop: () => { if (!selfStop && playing) pause(true); },
        onpart: p => { if (L.scene === 'keys') { $$('.board li', pl).forEach((li, k) => li.classList.toggle('on', k === p - 1)); sub.textContent = p === 0 ? PH.recap : s.keys[p - 1].vi; } },
        onend: () => { timer = setTimeout(after, 500); }
      });
      selfStop = false;
    };
    const finish = () => { playing = false; playB.textContent = '▶'; big.classList.remove('hidden'); stepOk(); $$('.vdots i', pl).forEach(d => d.className = 'ok'); };
    const play = () => { playing = true; playB.textContent = '⏸'; run(); };
    const pause = quiet => { playing = false; playB.textContent = '▶'; clearTimeout(timer); if (!quiet) { selfStop = true; Voice.stop(); selfStop = false; } };
    pl.querySelector('.vctrl').onclick = e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const act = a.dataset.a;
      if (act === 'play') { if (playing) pause(); else { if (!big.classList.contains('hidden')) idx = 0; play(); } }
      else if (act === 'prev') { idx = Math.max(0, idx - 1); playing ? run() : draw(idx); }
      else { if (idx < lines.length - 1) { idx++; playing ? run() : draw(idx); } else finish(); }
    };
    big.onclick = () => { idx = 0; play(); };
    nextFoot('Ghi nhớ', 'Xem hết phim để đi tiếp nhé!');
    play();
  }

  /* --- Bước 2: Ghi nhớ (từ khoá chính, câu đố sẽ hỏi lại) --- */
  function stepKeys(box, s) {
    box.innerHTML = `<div class="step-h"><h2>🔑 Ghi nhớ</h2></div>`;
    box.appendChild(hintLine(PH.keysHint));
    const list = document.createElement('div'); list.className = 'keys';
    box.appendChild(list);
    const heard = new Set();
    s.keys.forEach((k, n) => {
      const c = document.createElement('div'); c.className = 'keycard'; c.tabIndex = 0; c.setAttribute('role', 'button');
      c.innerHTML = `<div class="kic">${KP.icon(k.i)}</div><div class="ktx"><b>${esc(k.vi)}</b></div>`;
      c.querySelector('.ktx').appendChild(KP.enBtn(k.en, { inline: true }));
      const hear = () => { Snd.pop(); Voice.say(k.vi); c.classList.add('heard'); heard.add(n); if (heard.size === s.keys.length) stepOk(); };
      c.onclick = e => { if (e.target.closest('.en-wrap')) return; hear(); };
      c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hear(); } };
      list.appendChild(c);
    });
    const all = document.createElement('button'); all.className = 'btn ghost sm'; all.type = 'button'; all.innerHTML = '🔊 Nghe tất cả';
    all.onclick = () => {
      const cards = $$('.keycard', list);
      Voice.say(s.keys.map(k => k.vi), { onpart: p => { cards.forEach((c, n) => c.classList.toggle('on', n === p)); cards[p].classList.add('heard'); heard.add(p); }, onend: () => { cards.forEach(c => c.classList.remove('on')); if (heard.size === s.keys.length) stepOk(); } });
    };
    const row = document.createElement('div'); row.className = 'row'; row.style.justifyContent = 'center'; row.appendChild(all); box.appendChild(row);
    nextFoot('Thẻ từ', 'Nghe hết các thẻ ghi nhớ nhé!');
    Voice.say([PH.keysHint].concat(s.keys.map(k => k.vi)), { onpart: p => { const cards = $$('.keycard', list); cards.forEach((c, n) => c.classList.toggle('on', n === p - 1)); if (p > 0) { cards[p - 1].classList.add('heard'); heard.add(p - 1); } }, onend: () => { $$('.keycard', list).forEach(c => c.classList.remove('on')); if (heard.size === s.keys.length) stepOk(); } });
  }

  /* --- Bước 3: Thẻ từ (flashcards) --- */
  function stepCards(box, s) {
    box.innerHTML = `<div class="step-h"><h2>🃏 Thẻ từ</h2></div>`;
    box.appendChild(hintLine(PH.cardsHint));
    const grid = document.createElement('div'); grid.className = 'word-grid'; box.appendChild(grid);
    const seen = new Set();
    s.words.forEach((w, k) => {
      const c = document.createElement('div'); c.className = 'flash'; c.tabIndex = 0; c.setAttribute('role', 'button'); c.setAttribute('aria-label', w.w);
      c.innerHTML = `<div class="fi"><div class="ff">${KP.icon(w.i)}<b>${esc(w.w)}</b><small>Chạm để lật</small></div>
        <div class="fb"><b>${esc(w.w)}</b><p>${esc(w.ex)}</p><div class="fen" lang="en"><span>EN</span>${esc(w.en)}</div></div></div>`;
      const fen = c.querySelector('.fen');
      fen.onclick = e => { e.stopPropagation(); Voice.say(w.en, { lang: 'en' }); };
      const flip = () => {
        const toBack = !c.classList.contains('flipped');
        c.classList.toggle('flipped', toBack);
        Snd.pop(); Voice.say(toBack ? [w.w, w.ex] : [w.w]);
        seen.add(k); if (seen.size === s.words.length) stepOk();
      };
      c.onclick = flip;
      c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } };
      grid.appendChild(c);
    });
    nextFoot('Chơi trò chơi', 'Lật đủ các thẻ từ nhé!');
    Voice.say(PH.cardsHint);
  }

  /* --- Bước 4: Trò chơi --- */
  function stepGame(box, s) {
    const g = s.game;
    box.innerHTML = `<div class="step-h"><h2>🎮 ${esc(g.title)}</h2></div>`;
    box.appendChild(hintLine(g.intro));
    box.appendChild(KP.enBtn(s.en.game));
    const root = document.createElement('div'); root.id = 'gameRoot'; box.appendChild(root);
    const api = {
      say: (parts, opts) => Voice.say(parts, opts), speak: (parts, k, cb) => Voice.say(parts, { onend: cb }), stop: () => Voice.stop(),
      sfx: Snd, shuffle, rand, icon: KP.icon, esc, toast, PH,
      done() {
        if (!SV || SV.s !== s) return;
        Snd.star();
        const d = document.createElement('div'); d.className = 'g-done';
        d.innerHTML = `<span class="emo">🎉</span><b>${esc(g.doneMsg || 'Hoàn thành trò chơi!')}</b>`;
        root.appendChild(d); stepOk(); setTimeout(() => d.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
        Voice.say(g.doneMsg || pick(PH.praise));
      },
      alive: () => !!(SV && SV.s === s && SV.cur === 3 && document.body.contains(root))
    };
    const fn = KP.GAMES && KP.GAMES[g.type];
    nextFoot('Ăn gì, có gì', 'Hoàn thành trò chơi để đi tiếp nhé!');
    if (fn) fn(root, g, api, s); else { root.innerHTML = '<p>Trò chơi đang được chuẩn bị.</p>'; stepOk(); }
  }

  /* --- Bước 5: Ăn gì, có gì --- */
  function stepFood(box, s) {
    box.innerHTML = `<div class="step-h"><h2>🍜 Ăn gì, có gì ở ${esc(s.mapName || s.name)}?</h2></div>
      <div class="food"><div class="card fcard"><div class="big">${KP.icon(s.food.i)}</div><h3>${esc(s.food.title)}</h3><p>${esc(s.food.text)}</p><div class="crow"></div></div>
      <div class="card flip" id="factCard" role="button" tabindex="0"><div class="q emo">💡</div><h3>Bạn có biết?</h3><p style="text-align:center">Chạm vào đây để mở bí mật nhé!</p></div></div>`;
    const crow = $('.fcard .crow', box);
    crow.appendChild(KP.speakBtn([s.food.title, s.food.text]));
    crow.appendChild(KP.enBtn(s.en.food, { inline: true }));
    const open = () => {
      const f = $('#factCard'); if (f.classList.contains('open')) return;
      f.classList.add('open'); f.innerHTML = `<div class="q emo">💡</div><h3>Bạn có biết?</h3><p>${esc(s.fact)}</p><div class="crow"></div>`;
      const r = $('.crow', f); r.appendChild(KP.speakBtn(s.fact)); r.appendChild(KP.enBtn(s.en.fact, { inline: true }));
      Snd.ok(); Voice.say(s.fact); stepOk();
    };
    $('#factCard').onclick = e => { if (e.target.closest('.crow')) return; open(); };
    $('#factCard').onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') open(); };
    nextFoot('Đố vui', 'Mở thẻ "Bạn có biết?" nhé!');
    Voice.say([s.food.title, s.food.text, PH.factHint]);
  }

  /* --- Bước 6: Đố vui (có gợi ý và giải thích) --- */
  function stepQuiz(box, s) {
    const qs = s.quiz; let qi = 0; const res = [];
    const draw = () => {
      const q = qs[qi], key = s.keys[q.k];
      const order = shuffle(q.o.map((t, k) => ({ t, k })));
      box.innerHTML = `<div class="step-h"><h2>❓ Đố vui</h2></div>
        <div class="qprog">${qs.map((_, k) => `<i class="${res[k] === true ? 'ok' : res[k] === false ? 'no' : k === qi ? 'cur' : ''}"></i>`).join('')}</div>
        <div class="card"><div class="qhead"><div class="quiz-q">Câu ${qi + 1}: ${esc(q.q)}</div></div>
        <div class="qtools"></div>
        <div class="qhint hidden"></div>
        <div class="opts">${order.map((o, n) => `<button class="opt" data-k="${o.k}"><span class="k">${'ABC'[n]}</span>${esc(o.t)}</button>`).join('')}</div>
        <div class="qwhy hidden"></div></div>`;
      $('.qhead', box).appendChild(KP.speakBtn(q.q));
      const tools = $('.qtools', box);
      const listen = document.createElement('button'); listen.type = 'button'; listen.className = 'chipbtn'; listen.innerHTML = '🔊 Nghe đáp án';
      listen.onclick = () => { const btns = $$('.opt', box); Voice.say(order.map(o => o.t), { onpart: p => btns.forEach((b, n) => b.classList.toggle('reading', n === p)), onend: () => btns.forEach(b => b.classList.remove('reading')) }); };
      const hintB = document.createElement('button'); hintB.type = 'button'; hintB.className = 'chipbtn'; hintB.innerHTML = '💡 Gợi ý';
      hintB.onclick = () => { const h = $('.qhint', box); h.classList.remove('hidden'); h.innerHTML = `${KP.icon(key.i)}<span><b>Ghi nhớ:</b> ${esc(key.vi)}</span>`; Voice.say([PH.hintIs, key.vi]); };
      tools.appendChild(listen); tools.appendChild(hintB); tools.appendChild(KP.enBtn(q.en, { inline: true }));
      Voice.say(q.q);
      $$('.opt', box).forEach(b => b.onclick = () => {
        const right = +b.dataset.k === q.a;
        $$('.opt', box).forEach(x => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add('right'); });
        if (!right) b.classList.add('wrong');
        res[qi] = right;
        right ? Snd.ok() : Snd.no();
        const p = pick(PH.praise);
        const w = $('.qwhy', box); w.classList.remove('hidden');
        w.className = 'qwhy ' + (right ? 'ok' : 'no');
        w.innerHTML = `<b>${right ? '✅ ' + esc(p) : '💡 ' + esc(PH.answerIs) + ' ' + esc(q.o[q.a])}</b><p>${esc(q.why)}</p><div class="crow"></div>`;
        $('.crow', w).appendChild(KP.speakBtn(q.why));
        const nb = document.createElement('button'); nb.className = 'btn sm'; nb.type = 'button';
        nb.innerHTML = qi < qs.length - 1 ? 'Câu tiếp theo ▶' : 'Xem kết quả ▶';
        nb.onclick = () => { qi++; if (qi < qs.length) draw(); else finish(); };
        $('.crow', w).appendChild(nb);
        Voice.say(right ? [p, q.why] : [PH.answerIs, q.o[q.a], q.why]);
        setTimeout(() => w.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      });
    };
    const finish = () => {
      const n = res.filter(Boolean).length, pass = n >= 2;
      box.innerHTML = `<div class="step-h"><h2>❓ Đố vui</h2></div><div class="card g-done"><span class="emo">${pass ? '🏆' : '💪'}</span>
        <b>Bạn trả lời đúng ${n}/${qs.length} câu!</b><p style="font-size:18px;font-weight:700">${pass ? esc(PH.quizPass) : 'Gần được rồi! Cần đúng ít nhất 2 câu. Mình xem lại phần Ghi nhớ rồi chơi lại nhé!'}</p>
        ${pass ? '' : '<div class="row" style="justify-content:center"><button class="btn ghost sm" id="qKeys">🔑 Xem lại Ghi nhớ</button><button class="btn peach" id="qAgain">↻ Chơi lại</button></div>'}</div>`;
      if (pass) { stepOk(); Snd.star(); Voice.say(PH.quizPass); }
      else {
        Voice.say(PH.quizFail);
        $('#qAgain').onclick = () => { qi = 0; res.length = 0; draw(); };
        $('#qKeys').onclick = () => goStep(1);
      }
    };
    draw();
    nextFoot('Nhận sao vàng', 'Đúng ít nhất 2 câu để nhận sao nhé!');
  }

  /* --- Bước 7: Nhận sao --- */
  function stepStar(box, s) {
    const first = !state.stars[s.id];
    let newBadges = [];
    if (first) {
      const before = earnedBadges().map(b => b.id);
      state.stars[s.id] = Date.now(); save();
      SV.earned = true;
      newBadges = earnedBadges().filter(b => before.indexOf(b.id) < 0);
    }
    const n = starCount();
    const pill = $('#stopView .star-pill span:last-child'); if (pill) pill.textContent = n;
    box.innerHTML = `<div class="reward">${KP.goldStarSVG(180, 'class="bigstar"')}
      <h2>${first ? 'Hoan hô!' : 'Giỏi lắm!'}</h2><p>${first ? `Bạn nhận được ngôi sao vàng thứ ${n}!` : esc(PH.starAgain)}</p>
      <p style="font-size:16px;color:var(--ink-2)">Trạm ${SV.i + 1}: ${esc(s.name)} · ${n}/${N_STOPS} ngôi sao</p>
      <div>${newBadges.map(b => `<span class="badge-new"><span class="emo">${b.icon}</span>Huy hiệu mới: ${esc(b.name)}</span>`).join('')}</div>
      <div class="acts"><button class="btn peach sm" id="pcBtn"><span class="emo">📮</span> Gửi bưu thiếp cho ông bà</button>
      <button class="btn ghost sm" id="passBtn2"><span class="emo">📘</span> Xem hộ chiếu</button></div></div>`;
    Snd.star();
    Voice.say(first ? (newBadges.length ? [PH.starNew, PH.newBadge] : [PH.starNew]) : [PH.starAgain]);
    $('#pcBtn').onclick = () => showPostcard(s);
    $('#passBtn2').onclick = showPassport;
    SV.ok[SV.cur] = true;
    const next = STOPS[SV.i + 1];
    setFoot(`<button class="btn gold" id="svBack"><span class="emo">🗺️</span> ${next && !state.stars[next.id] ? 'Về bản đồ, đi tiếp tới ' + esc(next.name) : 'Về bản đồ'}</button>`);
    $('#svBack').onclick = closeStop;
  }

  /* Sao bay về bản đồ, Trâu Con đi sang trạm tiếp theo */
  function flyStar(i) {
    renderMap({ flyFrom: i });
    const p = mkPos(STOPS[i]);
    centerOn(p[0], p[1], false);
    setTimeout(() => {
      const mk = $(`.mk[data-i="${i}"]`); if (!mk) return renderMap();
      const r = mk.getBoundingClientRect();
      const st = document.createElement('div'); st.className = 'flystar'; st.innerHTML = KP.goldStarSVG(70);
      st.style.left = (window.innerWidth / 2 - 35) + 'px'; st.style.top = (window.innerHeight / 2 - 35) + 'px';
      document.body.appendChild(st);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        st.style.transform = `translate(${r.left + r.width / 2 - window.innerWidth / 2 + 12}px, ${r.top + r.height / 2 - window.innerHeight / 2 - 12}px) scale(.35)`;
        st.style.opacity = '0';
      }));
      Snd.star();
      setTimeout(() => {
        st.remove();
        renderMap();
        const m2 = $(`.mk[data-i="${i}"]`); if (m2) m2.classList.add('justdone');
        const mm = $('#mapMascot');
        if (mm && i + 1 < N_STOPS) {
          const a = mkPos(STOPS[i]), b = mkPos(STOPS[currentIdx()]);
          mm.style.transition = 'none'; mm.style.transform = `translate(${a[0]}px,${a[1]}px)`;
          requestAnimationFrame(() => requestAnimationFrame(() => { mm.style.transition = ''; mm.style.transform = `translate(${b[0]}px,${b[1]}px)`; }));
          setTimeout(() => KP.centerOnCurrent(true), 700);
        }
        if (starCount() === N_STOPS) setTimeout(showFinale, 900);
      }, 1150);
    }, 350);
  }

  /* ---------------- Huy hiệu ---------------- */
  function allBadges() {
    const list = CHANG.map(c => ({ id: 'chang' + c.id, name: 'Chặng ' + c.id + ': ' + c.name, icon: c.badge, color: c.color, stops: STOPS.filter(s => s.chang === c.id).map(s => s.id), desc: 'Hoàn thành chặng ' + c.name }));
    window.SPECIAL_BADGES.forEach(b => list.push(Object.assign({ color: b.id === 'cuc' ? '#F4B89A' : b.id === 'hoc' ? '#B48EAD' : '#5FA8C2' }, b)));
    list.push({ id: 'all', name: 'Nhà thám hiểm nhí', icon: '🏅', color: '#F7C531', stops: STOPS.map(s => s.id), desc: `Đủ ${N_STOPS} ngôi sao vàng` });
    return list;
  }
  function earnedBadges() { return allBadges().filter(b => b.stops.every(id => state.stars[id])); }

  function showBadges() {
    const got = earnedBadges().map(b => b.id);
    const m = modal(`<h2>Huy hiệu của bạn</h2><p>Hoàn thành mỗi chặng, đủ 4 điểm cực, thăm Hoàng Sa và Trường Sa, hay học ở Văn Miếu để nhận huy hiệu nhé!</p>
      <div class="badges">${allBadges().map(b => {
      const n = b.stops.filter(id => state.stars[id]).length;
      return `<div class="badge ${got.indexOf(b.id) >= 0 ? 'got' : 'no'}"><div class="md emo" style="background:${b.color}">${b.icon}</div><b>${esc(b.name)}</b><small>${esc(b.desc)} · ${n}/${b.stops.length}</small></div>`;
    }).join('')}</div>
      <div class="row" style="justify-content:center"><button class="btn gold" id="certBtn">🏅 Bằng khen Nhà thám hiểm nhí</button></div>`, { wide: true });
    $('#certBtn', m).onclick = () => { m.close(); showCertificate(); };
  }

  function fmtDate(t) { const d = new Date(t); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; }
  function showPassport() {
    modal(`<h2>📘 Hộ chiếu Trâu Con</h2><p>Mỗi trạm hoàn thành được đóng một con dấu và ghi lại những chữ bạn đã học.</p>
      <div class="pass-grid">${STOPS.map((s, i) => state.stars[s.id]
      ? `<div class="stamp got" style="border-color:${CHANG[s.chang - 1].color}"><div class="ic">${KP.icon(s.icon)}</div><b>${i + 1}. ${esc(s.name)}</b><small>⭐ ${fmtDate(state.stars[s.id])}</small><div class="w">${s.words.map(w => esc(w.w)).join(' · ')}</div></div>`
      : `<div class="stamp no"><div class="ic">${KP.icon(s.icon)}</div><b>${i + 1}. ${esc(s.name)}</b><small>Chưa tới</small></div>`).join('')}</div>`, { wide: true });
  }

  /* ---------------- Bằng khen ---------------- */
  function miniMapStars() {
    let s = `<svg viewBox="0 0 ${M.W} ${M.H}" xmlns="http://www.w3.org/2000/svg">${KP.mapBase({ simple: true })}`;
    STOPS.forEach(st => { const [x, y] = mkPos(st); s += `<polygon points="${KP.starPts(x, y, 15)}" fill="${state.stars[st.id] ? '#F7C531' : '#D8D1C3'}" stroke="#C98400" stroke-width="2"/>`; });
    return s + '</svg>';
  }
  function certHTML(name) {
    const today = fmtDate(Date.now());
    return `<div class="cert">${KP.img.logo ? `<img class="logo" src="${KP.img.logo}" alt="Trường Tiếng Việt Của Em">` : '<b>Trường Tiếng Việt Của Em</b>'}
      <h1>BẰNG KHEN</h1><p style="font-size:20px;font-weight:900;color:var(--green-d);margin:0">NHÀ THÁM HIỂM NHÍ VIỆT NAM</p>
      <p>Trao tặng bạn</p><div class="nm">${esc(name || '……………………')}</div>
      <div style="display:flex;gap:16px;align-items:center;justify-content:center;flex-wrap:wrap">
      <div class="mini">${miniMapStars()}</div>
      <div style="max-width:420px;text-align:left"><p>Đã cùng Trâu Con đi trọn hành trình <b>${N_STOPS} trạm</b> dọc dải đất chữ S, từ <b>Cột cờ Lũng Cú</b> tới <b>Đất Mũi Cà Mau</b>, ghé thăm <b>quần đảo Hoàng Sa</b> và <b>quần đảo Trường Sa</b>, thu thập đủ <b>${N_STOPS} ngôi sao vàng</b>.</p>
      <p style="font-size:15px;color:var(--ink-2)">Ngày ${today}</p></div></div>
      <div class="sig"><span>Trường Tiếng Việt Của Em · CVCEC</span>${KP.img.mascot ? `<img src="${KP.img.mascot}" alt="Trâu Con">` : ''}</div>
      <div class="copyline">Copyrighted by CVCEC Trường Tiếng Việt Của Em 2026</div></div>`;
  }
  function showCertificate() {
    const n = starCount();
    if (n < N_STOPS) {
      modal(`<div class="welcome"><div class="emo" style="font-size:60px">🏅</div><h2 style="margin:6px 0">Bằng khen Nhà thám hiểm nhí</h2>
        <p>Bạn đã có <b>${n}/${N_STOPS}</b> ngôi sao vàng. Thu thập đủ ${N_STOPS} ngôi sao để nhận bằng khen nhé!</p>
        <div style="max-width:320px;margin:0 auto">${miniMapStars()}</div></div>`);
      return;
    }
    const m = modal(`<h2>🏅 Bằng khen của bạn</h2><div class="field"><label for="certName">Tên ghi trên bằng khen</label><input id="certName" value="${esc(state.name)}" maxlength="40" placeholder="Ví dụ: Bảo An"></div>
      <div id="certPrev">${certHTML(state.name)}</div><div class="row" style="justify-content:center"><button class="btn gold" id="printBtn">🖨️ In / Lưu PDF</button></div>`, { wide: true, focus: false });
    $('#certName', m).oninput = e => { state.name = e.target.value.trim(); save(); $('#certPrev', m).innerHTML = certHTML(state.name); };
    $('#printBtn', m).onclick = () => { $('#printArea').innerHTML = certHTML(state.name); window.print(); };
  }
  function showFinale() {
    const m = modal(`<div class="welcome">${KP.img.mascot ? `<img src="${KP.img.mascot}" alt="Trâu Con">` : ''}<div class="emo" style="font-size:44px">🎉⭐🎉</div>
      <h2 style="margin:6px 0">Hoan hô${state.name ? ' ' + esc(state.name) : ''}!</h2><p>Bạn đã đi trọn hành trình từ Lũng Cú tới Cà Mau và thu thập đủ ${N_STOPS} ngôi sao vàng. Cả dải đất chữ S và hai quần đảo Hoàng Sa, Trường Sa đều đã sáng rực!</p>
      <button class="btn gold" id="finCert">🏅 Nhận bằng khen</button></div>`);
    Snd.star(); Voice.say(PH.finale);
    $('#finCert', m).onclick = () => { m.close(); showCertificate(); };
  }

  /* ---------------- Bưu thiếp gửi ông bà ---------------- */
  function wrapText(ctx, text, x, y, maxW, lh) {
    const words = text.split(' '); let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; } else line = t;
    }
    if (line) ctx.fillText(line, x, y);
    return y + lh;
  }
  function drawPostcard(s, plain) {
    const c = document.createElement('canvas'); c.width = 1200; c.height = 800;
    const x = c.getContext('2d'), ch = CHANG[s.chang - 1];
    const F = '"Nunito", "Segoe UI", sans-serif', E = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    x.fillStyle = '#F4F0EA'; x.fillRect(0, 0, 1200, 800);
    x.fillStyle = ch.color; x.fillRect(0, 0, 1200, 120);
    x.fillStyle = '#fff'; x.font = `900 52px ${F}`; x.textBaseline = 'middle'; x.fillText('Bưu thiếp từ ' + s.name, 40, 62);
    x.fillStyle = '#FFFDF8'; x.beginPath(); x.arc(250, 400, 190, 0, Math.PI * 2); x.fill();
    x.lineWidth = 10; x.strokeStyle = ch.color; x.stroke();
    /* Biểu tượng vẽ riêng (SVG) thì vẽ bằng ảnh; nếu ảnh chưa sẵn sàng thì dùng ngôi sao */
    let usedImg = false;
    const pic = (ic, cx, cy, size) => {
      const im = !plain && KP.iconImg(ic);
      if (im) { if (im.complete && im.naturalWidth) { x.drawImage(im, cx - size / 2, cy - size / 2, size, size); usedImg = true; } else x.fillText('⭐', cx, cy + size * .05); }
      else if (KP.isSvgIcon(ic)) x.fillText('⭐', cx, cy + size * .05);
      else x.fillText(ic, cx, cy + size * .05);
    };
    x.textAlign = 'center';
    x.font = `200px ${E}`; pic(s.icon, 250, 400, 250);
    x.font = `70px ${E}`; pic(s.food.i, 120, 585, 90); pic(s.words[1].i, 380, 585, 90);
    x.save(); x.translate(1080, 210); x.rotate(.08);
    x.fillStyle = '#fff'; x.fillRect(-80, -70, 160, 140); x.setLineDash([8, 6]); x.strokeStyle = '#C68B59'; x.lineWidth = 4; x.strokeRect(-80, -70, 160, 140);
    x.setLineDash([]); x.fillStyle = '#F7C531'; x.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 52; x.lineTo(r * Math.cos(a), r * Math.sin(a) - 4); }
    x.closePath(); x.fill(); x.strokeStyle = '#C98400'; x.lineWidth = 3; x.stroke();
    x.fillStyle = '#3A3B3C'; x.font = `800 18px ${F}`; x.fillText('Việt Nam', 0, 56); x.restore();
    x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillStyle = '#3A3B3C';
    x.font = `900 54px ${F}`; x.fillText('Con chào ông bà!', 480, 250);
    x.font = `700 34px ${F}`;
    let y = wrapText(x, `Hôm nay con cùng Trâu Con đến ${s.name} (${s.place}).`, 480, 320, 640, 46);
    y = wrapText(x, `Con đã học được: ${s.words.map(w => w.w).join(', ')}.`, 480, y + 10, 640, 46);
    x.font = `800 34px ${F}`; x.fillStyle = ch.color === '#DDAA55' ? '#9A6A1A' : ch.color;
    x.fillText(`Con nhớ ông bà nhiều!${state.name ? ' – ' + state.name : ''}`, 480, y + 30);
    if (KP.img.mascotLocal && KP._mascotImg) { try { x.drawImage(KP._mascotImg, 1000, 560, 168, 194); } catch (e) { } }
    x.fillStyle = '#9A9384'; x.font = `700 22px ${F}`; x.fillText('Trường Tiếng Việt Của Em · Khám phá Việt Nam · vietnam.cvcec.org', 40, 770);
    if (usedImg) { try { x.getImageData(0, 0, 1, 1); } catch (e) { return drawPostcard(s, true); } }
    return c;
  }
  function showPostcard(s) {
    const m = modal(`<h2>📮 Gửi bưu thiếp cho ông bà</h2>
      <p>Đây là bưu thiếp từ <b>${esc(s.name)}</b>. Bạn có thể ghi âm một lời chào bằng tiếng Việt, rồi nhờ bố mẹ gửi cho ông bà qua Zalo, Messenger…</p>
      <div class="field"><label for="pcName">Tên của bạn</label><input id="pcName" value="${esc(state.name)}" maxlength="40" placeholder="Ví dụ: Bảo An"></div>
      <div id="pcWrap"></div>
      <div class="card" style="margin-top:12px"><b>🎙️ Ghi âm lời chào</b><p style="margin:4px 0 10px;font-size:15px">Gợi ý: "Con chào ông bà! Hôm nay con đến ${esc(s.name)}."</p>
      <div class="row" style="margin:0;align-items:center"><button class="btn peach sm" id="recBtn">⏺ Bắt đầu ghi âm</button><audio id="recAudio" controls class="hidden"></audio></div>
      <p id="recNote" style="font-size:13px;color:var(--ink-2);margin:8px 0 0">Ghi âm chỉ nằm trên máy này, không được tải lên đâu cả. Bố mẹ tự chọn gửi cho ai.</p></div>
      <div class="row" style="justify-content:center"><button class="btn" id="shareBtn">📤 Gửi bưu thiếp</button><button class="btn ghost sm" id="dlBtn">⬇️ Tải về máy</button></div>`, { focus: false });
    let canvas, audioBlob = null, rec = null;
    const redraw = () => { canvas = drawPostcard(s); canvas.className = 'pc-canvas'; const w = $('#pcWrap', m); w.innerHTML = ''; w.appendChild(canvas); };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(redraw);
    $('#pcName', m).oninput = e => { state.name = e.target.value.trim(); save(); redraw(); };
    const recBtn = $('#recBtn', m);
    const recFail = msg => { $('#recNote', m).innerHTML = '⚠️ ' + esc(msg); toast(msg, 4000); };
    recBtn.onclick = async () => {
      if (rec && rec.state === 'recording') { rec.stop(); return; }
      if (!window.isSecureContext) return recFail('Ghi âm chỉ chạy trên trang có https (ví dụ https://vietnam.cvcec.org).');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) return recFail('Trình duyệt hoặc khung xem này chưa cho phép ghi âm. Hãy mở trang vietnam.cvcec.org trên Chrome hoặc Safari.');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks = []; rec = new MediaRecorder(stream);
        rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
        rec.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          audioBlob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
          const a = $('#recAudio', m); a.src = URL.createObjectURL(audioBlob); a.classList.remove('hidden');
          recBtn.textContent = '⏺ Ghi âm lại';
        };
        rec.start(); recBtn.textContent = '⏹ Dừng ghi âm';
        setTimeout(() => { if (rec && rec.state === 'recording') rec.stop(); }, 20000);
      } catch (e) { recFail('Chưa mở được micro. Bố mẹ hãy bấm "Cho phép" (Allow) khi trình duyệt hỏi dùng micro nhé.'); }
    };
    const files = () => new Promise(res => canvas.toBlob(b => {
      const out = [new File([b], `buu-thiep-${s.id}.png`, { type: 'image/png' })];
      if (audioBlob) { const ext = /mp4|aac|m4a/.test(audioBlob.type) ? '.m4a' : /ogg/.test(audioBlob.type) ? '.ogg' : '.webm'; out.push(new File([audioBlob], `loi-chao-${s.id}${ext}`, { type: audioBlob.type })); }
      res(out);
    }, 'image/png'));
    const download = fs => fs.forEach(f => { const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 100); });
    $('#shareBtn', m).onclick = async () => {
      const fs = await files();
      const data = { files: fs, title: 'Bưu thiếp từ ' + s.name, text: 'Con chào ông bà! Bưu thiếp từ ' + s.name + ' – Trường Tiếng Việt Của Em' };
      try {
        if (navigator.canShare && navigator.canShare({ files: fs })) return await navigator.share(data);
        if (navigator.canShare && navigator.canShare({ files: [fs[0]] })) { await navigator.share(Object.assign(data, { files: [fs[0]] })); if (fs[1]) toast('Lời chào ghi âm chưa gửi kèm được, hãy bấm "Tải về máy".'); return; }
      } catch (e) { if (e && e.name === 'AbortError') return; }
      download(fs); toast('Đã tải bưu thiếp về máy. Bố mẹ có thể gửi qua Zalo, Messenger…');
    };
    $('#dlBtn', m).onclick = async () => download(await files());
  }

  /* ---------------- Cài đặt ---------------- */
  function voiceStatus() {
    const all = KP.allSpeech ? KP.allSpeech() : [];
    const have = all.filter(x => window.AUDIO_FILES && window.AUDIO_FILES[x.key]).length;
    if (have) return `🗣️ Giọng Trâu Con (Elio) đã có ${have}/${all.length} câu. Những câu chưa có sẽ đọc bằng giọng máy của thiết bị.`;
    return Voice.hasVi ? '🗣️ Đang dùng giọng đọc máy tiếng Việt của thiết bị (tạm thời, sẽ thay bằng giọng Trâu Con).' : '🗣️ Thiết bị này chưa có giọng đọc tiếng Việt, nên có thể không nghe được lời đọc. Chữ vẫn hiện đầy đủ trên màn hình.';
  }
  function showSettings() {
    const m = modal(`<h2>⚙️ Cài đặt</h2>
      <div class="field"><label for="setName">Tên của bé (ghi trên bưu thiếp và bằng khen)</label><input id="setName" value="${esc(state.name)}" maxlength="40"></div>
      <div class="row"><button class="btn ${state.sound ? '' : 'ghost'} sm" id="sndBtn">${state.sound ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt'}</button><button class="btn ghost sm" id="testVoice">▶ Nghe thử giọng</button></div>
      <p style="font-size:15px;color:var(--ink-2)">${voiceStatus()}</p>
      <p id="voiceCheck" style="font-size:14px;color:var(--ink-2);margin-top:-4px">${Voice.log.length ? 'Lần đọc gần đây: ' + Voice.log.slice(-5).map(x => `${x.n} ký tự ${(x.ms / 1000).toFixed(1)} giây (${x.by})`).join(' · ') : ''}</p>
      <h3 style="margin:16px 0 4px">Dành cho bố mẹ / thầy cô</h3>
      <div class="row"><button class="btn ghost sm" id="unlockAll">🔓 Mở khoá tất cả trạm</button><button class="btn ghost sm" id="resetAll">↺ Bắt đầu lại hành trình</button></div>
      <p style="font-size:14px;color:var(--ink-2)">Tiến trình và sao vàng được lưu trên trình duyệt của máy này. Đổi máy thì bố mẹ dùng nút "Mở khoá" để bé học tiếp.</p>
      <p><a href="https://truongtiengvietcuaem.cvcec.org" style="font-weight:800;color:var(--green-d)">← Về Trường Tiếng Việt Của Em</a></p>`);
    $('#setName', m).oninput = e => { state.name = e.target.value.trim(); save(); };
    $('#sndBtn', m).onclick = e => { state.sound = !state.sound; save(); if (!state.sound) Voice.stop(); e.target.textContent = state.sound ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt'; e.target.classList.toggle('ghost', !state.sound); };
    $('#testVoice', m).onclick = () => {
      const out = $('#voiceCheck', m), v = Voice.vi;
      Voice.stat = { ok: 0, fail: 0, last: '' };
      out.textContent = '… Đang thử đọc' + (v ? ' bằng giọng ' + v.name : '');
      Voice.say(PH.welcome, { onend: () => {
        out.textContent = Voice.stat.ok && !Voice.stat.fail
          ? '✅ Máy đọc được' + (v ? ' (giọng ' + v.name + ')' : '') + '. Nếu vẫn không nghe thấy, hãy kiểm tra âm lượng của máy.'
          : Voice.stat.last === 'nostart'
            ? '⚠️ Bộ đọc giọng của máy đang bị kẹt: máy nhận câu nhưng không đọc. Hãy thoát hẳn trình duyệt (trên Mac bấm ⌘Q) rồi mở lại; nếu vẫn vậy, hãy khởi động lại máy.'
            : '⚠️ Máy chưa đọc được (mã lỗi: ' + (Voice.stat.last || 'không rõ') + '). Hãy mở trang trực tiếp bằng Chrome, Safari hoặc Edge, không mở trong khung xem trước.';
        const lg = Voice.log.slice(-4).map(x => `${x.n} ký tự: ${(x.ms / 1000).toFixed(1)} giây (${x.by})`).join(' · ');
        if (lg) out.textContent += ' [' + lg + ']';
      } });
    };
    $('#unlockAll', m).onclick = () => { m.close(); parentGate(`Mở khoá tất cả ${N_STOPS} trạm? (Sao vàng vẫn phải tự học để nhận.)`, () => { state.manual = N_STOPS - 1; save(); renderMap(); toast('Đã mở khoá tất cả trạm'); }); };
    $('#resetAll', m).onclick = () => { m.close(); parentGate('Xoá toàn bộ sao vàng và bắt đầu lại từ Cột cờ Lũng Cú?', () => { const nm = state.name; Object.assign(state, fresh(), { name: nm, seen: true }); save(); renderMap(); KP.centerOnCurrent(true); toast('Đã bắt đầu lại hành trình'); }); };
  }

  function showWelcome() {
    const m = modal(`<div class="welcome">${KP.img.mascot ? `<img src="${KP.img.mascot}" alt="Trâu Con vẫy tay chào">` : ''}
      <h2 style="margin:6px 0">Chào các bạn! Mình là Trâu Con.</h2>
      <p>Cùng mình đi dọc dải đất hình chữ S qua ${N_STOPS} trạm – từ Cột cờ Lũng Cú ở địa đầu Tổ quốc tới Đất Mũi Cà Mau, ghé thăm cả quần đảo Hoàng Sa và Trường Sa. Mỗi trạm khám phá xong, các bạn nhận được một <b>ngôi sao vàng</b>!</p>
      <div class="field" style="text-align:left"><label for="wName">Tên của bạn là gì? (không bắt buộc)</label><input id="wName" maxlength="40" placeholder="Ví dụ: Bảo An" value="${esc(state.name)}"></div>
      <button class="btn gold" id="wGo">▶ Bắt đầu hành trình</button></div>`, { noX: true });
    $('#wGo', m).onclick = () => {
      state.name = $('#wName', m).value.trim(); state.seen = true; save(); m.close(); Snd.get();
      Voice.say(PH.welcome);
      KP.centerOnCurrent(true);
    };
  }

  /* ---------------- Khởi động ---------------- */
  async function init() {
    Voice.init();
    STOPS.forEach(st => [st.icon].concat(st.words.map(w => w.i)).forEach(ic => KP.iconImg(ic)));
    const [mascot, logo] = await Promise.all([resolveImg('mascot'), resolveImg('logo')]);
    KP.img.mascot = mascot; KP.img.logo = logo;
    KP.img.mascotLocal = mascot === ASSET.mascot[0];
    if (KP.img.mascotLocal) { KP._mascotImg = new Image(); KP._mascotImg.src = mascot; }
    $$('img[data-asset]').forEach(im => { const v = KP.img[im.dataset.asset]; if (v) { im.src = v; im.classList.remove('hidden'); } else im.remove(); });
    renderMap();
    $('#mapScroll').addEventListener('click', onMapClick);
    $('#mapScroll').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.mk')) { e.preventDefault(); onMapClick(e); } });
    $('#zIn').onclick = () => applyZoom(mapZoom * 1.35);
    $('#zOut').onclick = () => applyZoom(mapZoom / 1.35);
    $('#zFit').onclick = () => applyZoom(Math.abs(mapZoom - fitZoom()) < .01 ? 1 : fitZoom());
    $('#zMe').onclick = () => KP.centerOnCurrent(true);
    $('#passBtn').onclick = showPassport;
    $('#badgeBtn').onclick = showBadges;
    $('#setBtn').onclick = showSettings;
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => applyZoom(mapZoom, true), 150); });
    const hm = location.hash.match(/^#tram-([\w-]+)/);
    const hi = hm ? STOPS.findIndex(s => s.id === hm[1]) : -1;
    if (hi >= 0) { if (isUnlocked(hi)) openStop(hi); else lockedInfo(hi); }
    else if (!state.seen) showWelcome();
    else setTimeout(() => KP.centerOnCurrent(false), 50);
  }
  KP.openStop = openStop;
  document.addEventListener('DOMContentLoaded', init);
})();
