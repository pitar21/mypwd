// ===== TTS 初期化 =====
let ruVoice = null;

function pickRuVoice() {
  const voices = speechSynthesis.getVoices();
  // ru優先で選択（nameやlangに"ru"含む物）
  ruVoice = voices.find(v => /ru/i.test(v.lang)) 
          || voices.find(v => /ru/i.test(v.name))
          || null;
}

// iOS/Safariは非同期でvoicesが来る
if (typeof speechSynthesis !== 'undefined') {
  pickRuVoice(); // 先に一度試す
  speechSynthesis.onvoiceschanged = pickRuVoice;
}

// ===== 読み上げ関数 =====
function speakRU(text, rate = 1.0) {
  if (!text) return;
  // iOSで詰まり防止
  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ru-RU';
  if (ruVoice) u.voice = ruVoice;
  // iOSは rate の実効範囲が狭いので 0.7〜1.3 推奨
  u.rate = Math.max(0.5, Math.min(2.0, rate));
  speechSynthesis.speak(u);
}

// 例：単語クリックで呼ぶ
// li.onclick = () => speakRU(row[0], currentRate);

// 初回は必ずユーザー操作内で一度だけ呼ぶ（iOSで必須）
document.addEventListener('click', function unlockTTSOnce() {
  // 無音でもよいが短い読み上げを一度通すと安定
  speakRU(' ', 1.0);
  document.removeEventListener('click', unlockTTSOnce);
}, {once:true});
