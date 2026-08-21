(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function accordionFix(){
    if(!document.getElementById('sortModalV164Ready')){setTimeout(accordionFix,80);return}
    if(document.getElementById('accordionFixV165Ready'))return;
    const ready=document.createElement('meta');ready.id='accordionFixV165Ready';document.head.appendChild(ready);

    const HOSTS=new Set(['uxPublicList','uxMidList','uxSmeList']);
    document.addEventListener('click',e=>{
      const summary=e.target.closest?.('.uxSummary');
      if(!summary)return;
      const item=summary.closest('.uxItem');
      const host=item?.parentElement;
      if(!item||!host||!HOSTS.has(host.id))return;

      // v1.6.4에서 전체 목록을 다시 렌더링하며 즉시 닫히던 충돌을 차단한다.
      // 해당 카드 DOM만 직접 열고 닫아 날짜정렬/페이징 상태에는 영향을 주지 않는다.
      e.preventDefault();
      e.stopImmediatePropagation();
      const opened=item.classList.toggle('open');
      summary.setAttribute('aria-expanded',opened?'true':'false');
    },true);
  }

  const inject=()=>{
    const d=frame.contentDocument;
    if(!d||!d.body||d.getElementById('accordionFixV165Script'))return;
    const s=d.createElement('script');s.id='accordionFixV165Script';s.textContent='('+accordionFix.toString()+')();';d.body.appendChild(s);
  };
  frame.addEventListener('load',()=>setTimeout(inject,260));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,260);
})();
