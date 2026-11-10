/* =========================================================
   KHÁM PHÁ VIỆT NAM – Câu nói cố định của Trâu Con + danh sách
   mọi câu cần thu âm (dùng chung cho trang học và công cụ tạo giọng).
   Mỗi câu nói được ghép từ các "mảnh" cố định, nên chỉ cần thu âm
   từng mảnh một lần.
   ========================================================= */
(function () {
  const KP = window.KP = window.KP || {};

  KP.PH = {
    welcome: 'Chào các bạn! Mình là Trâu Con. Cùng mình đi từ Cột cờ Lũng Cú tới Đất Mũi Cà Mau nhé!',
    praise: ['Đúng rồi!', 'Giỏi quá!', 'Tuyệt vời!', 'Chính xác!', 'Hay lắm!'],
    tryAgain: 'Chưa đúng rồi, thử lại nhé!',
    thisIs: 'Đây là',
    num: ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'],

    /* các bước trong một trạm */
    videoHint: 'Các bạn xem phim cùng Trâu Con nhé!',
    recap: 'Các bạn hãy nhớ nhé:',
    keysHint: 'Đây là những điều cần ghi nhớ. Chạm vào từng thẻ để nghe nhé!',
    cardsHint: 'Chạm vào từng thẻ để nghe, rồi đọc to theo Trâu Con nhé!',
    factHint: 'Chạm vào thẻ Bạn có biết để mở bí mật nhé!',
    answerIs: 'Đáp án đúng là:',
    hintIs: 'Gợi ý:',
    quizPass: 'Tuyệt vời! Ngôi sao vàng đang chờ bạn đó.',
    quizFail: 'Gần được rồi! Mình xem lại phần Ghi nhớ rồi chơi lại nhé!',
    starNew: 'Hoan hô! Bạn nhận được một ngôi sao vàng!',
    starAgain: 'Bạn đã có ngôi sao vàng ở trạm này rồi!',
    newBadge: 'Bạn còn nhận được huy hiệu mới!',
    finale: 'Hoan hô! Bạn đã đi trọn hành trình từ Lũng Cú tới Cà Mau và trở thành Nhà thám hiểm nhí Việt Nam!',

    /* trò chơi */
    whichWord: 'Hình này là chữ nào?',
    dir: { B: 'Hướng Bắc', 'Đ': 'Hướng Đông', N: 'Hướng Nam', T: 'Hướng Tây' },
    orderWrong: 'Chưa đúng thứ tự. Bước tiếp theo là gì nhỉ?',
    matchHint: 'Chạm vào tên phố, rồi chạm vào món hàng của phố đó!',
    street: 'Phố', sells: 'bán',
    findWho: 'Tìm giúp mình:',
    foundIt: 'Tìm thấy rồi!',
    caveGo: 'Đi vào hang có chữ:',
    duneGo: 'Trượt xuống đồi có chữ:',
    notThis: 'Không phải chỗ này rồi. Đây là chữ:',
    torchFind: 'Soi đèn tìm:',
    sunTap: 'Chạm vào ông mặt trời để soi nón lên nắng!',
    nonReveal: 'Woa! Trong nón có hình tháp chùa Thiên Mụ và câu ca dao:',
    verseHint: 'Chạm vào các chữ theo đúng thứ tự câu ca dao nhé!',
    lantern: 'Thắp đèn lồng',
    lanternIs: 'Đây là đèn lồng',
    boatsHint: 'Thả thuyền trong lễ Khao lề!',
    turtlesHint: 'Giúp rùa con về biển nào!',
    turtleHome: 'chú rùa đã về biển!',
    mapHint: 'Gợi ý: chạm vào vòng tròn màu vàng nhé!',
    meaningQ: 'nghĩa là gì?',
    meaningIs: 'nghĩa là',
    sunrise: 'Chạm vào ông mặt trời để đón bình minh!',
    sunriseDone: 'Bình minh lên rồi! Mũi Đôi đón mặt trời sớm nhất Việt Nam.',
    countAsk: 'Có bao nhiêu? Chạm vào từng con để đếm nhé!',
    countIs: 'Có tất cả',
    sentenceHint: 'Chạm vào các chữ theo đúng thứ tự để viết câu nhé!',
    simonListen: 'Nghe Trâu Con gõ nhé!',
    simonYou: 'Đến lượt bạn! Gõ lại đúng như vậy nhé.',
    simonWrong: 'Chưa đúng, nghe lại nhé!',
    collectWrong: 'Không phải cái này rồi!',
    price: 'giá',
    payNow: 'Bạn trả tiền nhé!',
    payOk: 'Bạn trả đúng rồi. Cảm ơn bạn!',
    payMore: 'Nhiều quá rồi! Bớt lại nhé.',
    payLess: 'Chưa đủ tiền rồi.',
    bheoAsk: 'Ghe nào bán',
    bheoThis: 'Ghe này bán',
    plantStart: 'Chạm vào bãi bùn để trồng cây đước!',
    plantOne: 'cây đước!',
    plantFlag: 'Rừng đước đã xanh! Chạm vào mũi đất để cắm cờ nhé!',
    plantDone: 'Chúng mình đã cắm cờ ở Đất Mũi Cà Mau, điểm cực Nam của Tổ quốc!'
  };

  /* Tách đoạn văn thành từng câu (để đọc từng câu và hiện phụ đề) */
  KP.splitSentences = function (t) {
    const parts = String(t).replace(/\s+/g, ' ').trim().split(/(?<=[.!?…]["”]?)\s+/);
    const out = [];
    parts.forEach(p => { if (out.length && /(^|\s)TP\.$/.test(out[out.length - 1])) out[out.length - 1] += ' ' + p; else if (p) out.push(p); });
    return out;
  };

  const U = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const words2 = n => n < 10 ? U[n] : n < 20 ? 'mười' + (n % 10 ? ' ' + (n % 10 === 5 ? 'lăm' : U[n % 10]) : '') : U[Math.floor(n / 10)] + ' mươi' + (n % 10 ? ' ' + (n % 10 === 1 ? 'mốt' : n % 10 === 5 ? 'lăm' : U[n % 10]) : '');
  KP.priceWords = p => words2(p / 1000) + ' nghìn đồng';
  KP.fmtMoney = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  /* Khoá của một câu nói = ngôn ngữ + mã băm của câu (đã chuẩn hoá) */
  KP.normText = t => String(t).normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
  KP.speechKey = function (t, lang) {
    const s = (lang || 'vi') + '|' + KP.normText(t);
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return (lang === 'en' ? 'e' : 'v') + h.toString(16).padStart(8, '0');
  };

  /* Danh sách MỌI câu mà trang có thể đọc */
  KP.allSpeech = function (opts) {
    opts = opts || {};
    const out = [], seen = new Set();
    let group = 'chung';
    const add = (t, lang, where) => {
      if (t == null) return;
      if (Array.isArray(t)) { t.forEach(x => add(x, lang, where)); return; }
      t = String(t).trim();
      if (!t || !/[a-zà-ỹđ0-9]/i.test(t)) return;
      lang = lang || 'vi';
      const key = KP.speechKey(t, lang);
      if (seen.has(key)) return;
      seen.add(key); out.push({ key, t, lang, where: where || '', g: group });
    };
    const PH = KP.PH;
    Object.keys(PH).forEach(k => { const v = PH[k]; add(typeof v === 'object' && !Array.isArray(v) ? Object.values(v) : v, 'vi', 'chung'); });
    (window.STOPS || []).forEach(s => {
      const w = s.name; group = s.id;
      add(s.travel.text, 'vi', w); add(KP.splitSentences(s.story), 'vi', w);
      s.keys.forEach(k => add(k.vi, 'vi', w));
      /* Lời Trâu Con trong video MP4 của trạm (nếu có) */
      const vf = window.VIDEO_FILES && window.VIDEO_FILES[s.id];
      if (vf && vf.cues) vf.cues.forEach(c => add(c.say || c.sub, 'vi', w + ' – phim'));
      s.words.forEach(x => { add(x.w, 'vi', w); add(x.ex, 'vi', w); });
      add(s.food.title, 'vi', w); add(s.food.text, 'vi', w); add(s.fact, 'vi', w);
      s.quiz.forEach(q => { add(q.q, 'vi', w); add(q.o, 'vi', w); add(q.why, 'vi', w); });
      const g = s.game;
      add([g.intro, g.prompt, g.doneMsg], 'vi', w);
      (g.rounds || []).forEach(r => { add(r.say, 'vi', w); add(r.options, 'vi', w); });
      (g.items || []).forEach(it => { add(it.t, 'vi', w); add(it.w, 'vi', w); add(it.note, 'vi', w); if (it.price) add(KP.priceWords(it.price), 'vi', w); });
      (g.pairs || []).forEach(p => { add(PH.street + ' ' + p.a, 'vi', w); add(p.b, 'vi', w); });
      (g.colors || []).forEach(c => add(c.w, 'vi', w));
      (g.sentences || []).forEach(sn => { add(sn, 'vi', w); add(sn.join(' ') + '!', 'vi', w); });
      if (g.verse) { add(g.verse, 'vi', w); add(g.verse.join(' '), 'vi', w); add(g.verse2, 'vi', w); }
      (g.meaning || []).forEach(m => { add('"' + m[0] + '" ' + PH.meaningQ, 'vi', w); add(m[0] + ' ' + PH.meaningIs + ' ' + m[1] + '.', 'vi', w); });
      if (g.meaningResult) add(g.meaningResult, 'vi', w);
      (g.bills || []).forEach(b => add(KP.priceWords(b), 'vi', w));
      (g.rounds || []).forEach(r => { if (r.target) { /* collect: lời nhắc đã có ở r.say */ } });
      if (opts.english !== false) {
        add([s.en.story, s.en.food, s.en.fact, s.en.game], 'en', w);
        s.keys.forEach(k => add(k.en, 'en', w));
        s.words.forEach(x => add(x.en, 'en', w));
        s.quiz.forEach(q => add(q.en, 'en', w));
      }
    });
    return out;
  };
})();
