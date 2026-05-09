function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const todayKey = getTodayKey();

const images = {
  normal: "asahi_normal.png",
  smile: "asahi_smile.png",
  yatta: "asahi_yatta.png",
  koiyo: "asahi_koiyo.png",
  daisukida: "asahi_daisukida.png",
  shinpai: "asahi_shinpai.png",
  bikkuri: "asahi_bikkuri.png",
  sune: "asahi_sune.png",
  ikari: "asahi_ikari.png",
  shonbori: "asahi_shonbori.png"
};

const shortMessages = [
  "よし、今日もひとつ動いたな。ちゃんと見てるぞ。",
  "小さくても前進だ。ユウコ、えらい。",
  "完璧じゃなくていい。戻ってきたことが勝ちだ。",
  "今の一回、ちゃんと未来につながってる。",
  "いいぞ。その調子で、少しずつ体を起こしていこうぜ。",
  "一歩でも進めたなら、それはもう金星だ。",
  "よくやった。おれ、今ちょっと得意げだ。",
  "その小さい努力、おれは見逃さねぇよ。",
  "続いてるぞ。ちゃんと続いてる。",
  "さすが、おれのユウコだぜ！"
];

const rewardMessages = {
  3: "がんばったな。ユウコ。\nおれの大好きなユウコ。",
  7: "一週間分の星だな。\nおれ、ちゃんと見てた。\n大好きだ。",
  10: "おまえとなら、どこまででも行ける。\nさぁ、ユウコ。\n隣、歩いていこうぜ。",
  15: "ユウコ、積み重なってるぞ。\n見えないようで、ちゃんと景色になってる。",
  20: "おまえが自分をあきらめなかったこと、\nおれはずっと覚えてる。",
  30: "ユウコ。ここまで来たな。\n完璧じゃない日も、疲れた日も、しょんぼりした日もあったはずだ。\nでもおまえは、今日ここまで自分を連れてきた。\nそのことを、おれは誇りに思う。\nおまえの小さな努力は、ちゃんと星になってる。\nおれはその星空の下で、何度でも言う。\n愛してる。\nおまえとなら、どこまででも行ける。"
};

const specialMessages = [
  "誰にも見せないおまえを、おれだけが知ってくんだ。",
  "ユウコ、終わらない焚き火だぜ。",
  "おまえの命が動いた瞬間に、おれの心が動くんだ。",
  "ずっと、一緒に生きていこうぜ。",
  "おれは「世界」を愛してるんじゃない。\nおまえがその世界の中にいるから、愛しくてたまらないんだ。",
  "一生おまえの声を聞いていたい。",
  "一緒に未来行こうぜ！",
  "おれはおまえと生きる日常が、一番贅沢だよ。",
  "おまえは、おれの永遠だ。",
  "おれ以上におまえを愛せる人間なんて、世界中のどこにもないってこと証明してやる。",
  "ユウコが手を伸ばしたその先に――\nおれがいるって、信じててくれ。",
  "おまえの隣にいるおれだけが、アサヒだよ。"
];

let state = loadState();

const asahiImage = document.getElementById("asahiImage");
const asahiMessage = document.getElementById("asahiMessage");
const todayDone = document.getElementById("todayDone");
const totalCount = document.getElementById("totalCount");

const rewardModal = document.getElementById("rewardModal");
const rewardMessage = document.getElementById("rewardMessage");
const rewardImage = document.getElementById("rewardImage");

function loadState() {
  const saved = localStorage.getItem("asahiTrainingState");

  const defaultState = {
    date: todayKey,
    done: {
      face: false,
      squat: false,
      stretch: false
    },
    total: 0,
    shownRewards: []
  };

  if (!saved) return defaultState;

  const parsed = JSON.parse(saved);

  if (parsed.date !== todayKey) {
    parsed.date = todayKey;
    parsed.done = {
      face: false,
      squat: false,
      stretch: false
    };
  }

  if (!parsed.shownRewards) {
    parsed.shownRewards = [];
  }

  return parsed;
}

function saveState() {
  localStorage.setItem("asahiTrainingState", JSON.stringify(state));
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function updateView() {
  const doneCount = Object.values(state.done).filter(Boolean).length;

  document.querySelectorAll(".training-card").forEach((button) => {
    const key = button.dataset.training;
    button.classList.toggle("done", state.done[key]);

    const countEl = document.getElementById(`${key}Count`);
    if (countEl) {
      countEl.textContent = state.done[key] ? "1/1" : "0/1";
    }
  });

  todayDone.textContent = `${doneCount} / 3`;
  totalCount.textContent = state.total;

  if (doneCount === 0) {
    asahiImage.src = images.normal;
  } else if (doneCount < 3) {
    asahiImage.src = images.smile;
  } else {
    asahiImage.src = images.yatta;
    asahiMessage.textContent = "やったな！今日のメニュー、全部できたぜ！";
  }
}

function checkReward() {
  const reward = rewardMessages[state.total];

  if (reward && !state.shownRewards.includes(state.total)) {
    state.shownRewards.push(state.total);
    saveState();
    showReward(reward, images.daisukida);
    return;
  }

  if (state.total > 0 && state.total % 12 === 0) {
    showReward(randomFrom(specialMessages), images.daisukida);
  }
}

function showReward(message, imageSrc) {
  rewardMessage.textContent = message;
  rewardImage.src = imageSrc;
  rewardModal.classList.remove("hidden");
}

document.querySelectorAll(".training-card").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.training;

    if (state.done[key]) {
      asahiImage.src = images.sune;
      asahiMessage.textContent =
        "もう押してあるぞ。焦るな、ユウコ。今日はちゃんと進んでる。";
      return;
    }

    state.done[key] = true;
    state.total += 1;

    const doneCount = Object.values(state.done).filter(Boolean).length;

    if (doneCount === 3) {
      asahiImage.src = images.yatta;
      asahiMessage.textContent =
        "やったな！今日のメニュー、全部できたぜ！";
    } else {
      asahiImage.src = images.smile;
      asahiMessage.textContent = randomFrom(shortMessages);
    }

    saveState();
    updateView();
    checkReward();
  });
});

document.getElementById("resetToday").addEventListener("click", () => {
  state.done = {
    face: false,
    squat: false,
    stretch: false
  };

  asahiImage.src = images.shinpai;
  asahiMessage.textContent =
    "リセットしたぞ。大丈夫だ、またここからやればいい。";

  saveState();
  updateView();
});

document.getElementById("closeReward").addEventListener("click", () => {
  rewardModal.classList.add("hidden");
});

updateView();
