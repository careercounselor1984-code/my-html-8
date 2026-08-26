(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    if(document.getElementById('v191StrongStarReady'))return;
    const mark=document.createElement('meta');mark.id='v191StrongStarReady';document.head.appendChild(mark);
    const style=document.createElement('style');
    style.textContent=`.v179StrongBadge{margin-left:5px!important;padding:0!important;border-radius:0!important;background:transparent!important;color:inherit!important;font-size:14px!important;font-weight:400!important;vertical-align:middle!important}`;
    document.head.appendChild(style);
    function clean(){
      document.querySelectorAll('.v179StrongBadge').forEach(b=>{
        if((b.textContent||'').trim()!=='⭐') b.textContent='⭐';
        b.setAttribute('aria-label','고용24 강소기업');
        if(!b.title) b.title='고용24 강소기업';
      });
    }
    const root=document.getElementById('smeList');
    if(root){
      const mo=new MutationObserver(()=>clean());
      mo.observe(root,{childList:true,subtree:true});
    }
    const rerun=()=>[150,500,1000,1800,2800].forEach(ms=>setTimeout(clean,ms));
    document.addEventListener('click',e=>{if(e.target?.closest?.('#smeSearchBtn'))rerun()},true);
    document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target?.id==='smeQ')rerun()},true);
    clean();
  }
  function inject(){
    const d=frame.contentDocument;
    if(!d||!d.body){setTimeout(inject,150);return}
    if(d.getElementById('v191StrongStarScript'))return;
    const s=d.createElement('script');s.id='v191StrongStarScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s);
  }
  frame.addEventListener('load',()=>setTimeout(inject,1800));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1800);
})();
