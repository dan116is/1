(() => {
  const canvas = document.querySelector('#world');
  const ctx = canvas.getContext('2d', { alpha: false });
  const scenes = [...document.querySelectorAll('.scene')];
  const cursor = document.querySelector('.cursor');
  let W, H, dpr, scrollY = 0, targetScroll = 0, mouseX = 0, mouseY = 0, smoothX = 0, smoothY = 0, frame = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){ dpr=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight; canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0) }
  addEventListener('resize',resize);resize();
  addEventListener('scroll',()=>targetScroll=scrollY=window.scrollY,{passive:true});
  addEventListener('pointermove',e=>{mouseX=(e.clientX/W-.5);mouseY=(e.clientY/H-.5);cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
  document.querySelectorAll('a,button,textarea').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'))});

  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const ease=t=>1-Math.pow(1-clamp(t),3);
  function globalProgress(){ return scrollY/(document.documentElement.scrollHeight-H) }
  function sceneState(){let active=0,local=0;scenes.forEach((s,i)=>{const r=s.getBoundingClientRect();if(r.top<=H*.5&&r.bottom>=H*.5){active=i;local=clamp((-r.top)/(r.height-H))}});return {active,local}}
  function line(x1,y1,x2,y2,a=.3,w=1){ctx.strokeStyle=`rgba(225,229,230,${a})`;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
  function polygon(cx,cy,r,n,rot,a=.4){ctx.strokeStyle=`rgba(235,237,235,${a})`;ctx.beginPath();for(let i=0;i<=n;i++){const q=rot+i*Math.PI*2/n;const x=cx+Math.cos(q)*r,y=cy+Math.sin(q)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
  function core(cx,cy,r,p,t){
    ctx.save();ctx.translate(cx+smoothX*18,cy+smoothY*12);ctx.rotate(t*.04+p*.8);
    for(let i=0;i<10;i++){const rr=r*(.25+i*.095)*(1+Math.sin(t*.4+i)*.015);ctx.lineWidth=i%3===0?1.4:.6;ctx.strokeStyle=`rgba(215,220,220,${.12+i*.035})`;ctx.beginPath();ctx.ellipse(0,0,rr,rr*(.5+p*.24),i*.23+p,0,Math.PI*2);ctx.stroke()}
    polygon(0,0,r*.5,6,t*.06,.6);polygon(0,0,r*.72,12,-t*.03,.22);
    ctx.shadowBlur=24;ctx.shadowColor='rgba(220,235,238,.6)';ctx.fillStyle='rgba(235,239,238,.75)';ctx.beginPath();ctx.arc(0,0,2.4,0,7);ctx.fill();ctx.restore()
  }
  function tunnel(p,t){const cx=W/2+smoothX*25,cy=H/2+smoothY*18;for(let i=18;i>0;i--){let z=(i/18+p*.95)%1,r=(1-z)*Math.max(W,H)*.78+24;ctx.strokeStyle=`rgba(225,229,228,${.05+(1-z)*.18})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,.45,Math.PI*1.86);ctx.stroke();for(let k=0;k<5;k++){let a=.45+k*(Math.PI*1.41/4);line(cx+Math.cos(a)*r,cy+Math.sin(a)*r,cx+Math.cos(a)*(r+110),cy+Math.sin(a)*(r+110),.08)}}}
  function blueprint(p,t){ctx.save();ctx.translate(smoothX*12,smoothY*8);const gap=52,shift=(p*gap*8)%gap;for(let x=-gap+shift;x<W+gap;x+=gap)line(x,0,x,H,.07);for(let y=-gap+shift;y<H+gap;y+=gap)line(0,y,W,y,.07);for(let i=0;i<16;i++){const phase=clamp(p*1.5-i/24);let x=W*.18+(i%4)*W*.18,y=H*.2+Math.floor(i/4)*H*.17,s=18+phase*45;ctx.strokeStyle=`rgba(225,230,230,${phase*.45})`;ctx.strokeRect(x-s/2,y-s/2,s,s*.62);if(i%3===0)line(x+s/2,y,x+W*.12,y,(phase*.35))}ctx.restore()}
  function ecosystem(p,t){const cx=W/2,cy=H/2,r=Math.min(W,H)*(.18+p*.12);for(let i=0;i<12;i++){let a=i/12*Math.PI*2+t*.05;let x=cx+Math.cos(a)*r*(1.2+i%3*.2),y=cy+Math.sin(a)*r*.65;line(cx,cy,x,y,.12);polygon(x,y,8+(i%4)*4,4,a,.35)}core(cx,cy,Math.min(W,H)*.12,p,t)}
  function numeral(t){ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`200 ${Math.min(W*.45,H*.72)}px Manrope`;ctx.strokeStyle='rgba(235,237,234,.17)';ctx.lineWidth=1;ctx.strokeText('12',W/2+smoothX*12,H/2);ctx.restore();core(W/2,H/2,Math.min(W,H)*.34,.6,t)}
  function horizon(p){let y=H*(.58-p*.08);const g=ctx.createLinearGradient(0,y-80,0,y+80);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(220,230,230,.25)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,y-80,W,160);line(0,y,W,y,.5);for(let i=0;i<12;i++){let x=W/2+(i-6)*W*.13*(1-p*.5);line(W/2,y,x,H,.07)}}
  function render(){frame++;smoothX+=(mouseX-smoothX)*.05;smoothY+=(mouseY-smoothY)*.05;const {active,local}=sceneState(),t=frame/60;ctx.fillStyle=active===0?`rgb(${Math.round(229*(1-local))},${Math.round(230*(1-local))},${Math.round(226*(1-local))})`:'#080a0c';ctx.fillRect(0,0,W,H);
    if(active===0){if(local<.55){ctx.strokeStyle=`rgba(${local<.3?'10,12,13':'230,232,230'},.7)`;ctx.lineWidth=clamp(W/600,1,2);ctx.beginPath();ctx.arc(W/2,H/2,Math.min(W,H)*(.36-local*.24),.45,Math.PI*1.86);ctx.stroke();polygon(W/2,H/2,Math.min(W,H)*(.08+local*.15),12,t*.01,.2)}else tunnel((local-.55)/.45,t)}
    else if(active===1){tunnel(local*.25,t);core(W/2,H/2,Math.min(W,H)*(.22+local*.12),local,t)}
    else if(active===2)blueprint(local,t);
    else if(active===3)ecosystem(local,t);
    else if(active===4)numeral(t+local*3);
    else if(active===5){blueprint(.5+local*.5,t);line(W*.1,H*.75,W*.9,H*.25,.35,2);core(W*.78,H*.32,80,local,t)}
    else if(active===6)horizon(local);
    else {core(W/2,H*.48,Math.min(W,H)*(.18-local*.08),1-local,t);horizon(.2)}
    updateUI(active,local);requestAnimationFrame(render)}
  function updateUI(active,local){document.documentElement.style.setProperty('--progress',globalProgress()*100+'%');document.querySelector('.progress span').textContent=String(active+1).padStart(2,'0');
    document.querySelectorAll('.case').forEach((c,i)=>c.classList.toggle('active',active===4&&i===Math.min(2,Math.floor(local*3))));
    if(active===5){document.querySelector('.timeline-line').style.setProperty('--fill',local*100+'%');document.querySelectorAll('.timeline li').forEach((l,i)=>l.classList.toggle('active',local>i/6-.05&&local<(i+1)/6+.08))}
    const rep=document.querySelector('.replacement'),future=document.querySelector('.future h2');if(active===6){let q=ease((local-.35)/.4);rep.style.opacity=q;rep.style.transform=`scale(${.35+q*.65})`;future.style.transform=`scale(${1+q*2})`;future.style.opacity=1-q}}
  document.querySelector('.menu').addEventListener('click',()=>{const open=document.querySelector('.menu').classList.toggle('open');document.querySelector('.nav-world').classList.toggle('open',open);document.querySelector('.nav-world').setAttribute('aria-hidden',!open)});
  document.querySelectorAll('.nav-world a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.menu').classList.remove('open');document.querySelector('.nav-world').classList.remove('open')}));
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:reduced?'auto':'smooth'})}));
  document.querySelector('.loop').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();if(document.querySelector('textarea').value.trim())document.querySelector('.contact-wrap').classList.add('submitted')});
  const textarea=document.querySelector('textarea');textarea.addEventListener('input',()=>{textarea.style.height='auto';textarea.style.height=Math.min(180,textarea.scrollHeight)+'px'});
  let audio;document.querySelector('.sound').addEventListener('click',function(){if(!audio){audio=new AudioContext();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=48;g.gain.value=.018;o.connect(g).connect(audio.destination);o.start()}else audio.state==='running'?audio.suspend():audio.resume();this.classList.toggle('on');this.querySelector('span').textContent=this.classList.contains('on')?'SOUND ON':'SOUND OFF'});
  requestAnimationFrame(render);
})();
