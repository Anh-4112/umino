export function initHoverTooltip(){
    let t=document.getElementById("tooltiptext-color");
    document.querySelectorAll(".slide .tooltip-bot").forEach(e=>{
        e.addEventListener("mouseenter",
            function(e){
                let i=e.target.getBoundingClientRect();
                t.textContent=e.target.innerText,t.style.visibility="hidden",
                t.style.display="block",requestAnimationFrame(()=>{
                    let e=t.getBoundingClientRect(),
                    l=(i.bottom+10)/10,n=(i.left+i.width/2-e.width/2)/10;t.style.transition="none",
                    t.style.top=`${l}rem`,t.style.left=`${n}rem`,t.style.visibility="visible",t.style.opacity="1"
                }
            )}
        ),
        e.addEventListener("mouseleave",
            function(){
                t.style.visibility="hidden",
                t.style.opacity="0",
                t.style.display="none"
            }  
        )
    })
}