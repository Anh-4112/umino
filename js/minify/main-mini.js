// =============== TAB TOGGLE ===============
const tabToggle=document.querySelectorAll(".btn-txt-trending");
if(tabToggle.length>0){let e=async()=>{let t=await import("./tabs-toggle-mini.js");
    t.initTabToggle(),tabToggle.forEach(t=>{t.removeEventListener("click",e),
    t.removeEventListener("mouseenter",e)})};
    tabToggle.forEach(t=>{t.addEventListener("click",e,{once:!0}),
    t.addEventListener("mouseenter",e,{once:!0})
})}

// =============== HOVER TOOLTIP ===============
const hoverTooltip=document.querySelectorAll(".slide .tooltip-bot");
if(hoverTooltip.length>0){let e=async t=>{let o=await import("./hover-tooltip-mini.js");
if(o.initHoverTooltip(),hoverTooltip.forEach(t=>{t.removeEventListener("mouseenter",e)}),
    t&&t.target){let r=new Event("mouseenter");t.target.dispatchEvent(r)}};
    hoverTooltip.forEach(t=>{t.addEventListener("mouseenter",e,{once:!0})
})}