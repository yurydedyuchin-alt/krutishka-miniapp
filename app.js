const classes = ["1","2","3","4","5","6","7","8","9","10","11"];
const days = [
  ["monday","Понедельник"],
  ["tuesday","Вторник"],
  ["wednesday","Среда"],
  ["thursday","Четверг"],
  ["friday","Пятница"],
  ["saturday","Суббота"]
];

// Расписание пока не заполнено.
const schedule = {};

let selectedClass = null;
let selectedDay = "monday";

const $ = (id) => document.getElementById(id);

function showOnly(id) {
  ["scheduleSection", "aboutSection"].forEach((sectionId) => {
    const el = $(sectionId);
    if (el) el.classList.add("hidden");
  });
  const target = $(id);
  if (target) target.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function renderClasses() {
  const list = $("classList");
  if (!list) return;

  list.innerHTML = "";

  classes.forEach((classNumber) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "class-button";
    button.textContent = `${classNumber} класс`;

    button.addEventListener("click", () => {
      selectedClass = classNumber;
      $("scheduleDetails").classList.remove("hidden");
      $("selectedClassTitle").textContent = `Расписание · ${classNumber} класс`;
      renderDays();
      renderSchedule();
    });

    list.appendChild(button);
  });
}

function renderDays() {
  const list = $("dayList");
  if (!list) return;

  list.innerHTML = "";

  days.forEach(([key, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-button";
    if (key === selectedDay) button.classList.add("selected");
    button.textContent = label;

    button.addEventListener("click", () => {
      selectedDay = key;
      renderDays();
      renderSchedule();
    });

    list.appendChild(button);
  });
}

function renderSchedule() {
  const title = $("selectedDayTitle");
  const lessons = $("lessons");
  if (!title || !lessons || !selectedClass) return;

  const day = days.find(([key]) => key === selectedDay);
  title.textContent = `${day ? day[1] : ""} · ${selectedClass} класс`;

  const items =
    schedule[selectedClass] &&
    schedule[selectedClass][selectedDay];

  if (!items || items.length === 0) {
    lessons.innerHTML =
      '<div class="empty">Расписание пока не заполнено.<br>После утверждения расписания школы данные появятся здесь.</div>';
    return;
  }

  lessons.innerHTML = "";

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "lesson";

    const number = document.createElement("div");
    number.className = "lesson-number";
    number.textContent = index + 1;

    const content = document.createElement("div");

    const subject = document.createElement("div");
    subject.className = "lesson-name";
    subject.textContent = item.subject;

    const time = document.createElement("div");
    time.className = "lesson-time";
    time.textContent = item.time || "";

    content.appendChild(subject);
    content.appendChild(time);
    row.appendChild(number);
    row.appendChild(content);
    lessons.appendChild(row);
  });
}

function init() {
  const openSchedule = $("openSchedule");
  const openAbout = $("openAbout");
  const backFromSchedule = $("backFromSchedule");
  const backFromAbout = $("backFromAbout");

  if (openSchedule) {
    openSchedule.addEventListener("click", () => {
      showOnly("scheduleSection");
    });
  }

  if (openAbout) {
    openAbout.addEventListener("click", () => {
      showOnly("aboutSection");
    });
  }

  if (backFromSchedule) {
    backFromSchedule.addEventListener("click", () => {
      showOnly("");
    });
  }

  if (backFromAbout) {
    backFromAbout.addEventListener("click", () => {
      showOnly("");
    });
  }

  renderClasses();

  // Корректно сообщаем MAX, если приложение открыто внутри MAX.
  try {
    if (window.WebApp && typeof window.WebApp.ready === "function") {
      window.WebApp.ready();
    }
    if (window.WebApp && typeof window.WebApp.expand === "function") {
      window.WebApp.expand();
    }
  } catch (error) {
    console.log("MAX WebApp API недоступен в обычном браузере.");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
