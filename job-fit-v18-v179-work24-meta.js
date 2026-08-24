(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(document.getElementById('v179Work24MetaReady'))return;
    const marker=document.createElement('meta');marker.id='v179Work24MetaReady';document.head.appendChild(marker);

    const API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-meta-proxy';
    const STRONG_TTL=24*60*60*1000;
    const DUTY_TTL=24*60*60*1000;
    const strongMem=new Map();
    const dutyMem=new Map();
    const REGION_CODE={
      '전국':'','서울특별시':'11000','부산광역시':'26000','대구광역시':'27000','인천광역시':'28000','광주광역시':'29000','대전광역시':'30000','울산광역시':'31000','세종특별자치시':'36110','경기도':'41000','강원특별자치도':'42000','충청북도':'43000','충청남도':'44000','전북특별자치도':'45000','전라남도':'46000','경상북도':'47000','경상남도':'48000','제주특별자치도':'50000'
    };

    const style=document.createElement('style');
    style.textContent=`
      .v179StrongTools{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 10px;padding:9px 11px;border:1px solid #e4e7ec;border-radius:10px;background:#f9fafb;font-size:12px}
      .v179StrongTools label{display:flex;align-items:center;gap:6px;font-weight:850;margin:0;cursor:pointer}.v179StrongTools input{width:auto;margin:0}.v179StrongStatus{color:#667085}
      .v179StrongBadge{display:inline-block;margin-left:5px;padding:3px 7px;border-radius:999px;background:#fff4e5;color:#a15c00;font-size:11px;font-weight:900;vertical-align:middle}
      .v179Duty{margin-top:10px;padding:12px 13px;border:1px solid #dbe7ff;border-radius:11px;background:#f8fbff;color:#344054;font-size:12px;line-height:1.55}
      .v179DutyTitle{font-weight:900;color:#2457d6;margin-bottom:7px}.v179DutyUnit{padding:7px 0;border-top:1px solid #e7eefc}.v179DutyUnit:first-of-type{border-top:0}.v179DutyName{font-weight:900;color:#172033}.v179DutyMeta{color:#667085;margin-top:2px}.v179DutyKsa{color:#475467;margin-top:3px}
    `;
    document.head.appendChild(style);

    const $=id=>document.getElementById(id);
    const plain=v=>String(v??'').replace(/<[^>]+>/g,' ').replace(/\r/g,' ').replace(/\s+/g,' ').trim();
    const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    function allJobs(){try{return typeof jobs!=='undefined'&&Array.isArray(jobs)?jobs:[]}catch{return[]}}
    function jobByKey(key){return allJobs().find(j=>String(j.job_key||'')===String(key||''))||null}
    function companyKey(v){return plain(v).toLowerCase().replace(/주식회사|\(주\)|㈜|\(유\)|유한회사|합자회사|합명회사/g,'').replace(/[^가-힣a-z0-9]/g,'')}
    async function call(body){const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||('HTTP '+r.status));return d}
    function readCache(k,ttl){try{const raw=localStorage.getItem(k);if(!raw)return null;const x=JSON.parse(raw);if(!x?.at||Date.now()-x.at>ttl){localStorage.removeItem(k);return null}return x.data??null}catch{return null}}
    function writeCache(k,data){try{localStorage.setItem(k,JSON.stringify({at:Date.now(),data}))}catch{}}

    function ensureStrongTools(){
      const count=$('smeCount');if(!count||$('v179StrongTools'))return;
      const box=document.createElement('div');box.id='v179StrongTools';box.className='v179StrongTools';box.innerHTML='<label><input type="checkbox" id="v179StrongOnly"> ⭐ 강소기업만 보기</label><span id="v179StrongStatus" class="v179StrongStatus">검색 후 자동 대조</span>';
      count.after(box);
      $('v179StrongOnly')?.addEventListener('change',applyStrongFilter);
    }
    function selectedStrongRegion(){const sido=$('smeSido')?.value||'울산광역시';return REGION_CODE[sido]??''}
    async function strongList(region){
      if(!region)return {companies:[],skipped:true};
      if(strongMem.has(region))return strongMem.get(region);
      const ck='jobfit_strong_v179_'+region,cached=readCache(ck,STRONG_TTL);if(cached){strongMem.set(region,cached);return cached}
      const first=await call({action:'strong_companies',region,page:1,display:100});
      const total=Number(first.total||0),pages=Math.min(Math.max(Math.ceil(total/100),1),6);
      const rest=pages>1?await Promise.all(Array.from({length:pages-1},(_,i)=>call({action:'strong_companies',region,page:i+2,display:100}).catch(()=>({companies:[]})))):[];
      const companies=[...(first.companies||[]),...rest.flatMap(x=>x.companies||[])];
      const data={companies,total,skipped:false};strongMem.set(region,data);writeCache(ck,data);return data
    }
    function applyStrongFilter(){
      const only=!!$('v179StrongOnly')?.checked,items=[...document.querySelectorAll('#smeList > .item')];let shown=0,strongCount=0;
      for(const item of items){const yes=item.dataset.v179Strong==='1';if(yes)strongCount++;item.style.display=only&&!yes?'none':'';if(item.style.display!=='none')shown++}
      const st=$('v179StrongStatus');if(st)st.textContent=items.length?`강소기업 ${strongCount}건${only?' · 표시 '+shown+'건':''}`:'검색 후 자동 대조'
    }
    async function decorateSme(){
      ensureStrongTools();const root=$('smeList');if(!root)return;const items=[...root.querySelectorAll(':scope > .item')];if(!items.length)return;
      const region=selectedStrongRegion(),st=$('v179StrongStatus');
      if(!region){if(st)st.textContent='전국 검색은 지역을 선택하면 강소기업 대조 가능';return}
      if(st)st.textContent='고용24 강소기업 DB 대조 중...';
      try{
        const data=await strongList(region),map=new Map();
        for(const c of data.companies||[]){const k=companyKey(c.company);if(k&&!map.has(k))map.set(k,c)}
        let strongCount=0;
        for(const item of items){
          item.querySelectorAll('.v179StrongBadge').forEach(x=>x.remove());
          const strongEl=item.querySelector('strong'),raw=plain(strongEl?.textContent||''),company=raw.split(' · ')[0]||raw,info=map.get(companyKey(company));
          item.dataset.v179Strong=info?'1':'0';
          if(info){
            strongCount++;
            const b=document.createElement('span');b.className='v179StrongBadge';b.textContent='⭐ '+(info.brandName||'강소기업');
            b.title=[info.address,info.industry,info.mainProduct,info.workerCount?('상시근로자 '+info.workerCount+'명'):''].filter(Boolean).join(' · ');
            const badge=item.querySelector('.catBadge.sme');if(badge)badge.after(b);else strongEl?.before(b)
          }
        }
        if(st)st.textContent=`강소기업 ${strongCount}건 · 지역 DB ${data.total||data.companies?.length||0}개 대조`;
        applyStrongFilter()
      }catch(e){if(st)st.textContent='강소기업 대조 실패 · 일반 채용검색은 정상 사용 가능'}
    }
    function watchSmeResult(){
      ensureStrongTools();const root=$('smeList');if(!root)return;
      const run=()=>{if(root.querySelector(':scope > .item')){decorateSme();return true}return false};
      if(run())return;
      const mo=new MutationObserver(()=>{if(run())mo.disconnect()});mo.observe(root,{childList:true});setTimeout(()=>mo.disconnect(),20000)
    }

    function dutyInput(j){
      const raw=plain(j?.job_detail||j?.jobContent||j?.recruit_field||j?.jobsNm||j?.description||j?.title||'');
      return raw.length>420?raw.slice(0,420):raw
    }
    function cleanKsa(v){
      const parts=String(v||'').split(/\s*·\s*/).map(plain).filter(x=>x&&!/^https?:\/\//i.test(x));const out=[];
      for(const x of parts){if(!out.includes(x))out.push(x);if(out.length>=6)break}return out
    }
    async function dutyData(j){
      const key=String(j?.job_key||j?.wantedAuthNo||j?.title||''),input=dutyInput(j);if(input.length<2)return null;
      if(dutyMem.has(key))return dutyMem.get(key);
      const ck='jobfit_duty_v179_'+encodeURIComponent(key).slice(0,180),cached=readCache(ck,DUTY_TTL);if(cached){dutyMem.set(key,cached);return cached}
      const d=await call({action:'job_duty',jobCont:input,limit:3});dutyMem.set(key,d);writeCache(ck,d);return d
    }
    function dutyHtml(d){
      const units=d?.units||[];if(!units.length)return '<div class="v179DutyTitle">🧭 관련 직무정보 · 고용24</div><div>관련 표준직무기술서 결과가 없습니다. 원 공고의 실제 업무내용을 기준으로 판단하세요.</div>';
      return '<div class="v179DutyTitle">🧭 관련 직무정보 · 고용24</div>'+units.map(u=>{
        const cls=[u.ncsLargeName,u.ncsMiddleName,u.ncsSmallName].filter(Boolean).join(' › '),ksa=cleanKsa(u.knowledgeSkillAttitude);
        return '<div class="v179DutyUnit"><div class="v179DutyName">'+esc(u.unitName||'관련 직무')+(u.abilityUnitCode?' <span style="font-weight:600;color:#667085">('+esc(u.abilityUnitCode)+')</span>':'')+'</div>'+(cls?'<div class="v179DutyMeta">NCS '+esc(cls)+'</div>':'')+(u.definition?'<div>'+esc(u.definition)+'</div>':'')+(ksa.length?'<div class="v179DutyKsa">필요 지식·기술·태도: '+esc(ksa.join(' · '))+'</div>':'')+'</div>'
      }).join('')+'<div class="v179DutyMeta" style="margin-top:6px">※ 자동 유사 직무 조회 결과이며 최종 직무판정은 공고 원문을 우선합니다.</div>'
    }
    async function renderDuty(item){
      if(!item)return;const key=item.dataset.k,j=jobByKey(key);if(!j)return;
      let panel=item.querySelector('.v179Duty');if(panel?.dataset.loaded==='1')return;
      const anchor=item.querySelector('.v174Compact,.v169Form,.v166Copy')||item.querySelector('.v166Body')||item;
      if(!panel){panel=document.createElement('div');panel.className='v179Duty';panel.innerHTML='<div class="v179DutyTitle">🧭 관련 직무정보 · 고용24</div><div>업무내용으로 관련 NCS 직무를 확인하는 중...</div>';anchor.insertAdjacentElement?.('afterend',panel)}
      try{const d=await dutyData(j);if(!d){panel.remove();return}panel.innerHTML=dutyHtml(d);panel.dataset.loaded='1'}catch{panel.innerHTML='<div class="v179DutyTitle">🧭 관련 직무정보 · 고용24</div><div>직무정보 조회를 완료하지 못했습니다. 기존 공고 분석은 정상 사용 가능합니다.</div>'}
    }

    ensureStrongTools();
    $('smeSearchBtn')?.addEventListener('click',()=>setTimeout(watchSmeResult,30));
    $('smeQ')?.addEventListener('keydown',e=>{if(e.key==='Enter')setTimeout(watchSmeResult,30)});
    $('smeSido')?.addEventListener('change',()=>{if($('v179StrongOnly'))$('v179StrongOnly').checked=false;applyStrongFilter()});
    document.addEventListener('click',e=>{
      const summary=e.target.closest?.('.v166Summary');if(summary){const item=summary.closest('.v166Item');setTimeout(()=>renderDuty(item),950)}
    },true);
    document.querySelectorAll('.v166Item.open').forEach(item=>setTimeout(()=>renderDuty(item),1000));
  }

  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,120);return}if(d.getElementById('v179Work24MetaScript'))return;const s=d.createElement('script');s.id='v179Work24MetaScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,900));if(frame.contentDocument?.readyState==='complete')setTimeout(inject,900);
})();
