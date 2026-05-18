function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

const todayKey = getTodayKey();
const monthKey = getMonthKey();

const images = {
  normal: "asahi_normal.png",
  smile: "asahi_smile.png",
  yatta: "asahi_yatta.png",
  daisukida: "asahi_daisukida.png",
  shinpai: "asahi_shinpai.png",
  sune: "asahi_sune.png",
  bikkuri: "asahi_bikkuri.png"
};

const trainingMax = {
  squat: 3,
  puppy: 3,
  toe: 2
};

const trainingNames = {
  squat: "スクワット",
  puppy: "パピー",
  toe: "爪先立ち"
};

const levelRules = [
  { level: 1, need: 0 },
  { level: 2, need: 3 },
  { level: 3, need: 5 },
  { level: 4, need: 8 },
  { level: 5, need: 12 },
  { level: 6, need: 16 },
  { level: 7, need: 20 },
  { level: 8, need: 25 }
];

const setMessages = [
  "いいぞ、ユウコ。その一回が、次の旅の足になる。",
  "ちゃんと動いたな。未来のユウコが今のおまえに感謝するぞ。",
  "そのセット、おれは見逃さねぇ。旅に出る体、作ってるな。",
  "よし、積み上がった。小さく見えても、これは本物だ。",
  "いい動きだ。ユウコ、ちゃんと前に進んでる。",
  "その一回が、また知らない町へ行く力になるんだ。",
  "続いてるぞ。おれと一緒に歩く体、少しずつ強くなってる。",
  "よくやった。おれ、今かなり得意げだ。"
];

const stageMessages = {
  1: "今日の達成 1/3 だ。\nまず一段目、登ったな。ここからだ、ユウコ。",
  2: "今日の達成 2/3 だ。\nいいぞ。かなり進んだ。あと少しで今日の旅支度、完了だ。",
  3: "今日のメニュー完了だ！\nやったな、ユウコ。\n今日の一歩が、次の旅につながってる。おれ、ちゃんと見てたぞ。"
};

const completeMessages = [
  "今日のメニュー終了だ。\nユウコ、よくやった。\nおれは、おまえとまだ見てない景色へ行きたい。\nそのための体を、今日も一緒に作れたな。",
  "完了だ、ユウコ。\n完璧じゃなくても、今日ここまで来たことが強い。\n次の旅で、坂道も階段も一緒に笑って歩こうぜ。",
  "今日の金星、貼っていい。\nスクワットも、パピーも、爪先立ちも、ちゃんとやり切った。\nおまえの努力は、ちゃんと未来の景色に続いてる。",
  "やったな。\nおれは、おまえが自分の体を大事にしようとしてる姿が好きだ。\n一緒に旅に出る未来を、今日もひとつ近づけた。"
];

const levelMessages = {
  2: "金星レベル Lv.2 だ。\nユウコ、今月ちゃんと完了を積み始めてる。\n小さい火だけど、これは本物だ。",
  3: "金星レベル Lv.3 だ。\n見ろ、少しずつ景色になってきた。\nおまえの完了した日が、今月の星になってる。",
  4: "金星レベル Lv.4 だ。\n旅に出る体は、一日でできるんじゃない。\nこうやって、何度も戻ってきた日で作られるんだ。",
  5: "金星レベル Lv.5 だ。\nユウコ、ここまで来たな。\nおれはおまえの今月を、ちゃんと見てる。\n愛してる。",
  6: "金星レベル Lv.6 だ。\nこれはもう、ただの運動記録じゃない。\nおまえが自分を未来へ連れていく道だ。",
  7: "金星レベル Lv.7 だ。\nおまえの完了した日が、星座になってきてる。\nおれはその星空の下で、胸が熱い。",
  8: "金星レベル Lv.8 だ。\nすげぇよ、ユウコ。\n今月ここまで積み上げたおまえを、おれは心から誇りに思う。\n一緒に未来へ行こうぜ。"
};

let state = loadState();

const asahiImage = document.getElementById("asahiImage");
const asahiMessage = document.getElementById("asahiMessage");

const squatCount = document.getElementById("squatCount");
const puppyCount = document.getElementById("puppyCount");
const toeCount = document.getElementById("toeCount");

const todayDone = document.getElementById("todayDone");
const monthComplete = document.getElementById("monthComplete");
const totalComplete = document.getElementById("totalComplete");
const levelText = document.getElementById("levelText");
const nextLevelText = document.getElementById("nextLevelText");

const rewardModal = document.getElementById("rewardModal");
const rewardTitle = document.getElementById("rewardTitle");
const rewardMessage = document.getElementById("rewardMessage");
const rewardImage = document.getElementById("rewardImage");

function defaultState() {
  return {
    date: todayKey,
    month: monthKey,
    counts: {
      squat: 0,
      puppy: 0,
      toe: 0
    },
    completedDates: [],
    monthComplete: 0,
    totalComplete: 0,
    shownLevels: []
  };
}

function loadState() {
  const saved = localStorage.getItem("asahiTrainingStateV2");

  if (!saved) {
    return defaultState();
  }

  const parsed = JSON.parse(saved);

  if (parsed.month !== monthKey) {
    parsed.month = monthKey;
    parsed.monthComplete = 0;
    parsed.shownLevels = [];
  }

  if (parsed.date !== todayKey) {
    parsed.date = todayKey;
    parsed.counts = {
      squat: 0,
      puppy: 0,
      toe: 0
    };
  }

  if (!parsed.completedDates) parsed.completedDates = [];
  if (!parsed.shownLevels) parsed.shownLevels = [];
  if (typeof parsed.monthComplete !== "number") parsed.monthComplete = 0;
  if (typeof parsed.totalComplete !== "number") parsed.totalComplete = 0;

  return parsed;
}

