(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function inject(){
    const d=frame.contentDocument;
    if(!d||!d.body||d.getElementById('dateParseV167Script'))return;
    const s=d.createElement('script');
    s.id='dateParseV167Script';
    s.textContent=`(()=>{
      if(window.__jobfitDateParseV167)return;
      window.__jobfitDateParseV167=true;
      const nativeParse=Date.parse.bind(Date);
      Date.parse=function(value){
        const text=String(value??'').trim();
        const native=nativeParse(text);
        if(Number.isFinite(native))return native;
        const m=text.match(/(?:^|\\D)(\\d{2})[.\\/-](\\d{1,2})[.\\/-](\\d{1,2})(?=\\D|$)/);
        if(m){
          const y=2000+Number(m[1]),mo=Number(m[2]),day=Number(m[3]);
          const t=new Date(y,mo-1,day).getTime();
          if(Number.isFinite(t))return t;
        }
        return NaN;
      };
    })();`;
    d.body.appendChild(s);
  }

  frame.addEventListener('load',()=>setTimeout(inject,180));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,180);
})();
