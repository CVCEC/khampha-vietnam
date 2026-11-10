/* =========================================================
   KHÁM PHÁ VIỆT NAM – Trò chơi "đặc sản" của các trạm
   Mỗi trò chơi: KP.GAMES[loại](khung, cấu hình, api, trạm)
   Mọi câu Trâu Con nói đều ghép từ KP.PH (js/phrases.js) và chữ trong
   js/stops.js, để công cụ tạo giọng thu âm đủ từng mảnh.
   ========================================================= */
(function () {
  const KP = window.KP = window.KP || {};
  const G = KP.GAMES = {};
  const PH = KP.PH, NUM = PH.num;
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wait = (api, ms, fn) => setTimeout(() => { if (api.alive()) fn(); }, ms);

  /* ---------- CSS riêng cho trò chơi ---------- */
  const css = `
  .rocks{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:14px 12px 18px;background:linear-gradient(#BFE6F5,#7CC3DB 45%,#5FB3D0)}
  .rocks.sandy{background:linear-gradient(#9ED3E6,#CDE9E2 40%,#F1DFB5 40%)}
  .rock{position:relative;height:clamp(110px,22vw,150px);border:0;background:none;padding:0}
  .rock .itm{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);font-size:clamp(36px,7vw,50px)}
  .rock svg{position:absolute;inset:0;width:100%;height:100%;transition:transform .45s cubic-bezier(.3,1.4,.5,1),opacity .45s}
  .rock.up svg{transform:translateY(-46%) scale(.86);opacity:.55;pointer-events:none}
  .rock.found::after{content:'✓';position:absolute;top:4px;right:8px;background:#4E9A3E;color:#fff;border-radius:50%;width:28px;height:28px;font:900 17px/28px Nunito,sans-serif}
  .forks{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px}
  .cavebtn{border:0;background:none;padding:0;position:relative}
  .cavebtn svg{width:100%;height:auto;display:block}
  .cavebtn .sign{position:absolute;left:50%;bottom:8%;transform:translateX(-50%);background:#FFFDF8;border:3px solid #C68B59;border-radius:12px;padding:4px 12px;font:900 clamp(18px,4vw,26px) Nunito,sans-serif;white-space:nowrap}
  .cavebtn.wrong{animation:shake .4s}
  .river-strip{position:relative;height:70px;background:linear-gradient(#7CC3DB,#5FB3D0)}
  .river-strip.sand{background:linear-gradient(#F3C98B,#E9B36E)}
  .river-strip .boat{position:absolute;left:50%;top:6px;font-size:46px;transform:translateX(-50%);transition:transform .9s,opacity .9s}
  .torch{position:relative;width:100%;aspect-ratio:16/10;background:radial-gradient(ellipse at 50% 120%,#6E5D4E,#3A322B 60%,#231E1A);overflow:hidden;touch-action:none;cursor:crosshair}
  .torch .it{position:absolute;transform:translate(-50%,-50%);font-size:clamp(30px,6vw,46px);border:0;background:none;padding:6px;line-height:1}
  .torch .it.found{filter:drop-shadow(0 0 10px #FFE27A)}
  .torch .it.found::after{content:'✓';position:absolute;top:-6px;right:-6px;background:#4E9A3E;color:#fff;border-radius:50%;width:22px;height:22px;font:900 14px/22px Nunito,sans-serif}
  .torch .dark{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--x,50%) var(--y,50%),rgba(0,0,0,0) 0,rgba(0,0,0,0) 62px,rgba(12,9,7,.97) 104px)}
  .lanterns{display:flex;justify-content:space-around;align-items:flex-start;padding:0 6px 16px;background:linear-gradient(#3E4A7A,#7A6A8E 70%,#E8A97E);position:relative;min-height:230px}
  .lanterns::before{content:'';position:absolute;left:0;right:0;top:14px;height:3px;background:#2A2230;border-radius:3px}
  .lantern{border:0;background:none;padding:0;width:15%;position:relative;transition:filter .4s}
  .lantern svg{width:100%;height:auto;display:block}
  .lantern.dim{filter:grayscale(.55) brightness(.6)}
  .lantern.lit{filter:drop-shadow(0 0 14px rgba(255,214,120,.95))}
  .lantern.wrong{animation:shake .4s}
  .stagebox{position:relative;width:100%;aspect-ratio:16/10;overflow:hidden}
  .stagebox .it{position:absolute;transform:translate(-50%,-50%);border:0;background:none;padding:4px;line-height:1;font-size:clamp(34px,7vw,52px);transition:transform 1.4s ease-in,opacity 1.4s}
  .caption{min-height:64px;margin-top:12px;background:#FFFDF8;border:2px solid #E4DCCD;border-radius:16px;padding:10px 14px;font-weight:800;font-size:18px}
  .compass{display:grid;grid-template-columns:1fr 1.3fr 1fr;gap:8px;align-items:center;justify-items:center;padding:14px;background:radial-gradient(circle,#FFF8E6,#F1E4C6)}
  .compass .dir{min-width:96px;min-height:58px;border-radius:16px;border:3px solid #E4DCCD;background:#FFFDF8;font:900 22px Nunito,sans-serif;box-shadow:0 4px 0 #E4DCCD}
  .compass .dir.right{border-color:#4E9A3E;background:#EAF6E4}
  .compass .dir.wrong{border-color:#D9534F;animation:shake .4s}
  .compass svg{width:100%;max-width:220px;height:auto}
  .needle{transition:transform .8s cubic-bezier(.3,1.5,.5,1);transform-origin:100px 100px}
  .boats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px;background:linear-gradient(#FCE6BF,#9ED3E6 35%,#7CC3DB)}
  .ghe{border:0;background:none;padding:0;position:relative}
  .ghe svg{width:100%;height:auto;display:block}
  .ghe .fruit{position:absolute;left:58%;top:2%;font-size:clamp(28px,6vw,40px)}
  .ghe.right{filter:drop-shadow(0 0 10px #4E9A3E)}
  .ghe.wrong{animation:shake .4s}
  .spot{position:absolute;transform:translate(-50%,-50%);width:clamp(46px,9vw,64px);height:clamp(46px,9vw,64px);border-radius:50%;border:3px dashed #fff;background:rgba(255,255,255,.18);padding:0}
  .spot.planted{border:0;background:none}
  .spot svg{width:150%;height:auto;position:absolute;left:-25%;bottom:30%;transform-origin:bottom center;animation:grow .7s cubic-bezier(.3,1.5,.5,1) both}
  @keyframes grow{from{transform:scale(.1)}to{transform:scale(1)}}
  @keyframes pulse2{0%,100%{box-shadow:0 0 0 0 rgba(247,197,49,.9)}50%{box-shadow:0 0 0 14px rgba(247,197,49,0)}}
  .wave-flag{animation:flagwave 1.4s ease-in-out infinite;transform-box:fill-box;transform-origin:left center}
  @keyframes flagwave{0%,100%{transform:skewY(0)}50%{transform:skewY(-5deg) scaleX(.96)}}
  .meaning{display:grid;gap:12px}
  .bigeq{text-align:center;font:900 clamp(26px,6vw,38px) Nunito,sans-serif;color:#9A6A1A;padding:16px;background:#FFF6D8;border:3px solid #F7C531;border-radius:20px;animation:popin .6s both}
  .stepcard{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:200px;padding:16px;background:linear-gradient(#FFFBEF,#F7EDD8);text-align:center}
  .stepcard .big{font-size:76px;line-height:1;animation:popin .5s both}
  .stepcard b{font-size:20px}
  .stepcard .bar{display:flex;gap:6px}.stepcard .bar i{width:22px;height:8px;border-radius:4px;background:#E4DCCD}.stepcard .bar i.on{background:#7FB069}
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- Lời nhắc của Trâu Con ---------- */
  function mkHead(root, api) {
    const h = el('div', 'g-head', '<div class="say"></div>');
    const b = el('button', 'speak-btn', '<span class="emo">🔊</span>'); b.type = 'button'; b.setAttribute('aria-label', 'Nghe lại');
    h.appendChild(b); root.appendChild(h);
    let parts = null;
    b.onclick = () => { if (parts) api.say(parts); };
    return {
      /* text: chữ hiện ra · speak: các mảnh để đọc (false = không đọc) */
      set(text, speak) {
        h.querySelector('.say').textContent = text;
        parts = speak === false ? null : (speak || [text]);
        if (parts) api.say(parts);
      }
    };
  }
  function mkMsg(root) {
    const m = el('p', 'g-msg'); root.appendChild(m);
    return { set(t, ok) { m.textContent = t || ''; m.className = 'g-msg ' + (ok === true ? 'ok' : ok === false ? 'no' : ''); } };
  }
  function optButtons(box, options, onPick, two) {
    box.innerHTML = '';
    box.className = 'g-opts' + (two ? ' two' : '');
    KP.shuffle(options).forEach(o => {
      const b = el('button', 'opt', esc(o)); b.type = 'button'; b.dataset.v = o;
      b.onclick = () => onPick(o, b); box.appendChild(b);
    });
  }
  function spots(n, cols, rows, box) {
    box = box || [6, 94, 10, 90];
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push([c, r]);
    return KP.shuffle(cells).slice(0, n).map(([c, r]) => {
      const cw = (box[1] - box[0]) / cols, rh = (box[3] - box[2]) / rows;
      return [box[0] + cw * (c + .5) + (Math.random() - .5) * cw * .4, box[2] + rh * (r + .5) + (Math.random() - .5) * rh * .4];
    });
  }
  const shake = b => { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); };

  /* =====================================================
     KÉO CỜ / ĐÁNH THỨC RỒNG / XẾP ĐÁ – chọn chữ đúng dấu thanh
     ===================================================== */
  function stonesSVG(p, N) {
    let s = '<svg viewBox="0 0 320 210" style="display:block;width:100%;background:linear-gradient(#9ED8F0,#E6F6FB)"><rect y="180" width="320" height="30" fill="#93C377"/>';
    const rows = Math.round(p / N * 5);
    for (let r = 0; r < rows; r++) {
      const y = 152 - r * 28, off = r % 2 ? 0 : 22;
      for (let x = -off; x < 320; x += 44) s += `<rect x="${x + 2}" y="${y + 2}" width="40" height="24" rx="3" fill="${(x + r * 7) % 3 ? '#B8B2A6' : '#A39D90'}" stroke="#7E786C" stroke-width="2"/>`;
    }
    if (p >= N) s += '<path d="M128 180 V120 Q160 84 192 120 V180Z" fill="#3A322B"/><text x="160" y="40" text-anchor="middle" font-size="30" class="emo">🎉</text>';
    return s + '</svg>';
  }
  G.raise = function (root, cfg, api) {
    const H = mkHead(root, api);
    const row = el('div', 'g-row'); root.appendChild(row);
    const vis = el('div', 'g-stage'); row.appendChild(vis);
    const right = el('div'); row.appendChild(right);
    const N = cfg.rounds.length;
    if (cfg.visual === 'flag') {
      vis.innerHTML = `<svg viewBox="0 0 220 260" style="display:block;width:100%;max-height:340px;background:linear-gradient(#9ED8F0,#E6F6FB)">
        <text x="40" y="40" font-size="26" class="emo">☁️</text>
        <path d="M0 250 L50 200 L90 225 L130 185 L170 215 L220 190 L220 260 L0 260Z" fill="#6E9E6B"/>
        <rect x="80" y="214" width="40" height="22" fill="#C9B79A" stroke="#8A7A5E"/>
        <rect x="98" y="36" width="5" height="180" fill="#7B6A55"/><circle cx="100.5" cy="34" r="5" fill="#F7C531"/>
        <g id="flagG" style="transform:translateY(150px);transition:transform .9s cubic-bezier(.3,1.3,.5,1)">${KP.flagSVG(103, 40, 66, 'class="wave-flag"')}</g>
        <text id="raiseCheer" x="160" y="40" font-size="28" class="emo" opacity="0">🎉</text></svg>`;
    } else if (cfg.visual === 'stones') {
      vis.innerHTML = stonesSVG(0, N);
    } else {
      let segs = '';
      const xs = [24, 88, 152, 216, 276];
      for (let i = 0; i < 4; i++) {
        const up = i % 2 === 0 ? -55 : 55;
        segs += `<path class="dseg" data-i="${i}" d="M${xs[i]} 110 Q${(xs[i] + xs[i + 1]) / 2} ${110 + up} ${xs[i + 1]} 110" stroke="#B9B2A6" stroke-width="14" fill="none" stroke-linecap="round" style="transition:stroke .5s"/>`;
      }
      vis.innerHTML = `<svg viewBox="0 0 360 190" style="display:block;width:100%;background:linear-gradient(#16213E,#3D4F7D)">
        <rect y="150" width="360" height="40" fill="#2F5B78"/><rect y="128" width="360" height="8" fill="#5B6577"/>
        ${segs}<circle id="dHead" cx="290" cy="104" r="15" fill="#B9B2A6" style="transition:fill .5s"/><circle cx="295" cy="99" r="3" fill="#3A3B3C"/>
        <text id="dFire" x="306" y="112" font-size="34" class="emo" opacity="0" style="transition:opacity .4s">🔥</text>
        <text id="dWater" x="270" y="70" font-size="26" class="emo" opacity="0" style="transition:opacity .4s">💦</text></svg>`;
    }
    const setProg = p => {
      if (cfg.visual === 'flag') vis.querySelector('#flagG').style.transform = `translateY(${150 - 150 * p / N}px)`;
      else if (cfg.visual === 'stones') vis.innerHTML = stonesSVG(p, N);
      else vis.querySelectorAll('.dseg').forEach(s => { if (+s.dataset.i < p) s.setAttribute('stroke', '#F2C230'); });
    };
    let k = 0;
    const round = () => {
      const r = cfg.rounds[k];
      right.innerHTML = `<div class="g-pic emo">${r.pic}</div><div class="opts-box"></div>`;
      const M = mkMsg(right);
      H.set(`${PH.whichWord} (${k + 1}/${N})`, [PH.whichWord, r.say]);
      optButtons(right.querySelector('.opts-box'), r.options, (v, b) => {
        if (v === r.say) {
          api.sfx.ok(); b.classList.add('right'); right.querySelectorAll('.opt').forEach(x => x.disabled = true);
          const p = pick(PH.praise); M.set(p + ' Chữ "' + r.say + '"', true); api.say([p, r.say]);
          k++; setProg(k);
          if (k < N) wait(api, 1500, round);
          else wait(api, 1000, () => {
            if (cfg.visual === 'flag') vis.querySelector('#raiseCheer').setAttribute('opacity', '1');
            else if (cfg.visual === 'dragon') { vis.querySelector('#dHead').setAttribute('fill', '#F2C230'); vis.querySelector('#dFire').setAttribute('opacity', '1'); vis.querySelector('#dWater').setAttribute('opacity', '1'); }
            api.done();
          });
        } else {
          api.sfx.no(); b.classList.add('wrong'); b.disabled = true; M.set(PH.tryAgain, false); api.say([PH.tryAgain, r.say]);
        }
      });
    };
    round();
  };

  /* =====================================================
     LA BÀN – A Pa Chải
     ===================================================== */
  G.compass = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); root.appendChild(st);
    const M = mkMsg(root);
    const ang = { B: 0, 'Đ': 90, N: 180, T: 270 };
    st.innerHTML = `<div class="compass">
      <span></span><button class="dir" data-d="B">⬆ Bắc</button><span></span>
      <button class="dir" data-d="T">⬅ Tây</button>
      <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="#FFFDF8" stroke="#C68B59" stroke-width="6"/>
        <circle cx="100" cy="100" r="74" fill="none" stroke="#E4DCCD" stroke-width="2"/>
        <text x="100" y="30" text-anchor="middle" font-weight="900" font-size="18" fill="#DA251D">B</text><text x="176" y="106" text-anchor="middle" font-weight="900" font-size="18">Đ</text>
        <text x="100" y="184" text-anchor="middle" font-weight="900" font-size="18">N</text><text x="24" y="106" text-anchor="middle" font-weight="900" font-size="18">T</text>
        <g class="needle"><polygon points="100,34 112,100 100,166 88,100" fill="#C68B59"/><polygon points="100,34 112,100 88,100" fill="#DA251D"/><circle cx="100" cy="100" r="8" fill="#3A3B3C"/></g></svg>
      <button class="dir" data-d="Đ">Đông ➡</button>
      <span class="emo" style="font-size:34px">🌄</span><button class="dir" data-d="N">⬇ Nam</button><span class="emo" style="font-size:34px">🌇</span></div>`;
    const needle = st.querySelector('.needle');
    let k = 0, lock = false;
    const round = () => { lock = false; H.set(cfg.rounds[k].say + ` (${k + 1}/${cfg.rounds.length})`, [cfg.rounds[k].say]); st.querySelectorAll('.dir').forEach(b => b.classList.remove('right', 'wrong')); };
    st.querySelectorAll('.dir').forEach(b => b.onclick = () => {
      if (lock) return;
      const d = b.dataset.d, r = cfg.rounds[k];
      if (d === r.a) {
        lock = true; api.sfx.ok(); b.classList.add('right');
        needle.style.transform = `rotate(${ang[d]}deg)`;
        const p = pick(PH.praise); M.set(`${p} ${PH.dir[d]}.`, true); api.say([p, PH.dir[d]]);
        k++;
        if (k < cfg.rounds.length) wait(api, 1700, round); else wait(api, 1300, () => api.done());
      } else {
        api.sfx.no(); b.classList.add('wrong'); M.set(`${PH.thisIs} ${PH.dir[d].toLowerCase()}. ${PH.tryAgain}`, false); api.say([PH.thisIs, PH.dir[d], PH.tryAgain]);
      }
    });
    round();
  };

  /* =====================================================
     XẾP THỨ TỰ – trồng lúa, bánh chưng, truyện cổ tích, tháp Chăm, kẹo dừa
     ===================================================== */
  function riceVis(stage) {
    const fills = ['#AFD3DF', '#C3E2A0', '#86BE5E', '#E2B84A', '#EADFB8'];
    const deco = ['💧', '🌱', '🌿', '🌾', '🧺'];
    let s = '<svg viewBox="0 0 300 170" style="display:block;width:100%"><rect width="300" height="170" fill="#CFEFFA"/><path d="M0 60 L70 20 L140 50 L210 10 L300 45 L300 170 L0 170Z" fill="#8FB7A6"/>';
    for (let i = 0; i < 5; i++) { const y = 70 + i * 21; s += `<path d="M0 ${y} Q90 ${y - 18} 170 ${y - 4} T300 ${y - 8} L300 170 L0 170Z" fill="${fills[stage]}" stroke="#F4F9EC" stroke-width="3"/>`; }
    for (let i = 0; i < 6; i++) s += `<text x="${30 + i * 45}" y="${100 + (i % 3) * 22}" font-size="20" class="emo">${deco[stage]}</text>`;
    return s + '</svg>';
  }
  function banhVis(stage) {
    let s = '<svg viewBox="0 0 300 200" style="display:block;width:100%;background:#FFF6E6">';
    if (stage >= 1) s += '<rect x="80" y="30" width="140" height="140" rx="10" fill="#3E8A3E"/><path d="M80 100 h140 M150 30 v140" stroke="#5FAA55" stroke-width="3"/>';
    if (stage >= 2) s += '<rect x="98" y="48" width="104" height="104" rx="6" fill="#FAFAF2" stroke="#E4DCCD"/>';
    if (stage >= 3) s += '<rect x="116" y="66" width="68" height="68" rx="4" fill="#F2C94C"/>';
    if (stage >= 4) s += '<rect x="132" y="82" width="36" height="36" rx="4" fill="#E58C8A"/>';
    if (stage >= 5) s += '<rect x="80" y="30" width="140" height="140" rx="10" fill="#2F7A35"/><path d="M80 75 h140 M80 125 h140 M125 30 v140 M175 30 v140" stroke="#F4E7C5" stroke-width="5"/>';
    if (stage >= 6) s += '<text x="150" y="26" text-anchor="middle" font-size="26" class="emo">♨️♨️♨️</text><text x="250" y="190" font-size="34" class="emo">🔥</text>';
    if (stage === 0) s += '<text x="150" y="110" text-anchor="middle" font-size="18" font-weight="800" fill="#A39C90">Chưa có gì cả…</text>';
    return s + '</svg>';
  }
  function towerVis(stage) {
    let s = '<svg viewBox="0 0 300 220" style="display:block;width:100%;background:linear-gradient(#BFE6F5,#E6F6FB 70%,#A8D08D 70%)">';
    if (stage >= 1) s += '<rect x="90" y="176" width="120" height="22" fill="#8A4B2A"/><rect x="80" y="194" width="140" height="10" fill="#6B3A20"/>';
    if (stage >= 2) s += '<rect x="108" y="100" width="84" height="78" fill="#B5552E"/><rect x="138" y="128" width="24" height="50" rx="10" fill="#5A2A14"/><rect x="116" y="112" width="12" height="40" fill="#9C4524"/><rect x="172" y="112" width="12" height="40" fill="#9C4524"/>';
    if (stage >= 3) s += '<path d="M104 102 L196 102 L184 80 L116 80Z" fill="#A04A28"/><path d="M118 80 L182 80 L172 60 L128 60Z" fill="#B5552E"/><path d="M130 60 L170 60 L162 44 L138 44Z" fill="#A04A28"/>';
    if (stage >= 4) s += '<path d="M140 44 L160 44 L150 18Z" fill="#C8673C"/><text x="200" y="40" font-size="26" class="emo">✨</text>';
    if (stage === 0) s += '<text x="150" y="120" text-anchor="middle" font-size="18" font-weight="800" fill="#7E786C">Bãi đất trống…</text>';
    return s + '</svg>';
  }
  function orderGame(root, items, api, opts) {
    const H = mkHead(root, api);
    const row = el('div', 'g-row'); root.appendChild(row);
    const vis = el('div', 'g-stage'); row.appendChild(vis);
    const right = el('div'); row.appendChild(right);
    const slots = el('div', 'slots'); right.appendChild(slots);
    const tiles = el('div', 'tiles'); right.appendChild(tiles);
    const M = mkMsg(right);
    let k = 0;
    vis.innerHTML = opts.vis(0);
    H.set(opts.prompt);
    KP.shuffle(items.map((it, i) => ({ it, i }))).forEach(({ it }) => {
      const t = el('button', 'tile', (it.i ? KP.icon(it.i) : '') + `<span>${esc(it.t)}</span>`); t.type = 'button';
      t.onclick = () => {
        if (it.t === items[k].t) {
          api.sfx.ok(); api.say(it.t); t.classList.add('used');
          slots.appendChild(el('span', 'tile', `<span class="n">${k + 1}</span>` + (it.i ? KP.icon(it.i) : '') + `<span>${esc(it.t)}</span>`));
          k++; vis.innerHTML = opts.vis(k); M.set(k < items.length ? pick(PH.praise) : '', true);
          if (k === items.length) wait(api, 1200, () => api.done());
        } else { api.sfx.no(); shake(t); M.set(PH.orderWrong, false); api.say([it.t, PH.orderWrong]); }
      };
      tiles.appendChild(t);
    });
  }
  G.order = function (root, cfg, api) {
    const items = cfg.items;
    const stepsVis = n => `<div class="stepcard"><div class="big emo">${n ? items[n - 1].i : '❔'}</div><b>${n ? esc(items[n - 1].t) : 'Bắt đầu nào!'}</b><div class="bar">${items.map((_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</div></div>`;
    const vis = { rice: riceVis, banhchung: banhVis, tower: towerVis, steps: stepsVis }[cfg.visual] || stepsVis;
    orderGame(root, items, api, { vis, prompt: cfg.prompt || PH.orderWrong });
  };

  /* =====================================================
     GHÉP ĐÔI – 36 phố phường Hà Nội
     ===================================================== */
  G.match = function (root, cfg, api) {
    const H = mkHead(root, api);
    H.set(PH.matchHint);
    const box = el('div', 'match-cols', '<div class="col" id="mL"></div><div class="col" id="mR"></div>'); root.appendChild(box);
    const M = mkMsg(root);
    let L = null, R = null, done = 0;
    const check = () => {
      if (L == null || R == null) return;
      const lb = box.querySelector(`#mL [data-k="${L}"]`), rb = box.querySelector(`#mR [data-k="${R}"]`);
      if (L === R) {
        api.sfx.ok(); [lb, rb].forEach(b => { b.classList.remove('sel'); b.classList.add('matched'); b.disabled = true; });
        const p = cfg.pairs[L]; M.set(`${pick(PH.praise)} ${PH.street} ${p.a} ${PH.sells} ${p.b}.`, true); api.say([PH.street + ' ' + p.a, PH.sells, p.b]);
        done++; if (done === cfg.pairs.length) wait(api, 1800, () => api.done());
      } else {
        api.sfx.no(); [lb, rb].forEach(b => { b.classList.remove('sel'); shake(b); setTimeout(() => b.classList.remove('wrong'), 450); });
        M.set(PH.tryAgain, false);
      }
      L = R = null;
    };
    KP.shuffle(cfg.pairs.map((p, k) => ({ p, k }))).forEach(({ p, k }) => {
      const b = el('button', 'tile', `<span>${PH.street} ${esc(p.a)}</span>`); b.dataset.k = k; b.type = 'button';
      b.onclick = () => { box.querySelectorAll('#mL .sel').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); L = k; api.say(PH.street + ' ' + p.a); check(); };
      box.querySelector('#mL').appendChild(b);
    });
    KP.shuffle(cfg.pairs.map((p, k) => ({ p, k }))).forEach(({ p, k }) => {
      const b = el('button', 'tile', `${KP.icon(p.i)}<span>${esc(p.b)}</span>`); b.dataset.k = k; b.type = 'button';
      b.onclick = () => { box.querySelectorAll('#mR .sel').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); R = k; api.say(p.b); check(); };
      box.querySelector('#mR').appendChild(b);
    });
  };

  /* =====================================================
     TRỐN TÌM – Vịnh Hạ Long (sau đảo) · Phú Quốc (dưới vỏ sò)
     ===================================================== */
  const ROCK = (c1, c2) => `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet"><path d="M8 100 C6 60 14 30 30 18 C40 8 56 4 66 14 C82 28 94 60 92 100Z" fill="${c1}"/><path d="M30 30 q10 -12 22 -8" stroke="${c2}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M20 70 q14 -6 24 4" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
  const SHELL = c => `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet"><path d="M10 96 Q8 40 50 30 Q92 40 90 96Z" fill="${c}" stroke="#C98E6B" stroke-width="3"/>${[22, 36, 50, 64, 78].map(x => `<path d="M50 34 L${x} 96" stroke="#E8B39A" stroke-width="3"/>`).join('')}<rect x="40" y="88" width="20" height="10" rx="3" fill="#E8B39A"/></svg>`;
  G.hideseek = function (root, cfg, api) {
    const H = mkHead(root, api);
    const shell = cfg.cover === 'shell';
    const st = el('div', 'g-stage rocks' + (shell ? ' sandy' : '')); root.appendChild(st);
    const M = mkMsg(root);
    const items = KP.shuffle(cfg.items);
    const targets = KP.shuffle(items).slice(0, cfg.find || 4);
    let k = 0, busy = false;
    items.forEach((it, i) => {
      const cover = shell ? SHELL(i % 2 ? '#F6D2BE' : '#F9DFCF') : ROCK(i % 2 ? '#5C7E68' : '#6F8F7A', '#8DB59B');
      const b = el('button', 'rock', `<span class="itm emo">${it.i}</span>${cover}`); b.type = 'button'; b.setAttribute('aria-label', shell ? 'Vỏ sò' : 'Hòn đảo');
      b.onclick = () => {
        if (busy || b.classList.contains('found')) return;
        b.classList.add('up');
        if (it === targets[k]) {
          busy = true; api.sfx.ok(); b.classList.add('found'); M.set(`${pick(PH.praise)} ${PH.foundIt}`, true); api.say([it.w, PH.foundIt]);
          k++;
          wait(api, 1500, () => { busy = false; if (k < targets.length) ask(); else api.done(); });
        } else {
          busy = true; api.sfx.pop(); M.set(`${PH.thisIs} ${it.w}.`, false); api.say([PH.thisIs, it.w]);
          wait(api, 1400, () => { b.classList.remove('up'); busy = false; });
        }
      };
      st.appendChild(b);
    });
    const ask = () => H.set(`${PH.findWho} ${targets[k].w} (${k + 1}/${targets.length})`, [PH.findWho, targets[k].w]);
    ask();
  };

  /* =====================================================
     CHỌN ĐƯỜNG – chèo đò qua hang (Tràng An) · trượt cát (Mũi Né)
     ===================================================== */
  const CAVE = '<svg viewBox="0 0 160 130"><path d="M4 130 C4 60 20 18 50 8 C70 0 96 0 114 10 C144 26 156 70 156 130Z" fill="#5C7E68"/><path d="M40 130 C40 84 56 62 80 62 C104 62 120 84 120 130Z" fill="#231E1A"/><path d="M26 40 q16 -14 34 -6" stroke="#8DB59B" stroke-width="6" fill="none" stroke-linecap="round"/></svg>';
  const DUNE = '<svg viewBox="0 0 160 130"><path d="M0 130 C20 70 60 20 96 24 C130 28 150 80 160 130Z" fill="#E9A866"/><path d="M96 24 C120 40 138 80 160 130 L120 130 C110 90 100 50 96 24Z" fill="#D88E4E"/><path d="M30 100 q20 -8 40 0 M50 80 q16 -6 32 0" stroke="#F6C994" stroke-width="3" fill="none"/></svg>';
  G.fork = function (root, cfg, api) {
    const H = mkHead(root, api);
    const dune = cfg.scene === 'dune';
    const st = el('div', 'g-stage'); root.appendChild(st);
    const M = mkMsg(root);
    let k = 0;
    const round = () => {
      const r = cfg.rounds[k];
      st.innerHTML = `<div style="text-align:center;padding:10px 0 0;background:linear-gradient(#BFE6F5,#E6F6FB)"><span class="emo" style="font-size:64px">${r.pic}</span>
        <div class="qprog" style="margin:4px 0 0">${cfg.rounds.map((_, i) => `<i class="${i < k ? 'ok' : i === k ? 'cur' : ''}"></i>`).join('')}</div></div>
        <div class="forks" style="background:linear-gradient(#E6F6FB,${dune ? '#F6E2C2' : '#CFEFFA'})"></div><div class="river-strip ${dune ? 'sand' : ''}"><span class="boat emo">${dune ? '🛷' : '🛶'}</span></div>`;
      const go = dune ? PH.duneGo : PH.caveGo;
      H.set(`${go} … (${k + 1}/${cfg.rounds.length})`, [go, r.say]);
      const forks = st.querySelector('.forks'), boat = st.querySelector('.boat');
      KP.shuffle(r.options).forEach(o => {
        const b = el('button', 'cavebtn', (dune ? DUNE : CAVE) + `<span class="sign">${esc(o)}</span>`); b.type = 'button';
        b.onclick = () => {
          if (o === r.say) {
            const p = pick(PH.praise);
            api.sfx.ok(); M.set(p, true); api.say([p, r.say]);
            const bx = b.getBoundingClientRect(), sx = st.getBoundingClientRect();
            boat.style.transform = `translate(${bx.left + bx.width / 2 - sx.left - sx.width / 2 - 23}px,-120px) scale(.5)`; boat.style.opacity = '0';
            forks.querySelectorAll('button').forEach(x => x.disabled = true);
            k++;
            if (k < cfg.rounds.length) wait(api, 1600, round); else wait(api, 1300, () => api.done());
          } else { api.sfx.no(); shake(b); M.set(`${PH.notThis} "${o}"`, false); api.say([PH.notThis, o]); }
        };
        forks.appendChild(b);
      });
    };
    round();
  };

  /* =====================================================
     SOI ĐÈN PIN – Phong Nha
     ===================================================== */
  G.flashlight = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); root.appendChild(st);
    const M = mkMsg(root);
    const box = el('div', 'torch'); st.appendChild(box);
    const pos = spots(cfg.items.length, 4, 3, [10, 90, 14, 86]);
    const targets = KP.shuffle(cfg.items).slice(0, 4);
    let k = 0;
    cfg.items.forEach((it, i) => {
      const b = el('button', 'it emo', it.i); b.type = 'button'; b.style.left = pos[i][0] + '%'; b.style.top = pos[i][1] + '%';
      b.setAttribute('aria-label', it.w);
      b.onclick = () => {
        if (b.classList.contains('found')) return;
        if (it === targets[k]) {
          const p = pick(PH.praise);
          api.sfx.ok(); b.classList.add('found'); M.set(`${p} ${PH.foundIt}`, true); api.say([p, PH.thisIs, it.w]);
          k++; if (k < targets.length) wait(api, 1400, ask); else wait(api, 1400, () => { box.querySelector('.dark').style.opacity = '.25'; api.done(); });
        } else { api.sfx.pop(); M.set(`${PH.thisIs} ${it.w}.`, false); api.say([PH.thisIs, it.w]); }
      };
      box.appendChild(b);
    });
    const dark = el('div', 'dark'); box.appendChild(dark);
    const move = e => { const r = box.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; box.style.setProperty('--x', (p.clientX - r.left) + 'px'); box.style.setProperty('--y', (p.clientY - r.top) + 'px'); };
    box.addEventListener('pointermove', move); box.addEventListener('pointerdown', move);
    box.addEventListener('touchmove', e => { move(e); e.preventDefault(); }, { passive: false });
    const ask = () => H.set(`${PH.torchFind} ${targets[k].w} (${k + 1}/${targets.length})`, [PH.torchFind, targets[k].w]);
    ask();
  };

  /* =====================================================
     NÓN BÀI THƠ – Huế
     ===================================================== */
  G.nonbaitho = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); root.appendChild(st);
    const M = mkMsg(root);
    const line1 = cfg.verse.join(' ');
    st.innerHTML = `<svg viewBox="0 0 320 230" style="display:block;width:100%;max-height:60vh;margin:0 auto;background:linear-gradient(#9ED8F0,#F4F0EA)">
      <g id="rays" opacity="0" style="transition:opacity .8s"><path d="M270 40 L150 130 M270 40 L120 170 M270 40 L190 190" stroke="#FFE27A" stroke-width="10" opacity=".6"/></g>
      <g id="sunBtn" style="cursor:pointer"><circle cx="270" cy="40" r="30" fill="#FFC94A"/><circle cx="270" cy="40" r="20" fill="#FFE27A"/>
        <text x="270" y="84" text-anchor="middle" font-size="12" font-weight="800" fill="#8A5A00">Chạm vào</text><text x="270" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#8A5A00">mặt trời</text></g>
      <g transform="translate(20 0)">
        <path d="M140 30 L250 190 Q140 222 30 190Z" fill="#EAD9A6" stroke="#C9A65E" stroke-width="3"/>
        <g id="hidden" opacity="0" style="transition:opacity 1.2s">
          ${[0, 1, 2, 3, 4, 5, 6].map(i => { const w = 30 - i * 3, y = 168 - i * 12; return `<rect x="${140 - w / 2}" y="${y - 11}" width="${w}" height="11" fill="#9C6B3A" opacity=".7"/>`; }).join('')}
          <text x="140" y="196" text-anchor="middle" font-size="12.5" font-weight="900" fill="#6B4A2A">${esc(line1)}</text></g>
        <path id="nonFace" d="M140 30 L250 190 Q140 222 30 190Z" fill="#F3E6BE" opacity=".96" style="transition:opacity 1.2s"/>
        ${[60, 90, 120, 150].map(y => `<path d="M${140 - (y - 30) * .69} ${y + 2} Q140 ${y + 12} ${140 + (y - 30) * .69} ${y + 2}" stroke="#C9A65E" stroke-width="1.5" fill="none" opacity=".7"/>`).join('')}
        <path d="M30 190 Q140 222 250 190" stroke="#B5552E" stroke-width="3" fill="none"/></g></svg>`;
    H.set(PH.sunTap);
    let opened = false, p2 = false;
    st.querySelector('#sunBtn').onclick = () => {
      if (opened) return; opened = true; api.sfx.star();
      st.querySelector('#rays').setAttribute('opacity', '1'); st.querySelector('#nonFace').style.opacity = '.25'; st.querySelector('#hidden').setAttribute('opacity', '1');
      M.set(PH.nonReveal + ' ' + line1, true);
      api.say([PH.nonReveal, line1, cfg.verse2], { onend: () => wait(api, 400, phase2) });
      wait(api, 12000, phase2); /* phòng khi thiết bị không đọc được */
    };
    const phase2 = () => {
      if (p2) return; p2 = true;
      const box = el('div', 'card'); box.style.marginTop = '12px';
      box.innerHTML = '<b style="font-size:18px">Xếp lại câu ca dao trên nón:</b><div class="slots" style="margin-top:10px"></div><div class="tiles"></div>';
      root.insertBefore(box, root.querySelector('.g-msg'));
      H.set(PH.verseHint);
      const slots = box.querySelector('.slots'), tiles = box.querySelector('.tiles');
      let k = 0;
      KP.shuffle(cfg.verse.map((w, i) => ({ w, i }))).forEach(({ w }) => {
        const t = el('button', 'tile', esc(w)); t.type = 'button';
        t.onclick = () => {
          if (w === cfg.verse[k]) {
            api.sfx.ok(); api.say(w); t.classList.add('used'); slots.appendChild(el('span', 'tile', esc(w))); k++;
            if (k === cfg.verse.length) {
              M.set('', true);
              box.appendChild(el('div', 'bigeq', `${esc(line1)}<br><span style="font-size:.7em">${esc(cfg.verse2)}</span>`));
              api.say([line1, cfg.verse2], { onend: () => wait(api, 500, () => api.done()) });
            }
          } else { api.sfx.no(); shake(t); M.set(PH.tryAgain, false); api.say(PH.tryAgain); }
        };
        tiles.appendChild(t);
      });
    };
  };

  /* =====================================================
     ĐÈN LỒNG – Hội An
     ===================================================== */
  const LANTERN = c => `<svg viewBox="0 0 60 120"><path d="M30 0 v18" stroke="#2A2230" stroke-width="2"/><rect x="18" y="16" width="24" height="7" rx="2" fill="#7A4B2A"/>
    <ellipse cx="30" cy="54" rx="26" ry="32" fill="${c}"/><path d="M30 22 Q10 54 30 86 M30 22 Q50 54 30 86" stroke="rgba(0,0,0,.18)" stroke-width="2" fill="none"/>
    <ellipse cx="22" cy="44" rx="6" ry="12" fill="#fff" opacity=".25"/><rect x="18" y="84" width="24" height="7" rx="2" fill="#7A4B2A"/><path d="M30 91 v20 M26 93 v16 M34 93 v16" stroke="#E0453A" stroke-width="2"/></svg>`;
  G.colorpick = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage lanterns'); root.appendChild(st);
    const M = mkMsg(root);
    const order = KP.shuffle(cfg.colors);
    let k = 0;
    KP.shuffle(cfg.colors).forEach((c, i) => {
      const b = el('button', 'lantern dim', LANTERN(c.c)); b.type = 'button'; b.style.marginTop = (18 + (i % 3) * 22) + 'px'; b.setAttribute('aria-label', 'Đèn lồng ' + c.w);
      b.onclick = () => {
        if (b.classList.contains('lit')) return;
        if (c === order[k]) {
          const p = pick(PH.praise);
          api.sfx.ok(); b.classList.remove('dim'); b.classList.add('lit'); M.set(`${p} ${PH.lantern} ${c.w}!`, true); api.say([p, c.w]);
          k++; if (k < order.length) wait(api, 1400, ask); else wait(api, 1400, () => api.done());
        } else { api.sfx.no(); shake(b); M.set(`${PH.lanternIs} ${c.w}. ${PH.tryAgain}`, false); api.say([PH.lanternIs, c.w]); }
      };
      st.appendChild(b);
    });
    const ask = () => H.set(`${PH.lantern} ${order[k].w} (${k + 1}/${order.length})`, [PH.lantern, order[k].w]);
    ask();
  };

  /* =====================================================
     THẢ THUYỀN (Lý Sơn) / ĐƯA RÙA VỀ BIỂN (Côn Đảo)
     ===================================================== */
  G.release = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); root.appendChild(st);
    const box = el('div', 'stagebox'); st.appendChild(box);
    const capEl = el('div', 'caption'); root.appendChild(capEl);
    const turtles = cfg.visual === 'turtles';
    const list = turtles ? Array.from({ length: cfg.count || 6 }, () => ({ i: '🐢' })) : cfg.items;
    box.style.background = turtles ? 'linear-gradient(#5FB3D0 0 34%, #F1DFB5 34%)' : 'linear-gradient(#BFE6F5 0 30%, #5FB3D0 30% 78%, #F1DFB5 78%)';
    box.innerHTML = turtles ? '<span class="emo" style="position:absolute;right:4%;top:40%;font-size:44px">🌴</span><span class="emo" style="position:absolute;left:46%;top:6%;font-size:30px;opacity:.7">🌊</span>'
      : '<span class="emo" style="position:absolute;right:6%;top:6%;font-size:36px">🌋</span><span class="emo" style="position:absolute;left:6%;top:4%;font-size:30px">☀️</span>';
    capEl.textContent = turtles ? PH.turtlesHint : PH.boatsHint;
    H.set(turtles ? PH.turtlesHint : PH.boatsHint);
    let n = 0;
    list.forEach((it, i) => {
      const b = el('button', 'it emo', it.i); b.type = 'button';
      const x = turtles ? 12 + i * (76 / Math.max(1, list.length - 1)) : 14 + i * (72 / Math.max(1, list.length - 1));
      const y = turtles ? 62 + (i % 2) * 18 : 84;
      b.style.left = x + '%'; b.style.top = y + '%';
      if (turtles) b.style.transform = 'translate(-50%,-50%) rotate(90deg)';
      b.onclick = () => {
        if (b.dataset.gone) return; b.dataset.gone = 1; n++;
        api.sfx.pop();
        if (turtles) {
          b.style.transform = 'translate(-50%,-50%) translateY(-' + (box.clientHeight * (y - 14) / 100) + 'px) rotate(90deg) scale(.7)'; b.style.opacity = '0';
          capEl.textContent = `${cap(NUM[n])} ${PH.turtleHome}`; api.say([NUM[n], PH.turtleHome]);
          if (n === list.length) wait(api, 1800, () => api.done());
        } else {
          b.style.transform = 'translate(-50%,-50%) translate(' + (box.clientWidth * .25) + 'px,-' + (box.clientHeight * .5) + 'px) scale(.4)'; b.style.opacity = '0';
          capEl.textContent = it.t;
          if (n === list.length) api.say(it.t, { onend: () => wait(api, 400, () => api.done()) });
          else api.say(it.t);
        }
      };
      box.appendChild(b);
    });
  };

  /* =====================================================
     TÌM TRÊN BẢN ĐỒ – Hoàng Sa
     ===================================================== */
  G.mapfind = function (root, cfg, api, stop) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); root.appendChild(st);
    const M = mkMsg(root);
    const MD = window.MAPDATA;
    st.innerHTML = `<svg viewBox="0 0 ${MD.W} ${MD.H}" style="display:block;width:100%;max-height:70vh;cursor:pointer">${KP.mapBase({ simple: true, labels: false })}<g id="mf"></g></svg>`;
    const svg = st.querySelector('svg'), layer = st.querySelector('#mf');
    let k = 0, tries = 0, lock = false;
    const ask = () => { tries = 0; lock = false; H.set(cfg.rounds[k].say + ` (${k + 1}/${cfg.rounds.length})`, [cfg.rounds[k].say]); };
    svg.addEventListener('click', e => {
      if (lock) return;
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      const [lon, lat] = KP.unproject(p.x, p.y), r = cfg.rounds[k];
      const d = Math.hypot((lon - r.pos[0]) * Math.cos(lat * Math.PI / 180), lat - r.pos[1]);
      const mk = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      if (d <= r.r) {
        lock = true; api.sfx.ok();
        const [tx, ty] = KP.project(r.pos[0], r.pos[1]);
        mk.innerHTML = `<circle cx="${tx}" cy="${ty}" r="26" fill="rgba(78,154,62,.25)" stroke="#4E9A3E" stroke-width="4"/><text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="26" font-weight="900" fill="#2E6B22">✓</text>`;
        layer.appendChild(mk); const pr = pick(PH.praise); M.set(pr, true); api.say(pr);
        k++; if (k < cfg.rounds.length) wait(api, 1400, ask); else wait(api, 1400, meaning);
      } else {
        api.sfx.no(); tries++;
        mk.innerHTML = `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-size="26" font-weight="900" fill="#D9534F">✕</text>`;
        layer.appendChild(mk); setTimeout(() => mk.remove(), 900);
        if (tries >= 2) {
          const [tx, ty] = KP.project(r.pos[0], r.pos[1]);
          const h = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          h.setAttribute('cx', tx); h.setAttribute('cy', ty); h.setAttribute('r', '40'); h.setAttribute('fill', 'none'); h.setAttribute('stroke', '#F7C531'); h.setAttribute('stroke-width', '5'); h.setAttribute('stroke-dasharray', '8 6');
          layer.appendChild(h); setTimeout(() => h.remove(), 2500);
          M.set(PH.mapHint, false); api.say(PH.mapHint);
        } else { M.set(PH.tryAgain, false); api.say(PH.tryAgain); }
      }
    });
    const meaning = () => {
      const box = el('div', 'meaning'); root.insertBefore(box, root.querySelector('.g-msg'));
      st.style.display = 'none'; M.set('');
      let i = 0;
      const one = () => {
        const [han, viet] = cfg.meaning[i];
        const others = ['xanh', 'đỏ', 'nước', 'núi', 'trắng'].filter(x => x !== viet);
        const q = `"${han}" ${PH.meaningQ}`;
        box.innerHTML = `<div class="card"><div class="quiz-q">"${esc(han)}" trong "Hoàng Sa" ${esc(PH.meaningQ)}</div><div class="ob"></div></div>`;
        H.set(q, [q]);
        optButtons(box.querySelector('.ob'), [viet].concat(KP.shuffle(others).slice(0, 2)), (v, b) => {
          if (v === viet) {
            api.sfx.ok(); b.classList.add('right'); api.say(`${han} ${PH.meaningIs} ${viet}.`);
            i++; if (i < cfg.meaning.length) wait(api, 1700, one);
            else wait(api, 1700, () => { box.innerHTML = `<div class="bigeq">${esc(cfg.meaningResult)}</div>`; api.say(stop.keys[0].vi, { onend: () => wait(api, 400, () => api.done()) }); });
          } else { api.sfx.no(); b.classList.add('wrong'); b.disabled = true; api.say(PH.tryAgain); }
        });
      };
      one();
    };
    ask();
  };

  /* =====================================================
     ĐẾM – Thác Bản Giốc · Mũi Đôi (đón bình minh trước)
     ===================================================== */
  G.count = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); root.appendChild(st);
    const box = el('div', 'stagebox'); st.appendChild(box);
    const opts = el('div', 'g-opts'); opts.style.marginTop = '12px'; root.appendChild(opts);
    const M = mkMsg(root);
    box.style.transition = 'background 1.2s';
    let k = 0;
    const round = () => {
      const r = cfg.rounds[k];
      box.querySelectorAll('.fish').forEach(f => f.remove());
      let tapped = 0;
      spots(r.n, 5, 2, [8, 92, 56, 92]).forEach(([x, y]) => {
        const f = el('button', 'it emo fish', r.i); f.type = 'button'; f.style.left = x + '%'; f.style.top = y + '%'; f.style.position = 'absolute';
        f.style.fontSize = 'clamp(30px,6vw,44px)';
        f.onclick = () => { if (f.querySelector('.cnt') || tapped >= 10) return; tapped++; f.appendChild(el('span', 'cnt', tapped)); api.say(NUM[tapped]); api.sfx.pop(); };
        box.appendChild(f);
      });
      H.set(`${PH.countAsk} (${k + 1}/${cfg.rounds.length})`, [PH.countAsk]);
      const wrongs = KP.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x !== r.n && Math.abs(x - r.n) <= 3)).slice(0, 2);
      optButtons(opts, [r.n].concat(wrongs).map(x => NUM[x]), (v, b) => {
        if (v === NUM[r.n]) {
          const p = pick(PH.praise);
          api.sfx.ok(); b.classList.add('right'); opts.querySelectorAll('.opt').forEach(x => x.disabled = true);
          M.set(`${p} ${PH.countIs} ${NUM[r.n]}.`, true); api.say([p, PH.countIs, NUM[r.n]]);
          k++; if (k < cfg.rounds.length) wait(api, 1800, round); else wait(api, 1600, () => api.done());
        } else { api.sfx.no(); b.classList.add('wrong'); b.disabled = true; M.set(PH.tryAgain, false); api.say(PH.tryAgain); }
      });
    };
    if (cfg.sunrise) {
      box.style.background = 'linear-gradient(#5B6EA8 0 45%, #2F6F96 45%)';
      box.innerHTML = `<button class="it" id="sun" aria-label="Mặt trời" style="left:50%;top:50%;font-size:72px;transition:top 1.4s ease-out">🌞</button>`;
      H.set(PH.sunrise);
      box.querySelector('#sun').onclick = function () {
        this.onclick = null; api.sfx.star(); this.style.top = '20%';
        box.style.background = 'linear-gradient(#F7A78A 0 45%, #5FB3D0 45%)';
        M.set(PH.sunriseDone, true);
        api.say(PH.sunriseDone);
        wait(api, 3200, () => { this.style.top = '12%'; this.style.fontSize = '44px'; M.set(''); round(); });
      };
    } else {
      box.style.background = cfg.theme === 'river' ? 'linear-gradient(#BFE6F5 0 22%, #8FB7A6 22% 46%, #7CC3DB 46%)' : 'linear-gradient(#CFEFFA 0 45%, #5FB3D0 45%)';
      if (cfg.theme === 'river') box.innerHTML = '<span class="emo" style="position:absolute;left:44%;top:18%;font-size:40px">💦</span>';
      round();
    }
  };

  /* =====================================================
     XẾP CÂU – Trường Sa (cây bàng vuông) · Văn Miếu (Khuê Văn Các)
     ===================================================== */
  function treeVis(stage) {
    const sc = [.35, .7, 1][Math.min(stage, 2)];
    return `<svg viewBox="0 0 300 180" style="display:block;width:100%;background:linear-gradient(#9ED8F0,#E6F6FB 60%,#5FB3D0 60%)">
      <ellipse cx="150" cy="150" rx="110" ry="20" fill="#F1DFB5"/>
      <g style="transform:translate(150px,148px) scale(${sc});transition:transform 1s cubic-bezier(.3,1.4,.5,1)"><rect x="-6" y="-60" width="12" height="60" fill="#7A5A3A"/>
        <ellipse cx="0" cy="-74" rx="58" ry="26" fill="#2F7A35"/><ellipse cx="-24" cy="-90" rx="34" ry="20" fill="#3E8A3E"/><ellipse cx="24" cy="-92" rx="34" ry="20" fill="#3E8A3E"/><ellipse cx="0" cy="-106" rx="30" ry="16" fill="#4E9A4A"/></g>
      <rect x="236" y="70" width="3" height="80" fill="#7B6A55"/>${KP.flagSVG(239, 70, 36)}
      <text x="30" y="40" font-size="22" class="emo">🐦</text></svg>`;
  }
  function vanmieuVis(stage) {
    const lit = stage >= 2, half = stage >= 1;
    const wood = lit ? '#A4532F' : half ? '#C79A7E' : '#CFC8BB', brick = half ? '#C8673C' : '#D8D1C3', roof = lit ? '#6B3A20' : '#9C8E76';
    const spokes = lit ? [0, 45, 90, 135].map(a => { const c = 13 * Math.cos(a * Math.PI / 180), s = 13 * Math.sin(a * Math.PI / 180); return `<path d="M${(150 - c).toFixed(1)} ${(81 - s).toFixed(1)} L${(150 + c).toFixed(1)} ${(81 + s).toFixed(1)}" stroke="#C98400" stroke-width="2"/>`; }).join('') : '';
    return `<svg viewBox="0 0 300 200" style="display:block;width:100%;background:linear-gradient(#BFE6F5,#F4F0EA 75%,#A8D08D 75%)">
      ${lit ? '<circle cx="150" cy="80" r="70" fill="#FFF3C4" opacity=".7"/>' : ''}
      <rect x="92" y="150" width="116" height="10" fill="${brick}"/>
      ${[100, 128, 160, 188].map(x => `<rect x="${x}" y="112" width="12" height="40" fill="${brick}"/>`).join('')}
      <rect x="96" y="104" width="108" height="10" fill="${roof}"/>
      <path d="M86 106 Q150 92 214 106 L204 98 Q150 86 96 98Z" fill="${roof}"/>
      <rect x="114" y="62" width="72" height="38" fill="${wood}"/>
      <circle cx="150" cy="81" r="13" fill="${lit ? '#FFE27A' : '#EFE6D2'}" stroke="#6B3A20" stroke-width="2"/>${spokes}
      <path d="M104 64 Q150 44 196 64 L186 54 Q150 36 114 54Z" fill="${roof}"/>
      <text x="150" y="190" text-anchor="middle" font-size="13" font-weight="900" fill="#3A3B3C">Khuê Văn Các</text>
      ${lit ? '<text x="236" y="46" font-size="24" class="emo">✨</text><text x="44" y="46" font-size="24" class="emo">📜</text>' : ''}</svg>`;
  }
  G.sentence = function (root, cfg, api) {
    const H = mkHead(root, api);
    const vf = cfg.visual === 'vanmieu' ? vanmieuVis : treeVis;
    const row = el('div', 'g-row'); root.appendChild(row);
    const vis = el('div', 'g-stage', vf(0)); row.appendChild(vis);
    const right = el('div'); row.appendChild(right);
    const M = mkMsg(root);
    let si = 0;
    const one = () => {
      const words = cfg.sentences[si];
      right.innerHTML = `<div class="card" style="background:#FFFBEF"><b>${cfg.visual === 'vanmieu' ? '📜 Câu' : '✉️ Lá thư'} ${si + 1}</b><div class="slots" style="margin-top:8px"></div><div class="tiles"></div></div>`;
      H.set(PH.sentenceHint);
      const slots = right.querySelector('.slots'), tiles = right.querySelector('.tiles');
      let k = 0;
      KP.shuffle(words.map((w, i) => ({ w, i }))).forEach(({ w }) => {
        const t = el('button', 'tile', esc(w)); t.type = 'button';
        t.onclick = () => {
          if (w === words[k]) {
            api.sfx.ok(); api.say(w); t.classList.add('used'); slots.appendChild(el('span', 'tile', esc(w))); k++;
            if (k === words.length) {
              const sen = words.join(' ') + '!';
              M.set(sen, true); si++; vis.innerHTML = vf(si);
              let moved = false;
              const go = () => { if (moved) return; moved = true; if (si < cfg.sentences.length) { M.set(''); one(); } else api.done(); };
              api.say(sen, { onend: () => wait(api, 600, go) });
              wait(api, 9000, go);
            }
          } else { api.sfx.no(); shake(t); M.set(PH.tryAgain, false); api.say(PH.tryAgain); }
        };
        tiles.appendChild(t);
      });
    };
    one();
  };

  /* =====================================================
     GÕ CỒNG CHIÊNG – Buôn Ma Thuột
     ===================================================== */
  G.simon = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); st.style.background = 'linear-gradient(#C8673C,#8A3E22)'; root.appendChild(st);
    const row = el('div', 'gong-row'); st.appendChild(row);
    const ctr = el('div', 'tiles'); ctr.style.marginTop = '12px'; root.appendChild(ctr);
    const M = mkMsg(root);
    const freqs = [196, 247, 294, 349], tints = ['#D9A43A', '#C98E25', '#E2B84A', '#B97A1E'];
    const gongs = freqs.map((f, i) => {
      const b = el('button', 'gong', `<svg viewBox="0 0 64 70"><path d="M14 6 Q32 -2 50 6" fill="none" stroke="#3A2A1A" stroke-width="3"/><circle cx="32" cy="38" r="28" fill="${tints[i]}" stroke="#6B4A1A" stroke-width="3"/><circle cx="32" cy="38" r="18" fill="#EFC86A" opacity=".6"/><circle cx="32" cy="38" r="9" fill="${tints[i]}" stroke="#6B4A1A" stroke-width="2"/></svg>`);
      b.type = 'button'; b.setAttribute('aria-label', 'Chiêng số ' + (i + 1)); row.appendChild(b); return b;
    });
    const again = el('button', 'btn ghost sm', '↻ Nghe lại'); ctr.appendChild(again);
    let lvl = 0, seq = [], pos = 0, playing = true;
    const flash = i => { api.sfx.gong(freqs[i]); gongs[i].classList.add('lit'); setTimeout(() => gongs[i].classList.remove('lit'), 420); };
    const play = () => {
      playing = true; pos = 0; H.set(`${PH.simonListen} (${seq.length})`, false);
      seq.forEach((g, n) => setTimeout(() => { if (api.alive()) flash(g); }, 600 + n * 750));
      setTimeout(() => { if (!api.alive()) return; playing = false; H.set(PH.simonYou, false); }, 600 + seq.length * 750);
    };
    const newLevel = () => { seq = Array.from({ length: cfg.lengths[lvl] }, () => Math.floor(Math.random() * 4)); play(); };
    gongs.forEach((b, i) => b.onclick = () => {
      if (playing) return;
      flash(i);
      if (i === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          M.set(pick(PH.praise), true); lvl++; playing = true;
          if (lvl < cfg.lengths.length) wait(api, 1300, newLevel); else wait(api, 1300, () => api.done());
        }
      } else { api.sfx.no(); playing = true; M.set(PH.simonWrong, false); api.say(PH.simonWrong, { onend: () => wait(api, 300, play) }); }
    });
    again.onclick = () => { if (!playing) play(); };
    H.set(PH.simonListen, false);
    let started = false;
    const start = () => { if (started) return; started = true; newLevel(); };
    api.say(PH.simonListen, { onend: () => wait(api, 200, start) });
    wait(api, 4000, start);
  };

  /* =====================================================
     NHẶT ĐỒ – Đà Lạt · Mộc Châu · Ghềnh Đá Đĩa
     ===================================================== */
  G.collect = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); root.appendChild(st);
    const bgs = { farm: 'linear-gradient(#CFEFFA 0 22%, #B7D98B 22%)', rocks: 'linear-gradient(#9ED3E6 0 22%, #CFC6B4 22%)' };
    const box = el('div', 'scatter'); box.style.background = bgs[cfg.bg] || 'linear-gradient(#CFEFFA 0 22%, #A8D08D 22%)'; st.appendChild(box);
    const M = mkMsg(root);
    let k = 0;
    const round = () => {
      const r = cfg.rounds[k];
      const T = Array.isArray(r.target) ? r.target : [r.target];
      const items = [];
      for (let i = 0; i < r.n; i++) items.push({ e: T[i % T.length], t: true });
      for (let i = 0; i < 7; i++) items.push({ e: r.other[i % r.other.length], t: false });
      box.innerHTML = '<span class="counter" style="position:absolute;left:10px;top:10px;z-index:2"></span>';
      const cnt = box.querySelector('.counter');
      let got = 0;
      const upd = () => cnt.innerHTML = `${KP.icon(T[0])} ${got}/${r.n}`;
      upd();
      const P = spots(items.length, 6, 3, [7, 93, 32, 92]);
      KP.shuffle(items).forEach((it, i) => {
        const b = el('button', 'it emo', it.e); b.type = 'button'; b.style.left = P[i][0] + '%'; b.style.top = P[i][1] + '%';
        if (it.e === '⬢') { b.style.color = '#6B5B4A'; b.style.fontSize = 'clamp(42px,8vw,62px)'; }
        b.onclick = () => {
          if (it.t) {
            if (b.classList.contains('got')) return;
            b.classList.add('got'); got++; upd(); api.sfx.ok(); api.say(NUM[got] || String(got));
            if (got === r.n) { M.set(pick(PH.praise), true); k++; if (k < cfg.rounds.length) wait(api, 1400, round); else wait(api, 1300, () => api.done()); }
          } else { api.sfx.no(); b.classList.remove('wob'); void b.offsetWidth; b.classList.add('wob'); M.set(PH.collectWrong, false); }
        };
        box.appendChild(b);
      });
      H.set(r.say + ` (${k + 1}/${cfg.rounds.length})`, [r.say]);
      M.set('');
    };
    round();
  };

  /* =====================================================
     ĐI CHỢ BẾN THÀNH – trả tiền
     ===================================================== */
  const BILL = { 5000: '#5FA8C2', 10000: '#C68B59', 20000: '#4E8A9E', 50000: '#C9637A' };
  G.money = function (root, cfg, api) {
    const H = mkHead(root, api);
    const card = el('div', 'card'); root.appendChild(card);
    const M = mkMsg(root);
    const fmt = KP.fmtMoney;
    let k = 0, paid = [];
    const draw = () => {
      const it = cfg.items[k];
      const total = paid.reduce((a, b) => a + b, 0);
      card.innerHTML = `<div class="price-card">${KP.icon(it.i)}<div><b style="font-size:20px">${esc(it.w)}</b><div class="price-tag">${fmt(it.price)} đồng</div></div></div>
        <div class="tray" aria-label="Tiền đã đưa">${paid.length ? paid.map((b, i) => `<button class="bill mini" data-i="${i}" style="background:${BILL[b]}">${fmt(b)}<small>đồng</small></button>`).join('') : '<span style="color:#A39C90;font-weight:800">Chạm vào tờ tiền bên dưới để trả</span>'}</div>
        <p style="text-align:center;font-weight:900;font-size:19px;margin:0 0 10px">Bạn đưa: ${fmt(total)} đồng</p>
        <div class="bills">${cfg.bills.map(b => `<button class="bill" data-b="${b}" style="background:${BILL[b]}">${fmt(b)}<small>đồng</small></button>`).join('')}</div>
        <div class="row" style="justify-content:center;margin-top:14px"><button class="btn sm" id="payBtn">💵 Trả tiền</button><button class="btn ghost sm" id="clrBtn">↺ Làm lại</button></div>`;
      card.querySelectorAll('.bills .bill').forEach(b => b.onclick = () => { paid.push(+b.dataset.b); api.sfx.pop(); api.say(KP.priceWords(+b.dataset.b)); draw(); });
      card.querySelectorAll('.tray .bill').forEach(b => b.onclick = () => { paid.splice(+b.dataset.i, 1); draw(); });
      card.querySelector('#clrBtn').onclick = () => { paid = []; draw(); };
      card.querySelector('#payBtn').onclick = () => {
        if (total === it.price) {
          const p = pick(PH.praise);
          api.sfx.ok(); M.set(`${p} ${PH.payOk}`, true); api.say([p, PH.payOk]);
          k++; paid = [];
          if (k < cfg.items.length) wait(api, 2400, () => { M.set(''); draw(); ask(); }); else wait(api, 2200, () => api.done());
        } else if (total > it.price) { api.sfx.no(); M.set(PH.payMore, false); api.say(PH.payMore); }
        else { api.sfx.no(); M.set(`${PH.payLess} Còn thiếu ${fmt(it.price - total)} đồng.`, false); api.say(PH.payLess); }
      };
    };
    const ask = () => { const it = cfg.items[k]; H.set(`${cap(it.w)} ${PH.price} ${fmt(it.price)} đồng (${k + 1}/${cfg.items.length})`, [it.w, PH.price, KP.priceWords(it.price), PH.payNow]); };
    draw(); ask();
  };

  /* =====================================================
     CÂY BẸO – Chợ nổi Cái Răng
     ===================================================== */
  const GHE = '<svg viewBox="0 0 120 110"><rect x="66" y="6" width="4" height="74" fill="#7A5A3A"/><path d="M8 76 L112 76 L98 98 L22 98Z" fill="#6B4A2A"/><path d="M8 76 L112 76" stroke="#C68B59" stroke-width="5"/><path d="M30 76 L44 58 L64 58 L64 76Z" fill="#DDAA55"/><path d="M8 102 q14 -6 28 0 t28 0 t28 0 t28 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/></svg>';
  G.bheo = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage boats'); root.appendChild(st);
    const M = mkMsg(root);
    const asks = KP.shuffle(cfg.items).slice(0, cfg.ask || 4);
    let k = 0, lock = false;
    KP.shuffle(cfg.items).forEach(it => {
      const b = el('button', 'ghe', GHE + `<span class="fruit emo">${it.i}</span>`); b.type = 'button'; b.setAttribute('aria-label', 'Ghe bán ' + it.w);
      b.onclick = () => {
        if (lock) return;
        if (it === asks[k]) {
          const p = pick(PH.praise);
          lock = true; api.sfx.ok(); b.classList.add('right');
          M.set(`${p} ${PH.bheoThis} ${it.w}.${it.note ? ' ' + it.note : ''}`, true); api.say([p, PH.bheoThis, it.w].concat(it.note ? [it.note] : []));
          k++;
          wait(api, it.note ? 3600 : 2200, () => { b.classList.remove('right'); lock = false; if (k < asks.length) ask(); else api.done(); });
        } else { api.sfx.no(); shake(b); M.set(`${PH.bheoThis} ${it.w}.`, false); api.say([PH.bheoThis, it.w]); }
      };
      st.appendChild(b);
    });
    const ask = () => H.set(`${PH.bheoAsk} ${asks[k].w}? (${k + 1}/${asks.length})`, [PH.bheoAsk, asks[k].w]);
    ask();
  };

  /* =====================================================
     TRỒNG ĐƯỚC, CẮM CỜ – Đất Mũi Cà Mau
     ===================================================== */
  const DUOC = '<svg viewBox="0 0 80 90"><path d="M40 60 v-30" stroke="#6B4A2A" stroke-width="5"/><path d="M40 62 q-14 4 -22 22 M40 62 q-4 10 -8 24 M40 62 q4 10 8 24 M40 62 q14 4 22 22" stroke="#6B4A2A" stroke-width="3" fill="none"/><ellipse cx="40" cy="26" rx="30" ry="18" fill="#2F7A35"/><ellipse cx="28" cy="18" rx="16" ry="10" fill="#3E8A3E"/><ellipse cx="52" cy="18" rx="16" ry="10" fill="#4E9A4A"/></svg>';
  G.plant = function (root, cfg, api) {
    const H = mkHead(root, api);
    const st = el('div', 'g-stage'); root.appendChild(st);
    const box = el('div', 'stagebox'); box.style.background = 'linear-gradient(#9ED8F0 0 38%, #5FB3D0 38% 52%, #9C7B57 52%)'; st.appendChild(box);
    const M = mkMsg(root);
    box.innerHTML = '<span class="emo" style="position:absolute;right:6%;top:24%;font-size:40px">🚢</span><span class="emo" style="position:absolute;left:4%;top:6%;font-size:28px">☀️</span>';
    H.set(PH.plantStart);
    const n = cfg.count || 6;
    let planted = 0;
    for (let i = 0; i < n; i++) {
      const s = el('button', 'spot'); s.type = 'button'; s.setAttribute('aria-label', 'Chỗ trồng cây');
      s.style.left = (10 + i * (64 / (n - 1))) + '%'; s.style.top = (66 + (i % 2) * 18) + '%';
      s.onclick = () => {
        if (s.classList.contains('planted')) return;
        s.classList.add('planted'); s.innerHTML = DUOC; planted++; api.sfx.pop();
        M.set(`${cap(NUM[planted])} ${PH.plantOne}`, true); api.say([NUM[planted], PH.plantOne]);
        if (planted === n) wait(api, 1300, flagStep);
      };
      box.appendChild(s);
    }
    const flagStep = () => {
      H.set(PH.plantFlag);
      const f = el('button', 'spot'); f.type = 'button'; f.style.left = '88%'; f.style.top = '62%'; f.style.borderColor = '#F7C531'; f.style.animation = 'pulse2 1s infinite';
      f.setAttribute('aria-label', 'Cắm cờ ở mũi đất');
      f.innerHTML = '<span class="emo" style="font-size:26px">📍</span>';
      f.onclick = () => {
        f.onclick = null; f.classList.add('planted'); f.style.animation = 'none';
        f.innerHTML = `<svg viewBox="0 0 60 90" style="width:140%;left:-10%;bottom:20%"><rect x="8" y="10" width="3" height="80" fill="#7B6A55"/>${KP.flagSVG(11, 10, 42, 'class="wave-flag"')}</svg>`;
        api.sfx.star(); M.set(PH.plantDone, true);
        let fin = false; const go = () => { if (fin) return; fin = true; api.done(); };
        api.say(PH.plantDone, { onend: () => wait(api, 400, go) });
        wait(api, 8000, go);
      };
      box.appendChild(f);
    };
  };
})();
