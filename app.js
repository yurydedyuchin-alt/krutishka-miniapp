const classes=["1","2","3","4","5","6","7","8","9","10","11"];
const days=[
  ["monday","Понедельник"],
  ["tuesday","Вторник"],
  ["wednesday","Среда"],
  ["thursday","Четверг"],
  ["friday","Пятница"],
  ["saturday","Суббота"]
];

// Реального утверждённого расписания пока нет.
const schedule={};

let selectedClass=null;
let selectedDay="monday";

const $=id=>document.getElementById(id);

function showSection(sectionId){
  $("homeSection").classList.add("hidden");
  $("scheduleSection").classList.add("hidden");
  $("aboutSection").classList.add("hidden");
  if(sectionId) $(sectionId).classList.remove("hidden");
  window.scrollTo(0,0);
}

function renderClasses(){
  const list=$("classList");
  list.innerHTML="";
  classes.forEach(number=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="class-button";
    button.textContent=number+" класс";
    button.addEventListener("click",()=>{
      selectedClass=number;
      document.querySelectorAll(".class-button").forEach(b=>b.classList.remove("selected"));
      button.classList.add("selected");
      $("scheduleDetails").classList.remove("hidden");
      $("selectedClassTitle").textContent="Расписание · "+number+" класс";
      renderDays();
      renderSchedule();
    });
    list.appendChild(button);
  });
}

function renderDays(){
  const list=$("dayList");
  list.innerHTML="";
  days.forEach(([key,label])=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="day-button"+(key===selectedDay?" selected":"");
    button.textContent=label;
    button.addEventListener("click",()=>{
      selectedDay=key;
      renderDays();
      renderSchedule();
    });
    list.appendChild(button);
  });
}

function renderSchedule(){
  const day=days.find(item=>item[0]===selectedDay);
  $("selectedDayTitle").textContent=(day?day[1]:"")+" · "+selectedClass+" класс";

  const items=schedule[selectedClass]?.[selectedDay];
  if(!items || items.length===0){
    $("lessons").innerHTML=
      '<div class="empty">Расписание на этот день пока не опубликовано.<br>После утверждения расписания школы данные появятся здесь.</div>';
    return;
  }

  $("lessons").innerHTML="";
  items.forEach((item,index)=>{
    const row=document.createElement("div");
    row.className="lesson";
    row.innerHTML='<div class="lesson-number">'+(index+1)+'</div><div><div class="lesson-name"></div><div class="lesson-time"></div></div>';
    row.querySelector(".lesson-name").textContent=item.subject;
    row.querySelector(".lesson-time").textContent=item.time||"";
    $("lessons").appendChild(row);
  });
}

function init(){
  $("openSchedule").addEventListener("click",()=>{
    showSection("scheduleSection");
  });

  $("openAbout").addEventListener("click",()=>{
    showSection("aboutSection");
  });

  $("backFromSchedule").addEventListener("click",()=>{
    showSection("homeSection");
  });

  $("backFromAbout").addEventListener("click",()=>{
    showSection("homeSection");
  });

  $("resetClass").addEventListener("click",()=>{
    selectedClass=null;
    $("scheduleDetails").classList.add("hidden");
    document.querySelectorAll(".class-button").forEach(b=>b.classList.remove("selected"));
    window.scrollTo(0,0);
  });

  renderClasses();

  try{
    if(window.WebApp?.ready) WebApp.ready();
    if(window.WebApp?.expand) WebApp.expand();
  }catch(e){}
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init);
}else{
  init();
}
