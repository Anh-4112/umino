export function initSliderScroll(){
    let e=document.querySelector(".slider-banner"),
    t=!1,
    n=0,
    r=0,
    s=!1;
    document.querySelectorAll(".slider-banner a").forEach(e=>{
        e.addEventListener("click",e=>{
            s&&e.preventDefault()
        }),
        e.addEventListener("dragstart",e=>e.preventDefault())
    });
    let d=e=>e.type.includes("touch")?e.touches[0].pageX:e.pageX,
    a=a=>{
        t=!0,
        s=!1,
        n=d(a),
        r=e.scrollLeft,
        e.classList.add("dragging")
    },
    i=a=>{
        if(!t)return;
        s=!0;
        let i=d(a);
        e.scrollLeft=r-(i-n)
    },
    l=()=>{
        t=!1,
        e.classList.remove("dragging")
    };
    e.addEventListener("mousedown",a),
    e.addEventListener("mousemove",i),
    document.addEventListener("mouseup",l),
    e.addEventListener("mouseleave",l),
    e.addEventListener("touchstart",a,{passive:!0}),
    e.addEventListener("touchmove",i,{passive:!0}),
    e.addEventListener("touchend",l)
}