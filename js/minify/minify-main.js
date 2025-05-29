// =============== SLIDER SCROLL ===============
const sliderScroll=document.querySelectorAll(".slider-banner");
if(sliderScroll.length>0){
    let e=async()=>{
        let r=await import("./minify-slider-scroll.js");
        r.initSliderScroll(),
        sliderScroll.forEach(r=>{
            r.removeEventListener("mouseenter",e),
            r.removeEventListener("click",e)
        })
    };
    sliderScroll.forEach(r=>{
        r.addEventListener("mouseenter",e,{once:!0}),
        r.addEventListener("click",e,{once:!0})
    })
}

// =============== SLIDER SNAP ===============
const sliders=document.querySelectorAll(".slider");
if(sliders.length>0){
    let e=async()=>{
        let r=await import("./minify-slider-snap.js");
        r.initSliderSnap(),
        sliders.forEach(r=>{
            r.removeEventListener("mouseenter",e),
            r.removeEventListener("click",e)
        })
    };
    sliders.forEach(r=>{
        r.addEventListener("mouseenter",e,{once:!0}),
        r.addEventListener("click",e,{once:!0})
    })
}

// =============== TAB TOGGLE ===============
const tabToggle=document.querySelectorAll(".btn-txt-trending");
if(tabToggle.length>0){
    let e=async()=>{
        let t=await import("./minify-tabs-toggle.js");
        t.initTabToggle(),tabToggle.forEach(t=>{
            t.removeEventListener("click",e),
            t.removeEventListener("mouseenter",e)
        })
    };
    tabToggle.forEach(t=>{
        t.addEventListener("click",e,{once:!0}),
        t.addEventListener("mouseenter",e,{once:!0})
    })
}

// =============== HOVER TOOLTIP ===============
const hoverTooltip=document.querySelectorAll(".slide .tooltip-bot");
if(hoverTooltip.length>0){
    let e=async t=>{
        let o=await import("./minify-hover-tooltip.js");
        if(o.initHoverTooltip(),
        hoverTooltip.forEach(t=>{
            t.removeEventListener("mouseenter",e)
        }),
        t&&t.target){
            let r=new Event("mouseenter");
            t.target.dispatchEvent(r)
        }
    };
    hoverTooltip.forEach(t=>{
        t.addEventListener("mouseenter",e,{once:!0})
    })
}

// =============== ACCORDION MENU ===============
const accordionMenu=document.querySelectorAll(".footer-title");
if(accordionMenu.length>0){
    let e=async()=>{
        accordionMenu.forEach(n=>{
            n.removeEventListener("mouseenter",e),
            n.removeEventListener("click",e)
        });
        let n=await import("./minify-accordion-menu.js");
        n.initAccordionMenu()
    };
    accordionMenu.forEach(n=>{
        n.addEventListener("mouseenter",e,{once:!0}),
        n.addEventListener("click",e,{once:!0})
    })
}