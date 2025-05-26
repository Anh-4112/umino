document.querySelectorAll(".slider").forEach(e=>{
    let t=e.querySelector(".slide");
    if(!t)return;let r=t?t.offsetWidth:0,
    l=parseInt(getComputedStyle(e).gap)||10,
    s=!1,o,a,d=!1,
    n=()=>{
        r=t?t.offsetWidth:0,
        l=parseInt(getComputedStyle(e).gap)||0
    };
    window.addEventListener("resize",n),
    e.querySelectorAll("a").forEach(e=>{
        e.addEventListener("click",e=>{
            d&&e.preventDefault()
        }),
    e.addEventListener("dragstart",e=>e.preventDefault())
});
let i=t=>{
    s=!0,
    d=!1,
    o=t.pageX||t.touches[0].pageX,
    a=e.scrollLeft,
    e.classList.add("dragging")
},
c=t=>{
    if(!s)return;
    d=!0;
    let r=t.pageX||t.touches[0].pageX;e.scrollLeft=a-(r-o)
},
v=()=>{
    if(s&&(s=!1,e.classList.remove("dragging"),d)){
        let t=r+l,o=e.scrollLeft,n=o-a,i=Math.round(a/t);n>50?i+=1:n<-50&&(i-=1);
        let c=i*t;e.style.scrollBehavior="smooth",e.scrollTo({left:c}),setTimeout(()=>{
            e.style.scrollBehavior="auto"
        },400
    )}},
u=t=>{
    let s=r+l,
        o=e.scrollLeft,
        a=Math.round(o/s),
        d=Math.floor(e.scrollWidth/s)-1,
        n="prev"===t?Math.max(0,a-1):Math.min(d,a+1),
        i=n*s;e.style.scrollBehavior="smooth",
        e.scrollTo({left:i}),
        setTimeout(()=>{
            e.style.scrollBehavior="auto"
        },400)
    },
f=e.closest(".wrapper");
if(f){
    let L=f.querySelector(".slider-prev"),
        h=f.querySelector(".slider-next");
        L?.addEventListener("click",()=>u("prev")),
        h?.addEventListener("click",()=>u("next"))
    }
    e.addEventListener("mousedown",i),
    e.addEventListener("mousemove",c),
    document.addEventListener("mouseup",v),
    e.addEventListener("mouseleave",v),
    e.addEventListener("touchstart",i,{ passive: true }),
    e.addEventListener("touchmove",c,{ passive: true }),
    e.addEventListener("touchend",v)
});