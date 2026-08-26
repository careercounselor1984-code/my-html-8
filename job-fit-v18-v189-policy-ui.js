(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    const REGIONS=['전체','서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
    function toSelect(id,selected){
      const old=document.getElementById(id);if(!old||old.tagName==='SELECT')return;
      const s=document.createElement('select');s.id=id;s.className=old.className||'';
      s.innerHTML=REGIONS.map(r=>`<option value="${r}"${r===selected?' selected':''}>${r}</option>`).join('');
      old.replaceWith(s);
    }
    function apply(){
      const tabs=document.querySelector('.tabs'),gov=document.getElementById('v188GovTab'),biz=document.getElementById('v188BizTab');
      if(!tabs||!gov||!biz)return false;
      // 두 신규 탭은 항상 맨 끝에 배치
      tabs.appendChild(gov);tabs.appendChild(biz);
      toSelect('v188GovRegion','울산');
      toSelect('v188BizRegion','울산');
      return true;
    }
    let tries=0;const timer=setInterval(()=>{tries++;if(apply()||tries>40)clearInterval(timer)},150);
    const mo=new MutationObserver(()=>apply());mo.observe(document.body,{childList:true,subtree:true});
  }
  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,150);return}if(d.getElementById('v189PolicyUiScript'))return;const s=d.createElement('script');s.id='v189PolicyUiScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,1900));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1900);
})();