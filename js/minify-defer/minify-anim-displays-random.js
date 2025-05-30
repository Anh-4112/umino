const txts=document.querySelectorAll(".anim-txt-sshow"),
directions=["from-top","from-right","from-left"];
txts.forEach(t=>{
    let s=directions[Math.floor(Math.random()*directions.length)];
    t.classList.add(s)
});
const observer=new IntersectionObserver(t=>{
    t.forEach((t,s)=>{
        t.isIntersecting?setTimeout(()=>{
            t.target.classList.add("show")
        },200*s):t.target.classList.remove("show")
    })
},
{threshold:.1});
txts.forEach(t=>{observer.observe(t)});