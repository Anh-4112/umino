document.querySelectorAll(".slide").forEach(e=>{
    let t=e.querySelectorAll(".btn-color");
    t.forEach(c=>{
        c.addEventListener("click",function(){
            let c=this.dataset.imgChange,
                l=this.dataset.imgHover,
                r=this.dataset.price,
                s=e.querySelector(".img-change");
                s&&(s.src=c);
            let i=e.querySelector(".img-hover");
                i&&(i.src=l);
            let a=e.querySelector(".item-price");
                a&&(a.textContent=r),
                t.forEach(e=>e.classList.remove("selected")),
                this.classList.add("selected")
            })
        }),
    t.length>0&&t[0].click()
});