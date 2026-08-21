(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function inject(){
    const d=frame.contentDocument;
    if(!d||!d.body){setTimeout(inject,80);return}
    if(d.getElementById('v175BindingsScript'))return;
    const s=d.createElement('script');
    s.id='v175BindingsScript';
    s.textContent=`(()=>{
      if(document.getElementById('v175BindingsReady'))return;
      const m=document.createElement('meta');m.id='v175BindingsReady';document.head.appendChild(m);
      try{
        Object.defineProperty(window,'jobs',{configurable:true,enumerable:false,get(){return jobs},set(v){jobs=v}});
      }catch(e){ try{window.jobs=jobs}catch(_){} }
      try{
        Object.defineProperty(window,'corp',{configurable:true,enumerable:false,get(){return corp},set(v){corp=v}});
      }catch(e){ try{window.corp=corp}catch(_){} }
    })();`;
    d.body.appendChild(s);
  }
  frame.addEventListener('load',()=>setTimeout(inject,120));
  if(frame.contentDocument?.readyState==='complete'||frame.contentDocument?.readyState==='interactive')setTimeout(inject,120);
})();
