/* =========================================================
   Tranh minh hoạ đơn giản cho bưu thiếp mỗi trạm (SVG tự vẽ)
   ========================================================= */
(function () {
  const KP = window.KP = window.KP || {};

  /* Ngôi sao 5 cánh: tâm (cx, cy), bán kính ngoài R */
  function starPts(cx, cy, R, r) {
    r = r || R * 0.382;
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const rr = i % 2 ? r : R;
      p.push((cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2));
    }
    return p.join(' ');
  }
  KP.starPts = starPts;

  /* Quốc kỳ Việt Nam đúng tỉ lệ 2:3, sao vàng năm cánh ở giữa */
  KP.flagSVG = function (x, y, w, extra) {
    const h = w * 2 / 3;
    return `<g transform="translate(${x},${y})"><g ${extra || ''}><rect width="${w}" height="${h}" fill="#DA251D"/>` +
      `<polygon points="${starPts(w / 2, h / 2, w / 5)}" fill="#FFDD00"/></g></g>`;
  };

  KP.goldStarSVG = function (size, extra) {
    return `<svg ${extra || ''} viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">` +
      `<defs><radialGradient id="gs${size}" cx="40%" cy="35%"><stop offset="0" stop-color="#FFF3A6"/><stop offset=".6" stop-color="#F7C531"/><stop offset="1" stop-color="#E3A21A"/></radialGradient></defs>` +
      `<polygon points="${starPts(50, 54, 46)}" fill="url(#gs${size})" stroke="#C98400" stroke-width="4" stroke-linejoin="round"/></svg>`;
  };

  const SVGI = Object.assign({}, window.KP_SVGI || {}, {
    gong: '<svg viewBox="0 0 64 64"><circle cx="32" cy="34" r="26" fill="#D9A43A" stroke="#8A5A10" stroke-width="3"/><circle cx="32" cy="34" r="17" fill="#E9BE5C" stroke="#B07A1E" stroke-width="2"/><circle cx="32" cy="34" r="8" fill="#C98E25" stroke="#8A5A10" stroke-width="2"/><path d="M14 10 Q32 2 50 10" fill="none" stroke="#6B4A2A" stroke-width="3"/></svg>'
  });
  KP.isSvgIcon = i => !!(i && i.indexOf('svg:') === 0 && SVGI[i.slice(4)]);
  /* Biểu tượng đặt trong một hình SVG khác (ví dụ trên bản đồ) */
  KP.iconIn = function (i, x, y, size, cls) {
    if (KP.isSvgIcon(i)) return SVGI[i.slice(4)].replace('<svg ', `<svg class="${cls || ''}" x="${x}" y="${y}" width="${size}" height="${size}" `);
    return null;
  };
  /* Ảnh của biểu tượng (để vẽ lên canvas bưu thiếp) */
  const IMG = {};
  KP.iconImg = function (i) {
    if (!KP.isSvgIcon(i)) return null;
    const k = i.slice(4);
    if (!IMG[k]) { const im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVGI[k]); IMG[k] = im; }
    return IMG[k];
  };
  KP.icon = function (i, cls) {
    if (i && i.indexOf('svg:') === 0) return `<span class="svgi ${cls || ''}">${SVGI[i.slice(4)] || ''}</span>`;
    return `<span class="emo ${cls || ''}">${i}</span>`;
  };

  const SKY = {
    day: ['#9ED8F0', '#E6F6FB'], sunset: ['#F49E6B', '#F9DDB0'], sunrise: ['#F7A78A', '#FDE6BF'],
    dusk: ['#4C5C98', '#F0A47C'], night: ['#16213E', '#3D4F7D'], cave: ['#231E1A', '#4A3F36']
  };

  function far(type, W, H) {
    const g = H * 0.62;
    switch (type) {
      case 'mountains':
        return `<path d="M0 ${g} L60 ${g - 90} L120 ${g - 30} L190 ${g - 120} L260 ${g - 40} L320 ${g - 100} L400 ${g - 30} L400 ${g + 20} L0 ${g + 20}Z" fill="#8FB7A6"/>` +
          `<path d="M0 ${g + 10} L80 ${g - 50} L150 ${g} L230 ${g - 70} L300 ${g - 10} L360 ${g - 55} L400 ${g - 20} L400 ${g + 30} L0 ${g + 30}Z" fill="#6E9E6B"/>`;
      case 'hills':
        return `<path d="M0 ${g} Q70 ${g - 70} 140 ${g - 10} T280 ${g - 20} T400 ${g - 30} L400 ${g + 30} L0 ${g + 30}Z" fill="#9CC48A"/>` +
          `<path d="M0 ${g + 15} Q90 ${g - 30} 180 ${g + 10} T400 ${g} L400 ${g + 40} L0 ${g + 40}Z" fill="#7FB069"/>`;
      case 'karst': {
        let s = '';
        const xs = [[20, 110, 46], [70, 150, 40], [140, 95, 50], [215, 135, 44], [290, 105, 52], [350, 140, 40], [385, 90, 36]];
        xs.forEach(([x, h, w], i) => {
          const c = i % 2 ? '#6F8F7A' : '#5C7E68';
          s += `<path d="M${x - w / 2} ${g + 6} C${x - w / 2} ${g - h * .7} ${x - w / 3} ${g - h} ${x} ${g - h} C${x + w / 3} ${g - h} ${x + w / 2} ${g - h * .7} ${x + w / 2} ${g + 6}Z" fill="${c}"/>` +
            `<path d="M${x - w / 4} ${g - h * .8} q8 -10 18 -4" stroke="#8DB59B" stroke-width="5" fill="none" stroke-linecap="round"/>`;
        });
        return s;
      }
      case 'city': {
        let s = '';
        [[10, 70], [50, 100], [95, 60], [130, 90], [175, 75], [215, 110], [260, 65], [300, 95], [345, 70], [380, 85]].forEach(([x, h], i) => {
          s += `<rect x="${x}" y="${g - h}" width="36" height="${h + 10}" rx="3" fill="${i % 2 ? '#B9C3CF' : '#A7B2C0'}"/>`;
          for (let yy = g - h + 10; yy < g - 6; yy += 16) s += `<rect x="${x + 7}" y="${yy}" width="7" height="8" fill="#F4F0EA" opacity=".8"/><rect x="${x + 21}" y="${yy}" width="7" height="8" fill="#F4F0EA" opacity=".8"/>`;
        });
        return s;
      }
      case 'skyline': {
        let s = far('city', W, H);
        const x = 300;
        s += `<path d="M${x} ${g + 10} L${x + 6} ${g - 150} L${x + 14} ${g - 175} L${x + 22} ${g - 150} L${x + 28} ${g + 10}Z" fill="#7D8FA8"/>` +
          `<path d="M${x + 6} ${g - 120} h22 M${x + 5} ${g - 80} h24 M${x + 4} ${g - 40} h26" stroke="#B7C6D8" stroke-width="2"/>`;
        return s;
      }
      case 'oldtown': {
        let s = '';
        [[0, 60], [70, 70], [150, 62], [230, 72], [310, 64]].forEach(([x, h]) => {
          s += `<rect x="${x + 4}" y="${g - h}" width="72" height="${h + 20}" fill="#EFC352"/>` +
            `<path d="M${x - 4} ${g - h + 4} L${x + 40} ${g - h - 24} L${x + 84} ${g - h + 4}Z" fill="#A4532F"/>` +
            `<rect x="${x + 16}" y="${g - h + 20}" width="16" height="22" fill="#7A4B2A"/><rect x="${x + 46}" y="${g - h + 20}" width="16" height="22" fill="#5B8C6A"/>`;
        });
        return s;
      }
      case 'volcano':
        return `<path d="M60 ${g + 10} L170 ${g - 90} L200 ${g - 92} L230 ${g - 90} L340 ${g + 10}Z" fill="#7E9F6A"/><path d="M165 ${g - 86} Q200 ${g - 70} 235 ${g - 86}" fill="#5E7F4F"/>`;
      case 'islandhills':
        return `<path d="M120 ${g + 10} Q200 ${g - 90} 300 ${g + 10}Z" fill="#6E9E6B"/><path d="M250 ${g + 10} Q320 ${g - 50} 400 ${g + 10}Z" fill="#7FB069"/>`;
      case 'pines': {
        let s = `<path d="M0 ${g} Q100 ${g - 50} 200 ${g - 10} T400 ${g - 20} L400 ${g + 30} L0 ${g + 30}Z" fill="#8DBB7C"/>`;
        [20, 55, 90, 300, 335, 370].forEach((x, i) => {
          const h = 60 + (i % 3) * 14;
          s += `<path d="M${x} ${g - h} L${x - 16} ${g + 4} L${x + 16} ${g + 4}Z" fill="#3F7A4A"/><rect x="${x - 2}" y="${g + 2}" width="4" height="10" fill="#6B4A2A"/>`;
        });
        return s;
      }
      case 'palms': {
        let s = `<rect x="0" y="${g - 8}" width="400" height="20" fill="#7FB069"/>`;
        [30, 120, 330, 380].forEach(x => {
          s += `<path d="M${x} ${g} q4 -40 -2 -70" stroke="#7A5A3A" stroke-width="5" fill="none"/>` +
            `<path d="M${x - 2} ${g - 70} q-26 -6 -36 10 M${x - 2} ${g - 70} q26 -8 36 8 M${x - 2} ${g - 70} q-8 -24 -24 -26 M${x - 2} ${g - 70} q12 -22 28 -22" stroke="#3F8A4A" stroke-width="7" fill="none" stroke-linecap="round"/>`;
        });
        return s;
      }
      case 'mangrove': {
        let s = `<rect x="0" y="${g - 40}" width="400" height="50" fill="#3E7A4A"/>`;
        for (let x = 0; x <= 400; x += 26) s += `<circle cx="${x}" cy="${g - 40}" r="22" fill="${x % 52 ? '#4A8A55' : '#3E7A4A'}"/><path d="M${x - 10} ${g + 10} q10 -24 20 0" stroke="#5B4A3A" stroke-width="2" fill="none"/>`;
        return s;
      }
      case 'dunes':
        return `<path d="M0 ${g + 10} C60 ${g - 70} 140 ${g - 90} 210 ${g - 20} C260 ${g - 70} 340 ${g - 80} 400 ${g - 30} L400 ${H} L0 ${H}Z" fill="#E9A866"/>` +
          `<path d="M210 ${g - 20} C240 ${g + 10} 260 ${g + 30} 300 ${H} L400 ${H} L400 ${g - 30} C340 ${g - 80} 260 ${g - 70} 210 ${g - 20}Z" fill="#D88E4E"/>` +
          `<path d="M0 ${g + 40} C80 ${g} 160 ${g + 10} 240 ${g + 50} S360 ${g + 60} 400 ${g + 40} L400 ${H} L0 ${H}Z" fill="#F3C98B"/>` +
          `<path d="M40 ${g + 70} q30 -10 60 0 M180 ${g + 80} q30 -10 60 0" stroke="#F6D9AE" stroke-width="3" fill="none"/>`;
      case 'cavein': {
        let s = '';
        for (let x = 0; x <= 400; x += 34) {
          const h = 30 + ((x * 7) % 50);
          s += `<path d="M${x} 0 L${x + 17} ${h} L${x + 34} 0Z" fill="#6E5D4E"/>`;
        }
        s += `<ellipse cx="200" cy="${g - 20}" rx="150" ry="70" fill="#E8C98A" opacity=".18"/>`;
        return s;
      }
      default: return '';
    }
  }

  function water(type, W, H) {
    const g = H * 0.62;
    if (type === 'sea') return `<rect x="0" y="${g}" width="${W}" height="${H - g}" fill="#5FB3D0"/>` + waves(g + 14, '#8FD0E4') + waves(g + 44, '#8FD0E4') + waves(g + 74, '#8FD0E4');
    if (type === 'river') return `<rect x="0" y="${g + 18}" width="${W}" height="${H - g - 18}" fill="#7CC3DB"/>` + waves(g + 40, '#A8DCEB') + waves(g + 70, '#A8DCEB');
    if (type === 'lake') return `<ellipse cx="200" cy="${g + 40}" rx="210" ry="56" fill="#7CC3DB"/>` + waves(g + 40, '#A8DCEB');
    return '';
  }
  function waves(y, c) {
    let d = `M0 ${y}`;
    for (let x = 0; x < 400; x += 40) d += ` q10 -6 20 0 t20 0`;
    return `<path d="${d}" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>`;
  }

  function ground(type, W, H) {
    const g = H * 0.62;
    const band = (c, y) => `<path d="M0 ${y} Q200 ${y - 14} 400 ${y} L400 ${H} L0 ${H}Z" fill="${c}"/>`;
    switch (type) {
      case 'grass': return band('#A8D08D', g + 10) + band('#93C377', g + 50);
      case 'rock': return band('#B8B2A6', g + 14) + band('#9E978A', g + 56);
      case 'sand': return band('#F1DFB5', g + 48);
      case 'redsoil': return band('#C8673C', g + 10) + band('#B5552E', g + 50) + `<path d="M0 ${g + 34} h400" stroke="#7FB069" stroke-width="10" stroke-dasharray="18 10"/>`;
      case 'road': return band('#9AA2A8', g + 18) + `<path d="M0 ${g + 52} h400" stroke="#fff" stroke-width="4" stroke-dasharray="22 16"/>`;
      case 'mud': return band('#9C7B57', g + 50);
      case 'terraces': {
        let s = '';
        const cols = ['#B7D98B', '#A6CF78', '#95C468', '#86BA5A', '#79AF4F'];
        for (let i = 0; i < 5; i++) {
          const y = g - 6 + i * 20;
          s += `<path d="M0 ${y} Q120 ${y - 22} 220 ${y - 6} T400 ${y - 10} L400 ${H} L0 ${H}Z" fill="${cols[i]}" stroke="#E9F3D6" stroke-width="3"/>`;
        }
        return s;
      }
      default: return '';
    }
  }

  function special(type, W, H) {
    const g = H * 0.62;
    switch (type) {
      case 'flagpole':
        return `<path d="M150 ${g + 8} L200 ${g - 40} L250 ${g + 8}Z" fill="#7A8F7A"/>` +
          `<rect x="186" y="${g - 46}" width="28" height="18" fill="#C9B79A" stroke="#8A7A5E"/>` +
          `<rect x="198" y="40" width="4" height="${g - 84}" fill="#7B6A55"/><circle cx="200" cy="38" r="4" fill="#F7C531"/>` +
          KP.flagSVG(202, 44, 66, 'class="wave-flag"');
      case 'terraces':
        return `<path d="M40 ${g + 30} q40 -8 80 0" stroke="#fff" stroke-width="3" opacity=".7" fill="none"/>`;
      case 'thehuc': {
        const y = g + 32;
        return `<path d="M30 ${y} Q150 ${y - 40} 260 ${y}" stroke="#D3352B" stroke-width="10" fill="none"/>` +
          `<path d="M30 ${y} Q150 ${y - 40} 260 ${y}" stroke="#F06A55" stroke-width="3" fill="none"/>` +
          [60, 100, 140, 180, 220].map(x => `<rect x="${x}" y="${y - 30 + Math.abs(x - 145) / 5}" width="4" height="${30 - Math.abs(x - 145) / 5}" fill="#B22A22"/>`).join('') +
          `<g transform="translate(320 ${y - 54})"><rect x="0" y="34" width="44" height="22" fill="#C9B48E"/><rect x="6" y="16" width="32" height="18" fill="#D2BF98"/><rect x="12" y="2" width="20" height="14" fill="#DCCBA6"/><path d="M8 2 h28 l-14 -10Z" fill="#8A7A5E"/></g>`;
      }
      case 'cave':
        return `<path d="M250 ${g + 20} Q290 ${g - 60} 330 ${g + 20}Z" fill="#2B2622"/>`;
      case 'tower': {
        let s = '';
        for (let i = 0; i < 7; i++) {
          const w = 42 - i * 4, y = g - 10 - i * 18;
          s += `<rect x="${330 - w / 2}" y="${y - 16}" width="${w}" height="16" fill="${i % 2 ? '#E7D2A6' : '#DCC392'}"/><path d="M${330 - w / 2 - 5} ${y - 16} h${w + 10}" stroke="#8A6A42" stroke-width="3"/>`;
        }
        return s + `<path d="M330 ${g - 150} v-16" stroke="#8A6A42" stroke-width="3"/>`;
      }
      case 'dragonbridge': {
        const y = g + 12;
        return `<rect x="0" y="${y + 4}" width="400" height="6" fill="#5B6577"/>` +
          `<path d="M20 ${y} C70 ${y - 70} 110 ${y - 70} 150 ${y} S230 ${y + 50} 270 ${y - 10} S330 ${y - 60} 360 ${y - 30}" stroke="#F2C230" stroke-width="12" fill="none" stroke-linecap="round"/>` +
          `<path d="M20 ${y} C70 ${y - 70} 110 ${y - 70} 150 ${y} S230 ${y + 50} 270 ${y - 10} S330 ${y - 60} 360 ${y - 30}" stroke="#FFE27A" stroke-width="3" fill="none" stroke-dasharray="6 8"/>` +
          `<circle cx="366" cy="${y - 36}" r="13" fill="#F2C230"/><circle cx="370" cy="${y - 40}" r="3" fill="#3A3B3C"/><path d="M376 ${y - 30} l16 4" stroke="#F2C230" stroke-width="5"/>`;
      }
      case 'sun':
        return `<circle cx="300" cy="${g - 4}" r="44" fill="#FFB347"/><circle cx="300" cy="${g - 4}" r="30" fill="#FFD36E"/>` +
          `<path d="M120 ${g + 2} q40 -6 80 0" stroke="#FFE3A3" stroke-width="4" fill="none"/>`;
      case 'islandflag':
        return `<ellipse cx="300" cy="${g + 18}" rx="80" ry="16" fill="#F1DFB5"/>` +
          `<rect x="318" y="${g - 70}" width="3" height="86" fill="#7B6A55"/>` + KP.flagSVG(321, g - 70, 42);
      case 'longhouse':
        return `<g transform="translate(150 ${g - 60})"><rect x="0" y="30" width="170" height="34" fill="#B98A5A"/><path d="M-10 32 L20 0 H150 L180 32Z" fill="#C9A65E"/>` +
          [10, 50, 90, 130, 160].map(x => `<rect x="${x}" y="64" width="6" height="22" fill="#7A5A3A"/>`).join('') + `</g>`;
      case 'clocktower':
        return `<g transform="translate(110 ${g - 70})"><rect x="0" y="40" width="150" height="56" fill="#EDE3CC" stroke="#B9A57D"/><rect x="58" y="0" width="34" height="96" fill="#E5D7B8" stroke="#B9A57D"/><circle cx="75" cy="22" r="11" fill="#fff" stroke="#3A3B3C" stroke-width="2"/><path d="M75 22 v-7 M75 22 h5" stroke="#3A3B3C" stroke-width="2"/>` +
          `<rect x="64" y="66" width="22" height="30" fill="#8A6A42"/></g>`;
      case 'waterfall': {
        /* Thác nhiều tầng: vách đá, cây xanh trên đỉnh, các dòng nước đổ cong qua mép đá, bọt trắng */
        const t = g - 118;
        let w = `<path d="M70 ${g + 22} L92 ${t + 14} Q120 ${t - 6} 150 ${t + 4} Q200 ${t - 10} 250 ${t + 2} Q285 ${t - 6} 312 ${t + 12} L330 ${g + 22}Z" fill="#8E8273"/>`;
        w += `<path d="M84 ${t + 20} Q98 ${t - 6} 122 ${t + 4} Q140 ${t - 12} 162 ${t + 2} Q190 ${t - 16} 214 ${t} Q240 ${t - 14} 262 ${t + 2} Q290 ${t - 10} 318 ${t + 18} Q200 ${t + 8} 84 ${t + 20}Z" fill="#5E9447"/>`;
        [t + 48, t + 90].forEach(y => { w += `<path d="M82 ${y} Q200 ${y - 8} 324 ${y} L326 ${y + 8} Q200 ${y} 80 ${y + 8}Z" fill="#6E6152"/>`; });
        const cols = [[102, 140], [150, 196], [206, 250], [262, 300]];
        const seg = [[t + 8, t + 48], [t + 52, t + 90], [t + 94, g + 18]];
        seg.forEach(([y0, y1], si) => cols.forEach(([x0, x1]) => {
          const a = x0 - si * 4, b = x1 + si * 4, m = (a + b) / 2;
          w += `<path d="M${a} ${y0 + 4} Q${m} ${y0 - 7} ${b} ${y0 + 4} L${b + 3} ${y1} L${a - 3} ${y1}Z" fill="#BFE6F3"/>`;
          for (let k = 1; k < 4; k++) { const x = a + (b - a) * k / 4; w += `<path d="M${x} ${y0 + 3} q2.5 ${(y1 - y0) / 2} 0 ${y1 - y0 - 6}" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".9"/>`; }
          for (let k = 0; k < 4; k++) w += `<circle cx="${a - 2 + (b - a + 4) * (k + .5) / 4}" cy="${y1 - 1 + (k % 2) * 2}" r="${5 + (k % 2) * 1.5}" fill="#fff"/>`;
        }));
        return w + `<ellipse cx="200" cy="${g + 24}" rx="140" ry="13" fill="#fff" opacity=".75"/>`;
      }
      case 'teahills': {
        let t = '';
        for (let r = 0; r < 4; r++) {
          const y = g + 6 + r * 20;
          t += `<path d="M0 ${y} Q100 ${y - 26} 200 ${y - 6} T400 ${y - 10}" stroke="#4E8A3E" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>`;
        }
        return t + `<path d="M300 ${g - 30} c-14 -18 -40 -2 -20 18 l20 18 l20 -18 c20 -20 -6 -36 -20 -18Z" fill="#5FAA55" stroke="#3E7A3A" stroke-width="2"/>`;
      }
      case 'khuevancac': {
        const b = g - 6;
        return `<rect x="140" y="${b}" width="120" height="12" fill="#C8673C"/>` +
          [148, 176, 212, 240].map(x => `<rect x="${x}" y="${b - 44}" width="12" height="44" fill="#C8673C"/>`).join('') +
          `<rect x="144" y="${b - 52}" width="112" height="10" fill="#6B3A20"/><path d="M132 ${b - 50} Q200 ${b - 66} 268 ${b - 50} L256 ${b - 58} Q200 ${b - 72} 144 ${b - 58}Z" fill="#6B3A20"/>` +
          `<rect x="162" y="${b - 96}" width="76" height="40" fill="#A4532F"/><circle cx="200" cy="${b - 76}" r="14" fill="#FFE27A" stroke="#6B3A20" stroke-width="2"/>` +
          `<path d="M152 ${b - 94} Q200 ${b - 116} 248 ${b - 94} L238 ${b - 104} Q200 ${b - 124} 162 ${b - 104}Z" fill="#6B3A20"/>` +
          `<rect x="60" y="${b - 10}" width="34" height="22" rx="4" fill="#B8B2A6"/><rect x="306" y="${b - 10}" width="34" height="22" rx="4" fill="#B8B2A6"/>`;
      }
      case 'stonegate': {
        let w = '';
        for (let r = 0; r < 4; r++) for (let x = (r % 2 ? 0 : -20); x < 400; x += 40) w += `<rect x="${x + 1}" y="${g - 90 + r * 24 + 1}" width="38" height="22" rx="2" fill="${(x + r) % 3 ? '#B8B2A6' : '#A39D90'}" stroke="#7E786C" stroke-width="1.5"/>`;
        return w + `<path d="M170 ${g + 6} V${g - 50} Q200 ${g - 82} 230 ${g - 50} V${g + 6}Z" fill="#3A322B"/>`;
      }
      case 'chamtower': {
        const tw = (x, sc) => `<g transform="translate(${x} ${g + 6}) scale(${sc})"><rect x="-34" y="-12" width="68" height="12" fill="#8A4B2A"/><rect x="-26" y="-92" width="52" height="80" fill="#B5552E"/><rect x="-8" y="-60" width="16" height="48" rx="8" fill="#5A2A14"/><path d="M-30 -92 L30 -92 L22 -110 L-22 -110Z" fill="#A04A28"/><path d="M-20 -110 L20 -110 L14 -126 L-14 -126Z" fill="#B5552E"/><path d="M-10 -126 L10 -126 L0 -150Z" fill="#C8673C"/></g>`;
        return tw(130, .8) + tw(230, 1.05) + tw(320, .7);
      }
      case 'basalt': {
        let c = '';
        const cols = [[40, 90], [80, 120], [120, 100], [160, 140], [200, 110], [240, 150], [280, 120], [320, 100], [360, 130]];
        cols.forEach(([x, h], i) => {
          const y = H - h;
          c += `<rect x="${x - 20}" y="${y}" width="40" height="${h}" fill="${i % 2 ? '#4A4A52' : '#5B5B63'}"/>`;
          for (let yy = y + 14; yy < H; yy += 16) c += `<path d="M${x - 20} ${yy} h40" stroke="#33333A" stroke-width="2"/>`;
          c += `<path d="M${x - 20} ${y} l10 -8 h20 l10 8Z" fill="#6E6E78"/>`;
        });
        return c;
      }
      case 'mangrove':
        return `<g transform="translate(330 ${H * 0.62 - 70})"><rect x="-2" y="0" width="3" height="70" fill="#7B6A55"/>${KP.flagSVG(1, 0, 36)}</g>`;
      default: return '';
    }
  }

  /* Vẽ tranh bưu thiếp cho một trạm */
  KP.sceneSVG = function (stop, opts) {
    const sc = stop.scene || {};
    const W = 400, H = 240;
    const sky = SKY[sc.sky] || SKY.day;
    const id = 'sk' + stop.id.replace(/[^a-z0-9]/gi, '');
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${stop.name}">` +
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>` +
      `<rect width="${W}" height="${H}" fill="url(#${id})"/>`;
    if (sc.sky === 'night' || sc.sky === 'dusk') for (let i = 0; i < 14; i++) s += `<circle cx="${(i * 53) % 400}" cy="${(i * 37) % 90 + 8}" r="1.6" fill="#fff" opacity=".8"/>`;
    s += far(sc.far, W, H) + water(sc.water, W, H) + ground(sc.ground, W, H) + special(sc.special, W, H);
    (sc.props || []).forEach(([e, x, y, size]) => {
      if (!size) return;
      s += `<text x="${x * 4}" y="${y * 2.4}" font-size="${size * 2.4}" text-anchor="middle" dominant-baseline="central" class="emo">${e}</text>`;
    });
    return s + '</svg>';
  };
})();
