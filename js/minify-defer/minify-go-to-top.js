const goTo=document.querySelector(".go-top");
function toggleGoTop(){
    window.scrollY>150?goTo.classList.add("show"):goTo.classList.remove("show")
}
toggleGoTop(),
window.addEventListener("scroll",toggleGoTop),
goTo.addEventListener("click",function(){
    window.scrollTo({top:0,behavior:"smooth"})
});