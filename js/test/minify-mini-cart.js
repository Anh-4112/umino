const cartIcon=document.querySelectorAll(".cart-icon"),
cartBlock=document.getElementById("cartBlock"),
closeCart=document.getElementById("closeCart"),
overlayCart=document.getElementById("overlayCart"),
listCartItem=document.getElementById("listCartItem"),
cartItemTemplate=document.getElementById("cartItem"),
addItem=document.querySelectorAll(".add-to-cart"),
cartTotal=document.getElementById("cartTotal"),
freeShip=120;
let cart=JSON.parse(localStorage.getItem("mini-cart"))||[];
cartIcon.forEach(t=>{
    t.addEventListener("click",()=>toggleCart(!0)),
    window.toggleCart=function(t){
        cartBlock.classList.toggle("open",t),
        overlayCart.classList.toggle("show",t)
    }
});
const closeCartWithAnimation=()=>toggleCart(!1);
function updateShippingProgress(t){
    let e=document.getElementById("progressFill"),
    r=document.getElementById("progressIcon"),
    a=document.getElementById("shippingMessage"),
    n=Math.min(t/120*100,100);e.style.width=`${n}%`,
    r.style.left=`${n}%`,
    a.innerHTML=t>=120?'<p class="fs-14 cl-green">Congratulations! You\'ve got free shipping!</p>':`Spend $${(120-t).toFixed(2)} more and get <span class="fs-14 fw-600 cl-orange-red">FREE SHIPPING!</span>`
}
function addToCart(t,e,r,a,n){
    let i=cart.find(e=>e.id===t);
    i?i.quantity+=1:cart.push({id:t,name:e,price:r,image:a,color:n,quantity:1}),
    saveCart(),
    renderCart(),
    toggleCart(!0)
}
function renderCart(){
    Array.from(listCartItem.children).forEach(t=>{"TEMPLATE"!==t.tagName&&listCartItem.removeChild(t)});
    let t=0;cart.forEach(e=>{
        t+=e.price*e.quantity;
        let r=cartItemTemplate.content.cloneNode(!0);
        r.querySelector(".cart-item-img").src=e.image,
        r.querySelector(".cart-item-name").textContent=e.name,
        r.querySelector(".cart-color").textContent=e.color,
        r.querySelector(".cart-item-price").textContent=`$${(e.price*e.quantity).toFixed(2)}`,
        r.querySelector(".cart-item-qty").textContent=e.quantity,
        r.querySelector(".cart-item-increase").addEventListener("click",()=>updateQuantity(e.id,1)),
        r.querySelector(".cart-item-decrease").addEventListener("click",()=>updateQuantity(e.id,-1)),
        r.querySelector(".btn-cart-item-remove").addEventListener("click",()=>removeFromCart(e.id)),
        listCartItem.appendChild(r)
    }),
    cartTotal&&(cartTotal.textContent="$"+t.toFixed(2)),
    updateCartCount(),
    updateShippingProgress(t)
}
function updateQuantity(t,e){
    let r=cart.find(e=>e.id===t);
    r&&(r.quantity+=e,
        r.quantity<=0?removeFromCart(t):(saveCart(),
    renderCart()))
}
function removeFromCart(t){
    cart=cart.filter(e=>e.id!==t),
    saveCart(),
    renderCart()
}
closeCart.addEventListener("click",closeCartWithAnimation),
overlayCart.addEventListener("click",closeCartWithAnimation),
addItem.forEach(t=>{
    t.addEventListener("click",()=>{
        let e=t.closest(".slide");if(!e)return;let r=e.querySelector(".img"),
        a=e.querySelector(".item-name"),
        n=e.querySelector(".btn-color.selected"),
        i=e.querySelector(".item-price");
        if(!r||!a||!n||!i)return;
        let c=r.src,o=c.split("/").slice(-2).join("-"),
        l=a.textContent.trim(),s=n?.textContent?.trim(),
        d=parseFloat(i.textContent.replace(/[^0-9.]/g,"")),
        m=t.dataset.id||`${l.replace(/\s+/g,"-").toLowerCase()}-${s}-${d}-${o}`;
        addToCart(m,l,d,c,s)
    })
});
let saveCartTimeout;
function saveCart(){
    clearTimeout(saveCartTimeout),
    saveCartTimeout=setTimeout(()=>{
        localStorage.setItem("mini-cart",JSON.stringify(cart)),
        updateCartCount()
    },300)
}
function updateCartCount(){
    let t=Array.isArray(cart)?cart.reduce((t,e)=>t+(e.quantity||0),0):0,
    e=document.querySelectorAll(".cart-count");
    e.forEach(e=>{
        e.innerText=t,e.style.visibility="visible"
    })
}
renderCart(),
updateCartCount();