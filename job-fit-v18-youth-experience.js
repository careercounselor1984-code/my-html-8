(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function youthPatch(){
    if(document.getElementById('youthExperiencePatchReady'))return;
    const ready=document.createElement('meta');ready.id='youthExperiencePatchReady';document.head.appendChild(ready);

    const API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-youth-experience';
    const REGIONS=['전국','서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
    let lastData=null;

    function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    function activate(id){
      document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.dataset.t===id));
      document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('on',x.id===id));
    }
    function badge(p){
      const cls=p.type==='인턴형'?'intern':p.type==='프로젝트형'?'project':p.type==='ESG지원형'?'esg':'visit';
      return '<span class="yexpBadge '+cls+'">'+esc(p.type)+'</span>'+(p.nationalEmploymentSupport?'<span class="yexpBadge kua">⭐ 국취연계</span>':'');
    }
    function programCard(p){
      const meta=[p.region,p.headcount,p.jobCategory,p.dday].filter(Boolean).join(' · ');
      return '<div class="item yexpItem">'+badge(p)+' <strong>'+esc(p.title)+'</strong>'+
        '<div class="meta">'+esc(meta)+'</div>'+
        '<div class="yexpGrid"><div><b>모집기간</b><span>'+esc(p.recruitPeriod||'-')+'</span></div><div><b>일경험기간</b><span>'+esc(p.experiencePeriod||'-')+'</span></div><div><b>참여기업</b><span>'+esc(p.company||'-')+'</span></div></div>'+
      '</div>';
    }
    function render(data){
      lastData=data;
      const count=document.getElementById('yexpCount'),list=document.getElementById('yexpList'),links=document.getElementById('yexpLinks');
      if(!count||!list)return;
      const xs=Array.isArray(data.programs)?data.programs:[];
      count.textContent=xs.length+'건 표시'+(Number.isFinite(data.portalTotal)?' · 포털 검색 '+Number(data.portalTotal).toLocaleString()+'건':'');
      list.innerHTML=xs.length?xs.map(programCard).join(''):'<div class="catEmpty">선택한 지역의 현재 모집 중 일경험이 검색 상위 결과에 없습니다. 다른 직무 검색어나 전국 지역으로 다시 검색해 보세요.</div>';
      if(links){
        const a=data.target?'<a class="btn secondary" target="_blank" rel="noopener" href="'+esc(data.target)+'">청년일경험 포털에서 전체 보기</a>':'';
        const b=data.regionTarget?'<a class="btn secondary" target="_blank" rel="noopener" href="'+esc(data.regionTarget)+'">지역 일경험 더 보기</a>':'';
        links.innerHTML=a+b;
      }
    }
    async function search(){
      const q=String(document.getElementById('yexpQ')?.value||'').trim();
      const region=String(document.getElementById('yexpRegion')?.value||'울산');
      const list=document.getElementById('yexpList');
      if(q.length<2){if(list)list.innerHTML='<div class="warn">직무·기업·프로그램 검색어를 2글자 이상 입력하세요.</div>';return}
      const btn=document.getElementById('yexpSearchBtn');if(btn)btn.disabled=true;
      if(list)list.innerHTML='<div class="w24loading">고용24 청년일경험 포털에서 현재 모집 중 프로그램을 검색하는 중입니다.</div>';
      try{
        const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({keyword:q,region})});
        const t=await r.text();let d;try{d=JSON.parse(t)}catch{throw Error('서버 응답을 해석하지 못했습니다.')}
        if(!r.ok||!d.ok)throw Error(d.error||('HTTP '+r.status));
        render(d);
      }catch(e){if(list)list.innerHTML='<div class="warn"><b>청년 일경험 검색 실패</b><br>'+esc(e?.message||e)+'</div>'}
      finally{if(btn)btn.disabled=false}
    }

    const st=document.createElement('style');
    st.textContent='.yexpBadge{display:inline-block;border-radius:999px;padding:3px 7px;margin-right:4px;font-size:11px;font-weight:900;background:#ecfdf3;color:#067647}.yexpBadge.project{background:#eef4ff;color:#2457d6}.yexpBadge.esg{background:#fff6ed;color:#b54708}.yexpBadge.visit{background:#f4f3ff;color:#5925dc}.yexpBadge.kua{background:#fff1f3;color:#c01048}.yexpItem strong{display:inline}.yexpGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:9px}.yexpGrid>div{padding:8px 10px;border-radius:9px;background:#f8fafc;font-size:12px}.yexpGrid b{display:block;color:#475467;margin-bottom:3px}.yexpGrid span{color:#101828}.yexpLinks{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}.yexpLinks .btn{margin-top:0}@media(max-width:720px){.yexpGrid{grid-template-columns:1fr}}';
    document.head.appendChild(st);

    const tabs=document.querySelector('.tabs'),smeTab=document.querySelector('.tab[data-t="sme"]');
    if(!tabs||!smeTab)return;
    if(!document.querySelector('.tab[data-t="youth-exp"]')){
      const b=document.createElement('button');b.className='tab';b.dataset.t='youth-exp';b.textContent='🌱 청년 일경험';b.addEventListener('click',()=>activate('youth-exp'));
      smeTab.insertAdjacentElement('afterend',b);
    }

    if(!document.getElementById('youth-exp')){
      const sec=document.createElement('section');sec.id='youth-exp';sec.className='panel';
      sec.innerHTML='<div class="card"><h2>🌱 청년 일경험</h2><div class="box"><b>고용노동부 청년일경험 포털 실시간 검색</b><br>현재 모집 중인 인턴형·프로젝트형·ESG지원형·기업탐방형 프로그램만 별도로 확인합니다. 기본 지역은 울산입니다.</div><div class="catHead"><div><label>지역</label><select id="yexpRegion"></select></div><div><label>직무 / 기업 / 프로그램 검색</label><input id="yexpQ" placeholder="예: 생산, 전기, 품질, 사무, IT"></div><button class="btn" id="yexpSearchBtn">일경험 검색</button></div><div id="yexpCount" class="catCount">0건</div><div id="yexpLinks" class="yexpLinks"></div><div id="yexpList"><div class="catEmpty">검색어를 입력하면 고용24 청년일경험 포털의 현재 모집 중 프로그램을 불러옵니다.</div></div><div class="meta" style="margin-top:12px">※ 검색결과 상위 프로그램을 실시간 조회합니다. 전체 결과와 세부 참여자격·신청방법은 청년일경험 포털 원문에서 최종 확인하세요.</div></div>';
      const smePanel=document.getElementById('sme');
      if(smePanel)smePanel.insertAdjacentElement('afterend',sec);else document.querySelector('.wrap')?.appendChild(sec);
    }

    const sel=document.getElementById('yexpRegion');
    if(sel&&!sel.options.length){sel.innerHTML=REGIONS.map(r=>'<option value="'+esc(r)+'">'+esc(r)+'</option>').join('');sel.value='울산'}
    document.getElementById('yexpSearchBtn')?.addEventListener('click',search);
    document.getElementById('yexpQ')?.addEventListener('keydown',e=>{if(e.key==='Enter')search()});
    const sub=document.querySelector('header .sub');if(sub&&!sub.textContent.includes('청년 일경험'))sub.textContent+=' · 청년 일경험';
  }

  const inject=()=>{
    try{
      const d=frame.contentDocument;
      if(!d||!d.body||d.getElementById('youthExperiencePatchScript')||!d.querySelector('.tab[data-t="sme"]'))return false;
      const s=d.createElement('script');s.id='youthExperiencePatchScript';s.textContent='('+youthPatch.toString()+')();';d.body.appendChild(s);return true;
    }catch{return false}
  };
  frame.addEventListener('load',()=>{let n=0;const t=setInterval(()=>{if(inject()||++n>40)clearInterval(t)},250)});
  let n=0;const t=setInterval(()=>{if(inject()||++n>40)clearInterval(t)},250);
})();
