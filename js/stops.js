/* =========================================================
   KHÁM PHÁ VIỆT NAM – Dữ liệu 31 trạm
   Thứ tự đi: từ Bắc (Cột cờ Lũng Cú) tới Nam (Đất Mũi Cà Mau).
   Tỉnh/thành ghi theo địa giới mới (34 tỉnh thành, từ 1/7/2025).

   Mỗi trạm có:
     travel  – câu mở đầu phim (Trâu Con lên đường)
     story   – lời kể trong phim giới thiệu
     keys    – "Ghi nhớ": những ý chính, câu đố sẽ hỏi lại đúng các ý này
     words   – thẻ từ: từ mới, câu ví dụ (ex), nghĩa tiếng Anh (en)
     food    – "Ăn gì, có gì", fact – "Bạn có biết?"
     quiz    – câu đố: q câu hỏi, o đáp án, a đáp án đúng, k ý ghi nhớ liên quan,
               why giải thích, en câu hỏi tiếng Anh
     en      – phần giải thích tiếng Anh (story, food, fact, game)
   Muốn sửa chữ: sửa trực tiếp trong file này.
   ========================================================= */

window.CHANG = [
  { id: 1, name: 'Núi rừng phía Bắc', color: '#7FB069', badge: '⛰️' },
  { id: 2, name: 'Đồng bằng Bắc Bộ', color: '#E8956B', badge: '🌾' },
  { id: 3, name: 'Bắc Trung Bộ', color: '#B48EAD', badge: '🧱' },
  { id: 4, name: 'Duyên hải miền Trung & biển đảo', color: '#5FA8C2', badge: '🌊' },
  { id: 5, name: 'Tây Nguyên & Nam Trung Bộ', color: '#C68B59', badge: '☕' },
  { id: 6, name: 'Nam Bộ & Đất Mũi', color: '#DDAA55', badge: '🛶' }
];

window.SPECIAL_BADGES = [
  { id: 'cuc', name: '4 điểm cực', icon: '🧭', desc: 'Đến đủ 4 điểm cực Bắc – Tây – Đông – Nam', stops: ['lung-cu', 'a-pa-chai', 'mui-doi', 'dat-mui'] },
  { id: 'bien-dao', name: 'Biển đảo quê hương', icon: '⚓', desc: 'Thăm quần đảo Hoàng Sa và quần đảo Trường Sa', stops: ['hoang-sa', 'truong-sa'] },
  { id: 'hoc', name: 'Nguồn cội giáo dục', icon: '📜', desc: 'Học ở Văn Miếu – Quốc Tử Giám', stops: ['van-mieu'] }
];

/* pos: [kinh độ, vĩ độ] · off: dịch nút trên bản đồ · lab: chỗ đặt tên (r/l/t/b)
   leg: cách đi tới trạm (land/sea/air) · via: điểm đường đi qua · cuc: điểm cực */
