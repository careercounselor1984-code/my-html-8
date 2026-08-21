(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    if(document.getElementById('v177MidCopyReady'))return;
    const m=document.createElement('meta');m.id='v177MidCopyReady';document.head.appendChild(m);
    const API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-open-recruit';
    const CACHE_PREFIX='jobfit_w24open_detail_v177_';
    const CACHE_MS=6*60*60*1000;
    const pending=new Map();
    const plain=v=>String(v??'').replace(/&#xd;/gi,'\n').replace(/<[^>]+>/g,' ').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
    const short=(v,n=220)=>{const s=plain(v).replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-3)+'...':s};
    const cleanEdu=v=>{const s=plain(v);return /^(학력무관|관계없음|무관)$/i.test(s)?'무관':(s||'확인 필요')};
    const cleanCareer=v=>{const s=plain(v);return /^(경력무관|관계없음|무관)$/i.test(s)?'무관':(s||'확인 필요')};
    const cleanRegion=v=>plain(v).replace(/울산광역시/g,'울산').replace(/서울특별시/g,'서울').replace(/부산광역시/g,'부산').replace(/대구광역시/g,'대구').replace(/인천광역시/g,'인천').replace(/광주광역시/g,'광주').replace(/대전광역시/g,'대전').replace(/세종특별자치시/g,'세종').replace(/강원특별자치도/g,'강원').replace(/전북특별자치도/g,'전북').replace(/제주특별자치도/g,'제주').replace(/\s{2,}/g,' ').trim();
    function list(){try{return typeof jobs!=='undefined'&&Array.isArray(jobs)?jobs:[]}catch{return[]}}
    function jobFor(item){return list().find(x=>x.job_key===item?.dataset?.k)}
    function textarea(item){return item?.querySelector('.v174Compact textarea,.v170Compact textarea,.v166Copy textarea')}
    function sourceUrl(j){return plain(j.official_url||j.source_url||j.url)||'공식 채용사이트 확인'}
    function workText(j,d={}){const x=plain(d.content||j.job_detail||j.description||'');if(x)return short(x,230);const r=plain(d.jobs||j.recruit_field||(Array.isArray(j.roles)?j.roles.join(' · '):''));return r||'공식 채용사이트 확인'}
    function regionText(j,d={}){const r=plain(d.region||j.region_name||j.workplace||j.region||(Array.isArray(j.regions)?j.regions.join(', '):''));return cleanRegion(r)||'공식 채용사이트 확인'}
    function build(j,d={}){
      const career=cleanCareer(d.career||j.experience_type||j.w24_career||'');
      const edu=cleanEdu(d.education||j.education_raw||'');
      const emp=plain(d.employmentType||j.employment_type)||'확인 필요';
      const pay=plain(d.salary||j.salary)||'확인 필요';
      const wh=plain(d.workHours||j.work_hours)||'확인 필요';
      return [
        plain(j.title)||'공고명 확인',
        '업체: '+(plain(j.company)||'업체 확인'),
        '주소: '+regionText(j,d),
        '업무: '+workText(j,d),
        '경력: '+career+' / 학력: '+edu,
        '고용형태: '+emp,
        '급여: '+pay,
        '근무: '+wh,
        '링크: '+sourceUrl(j)
      ].join('\n');
    }
    function applyJobDetail(j,d){
      if(!d||typeof d!=='object')return;
      j.w24_open_detail=d;
      if(d.region){j.region_name=d.region;j.workplace=d.region;j.regions=[d.region]}
      if(d.education)j.education_raw=d.education;
      if(d.employmentType)j.employment_type=d.employmentType;
      if(d.career){j.experience_type=d.career;j.w24_career=d.career}
      if(d.jobs)j.recruit_field=d.jobs;
      if(d.content)j.job_detail=d.content;
      if(d.qualification)j.qualification=d.qualification;
      if(d.salary)j.salary=d.salary;
      if(d.workHours)j.work_hours=d.workHours;
      if(d.url&&!j.source_url)j.source_url=d.url;
    }
    function readCache(seq){try{const raw=localStorage.getItem(CACHE_PREFIX+seq);if(!raw)return null;const x=JSON.parse(raw);if(!x?.at||Date.now()-x.at>CACHE_MS){localStorage.removeItem(CACHE_PREFIX+seq);return null}return x.data||null}catch{return null}}
    function writeCache(seq,data){try{localStorage.setItem(CACHE_PREFIX+seq,JSON.stringify({at:Date.now(),data}))}catch{}}
    async function fetchDetail(j){
      const seq=plain(j.empSeqno);if(!seq)return null;
      const cached=readCache(seq);if(cached){applyJobDetail(j,cached);return cached}
      if(pending.has(seq))return pending.get(seq);
      const p=(async()=>{
        try{
          const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'detail_open_recruit',empSeqno:seq})});
          const d=await r.json().catch(()=>({}));
          if(!r.ok||!d?.ok||!d?.detail)return null;
          applyJobDetail(j,d.detail);writeCache(seq,d.detail);return d.detail;
        }catch{return null}
        finally{pending.delete(seq)}
      })();
      pending.set(seq,p);return p;
    }
    function enhanceNow(item){
      const j=jobFor(item);if(!j||!['WORK24_OPEN','CORPORATE'].includes(j.source))return false;
      const ta=textarea(item);if(!ta)return false;
      ta.value=build(j,j.w24_open_detail||{});
      return true;
    }
    async function enhance(item){
      const j=jobFor(item);if(!j||!['WORK24_OPEN','CORPORATE'].includes(j.source))return;
      enhanceNow(item);
      if(j.source==='WORK24_OPEN'&&item.classList.contains('open')&&j.empSeqno){
        const d=await fetchDetail(j);if(d)enhanceNow(item);
      }
    }
    function watchItem(item){
      if(!item)return;
      enhance(item);
      const mo=new MutationObserver(()=>enhance(item));
      mo.observe(item,{childList:true,subtree:true});
      setTimeout(()=>mo.disconnect(),5000);
    }
    document.querySelectorAll('.v166Item').forEach(watchItem);
    window.addEventListener('click',e=>{
      const item=e.target.closest?.('.v166Item');if(!item)return;
      if(e.target.closest('.v166Summary')){
        setTimeout(()=>enhance(item),20);setTimeout(()=>enhance(item),180);setTimeout(()=>enhance(item),700);
      }
    },true);
    const bodyObserver=new MutationObserver(ms=>{for(const rec of ms){for(const n of rec.addedNodes||[]){if(n?.nodeType!==1)continue;if(n.matches?.('.v166Item'))watchItem(n);n.querySelectorAll?.('.v166Item').forEach(watchItem)}}});
    bodyObserver.observe(document.body,{childList:true,subtree:true});
  }
  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,100);return}if(d.getElementById('v177MidCopyScript'))return;const s=d.createElement('script');s.id='v177MidCopyScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,620));if(frame.contentDocument?.readyState==='complete')setTimeout(inject,620);
})();