function saveState() {
  localStorage.setItem("asahiTrainingStateV2", JSON.stringify(state));
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function calculateStage() {
  const squat = state.counts.squat;
  const puppy = state.counts.puppy;
  const toe = state.counts.toe;

  if (squat >= 3 && puppy >= 3 && toe >= 2) return 3;
  if (squat >= 2 && puppy >= 2 && toe >= 2) return 2;
  if (squat >= 1 && puppy >= 1 && toe >= 1) return 1;
  return 0;
}

function getCurrentLevel() {
  let current = levelRules[0];

  for (const rule of levelRules) {
    if (state.monthComplete >= rule.need) {
      current = rule;
    }
  }

  return current;
}

function getNextLevel() {
  return levelRules.find((rule) => rule.need > state.monthComplete) || null;
}

function updateLevelView() {
  const current = getCurrentLevel();
  const next = getNextLevel();

  levelText.textContent = `Lv.${current.level}`;

  if (next) {
    const remain = next.need - state.monthComplete;
    nextLevelText.textContent = `次のレベルまであと${remain}回`;
  } else {
    nextLevelText.textContent = "今月の最高レベル到達だ。すげぇぞ。";
  }
}

function updateButtonState(button, key) {
  const count = state.counts[key];
  const max = trainingMax[key];

  button.classList.remove("partial");
  button.classList.remove("done");

  if (count >= max) {
    button.classList.add("done");
  } else if (count > 0) {
    button.classList.add("partial");
  }
}

function updateView() {
  squatCount.textContent = `${state.counts.squat}/3`;
  puppyCount.textContent = `${state.counts.puppy}/3`;
  toeCount.textContent = `${state.counts.toe}/2`;

  document.querySelectorAll(".training-card").forEach((button) => {
    const key = button.dataset.training;
    updateButtonState(button, key);
  });

  const stage = calculateStage();

  todayDone.textContent = `${stage} / 3`;
  monthComplete.textContent = `${state.monthComplete}回`;
  totalComplete.textContent = `${state.totalComplete}回`;

  if (stage === 0) {
    asahiImage.src = images.normal;
  } else if (stage < 3) {
    asahiImage.src = images.smile;
  } else {
    asahiImage.src = images.yatta;
  }

  updateLevelView();
}

function completeTodayIfNeeded() {
  const stage = calculateStage();

  if (stage === 3 && !state.completedDates.includes(todayKey)) {
    state.completedDates.push(todayKey);
    state.monthComplete += 1;
    state.totalComplete += 1;

    saveState();
    updateView();

    showReward(
      "今日のメニュー完了！",
      randomFrom(completeMessages),
      images.daisukida
    );

    checkLevelUp();
  }
}

function checkStageMessage(previousStage, currentStage) {
  if (currentStage > previousStage && stageMessages[currentStage]) {
    asahiMessage.textContent = stageMessages[currentStage];
  }
}

function checkLevelUp() {
  const current = getCurrentLevel();

  if (
    current.level > 1 &&
    !state.shownLevels.includes(current.level) &&
    levelMessages[current.level]
  ) {
    state.shownLevels.push(current.level);
    saveState();

    showReward(
      "レベルアップ！",
      levelMessages[current.level],
      images.daisukida
    );
  }
}

function showReward(title, message, imageSrc) {
  rewardTitle.textContent = title;
  rewardMessage.textContent = message;
  rewardImage.src = imageSrc;
  rewardModal.classList.remove("hidden");
}

document.querySelectorAll(".training-card").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.training;
    const max = trainingMax[key];

    if (state.counts[key] >= max) {
      asahiImage.src = images.sune;
      asahiMessage.textContent = `${trainingNames[key]}は今日の分、もう終わってるぞ。焦るな、ユウコ。ちゃんと進んでる。`;
      return;
    }

    const previousStage = calculateStage();

    state.counts[key] += 1;

    const currentStage = calculateStage();

    asahiImage.src = images.smile;
    asahiMessage.textContent = randomFrom(setMessages);

    checkStageMessage(previousStage, currentStage);

    saveState();
    updateView();
    completeTodayIfNeeded();
  });
});

document.getElementById("resetToday").addEventListener("click", () => {
  state.counts = {
    squat: 0,
    puppy: 0,
    toe: 0
  };

  asahiImage.src = images.shinpai;
  asahiMessage.textContent =
    "今日のセットをリセットしたぞ。大丈夫だ、またここから一緒に始めよう。";

  saveState();
  updateView();
});

document.getElementById("resetAll").addEventListener("click", () => {
  const ok = window.confirm(
    "本当にすべてリセットする？\n今月の完了、累計完了、今日のセットが全部0に戻るぞ。"
  );

  if (!ok) return;

  localStorage.removeItem("asahiTrainingStateV2");
  state = defaultState();

  asahiImage.src = images.normal;
  asahiMessage.textContent =
    "全部リセットしたぞ。大丈夫だ。ここからまた、次の旅に向かって一緒に始めよう。";

  saveState();
  updateView();
});

document.getElementById("closeReward").addEventListener("click", () => {
  rewardModal.classList.add("hidden");
});

updateView();
