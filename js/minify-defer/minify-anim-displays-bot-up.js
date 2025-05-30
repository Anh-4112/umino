document.body.classList.replace("no-js","have-js");
const animObserver=document.querySelectorAll(".anim-observer"),
animObserverShow=new IntersectionObserver(e=>{
    e.forEach((e,r)=>{
        e.isIntersecting&&setTimeout(()=>{
            e.target.classList.add("show")
        },150*r)
    })
},
{threshold:.1});
animObserver.forEach(e=>{animObserverShow.observe(e)});