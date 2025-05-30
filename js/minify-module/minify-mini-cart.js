export function initMiniCart(){
    let e=document.querySelectorAll(".cart-icon"),
        t=document.getElementById("cartBlock"),
        r=document.getElementById("closeCart"),
        n=document.getElementById("overlayCart"),
        i=document.getElementById("listCartItem"),
        c=document.getElementById("cartItem"),
        l=document.querySelectorAll(".add-to-cart"),
        o=document.getElementById("cartTotal"),
        a=JSON.parse(localStorage.getItem("mini-cart"))||[];
    e.forEach(e=>{
        e.addEventListener("click",()=>toggleCart(!0)),
        window.toggleCart=function(e){
            t.classList.toggle("open",e),
            n.classList.toggle("show",e)
        }
    });
    let s=()=>toggleCart(!1);
    function d(){
        Array.from(i.children).forEach(e=>{"TEMPLATE"!==e.tagName&&i.removeChild(e)});
        let e=0;a.forEach(t=>{
            e+=t.price*t.quantity;
            let r=c.content.cloneNode(!0);
            r.querySelector(".cart-item-img").src=t.image,
            r.querySelector(".cart-item-name").textContent=t.name,
            r.querySelector(".cart-color").textContent=t.color,
            r.querySelector(".cart-item-price").textContent=`$${(t.price*t.quantity).toFixed(2)}`,
            r.querySelector(".cart-item-qty").textContent=t.quantity,
            r.querySelector(".cart-item-increase").addEventListener("click",()=>y(t.id,1)),
            r.querySelector(".cart-item-decrease").addEventListener("click",()=>y(t.id,-1)),
            r.querySelector(".btn-cart-item-remove").addEventListener("click",()=>u(t.id)),
            i.appendChild(r)
        }),
        o&&(o.textContent="$"+e.toFixed(2)),f(),
        function e(t){
            let r=document.getElementById("progressFill"),
            n=document.getElementById("progressIcon"),
            i=document.getElementById("shippingMessage"),
            c=Math.min(t/120*100,100);r.style.width=`${c}%`,
            n.style.left=`${c}%`,
            i.innerHTML=t>=120?'<p class="fs-14 cl-green">Congratulations! You\'ve got free shipping!</p>':`Spend $${(120-t).toFixed(2)} more and get <span class="fs-14 fw-600 cl-orange-red">FREE SHIPPING!</span>`
        }(e)
    }
    function y(e,t){
        let r=a.find(t=>t.id===e);
        r&&(r.quantity+=t,
            r.quantity<=0?u(e):(g(),
            d())
        )
    }
    function u(e){
        a=a.filter(t=>t.id!==e),
        g(),
        d()
    }
    r.addEventListener("click",s),
    n.addEventListener("click",s),
    l.forEach(e=>{
        e.addEventListener("click",()=>{
            let t=e.closest(".slide");
            if(!t)return;
            let r=t.querySelector(".img"),
            n=t.querySelector(".item-name"),
            i=t.querySelector(".btn-color.selected"),
            c=t.querySelector(".item-price");
            if(!r||!n||!i||!c)return;
            let l=r.src,
            o=l.split("/").slice(-2).join("-"),
            s=n.textContent.trim(),
            y=i?.textContent?.trim(),
            u=parseFloat(c.textContent.replace(/[^0-9.]/g,"")),
            m=e.dataset.id||`${s.replace(/\s+/g,"-").toLowerCase()}-${y}-${u}-${o}`;
            !function e(t,r,n,i,c){
                let l=a.find(e=>e.id===t);
                l?l.quantity+=1:a.push({id:t,name:r,price:n,image:i,color:c,quantity:1}),
                g(),
                d(),
                toggleCart(!0)
            }
            (m,s,u,l,y)
        })
    });
    let m;
    function g(){
        clearTimeout(m),
        m=setTimeout(()=>{
            localStorage.setItem("mini-cart",JSON.stringify(a)),
            f()
        },300)
    }
    function f(){
        let e=Array.isArray(a)?a.reduce((e,t)=>e+(t.quantity||0),0):0,
        t=document.querySelectorAll(".cart-count");
        t.forEach(t=>{t.innerText=e,t.style.visibility="visible"})
    }
    d(),f()
}