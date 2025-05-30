export function initMenuMobile(){
    let e=document.getElementById("iconMenuMobile"),
        t=document.getElementById("wrapperMenuMobile"),
        l=document.getElementById("closeMenuMobile"),
        n=document.getElementById("overlayMobile"),
        c=document.querySelectorAll(".btn-lang-mobile"),
        i=document.querySelectorAll(".btn-curr-mobile");
    e.addEventListener("click",()=>toggleMobile(!0)),
    window.toggleMobile=function(e){
        t.classList.toggle("open",e),
        n.classList.toggle("show",e),
        e||document.querySelectorAll(".sub-nav-mobile.open").forEach(e=>{
            e.classList.remove("open")
        })
    };
    let s=()=>toggleMobile(!1);
        l?.addEventListener("click",s),
        n?.addEventListener("click",s),
    document.querySelectorAll(".btn-sub-nav").forEach(e=>{
        e.addEventListener("click",function(){
            let e=this.nextElementSibling;
            e&&e.classList.contains("sub-nav-mobile")&&e.classList.add("open")
        })
    }),
    document.querySelectorAll(".back-sub-nav").forEach(e=>{
        e.addEventListener("click",function(){
            let e=this.closest(".sub-nav-mobile");
            e?.classList.remove("open")
        })
    }),
    document.querySelectorAll(".close-sub-nav").forEach(e=>{
        e.addEventListener("click",s)
    }),
    c.forEach(e=>{
        e.addEventListener("click",function(t){
            t.preventDefault(),
            c.forEach(e=>e.classList.remove("active")),
            e.classList.add("active")
        })
    }),
    i.forEach(e=>{
        e.addEventListener("click",function(t){
            t.preventDefault(),
            i.forEach(e=>e.classList.remove("active")),
            e.classList.add("active")
        })
    })
}