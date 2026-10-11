

(function(){
  var root=document.documentElement;
  if(root.classList.contains('reduce')||typeof Lenis==='undefined')return;
  var lenis=new Lenis({lerp:0.1,smoothWheel:true,anchors:true});window.__lenis=lenis;
  requestAnimationFrame(function raf(t){lenis.raf(t);requestAnimationFrame(raf);});
})();

(function(){
  var root=document.documentElement,items=[].slice.call(document.querySelectorAll('.reveal'));
  function all(){items.forEach(function(el){el.classList.add('on');});}
  if(root.classList.contains('reduce')||!('IntersectionObserver' in window)){all();return;}
  var free=0;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting)return;io.unobserve(en.target);
      var now=performance.now(),at=Math.max(now,free);free=at+140;
      setTimeout(function(){en.target.classList.add('on');},at-now);
    });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  items.forEach(function(el){io.observe(el);});
})();

(function(){
  [].forEach.call(document.querySelectorAll('.n-pan'),function(p){
    var img=p.querySelector('img'),sec=p.closest('.n-feature'),start=0,moved=false;
    function centre(){var max=p.scrollWidth-p.clientWidth;if(!moved&&max>0){start=max/2;p.scrollLeft=start;}}
    centre();if(img&&!img.complete)img.addEventListener('load',centre);addEventListener('resize',centre);
    p.addEventListener('scroll',function(){if(!moved&&Math.abs(p.scrollLeft-start)>24){moved=true;sec.classList.add('panned');}},{passive:true});
  });
})();

(function(){
  var f=document.getElementById('quoteForm');if(!f||!window.fetch)return;
  var ok=document.getElementById('sent'),bad=document.getElementById('fail'),need=document.getElementById('need'),btn=f.querySelector('button[type=submit]'),url=f.getAttribute('data-ajax'),busy=false;
  if(!url)return;
  f.setAttribute('novalidate','');
  function show(el){[ok,bad,need].forEach(function(e){if(e)e.classList.toggle('show',e===el);});}
  function valid(){
    var n=f.elements.name,e=f.elements.email,good=true;
    [[n,n.value.trim().length>0],[e,/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim())]].forEach(function(p){
      p[0].setAttribute('aria-invalid',String(!p[1]));if(!p[1]&&good){good=false;p[0].focus();}
    });
    return good;
  }
  f.addEventListener('submit',function(ev){
    ev.preventDefault();if(busy)return;
    if(f.elements._honey&&f.elements._honey.value)return;
    if(!valid()){show(need);return;}
    var data={};[].forEach.call(f.elements,function(el){if(el.name&&el.name!=='_honey')data[el.name]=el.value;});
    busy=true;btn.disabled=true;btn.textContent='Sending';show(null);
    fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().then(function(j){return r.ok&&(j.success===true||j.success==='true');});})
      .then(function(sent){if(sent){f.reset();show(ok);}else show(bad);})
      .catch(function(){show(bad);})
      .then(function(){busy=false;btn.disabled=false;btn.textContent='Send';});
  });
})();

(function(){
  var bar=document.getElementById('bar'),btn=document.getElementById('menuBtn'),list=document.getElementById('navLinks');
  function stuck(){bar.classList.toggle('stuck',(window.scrollY||0)>24);}
  addEventListener('scroll',stuck,{passive:true});stuck();
  function compact(){return getComputedStyle(btn).display!=='none';}
  function setMenu(open,moveFocus){
    bar.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'Close menu':'Menu');
    if(moveFocus!==false){if(open){var first=list.querySelector('a');if(first)requestAnimationFrame(function(){first.focus({preventScroll:true});});}else btn.focus();}
  }
  btn.addEventListener('click',function(){setMenu(!bar.classList.contains('open'));});
  list.addEventListener('click',function(e){if(e.target.closest('a')&&compact())setMenu(false,false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&bar.classList.contains('open'))setMenu(false);});
  document.addEventListener('pointerdown',function(e){if(bar.classList.contains('open')&&!bar.contains(e.target))setMenu(false,false);});
  addEventListener('resize',function(){if(!compact()&&bar.classList.contains('open'))setMenu(false,false);});

  var links=[].slice.call(list.querySelectorAll('li:not(.only-compact) a')),cur=list.querySelector('[aria-current]')||links[0],at=cur;
  function put(a){at=a;list.style.setProperty('--mx',a.offsetLeft+'px');list.style.setProperty('--mw',Math.max(0,a.offsetWidth-2));}
  links.forEach(function(a){a.addEventListener('pointerenter',function(){put(a);});a.addEventListener('focus',function(){put(a);});});
  list.addEventListener('pointerleave',function(){put(cur);});
  list.addEventListener('focusout',function(e){if(!list.contains(e.relatedTarget))put(cur);});
  addEventListener('resize',function(){put(at);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){put(at);});
  put(cur);requestAnimationFrame(function(){requestAnimationFrame(function(){list.classList.add('mk-on');});});
})();
