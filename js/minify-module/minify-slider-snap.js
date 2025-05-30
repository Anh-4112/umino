export function initSliderSnap(){
    document.querySelectorAll(".slider").forEach(e=>{
        let t=e.querySelector(".slide");
        if(!t)return;
        let r=t?t.offsetWidth:0,
            l=parseInt(getComputedStyle(e).gap)||10,o=!1,s,a,d=!1,n=()=>{
                r=t?t.offsetWidth:0,
                l=parseInt(getComputedStyle(e).gap)||0
            };
        window.addEventListener("resize",n),e.querySelectorAll("a").forEach(e=>{
            e.addEventListener("click",e=>{
                d&&e.preventDefault()
            }),
            e.addEventListener("dragstart",e=>e.preventDefault())
        });
        let i=t=>{
            o=!0,
            d=!1,
            s=t.pageX||t.touches[0].pageX,
            a=e.scrollLeft,
            e.classList.add("dragging")
        },
        c=t=>{
            if(!o)return;
            d=!0;
            let r=t.pageX||t.touches[0].pageX;
            e.scrollLeft=a-(r-s)
        },
        v=()=>{
            if(o&&(o=!1,e.classList.remove("dragging"),d)){
                let t=r+l,
                s=e.scrollLeft,
                n=s-a,
                i=Math.round(a/t);
                n>50?i+=1:n<-50&&(i-=1);
                let c=i*t;
                e.style.scrollBehavior="smooth",
                e.scrollTo({left:c}),
                setTimeout(()=>{
                    e.style.scrollBehavior="auto"
                },400)
            }
        },
        u=t=>{
            let o=r+l,
            s=e.scrollLeft,
            a=Math.round(s/o),
            d=Math.floor(e.scrollWidth/o)-1;
            e.style.scrollBehavior="smooth",
            e.scrollTo({
                left:("prev"===t?Math.max(0,a-1):Math.min(d,a+1))*o
            }),
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
        e.addEventListener("touchstart",i),
        e.addEventListener("touchmove",c),
        e.addEventListener("touchend",v)
    })
}