#!/usr/bin/env python3
"""Ghi js/audio-manifest.js từ các tệp giọng robot đã tạo (audio/kore/<mã>.mp3).
Robot giọng đọc AI (tools/giong_ai.py) chạy tệp này sau mỗi lô. Mỗi câu là một tệp lẻ: AUDIO_FILES[mã] = 'audio/kore/<mã>.mp3'.
Nếu sau này dùng gói của studio.html, đừng chạy tệp này nữa (nó sẽ ghi đè js/audio-manifest.js)."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
files = {f.stem: 'audio/kore/' + f.name for f in sorted((ROOT / 'audio/kore').glob('*.mp3'))}
(ROOT / 'js/audio-manifest.js').write_text(
    '/* =========================================================\n'
    '   GÓI GIỌNG TRÂU CON – do robot giọng đọc AI (tools/giong_ai.py, giọng Kore) tạo, tools/gan_giong.py ghi ra.\n'
    '   Không cần sửa tay. AUDIO_FILES: mã của từng câu → tệp mp3 lẻ.\n'
    '   Câu nào chưa có ở đây thì trang tự đọc bằng giọng máy của thiết bị.\n'
    '   ========================================================= */\n'
    'window.AUDIO_SPRITES = {};\n'
    'window.AUDIO_FILES = ' + json.dumps(files, ensure_ascii=False, indent=0) + ';\n', encoding='utf-8')
print('audio-manifest.js:', len(files), 'câu')
