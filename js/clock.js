window.onload = getTime;

function getTime() {
   var date = new Date();
   var time = date.toLocaleTimeString();
   var clockElement = document.getElementById("clock");
   
   clockElement.innerHTML = time;
   setTimeout(getTime, 1000);
}