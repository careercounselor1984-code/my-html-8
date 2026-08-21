(()=>{
  const frame=document.getElementById('app');if(!frame)return;
  function inject(){
    const d=frame.contentDocument;if(!d||!d.body||d.getElementById('v168PreScript'))return;
    const s=d.createElement('script');s.id='v168PreScript';s.textContent=`(()=>{
      if(window.__v168NativeMO)return;
      const Native=window.MutationObserver;window.__v168NativeMO=Native;
      function Wrapped(cb){
        const mo=new Native(cb),orig=mo.observe.bind(mo);
        mo.observe=(target,opts)=>{if(target?.classList?.contains('v166List'))return;return orig(target,opts)};
        return mo;
      }
      Wrapped.prototype=Native.prototype;window.MutationObserver=Wrapped;
      setTimeout(()=>{if(window.MutationObserver===Wrapped)window.MutationObserver=Native},5000);
    })();`;d.body.appendChild(s);
  }
  frame.addEventListener('load',()=>setTimeout(inject,70));if(frame.contentDocument?.readyState==='complete')setTimeout(inject,70);
})();
