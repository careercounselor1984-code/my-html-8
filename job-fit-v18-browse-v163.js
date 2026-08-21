(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function browsePatch(){
    if(!document.getElementById('listUxPatchReady')){setTimeout(browsePatch,80);return}
    if(document.getElementById('browsePatchV163Ready'))return;
    const ready=document.createElement('meta');ready.id='browsePatchV163Ready';document.head.appendChild(ready);

    const BROWSER_API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/job-fit-work24-browser';
    const OPEN_API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-open-recruit';
    const LIST_TTL=20*60*1000,DETAIL_TTL=6*60*60*1000;
    const WORKER_FILTER='W5|W9|W10|W30|W50';
    const REGION_CODE={'전국':'','서울특별시':'11000','부산광역시':'26000','대구광역시':'27000','인천광역시':'28000','광주광역시':'29000','대전광역시':'30000','울산광역시':'31000','세종특별자치시':'36110','경기도':'41000','강원특별자치도':'42000','충청북도':'43000','충청남도':'44000','전북특별자치도':'45000','전라남도':'46000','경상북도':'47000','경상남도':'48000','제주특별자치도':'50000'};
    const REGION_HINTS={
      '서울특별시':['서울'],'부산광역시':['부산','기장'],'대구광역시':['대구'],'인천광역시':['인천'],'광주광역시':['광주'],'대전광역시':['대전'],'울산광역시':['울산','울주'],'세종특별자치시':['세종'],
      '경기도':['경기','수원','성남','의정부','안양','부천','광명','평택','동두천','안산','고양','과천','구리','남양주','오산','시흥','군포','의왕','하남','용인','파주','이천','안성','김포','화성','광주','양주','포천','여주','연천','가평','양평'],
      '강원특별자치도':['강원','춘천','원주','강릉','동해','태백','속초','삼척','홍천','횡성','영월','평창','정선','철원','화천','양구','인제','고성','양양'],
      '충청북도':['충북','청주','충주','제천','보은','옥천','영동','증평','진천','괴산','음성','단양'],'충청남도':['충남','천안','공주','보령','아산','서산','논산','계룡','당진','금산','부여','서천','청양','홍성','예산','태안'],
      '전북특별자치도':['전북','전주','군산','익산','정읍','남원','김제','완주','진안','무주','장수','임실','순창','고창','부안'],'전라남도':['전남','목포','여수','순천','나주','광양','담양','곡성','구례','고흥','보성','화순','장흥','강진','해남','영암','무안','함평','영광','장성','완도','진도','신안'],
      '경상북도':['경북','포항','경주','김천','안동','구미','영주','영천','상주','문경','경산','의성','청송','영양','영덕','청도','고령','성주','칠곡','예천','봉화','울진','울릉'],'경상남도':['경남','창원','진주','통영','사천','김해','밀양','거제','양산','의령','함안','창녕','고성','남해','하동','산청','함양','거창','합천'],'제주특별자치도':['제주','서귀포']
    };
    let smeBusy=false,midBusy=false,modalPlaceholder=null,modalCheckWasOn=false;

    const style=document.createElement('style');
    style.textContent=`
      .uxApiNote{font-size:11px;color:#667085;margin:5px 0 9px;line-height:1.55}.uxLoading{padding:11px 12px;border-radius:9px;background:#eff8ff;color:#175cd3;font-size:12px}.uxDetailInfo{margin:9px 0;padding:10px;border-radius:9px;background:#f8fafc;border:1px solid #e4e7ec;font-size:12px;line-height:1.65}.uxDetailInfo b{color:#344054}.uxCandidate{font-size:10px;color:#b54708;margin-left:5px}.uxModal{position:fixed;inset:0;z-index:99999;background:rgba(16,24,40,.56);display:none;padding:18px}.uxModal.open{display:flex;align-items:flex-start;justify-content:center}.uxModalBox{width:min(1180px,100%);max-height:calc(100vh - 36px);overflow:auto;background:#f5f7fb;border-radius:16px;box-shadow:0 22px 60px rgba(16,24,40,.28)}.uxModalTop{position:sticky;top:0;z-index:4;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 16px;background:#fff;border-bottom:1px solid #e4e7ec}.uxModalTop strong{font-size:15px}.uxModalClose{border:1px solid #d0d5dd;background:#fff;border-radius:8px;padding:7px 10px;font-weight:850;cursor:pointer}.uxModalBody{padding:0 14px 20px}.uxModalBody #check{display:block!important}.uxModalBody #check>.grid2{margin-top:14px}@media(max-width:700px){.uxModal{padding:0}.uxModalBox{max-height:100vh;border-radius:0}.uxModalTop{padding:10px 12px}.uxModalBody{padding:0 8px 14px}}`;
    document.head.appendChild(style);

    function esc(v){return E(v)}
    async function post(url,body){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),t=await r.text();let d;try{d=JSON.parse(t)}catch{throw Error('서버 응답 해석 실패')}if(!r.ok||!d.ok)throw Error(d.error||('HTTP '+r.status));return d}
    function cacheGet(k,ttl){try{const x=JSON.parse(localStorage.getItem(k)||'null');if(x&&Date.now()-x.at<ttl)return x.data}catch{}return null}
    function cacheSet(k,data){try{localStorage.setItem(k,JSON.stringify({at:Date.now(),data}))}catch{}}
    function mergeJob(j){const i=jobs.findIndex(x=>x.job_key===j.job_key);if(i>=0)jobs[i]={...jobs[i],...j};else jobs=jobs.concat(j);return jobs.find(x=>x.job_key===j.job_key)}
    function touchHidden(id,msg=''){const el=$(id);if(el)el.innerHTML='<span style="display:none">'+esc(msg||Date.now())+'</span>'}
    function listKey(type,sido,q){return 'jobfit_v163_'+type+'_'+(sido||'전국')+'_'+(q||'')}
    function detailKey(no){return 'jobfit_v163_detail_'+no}
    function parseOpenRegion(title){const nt=N(title||'');for(const [region,terms] of Object.entries(REGION_HINTS))if(terms.some(x=>x.length>=2&&nt.includes(N(x))))return region;return''}
    function normalizeOpen(x){const r=parseOpenRegion(x.title);return{...x,source:'WORK24_OPEN',job_key:'W24OPEN:'+(x.empSeqno||x.url||Math.random()),company:x.company||'',title:x.title||'',company_class:x.companyClass||'',regions:r?[r]:[],region_name:r||'공식 채용사이트 확인 필요',workplace:'',employment_type:x.employmentType||'',education_raw:'',qualification:'',preference:'',ncs_names:[],recruit_field:'',job_detail:'',certifications:'',salary:'',end_date:x.endDate||'',source_url:x.url||'',first_seen_at:'',open:true,w24_open:true,w24_matched_keywords:[],w24_source_notice:x.sourceNotice||'본 자료는 고용노동부 고용24 공채속보에서 제공된 정보입니다.'}}
    function normalizeList(x){return{...x,source:'WORK24_GENERAL',job_key:x.job_key||('W24GEN:'+x.wantedAuthNo),company:x.company||'',title:x.title||'',regions:[x.region||x.address].filter(Boolean),region_name:x.region||'',workplace:x.address||x.region||'',employment_type:x.employmentType||'',education_raw:x.education||'',qualification:'',preference:'',ncs_names:[],recruit_field:'',job_detail:'',certifications:'',salary:x.pay||'',end_date:x.closeDate||'',source_url:x.url||'',first_seen_at:x.registeredDate||'',open:true,w24_career:x.career||'',w24_major:'',w24_detail_loaded:false,detailLoaded:false,companySize:'중소기업 후보',companySizeCandidate:true,w24_source_notice:'본 자료는 고용노동부 고용24에서 제공된 채용정보입니다.'}}
    function applyDetail(base,d){const size=d.companySize||base.companySize||'중소기업 후보';return{...base,...d,source:'WORK24_GENERAL',job_key:base.job_key,company:d.company||base.company,title:d.title||base.title,regions:[d.region||base.region_name||base.workplace].filter(Boolean),region_name:d.region||base.region_name||'',workplace:d.region||base.workplace||'',employment_type:d.employmentType||base.employment_type||'',education_raw:d.education||base.education_raw||'',qualification:[d.education?'학력: '+d.education:'',d.career?'경력: '+d.career:'',d.major?'전공: '+d.major:'',d.certificate?'자격면허: '+d.certificate:''].filter(Boolean).join('\n'),preference:d.preference||base.preference||'',ncs_names:String(d.relatedJobs||'').split(/[,/|]/).map(x=>x.trim()).filter(Boolean),recruit_field:d.jobsNm||base.recruit_field||'',job_detail:d.jobContent||base.job_detail||'',certifications:d.certificate||base.certifications||'',salary:base.salary||'',end_date:d.closeDate||base.end_date||'',source_url:d.url||base.source_url||'',w24_career:d.career||base.w24_career||'',w24_major:d.major||'',w24_detail_loaded:true,detailLoaded:true,companySize:size,companySizeCandidate:!d.companySize,companyAddress:d.companyAddress||base.companyAddress||''}}

    async function hydrateJob(key,item){
      let j=jobs.find(x=>x.job_key===key);if(!j||j.source!=='WORK24_GENERAL'||j.w24_detail_loaded)return j;
      const no=j.wantedAuthNo||String(key).replace(/^W24GEN:/,'');if(!no)return j;
      if(item){let info=item.querySelector('.uxDetailInfo');if(!info){info=document.createElement('div');info.className='uxDetailInfo';item.querySelector('.uxDetail')?.prepend(info)}info.innerHTML='고용24 상세정보를 확인하는 중입니다.'}
      try{let data=cacheGet(detailKey(no),DETAIL_TTL);if(!data){data=await post(BROWSER_API,{action:'detail',wantedAuthNo:no});cacheSet(detailKey(no),data)}j=mergeJob(applyDetail(j,data.job||{}));if(item)refreshItemDetail(item,j);return j}catch(e){if(item){const info=item.querySelector('.uxDetailInfo');if(info)info.innerHTML='<span style="color:#b42318">상세정보를 불러오지 못했습니다. 공식 공고에서 확인해 주세요.</span>'}return j}
    }
    function requirementLine(j){const a=[];if(j.education_raw)a.push('학력 '+j.education_raw);if(j.w24_career)a.push('경력 '+j.w24_career);if(j.certifications)a.push('자격 '+j.certifications);return a.slice(0,3).join(' / ')||'공식 공고문 확인'}
    function copyDetailed(j){let rs=[];try{rs=roles(j)||[]}catch{}const ro=rs.length===1?rs[0]:(j.recruit_field||'');const lines=['[채용정보 안내]','○ 기업: '+(j.company||'확인 필요'),'○ 공고: '+(j.title||'확인 필요'),ro?'○ 직무: '+ro:'','○ 근무지역: '+((j.regions||[]).join(', ')||j.region_name||j.workplace||'확인 필요'),j.employment_type?'○ 고용형태: '+j.employment_type:'',j.salary?'○ 급여: '+j.salary:'',j.end_date?'○ 마감일: '+j.end_date:'','○ 핵심 자격: '+requirementLine(j),j.preference?'○ 우대조건: '+j.preference:'',j.job_detail?'○ 주요업무: '+String(j.job_detail).replace(/<[^>]+>/g,' ').replace(/&#xd;|\\n/g,' ').replace(/\s+/g,' ').trim().slice(0,220):'','','공고 확인: '+(j.source_url||'공식 채용페이지 확인 필요'),'※ 세부 자격요건·접수방법은 공식 공고문을 꼭 확인해주세요.'];return lines.filter(Boolean).join('\n')}
    function refreshItemDetail(item,j){if(!item)return;let info=item.querySelector('.uxDetailInfo');if(!info){info=document.createElement('div');info.className='uxDetailInfo';item.querySelector('.uxDetail')?.prepend(info)}const size=j.companySizeCandidate?'중소기업 후보 · 상세 기업규모 미표시':(j.companySize||'기업규모 확인 필요');info.innerHTML='<b>기업규모</b> '+esc(size)+'<br><b>모집직종</b> '+esc(j.recruit_field||'공식 공고 확인')+(j.w24_career?'<br><b>경력</b> '+esc(j.w24_career):'')+(j.education_raw?'<br><b>학력</b> '+esc(j.education_raw):'');const ta=item.querySelector('.uxCopyBox textarea');if(ta)ta.value=copyDetailed(j)}

    async function loadSme(force=false){
      if(smeBusy)return;smeBusy=true;const sido=$('smeSido')?.value||'울산광역시',q=String($('smeQ')?.value||'').trim(),ck=listKey('sme',sido,q),host=$('uxSmeList');if(host)host.innerHTML='<div class="uxLoading">고용24 최신 중소기업 공고 목록을 불러오는 중입니다.</div>';
      try{let data=!force?cacheGet(ck,LIST_TTL):null;if(!data){data=await post(BROWSER_API,{action:'list',regionCode:REGION_CODE[sido]||'',keyword:q,display:60,workerCnt:WORKER_FILTER});cacheSet(ck,data)}const oldKeys=new Set((data.jobs||[]).map(x=>'W24GEN:'+x.wantedAuthNo));jobs=jobs.filter(j=>j.source!=='WORK24_GENERAL'||!j.companySizeCandidate||oldKeys.has(j.job_key));for(const x of data.jobs||[])mergeJob(normalizeList(x));touchHidden('smeList','v163-'+Date.now());const note=$('smeV163Note');if(note)note.textContent=(data.cached?'서버 캐시 사용 · ':'')+'검색어 없이 최신공고 표시 · 목록 20분 캐시 · 상세는 제목을 펼칠 때만 조회';}catch(e){if(host)host.innerHTML='<div class="warn"><b>고용24 최신공고 조회 실패</b><br>'+esc(e.message)+'</div>'}finally{smeBusy=false}
    }
    async function loadMid(force=false){
      if(midBusy)return;midBusy=true;const q=String($('midQ')?.value||'').trim(),ck=listKey('mid','ALL',q),host=$('uxMidList');if(host)host.innerHTML='<div class="uxLoading">중견·대기업 최신 공채속보를 불러오는 중입니다.</div>';
      try{let data=!force?cacheGet(ck,LIST_TTL):null;if(!data){data=await post(OPEN_API,{action:'search_open_recruit',keyword:q,companyTypes:['10','40','50'],limit:60});cacheSet(ck,data)}jobs=jobs.filter(j=>j.source!=='WORK24_OPEN');for(const x of data.jobs||[])mergeJob(normalizeOpen(x));touchHidden('midOpenList','v163-'+Date.now());const note=$('midV163Note');if(note)note.textContent='검색어 없이 최신공고 표시 · 목록 20분 브라우저 캐시 · 지역이 확인되지 않는 공채는 전국에서 확인 가능';}catch(e){if(host)host.innerHTML='<div class="warn"><b>고용24 공채속보 조회 실패</b><br>'+esc(e.message)+'</div>'}finally{midBusy=false}
    }

    function activate(id){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.dataset.t===id));document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('on',x.id===id))}
    function cloneTab(id,handler){const old=document.querySelector('.tab[data-t="'+id+'"]');if(!old)return;const b=old.cloneNode(true);old.replaceWith(b);b.addEventListener('click',()=>{activate(id);handler?.()})}
    function replaceButton(id,handler,label){const old=$(id);if(!old)return;const b=old.cloneNode(true);old.replaceWith(b);if(label)b.textContent=label;b.addEventListener('click',handler)}

    function ensureModal(){if($('uxAnalyzeModal'))return;const m=document.createElement('div');m.id='uxAnalyzeModal';m.className='uxModal';m.innerHTML='<div class="uxModalBox"><div class="uxModalTop"><strong>📋 지원가능성 분석</strong><button class="uxModalClose" type="button">닫기 ✕</button></div><div class="uxModalBody"></div></div>';document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.uxModalClose'))closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open'))closeModal()})}
    function openModalFor(key){ensureModal();const check=$('check'),m=$('uxAnalyzeModal'),body=m.querySelector('.uxModalBody');if(!check)return;choose(key);modalCheckWasOn=check.classList.contains('on');modalPlaceholder=document.createComment('check-modal-placeholder');check.parentNode?.insertBefore(modalPlaceholder,check);body.appendChild(check);check.classList.add('on');m.classList.add('open');document.body.style.overflow='hidden';m.querySelector('.uxModalBox').scrollTop=0}
    function closeModal(){const m=$('uxAnalyzeModal'),check=$('check');if(check&&modalPlaceholder?.parentNode){modalPlaceholder.parentNode.insertBefore(check,modalPlaceholder);modalPlaceholder.remove()}if(check&&!modalCheckWasOn)check.classList.remove('on');modalPlaceholder=null;if(m)m.classList.remove('open');document.body.style.overflow=''}

    function setupUi(){
      const sq=$('smeQ');if(sq){sq.placeholder='검색어 없이 최신공고 표시 · 필요 시 직무/기업 검색';let note=$('smeV163Note');if(!note){note=document.createElement('div');note.id='smeV163Note';note.className='uxApiNote';sq.closest('.catHead')?.after(note)}}
      const mq=$('midQ');if(mq){mq.placeholder='검색어 없이 최신공고 표시 · 필요 시 기업/직무 검색';let note=$('midV163Note');if(!note){note=document.createElement('div');note.id='midV163Note';note.className='uxApiNote';mq.closest('.catHead')?.after(note)}}
      cloneTab('corp',()=>loadMid(false));cloneTab('sme',()=>loadSme(false));
      replaceButton('midSearchBtn',()=>loadMid(true),'새로고침 / 검색');replaceButton('smeSearchBtn',()=>loadSme(true),'새로고침 / 검색');
      $('midQ')?.addEventListener('keydown',e=>{if(e.key==='Enter')loadMid(true)});$('smeQ')?.addEventListener('keydown',e=>{if(e.key==='Enter')loadSme(true)});$('smeSido')?.addEventListener('change',()=>setTimeout(()=>loadSme(false),0));
      document.addEventListener('click',async e=>{
        const analyze=e.target.closest('.uxAnalyze');if(analyze){e.preventDefault();e.stopImmediatePropagation();const item=analyze.closest('.uxItem'),key=item?.dataset.k;if(!key)return;let j=jobs.find(x=>x.job_key===key);if(j?.source==='WORK24_GENERAL')j=await hydrateJob(key,item);openModalFor(key);return}
        const sum=e.target.closest('.uxSummary');if(sum){const item=sum.closest('.uxItem'),key=item?.dataset.k,j=jobs.find(x=>x.job_key===key);if(j?.source==='WORK24_GENERAL'&&!j.w24_detail_loaded)setTimeout(()=>hydrateJob(key,item),20)}
      },true);
      ensureModal();
      setTimeout(()=>{const active=document.querySelector('.tab[data-t="sme"].on');if(active)loadSme(false)},150)
    }
    setupUi()
  }

  const inject=()=>{const d=frame.contentDocument;if(!d||!d.body||d.getElementById('browsePatchV163Script'))return;const s=d.createElement('script');s.id='browsePatchV163Script';s.textContent='('+browsePatch.toString()+')();';d.body.appendChild(s)};
  frame.addEventListener('load',()=>setTimeout(inject,160));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,160)
})();
