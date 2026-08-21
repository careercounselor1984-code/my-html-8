(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function ui166(){
    if(!document.getElementById('browsePatchV163Ready')){setTimeout(ui166,100);return}
    if(document.getElementById('ui166Ready'))return;
    const ready=document.createElement('meta');ready.id='ui166Ready';document.head.appendChild(ready);

    const PAGE=10;
    const state={public:{page:1,open:new Set()},mid:{page:1,open:new Set()},sme:{page:1,open:new Set()}};
    const ALIAS={'서울특별시':['서울'],'부산광역시':['부산'],'대구광역시':['대구'],'인천광역시':['인천'],'광주광역시':['광주'],'대전광역시':['대전'],'울산광역시':['울산'],'세종특별자치시':['세종'],'경기도':['경기'],'강원특별자치도':['강원'],'충청북도':['충북'],'충청남도':['충남'],'전북특별자치도':['전북','전라북도'],'전라남도':['전남'],'경상북도':['경북'],'경상남도':['경남'],'제주특별자치도':['제주']};
    let rendering=false,queued=null;

    const style=document.createElement('style');
    style.textContent=`
      .v166List{margin-top:8px}.v166Item{border:1px solid #e4e7ec;border-radius:11px;background:#fff;margin-bottom:8px;overflow:hidden}.v166Summary{display:flex;align-items:center;gap:8px;padding:11px 12px;cursor:pointer}.v166Summary:hover{background:#f8fafc}.v166Title{flex:1;font-weight:900;line-height:1.45;color:#172033}.v166Dates{flex:0 0 auto;border-radius:99px;padding:4px 8px;background:#f2f4f7;color:#475467;font-size:10px;font-weight:850;white-space:nowrap}.v166Arrow{font-size:12px;color:#667085;transition:transform .15s}.v166Item.open .v166Arrow{transform:rotate(180deg)}.v166Detail{display:none;border-top:1px solid #e4e7ec;padding:12px;background:#fcfcfd}.v166Item.open .v166Detail{display:block}.v166Meta{font-size:12px;color:#667085;line-height:1.55}.v166Copy{margin-top:10px;padding:10px;background:#f6fef9;border:1px solid #abefc6;border-radius:10px}.v166Copy textarea{min-height:175px;margin-top:7px;background:#fff;line-height:1.55;font-size:12px}.v166Actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.v166Actions .btn{margin-top:0}.v166Count{font-size:12px;color:#667085;margin:6px 0 10px}.v166Pager{display:flex;justify-content:center;align-items:center;gap:5px;flex-wrap:wrap;margin:13px 0 4px}.v166Pager button{border:1px solid #d0d5dd;background:#fff;color:#344054;border-radius:7px;padding:6px 9px;font-size:12px;font-weight:800;cursor:pointer}.v166Pager button.on{background:#2457d6;color:#fff;border-color:#2457d6}.v166Pager button:disabled{opacity:.4;cursor:default}.v166PageInfo{font-size:11px;color:#667085;margin:0 5px}.v166Selected{margin:14px 0 0;padding:13px 14px;border:2px solid #bfd4ff;border-radius:12px;background:#f8faff}.v166Selected .t{font-size:15px;font-weight:950}.v166Selected .d{font-size:11px;color:#667085;margin-top:4px}.uxModalBody #check>.grid2>.card:first-child{display:none!important}.uxModalBody #check>.grid2{grid-template-columns:1fr!important}.uxModalBody #matchResults{display:none!important}.uxModalBody #check>.grid2>.card:nth-child(2){grid-column:1}.v166PrintModal{border:1px solid #d0d5dd;background:#fff;border-radius:8px;padding:7px 10px;font-weight:850;cursor:pointer}@media(max-width:760px){.v166Summary{align-items:flex-start;flex-wrap:wrap}.v166Dates{order:3;margin-left:36px}.v166Title{min-width:70%}}
    `;
    document.head.appendChild(style);

    const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const norm=v=>String(v??'').toLowerCase().replace(/[\s·ㆍ_\-()\[\]{}]/g,'');
    function rawTs(raw){
      const s=String(raw||'').trim();if(!s)return 0;
      const d8=s.replace(/\D/g,'');
      if(d8.length>=8){const y=+d8.slice(0,4),m=+d8.slice(4,6)-1,d=+d8.slice(6,8);const t=new Date(y,m,d).getTime();if(Number.isFinite(t))return t}
      const t=Date.parse(s);return Number.isFinite(t)?t:0;
    }
    function startRaw(j){return j.start_date||j.startDate||j.post_date||j.empWantedStdt||j.registeredDate||j.regDt||j.notice_date||j.first_seen_at||j.created_at||''}
    function endRaw(j){return j.end_date||j.endDate||j.closeDate||j.empWantedEndt||j.receiptCloseDt||''}
    function fmt(raw){const t=rawTs(raw);if(!t)return'';const d=new Date(t);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
    const startFmt=j=>fmt(startRaw(j));
    const endFmt=j=>fmt(endRaw(j));
    function regionLine(j){return (j.regions||j.work_regions||[]).join(', ')||j.region_name||j.workplace||j.region||j.companyAddress||j.institution_address||'지역 확인 필요'}
    function locationMatch(j,sido,gu){
      const t=norm([(j.regions||j.work_regions||[]).join(' '),j.region_name,j.workplace,j.region,j.companyAddress,j.institution_address,j.title].join(' '));
      if(gu&&gu!=='ALL'&&!t.includes(norm(gu)))return false;
      if(!sido||sido==='전국')return true;
      if([sido,...(ALIAS[sido]||[])].some(x=>t.includes(norm(x))))return true;
      return j.source==='WORK24_OPEN'&&!(j.regions||[]).length&&!j.region_name&&!j.workplace&&gu==='ALL';
    }
    function queryMatch(j,q){
      q=String(q||'').trim();if(!q)return true;const nq=norm(q);
      const t=norm([j.company,j.title,(j.ncs_names||[]).join(' '),j.recruit_field,j.job_detail,j.description,j.qualification,(j.roles||[]).join(' ')].join(' '));
      if(t.includes(nq))return true;
      return (j.w24_matched_keywords||[]).some(k=>norm(k).includes(nq)||nq.includes(norm(k)));
    }
    function sourceTag(j){if(j.source==='ALIO')return'<span class="catBadge public">ALIO</span>';if(j.source==='CLEANEYE')return'<span class="catBadge public">클린아이</span>';if(j.source==='CORPORATE')return'<span class="catBadge mid">기업DB</span>';if(j.source==='WORK24_OPEN')return'<span class="catBadge mid">고용24 공채속보</span>';return'<span class="catBadge sme">고용24 일반채용</span>'}
    function requirementSummarySafe(j){
      let ro='';try{const rs=roles(j)||[];ro=rs.length===1?rs[0]:(j.recruit_field||'')}catch{ro=j.recruit_field||''}
      let req=null;try{req=requirementSummary(j,ro)}catch{}
      const must=(req?.must||[]).filter(Boolean).slice(0,3).join(' / ')||[j.education_raw,j.w24_career,j.certifications].filter(Boolean).join(' / ')||'공식 공고문 확인';
      const pref=(req?.pref||[]).filter(Boolean).slice(0,3).join(' / ')||j.preference||'공식 공고문 확인';
      return{ro,must,pref};
    }
    function copyText(j){
      const {ro,must,pref}=requirementSummarySafe(j);
      return ['[채용정보 안내]','○ 기관/기업: '+(j.company||'확인 필요'),'○ 공고: '+(j.title||'확인 필요'),'○ 시작일: '+(startFmt(j)||'확인 필요'),'○ 마감일: '+(endFmt(j)||String(endRaw(j)||'확인 필요')),ro?'○ 지원직무: '+ro:'','○ 근무지역: '+regionLine(j),j.employment_type?'○ 고용형태: '+j.employment_type:'',j.salary?'○ 급여/연봉: '+j.salary:'','○ 핵심 자격: '+must,'○ 우대조건: '+pref,j.job_detail?'○ 주요업무: '+String(j.job_detail).replace(/<[^>]+>/g,' ').replace(/&#xd;|\n/g,' ').replace(/\s+/g,' ').trim().slice(0,280):'','','공고 확인: '+(j.source_url||'공식 채용페이지 확인 필요'),'※ 세부 자격요건·접수방법은 공식 공고문을 꼭 확인해주세요.'].filter(Boolean).join('\n');
    }
    function card(j,kind){
      const open=state[kind].open.has(j.job_key),st=startFmt(j)||'미확인',ed=endFmt(j)||String(endRaw(j)||'미확인'),meta=[regionLine(j),j.company_class||j.employment_type||'',j.salary||''].filter(Boolean).join(' · '),official=j.source_url?'<a class="btn secondary" target="_blank" rel="noopener" href="'+esc(j.source_url)+'">공식 공고</a>':'';
      return '<div class="v166Item '+(open?'open':'')+'" data-k="'+esc(j.job_key)+'"><div class="v166Summary" role="button" tabindex="0" aria-expanded="'+(open?'true':'false')+'">'+sourceTag(j)+'<div class="v166Title">'+esc(j.company)+' · '+esc(j.title)+'</div><div class="v166Dates">시작일 '+esc(st)+' · 마감일 '+esc(ed)+'</div><span class="v166Arrow">▼</span></div><div class="v166Detail"><div class="v166Meta">'+esc(meta)+'</div><div class="v166Copy"><b>📤 내담자 복사용</b><textarea readonly>'+esc(copyText(j))+'</textarea><div class="v166Actions"><button class="btn green v166CopyBtn" type="button">복사용 문구 복사</button><button class="btn uxAnalyze" type="button">지원가능성 분석</button><button class="btn secondary v166Print" type="button">🖨 출력 / PDF 저장</button>'+official+'</div></div></div></div>';
    }
    function rows(kind){
      let xs=[],q='',sido='전국',gu='ALL';
      if(kind==='public'){q=$('publicQ')?.value||'';sido=$('publicSido')?.value||'전국';gu=$('publicGu')?.value||'ALL';xs=jobs.filter(j=>['ALIO','CLEANEYE'].includes(j.source)&&isOpen(j))}
      if(kind==='mid'){q=$('midQ')?.value||'';sido=$('midSido')?.value||'전국';gu=$('midGu')?.value||'ALL';xs=jobs.filter(j=>['CORPORATE','WORK24_OPEN'].includes(j.source)&&isOpen(j));const seen=new Set();xs=xs.filter(j=>{const k=norm(j.company+'|'+j.title);if(seen.has(k))return false;seen.add(k);return true})}
      if(kind==='sme'){q=$('smeQ')?.value||'';sido=$('smeSido')?.value||'전국';gu=$('smeGu')?.value||'ALL';xs=jobs.filter(j=>j.source==='WORK24_GENERAL'&&isOpen(j)&&(!j.w24_detail_loaded||j.companySizeCandidate||/중소기업|소기업/.test(String(j.companySize||''))))}
      return xs.filter(j=>queryMatch(j,q)&&locationMatch(j,sido,gu)).sort((a,b)=>rawTs(startRaw(b))-rawTs(startRaw(a))||rawTs(endRaw(a))-rawTs(endRaw(b))||String(a.company||'').localeCompare(String(b.company||''),'ko'));
    }
    function pager(kind,total){const pages=Math.max(1,Math.ceil(total/PAGE)),cur=Math.min(state[kind].page,pages);state[kind].page=cur;if(pages<=1)return'';const nums=[];let a=Math.max(1,cur-2),b=Math.min(pages,a+4);a=Math.max(1,b-4);for(let i=a;i<=b;i++)nums.push('<button class="'+(i===cur?'on':'')+'" data-p="'+i+'">'+i+'</button>');return '<div class="v166Pager"><button data-p="'+(cur-1)+'" '+(cur<=1?'disabled':'')+'>이전</button>'+nums.join('')+'<span class="v166PageInfo">'+cur+' / '+pages+'</span><button data-p="'+(cur+1)+'" '+(cur>=pages?'disabled':'')+'>다음</button></div>'}
    function hostId(kind){return kind==='public'?'uxPublicList':kind==='mid'?'uxMidList':'uxSmeList'}
    function installHost(kind){
      const id=hostId(kind),old=$(id);if(!old)return null;
      if(old.dataset.v166==='1')return old;
      const el=document.createElement('div');el.id=id;el.className='v166List';el.dataset.v166='1';old.replaceWith(el);
      el.addEventListener('click',e=>onHostClick(e,kind));
      el.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.v166Summary')){e.preventDefault();toggleItem(e.target.closest('.v166Item'),kind)}});
      new MutationObserver(()=>{if(!rendering)queueRender(kind)}).observe(el,{childList:true});
      return el;
    }
    function toggleItem(item,kind){if(!item)return;const key=item.dataset.k,open=item.classList.toggle('open');item.querySelector('.v166Summary')?.setAttribute('aria-expanded',open?'true':'false');if(open)state[kind].open.add(key);else state[kind].open.delete(key)}
    async function onHostClick(e,kind){
      const page=e.target.closest('[data-p]');if(page&&!page.disabled){state[kind].page=+page.dataset.p;renderKind(kind);return}
      const item=e.target.closest('.v166Item');if(!item)return;
      if(e.target.closest('.v166Summary')){toggleItem(item,kind);return}
      if(e.target.closest('.v166CopyBtn')){const ta=item.querySelector('textarea');try{await navigator.clipboard.writeText(ta.value)}catch{ta.select();document.execCommand('copy')}const b=e.target.closest('.v166CopyBtn'),old=b.textContent;b.textContent='✓ 복사 완료';setTimeout(()=>b.textContent=old,1200);return}
      if(e.target.closest('.v166Print')){const j=jobs.find(x=>x.job_key===item.dataset.k);if(j)printJob(j);return}
    }
    function renderKind(kind){
      let el=$(hostId(kind));if(!el||el.dataset.v166!=='1')el=installHost(kind);if(!el)return;
      const xs=rows(kind),pages=Math.max(1,Math.ceil(xs.length/PAGE));if(state[kind].page>pages)state[kind].page=pages;
      const show=xs.slice((state[kind].page-1)*PAGE,state[kind].page*PAGE);
      rendering=true;el.innerHTML='<div class="v166Count">총 '+xs.length+'건 · 시작일 최신순 · '+state[kind].page+'/'+pages+'페이지 · 한 페이지 10건</div>'+(show.length?show.map(j=>card(j,kind)).join(''):'<div class="catEmpty">선택한 조건의 공고가 없습니다.</div>')+pager(kind,xs.length);rendering=false;
    }
    function renderAll(){renderKind('public');renderKind('mid');renderKind('sme')}
    function queueRender(kind){clearTimeout(queued);queued=setTimeout(()=>{if(kind)renderKind(kind);else renderAll()},60)}

    function printWindow(title,body){
      const w=window.open('','_blank','width=900,height=900');if(!w){alert('팝업이 차단되었습니다. 이 사이트의 팝업을 허용한 뒤 다시 시도해 주세요.');return}
      w.document.open();w.document.write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>'+esc(title)+'</title><style>body{font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;color:#172033;margin:32px;line-height:1.65}h1{font-size:22px;margin:0 0 8px}h2{font-size:16px;margin:24px 0 8px}.sub{color:#667085;font-size:12px;margin-bottom:18px}.box{border:1px solid #d0d5dd;border-radius:10px;padding:14px;margin:12px 0}.row{display:grid;grid-template-columns:110px 1fr;gap:10px;border-bottom:1px solid #eee;padding:7px 0;font-size:13px}.row b{color:#475467}pre{white-space:pre-wrap;font:12px/1.65 system-ui,-apple-system,"Noto Sans KR",sans-serif;background:#f8fafc;border:1px solid #e4e7ec;border-radius:10px;padding:14px}a{color:#175cd3;word-break:break-all}@media print{body{margin:14mm}.noPrint{display:none!important}}</style></head><body>'+body+'<div class="noPrint" style="margin-top:24px;color:#667085;font-size:12px">인쇄창에서 프린터를 선택하거나 ‘PDF로 저장’을 선택하세요.</div><script>setTimeout(()=>window.print(),250)<\/script></body></html>');w.document.close();
    }
    function printJob(j){
      const {ro,must,pref}=requirementSummarySafe(j),url=j.source_url||'';
      const body='<h1>'+esc(j.company)+' · '+esc(j.title)+'</h1><div class="sub">채용공고 상담용 출력</div><div class="box"><div class="row"><b>시작일</b><span>'+esc(startFmt(j)||'미확인')+'</span></div><div class="row"><b>마감일</b><span>'+esc(endFmt(j)||String(endRaw(j)||'미확인'))+'</span></div><div class="row"><b>근무지역</b><span>'+esc(regionLine(j))+'</span></div>'+(ro?'<div class="row"><b>지원직무</b><span>'+esc(ro)+'</span></div>':'')+(j.employment_type?'<div class="row"><b>고용형태</b><span>'+esc(j.employment_type)+'</span></div>':'')+(j.salary?'<div class="row"><b>급여/연봉</b><span>'+esc(j.salary)+'</span></div>':'')+'<div class="row"><b>핵심 자격</b><span>'+esc(must)+'</span></div><div class="row"><b>우대조건</b><span>'+esc(pref)+'</span></div></div><h2>내담자 안내용</h2><pre>'+esc(copyText(j))+'</pre>'+(url?'<div class="row"><b>공식 공고</b><span>'+esc(url)+'</span></div>':'');
      printWindow((j.company||'채용공고')+'_'+(j.title||'공고'),body);
    }
    function simplifyModal(){
      const m=$('uxAnalyzeModal');if(!m?.classList.contains('open')||!sel)return;const check=$('check');if(!check)return;
      let b=$('v166Selected');if(!b){b=document.createElement('div');b.id='v166Selected';b.className='v166Selected';check.insertBefore(b,check.firstChild)}
      b.innerHTML='<div class="t">선택 공고 · '+esc(sel.company)+' · '+esc(sel.title)+'</div><div class="d">시작일 '+esc(startFmt(sel)||'미확인')+' · 마감일 '+esc(endFmt(sel)||String(endRaw(sel)||'미확인'))+' · 이 공고만 고정해서 분석합니다.</div>';
      const top=m.querySelector('.uxModalTop');if(top&&!top.querySelector('.v166PrintModal')){const p=document.createElement('button');p.type='button';p.className='v166PrintModal';p.textContent='🖨 분석결과 / PDF';p.addEventListener('click',printAnalysis);top.insertBefore(p,top.querySelector('.uxModalClose'))}
      const cards=check.querySelectorAll(':scope>.grid2>.card');if(cards[1]){const h=cards[1].querySelector('h2');if(h)h.textContent='지원직무 선택'}
    }
    function printAnalysis(){
      if(!sel)return;const result=$('result'),share=$('sharePanel');
      const body='<h1>'+esc(sel.company)+' · '+esc(sel.title)+'</h1><div class="sub">지원가능성 분석 결과 · 시작일 '+esc(startFmt(sel)||'미확인')+' · 마감일 '+esc(endFmt(sel)||String(endRaw(sel)||'미확인'))+'</div>'+(result?.innerHTML?'<h2>지원가능성 분석</h2><div class="box">'+result.innerHTML+'</div>':'<div class="box">아직 지원가능성 분석을 실행하지 않았습니다.</div>')+(share?.innerHTML?'<h2>상담/공유 내용</h2><div class="box">'+share.innerHTML+'</div>':'');
      printWindow((sel.company||'채용')+'_지원가능성분석',body);
    }
    function watchModal(){const m=$('uxAnalyzeModal');if(!m){setTimeout(watchModal,120);return}new MutationObserver(()=>{if(m.classList.contains('open'))setTimeout(simplifyModal,0)}).observe(m,{attributes:true,attributeFilter:['class']});if(m.classList.contains('open'))simplifyModal()}

    ['publicList','midOpenList','corplist','smeList'].forEach((id,i)=>{const el=$(id);if(el)new MutationObserver(()=>queueRender(i===0?'public':i<3?'mid':'sme')).observe(el,{childList:true,subtree:true})});
    ['publicSido','publicGu','midSido','midGu','smeSido','smeGu'].forEach(id=>$(id)?.addEventListener('change',()=>{const k=id.startsWith('public')?'public':id.startsWith('mid')?'mid':'sme';state[k].page=1;setTimeout(()=>renderKind(k),80)}));
    [['publicQ','public'],['midQ','mid'],['smeQ','sme']].forEach(([id,k])=>$(id)?.addEventListener('input',()=>{state[k].page=1;setTimeout(()=>renderKind(k),80)}));

    installHost('public');installHost('mid');installHost('sme');watchModal();renderAll();
  }

  const inject=()=>{const d=frame.contentDocument;if(!d||!d.body||d.getElementById('ui166Script'))return;const s=d.createElement('script');s.id='ui166Script';s.textContent='('+ui166.toString()+')();';d.body.appendChild(s)};
  frame.addEventListener('load',()=>setTimeout(inject,240));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,240);
})();
