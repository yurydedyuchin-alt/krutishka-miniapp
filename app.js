// Данные расписания.
// Пока расписания в школе нет, здесь оставляем пусто.
// Когда расписание будет утверждено, меняем только этот блок.

const classes = ["1","2","3","4","5","6","7","8","9","10","11"];

const days = [
  {key:"monday",label:"Понедельник"},
  {key:"tuesday",label:"Вторник"},
  {key:"wednesday",label:"Среда"},
  {key:"thursday",label:"Четверг"},
  {key:"friday",label:"Пятница"},
  {key:"saturday",label:"Суббота"}
];

const schedule = {
  // Пример:
  // "5": {
  //   monday: [
  //     {subject:"Русский язык",time:"08:30–09:15"},
  //     {subject:"Математика",time:"09:25–10:10"}
  //   ]
  // }
};

const classList=document.getElementById("classList");
const scheduleSection=document.getElementById("scheduleSection");
const selectedClassTitle=document.getElementById("selectedClassTitle");
const dayList=document.getElementById("dayList");
const selectedDayTitle=document.getElementById("selectedDayTitle");
const lessons=document.getElementById("lessons");
const resetButton=document.getElementById("resetButton");

let selectedClass=null;
let selectedDay="monday";

function setupMax(){
  if(!window.WebApp)return;
  try{
    if(typeof window.WebApp.ready==="function")window.WebApp.ready();
    if(typeof window.WebApp.expand==="function")window.WebApp.expand();
  }catch(e){console.log("MAX Bridge недоступен в обычном браузере",e);}
}

function renderClasses(){
  classList.innerHTML="";
  classes.forEach(className=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="class-button";
    button.textContent=`${className} класс`;
    button.addEventListener("click",()=>{
      selectedClass=className;
      document.querySelectorAll(".class-button").forEach(x=>x.classList.remove("selected"));
      button.classList.add("selected");
      scheduleSection.classList.remove("hidden");
      selectedClassTitle.textContent=`${className} класс — расписание`;
      renderDays();
      renderSchedule();
      scheduleSection.scrollIntoView({behavior:"smooth",block:"start"});
    });
    classList.appendChild(button);
  });
}

function renderDays(){
  dayList.innerHTML="";
  days.forEach(day=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="day-button";
    button.textContent=day.label;
    if(day.key===selectedDay)button.classList.add("selected");
    button.addEventListener("click",()=>{
      selectedDay=day.key;
      document.querySelectorAll(".day-button").forEach(x=>x.classList.remove("selected"));
      button.classList.add("selected");
      renderSchedule();
    });
    dayList.appendChild(button);
  });
}

function renderSchedule(){
  const day=days.find(x=>x.key===selectedDay);
  selectedDayTitle.textContent=`${day.label} · ${selectedClass} класс`;
  lessons.innerHTML="";
  const classSchedule=schedule[selectedClass];
  const daySchedule=classSchedule?classSchedule[selectedDay]:null;

  if(!daySchedule||daySchedule.length===0){
    lessons.innerHTML='<div class="empty">Расписание пока не заполнено.<br>После утверждения расписания школы данные появятся здесь.</div>';
    return;
  }

  daySchedule.forEach((lesson,index)=>{
    const row=document.createElement("div");
    row.className="lesson";
    row.innerHTML=`<div class="lesson-number">${index+1}</div>
      <div><div class="lesson-name">${escapeHtml(lesson.subject)}</div>
      <div class="lesson-time">${escapeHtml(lesson.time||"")}</div></div>`;
    lessons.appendChild(row);
  });
}

function escapeHtml(value){
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

resetButton.addEventListener("click",()=>{
  selectedClass=null;
  scheduleSection.classList.add("hidden");
  document.querySelectorAll(".class-button").forEach(x=>x.classList.remove("selected"));
  window.scrollTo({top:0,behavior:"smooth"});
});

setupMax();
renderClasses();
