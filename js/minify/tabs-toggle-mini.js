export function initTabToggle(){let t=document.querySelectorAll(".btn-txt-trending");
0!==t.length&&t.forEach(e=>{e.addEventListener("click",function(e){e.preventDefault(),
    t.forEach(t=>t.classList.remove("active")),
    this.classList.add("active")
})})}