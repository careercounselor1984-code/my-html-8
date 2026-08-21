(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function categoryPatch(){
    if(document.getElementById('categoryTabsPatchReady'))return;
    const ready=document.createElement('meta');ready.id='categoryTabsPatchReady';document.head.appendChild(ready);

    const OPEN_API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-open-recruit';
    const GENERAL_API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-proxy';
    const REGION_CODE={
      '전국':'','서울특별시':'11000','부산광역시':'26000','대구광역시':'27000','인천광역시':'28000','광주광역시':'29000','대전광역시':'30000','울산광역시':'31000','세종특별자치시':'36110','경기도':'41000','강원특별자치도':'42000','충청북도':'43000','충청남도':'44000','전북특별자치도':'45000','전라남도':'46000','경상북도':'47000','경상남도':'48000','제주특별자치도':'50000'
    };
    const REGION_ALIAS={
      '서울특별시':['서울'],'부산광역시':['부산'],'대구광역시':['대구'],'인천광역시':['인천'],'광주광역시':['광주'],'대전광역시':['대전'],'울산광역시':['울산'],'세종특별자치시':['세종'],'경기도':['경기'],'강원특별자치도':['강원'],'충청북도':['충북'],'충청남도':['충남'],'전북특별자치도':['전북','전라북도'],'전라남도':['전남'],'경상북도':['경북'],'경상남도':['경남'],'제주특별자치도':['제주']
    };
    let midOpenRows=[],smeRows=[],smeExcluded=0,midLoaded=false,midBusy=false,smeBusy=false;

    const st=document.createElement('style');
    st.textContent='.catHead{display:flex;gap:8px;align-items:end;flex-wrap:wrap;margin:10px 0 12px}.catHead>div{min-width:170px;flex:1}.catHead .btn{margin-top:0}.catBadge{display:inline-block;border-radius:99px;padding:3px 7px;font-size:11px;font-weight:900;background:#f2f4f7;color:#344054}.catBadge.public{background:#eef4ff;color:#2457d6}.catBadge.mid{background:#ecfdf3;color:#067647}.catBadge.sme{background:#fff6ed;color:#b54708}.catEmpty{padding:16px;border:1px dashed #d0d5dd;border-radius:10px;color:#667085;font-size:12px}.catItemActions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.catItemActions .btn{margin-top:0}.catCount{font-size:12px;color:#667085;margin:6px 0 10px}';
    document.head.appendChild(st);

    function esc(v){return E(v)}
    function activate(id){
      document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.dataset.t===id));
      document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('on',x.id===id));
      if(id==='public')renderPublic();
      if(id==='corp')loadMidOpen();
    }
    function switchToCheck(jobKey){
      const fallback=[...midOpenRows,...smeRows].find(j=>j.job_key===jobKey);if(fallback&&!jobs.some(j=>j.job_key===jobKey))jobs=jobs.concat(fallback);
      activate('check');
      if(jobKey&&jobs.some(j=>j.job_key===jobKey))choose(jobKey);
      document.getElementById('check')?.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function addTab(id,label,before){
      if(document.querySelector('.tab[data-t="'+id+'"]'))return document.querySelector('.tab[data-t="'+id+'"]');
      const b=document.createElement('button');b.className='tab';b.dataset.t=id;b.textContent=label;b.addEventListener('click',()=>activate(id));
      const tabs=document.querySelector('.tabs');if(before)tabs.insertBefore(b,before);else tabs.appendChild(b);return b
    }
    function regionOptions(id,selected='울산광역시'){
      const el=$(id);if(!el)return;el.innerHTML=Object.keys(REGION_CODE).map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('');el.value=selected
    }
    function regionText(j){return[(j.regions||[]).join(' '),j.region_name||'',j.workplace||'',j.region||''].join(' ')}
    function publicRegionMatch(j){const sido=$('publicSido')?.value||'전국';if(sido==='전국')return true;const t=N(regionText(j));return [sido,...(REGION_ALIAS[sido]||[])].some(x=>t.includes(N(x)))}
    function publicQueryMatch(j){const q=N($('publicQ')?.value||'');if(!q)return true;return N([j.company,j.title,(j.ncs_names||[]).join(' '),j.recruit_field||'',j.job_detail||'',j.qualification||''].join(' ')).includes(q)}
    function sourceLabel(j){if(j.source==='ALIO')return'<span class="catBadge public">ALIO</span>';if(j.source==='CLEANEYE')return'<span class="catBadge public">클린아이</span>';if(j.source==='CORPORATE')return'<span class="catBadge mid">기업DB</span>';if(j.source==='WORK24_OPEN')return'<span class="catBadge mid">고용24 공채속보</span>';return'<span class="catBadge sme">고용24 일반채용</span>'}
    function jobItem(j,kind){
      const region=(j.regions||[]).join(', ')||j.region||'지역 확인 필요';
      const meta=[region,j.company_class||j.employment_type||'',j.salary||'',j.end_date?'마감 '+j.end_date:''].filter(Boolean).join(' · ');
      const official=j.source_url?'<a class="btn secondary" target="_blank" rel="noopener" href="'+esc(j.source_url)+'">공식 공고</a>':'';
      return'<div class="item">'+sourceLabel(j)+' <strong>'+esc(j.company)+' · '+esc(j.title)+'</strong><div class="meta">'+esc(meta)+'</div><div class="catItemActions"><button class="btn catAnalyze" data-k="'+esc(j.job_key)+'">지원가능성 분석</button>'+official+'</div></div>'
    }

    function normalizeCorp(x){
      return{...x,source:'CORPORATE',job_key:x.job_key||('CORP:'+(x.company||'')+'|'+(x.title||'')),company:x.company||'',title:x.title||'',regions:Array.isArray(x.regions)?x.regions:[],employment_type:x.employment_type||'',education_raw:x.education_raw||'',qualification:x.qualification||'',preference:x.preference||'',ncs_names:[],recruit_field:'',job_detail:x.description||'',roles:Array.isArray(x.roles)?x.roles:[],description:x.description||'',salary:x.salary||'',end_date:x.end_date||'',source_url:x.official_url||x.source_url||'',first_seen_at:x.first_seen_at||'',open:x.ongoing_yn!=='N'}
    }
    function syncCorporate(){
      const existing=new Set(jobs.filter(j=>j.source==='CORPORATE').map(j=>j.job_key));
      const add=(corp||[]).map(normalizeCorp).filter(j=>!existing.has(j.job_key));if(add.length)jobs=jobs.concat(add)
    }
    const previousSourceBadge=sourceBadge;
    sourceBadge=function(j){if(j?.source==='CORPORATE')return'<span class="pill" style="background:#ecfdf3;color:#067647;font-weight:900">기업DB</span>';return previousSourceBadge(j)};
    const previousRoles=roles;
    roles=function(j){if(j?.source==='CORPORATE')return(j.roles||[]).length?j.roles:[j.title||'공고문 확인'];return previousRoles(j)};
    const previousRoleText=roleText;
    roleText=function(j,r){if(j?.source!=='CORPORATE')return previousRoleText(j,r);return[
      j.title?'공고: '+j.title:'',(j.roles||[]).length?'모집직무: '+j.roles.join(', '):'',j.description?'직무내용: '+j.description:'',j.education_raw?'학력: '+j.education_raw:'',j.qualification?'지원자격: '+j.qualification:'',j.preference?'우대사항: '+j.preference:'',(j.regions||[]).length?'근무지역: '+j.regions.join(', '):''
    ].filter(Boolean).join('\n')};
    const previousReq=requirementSummary;
    requirementSummary=function(j,r){if(j?.source!=='CORPORATE')return previousReq(j,r);const basic=[],must=[],pref=[];if(j.employment_type)basic.push('고용형태: '+j.employment_type);if(j.education_raw)basic.push('학력: '+j.education_raw);if((j.regions||[]).length)basic.push('근무지역: '+j.regions.join(', '));if(j.qualification)must.push(...String(j.qualification).split(/[\n;]/).map(x=>x.trim()).filter(Boolean));if(j.preference)pref.push(...String(j.preference).split(/[\n;]/).map(x=>x.trim()).filter(Boolean));return{basic:basic.length?basic:['기업 공식 공고 기본조건 확인'],must:must.length?must:['상세 필수요건은 기업 공식 공고 확인'],pref:pref.length?pref:['별도 우대조건은 기업 공식 공고 확인'],raw:roleText(j,r),note:'기업DB 구조화 정보 기준입니다. 최종 지원자격과 접수상태는 기업 공식 원문을 확인하세요.'}};

    function renderPublic(){
      const el=$('publicList');if(!el)return;const xs=jobs.filter(j=>['ALIO','CLEANEYE'].includes(j.source)&&isOpen(j)&&publicRegionMatch(j)&&publicQueryMatch(j)).sort((a,b)=>String(a.end_date||'99999999').localeCompare(String(b.end_date||'99999999'))).slice(0,180);
      $('publicCount').textContent=xs.length+'건';el.innerHTML=xs.length?xs.map(j=>jobItem(j,'public')).join(''):'<div class="catEmpty">선택한 조건의 공공부문 진행 공고가 없습니다.</div>';bindAnalyze(el)
    }
    function renderCorporateDb(){
      syncCorporate();const el=$('corplist');if(!el)return;const q=N($('midQ')?.value||'');const xs=jobs.filter(j=>j.source==='CORPORATE'&&isOpen(j)&&(!q||N([j.company,j.title,(j.roles||[]).join(' '),j.description||'',j.qualification||''].join(' ')).includes(q))).sort((a,b)=>String(a.end_date||'99999999').localeCompare(String(b.end_date||'99999999'))).slice(0,120);
      el.innerHTML=xs.length?xs.map(j=>jobItem(j,'mid')).join(''):'<div class="catEmpty">현재 기업DB 조건 일치 공고가 없습니다.</div>';bindAnalyze(el)
    }
    function normalizeOpen(x){return{...x,source:'WORK24_OPEN',job_key:'W24OPEN:'+(x.empSeqno||x.url||Math.random()),company:x.company||'',title:x.title||'',company_class:x.companyClass||'',regions:[],region_name:'',workplace:'',employment_type:x.employmentType||'',education_raw:'',qualification:'',preference:'',ncs_names:[],recruit_field:'',job_detail:'',certifications:'',salary:'',end_date:x.endDate||'',source_url:x.url||'',first_seen_at:'',open:true,w24_open:true,w24_matched_keywords:[],w24_source_notice:x.sourceNotice||'본 자료는 고용노동부 고용24 공채속보에서 제공된 정보입니다.'}}
    async function call(url,body){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),t=await r.text();let d;try{d=JSON.parse(t)}catch{throw Error('서버 응답 해석 실패')}if(!r.ok||!d.ok)throw Error(d.error||('HTTP '+r.status));return d}
    async function loadMidOpen(force=false){
      if(midBusy)return;if(midLoaded&&!force){renderMidOpen();renderCorporateDb();return}midBusy=true;const el=$('midOpenList');if(el)el.innerHTML='<div class="w24loading">고용24 중견·대기업 공채속보를 불러오는 중입니다.</div>';
      try{const q=String($('midQ')?.value||'').trim(),d=await call(OPEN_API,{action:'search_open_recruit',keyword:q,companyTypes:['10','40','50'],limit:60});midOpenRows=(d.jobs||[]).map(normalizeOpen);const ids=new Set(midOpenRows.map(x=>x.job_key));jobs=jobs.filter(j=>j.source!=='WORK24_OPEN'||ids.has(j.job_key)).filter(j=>j.source!=='WORK24_OPEN').concat(midOpenRows);midLoaded=true;renderMidOpen();renderCorporateDb()}catch(e){if(el)el.innerHTML='<div class="warn"><b>고용24 공채속보 조회 실패</b><br>'+esc(e.message)+'</div>'}finally{midBusy=false}
    }
    function renderMidOpen(){const el=$('midOpenList');if(!el)return;const corpKeys=new Set(jobs.filter(j=>j.source==='CORPORATE').map(j=>N(j.company+'|'+j.title)));const xs=midOpenRows.filter(j=>!corpKeys.has(N(j.company+'|'+j.title)));$('midOpenCount').textContent=xs.length+'건';el.innerHTML=xs.length?xs.map(j=>jobItem(j,'mid')).join(''):'<div class="catEmpty">현재 조건의 고용24 중견·대기업 공채속보가 없습니다.</div>';bindAnalyze(el)}
    function normalizeGeneral(x){const wanted=String(x.wantedAuthNo||''),rel=String(x.relatedJobs||'').split(/[,/|]/).map(v=>v.trim()).filter(Boolean),qual=[x.education?'학력: '+x.education:'',x.career?'경력: '+x.career:'',x.major?'전공: '+x.major:'',x.certificate?'자격면허: '+x.certificate:'',x.otherGuide?'기타안내: '+x.otherGuide:''].filter(Boolean).join('\n');return{...x,source:'WORK24_GENERAL',job_key:'W24GEN:'+(wanted||x.url||Math.random()),company:x.company||'',title:x.title||'',regions:[x.region].filter(Boolean),region_name:x.region||'',workplace:x.region||'',employment_type:x.employmentType||'',education_raw:x.education||'',qualification:qual,preference:x.preference||'',ncs_names:rel,recruit_field:x.jobsNm||'',job_detail:x.jobContent||'',certifications:x.certificate||'',salary:x.pay||'',end_date:x.closeDate||'',source_url:x.url||'',first_seen_at:x.registeredDate||'',open:true,w24_career:x.career||'',w24_major:x.major||'',w24_detail_loaded:!!x.detailLoaded,w24_matched_keywords:x.matchedKeywords||x.queryMatchedKeywords||[],w24_source_notice:x.sourceNotice||'본 자료는 고용노동부 고용24에서 제공된 채용정보입니다.'}}
    async function searchSme(){
      const q=String($('smeQ')?.value||'').trim();if(q.length<2){$('smeList').innerHTML='<div class="warn">직무·공고 검색어를 2글자 이상 입력하세요.</div>';return}if(smeBusy)return;smeBusy=true;$('smeList').innerHTML='<div class="w24loading">고용24 민간 중소기업 공고를 검색하고 상세정보를 확인하는 중입니다.</div>';
      try{const d=await call(GENERAL_API,{action:'recommend_jobs',keywords:[q],regionCode:REGION_CODE[$('smeSido').value]||'',limit:20,perKeyword:20,includeDetails:true});const raw=d.jobs||[],small=raw.filter(x=>/중소기업|소기업/.test(String(x.companySize||'')));smeExcluded=raw.length-small.length;smeRows=small.map(normalizeGeneral);const ids=new Set(smeRows.map(x=>x.job_key));jobs=jobs.filter(j=>j.source!=='WORK24_GENERAL'||ids.has(j.job_key)).filter(j=>j.source!=='WORK24_GENERAL').concat(smeRows);renderSme()}catch(e){$('smeList').innerHTML='<div class="warn"><b>고용24 중소기업 검색 실패</b><br>'+esc(e.message)+'</div>'}finally{smeBusy=false}
    }
    function renderSme(){const el=$('smeList');$('smeCount').textContent=smeRows.length+'건'+(smeExcluded?' · 기업규모 미확인/중견 이상 '+smeExcluded+'건 제외':'');el.innerHTML=smeRows.length?smeRows.map(j=>jobItem(j,'sme')).join(''):'<div class="catEmpty">검색된 민간 중소기업 공고가 없습니다.</div>';bindAnalyze(el)}
    function bindAnalyze(root){root.querySelectorAll('.catAnalyze').forEach(b=>b.onclick=()=>switchToCheck(b.dataset.k))}

    const tabs=document.querySelector('.tabs'),corpTab=document.querySelector('.tab[data-t="corp"]');
    const publicTab=addTab('public','🏛 공공',corpTab);if(corpTab){corpTab.textContent='🏢 민간 중견·대기업';corpTab.addEventListener('click',()=>loadMidOpen())}const smeTab=addTab('sme','🏭 민간 중소',null);

    const corpPanel=$('corp');
    if(corpPanel){const first=corpPanel.querySelector('.card');if(first){const h=first.querySelector('h2');if(h)h.textContent='🏢 민간 중견·대기업';const box=first.querySelector('.box');if(box)box.innerHTML='<b>기본 민간기업 범위: 중견·대기업·외국계</b><br>기업DB와 고용24 공채속보를 함께 보여줍니다. 사람인 API 승인 후 같은 범위로 추가합니다.';if(!$('midQ')){const head=document.createElement('div');head.className='catHead';head.innerHTML='<div><label>기업 / 공고 검색</label><input id="midQ" placeholder="예: 생산, 전기, 현대"></div><button class="btn" id="midSearchBtn">공채속보 검색</button>';box.after(head);const oh=document.createElement('h3');oh.textContent='고용24 공채속보 · 중견/대기업/외국계';head.after(oh);const count=document.createElement('div');count.id='midOpenCount';count.className='catCount';count.textContent='0건';oh.after(count);const list=document.createElement('div');list.id='midOpenList';count.after(list);const ch=document.createElement('h3');ch.style.marginTop='18px';ch.textContent='기업DB · 공식 채용공고';list.after(ch)}}}

    if(!$('public')){const sec=document.createElement('section');sec.id='public';sec.className='panel';sec.innerHTML='<div class="card"><h2>🏛 공공</h2><div class="box"><b>ALIO + 클린아이</b><br>공기업·공공기관·지방공공기관 채용을 한곳에서 확인합니다.</div><div class="catHead"><div><label>지역</label><select id="publicSido"></select></div><div><label>기관 / 공고 / 직무 검색</label><input id="publicQ" placeholder="예: 울산, 전기, 한국석유공사"></div></div><div id="publicCount" class="catCount">0건</div><div id="publicList"></div></div>';document.querySelector('.wrap').insertBefore(sec,corpPanel)}
    if(!$('sme')){const sec=document.createElement('section');sec.id='sme';sec.className='panel';sec.innerHTML='<div class="card"><h2>🏭 민간 중소</h2><div class="warn"><b>확장검색 영역</b><br>고용24 일반채용 상세정보에서 <b>기업규모가 중소기업으로 확인된 공고만</b> 표시합니다. 중견·대기업/공공 결과와는 분리합니다.</div><div class="catHead"><div><label>지역</label><select id="smeSido"></select></div><div><label>직무 / 공고 검색</label><input id="smeQ" placeholder="예: 전기, 생산, 품질"></div><button class="btn" id="smeSearchBtn">중소기업 검색</button></div><div id="smeCount" class="catCount">0건</div><div id="smeList"><div class="catEmpty">직무 검색어를 입력하면 고용24 중소기업 공고를 불러옵니다.</div></div></div>';document.querySelector('.wrap').appendChild(sec)}

    regionOptions('publicSido');regionOptions('smeSido');
    $('publicSido')?.addEventListener('change',renderPublic);$('publicQ')?.addEventListener('input',renderPublic);$('midSearchBtn')?.addEventListener('click',()=>{midLoaded=false;loadMidOpen(true)});$('midQ')?.addEventListener('keydown',e=>{if(e.key==='Enter'){midLoaded=false;loadMidOpen(true)}});$('smeSearchBtn')?.addEventListener('click',searchSme);$('smeQ')?.addEventListener('keydown',e=>{if(e.key==='Enter')searchSme()});

    const sf=$('sourceFilter');if(sf&&!Array.from(sf.options).some(o=>o.value==='CORPORATE')){const opt=document.createElement('option');opt.value='CORPORATE';opt.textContent='기업DB (중견·대기업)';const w=Array.from(sf.options).find(o=>o.value==='WORK24_OPEN');sf.insertBefore(opt,w||null)}

    const previousRender=render;
    render=function(){syncCorporate();previousRender();renderPublic();renderCorporateDb();if(midLoaded)renderMidOpen()};
    syncCorporate();renderPublic();renderCorporateDb();
    const sub=document.querySelector('header .sub');if(sub)sub.textContent='공공 · 민간 중견/대기업 · 민간 중소 분리 · 직무별 자격분석 · 맞춤공고 추천 · GPT 지원전략';
  }

  const inject=()=>{
    const d=frame.contentDocument;if(!d||!d.body||d.getElementById('categoryTabsPatchScript'))return;
    const s=d.createElement('script');s.id='categoryTabsPatchScript';s.textContent='('+categoryPatch.toString()+')();';d.body.appendChild(s)
  };
  frame.addEventListener('load',()=>setTimeout(inject,0));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,0);
})();