window.STOPS = [
  /* ================= CHẶNG 1: NÚI RỪNG PHÍA BẮC ================= */
  {
    id: 'lung-cu', chang: 1, icon: 'svg:vnflag', name: 'Cột cờ Lũng Cú', place: 'Tuyên Quang', placeNote: 'trước đây thuộc Hà Giang',
    pos: [105.316, 23.364], off: [0, 0], lab: 'l', leg: 'air', cuc: 'Bắc',
    scene: { sky: 'day', far: 'mountains', ground: 'rock', props: [['🌽', 14, 82, 9], ['☁️', 76, 18, 9]], special: 'flagpole' },
    travel: { icon: '✈️', text: 'Trâu Con bay từ Canada về Việt Nam, rồi đi xe máy qua những con đèo uốn lượn của cao nguyên đá Đồng Văn để lên Lũng Cú.' },
    story: 'Chào các bạn! Mình đang đứng ở Cột cờ Lũng Cú – nơi địa đầu Tổ quốc, rất gần điểm cực Bắc của Việt Nam. Cột cờ nằm trên đỉnh núi Rồng. Lá cờ đỏ sao vàng ở đây tung bay giữa trời mây.',
    keys: [
      { i: '🧭', vi: 'Cột cờ Lũng Cú ở miền Bắc, gần điểm cực Bắc của Việt Nam.', en: 'Lung Cu Flag Tower is in the North, near the northernmost point of Vietnam.' },
      { i: 'svg:vnflag', vi: 'Lá cờ Việt Nam nền đỏ, có ngôi sao vàng năm cánh.', en: "Vietnam's flag is red with a yellow five-pointed star." },
      { i: '🤝', vi: 'Việt Nam có 54 dân tộc anh em.', en: 'Vietnam has 54 ethnic groups.' }
    ],
    words: [
      { w: 'cột cờ', i: 'svg:vnflag', ex: 'Cột cờ Lũng Cú rất cao.', en: 'flagpole' },
      { w: 'ngôi sao', i: '⭐', ex: 'Lá cờ có ngôi sao vàng.', en: 'star' },
      { w: 'màu đỏ', i: '🟥', ex: 'Lá cờ có nền màu đỏ.', en: 'red' },
      { w: 'ngọn núi', i: '⛰️', ex: 'Cột cờ ở trên ngọn núi.', en: 'mountain' }
    ],
    food: { i: '🌽', title: 'Mèn mén', text: 'Mèn mén là món ăn làm từ bột ngô hấp chín của người H\'Mông ở vùng núi đá.' },
    fact: 'Lá cờ trên Cột cờ Lũng Cú rộng 54 mét vuông, tượng trưng cho 54 dân tộc anh em Việt Nam.',
    game: {
      type: 'raise', visual: 'flag', title: 'Kéo cờ lên đỉnh cột',
      intro: 'Mỗi lần các bạn chọn đúng chữ, lá cờ sẽ được kéo lên cao hơn. Cùng kéo cờ lên tới đỉnh nhé!',
      doneMsg: 'Lá cờ đã tung bay trên đỉnh cột!',
      rounds: [
        { pic: '🚩', say: 'cờ', options: ['cờ', 'cỏ', 'cô'] },
        { pic: '⭐', say: 'sao', options: ['sáo', 'sao', 'sào'] },
        { pic: '🟥', say: 'đỏ', options: ['đó', 'đò', 'đỏ'] },
        { pic: '🟨', say: 'vàng', options: ['vàng', 'vang', 'váng'] }
      ]
    },
    quiz: [
      { q: 'Cột cờ Lũng Cú ở miền nào của Việt Nam?', o: ['Miền Bắc', 'Miền Trung', 'Miền Nam'], a: 0, k: 0, why: 'Cột cờ Lũng Cú ở miền Bắc, nơi địa đầu Tổ quốc.', en: 'Which region of Vietnam is Lung Cu Flag Tower in?' },
      { q: 'Lá cờ Việt Nam có màu gì?', o: ['Nền xanh, sao trắng', 'Nền đỏ, sao vàng', 'Nền vàng, sao đỏ'], a: 1, k: 1, why: 'Lá cờ Việt Nam nền đỏ, có ngôi sao vàng năm cánh.', en: "What colours is Vietnam's flag?" },
      { q: 'Việt Nam có bao nhiêu dân tộc anh em?', o: ['45', '64', '54'], a: 2, k: 2, why: 'Việt Nam có 54 dân tộc anh em. Lá cờ ở Lũng Cú rộng 54 mét vuông.', en: 'How many ethnic groups does Vietnam have?' }
    ],
    en: {
      story: 'Hello! I am at Lung Cu Flag Tower, at the very top of Vietnam, close to its northernmost point. The tower stands on Dragon Mountain, and the red flag with a yellow star flies high in the sky.',
      food: "Mèn mén is steamed cornmeal, a traditional food of the H'Mông people in the rocky mountains.",
      fact: "The flag at Lung Cu is 54 square metres, one for each of Vietnam's 54 ethnic groups.",
      game: 'Choose the word that matches the picture. Listen carefully to the tone marks! Each right answer raises the flag higher.'
    }
  },
  {
    id: 'ban-gioc', chang: 1, icon: 'svg:waterfall', name: 'Thác Bản Giốc', place: 'Cao Bằng',
    pos: [106.722, 22.855], off: [0, 4], lab: 'r', leg: 'land', via: [[105.33, 23.18], [105.6, 22.92], [106.2, 22.75]],
    scene: { sky: 'day', far: 'mountains', water: 'river', ground: 'none', props: [['🛶', 70, 84, 11], ['☁️', 20, 16, 9]], special: 'waterfall' },
    travel: { icon: '🚌', text: 'Từ Lũng Cú, Trâu Con đi xe khách sang phía Đông, tới Cao Bằng có núi non hùng vĩ.' },
    story: 'Các bạn có nghe thấy tiếng nước reo không? Đây là thác Bản Giốc ở Cao Bằng, một trong những thác nước đẹp nhất Việt Nam. Nước đổ trắng xoá qua nhiều tầng đá. Ở đây có người Tày, người Nùng sinh sống, họ hát Then và chơi đàn tính rất hay.',
    keys: [
      { i: 'svg:waterfall', vi: 'Thác Bản Giốc ở tỉnh Cao Bằng, miền Bắc Việt Nam.', en: 'Ban Gioc Waterfall is in Cao Bang province, in northern Vietnam.' },
      { i: '🪜', vi: 'Nước ở thác Bản Giốc đổ qua nhiều tầng đá.', en: 'At Ban Gioc, the water falls over many layers of rock.' },
      { i: '🪕', vi: 'Người Tày, người Nùng hát Then và chơi đàn tính.', en: 'The Tay and Nung people sing Then songs and play the tinh lute.' }
    ],
    words: [
      { w: 'thác nước', i: 'svg:waterfall', ex: 'Thác nước chảy ầm ầm.', en: 'waterfall' },
      { w: 'dòng sông', i: 'svg:river', ex: 'Dòng sông chảy qua thác.', en: 'river' },
      { w: 'hạt dẻ', i: '🌰', ex: 'Hạt dẻ nướng thơm bùi.', en: 'chestnut' },
      { w: 'cây đàn', i: 'svg:dantinh', ex: 'Bà chơi cây đàn tính.', en: 'musical instrument (lute)' }
    ],
    food: { i: '🌰', title: 'Hạt dẻ Trùng Khánh', text: 'Hạt dẻ Trùng Khánh ở Cao Bằng to, bùi và thơm, nướng lên ăn rất ngon.' },
    fact: 'Hát Then của người Tày, Nùng, Thái đã được UNESCO ghi danh là di sản văn hoá phi vật thể của nhân loại.',
    game: {
      type: 'count', theme: 'river', title: 'Đếm ở thác Bản Giốc',
      intro: 'Chạm vào từng thứ để đếm, rồi chọn số đúng nhé!',
      doneMsg: 'Bạn đếm giỏi lắm!',
      rounds: [{ n: 4, i: '🌰' }, { n: 6, i: '🐟' }, { n: 3, i: '🦆' }, { n: 5, i: '🌰' }]
    },
    quiz: [
      { q: 'Thác Bản Giốc ở tỉnh nào?', o: ['Cao Bằng', 'Cà Mau', 'Lâm Đồng'], a: 0, k: 0, why: 'Thác Bản Giốc ở tỉnh Cao Bằng, miền Bắc Việt Nam.', en: 'Which province is Ban Gioc Waterfall in?' },
      { q: 'Nước ở thác Bản Giốc chảy như thế nào?', o: ['Chảy trên cát', 'Đổ qua nhiều tầng đá', 'Không chảy'], a: 1, k: 1, why: 'Nước đổ trắng xoá qua nhiều tầng đá.', en: 'How does the water flow at Ban Gioc?' },
      { q: 'Khi hát Then, người Tày, Nùng chơi đàn gì?', o: ['Đàn piano', 'Đàn ghi-ta điện', 'Đàn tính'], a: 2, k: 2, why: 'Người Tày, người Nùng hát Then và chơi đàn tính.', en: 'Which instrument do the Tay and Nung people play when singing Then?' }
    ],
    en: {
      story: 'Can you hear the water roaring? This is Ban Gioc Waterfall in Cao Bang, one of the most beautiful waterfalls in Vietnam. White water tumbles over many rock layers. The Tay and Nung people live here and love singing Then songs with the tinh lute.',
      food: 'Trung Khanh chestnuts from Cao Bang are big, sweet and nutty. They are delicious roasted.',
      fact: 'Then singing of the Tay, Nung and Thai peoples is recognised by UNESCO as Intangible Cultural Heritage of Humanity.',
      game: 'Tap each item to count it, then choose the right number word.'
    }
  },
  {
    id: 'ba-be', chang: 1, icon: '🛶', name: 'Hồ Ba Bể', place: 'Thái Nguyên', placeNote: 'trước đây thuộc Bắc Kạn',
    pos: [105.62, 22.41], off: [0, 0], lab: 'b', leg: 'land',
    scene: { sky: 'day', far: 'mountains', water: 'lake', ground: 'grass', props: [['🛶', 50, 76, 12], ['🐟', 24, 86, 8], ['🏝️', 78, 70, 10]] },
    travel: { icon: '🚌', text: 'Trâu Con đi xe khách qua những cánh rừng xanh để tới hồ Ba Bể.' },
    story: 'Mình đang ngồi thuyền độc mộc trên hồ Ba Bể – hồ nước ngọt tự nhiên lớn nhất Việt Nam! Hồ có ba nhánh nối với nhau, nên gọi là Ba Bể. Ở đây có truyện cổ tích "Sự tích hồ Ba Bể". Truyện kể về hai mẹ con bà goá tốt bụng đã giúp một bà cụ ăn xin.',
    keys: [
      { i: 'svg:lake', vi: 'Hồ Ba Bể là hồ nước ngọt tự nhiên lớn nhất Việt Nam.', en: 'Ba Be Lake is the largest natural freshwater lake in Vietnam.' },
      { i: '🛶', vi: 'Người Tày đi thuyền độc mộc, làm từ một thân cây.', en: 'The Tay people paddle dugout canoes made from one tree trunk.' },
      { i: '💛', vi: 'Truyện Sự tích hồ Ba Bể dạy chúng ta biết giúp đỡ người khó khăn.', en: 'The legend of Ba Be Lake teaches us to help people in need.' }
    ],
    words: [
      { w: 'hồ nước', i: 'svg:lake', ex: 'Hồ Ba Bể rất rộng.', en: 'lake' },
      { w: 'thuyền độc mộc', i: '🛶', ex: 'Thuyền độc mộc làm từ một thân cây.', en: 'dugout canoe' },
      { w: 'bà cụ', i: '👵', ex: 'Bà cụ chống gậy đi chậm.', en: 'old woman' },
      { w: 'hòn đảo', i: '🏝️', ex: 'Giữa hồ có hòn đảo nhỏ.', en: 'island' }
    ],
    food: { i: '🐟', title: 'Cá nướng hồ Ba Bể', text: 'Cá bắt ở hồ được nướng trên than hồng, thơm lừng.' },
    fact: 'Truyện kể rằng nhờ tốt bụng giúp bà cụ ăn xin, hai mẹ con bà goá được cứu khi nước dâng thành hồ, rồi họ chèo thuyền đi cứu mọi người.',
    game: {
      type: 'order', visual: 'steps', title: 'Kể lại Sự tích hồ Ba Bể',
      intro: 'Chạm vào các tranh theo đúng thứ tự câu chuyện nhé!',
      prompt: 'Câu chuyện bắt đầu thế nào nhỉ?',
      doneMsg: 'Bạn đã kể lại câu chuyện thật hay!',
      items: [
        { t: 'Bà cụ ăn xin đến lễ hội', i: '👵' }, { t: 'Mẹ con bà goá cho bà cụ ăn', i: '🍚' },
        { t: 'Đêm đó nước dâng thành hồ', i: '🌊' }, { t: 'Hai mẹ con chèo thuyền cứu mọi người', i: '🛶' }
      ]
    },
    quiz: [
      { q: 'Hồ Ba Bể là hồ gì?', o: ['Hồ nước ngọt tự nhiên lớn nhất Việt Nam', 'Hồ nước mặn', 'Hồ bơi'], a: 0, k: 0, why: 'Hồ Ba Bể là hồ nước ngọt tự nhiên lớn nhất Việt Nam.', en: 'What is special about Ba Be Lake?' },
      { q: 'Thuyền độc mộc làm từ gì?', o: ['Nhựa', 'Một thân cây', 'Sắt'], a: 1, k: 1, why: 'Thuyền độc mộc được khoét từ một thân cây to.', en: 'What is a dugout canoe made from?' },
      { q: 'Truyện Sự tích hồ Ba Bể dạy chúng ta điều gì?', o: ['Biết giúp đỡ người khó khăn', 'Ăn thật nhiều', 'Ngủ thật muộn'], a: 0, k: 2, why: 'Hai mẹ con bà goá tốt bụng giúp người nghèo nên được cứu.', en: 'What does the legend of Ba Be Lake teach us?' }
    ],
    en: {
      story: 'I am riding a dugout canoe on Ba Be Lake, the largest natural freshwater lake in Vietnam! It has three connected parts, so it is called Ba Be. There is a folk tale about this lake: a kind widow and her son helped a poor old woman.',
      food: 'Fish from the lake is grilled over hot charcoal and smells wonderful.',
      fact: 'The legend says the kind widow and her son were saved when the flood made the lake, and then they paddled around to rescue other people.',
      game: 'Tap the pictures in the order of the story.'
    }
  },
  {
    id: 'sa-pa', chang: 1, icon: '🌾', name: 'Sa Pa – Fansipan', mapName: 'Sa Pa', place: 'Lào Cai',
    pos: [103.844, 22.336], off: [0, 4], lab: 'b', leg: 'land', via: [[104.6, 22.3]],
    scene: { sky: 'day', far: 'mountains', ground: 'terraces', props: [['☁️', 20, 20, 10], ['☁️', 70, 14, 8], ['🧵', 84, 84, 9]], special: 'terraces' },
    travel: { icon: '🚌', text: 'Từ hồ Ba Bể, Trâu Con đi xe khách sang Lào Cai, rồi lên Sa Pa mờ sương.' },
    story: 'Sa Pa đây rồi! Ở đây có đỉnh Fansipan cao hơn 3.100 mét, được gọi là "nóc nhà Đông Dương". Các bạn nhìn những thửa ruộng bậc thang kìa. Chúng giống như những bậc cầu thang khổng lồ trên sườn núi!',
    keys: [
      { i: '🏔️', vi: 'Đỉnh Fansipan ở Sa Pa được gọi là "nóc nhà Đông Dương".', en: 'Mount Fansipan in Sa Pa is called "the Roof of Indochina".' },
      { i: 'svg:terraces', vi: 'Ruộng bậc thang dùng để trồng lúa.', en: 'Terraced fields are used to grow rice.' },
      { i: '📍', vi: 'Sa Pa thuộc tỉnh Lào Cai.', en: 'Sa Pa is in Lao Cai province.' }
    ],
    words: [
      { w: 'ruộng bậc thang', i: 'svg:terraces', ex: 'Ruộng bậc thang như cầu thang khổng lồ.', en: 'terraced rice fields' },
      { w: 'đám mây', i: '☁️', ex: 'Đám mây trắng bay trên núi.', en: 'cloud' },
      { w: 'cây lúa', i: '🌾', ex: 'Cây lúa cho ta hạt gạo.', en: 'rice plant' },
      { w: 'thổ cẩm', i: 'svg:brocade', ex: 'Cô dệt vải thổ cẩm nhiều màu.', en: 'hand-woven brocade' }
    ],
    food: { i: '🐟', title: 'Cá hồi Sa Pa', text: 'Cá hồi được nuôi trong dòng suối nước lạnh trên núi cao Sa Pa.' },
    fact: 'Người H\'Mông và người Dao đỏ ở Sa Pa dệt vải thổ cẩm với hoa văn nhiều màu rất đẹp.',
    game: {
      type: 'order', visual: 'rice', title: 'Trồng lúa trên ruộng bậc thang',
      intro: 'Cây lúa lớn lên như thế nào? Chạm vào các bước theo đúng thứ tự nhé!',
      prompt: 'Cây lúa lớn lên thế nào? Chọn bước đầu tiên!',
      doneMsg: 'Ruộng bậc thang đã vàng óng lúa chín!',
      items: [{ t: 'Gieo mạ', i: '🌱' }, { t: 'Cấy lúa', i: '🧑‍🌾' }, { t: 'Lúa chín vàng', i: '🌾' }, { t: 'Gặt lúa', i: '🧺' }]
    },
    quiz: [
      { q: 'Đỉnh Fansipan được gọi là gì?', o: ['Nóc nhà Đông Dương', 'Nóc nhà thế giới', 'Đỉnh mây trắng'], a: 0, k: 0, why: 'Fansipan rất cao nên được gọi là nóc nhà Đông Dương.', en: 'What is Mount Fansipan called?' },
      { q: 'Ruộng bậc thang dùng để trồng gì?', o: ['Cà phê', 'Lúa', 'Dừa'], a: 1, k: 1, why: 'Người dân trồng lúa trên ruộng bậc thang.', en: 'What do people grow on terraced fields?' },
      { q: 'Sa Pa thuộc tỉnh nào?', o: ['Cà Mau', 'Lâm Đồng', 'Lào Cai'], a: 2, k: 2, why: 'Sa Pa thuộc tỉnh Lào Cai.', en: 'Which province is Sa Pa in?' }
    ],
    en: {
      story: 'Here is Sa Pa! Mount Fansipan, over 3,100 metres high, is called the Roof of Indochina. Look at the terraced rice fields. They look like giant stairs on the mountainside!',
      food: 'Sa Pa trout and salmon are raised in cold mountain streams.',
      fact: "The H'Mông and Red Dao people in Sa Pa weave colourful brocade cloth.",
      game: 'How does rice grow? Tap the steps in the right order.'
    }
  },
  {
    id: 'a-pa-chai', chang: 1, icon: '🧭', name: 'A Pa Chải', place: 'Điện Biên',
    pos: [102.144, 22.397], off: [6, 0], lab: 'b', leg: 'land', cuc: 'Tây',
    scene: { sky: 'sunset', far: 'mountains', ground: 'grass', props: [['🪧', 50, 66, 13], ['🐓', 22, 80, 10], ['🎋', 82, 74, 12]] },
    travel: { icon: '🚌', text: 'Trâu Con đi xe khách qua đèo Ô Quy Hồ – một trong những con đèo dài và đẹp nhất miền Bắc – về phía Tây tới Điện Biên, rồi leo bộ lên đỉnh núi Khoan La San.' },
    story: 'Mình tới A Pa Chải rồi! Đây là điểm cực Tây của Việt Nam, nơi có cột mốc số 0 – ngã ba biên giới của Việt Nam, Lào và Trung Quốc. Người ta nói: ở đây, một tiếng gà gáy, ba nước cùng nghe!',
    keys: [
      { i: '🧭', vi: 'A Pa Chải là điểm cực Tây của Việt Nam.', en: 'A Pa Chai is the westernmost point of Vietnam.' },
      { i: '🐓', vi: 'Ở A Pa Chải, một tiếng gà gáy, ba nước cùng nghe.', en: 'At A Pa Chai, a rooster crow can be heard in three countries.' },
      { i: '🎋', vi: 'Cơm lam là gạo nếp nấu trong ống tre.', en: 'Cơm lam is sticky rice cooked in bamboo tubes.' }
    ],
    words: [
      { w: 'phía Tây', i: '🧭', ex: 'Mặt trời lặn ở phía Tây.', en: 'the west' },
      { w: 'cột mốc', i: 'svg:marker', ex: 'Cột mốc số 0 ở A Pa Chải.', en: 'border marker' },
      { w: 'con gà', i: '🐓', ex: 'Con gà gáy ò ó o.', en: 'rooster / chicken' },
      { w: 'mặt trời lặn', i: 'svg:sunsetmtn', ex: 'Buổi chiều, mặt trời lặn.', en: 'sunset' }
    ],
    food: { i: '🎋', title: 'Cơm lam', text: 'Gạo nếp cho vào ống tre non, nướng trên lửa. Bóc lớp tre ra là có cơm lam thơm dẻo.' },
    fact: 'Bản A Pa Chải là nơi sinh sống của người Hà Nhì, nổi tiếng với những ngôi nhà có tường đất dày.',
    game: {
      type: 'compass', title: 'La bàn của Trâu Con',
      intro: 'Nghe Trâu Con hỏi rồi chạm vào đúng hướng trên la bàn nhé!',
      doneMsg: 'Bạn đã thuộc bốn hướng Đông, Tây, Nam, Bắc!',
      rounds: [
        { say: 'Chạm vào hướng Bắc', a: 'B' }, { say: 'Chạm vào hướng Tây', a: 'T' },
        { say: 'Mặt trời mọc ở hướng nào?', a: 'Đ' }, { say: 'Mặt trời lặn ở hướng nào?', a: 'T' },
        { say: 'Chạm vào hướng Nam', a: 'N' }, { say: 'A Pa Chải ở phía nào của Việt Nam?', a: 'T' }
      ]
    },
    quiz: [
      { q: 'A Pa Chải là điểm cực nào của Việt Nam?', o: ['Cực Đông', 'Cực Tây', 'Cực Nam'], a: 1, k: 0, why: 'A Pa Chải ở xa nhất về phía Tây, nên là điểm cực Tây.', en: 'Which extreme point of Vietnam is A Pa Chai?' },
      { q: 'Ở A Pa Chải, một tiếng gà gáy có thể nghe thấy ở mấy nước?', o: ['3 nước', '2 nước', '5 nước'], a: 0, k: 1, why: 'Đây là ngã ba biên giới của Việt Nam, Lào và Trung Quốc.', en: 'At A Pa Chai, a rooster crow can be heard in how many countries?' },
      { q: 'Cơm lam được nấu trong gì?', o: ['Nồi đất', 'Lá chuối', 'Ống tre'], a: 2, k: 2, why: 'Cơm lam được nấu trong ống tre non.', en: 'What is cơm lam cooked in?' }
    ],
    en: {
      story: "I've reached A Pa Chai, the westernmost point of Vietnam! Here is border marker number 0, where Vietnam, Laos and China meet. People say a rooster's crow here can be heard in three countries!",
      food: 'Sticky rice is put into young bamboo tubes and roasted over a fire. Peel the bamboo and you get soft, fragrant cơm lam.',
      fact: 'A Pa Chai village is home to the Ha Nhi people, known for houses with thick earth walls.',
      game: 'Listen to Trau Con and tap the right direction on the compass.'
    }
  },
  {
    id: 'moc-chau', chang: 1, icon: '🐄', name: 'Cao nguyên Mộc Châu', mapName: 'Mộc Châu', place: 'Sơn La',
    pos: [104.68, 20.85], off: [0, 0], lab: 'l', leg: 'land',
    scene: { sky: 'day', far: 'hills', ground: 'grass', props: [['🐄', 22, 78, 12], ['💮', 62, 84, 9], ['💮', 74, 88, 8]], special: 'teahills' },
    travel: { icon: '🚌', text: 'Từ A Pa Chải, Trâu Con đi xe khách về cao nguyên Mộc Châu mát mẻ.' },
    story: 'Chào mừng các bạn đến cao nguyên Mộc Châu! Ở đây có những đồi chè xanh mướt, có cả đồi chè hình trái tim. Mùa xuân, hoa mận nở trắng núi đồi. Mộc Châu còn nổi tiếng với những đàn bò sữa và sữa tươi thơm ngon.',
    keys: [
      { i: 'svg:teahill', vi: 'Mộc Châu có những đồi chè xanh, có đồi chè hình trái tim.', en: 'Moc Chau has green tea hills, including a heart-shaped one.' },
      { i: '🐄', vi: 'Mộc Châu nổi tiếng với bò sữa và sữa tươi.', en: 'Moc Chau is famous for dairy cows and fresh milk.' },
      { i: 'svg:plum', vi: 'Mùa xuân, hoa mận nở trắng núi đồi Mộc Châu.', en: 'In spring, white plum blossoms cover the hills of Moc Chau.' }
    ],
    words: [
      { w: 'đồi chè', i: 'svg:teahill', ex: 'Đồi chè xanh mướt.', en: 'tea hill' },
      { w: 'con bò', i: '🐄', ex: 'Con bò cho ta sữa.', en: 'cow' },
      { w: 'sữa', i: '🥛', ex: 'Em uống sữa mỗi sáng.', en: 'milk' },
      { w: 'hoa mận', i: 'svg:plum', ex: 'Hoa mận nở trắng núi đồi.', en: 'plum blossom' }
    ],
    food: { i: '🥛', title: 'Sữa và bánh sữa Mộc Châu', text: 'Sữa bò tươi Mộc Châu béo thơm, còn được làm thành bánh sữa ngọt ngào.' },
    fact: 'Ở Mộc Châu có người Thái, người H\'Mông sinh sống. Mùa xuân, hoa mận và hoa cải nở trắng cả cao nguyên.',
    game: {
      type: 'collect', bg: 'farm', title: 'Một ngày ở nông trại Mộc Châu',
      intro: 'Nghe Trâu Con nhờ, rồi chạm vào đúng những thứ cần tìm nhé!',
      doneMsg: 'Bạn đã giúp nông trại Mộc Châu thật giỏi!',
      rounds: [
        { say: 'Hái 5 búp chè', target: '🍃', n: 5, other: ['🌸', '🌼', '🍂'] },
        { say: 'Tìm tất cả các bạn bò sữa', target: '🐄', n: 3, other: ['🐐', '🐖', '🐓'] },
        { say: 'Chạm vào tất cả bông hoa mận trắng', target: '💮', n: 4, other: ['🌺', '🌻', '🌷'] }
      ]
    },
    quiz: [
      { q: 'Ở Mộc Châu có đồi chè hình gì rất nổi tiếng?', o: ['Hình trái tim', 'Hình con cá', 'Hình ngôi sao'], a: 0, k: 0, why: 'Mộc Châu có đồi chè hình trái tim rất đẹp.', en: 'What shape is the famous tea hill in Moc Chau?' },
      { q: 'Mộc Châu nổi tiếng với con vật nào?', o: ['Cá voi', 'Bò sữa', 'Chim cánh cụt'], a: 1, k: 1, why: 'Mộc Châu nổi tiếng với bò sữa và sữa tươi.', en: 'Which animal is Moc Chau famous for?' },
      { q: 'Mùa xuân ở Mộc Châu, hoa gì nở trắng núi đồi?', o: ['Hoa sen', 'Hoa hướng dương', 'Hoa mận'], a: 2, k: 2, why: 'Mùa xuân, hoa mận nở trắng núi đồi Mộc Châu.', en: 'Which flower turns the hills white in spring?' }
    ],
    en: {
      story: 'Welcome to the Moc Chau plateau! There are bright green tea hills here, and one is shaped like a heart. In spring, white plum blossoms cover the hills. Moc Chau is also famous for its dairy cows and fresh milk.',
      food: "Fresh cow's milk from Moc Chau is rich and creamy. It is also made into sweet milk cakes.",
      fact: "The Thai and H'Mông peoples live in Moc Chau. In spring, plum and mustard flowers turn the plateau white.",
      game: "Listen to Trau Con's request, then tap all the right things."
    }
  },
  {
    id: 'den-hung', chang: 1, icon: 'svg:banhchung', name: 'Đền Hùng', place: 'Phú Thọ',
    pos: [105.33, 21.37], off: [-6, -6], lab: 'l', leg: 'land',
    scene: { sky: 'day', far: 'hills', ground: 'grass', props: [['🟩', 30, 76, 13], ['⚪', 48, 80, 11], ['🍃', 66, 78, 11], ['🌳', 86, 64, 14]] },
    travel: { icon: '🚌', text: 'Trâu Con đi ô tô về vùng trung du Phú Thọ, ngang qua những đồi chè xanh mướt.' },
    story: 'Mình đang ở Đền Hùng, trên núi Nghĩa Lĩnh. Nơi đây thờ các Vua Hùng – những người đã dựng nên nước Văn Lang xưa. Ông bà ta có câu: "Dù ai đi ngược về xuôi, nhớ ngày giỗ Tổ mùng mười tháng ba".',
    keys: [
      { i: '📅', vi: 'Giỗ Tổ Hùng Vương là ngày mùng 10 tháng 3 âm lịch.', en: 'Hung Kings Commemoration Day is on the 10th day of the 3rd lunar month.' },
      { i: 'svg:banhchung', vi: 'Bánh chưng hình vuông tượng trưng cho đất, bánh giầy hình tròn tượng trưng cho trời.', en: 'Square bánh chưng stands for the earth; round bánh giầy stands for the sky.' },
      { i: '👦', vi: 'Lang Liêu là người làm ra bánh chưng, bánh giầy.', en: 'Prince Lang Liêu made the first bánh chưng and bánh giầy.' }
    ],
    words: [
      { w: 'bánh chưng', i: 'svg:banhchung', ex: 'Tết đến, nhà em gói bánh chưng.', en: 'square sticky rice cake' },
      { w: 'bánh giầy', i: 'svg:banhgiay', ex: 'Bánh giầy tròn và trắng.', en: 'round sticky rice cake' },
      { w: 'lá dong', i: 'svg:ladong', ex: 'Bánh chưng gói bằng lá dong.', en: 'dong leaves (for wrapping)' },
      { w: 'gạo nếp', i: '🍚', ex: 'Mẹ ngâm gạo nếp để gói bánh.', en: 'sticky rice' }
    ],
    food: { i: 'svg:banhchung', title: 'Bánh chưng, bánh giầy', text: 'Bánh chưng hình vuông tượng trưng cho đất, bánh giầy hình tròn tượng trưng cho trời – theo truyện cổ tích Lang Liêu.' },
    fact: 'Tín ngưỡng thờ cúng Hùng Vương ở Phú Thọ đã được UNESCO ghi danh là di sản văn hoá phi vật thể của nhân loại.',
    game: {
      type: 'order', visual: 'banhchung', title: 'Gói bánh chưng',
      intro: 'Cùng Trâu Con gói bánh chưng! Chạm vào nguyên liệu theo đúng thứ tự nhé.',
      prompt: 'Gói bánh chưng: bắt đầu từ đâu nhỉ?',
      doneMsg: 'Bánh chưng đã gói xong, thơm phức!',
      items: [{ t: 'Trải lá dong', i: '🍃' }, { t: 'Đổ gạo nếp', i: '🍚' }, { t: 'Thêm đậu xanh', i: '🟡' }, { t: 'Thêm thịt', i: '🥩' }, { t: 'Gói và buộc lạt', i: '🎀' }, { t: 'Luộc bánh', i: '🔥' }]
    },
    quiz: [
      { q: 'Giỗ Tổ Hùng Vương vào ngày nào (âm lịch)?', o: ['Mùng 1 Tết', 'Mùng 10 tháng 3', 'Rằm tháng 8'], a: 1, k: 0, why: 'Giỗ Tổ Hùng Vương là ngày mùng 10 tháng 3 âm lịch.', en: 'When is Hung Kings Commemoration Day (lunar calendar)?' },
      { q: 'Bánh chưng có hình gì?', o: ['Hình vuông', 'Hình tròn', 'Hình tam giác'], a: 0, k: 1, why: 'Bánh chưng hình vuông, tượng trưng cho đất.', en: 'What shape is bánh chưng?' },
      { q: 'Trong truyện cổ tích, ai đã làm ra bánh chưng, bánh giầy?', o: ['Thánh Gióng', 'Sơn Tinh', 'Lang Liêu'], a: 2, k: 2, why: 'Hoàng tử Lang Liêu đã làm ra bánh chưng, bánh giầy dâng vua cha.', en: 'In the folk tale, who made the first bánh chưng and bánh giầy?' }
    ],
    en: {
      story: "I'm at the Hung Temple on Nghia Linh Mountain. People honour the Hung Kings here, who founded the ancient land of Van Lang. Our grandparents say: wherever you go, remember the Ancestors' Day on the 10th day of the 3rd lunar month.",
      food: 'Square bánh chưng stands for the earth, and round bánh giầy stands for the sky, from the story of Prince Lang Liêu.',
      fact: 'The worship of the Hung Kings in Phu Tho is recognised by UNESCO as Intangible Cultural Heritage of Humanity.',
      game: "Let's wrap bánh chưng with Trau Con! Tap the ingredients in the right order."
    }
  },

  /* ================= CHẶNG 2: ĐỒNG BẰNG BẮC BỘ ================= */
  {
    id: 'ha-noi', chang: 2, icon: '🌉', name: 'Hà Nội – Hồ Gươm', mapName: 'Hồ Gươm', place: 'Thủ đô Hà Nội',
    pos: [105.852, 21.029], off: [10, -8], lab: 'r', leg: 'land',
    scene: { sky: 'day', far: 'city', water: 'lake', ground: 'grass', props: [['🐢', 30, 70, 10], ['🌳', 10, 62, 14], ['🛺', 80, 84, 11]], special: 'thehuc' },
    travel: { icon: '🛺', text: 'Trâu Con về tới Thủ đô, rồi ngồi xích lô dạo quanh phố cổ Hà Nội.' },
    story: 'Chào mừng các bạn tới Hà Nội – Thủ đô của Việt Nam! Đây là Hồ Gươm, còn gọi là hồ Hoàn Kiếm. Truyền thuyết kể rằng vua Lê Lợi đã trả lại gươm thần cho Rùa Vàng ở chính hồ này. Kia là cầu Thê Húc màu đỏ và Tháp Rùa giữa hồ!',
    keys: [
      { i: '🏙️', vi: 'Hà Nội là Thủ đô của Việt Nam.', en: 'Hanoi is the capital of Vietnam.' },
      { i: '🐢', vi: 'Hồ Gươm còn gọi là hồ Hoàn Kiếm, nơi vua Lê Lợi trả gươm cho Rùa Vàng.', en: 'Sword Lake (Hoan Kiem Lake) is where King Le Loi returned the magic sword to the Golden Turtle.' },
      { i: '🏘️', vi: 'Phố cổ Hà Nội có 36 phố phường, nhiều phố tên là "Hàng…".', en: 'Hanoi Old Quarter has "36 streets", many named "Hàng…" after the goods once sold there.' }
    ],
    words: [
      { w: 'hồ nước', i: 'svg:hoguom', ex: 'Hồ Gươm có nước xanh.', en: 'lake' },
      { w: 'con rùa', i: '🐢', ex: 'Con rùa bơi chậm chạp.', en: 'turtle' },
      { w: 'cây cầu', i: 'svg:redbridge', ex: 'Cầu Thê Húc màu đỏ.', en: 'bridge' },
      { w: 'phố cổ', i: '🏘️', ex: 'Phố cổ có nhiều cửa hàng.', en: 'old quarter' }
    ],
    food: { i: '🍜', title: 'Phở Hà Nội', text: 'Bát phở nóng hổi với bánh phở mềm, nước dùng thơm và thịt bò – món ăn sáng nổi tiếng của Hà Nội.' },
    fact: 'Tên cầu Thê Húc có nghĩa là "nơi đậu ánh sáng mặt trời buổi sớm".',
    game: {
      type: 'match', title: 'Dạo 36 phố phường',
      intro: 'Ngày xưa, mỗi phố "Hàng…" bán một thứ hàng. Chạm vào tên phố, rồi chạm vào món hàng của phố đó nhé!',
      doneMsg: 'Bạn đã dạo hết các phố Hàng!',
      pairs: [
        { a: 'Hàng Muối', b: 'muối', i: '🧂' }, { a: 'Hàng Gà', b: 'gà', i: '🐔' }, { a: 'Hàng Cá', b: 'cá', i: '🐟' },
        { a: 'Hàng Bạc', b: 'đồ bạc', i: '💍' }, { a: 'Hàng Mã', b: 'đèn Trung thu', i: '🏮' }
      ]
    },
    quiz: [
      { q: 'Hồ Gươm còn có tên là gì?', o: ['Hồ Tây', 'Hồ Hoàn Kiếm', 'Hồ Xuân Hương'], a: 1, k: 1, why: 'Hồ Gươm còn gọi là hồ Hoàn Kiếm, nghĩa là hồ trả gươm.', en: 'What is the other name of Sword Lake?' },
      { q: 'Trong truyền thuyết, vua Lê Lợi trả gươm cho con vật nào?', o: ['Rùa Vàng', 'Con rồng', 'Cá chép'], a: 0, k: 1, why: 'Vua Lê Lợi trả gươm thần cho Rùa Vàng ở Hồ Gươm.', en: 'In the legend, King Le Loi returned the sword to which animal?' },
      { q: 'Thủ đô của Việt Nam là thành phố nào?', o: ['Huế', 'Đà Nẵng', 'Hà Nội'], a: 2, k: 0, why: 'Hà Nội là Thủ đô của Việt Nam.', en: 'What is the capital of Vietnam?' }
    ],
    en: {
      story: 'Welcome to Hanoi, the capital of Vietnam! This is Sword Lake, also called Hoan Kiem Lake. Legend says King Le Loi returned his magic sword to the Golden Turtle here. Look at the red The Huc Bridge and the Turtle Tower in the middle of the lake!',
      food: 'A hot bowl of phở with soft rice noodles, fragrant broth and beef is Hanoi\'s famous breakfast.',
      fact: "The name The Huc Bridge means 'where the morning sunlight rests'.",
      game: "Long ago each 'Hàng…' street sold one kind of goods. Tap a street, then tap what it sold."
    }
  },
  {
    id: 'van-mieu', chang: 2, icon: '📜', name: 'Văn Miếu – Quốc Tử Giám', mapName: 'Văn Miếu', place: 'Thủ đô Hà Nội',
    pos: [105.836, 21.028], off: [-12, 30], lab: 'r', leg: 'land',
    scene: { sky: 'day', far: 'none', ground: 'grass', props: [['🐢', 20, 86, 10], ['📜', 82, 84, 10], ['🌳', 6, 58, 15], ['🌳', 94, 58, 15]], special: 'khuevancac' },
    travel: { icon: '🛺', text: 'Từ Hồ Gươm, Trâu Con đi xích lô tới Văn Miếu – Quốc Tử Giám.' },
    story: 'Mình đang ở Văn Miếu – Quốc Tử Giám. Quốc Tử Giám là trường đại học đầu tiên của Việt Nam, có từ năm 1076, gần 1.000 năm trước! Kia là Khuê Văn Các, biểu tượng của Thủ đô Hà Nội. Ở đây có 82 tấm bia đá đặt trên lưng rùa, ghi tên những người học giỏi đỗ tiến sĩ ngày xưa.',
    keys: [
      { i: '🏫', vi: 'Quốc Tử Giám là trường đại học đầu tiên của Việt Nam, có từ năm 1076.', en: 'Quoc Tu Giam was the first university of Vietnam, founded in 1076.' },
      { i: '🙏', vi: 'Tiên học lễ, hậu học văn: trước học lễ phép, sau học chữ.', en: '"First learn manners, then learn letters": respect and good behaviour come before knowledge.' },
      { i: '✍️', vi: 'Chữ viết của người Việt: ngày xưa học chữ Hán, rồi có chữ Nôm, nay dùng chữ Quốc ngữ.', en: 'Vietnamese writing: long ago Chinese characters, then Nôm script, and today Quốc ngữ, written with the Latin alphabet.' },
      { i: '🐢', vi: '82 bia tiến sĩ đặt trên lưng rùa đá, ghi tên những người học giỏi.', en: '82 stone steles on the backs of stone turtles list the names of top scholars.' }
    ],
    words: [
      { w: 'trường học', i: '🏫', ex: 'Em đi học ở trường.', en: 'school' },
      { w: 'thầy giáo', i: '👨‍🏫', ex: 'Em kính yêu thầy giáo.', en: 'teacher' },
      { w: 'bia đá', i: 'svg:stele', ex: 'Bia đá ghi tên người học giỏi.', en: 'stone stele' },
      { w: 'chữ viết', i: '✍️', ex: 'Em tập viết chữ thật đẹp.', en: 'writing / script' }
    ],
    food: { i: '🖌️', title: 'Xin chữ ngày Tết', text: 'Dịp Tết, nhiều người đến Văn Miếu xin ông đồ viết chữ đẹp, như chữ "Phúc" hay chữ "Học", mang về nhà để mong một năm học hành chăm chỉ.' },
    fact: 'Ngày xưa ông cha ta học chữ Hán. Sau đó người Việt sáng tạo ra chữ Nôm để ghi tiếng Việt. Ngày nay chúng ta dùng chữ Quốc ngữ, viết bằng các chữ cái a, b, c. Thầy giáo Chu Văn An nổi tiếng từng dạy học ở Quốc Tử Giám.',
    game: {
      type: 'sentence', visual: 'vanmieu', title: 'Tiên học lễ, hậu học văn',
      intro: 'Chạm vào các chữ theo đúng thứ tự để viết lại những câu Trâu Con vừa học nhé!',
      doneMsg: 'Bạn đã nhớ lời dạy của ông cha: Tiên học lễ, hậu học văn!',
      sentences: [['Tiên học', 'lễ,', 'hậu học', 'văn'], ['Chữ Hán,', 'rồi chữ Nôm,', 'nay là', 'chữ Quốc ngữ']]
    },
    quiz: [
      { q: 'Trường đại học đầu tiên của Việt Nam là gì?', o: ['Quốc Tử Giám', 'Chợ Bến Thành', 'Cột cờ Lũng Cú'], a: 0, k: 0, why: 'Quốc Tử Giám là trường đại học đầu tiên của Việt Nam, có từ năm 1076.', en: 'What was the first university of Vietnam?' },
      { q: '"Tiên học lễ, hậu học văn" nghĩa là gì?', o: ['Chỉ cần học chữ', 'Trước học lễ phép, sau học chữ', 'Học chơi trước, học bài sau'], a: 1, k: 1, why: 'Ông cha dạy: phải học lễ phép trước, rồi mới học chữ.', en: 'What does "Tiên học lễ, hậu học văn" mean?' },
      { q: 'Chữ viết chúng ta dùng ngày nay là chữ gì?', o: ['Chữ Hán', 'Chữ Nôm', 'Chữ Quốc ngữ'], a: 2, k: 2, why: 'Ngày nay chúng ta dùng chữ Quốc ngữ, viết bằng chữ cái a, b, c.', en: 'Which writing system do we use today?' }
    ],
    en: {
      story: "I'm at the Temple of Literature and Quoc Tu Giam. Quoc Tu Giam was the first university of Vietnam, founded in 1076, almost 1,000 years ago! That is Khue Van Cac, the symbol of Hanoi. There are 82 stone steles on the backs of stone turtles, carved with the names of the best scholars of the past.",
      food: "At Tet, many people come to the Temple of Literature to ask calligraphers to write beautiful words such as 'Phúc' (happiness) or 'Học' (learning), hoping for a year of good study.",
      fact: 'Long ago our ancestors learned Chinese characters. Later, Vietnamese people created Nôm script to write the Vietnamese language. Today we use Quốc ngữ, written with the letters a, b, c. The famous teacher Chu Van An once taught at Quoc Tu Giam.',
      game: 'Tap the words in the right order to rebuild the sentences you just learned.'
    }
  },
  {
    id: 'ha-long', chang: 2, icon: '⛵', name: 'Vịnh Hạ Long', place: 'Quảng Ninh',
    pos: [107.08, 20.91], off: [30, 10], lab: 'r', leg: 'land',
    scene: { sky: 'day', far: 'karst', water: 'sea', ground: 'none', props: [['⛵', 62, 70, 13], ['🐉', 82, 20, 11], ['🐟', 30, 88, 8]] },
    travel: { icon: '⛵', text: 'Trâu Con lên một chiếc thuyền buồm nâu, chầm chậm đi giữa những hòn đảo đá vôi.' },
    story: 'Woa, Vịnh Hạ Long đẹp quá! Ở đây có gần 2.000 hòn đảo lớn nhỏ. Truyền thuyết kể rằng ngày xưa, Rồng Mẹ và đàn rồng con bay xuống giúp dân đánh giặc, nhả ngọc tạo thành những hòn đảo này. Vì thế mới có tên "Hạ Long" – nghĩa là rồng đáp xuống!',
    keys: [
      { i: '🏝️', vi: 'Vịnh Hạ Long có gần 2.000 hòn đảo lớn nhỏ.', en: 'Ha Long Bay has nearly 2,000 islands.' },
      { i: '🐉', vi: '"Hạ Long" nghĩa là rồng đáp xuống.', en: '"Ha Long" means "descending dragon".' },
      { i: '📍', vi: 'Vịnh Hạ Long thuộc tỉnh Quảng Ninh, là di sản thiên nhiên thế giới.', en: 'Ha Long Bay is in Quang Ninh province and is a World Natural Heritage site.' }
    ],
    words: [
      { w: 'hòn đảo', i: '🏝️', ex: 'Hòn đảo nhô lên giữa biển.', en: 'island' },
      { w: 'con thuyền', i: '⛵', ex: 'Con thuyền đi trên vịnh.', en: 'boat' },
      { w: 'con rồng', i: '🐉', ex: 'Con rồng bay trên trời.', en: 'dragon' },
      { w: 'con cá', i: '🐟', ex: 'Con cá bơi dưới nước.', en: 'fish' }
    ],
    food: { i: '🦑', title: 'Chả mực Hạ Long', text: 'Mực tươi được giã tay rồi rán vàng, giòn dai thơm ngon – đặc sản nổi tiếng của Quảng Ninh.' },
    fact: 'Vịnh Hạ Long đã được UNESCO công nhận là di sản thiên nhiên thế giới.',
    game: {
      type: 'hideseek', title: 'Trốn tìm ở vịnh Hạ Long',
      intro: 'Các bạn sinh vật biển đang trốn sau những hòn đảo. Nghe Trâu Con gọi tên, rồi chạm vào hòn đảo để tìm bạn ấy nhé!',
      doneMsg: 'Bạn đã tìm thấy tất cả các bạn ở vịnh Hạ Long!',
      items: [{ w: 'con cá', i: '🐟' }, { w: 'con cua', i: '🦀' }, { w: 'con ốc', i: '🐚' }, { w: 'con tôm', i: '🦐' }, { w: 'con mực', i: '🦑' }, { w: 'con rùa', i: '🐢' }],
      find: 4
    },
    quiz: [
      { q: 'Vịnh Hạ Long có khoảng bao nhiêu hòn đảo?', o: ['Khoảng 10', 'Gần 2.000', 'Khoảng 50'], a: 1, k: 0, why: 'Vịnh Hạ Long có gần 2.000 hòn đảo lớn nhỏ.', en: 'About how many islands does Ha Long Bay have?' },
      { q: 'Tên "Hạ Long" có nghĩa là gì?', o: ['Rồng đáp xuống', 'Biển xanh', 'Núi cao'], a: 0, k: 1, why: '"Hạ Long" nghĩa là rồng đáp xuống.', en: 'What does the name "Ha Long" mean?' },
      { q: 'Vịnh Hạ Long thuộc tỉnh nào?', o: ['Lâm Đồng', 'Cà Mau', 'Quảng Ninh'], a: 2, k: 2, why: 'Vịnh Hạ Long thuộc tỉnh Quảng Ninh.', en: 'Which province is Ha Long Bay in?' }
    ],
    en: {
      story: "Wow, Ha Long Bay is so beautiful! There are nearly 2,000 islands here. Legend says a mother dragon and her babies flew down to help the people fight invaders, spitting out jewels that became these islands. That's why it's called Ha Long, 'descending dragon'!",
      food: "Fresh squid is pounded by hand and fried until golden: Ha Long's famous squid cake.",
      fact: 'Ha Long Bay is recognised by UNESCO as a World Natural Heritage site.',
      game: 'Sea friends are hiding behind the islands. Listen to the name, then tap an island to find that friend.'
    }
  },
  {
    id: 'trang-an', chang: 2, icon: '🛶', name: 'Tràng An', place: 'Ninh Bình',
    pos: [105.89, 20.25], off: [16, 14], lab: 'r', leg: 'land',
    scene: { sky: 'day', far: 'karst', water: 'river', ground: 'grass', props: [['🛶', 50, 80, 13], ['🐐', 14, 66, 9], ['🌾', 86, 74, 10]], special: 'cave' },
    travel: { icon: '🚆', text: 'Trâu Con đi tàu hoả về Ninh Bình, rồi ngồi thuyền nan để vào Tràng An.' },
    story: 'Mình đang ngồi thuyền ở Tràng An! Thuyền đi qua những dòng sông xanh, luồn qua các hang động dưới chân núi đá. Gần đây là Cố đô Hoa Lư – kinh đô xưa của nhà Đinh hơn 1.000 năm trước.',
    keys: [
      { i: '🛶', vi: 'Ở Tràng An, khách đi thuyền qua sông và hang động.', en: 'At Trang An, visitors ride boats along rivers and through caves.' },
      { i: 'svg:karst', vi: 'Tràng An có nhiều núi đá vôi và hang động.', en: 'Trang An has many limestone mountains and caves.' },
      { i: '🍘', vi: 'Cơm cháy là đặc sản giòn rụm của Ninh Bình.', en: 'Crispy rice crackers (cơm cháy) are a Ninh Binh specialty.' }
    ],
    words: [
      { w: 'hang động', i: 'svg:cave', ex: 'Thuyền đi qua hang động.', en: 'cave' },
      { w: 'con đò', i: '🛶', ex: 'Con đò chở khách qua sông.', en: 'small ferry boat' },
      { w: 'núi đá', i: 'svg:karst', ex: 'Núi đá vôi cao sừng sững.', en: 'rock mountain' },
      { w: 'dòng sông', i: 'svg:river', ex: 'Dòng sông trong xanh.', en: 'river' }
    ],
    food: { i: '🍘', title: 'Cơm cháy Ninh Bình', text: 'Lớp cơm vàng giòn dưới đáy nồi được phơi khô, rán giòn rụm, ăn kèm nước sốt thơm ngon.' },
    fact: 'Quần thể danh thắng Tràng An là di sản thế giới "kép" – được UNESCO công nhận cả về văn hoá lẫn thiên nhiên.',
    game: {
      type: 'fork', title: 'Chèo đò qua hang',
      intro: 'Trước mặt có hai cửa hang. Nhìn hình, nghe Trâu Con đọc, rồi chọn cửa hang có chữ đúng để đò đi tiếp nhé!',
      doneMsg: 'Đò đã qua hết các hang động Tràng An!',
      rounds: [
        { pic: '🛶', say: 'con đò', options: ['con đò', 'con dê'] }, { pic: '⛰️', say: 'núi', options: ['nồi', 'núi'] },
        { pic: '🌾', say: 'lúa', options: ['lúa', 'lửa'] }, { pic: '🦆', say: 'con vịt', options: ['con vít', 'con vịt'] }
      ]
    },
    quiz: [
      { q: 'Ở Tràng An, khách đi tham quan bằng gì?', o: ['Máy bay', 'Tàu hoả', 'Thuyền'], a: 2, k: 0, why: 'Ở Tràng An, khách ngồi thuyền đi qua sông và hang động.', en: 'How do visitors tour Trang An?' },
      { q: 'Món đặc sản giòn rụm của Ninh Bình là gì?', o: ['Cơm cháy', 'Phở', 'Bánh xèo'], a: 0, k: 2, why: 'Cơm cháy là đặc sản giòn rụm của Ninh Bình.', en: 'What crispy specialty is Ninh Binh famous for?' },
      { q: 'Tràng An có nhiều gì?', o: ['Sa mạc cát', 'Núi đá và hang động', 'Băng tuyết'], a: 1, k: 1, why: 'Tràng An có nhiều núi đá vôi và hang động.', en: 'What does Trang An have a lot of?' }
    ],
    en: {
      story: "I'm riding a boat at Trang An! The boat glides on clear rivers and slips through caves under the limestone mountains. Nearby is the ancient capital Hoa Lu, capital of the Dinh dynasty more than 1,000 years ago.",
      food: 'The crispy golden rice from the bottom of the pot is dried and fried, then eaten with a tasty sauce.',
      fact: "Trang An is a 'mixed' World Heritage site, recognised by UNESCO for both its culture and nature.",
      game: 'Look at the picture, listen, then choose the cave with the matching word so the boat can go on.'
    }
  },

  /* ================= CHẶNG 3: BẮC TRUNG BỘ ================= */
  {
    id: 'thanh-nha-ho', chang: 3, icon: '🧱', name: 'Thành nhà Hồ', place: 'Thanh Hoá',
    pos: [105.61, 20.08], off: [-24, 18], lab: 'l', leg: 'land',
    scene: { sky: 'day', far: 'hills', ground: 'grass', props: [['🌾', 10, 86, 9], ['🌳', 90, 64, 13]], special: 'stonegate' },
    travel: { icon: '🚌', text: 'Từ Tràng An, Trâu Con đi xe khách vào Thanh Hoá.' },
    story: 'Các bạn nhìn bức tường đá khổng lồ này nhé! Đây là Thành nhà Hồ, được vua Hồ Quý Ly cho xây năm 1397, chỉ trong khoảng ba tháng. Những phiến đá rất to, có phiến nặng hơn mười tấn, được xếp khít vào nhau mà không cần vữa.',
    keys: [
      { i: '🧱', vi: 'Thành nhà Hồ ở Thanh Hoá, được xây bằng những phiến đá rất lớn.', en: 'Ho Citadel in Thanh Hoa is built from huge stone blocks.' },
      { i: '⏳', vi: 'Thành được xây năm 1397, chỉ trong khoảng ba tháng.', en: 'It was built in 1397 in only about three months.' },
      { i: '🌍', vi: 'Thành nhà Hồ là di sản văn hoá thế giới.', en: 'Ho Citadel is a UNESCO World Cultural Heritage site.' }
    ],
    words: [
      { w: 'bức tường', i: '🧱', ex: 'Bức tường làm bằng đá.', en: 'wall' },
      { w: 'phiến đá', i: 'svg:stoneblock', ex: 'Phiến đá rất nặng.', en: 'stone slab' },
      { w: 'cổng thành', i: 'svg:citygate', ex: 'Cổng thành có mái vòm.', en: 'citadel gate' },
      { w: 'nhà vua', i: '👑', ex: 'Nhà vua cho xây thành.', en: 'king' }
    ],
    food: { i: '🍃', title: 'Nem chua Thanh Hoá', text: 'Nem chua gói trong lá chuối, có vị chua chua, là món quà quê nổi tiếng của Thanh Hoá.' },
    fact: 'Thành nhà Hồ đã được UNESCO công nhận là di sản văn hoá thế giới năm 2011.',
    game: {
      type: 'raise', visual: 'stones', title: 'Xếp đá xây thành',
      intro: 'Mỗi lần chọn đúng chữ, một hàng đá được xếp lên. Cùng xây bức tường thành nhé!',
      doneMsg: 'Bức tường thành đá đã xây xong!',
      rounds: [
        { pic: '🪨', say: 'đá', options: ['đá', 'đà', 'đã'] }, { pic: '🚪', say: 'cổng', options: ['công', 'cổng', 'cộng'] },
        { pic: '👑', say: 'vua', options: ['vừa', 'vữa', 'vua'] }, { pic: '🧱', say: 'tường', options: ['tường', 'tưởng', 'tượng'] }
      ]
    },
    quiz: [
      { q: 'Thành nhà Hồ được xây bằng gì?', o: ['Những phiến đá lớn', 'Gỗ và lá', 'Băng tuyết'], a: 0, k: 0, why: 'Thành nhà Hồ được xây bằng những phiến đá rất lớn.', en: 'What is Ho Citadel built from?' },
      { q: 'Thành nhà Hồ được xây trong khoảng bao lâu?', o: ['Ba trăm năm', 'Ba tháng', 'Một ngày'], a: 1, k: 1, why: 'Thành được xây năm 1397, chỉ trong khoảng ba tháng.', en: 'About how long did it take to build Ho Citadel?' },
      { q: 'Thành nhà Hồ ở tỉnh nào?', o: ['Cà Mau', 'Lào Cai', 'Thanh Hoá'], a: 2, k: 0, why: 'Thành nhà Hồ ở tỉnh Thanh Hoá.', en: 'Which province is Ho Citadel in?' }
    ],
    en: {
      story: 'Look at this giant stone wall! This is Ho Citadel, built by King Ho Quy Ly in 1397 in only about three months. The huge stone blocks, some heavier than ten tonnes, fit tightly together without any mortar.',
      food: 'Nem chua is a tangy pork treat wrapped in banana leaves, a famous gift from Thanh Hoa.',
      fact: 'Ho Citadel was recognised by UNESCO as a World Cultural Heritage site in 2011.',
      game: "Each right word adds a row of stones. Let's build the citadel wall!"
    }
  },
  {
    id: 'phong-nha', chang: 3, icon: '🦇', name: 'Phong Nha – Kẻ Bàng', mapName: 'Phong Nha', place: 'Quảng Trị', placeNote: 'trước đây thuộc Quảng Bình',
    pos: [106.28, 17.58], off: [0, 0], lab: 'l', leg: 'land', via: [[105.72, 19.75], [105.55, 18.65]],
    scene: { sky: 'cave', far: 'cavein', water: 'river', ground: 'none', props: [['🛶', 50, 82, 12], ['🦇', 26, 22, 9], ['💧', 72, 30, 8]] },
    travel: { icon: '🚆', text: 'Trâu Con đi tàu hoả Thống Nhất vào miền Trung, rồi ngồi thuyền trên sông Son để vào động Phong Nha.' },
    story: 'Các bạn ơi, mình đang ở trong hang động Phong Nha! Trong hang có những nhũ đá lấp lánh đủ hình thù. Gần đây còn có hang Sơn Đoòng – được xem là hang động tự nhiên lớn nhất thế giới đấy!',
    keys: [
      { i: 'svg:cave', vi: 'Phong Nha – Kẻ Bàng có nhiều hang động đẹp, là di sản thiên nhiên thế giới.', en: 'Phong Nha – Ke Bang has many beautiful caves and is a World Natural Heritage site.' },
      { i: '🌍', vi: 'Hang Sơn Đoòng được xem là hang động tự nhiên lớn nhất thế giới.', en: 'Son Doong is considered the largest natural cave in the world.' },
      { i: '🛶', vi: 'Muốn vào động Phong Nha, ta đi thuyền trên sông Son.', en: 'To enter Phong Nha Cave, you take a boat on the Son River.' },
      { i: '🦇', vi: 'Trong hang có dơi, chúng ngủ treo ngược.', en: 'Bats live in the caves and sleep upside down.' }
    ],
    words: [
      { w: 'hang động', i: 'svg:cave', ex: 'Hang động rất rộng và tối.', en: 'cave' },
      { w: 'nhũ đá', i: 'svg:stalactite', ex: 'Nhũ đá lấp lánh trong hang.', en: 'stalactite' },
      { w: 'con dơi', i: '🦇', ex: 'Con dơi ngủ treo ngược.', en: 'bat' },
      { w: 'đèn pin', i: '🔦', ex: 'Em bật đèn pin để soi đường.', en: 'flashlight' }
    ],
    food: { i: '🍲', title: 'Cháo canh', text: 'Cháo canh là món ăn sáng quen thuộc của vùng đất Quảng Bình xưa, sợi bánh dai, nước dùng ngọt thơm.' },
    fact: 'Vườn quốc gia Phong Nha – Kẻ Bàng được UNESCO công nhận là di sản thiên nhiên thế giới.',
    game: {
      type: 'flashlight', title: 'Soi đèn trong hang',
      intro: 'Trong hang tối lắm! Kéo đèn pin để soi, rồi chạm vào đồ vật Trâu Con nhờ tìm nhé.',
      doneMsg: 'Bạn đã soi sáng cả hang động!',
      items: [{ w: 'con dơi', i: '🦇' }, { w: 'nhũ đá', i: '🪨' }, { w: 'giọt nước', i: '💧' }, { w: 'con cá', i: '🐟' }, { w: 'con cua', i: '🦀' }]
    },
    quiz: [
      { q: 'Hang Sơn Đoòng nổi tiếng vì điều gì?', o: ['Có nhiều tuyết', 'Rất lớn, một trong những hang lớn nhất thế giới', 'Có tháp cao'], a: 1, k: 1, why: 'Hang Sơn Đoòng được xem là hang động tự nhiên lớn nhất thế giới.', en: 'What is Son Doong Cave famous for?' },
      { q: 'Muốn vào động Phong Nha, ta đi bằng gì?', o: ['Thuyền', 'Xe đạp', 'Cáp treo'], a: 0, k: 2, why: 'Ta ngồi thuyền trên sông Son để vào động Phong Nha.', en: 'How do you get into Phong Nha Cave?' },
      { q: 'Con vật nào hay ngủ treo ngược trong hang?', o: ['Con mèo', 'Con gà', 'Con dơi'], a: 2, k: 3, why: 'Con dơi sống trong hang và ngủ treo ngược.', en: 'Which animal sleeps upside down in caves?' }
    ],
    en: {
      story: "Friends, I'm inside Phong Nha Cave! There are sparkling stalactites of all shapes. Nearby is Son Doong, considered the largest natural cave in the world!",
      food: 'Cháo canh is a favourite breakfast of old Quang Binh: chewy noodles in a sweet, savoury broth.',
      fact: 'Phong Nha – Ke Bang National Park is recognised by UNESCO as a World Natural Heritage site.',
      game: "It's dark in the cave! Move the flashlight to look around, then tap the thing Trau Con asks for."
    }
  },
  {
    id: 'hue', chang: 3, icon: 'svg:nonla', name: 'Cố đô Huế', mapName: 'Huế', place: 'Thành phố Huế',
    pos: [107.578, 16.469], off: [-6, -2], lab: 'l', leg: 'land',
    scene: { sky: 'day', far: 'hills', water: 'river', ground: 'grass', props: [['👒', 22, 72, 12], ['🛶', 52, 80, 11], ['☔', 58, 20, 9]], special: 'tower' },
    travel: { icon: '🚆', text: 'Trâu Con tiếp tục đi tàu hoả Thống Nhất dọc miền Trung để tới Huế.' },
    story: 'Mình tới Huế rồi! Huế từng là kinh đô của triều Nguyễn. Dòng sông Hương hiền hoà chảy qua thành phố, bên bờ có chùa Thiên Mụ với ngọn tháp bảy tầng. Các cô gái Huế đội nón bài thơ – nón lá có giấu thơ bên trong đấy!',
    keys: [
      { i: '👑', vi: 'Huế từng là kinh đô của triều Nguyễn.', en: 'Hue was the capital of the Nguyen dynasty.' },
      { i: 'svg:river', vi: 'Sông Hương chảy qua thành phố Huế.', en: 'The Perfume River (sông Hương) flows through Hue.' },
      { i: '🗣️', vi: 'Người Huế nói "mô" là "đâu", "răng" là "sao".', en: 'In Hue, people say "mô" for "where" and "răng" for "why".' },
      { i: 'svg:nonla', vi: 'Nón bài thơ có hình và chữ giấu giữa các lớp lá.', en: 'A poem hat hides pictures and verses between its leaf layers.' }
    ],
    words: [
      { w: 'nón bài thơ', i: 'svg:nonla', ex: 'Cô gái đội nón bài thơ.', en: 'poem conical hat' },
      { w: 'dòng sông', i: 'svg:river', ex: 'Dòng sông Hương hiền hoà.', en: 'river' },
      { w: 'ngọn tháp', i: 'svg:pagoda', ex: 'Ngọn tháp có bảy tầng.', en: 'tower' },
      { w: 'cơn mưa', i: '☔', ex: 'Huế có nhiều cơn mưa.', en: 'rain shower' }
    ],
    food: { i: '🍜', title: 'Bún bò Huế', text: 'Bún bò Huế có sợi bún to, nước dùng thơm mùi sả, hơi cay – món ăn nổi tiếng khắp nơi.' },
    fact: 'Người Huế nói "mô" là "đâu", "tê" là "kia", "răng" là "sao", "rứa" là "thế". Ví dụ: "Đi mô rứa?" nghĩa là "Đi đâu thế?"',
    game: {
      type: 'nonbaitho', title: 'Bí mật trong nón bài thơ',
      intro: 'Nón bài thơ có hình và chữ giấu giữa các lớp lá. Chạm vào ông mặt trời để soi nón lên nắng nhé!',
      doneMsg: 'Bạn đã tìm ra bí mật của nón bài thơ!',
      verse: ['Đường', 'vô', 'xứ', 'Huế', 'quanh', 'quanh'],
      verse2: 'Non xanh nước biếc như tranh hoạ đồ'
    },
    quiz: [
      { q: 'Người Huế nói "mô" nghĩa là gì?', o: ['gì', 'đâu', 'ai'], a: 1, k: 2, why: 'Người Huế nói "mô" nghĩa là "đâu".', en: 'In Hue dialect, what does "mô" mean?' },
      { q: 'Huế từng là kinh đô của triều đại nào?', o: ['Triều Nguyễn', 'Triều Lý', 'Triều Trần'], a: 0, k: 0, why: 'Huế từng là kinh đô của triều Nguyễn.', en: 'Hue was the capital of which dynasty?' },
      { q: 'Con sông thơ mộng chảy qua Huế tên là gì?', o: ['Sông Hồng', 'Sông Cửu Long', 'Sông Hương'], a: 2, k: 1, why: 'Sông Hương chảy qua thành phố Huế.', en: 'Which river flows through Hue?' }
    ],
    en: {
      story: "I've arrived in Hue! Hue was once the capital of the Nguyen dynasty. The gentle Perfume River flows through the city, and on its bank is Thien Mu Pagoda with its seven-storey tower. Hue girls wear poem hats: conical hats with poems hidden inside!",
      food: 'Bún bò Huế has thick rice noodles in a lemongrass-scented, slightly spicy broth. It is famous everywhere.',
      fact: "In Hue, 'mô' means 'where', 'tê' means 'there', 'răng' means 'why' and 'rứa' means 'like that'. 'Đi mô rứa?' means 'Where are you going?'",
      game: 'A poem hat hides a picture and words between its leaves. Tap the sun to hold the hat up to the light!'
    }
  },

  /* ================= CHẶNG 4: DUYÊN HẢI MIỀN TRUNG & BIỂN ĐẢO ================= */
  {
    id: 'da-nang', chang: 4, icon: '🐉', name: 'Đà Nẵng – Cầu Rồng', mapName: 'Đà Nẵng', place: 'Thành phố Đà Nẵng',
    pos: [108.228, 16.061], off: [14, -20], lab: 'r', leg: 'land',
    scene: { sky: 'night', far: 'city', water: 'river', ground: 'none', props: [['🔥', 22, 40, 10], ['💦', 84, 44, 9], ['🌙', 84, 14, 8]], special: 'dragonbridge' },
    travel: { icon: '🚆', text: 'Trâu Con đi tàu hoả qua đèo Hải Vân – con đèo uốn lượn giữa núi và biển – để tới Đà Nẵng.' },
    story: 'Đà Nẵng đây rồi! Các bạn thấy cây cầu hình con rồng vàng bắc qua sông Hàn không? Đó là Cầu Rồng. Vào tối thứ Bảy và Chủ nhật, rồng phun lửa và phun nước rất đẹp. Trên núi Bà Nà còn có Cầu Vàng với đôi bàn tay khổng lồ nâng đỡ nữa!',
    keys: [
      { i: '🐉', vi: 'Cầu Rồng bắc qua sông Hàn, biết phun lửa và phun nước.', en: 'The Dragon Bridge crosses the Han River and can breathe fire and spray water.' },
      { i: '🤲', vi: 'Trên núi Bà Nà có Cầu Vàng với đôi bàn tay khổng lồ.', en: 'On Ba Na Hills is the Golden Bridge, held up by giant hands.' },
      { i: '🍜', vi: 'Mì Quảng là đặc sản của Đà Nẵng và Quảng Nam xưa.', en: 'Mì Quảng noodles are a specialty of Da Nang and old Quang Nam.' }
    ],
    words: [
      { w: 'cây cầu', i: '🌉', ex: 'Cây cầu bắc qua sông.', en: 'bridge' },
      { w: 'con rồng', i: '🐉', ex: 'Con rồng vàng rất đẹp.', en: 'dragon' },
      { w: 'ngọn lửa', i: '🔥', ex: 'Ngọn lửa đỏ rực.', en: 'flame' },
      { w: 'bãi biển', i: '🏖️', ex: 'Bãi biển Mỹ Khê cát trắng.', en: 'beach' }
    ],
    food: { i: '🍜', title: 'Mì Quảng', text: 'Sợi mì vàng, ít nước dùng, ăn với bánh tráng nướng giòn. Từ năm 2025, Quảng Nam và Đà Nẵng hợp thành thành phố Đà Nẵng, nên mì Quảng là đặc sản của cả thành phố!' },
    fact: 'Biển Mỹ Khê ở Đà Nẵng có bãi cát trắng dài, là một trong những bãi biển đẹp nhất Việt Nam.',
    game: {
      type: 'raise', visual: 'dragon', title: 'Đánh thức Rồng vàng',
      intro: 'Mỗi lần chọn đúng chữ, Rồng vàng sẽ sáng thêm một khúc. Sáng hết là rồng phun lửa đấy!',
      doneMsg: 'Rồng vàng phun lửa rồi!',
      rounds: [
        { pic: '🔥', say: 'lửa', options: ['lúa', 'lửa', 'lừa'] }, { pic: '🐉', say: 'rồng', options: ['rồng', 'rộng', 'rỗng'] },
        { pic: '🌉', say: 'cầu', options: ['câu', 'cậu', 'cầu'] }, { pic: '🌊', say: 'biển', options: ['biển', 'biến', 'biên'] }
      ]
    },
    quiz: [
      { q: 'Cầu Rồng ở Đà Nẵng có thể phun ra gì?', o: ['Kẹo', 'Lửa và nước', 'Hoa'], a: 1, k: 0, why: 'Cầu Rồng phun lửa và phun nước vào tối cuối tuần.', en: 'What can the Dragon Bridge in Da Nang breathe out?' },
      { q: 'Cầu Rồng bắc qua sông nào?', o: ['Sông Hàn', 'Sông Hương', 'Sông Hồng'], a: 0, k: 0, why: 'Cầu Rồng bắc qua sông Hàn.', en: 'Which river does the Dragon Bridge cross?' },
      { q: 'Cây cầu trên núi Bà Nà có đôi bàn tay khổng lồ nâng đỡ tên là gì?', o: ['Cầu Rồng', 'Cầu Long Biên', 'Cầu Vàng'], a: 2, k: 1, why: 'Đó là Cầu Vàng trên núi Bà Nà.', en: 'What is the bridge on Ba Na Hills held up by giant hands called?' }
    ],
    en: {
      story: "Here's Da Nang! See the golden dragon-shaped bridge over the Han River? That's the Dragon Bridge. On Saturday and Sunday nights the dragon breathes fire and sprays water. On Ba Na Hills there is also the Golden Bridge, held up by two giant hands!",
      food: 'Mì Quảng has yellow noodles with a little broth and crunchy rice crackers. Since 2025, Quang Nam and Da Nang are one city, so Mì Quảng belongs to the whole city!',
      fact: "My Khe Beach in Da Nang has a long stretch of white sand and is one of Vietnam's most beautiful beaches.",
      game: 'Each right word lights up part of the golden dragon. Light it all and the dragon breathes fire!'
    }
  },
  {
    id: 'hoi-an', chang: 4, icon: '🏮', name: 'Phố cổ Hội An', mapName: 'Hội An', place: 'Thành phố Đà Nẵng', placeNote: 'trước đây thuộc Quảng Nam',
    pos: [108.33, 15.877], off: [22, 12], lab: 'r', leg: 'land',
    scene: { sky: 'dusk', far: 'oldtown', water: 'river', ground: 'none', props: [['🏮', 16, 26, 11], ['🏮', 34, 20, 10], ['🏮', 66, 22, 10], ['🏮', 84, 28, 11], ['🕯️', 48, 84, 8]] },
    travel: { icon: '🛶', text: 'Trâu Con đi thuyền trên sông Hoài, ngắm phố cổ lung linh ánh đèn.' },
    story: 'Mình đang ở phố cổ Hội An! Những ngôi nhà mái ngói, tường vàng, đèn lồng đủ màu treo khắp phố. Đêm rằm, phố cổ tắt đèn điện, mọi người thả hoa đăng xuống sông Hoài để cầu chúc bình an.',
    keys: [
      { i: '🏮', vi: 'Phố cổ Hội An nổi tiếng với đèn lồng nhiều màu.', en: 'Hoi An Ancient Town is famous for colourful lanterns.' },
      { i: '🌉', vi: 'Chùa Cầu là biểu tượng của Hội An, có hình trên tờ tiền 20.000 đồng.', en: 'The Covered Bridge is the symbol of Hoi An and is printed on the 20,000 dong note.' },
      { i: 'svg:hoadang', vi: 'Đêm rằm, mọi người thả hoa đăng trên sông Hoài.', en: 'On full-moon nights, people float lanterns on the Hoai River.' }
    ],
    words: [
      { w: 'đèn lồng', i: '🏮', ex: 'Đèn lồng treo khắp phố.', en: 'lantern' },
      { w: 'phố cổ', i: '🏘️', ex: 'Phố cổ có nhiều nhà cũ.', en: 'ancient town' },
      { w: 'hoa đăng', i: 'svg:hoadang', ex: 'Em thả hoa đăng xuống sông.', en: 'floating lantern' },
      { w: 'mái ngói', i: '🏠', ex: 'Mái ngói nhà cổ màu nâu.', en: 'tiled roof' }
    ],
    food: { i: '🍜', title: 'Cao lầu', text: 'Cao lầu có sợi mì vàng dai, ăn với thịt xá xíu và rau sống – món ăn đặc biệt của Hội An.' },
    fact: 'Chùa Cầu – biểu tượng của Hội An – có hình in trên tờ tiền 20.000 đồng của Việt Nam.',
    game: {
      type: 'colorpick', title: 'Thắp đèn lồng phố Hội',
      intro: 'Nghe Trâu Con đọc tên màu, rồi chạm vào chiếc đèn lồng đúng màu để thắp sáng nhé!',
      doneMsg: 'Phố cổ Hội An đã rực rỡ ánh đèn lồng!',
      colors: [
        { w: 'màu đỏ', c: '#E0453A' }, { w: 'màu vàng', c: '#F2C230' }, { w: 'màu xanh lá', c: '#4FAE5B' },
        { w: 'màu xanh dương', c: '#3B82C4' }, { w: 'màu tím', c: '#8E5BB5' }, { w: 'màu cam', c: '#F08A2C' }
      ]
    },
    quiz: [
      { q: 'Hội An nổi tiếng với loại đèn nào?', o: ['Đèn pin', 'Đèn lồng', 'Đèn giao thông'], a: 1, k: 0, why: 'Phố cổ Hội An nổi tiếng với đèn lồng nhiều màu.', en: 'Which kind of light is Hoi An famous for?' },
      { q: 'Chùa Cầu Hội An có hình trên tờ tiền nào?', o: ['20.000 đồng', '500.000 đồng', '1.000 đồng'], a: 0, k: 1, why: 'Chùa Cầu có hình trên tờ tiền 20.000 đồng.', en: 'Which banknote shows the Covered Bridge of Hoi An?' },
      { q: 'Đêm rằm ở phố cổ, mọi người thả gì trên sông?', o: ['Diều giấy', 'Bóng bay', 'Hoa đăng'], a: 2, k: 2, why: 'Đêm rằm, mọi người thả hoa đăng trên sông Hoài.', en: 'On full-moon nights, what do people float on the river?' }
    ],
    en: {
      story: "I'm in Hoi An Ancient Town! Old houses with tiled roofs and yellow walls, and lanterns of every colour hang along the streets. On full-moon nights the town turns off its electric lights and people float flower lanterns on the Hoai River to wish for peace.",
      food: 'Cao lầu has chewy yellow noodles with sliced pork and fresh herbs, a dish special to Hoi An.',
      fact: "The Covered Bridge, Hoi An's symbol, is printed on Vietnam's 20,000 dong note.",
      game: 'Listen to the colour, then tap the lantern of that colour to light it up.'
    }
  },
  {
    id: 'my-son', chang: 4, icon: 'svg:chamtower', name: 'Thánh địa Mỹ Sơn', mapName: 'Mỹ Sơn', place: 'Thành phố Đà Nẵng', placeNote: 'trước đây thuộc Quảng Nam',
    pos: [108.123, 15.764], off: [-26, 14], lab: 'l', leg: 'land',
    scene: { sky: 'day', far: 'mountains', ground: 'grass', props: [['🌳', 8, 62, 13], ['🌿', 86, 86, 9]], special: 'chamtower' },
    travel: { icon: '🛵', text: 'Từ Hội An, Trâu Con đi xe máy vào một thung lũng xanh giữa núi rừng.' },
    story: 'Đây là Thánh địa Mỹ Sơn, nơi có những ngôi đền tháp bằng gạch đỏ của người Chăm. Các đền tháp được xây từ hơn 1.000 năm trước. Lạ chưa, những viên gạch được xếp khít vào nhau mà ngày nay người ta vẫn chưa biết hết bí mật!',
    keys: [
      { i: 'svg:chamtower', vi: 'Mỹ Sơn có những đền tháp gạch đỏ của người Chăm.', en: 'My Son has red-brick temple towers built by the Cham people.' },
      { i: '⏳', vi: 'Các đền tháp được xây từ hơn 1.000 năm trước.', en: 'The temples were built more than 1,000 years ago.' },
      { i: '🌍', vi: 'Thánh địa Mỹ Sơn là di sản văn hoá thế giới.', en: 'My Son Sanctuary is a UNESCO World Cultural Heritage site.' }
    ],
    words: [
      { w: 'ngôi tháp', i: 'svg:chamtower', ex: 'Ngôi tháp làm bằng gạch đỏ.', en: 'tower / temple' },
      { w: 'viên gạch', i: '🧱', ex: 'Viên gạch được xếp khít nhau.', en: 'brick' },
      { w: 'điệu múa', i: '💃', ex: 'Cô gái Chăm múa rất đẹp.', en: 'dance' },
      { w: 'thung lũng', i: 'svg:valley', ex: 'Mỹ Sơn nằm trong thung lũng.', en: 'valley' }
    ],
    food: { i: '🌽', title: 'Chè bắp Cẩm Nam', text: 'Chè bắp nấu từ bắp non ngọt thơm, là món chè quen thuộc ở vùng Hội An xưa.' },
    fact: 'Thánh địa Mỹ Sơn được UNESCO công nhận là di sản văn hoá thế giới. Người Chăm có điệu múa Apsara rất uyển chuyển.',
    game: {
      type: 'order', visual: 'tower', title: 'Xây tháp Chăm',
      intro: 'Cùng xây một ngôi tháp Chăm! Chạm vào các phần của tháp theo thứ tự từ dưới lên trên nhé.',
      prompt: 'Xây tháp thì bắt đầu từ phần nào?',
      doneMsg: 'Ngôi tháp Chăm đã xây xong!',
      items: [{ t: 'Nền tháp', i: '🟫' }, { t: 'Thân tháp', i: '🧱' }, { t: 'Mái tháp', i: '🔺' }, { t: 'Đỉnh tháp', i: '✨' }]
    },
    quiz: [
      { q: 'Đền tháp ở Mỹ Sơn làm bằng gì?', o: ['Gạch đỏ', 'Băng đá', 'Nhựa'], a: 0, k: 0, why: 'Đền tháp Mỹ Sơn được xây bằng gạch đỏ.', en: 'What are the temples at My Son made of?' },
      { q: 'Ai đã xây những đền tháp ở Mỹ Sơn?', o: ['Người máy', 'Người Chăm', 'Người tuyết'], a: 1, k: 0, why: 'Người Chăm đã xây những đền tháp ở Mỹ Sơn.', en: 'Who built the temples at My Son?' },
      { q: 'Các đền tháp được xây từ khi nào?', o: ['Hôm qua', 'Năm ngoái', 'Hơn 1.000 năm trước'], a: 2, k: 1, why: 'Các đền tháp được xây từ hơn 1.000 năm trước.', en: 'When were the temples built?' }
    ],
    en: {
      story: "This is My Son Sanctuary, with red-brick temple towers built by the Cham people more than 1,000 years ago. Amazingly, the bricks fit so tightly together that people still don't know all their secrets!",
      food: 'Sweet corn soup made from young, sweet corn is a favourite dessert around old Hoi An.',
      fact: 'My Son Sanctuary is a UNESCO World Cultural Heritage site. The Cham people have a graceful dance called the Apsara dance.',
      game: "Let's build a Cham tower! Tap the parts from the bottom to the top."
    }
  },
  {
    id: 'ly-son', chang: 4, icon: '🧄', name: 'Đảo Lý Sơn', mapName: 'Lý Sơn', place: 'Quảng Ngãi',
    pos: [109.12, 15.38], off: [16, 10], lab: 'r', leg: 'sea',
    scene: { sky: 'day', far: 'volcano', water: 'sea', ground: 'sand', props: [['🧄', 20, 82, 11], ['⛵', 66, 64, 12]] },
    travel: { icon: '🚤', text: 'Trâu Con đi tàu cao tốc từ cảng Sa Kỳ, vượt sóng ra đảo Lý Sơn.' },
    story: 'Mình đã ra tới đảo Lý Sơn! Hòn đảo này được tạo nên từ núi lửa từ rất lâu rồi. Hơn 300 năm trước, những chiến sĩ Hải đội Hoàng Sa đã đi thuyền buồm từ Lý Sơn ra quần đảo Hoàng Sa để đo đạc, vẽ bản đồ và cắm mốc chủ quyền.',
    keys: [
      { i: '🌋', vi: 'Đảo Lý Sơn được tạo nên từ núi lửa.', en: 'Ly Son Island was formed by volcanoes.' },
      { i: '🧄', vi: 'Lý Sơn được gọi là "vương quốc tỏi".', en: 'Ly Son is called the "kingdom of garlic".' },
      { i: '⛵', vi: 'Hải đội Hoàng Sa xưa đi thuyền buồm từ Lý Sơn ra Hoàng Sa.', en: 'Long ago, the Hoang Sa Flotilla sailed from Ly Son to the Hoang Sa Islands.' }
    ],
    words: [
      { w: 'hòn đảo', i: '🏝️', ex: 'Lý Sơn là hòn đảo đẹp.', en: 'island' },
      { w: 'củ tỏi', i: '🧄', ex: 'Củ tỏi Lý Sơn rất thơm.', en: 'garlic bulb' },
      { w: 'núi lửa', i: '🌋', ex: 'Núi lửa đã tắt từ lâu.', en: 'volcano' },
      { w: 'thuyền buồm', i: '⛵', ex: 'Thuyền buồm ra khơi.', en: 'sailing boat' }
    ],
    food: { i: '🧄', title: 'Tỏi Lý Sơn', text: 'Lý Sơn được gọi là "vương quốc tỏi". Tỏi ở đây củ nhỏ nhưng rất thơm.' },
    fact: 'Mỗi năm, người Lý Sơn làm Lễ Khao lề thế lính Hoàng Sa để tưởng nhớ các chiến sĩ Hải đội Hoàng Sa xưa.',
    game: {
      type: 'release', visual: 'boats', title: 'Thả thuyền Khao lề',
      intro: 'Trong lễ Khao lề, người dân thả những chiếc thuyền nhỏ ra biển. Chạm vào từng chiếc thuyền để thả, và nghe Trâu Con kể chuyện nhé!',
      doneMsg: 'Những con thuyền đã ra khơi, mang theo lời nhớ thương!',
      items: [
        { i: '⛵', t: 'Hơn 300 năm trước, Hải đội Hoàng Sa đã giương buồm từ Lý Sơn ra khơi.' },
        { i: '⛵', t: 'Các chiến sĩ đo đạc, vẽ bản đồ và cắm mốc trên các đảo Hoàng Sa.' },
        { i: '⛵', t: 'Người Lý Sơn mãi nhớ ơn các chiến sĩ trong Lễ Khao lề thế lính Hoàng Sa.' },
        { i: '⛵', t: 'Những con thuyền nhỏ ra khơi, mang theo lời nhớ thương của quê hương.' }
      ]
    },
    quiz: [
      { q: 'Lý Sơn nổi tiếng trồng loại cây gia vị nào?', o: ['Ớt chuông', 'Quế', 'Tỏi'], a: 2, k: 1, why: 'Lý Sơn được gọi là vương quốc tỏi.', en: 'Which spice plant is Ly Son famous for?' },
      { q: 'Đảo Lý Sơn được tạo nên từ gì?', o: ['Núi lửa', 'Băng tuyết', 'Cát sa mạc'], a: 0, k: 0, why: 'Đảo Lý Sơn được tạo nên từ núi lửa.', en: 'What formed Ly Son Island?' },
      { q: 'Hải đội Hoàng Sa xưa ra Hoàng Sa bằng gì?', o: ['Máy bay', 'Thuyền buồm', 'Tàu hoả'], a: 1, k: 2, why: 'Hải đội Hoàng Sa đi thuyền buồm từ Lý Sơn ra Hoàng Sa.', en: 'How did the old Hoang Sa Flotilla travel to Hoang Sa?' }
    ],
    en: {
      story: "I've reached Ly Son Island! It was formed by volcanoes long ago. More than 300 years ago, sailors of the Hoang Sa Flotilla sailed from Ly Son to the Hoang Sa Islands to measure them, draw maps and set up sovereignty markers.",
      food: "Ly Son is called the 'kingdom of garlic'. Its garlic bulbs are small but very fragrant.",
      fact: 'Every year, the people of Ly Son hold a ceremony to remember the soldiers of the old Hoang Sa Flotilla.',
      game: 'In the ceremony, people release small boats to the sea. Tap each boat to send it off and listen to the story.'
    }
  },
  {
    id: 'hoang-sa', chang: 4, icon: '🏝️', name: 'Quần đảo Hoàng Sa', place: 'Đặc khu Hoàng Sa, thành phố Đà Nẵng',
    pos: [111.62, 16.53], off: [0, 0], lab: 'b', leg: 'sea', sea: true,
    scene: { sky: 'day', far: 'none', water: 'sea', ground: 'sand', props: [['🏝️', 26, 54, 14], ['🏝️', 70, 50, 11], ['🐦', 50, 18, 8], ['🐦', 60, 24, 6]] },
    travel: { icon: '⛵', text: 'Theo đường biển của Hải đội Hoàng Sa xưa, Trâu Con giương buồm ra quần đảo Hoàng Sa.' },
    story: 'Mình đang ở giữa Biển Đông, nơi có quần đảo Hoàng Sa – một phần lãnh thổ thiêng liêng của Tổ quốc Việt Nam. "Hoàng Sa" nghĩa là "cát vàng". Trên những tấm bản đồ cổ của Việt Nam, nơi này được ghi là "Bãi Cát Vàng".',
    keys: [
      { i: '🟨', vi: '"Hoàng Sa" nghĩa là "cát vàng".', en: '"Hoang Sa" means "yellow sand".' },
      { i: '📍', vi: 'Quần đảo Hoàng Sa thuộc thành phố Đà Nẵng.', en: 'The Hoang Sa Islands belong to Da Nang city.' },
      { i: '🌊', vi: 'Hoàng Sa nằm ở Biển Đông, là một phần lãnh thổ của Việt Nam.', en: 'Hoang Sa lies in the East Sea and is part of Vietnam.' }
    ],
    words: [
      { w: 'quần đảo', i: 'svg:archipelago', ex: 'Quần đảo có nhiều đảo nhỏ.', en: 'archipelago (group of islands)' },
      { w: 'bãi cát', i: '🏖️', ex: 'Bãi cát vàng óng.', en: 'sandbank / beach' },
      { w: 'màu vàng', i: '🟨', ex: 'Cát có màu vàng.', en: 'yellow' },
      { w: 'chim hải âu', i: 'svg:seagull', ex: 'Chim hải âu bay trên biển.', en: 'seagull' }
    ],
    food: { i: '🎣', title: 'Ngư trường Hoàng Sa', text: 'Từ bao đời nay, ngư dân Việt Nam vẫn ra khơi đánh cá ở vùng biển Hoàng Sa.' },
    fact: 'Quần đảo Hoàng Sa gồm hơn 30 đảo, đá, cồn và bãi. Ngày nay Hoàng Sa là một đặc khu của thành phố Đà Nẵng.',
    game: {
      type: 'mapfind', title: 'Tìm Hoàng Sa trên bản đồ',
      intro: 'Trâu Con đố các bạn tìm trên bản đồ Việt Nam nhé!',
      doneMsg: 'Bạn đã tìm thấy quần đảo Hoàng Sa – Bãi Cát Vàng của Việt Nam!',
      rounds: [
        { say: 'Chạm vào thành phố Đà Nẵng', pos: [108.22, 16.06], r: 0.9 },
        { say: 'Chạm vào quần đảo Hoàng Sa', pos: [111.9, 16.45], r: 1.3 },
        { say: 'Chạm vào Thủ đô Hà Nội', pos: [105.85, 21.03], r: 0.9 }
      ],
      meaning: [['Hoàng', 'vàng'], ['Sa', 'cát']], meaningResult: 'Hoàng Sa = Cát Vàng'
    },
    quiz: [
      { q: '"Hoàng Sa" có nghĩa là gì?', o: ['Biển xanh', 'Cát vàng', 'Núi đỏ'], a: 1, k: 0, why: '"Hoàng" là vàng, "Sa" là cát. Hoàng Sa nghĩa là cát vàng.', en: 'What does "Hoang Sa" mean?' },
      { q: 'Quần đảo Hoàng Sa thuộc thành phố nào?', o: ['Hà Nội', 'Cần Thơ', 'Đà Nẵng'], a: 2, k: 1, why: 'Quần đảo Hoàng Sa thuộc thành phố Đà Nẵng.', en: 'Which city do the Hoang Sa Islands belong to?' },
      { q: 'Quần đảo Hoàng Sa nằm ở đâu?', o: ['Biển Đông', 'Hồ Gươm', 'Trên núi'], a: 0, k: 2, why: 'Hoàng Sa nằm ở Biển Đông.', en: 'Where are the Hoang Sa Islands?' }
    ],
    en: {
      story: "I'm in the middle of the East Sea, at the Hoang Sa Islands, a sacred part of Vietnam. 'Hoang Sa' means 'yellow sand'. On old Vietnamese maps, this place was written as 'Bãi Cát Vàng', the Golden Sand Bank.",
      food: 'For generations, Vietnamese fishermen have sailed out to fish in the Hoang Sa sea.',
      fact: 'The Hoang Sa Islands include more than 30 islands, rocks and sandbanks. Today Hoang Sa is a special zone of Da Nang city.',
      game: 'Trau Con challenges you to find places on the map of Vietnam!'
    }
  },
  {
    id: 'ghenh-da-dia', chang: 4, icon: 'svg:basalt', name: 'Ghềnh Đá Đĩa', place: 'Đắk Lắk', placeNote: 'trước đây thuộc Phú Yên',
    pos: [109.293, 13.348], off: [6, 0], lab: 'r', leg: 'sea',
    scene: { sky: 'day', far: 'none', water: 'sea', ground: 'none', props: [['🐚', 14, 90, 8], ['🦀', 86, 90, 8]], special: 'basalt' },
    travel: { icon: '⛵', text: 'Từ Hoàng Sa, Trâu Con quay thuyền về đất liền, cập bờ biển Phú Yên xưa.' },
    story: 'Các bạn nhìn kìa, những cột đá xếp sát nhau như những chồng đĩa khổng lồ! Đây là Ghềnh Đá Đĩa. Từ rất lâu rồi, dung nham núi lửa chảy ra biển, nguội đi và nứt thành những cột đá này. Nhiều cột đá có sáu cạnh, giống như tổ ong.',
    keys: [
      { i: 'svg:basalt', vi: 'Ghềnh Đá Đĩa có những cột đá xếp sát nhau như chồng đĩa.', en: 'Ganh Da Dia has stone columns packed together like stacks of plates.' },
      { i: '🌋', vi: 'Các cột đá được tạo ra khi dung nham núi lửa nguội đi.', en: 'The columns formed when volcanic lava cooled down.' },
      { i: 'svg:honeycomb', vi: 'Nhiều cột đá có sáu cạnh, giống tổ ong.', en: 'Many columns have six sides, like a honeycomb.' }
    ],
    words: [
      { w: 'cột đá', i: 'svg:basalt', ex: 'Cột đá đứng sát nhau.', en: 'stone column' },
      { w: 'cái đĩa', i: '🍽️', ex: 'Mẹ xếp chồng đĩa lên bàn.', en: 'plate' },
      { w: 'núi lửa', i: '🌋', ex: 'Núi lửa phun ra dung nham.', en: 'volcano' },
      { w: 'tổ ong', i: 'svg:honeycomb', ex: 'Tổ ong có nhiều ô sáu cạnh.', en: 'honeycomb' }
    ],
    food: { i: '🍲', title: 'Bánh canh hẹ', text: 'Bánh canh hẹ là món ăn dân dã của Phú Yên xưa, sợi bánh mềm, ăn với lá hẹ xanh.' },
    fact: 'Ghềnh Đá Đĩa được tạo nên từ dung nham núi lửa. Trên thế giới chỉ có ít nơi có những cột đá đẹp như vậy.',
    game: {
      type: 'collect', bg: 'rocks', title: 'Tìm hình ở bãi đá',
      intro: 'Nghe Trâu Con nhờ, rồi chạm vào đúng những hình cần tìm nhé!',
      doneMsg: 'Bạn nhận biết các hình rất giỏi!',
      rounds: [
        { say: 'Chạm vào tất cả hình sáu cạnh', target: '⬢', n: 5, other: ['🟥', '🔺', '🔵'] },
        { say: 'Chạm vào tất cả hình tròn', target: '🔵', n: 4, other: ['⬢', '🟥', '🔺'] },
        { say: 'Nhặt 4 vỏ ốc', target: '🐚', n: 4, other: ['🦀', '🪨', '🌿'] }
      ]
    },
    quiz: [
      { q: 'Cột đá ở Ghềnh Đá Đĩa giống cái gì?', o: ['Cây kem', 'Chồng đĩa', 'Quả bóng'], a: 1, k: 0, why: 'Các cột đá xếp sát nhau như những chồng đĩa.', en: 'What do the stone columns at Ganh Da Dia look like?' },
      { q: 'Các cột đá được tạo ra từ đâu?', o: ['Dung nham núi lửa', 'Tuyết rơi', 'Cát sa mạc'], a: 0, k: 1, why: 'Dung nham núi lửa nguội đi và nứt thành cột đá.', en: 'What formed the stone columns?' },
      { q: 'Nhiều cột đá ở đây có mấy cạnh?', o: ['Hai cạnh', 'Không có cạnh', 'Sáu cạnh'], a: 2, k: 2, why: 'Nhiều cột đá có sáu cạnh, giống tổ ong.', en: 'How many sides do many of the columns have?' }
    ],
    en: {
      story: 'Look, stone columns standing side by side like giant stacks of plates! This is Ganh Da Dia. Long ago, volcanic lava flowed to the sea, cooled down and cracked into these columns. Many of them have six sides, just like a honeycomb.',
      food: 'Bánh canh hẹ is a simple local dish of old Phu Yen: soft, thick noodles with green garlic chives.',
      fact: 'Ganh Da Dia was formed from volcanic lava. Only a few places in the world have stone columns like these.',
      game: 'Listen to Trau Con, then tap all the shapes or things you are asked to find.'
    }
  },
  {
    id: 'mui-doi', chang: 4, icon: '🌅', name: 'Mũi Đôi – Nha Trang', place: 'Khánh Hoà',
    pos: [109.464, 12.65], off: [6, 0], lab: 'r', leg: 'land', cuc: 'Đông',
    scene: { sky: 'sunrise', far: 'none', water: 'sea', ground: 'rock', props: [['🐠', 30, 86, 9], ['🪸', 70, 88, 9]], special: 'sun' },
    travel: { icon: '🚌', text: 'Trâu Con đi tiếp về phía Nam tới Khánh Hoà, rồi đi bộ băng qua đồi cát và ghềnh đá để lên Mũi Đôi đón bình minh.' },
    story: 'Mình đang ở Mũi Đôi – điểm cực Đông trên đất liền Việt Nam, nơi đón bình minh sớm nhất cả nước! Gần đây là Nha Trang với vịnh biển xanh và những rạn san hô đầy màu sắc dưới nước.',
    keys: [
      { i: '🧭', vi: 'Mũi Đôi là điểm cực Đông trên đất liền của Việt Nam.', en: 'Mui Doi is the easternmost point of mainland Vietnam.' },
      { i: '🌅', vi: 'Ở Mũi Đôi, ta đón bình minh sớm nhất Việt Nam.', en: 'At Mui Doi you can see the earliest sunrise in Vietnam.' },
      { i: '🪸', vi: 'Biển Nha Trang có nhiều san hô và cá đầy màu sắc.', en: 'The sea at Nha Trang has many corals and colourful fish.' }
    ],
    words: [
      { w: 'bình minh', i: '🌅', ex: 'Bình minh lên trên biển.', en: 'sunrise' },
      { w: 'mặt trời', i: '☀️', ex: 'Mặt trời đỏ rực.', en: 'sun' },
      { w: 'san hô', i: '🪸', ex: 'San hô có nhiều màu.', en: 'coral' },
      { w: 'cá biển', i: '🐠', ex: 'Cá biển bơi quanh san hô.', en: 'sea fish' }
    ],
    food: { i: '🍲', title: 'Bún chả cá Nha Trang', text: 'Bún ăn với chả cá chiên vàng và nước dùng ngọt thanh – món ăn sáng nổi tiếng của Nha Trang.' },
    fact: 'Khu bảo tồn biển Hòn Mun ở vịnh Nha Trang có rất nhiều loài san hô và cá biển đầy màu sắc.',
    game: {
      type: 'count', sunrise: true, title: 'Đón bình minh, đếm cá',
      intro: 'Chạm vào ông mặt trời để đón bình minh. Sau đó, đếm xem có bao nhiêu chú cá nhé!',
      doneMsg: 'Bạn đếm giỏi lắm!',
      rounds: [{ n: 3, i: '🐠' }, { n: 5, i: '🐟' }, { n: 7, i: '🐡' }, { n: 4, i: '🦀' }]
    },
    quiz: [
      { q: 'Mũi Đôi là điểm cực nào của Việt Nam (trên đất liền)?', o: ['Cực Tây', 'Cực Bắc', 'Cực Đông'], a: 2, k: 0, why: 'Mũi Đôi là điểm cực Đông trên đất liền của Việt Nam.', en: 'Which extreme point of mainland Vietnam is Mui Doi?' },
      { q: 'Ở Mũi Đôi, ta được đón gì sớm nhất Việt Nam?', o: ['Bình minh', 'Hoàng hôn', 'Tuyết rơi'], a: 0, k: 1, why: 'Mũi Đôi đón bình minh sớm nhất Việt Nam.', en: 'What can you see earliest in Vietnam at Mui Doi?' },
      { q: 'Dưới biển Nha Trang có nhiều gì đẹp?', o: ['Băng tuyết', 'San hô', 'Cây thông'], a: 1, k: 2, why: 'Biển Nha Trang có nhiều san hô và cá đầy màu sắc.', en: 'What beautiful things are under the sea at Nha Trang?' }
    ],
    en: {
      story: "I'm at Mui Doi, the easternmost point of mainland Vietnam, where the earliest sunrise in the country happens! Nearby is Nha Trang with its blue bay and colourful coral reefs under the water.",
      food: "Fish-cake noodle soup, with golden fried fish cakes and a light, sweet broth, is Nha Trang's famous breakfast.",
      fact: 'Hon Mun Marine Protected Area in Nha Trang Bay has many kinds of coral and colourful sea fish.',
      game: 'Tap the sun to welcome the sunrise. Then count the sea animals!'
    }
  },
  {
    id: 'truong-sa', chang: 4, icon: '⚓', name: 'Quần đảo Trường Sa', place: 'Đặc khu Trường Sa, tỉnh Khánh Hoà',
    pos: [111.92, 8.645], off: [0, 0], lab: 'b', leg: 'sea', sea: true,
    scene: { sky: 'day', far: 'none', water: 'sea', ground: 'sand', props: [['🌳', 30, 50, 15], ['🚢', 12, 72, 12]], special: 'islandflag' },
    travel: { icon: '🚢', text: 'Trâu Con đi tàu hải quân, vượt sóng Biển Đông nhiều ngày để ra quần đảo Trường Sa.' },
    story: 'Mình đã tới quần đảo Trường Sa! "Trường Sa" nghĩa là "cát dài". Ở đây, các chú bộ đội hải quân ngày đêm canh giữ biển đảo của Tổ quốc. Trên đảo Trường Sa Lớn còn có trường học cho các bạn nhỏ nữa đấy.',
    keys: [
      { i: '📏', vi: '"Trường Sa" nghĩa là "cát dài".', en: '"Truong Sa" means "long sand".' },
      { i: '🌳', vi: 'Cây bàng vuông là biểu tượng của Trường Sa.', en: 'The bàng vuông tree is the symbol of Truong Sa.' },
      { i: '📍', vi: 'Quần đảo Trường Sa thuộc tỉnh Khánh Hoà.', en: 'The Truong Sa Islands belong to Khanh Hoa province.' }
    ],
    words: [
      { w: 'cây bàng vuông', i: '🌳', ex: 'Cây bàng vuông đứng vững trước gió.', en: 'bàng vuông tree' },
      { w: 'chú bộ đội', i: '🪖', ex: 'Chú bộ đội canh giữ đảo.', en: 'soldier' },
      { w: 'con tàu', i: '🚢', ex: 'Con tàu ra đảo xa.', en: 'ship' },
      { w: 'lá thư', i: '✉️', ex: 'Em viết lá thư gửi chú bộ đội.', en: 'letter' }
    ],
    food: { i: '🥬', title: 'Vườn rau giữa biển', text: 'Nước ngọt trên đảo rất quý. Các chú bộ đội chăm chút từng luống rau xanh để có bữa cơm ngon giữa biển khơi.' },
    fact: 'Cây bàng vuông là biểu tượng của Trường Sa – cây chịu được gió mạnh, nắng nóng và hơi muối của biển.',
    game: {
      type: 'sentence', visual: 'tree', title: 'Gửi thư cho chú bộ đội',
      intro: 'Cùng viết thư gửi các chú bộ đội nhé! Chạm vào các chữ theo đúng thứ tự để tạo thành câu.',
      doneMsg: 'Thư đã gửi tới các chú bộ đội, cây bàng vuông đã lớn!',
      sentences: [['Cháu', 'chúc', 'các chú', 'luôn', 'mạnh khoẻ'], ['Cháu', 'yêu', 'biển đảo', 'Việt Nam']]
    },
    quiz: [
      { q: '"Trường Sa" có nghĩa là gì?', o: ['Cát vàng', 'Núi cao', 'Cát dài'], a: 2, k: 0, why: '"Trường" là dài, "Sa" là cát. Trường Sa nghĩa là cát dài.', en: 'What does "Truong Sa" mean?' },
      { q: 'Cây gì là biểu tượng của quần đảo Trường Sa?', o: ['Cây bàng vuông', 'Cây thông', 'Cây táo'], a: 0, k: 1, why: 'Cây bàng vuông là biểu tượng của Trường Sa.', en: 'Which tree is the symbol of the Truong Sa Islands?' },
      { q: 'Quần đảo Trường Sa thuộc tỉnh nào?', o: ['Lào Cai', 'Khánh Hoà', 'Điện Biên'], a: 1, k: 2, why: 'Quần đảo Trường Sa thuộc tỉnh Khánh Hoà.', en: 'Which province do the Truong Sa Islands belong to?' }
    ],
    en: {
      story: "We've reached the Truong Sa Islands! 'Truong Sa' means 'long sand'. Navy soldiers guard the islands of our homeland day and night. On Truong Sa Lon Island there is even a school for children.",
      food: 'Fresh water is precious on the islands. The soldiers carefully grow green vegetables to have good meals in the middle of the sea.',
      fact: 'The bàng vuông tree is the symbol of Truong Sa. It survives strong winds, hot sun and salty sea air.',
      game: "Let's write letters to the soldiers! Tap the words in the right order to make sentences."
    }
  },

  /* ================= CHẶNG 5: TÂY NGUYÊN & NAM TRUNG BỘ ================= */
  {
    id: 'buon-ma-thuot', chang: 5, icon: '☕', name: 'Buôn Ma Thuột', place: 'Đắk Lắk',
    pos: [108.04, 12.67], off: [-4, 0], lab: 'l', leg: 'sea',
    scene: { sky: 'day', far: 'hills', ground: 'redsoil', props: [['🌳', 14, 60, 12], ['🐘', 76, 70, 13], ['☕', 46, 84, 9]], special: 'longhouse' },
    travel: { icon: '🚌', text: 'Từ biển khơi trở về đất liền, Trâu Con đi xe khách lên cao nguyên đất đỏ bazan.' },
    story: 'Mình lên tới Tây Nguyên rồi! Buôn Ma Thuột được gọi là "thủ phủ cà phê". Người Ê Đê ở đây sống trong những ngôi nhà dài. Và nghe kìa – tiếng cồng chiêng vang vọng khắp núi rừng!',
    keys: [
      { i: '☕', vi: 'Buôn Ma Thuột được gọi là "thủ phủ cà phê".', en: 'Buon Ma Thuot is called the "coffee capital".' },
      { i: 'svg:gong', vi: 'Cồng chiêng Tây Nguyên là di sản văn hoá của nhân loại.', en: 'Central Highlands gong culture is UNESCO Intangible Cultural Heritage.' },
      { i: 'svg:longhouse', vi: 'Người Ê Đê sống trong những ngôi nhà dài.', en: 'The Ede people live in long houses.' }
    ],
    words: [
      { w: 'cồng chiêng', i: 'svg:gong', ex: 'Tiếng cồng chiêng vang khắp núi rừng.', en: 'gongs' },
      { w: 'cà phê', i: '☕', ex: 'Ông thích uống cà phê.', en: 'coffee' },
      { w: 'con voi', i: '🐘', ex: 'Con voi có cái vòi dài.', en: 'elephant' },
      { w: 'nhà dài', i: 'svg:longhouse', ex: 'Người Ê Đê sống trong nhà dài.', en: 'long house' }
    ],
    food: { i: '🥑', title: 'Bơ Đắk Lắk', text: 'Quả bơ Đắk Lắk béo ngậy, xay sinh tố bơ mát lạnh thì ngon tuyệt!' },
    fact: 'Không gian văn hoá Cồng chiêng Tây Nguyên đã được UNESCO ghi danh là di sản văn hoá của nhân loại.',
    game: {
      type: 'simon', title: 'Gõ cồng chiêng',
      intro: 'Nghe và nhìn Trâu Con gõ cồng chiêng, rồi gõ lại đúng như vậy nhé!',
      doneMsg: 'Tiếng cồng chiêng vang khắp núi rừng Tây Nguyên!',
      lengths: [2, 3, 4]
    },
    quiz: [
      { q: 'Buôn Ma Thuột nổi tiếng trồng cây gì?', o: ['Lúa mì', 'Cà phê', 'Nho'], a: 1, k: 0, why: 'Buôn Ma Thuột được gọi là thủ phủ cà phê.', en: 'Which crop is Buon Ma Thuot famous for?' },
      { q: 'Nhạc cụ nào là di sản của Tây Nguyên?', o: ['Cồng chiêng', 'Đàn piano', 'Kèn saxophone'], a: 0, k: 1, why: 'Cồng chiêng Tây Nguyên là di sản văn hoá của nhân loại.', en: 'Which instruments are the heritage of the Central Highlands?' },
      { q: 'Người Ê Đê sống trong ngôi nhà gì?', o: ['Nhà tuyết', 'Nhà chọc trời', 'Nhà dài'], a: 2, k: 2, why: 'Người Ê Đê sống trong những ngôi nhà dài.', en: 'What kind of house do the Ede people live in?' }
    ],
    en: {
      story: "I'm in the Central Highlands! Buon Ma Thuot is called the coffee capital. The Ede people here live in long houses. And listen: the sound of gongs echoes through the forests!",
      food: 'Dak Lak avocados are rich and creamy. An icy avocado smoothie is delicious!',
      fact: 'The Space of Gong Culture in the Central Highlands is recognised by UNESCO as Intangible Cultural Heritage of Humanity.',
      game: 'Watch and listen as Trau Con plays the gongs, then play them back in the same order.'
    }
  },
  {
    id: 'da-lat', chang: 5, icon: '🌸', name: 'Đà Lạt', place: 'Lâm Đồng',
    pos: [108.44, 11.94], off: [6, 2], lab: 'r', leg: 'land',
    scene: { sky: 'day', far: 'pines', water: 'lake', ground: 'grass', props: [['🌼', 14, 84, 9], ['🌸', 30, 88, 9], ['🍓', 70, 86, 9], ['🌻', 86, 82, 9]] },
    travel: { icon: '🚌', text: 'Trâu Con đi xe khách lên cao nguyên Lâm Viên, hai bên đường là rừng thông xanh mát.' },
    story: 'Brrr, Đà Lạt mát quá! Đây là "thành phố ngàn hoa", quanh năm se lạnh. Ở giữa thành phố có hồ Xuân Hương, xung quanh là rừng thông, vườn hoa và những vườn dâu tây đỏ mọng.',
    keys: [
      { i: '🌸', vi: 'Đà Lạt được gọi là "thành phố ngàn hoa".', en: 'Da Lat is called the "city of a thousand flowers".' },
      { i: '🧣', vi: 'Đà Lạt mát mẻ quanh năm.', en: 'Da Lat is cool all year round.' },
      { i: '🍓', vi: 'Đà Lạt trồng nhiều dâu tây.', en: 'Many strawberries are grown in Da Lat.' }
    ],
    words: [
      { w: 'bông hoa', i: '🌸', ex: 'Bông hoa nở thật đẹp.', en: 'flower' },
      { w: 'quả dâu tây', i: '🍓', ex: 'Quả dâu tây đỏ mọng.', en: 'strawberry' },
      { w: 'cây thông', i: '🌲', ex: 'Cây thông xanh quanh năm.', en: 'pine tree' },
      { w: 'khăn quàng', i: '🧣', ex: 'Trời lạnh, em quàng khăn.', en: 'scarf' }
    ],
    food: { i: '🍕', title: 'Bánh tráng nướng', text: 'Bánh tráng nướng giòn với trứng và hành, được gọi vui là "pizza Việt Nam".' },
    fact: 'Vào khoảng tháng 11, hoa dã quỳ nở vàng rực khắp các con đường ở Đà Lạt.',
    game: {
      type: 'collect', title: 'Dạo vườn hoa Đà Lạt',
      intro: 'Nghe Trâu Con nhờ, rồi chạm vào đúng những thứ cần tìm nhé!',
      doneMsg: 'Giỏ của Trâu Con đầy hoa và dâu tây rồi!',
      rounds: [
        { say: 'Hái 5 quả dâu tây', target: '🍓', n: 5, other: ['🌿', '🍃', '🌸'] },
        { say: 'Chạm vào tất cả bông hoa màu vàng', target: ['🌼', '🌻'], n: 4, other: ['🌸', '🌺', '🌷'] },
        { say: 'Chạm vào tất cả cây thông', target: '🌲', n: 3, other: ['🌳', '🌴', '🌵'] }
      ]
    },
    quiz: [
      { q: 'Đà Lạt được gọi là thành phố gì?', o: ['Thành phố biển', 'Thành phố tuyết', 'Thành phố ngàn hoa'], a: 2, k: 0, why: 'Đà Lạt được gọi là thành phố ngàn hoa.', en: 'What is Da Lat called?' },
      { q: 'Thời tiết Đà Lạt thế nào?', o: ['Mát mẻ', 'Nóng như sa mạc', 'Có tuyết quanh năm'], a: 0, k: 1, why: 'Đà Lạt mát mẻ quanh năm.', en: 'What is the weather like in Da Lat?' },
      { q: 'Quả gì màu đỏ được trồng nhiều ở Đà Lạt?', o: ['Sầu riêng', 'Dâu tây', 'Quả dừa'], a: 1, k: 2, why: 'Đà Lạt trồng nhiều dâu tây đỏ mọng.', en: 'Which red fruit is grown a lot in Da Lat?' }
    ],
    en: {
      story: 'Brrr, Da Lat is cool! This is the city of a thousand flowers, chilly all year round. In the middle of the city is Xuan Huong Lake, surrounded by pine forests, flower gardens and strawberry farms.',
      food: "Crispy grilled rice paper with egg and spring onions is jokingly called 'Vietnamese pizza'.",
      fact: "Around November, wild sunflowers bloom bright yellow along Da Lat's roads.",
      game: 'Listen to Trau Con, then tap all the right things.'
    }
  },
  {
    id: 'mui-ne', chang: 5, icon: '🏜️', name: 'Đồi cát Mũi Né', mapName: 'Mũi Né', place: 'Lâm Đồng', placeNote: 'trước đây thuộc Bình Thuận',
    pos: [108.287, 10.948], off: [4, 6], lab: 'r', leg: 'land',
    scene: { sky: 'day', far: 'dunes', ground: 'none', props: [['🛷', 38, 70, 11], ['☀️', 86, 14, 10]] },
    travel: { icon: '🚌', text: 'Từ Đà Lạt, Trâu Con đi xe khách đổ đèo xuống biển Mũi Né.' },
    story: 'Woa, ở đây có cả "sa mạc" bên bờ biển! Đây là đồi cát Mũi Né. Gió thổi làm những đồi cát thay đổi hình dáng, nên có tên là "đồi cát bay". Các bạn nhỏ thích ngồi trên tấm ván trượt cát vèo vèo. Ngoài biển, ngư dân đi những chiếc thuyền thúng tròn xoe.',
    keys: [
      { i: '🏜️', vi: 'Mũi Né có những đồi cát lớn bên bờ biển.', en: 'Mui Ne has big sand dunes by the sea.' },
      { i: '🌬️', vi: 'Gió thổi làm đồi cát đổi hình dáng, nên gọi là đồi cát bay.', en: 'The wind changes the shape of the dunes, so they are called "flying sand dunes".' },
      { i: 'svg:basketboat', vi: 'Ngư dân đi thuyền thúng tròn như cái rổ.', en: 'Fishermen use round basket boats.' }
    ],
    words: [
      { w: 'đồi cát', i: '🏜️', ex: 'Đồi cát vàng óng.', en: 'sand dune' },
      { w: 'cơn gió', i: '🌬️', ex: 'Cơn gió thổi mát rượi.', en: 'wind' },
      { w: 'thuyền thúng', i: 'svg:basketboat', ex: 'Thuyền thúng tròn như cái rổ.', en: 'round basket boat' },
      { w: 'trượt cát', i: '🛷', ex: 'Em trượt cát trên đồi.', en: 'sand sliding' }
    ],
    food: { i: '🌵', title: 'Thanh long Bình Thuận', text: 'Bình Thuận xưa là nơi trồng nhiều thanh long nhất Việt Nam. Quả thanh long vỏ hồng, ruột trắng hoặc đỏ, có những hạt đen nhỏ xíu.' },
    fact: 'Ở Mũi Né có một con suối nhỏ chảy giữa đồi cát đỏ và vách đá, gọi là Suối Tiên.',
    game: {
      type: 'fork', scene: 'dune', title: 'Trượt cát xuống đồi',
      intro: 'Nhìn hình, nghe Trâu Con đọc, rồi chọn đồi cát có chữ đúng để trượt xuống nhé!',
      doneMsg: 'Bạn trượt cát giỏi quá!',
      rounds: [
        { pic: '🏜️', say: 'cát', options: ['cát', 'cá'] }, { pic: '🌬️', say: 'gió', options: ['giỏ', 'gió'] },
        { pic: '🧺', say: 'cái rổ', options: ['cái rổ', 'cái rễ'] }, { pic: '🐟', say: 'con cá', options: ['con cò', 'con cá'] }
      ]
    },
    quiz: [
      { q: 'Mũi Né nổi tiếng với gì?', o: ['Những đồi cát lớn', 'Tuyết trắng', 'Rừng thông'], a: 0, k: 0, why: 'Mũi Né có những đồi cát lớn bên bờ biển.', en: 'What is Mui Ne famous for?' },
      { q: 'Vì sao gọi là "đồi cát bay"?', o: ['Vì cát biết bay như chim', 'Vì gió thổi làm đồi cát đổi hình dáng', 'Vì có máy bay'], a: 1, k: 1, why: 'Gió thổi làm đồi cát đổi hình dáng nên gọi là đồi cát bay.', en: 'Why are they called "flying sand dunes"?' },
      { q: 'Ngư dân Mũi Né đi thuyền gì tròn như cái rổ?', o: ['Tàu ngầm', 'Thuyền rồng', 'Thuyền thúng'], a: 2, k: 2, why: 'Thuyền thúng tròn như cái rổ.', en: 'Which round boat do Mui Ne fishermen use?' }
    ],
    en: {
      story: "Wow, there's a 'desert' by the sea! These are the Mui Ne sand dunes. The wind keeps changing their shapes, so people call them 'flying sand dunes'. Kids love sliding down them on boards. Out at sea, fishermen paddle round basket boats.",
      food: 'Old Binh Thuan grows more dragon fruit than anywhere else in Vietnam. Dragon fruit has pink skin and white or red flesh with tiny black seeds.',
      fact: 'In Mui Ne there is a small stream running between red sand dunes and cliffs, called the Fairy Stream.',
      game: 'Look at the picture, listen, then choose the dune with the matching word to slide down.'
    }
  },

  /* ================= CHẶNG 6: NAM BỘ & ĐẤT MŨI ================= */
  {
    id: 'tp-hcm', chang: 6, icon: '🏙️', name: 'TP. Hồ Chí Minh', place: 'Thành phố Hồ Chí Minh',
    pos: [106.698, 10.772], off: [6, -4], lab: 'l', leg: 'land',
    scene: { sky: 'day', far: 'skyline', ground: 'road', props: [['🚇', 18, 82, 11], ['🛵', 50, 86, 10], ['🥖', 82, 84, 9]], special: 'clocktower' },
    travel: { icon: '🚇', text: 'Từ Mũi Né, Trâu Con đi xe khách về Thành phố Hồ Chí Minh, rồi đi tàu điện metro số 1 tới ga Bến Thành.' },
    story: 'Mình đang ở Thành phố Hồ Chí Minh – thành phố đông dân nhất Việt Nam! Đây là chợ Bến Thành với tháp đồng hồ nổi tiếng. Nhìn lên kìa – toà nhà Landmark 81 cao vút. Xe máy chạy tấp nập khắp phố!',
    keys: [
      { i: '🏙️', vi: 'TP. Hồ Chí Minh là thành phố đông dân nhất Việt Nam, còn gọi là Sài Gòn.', en: 'Ho Chi Minh City, also called Saigon, is the most populous city in Vietnam.' },
      { i: '🕰️', vi: 'Chợ Bến Thành có tháp đồng hồ nổi tiếng.', en: 'Ben Thanh Market has a famous clock tower.' },
      { i: 'svg:vnd', vi: 'Tiền Việt Nam gọi là "đồng".', en: 'Vietnamese money is called "đồng".' },
      { i: '🏢', vi: 'Landmark 81 là toà nhà rất cao ở TP. Hồ Chí Minh.', en: 'Landmark 81 is a very tall skyscraper in Ho Chi Minh City.' }
    ],
    words: [
      { w: 'cái chợ', i: 'svg:market', ex: 'Mẹ đi chợ mua rau.', en: 'market' },
      { w: 'tiền', i: 'svg:vnd', ex: 'Em trả tiền cho cô bán hàng.', en: 'money' },
      { w: 'toà nhà', i: '🏙️', ex: 'Toà nhà cao chọc trời.', en: 'building' },
      { w: 'tàu điện', i: '🚇', ex: 'Tàu điện chạy rất nhanh.', en: 'metro train' }
    ],
    food: { i: '🍚', title: 'Cơm tấm', text: 'Cơm tấm sườn nướng thơm lừng, ăn với nước mắm chua ngọt – món ăn quen thuộc của người Sài Gòn.' },
    fact: 'Thành phố Hồ Chí Minh còn được nhiều người gọi thân thương là Sài Gòn.',
    game: {
      type: 'money', title: 'Đi chợ Bến Thành',
      intro: 'Trâu Con muốn mua đồ ở chợ. Chạm vào các tờ tiền để trả đúng số tiền nhé!',
      doneMsg: 'Trâu Con đã đi chợ Bến Thành thật giỏi!',
      bills: [5000, 10000, 20000, 50000],
      items: [{ w: 'ổ bánh mì', i: '🥖', price: 20000 }, { w: 'ly nước mía', i: '🥤', price: 15000 }, { w: 'chiếc nón lá', i: 'svg:nonla', price: 35000 }]
    },
    quiz: [
      { q: 'Chợ có tháp đồng hồ nổi tiếng ở TP. Hồ Chí Minh là chợ nào?', o: ['Chợ Đồng Xuân', 'Chợ nổi Cái Răng', 'Chợ Bến Thành'], a: 2, k: 1, why: 'Chợ Bến Thành có tháp đồng hồ nổi tiếng.', en: 'Which market in Ho Chi Minh City has a famous clock tower?' },
      { q: 'Tiền Việt Nam gọi là gì?', o: ['Đồng', 'Đô la', 'Yên'], a: 0, k: 2, why: 'Tiền Việt Nam gọi là đồng.', en: 'What is Vietnamese money called?' },
      { q: 'Toà nhà rất cao ở TP. Hồ Chí Minh tên là gì?', o: ['Tháp Rùa', 'Landmark 81', 'Chùa Cầu'], a: 1, k: 3, why: 'Landmark 81 là toà nhà rất cao ở TP. Hồ Chí Minh.', en: 'What is the name of the very tall building in Ho Chi Minh City?' }
    ],
    en: {
      story: "I'm in Ho Chi Minh City, the most populous city in Vietnam! This is Ben Thanh Market with its famous clock tower. Look up: the Landmark 81 tower is so tall! Motorbikes buzz through the streets.",
      food: 'Cơm tấm is broken rice with grilled pork chop and sweet-and-sour fish sauce, a Saigon favourite.',
      fact: 'Many people lovingly call Ho Chi Minh City by its old name, Saigon.',
      game: 'Trau Con wants to buy things at the market. Tap the banknotes to pay the exact price.'
    }
  },
  {
    id: 'con-dao', chang: 6, icon: '🐢', name: 'Côn Đảo', place: 'Đặc khu Côn Đảo, TP. Hồ Chí Minh', placeNote: 'trước đây thuộc Bà Rịa – Vũng Tàu',
    pos: [106.6, 8.69], off: [0, 0], lab: 'r', leg: 'air',
    scene: { sky: 'day', far: 'islandhills', water: 'sea', ground: 'sand', props: [['🐢', 30, 82, 10], ['🥚', 16, 88, 7], ['🥚', 20, 90, 7], ['🌴', 86, 56, 14]] },
    travel: { icon: '✈️', text: 'Trâu Con đi máy bay nhỏ từ TP. Hồ Chí Minh ra Côn Đảo, nhìn xuống thấy biển xanh như ngọc.' },
    story: 'Mình tới Côn Đảo rồi! Ở đây có Vườn quốc gia Côn Đảo, nơi rùa biển bò lên bãi cát để đẻ trứng nhiều nhất Việt Nam. Khi trứng nở, những chú rùa con bé xíu sẽ bò thật nhanh về biển.',
    keys: [
      { i: '🐢', vi: 'Côn Đảo là nơi rùa biển lên bãi cát đẻ trứng nhiều nhất Việt Nam.', en: 'More sea turtles nest on the beaches of Con Dao than anywhere else in Vietnam.' },
      { i: '🌊', vi: 'Rùa con nở ra sẽ bò về biển.', en: 'Baby turtles crawl to the sea after hatching.' },
      { i: '📍', vi: 'Côn Đảo nay là đặc khu thuộc TP. Hồ Chí Minh.', en: 'Con Dao is now a special zone of Ho Chi Minh City.' }
    ],
    words: [
      { w: 'rùa biển', i: '🐢', ex: 'Rùa biển bơi giỏi lắm.', en: 'sea turtle' },
      { w: 'quả trứng', i: '🥚', ex: 'Rùa mẹ đẻ trứng trên cát.', en: 'egg' },
      { w: 'bãi cát', i: '🏖️', ex: 'Bãi cát trắng mịn.', en: 'beach' },
      { w: 'con sóng', i: '🌊', ex: 'Con sóng vỗ vào bờ.', en: 'wave' }
    ],
    food: { i: '🌰', title: 'Hạt bàng Côn Đảo', text: 'Hạt bàng nhỏ mà béo bùi, được làm thành mứt hạt bàng – món quà đặc biệt của Côn Đảo.' },
    fact: 'Ở Côn Đảo có cả bò biển (dugong) – một loài vật biển rất hiếm và hiền lành.',
    game: {
      type: 'release', visual: 'turtles', title: 'Đưa rùa con về biển',
      intro: 'Những chú rùa con vừa nở! Chạm vào từng chú để giúp các bạn ấy về biển nhé.',
      doneMsg: 'Các chú rùa con đã về biển an toàn!',
      count: 6
    },
    quiz: [
      { q: 'Ở Côn Đảo, con vật nào bò lên bãi cát đẻ trứng?', o: ['Con gà', 'Rùa biển', 'Con voi'], a: 1, k: 0, why: 'Rùa biển bò lên bãi cát Côn Đảo để đẻ trứng.', en: 'Which animal comes onto the beaches of Con Dao to lay eggs?' },
      { q: 'Rùa con nở ra thì bò đi đâu?', o: ['Lên núi', 'Vào rừng', 'Ra biển'], a: 2, k: 1, why: 'Rùa con nở ra sẽ bò về biển.', en: 'Where do baby turtles go after hatching?' },
      { q: 'Côn Đảo nay thuộc thành phố nào?', o: ['TP. Hồ Chí Minh', 'Hà Nội', 'Huế'], a: 0, k: 2, why: 'Côn Đảo nay là đặc khu thuộc TP. Hồ Chí Minh.', en: 'Which city does Con Dao belong to now?' }
    ],
    en: {
      story: "I'm on Con Dao! In Con Dao National Park, more sea turtles come ashore to lay eggs than anywhere else in Vietnam. When the eggs hatch, tiny baby turtles hurry back to the sea.",
      food: 'Tropical almond nuts are small but rich. They are made into a special candied treat of Con Dao.',
      fact: 'Con Dao is also home to the dugong, a rare and gentle sea animal.',
      game: 'The baby turtles have just hatched! Tap each one to help it reach the sea.'
    }
  },
  {
    id: 'ben-tre', chang: 6, icon: '🥥', name: 'Xứ dừa Bến Tre', mapName: 'Bến Tre', place: 'Vĩnh Long', placeNote: 'trước đây là tỉnh Bến Tre',
    pos: [106.375, 10.243], off: [4, 4], lab: 'r', leg: 'sea',
    scene: { sky: 'day', far: 'palms', water: 'river', ground: 'none', props: [['🛶', 40, 80, 12], ['🥥', 76, 58, 10], ['🍬', 18, 60, 9]] },
    travel: { icon: '🚤', text: 'Từ Côn Đảo, Trâu Con đi tàu về đất liền, rồi ngồi xuồng len lỏi giữa những rặng dừa.' },
    story: 'Chào mừng các bạn đến xứ dừa Bến Tre! Ở đây dừa mọc khắp nơi, dọc bờ sông, bờ kênh. Mình đang ngồi xuồng đi qua con rạch rợp bóng dừa nước. Người dân làm ra kẹo dừa thơm ngon nổi tiếng khắp nơi.',
    keys: [
      { i: '🥥', vi: 'Bến Tre được gọi là "xứ dừa", có nhiều dừa nhất Việt Nam.', en: 'Ben Tre is called the "land of coconuts" and has the most coconuts in Vietnam.' },
      { i: '🍬', vi: 'Kẹo dừa là đặc sản nổi tiếng của Bến Tre.', en: 'Coconut candy is the famous specialty of Ben Tre.' },
      { i: '🛶', vi: 'Người miền Tây đi xuồng trên sông, rạch.', en: 'People in the Mekong Delta travel by small boats on rivers and canals.' }
    ],
    words: [
      { w: 'cây dừa', i: '🌴', ex: 'Cây dừa cao vút.', en: 'coconut tree' },
      { w: 'trái dừa', i: '🥥', ex: 'Nước trái dừa ngọt mát.', en: 'coconut (in the South: "trái")' },
      { w: 'kẹo dừa', i: '🍬', ex: 'Kẹo dừa dẻo và ngọt.', en: 'coconut candy' },
      { w: 'chiếc xuồng', i: '🛶', ex: 'Bác chèo xuồng trên rạch.', en: 'small boat' }
    ],
    food: { i: '🍬', title: 'Kẹo dừa Bến Tre', text: 'Kẹo dừa làm từ nước cốt dừa và mạch nha, dẻo thơm, là món quà nổi tiếng của Bến Tre.' },
    fact: 'Bến Tre là nơi có nhiều dừa nhất Việt Nam. Từ cây dừa, người ta làm ra kẹo, đồ thủ công và cả nước uống.',
    game: {
      type: 'order', visual: 'steps', title: 'Làm kẹo dừa',
      intro: 'Cùng Trâu Con làm kẹo dừa! Chạm vào các bước theo đúng thứ tự nhé.',
      prompt: 'Làm kẹo dừa: bước đầu tiên là gì nhỉ?',
      doneMsg: 'Mẻ kẹo dừa thơm phức đã xong!',
      items: [{ t: 'Nạo cơm dừa', i: '🥥' }, { t: 'Vắt nước cốt dừa', i: '🥛' }, { t: 'Nấu với mạch nha', i: '🍯' }, { t: 'Cắt thành viên', i: '✂️' }, { t: 'Gói giấy', i: '🍬' }]
    },
    quiz: [
      { q: 'Bến Tre được gọi là xứ gì?', o: ['Xứ dừa', 'Xứ tuyết', 'Xứ sa mạc'], a: 0, k: 0, why: 'Bến Tre được gọi là xứ dừa.', en: 'What is Ben Tre called?' },
      { q: 'Đặc sản nổi tiếng của Bến Tre là gì?', o: ['Phở', 'Kẹo dừa', 'Bánh chưng'], a: 1, k: 1, why: 'Kẹo dừa là đặc sản nổi tiếng của Bến Tre.', en: 'What is the famous specialty of Ben Tre?' },
      { q: 'Người miền Tây đi lại trên sông rạch bằng gì?', o: ['Xe trượt tuyết', 'Cáp treo', 'Xuồng'], a: 2, k: 2, why: 'Người miền Tây đi xuồng trên sông, rạch.', en: 'How do people in the Mekong Delta travel on rivers and canals?' }
    ],
    en: {
      story: "Welcome to Ben Tre, the land of coconuts! Coconut trees grow everywhere along rivers and canals. I'm riding a small boat through a canal shaded by water coconut palms. People here make famous, delicious coconut candy.",
      food: "Coconut candy is made from coconut milk and malt syrup. It's soft and fragrant, Ben Tre's famous gift.",
      fact: 'Ben Tre has more coconuts than anywhere else in Vietnam. From coconut trees, people make candy, handicrafts and drinks.',
      game: "Let's make coconut candy! Tap the steps in the right order."
    }
  },
  {
    id: 'cai-rang', chang: 6, icon: 'svg:floatingmarket', name: 'Chợ nổi Cái Răng', mapName: 'Cái Răng', place: 'Thành phố Cần Thơ',
    pos: [105.8, 10.0], off: [-4, -2], lab: 'l', leg: 'land',
    scene: { sky: 'sunrise', far: 'palms', water: 'river', ground: 'none', props: [['🛶', 24, 76, 12], ['🛶', 66, 82, 12], ['🍉', 22, 52, 9], ['🍍', 64, 58, 9]] },
    travel: { icon: '🛶', text: 'Từ Bến Tre, Trâu Con ngồi xuồng máy trên sông lúc trời còn tờ mờ sáng để kịp phiên chợ nổi.' },
    story: 'Chào buổi sáng từ chợ nổi Cái Răng! Ở đây người ta mua bán ngay trên ghe, trên xuồng giữa dòng sông. Mỗi ghe treo hàng lên một cây sào cao gọi là "cây bẹo", nhìn từ xa là biết ghe bán gì. Người miền Nam gọi "quả" là "trái", gọi "quả dứa" là "trái thơm" đó!',
    keys: [
      { i: 'svg:beo', vi: 'Ở chợ nổi, người ta treo hàng lên "cây bẹo" để khách nhìn từ xa.', en: 'At floating markets, sellers hang goods on a tall pole called "cây bẹo" so buyers can see from far away.' },
      { i: '🍉', vi: 'Người miền Nam gọi "quả" là "trái".', en: 'Southern Vietnamese say "trái" for fruit instead of "quả".' },
      { i: '🛶', vi: 'Chợ nổi Cái Răng họp trên sông, ở thành phố Cần Thơ.', en: 'Cai Rang Floating Market is held on the river in Can Tho city.' }
    ],
    words: [
      { w: 'chiếc ghe', i: '🛶', ex: 'Chiếc ghe chở đầy trái cây.', en: 'boat (Southern word)' },
      { w: 'trái cây', i: '🍉', ex: 'Trái cây miền Tây ngọt lịm.', en: 'fruit' },
      { w: 'cây bẹo', i: 'svg:beo', ex: 'Cây bẹo treo trái thơm.', en: 'tall pole showing goods' },
      { w: 'chợ nổi', i: 'svg:floatingmarket', ex: 'Chợ nổi họp trên sông.', en: 'floating market' }
    ],
    food: { i: '🍜', title: 'Hủ tiếu trên ghe', text: 'Ở chợ nổi, khách ngồi trên xuồng ăn tô hủ tiếu nóng hổi do người bán chèo ghe mang tới.' },
    fact: 'Sông Mê Kông khi chảy vào Việt Nam được gọi là sông Cửu Long – nghĩa là "chín con rồng".',
    game: {
      type: 'bheo', title: 'Nhìn cây bẹo, đoán ghe bán gì',
      intro: 'Nhìn món hàng treo trên cây bẹo, rồi chạm vào ghe đang bán thứ Trâu Con cần mua nhé!',
      doneMsg: 'Bạn đã biết đọc "cây bẹo" như người miền Tây!',
      items: [{ w: 'dưa hấu', i: '🍉' }, { w: 'trái thơm', i: '🍍', note: 'Miền Bắc gọi là quả dứa.' }, { w: 'trái dừa', i: '🥥' }, { w: 'chuối', i: '🍌' }, { w: 'xoài', i: '🥭' }],
      ask: 4
    },
    quiz: [
      { q: 'Ở chợ nổi, người ta treo hàng lên cây gì để khách nhìn thấy?', o: ['Cây bẹo', 'Cây thông', 'Cây cột điện'], a: 0, k: 0, why: 'Người ta treo hàng lên cây bẹo để khách nhìn từ xa.', en: 'At the floating market, what do sellers hang their goods on?' },
      { q: 'Người miền Nam gọi "quả" là gì?', o: ['Củ', 'Trái', 'Hạt'], a: 1, k: 1, why: 'Người miền Nam gọi "quả" là "trái".', en: 'What do Southerners call fruit ("quả")?' },
      { q: 'Chợ nổi Cái Răng họp ở đâu?', o: ['Trên núi', 'Trong hang', 'Trên sông'], a: 2, k: 2, why: 'Chợ nổi Cái Răng họp trên sông.', en: 'Where is Cai Rang Floating Market held?' }
    ],
    en: {
      story: "Good morning from Cai Rang Floating Market! Here people buy and sell right on boats in the middle of the river. Each boat hangs its goods on a tall pole called 'cây bẹo', so you can see from far away what it sells. Southerners say 'trái' instead of 'quả' for fruit, and call pineapple 'trái thơm'!",
      food: 'At the floating market, you can sit in a boat and eat a hot bowl of hủ tiếu noodle soup, brought by a seller paddling over.',
      fact: "When the Mekong River flows into Vietnam it is called the Cuu Long River, meaning 'Nine Dragons'.",
      game: 'Look at what hangs on each pole, then tap the boat selling what Trau Con needs.'
    }
  },
  {
    id: 'phu-quoc', chang: 6, icon: '🦪', name: 'Đảo Phú Quốc', mapName: 'Phú Quốc', place: 'Đặc khu Phú Quốc, tỉnh An Giang', placeNote: 'trước đây thuộc Kiên Giang',
    pos: [103.964, 10.227], off: [-4, 0], lab: 'l', leg: 'air',
    scene: { sky: 'sunset', far: 'islandhills', water: 'sea', ground: 'sand', props: [['🦪', 22, 86, 9], ['🌴', 86, 58, 14], ['🚡', 56, 22, 10]] },
    travel: { icon: '✈️', text: 'Từ Cần Thơ, Trâu Con đi máy bay ra đảo Phú Quốc.' },
    story: 'Mình đã tới Phú Quốc – hòn đảo lớn nhất Việt Nam, còn được gọi là "đảo ngọc". Nước biển ở đây trong xanh, bãi cát trắng mịn. Phú Quốc có cáp treo vượt biển rất dài, đưa khách sang đảo Hòn Thơm. Buổi chiều, mặt trời lặn đỏ rực trên biển.',
    keys: [
      { i: '🏝️', vi: 'Phú Quốc là hòn đảo lớn nhất Việt Nam.', en: 'Phu Quoc is the largest island in Vietnam.' },
      { i: '🦪', vi: 'Phú Quốc được gọi là "đảo ngọc", nổi tiếng với ngọc trai.', en: 'Phu Quoc is called the "Pearl Island" and is famous for pearls.' },
      { i: '📍', vi: 'Phú Quốc nay là đặc khu thuộc tỉnh An Giang.', en: 'Phu Quoc is now a special zone of An Giang province.' }
    ],
    words: [
      { w: 'hòn đảo', i: '🏝️', ex: 'Phú Quốc là hòn đảo lớn.', en: 'island' },
      { w: 'ngọc trai', i: '🦪', ex: 'Ngọc trai trắng và tròn.', en: 'pearl' },
      { w: 'cáp treo', i: '🚡', ex: 'Cáp treo bay qua biển.', en: 'cable car' },
      { w: 'hoàng hôn', i: 'svg:sunset', ex: 'Hoàng hôn trên biển rất đẹp.', en: 'sunset' }
    ],
    food: { i: '🌶️', title: 'Hồ tiêu Phú Quốc', text: 'Phú Quốc trồng hồ tiêu thơm cay và làm nước mắm ngon nổi tiếng.' },
    fact: 'Phú Quốc nổi tiếng với nghề nuôi ngọc trai. Ngọc trai lớn lên bên trong vỏ trai dưới biển.',
    game: {
      type: 'hideseek', cover: 'shell', title: 'Tìm ngọc trai',
      intro: 'Những người bạn biển đang trốn dưới vỏ sò. Nghe Trâu Con gọi tên, rồi chạm vào vỏ sò để tìm nhé!',
      doneMsg: 'Bạn đã tìm thấy ngọc trai và các bạn biển!',
      items: [{ w: 'ngọc trai', i: '⚪' }, { w: 'con cua', i: '🦀' }, { w: 'con ốc', i: '🐚' }, { w: 'con cá', i: '🐠' }, { w: 'con tôm', i: '🦐' }, { w: 'con sao biển', i: '⭐' }],
      find: 4
    },
    quiz: [
      { q: 'Hòn đảo lớn nhất Việt Nam là đảo nào?', o: ['Phú Quốc', 'Lý Sơn', 'Côn Đảo'], a: 0, k: 0, why: 'Phú Quốc là hòn đảo lớn nhất Việt Nam.', en: 'Which is the largest island in Vietnam?' },
      { q: 'Phú Quốc còn được gọi là gì?', o: ['Đảo tuyết', 'Đảo ngọc', 'Đảo lửa'], a: 1, k: 1, why: 'Phú Quốc được gọi là đảo ngọc, nổi tiếng với ngọc trai.', en: 'What is Phu Quoc also called?' },
      { q: 'Phú Quốc nay thuộc tỉnh nào?', o: ['Lào Cai', 'Hà Nội', 'An Giang'], a: 2, k: 2, why: 'Phú Quốc nay là đặc khu thuộc tỉnh An Giang.', en: 'Which province does Phu Quoc belong to now?' }
    ],
    en: {
      story: "I've arrived on Phu Quoc, the largest island in Vietnam, also called the Pearl Island. The water is clear and blue, and the sand is soft and white. A very long cable car crosses the sea to Hon Thom Island. In the evening, the sun sets bright red over the sea.",
      food: 'Phu Quoc grows spicy, fragrant pepper and makes famous fish sauce.',
      fact: 'Phu Quoc is famous for pearl farming. Pearls grow inside oyster shells under the sea.',
      game: 'Sea friends are hiding under shells. Listen to the name, then tap a shell to find it.'
    }
  },
  {
    id: 'dat-mui', chang: 6, icon: '🚢', name: 'Đất Mũi Cà Mau', place: 'Cà Mau',
    pos: [104.72, 8.6], off: [0, 4], lab: 'b', leg: 'sea', cuc: 'Nam',
    scene: { sky: 'day', far: 'mangrove', water: 'sea', ground: 'mud', props: [['🦀', 20, 86, 9], ['🚢', 50, 62, 13]], special: 'mangrove' },
    travel: { icon: '🚤', text: 'Từ Phú Quốc, Trâu Con đi tàu về đất liền, rồi ngồi ca nô len lỏi giữa những cánh rừng đước xanh để tới Đất Mũi.' },
    story: 'Chúng mình đã tới Đất Mũi Cà Mau – điểm cực Nam của Tổ quốc! Ở đây có biểu tượng con tàu hướng ra biển và cột mốc toạ độ quốc gia. Nhờ rừng đước giữ phù sa, mũi đất mỗi năm lại lấn thêm ra biển. Hành trình từ Lũng Cú tới Cà Mau của chúng mình sắp hoàn thành rồi!',
    keys: [
      { i: '🧭', vi: 'Đất Mũi Cà Mau là điểm cực Nam của Việt Nam.', en: 'Ca Mau Cape is the southernmost point of Vietnam.' },
      { i: 'svg:mangrove', vi: 'Rừng đước giữ phù sa, giúp mũi đất lấn ra biển.', en: 'Mangrove forests hold the silt and help the cape grow into the sea.' },
      { i: '🦀', vi: 'Cua Cà Mau là món đặc sản nổi tiếng.', en: 'Ca Mau crab is a famous specialty.' }
    ],
    words: [
      { w: 'rừng đước', i: 'svg:mangrove', ex: 'Rừng đước xanh mênh mông.', en: 'mangrove forest' },
      { w: 'cột mốc', i: 'svg:marker', ex: 'Cột mốc ở mũi đất.', en: 'marker' },
      { w: 'con tàu', i: '🚢', ex: 'Biểu tượng con tàu hướng ra biển.', en: 'ship' },
      { w: 'con cua', i: '🦀', ex: 'Con cua có hai cái càng.', en: 'crab' }
    ],
    food: { i: '🦀', title: 'Cua Cà Mau', text: 'Cua Cà Mau to, chắc thịt, nổi tiếng khắp cả nước.' },
    fact: 'Mũi Cà Mau có ba mặt giáp biển: Biển Đông và vịnh Thái Lan. Vườn quốc gia Mũi Cà Mau là khu dự trữ sinh quyển thế giới.',
    game: {
      type: 'plant', title: 'Trồng rừng đước, cắm cờ Đất Mũi',
      intro: 'Chạm vào bãi bùn để trồng cây đước giữ đất. Trồng đủ rồi thì cắm cờ ở mũi đất nhé!',
      doneMsg: 'Hành trình từ Lũng Cú tới Cà Mau đã tới đích!',
      count: 6
    },
    quiz: [
      { q: 'Đất Mũi Cà Mau là điểm cực nào của Việt Nam?', o: ['Cực Bắc', 'Cực Nam', 'Cực Tây'], a: 1, k: 0, why: 'Đất Mũi Cà Mau là điểm cực Nam của Việt Nam.', en: 'Which extreme point of Vietnam is Ca Mau Cape?' },
      { q: 'Cây gì giữ đất, giúp mũi Cà Mau lấn ra biển?', o: ['Cây xương rồng', 'Cây thông', 'Cây đước'], a: 2, k: 1, why: 'Rừng đước giữ phù sa, giúp mũi đất lấn ra biển.', en: 'Which tree helps Ca Mau Cape grow into the sea?' },
      { q: 'Món đặc sản nổi tiếng của Cà Mau là gì?', o: ['Cua Cà Mau', 'Cá hồi Sa Pa', 'Bơ Đắk Lắk'], a: 0, k: 2, why: 'Cua Cà Mau là món đặc sản nổi tiếng.', en: 'What famous food comes from Ca Mau?' }
    ],
    en: {
      story: "We've reached Ca Mau Cape, the southernmost point of our homeland! There is a ship-shaped monument facing the sea and the national coordinate marker. Because the mangroves hold the silt, the cape grows further into the sea every year. Our journey from Lung Cu to Ca Mau is almost complete!",
      food: 'Ca Mau crabs are big and meaty, famous all over Vietnam.',
      fact: 'Ca Mau Cape has sea on three sides: the East Sea and the Gulf of Thailand. Mui Ca Mau National Park is a World Biosphere Reserve.',
      game: 'Tap the mudflat to plant mangroves. When you are done, plant the flag at the tip of the cape!'
    }
  }
];
