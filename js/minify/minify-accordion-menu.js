export function initAccordionMenu(){
    document.querySelectorAll(".footer-title").forEach(e=>{
        e.addEventListener("click",()=>{
            let t=e.nextElementSibling;
            (function e(t,o){
                let r=o.querySelector(".footer-icon"),
                l="true"===t.dataset.open;
                t.style.maxHeight=l?"0rem":t.scrollHeight/10+"rem",
                r.textContent=l?"+":"−",
                t.dataset.open=!l
            })(t,e)
        })
    }),
    window.addEventListener("resize",()=>{
        document.querySelectorAll(".footer-list").forEach(e=>{
            let t=e.previousElementSibling.querySelector(".footer-icon"),
            o="−"===t.textContent.trim();
            window.innerWidth<768?o?requestAnimationFrame(()=>{
                e.style.maxHeight=e.scrollHeight/10+"rem"
            }):e.style.maxHeight="0rem":e.style.maxHeight=null,e.dataset.open=o
        })
    })
}