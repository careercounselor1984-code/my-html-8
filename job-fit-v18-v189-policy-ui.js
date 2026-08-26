(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    if(document.getElementById('v189PolicyUiReady'))return;
    const mark=document.createElement('meta');mark.id='v189PolicyUiReady';document.head.appendChild(mark);
    const REGIONS=['전체','서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
    function toSelect(id,fallback){
      const old=document.getElementById(id);if(!old)return false;
      if(old.tagName==='SELECT')return true;
      const current=String(old.value||fallback||'울산').trim();
      const s=document.createElement('select');s.id=id;s.className=old.className||'';
      s.innerHTML=REGIONS.map(r=>`<option value="${r}"${r===current?' selected':''}>${r}</option>`).join('');
      old.replaceWith(s);
      return true;
    }
    function applyOnce(){
      const tabs=document.querySelector('.tabs'),gov=document.getElementById('v188GovTab'),biz=document.getElementById('v188BizTab');
      if(!tabs||!gov||!biz)return false;
      // 이미 맨 끝이면 DOM을 다시 건드리지 않는다. 반복 appendChild는 MutationObserver 루프를 만들 수 있다.
      const children=[...tabs.children];
      if(children[children.length-2]!==gov||children[children.length-1]!==biz){
        tabs.appendChild(gov);tabs.appendChild(biz);
      }
      toSelect('v188GovRegion','울산');
      toSelect('v188BizRegion','울산');
      return true;
    }
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(applyOnce()||tries>=40)clearInterval(timer);
    },150);
  }
  function inject(){
    const d=frame.contentDocument;
    if(!d||!d.body){setTimeout(inject,150);return}
    if(d.getElementById('v189PolicyUiScript'))return;
    const s=d.createElement('script');s.id='v189PolicyUiScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)
  }
  frame.addEventListener('load',()=>setTimeout(inject,1900));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1900);
})();