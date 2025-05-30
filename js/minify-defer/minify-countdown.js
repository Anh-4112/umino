document.querySelectorAll(".countdown").forEach(t=>{
    let $=t.querySelector(".countdown-day"),
        e=t.querySelector(".countdown-hour"),
        o=t.querySelector(".countdown-mins"),
        n=t.querySelector(".countdown-secs"),
        r=parseInt($.textContent,10),
        l=parseInt(e.textContent,10),
        c=parseInt(o.textContent,10),
        u=parseInt(n.textContent,10),
        x=864e5*r+36e5*l+6e4*c+1e3*u,
        C=Date.now()+x,d=()=>{
    let t=Date.now(),
        r=C-t;if(r<=0){
            clearInterval(a),
            $.textContent="0",
            e.textContent="00",
            o.textContent="00",
            n.textContent="00";
            return
        }
    let l=Math.floor(r/864e5),
        c=Math.floor(r%864e5/36e5),
        u=Math.floor(r%36e5/6e4),
        x=Math.floor(r%6e4/1e3);
        $.textContent=l,
        e.textContent=String(c).padStart(2,"0"),
        o.textContent=String(u).padStart(2,"0"),
        n.textContent=String(x).padStart(2,"0")
    };
    d();
    let a=setInterval(d,1e3)
});