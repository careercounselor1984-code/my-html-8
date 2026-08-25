(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    if(document.getElementById('v180AnalysisButtonsReady'))return;
    const marker=document.createElement('meta');marker.id='v180AnalysisButtonsReady';document.head.appendChild(marker);
    const style=document.createElement('style');
    style.textContent=`.v180AnalysisTools{display:flex;gap:6px;flex-wrap:wrap;width:100%;margin-top:3px;padding-top:8px;border-top:1px dashed #d8dee8}.v180AnalysisLabel{display:flex;align-items:center;color:#667085;font-size:10.5px;font-weight:850;margin-right:2px}.v180AnalysisBtn{border:1px solid #b9c8df;background:#fff;color:#2457d6;border-radius:8px;padding:7px 9px;font-size:11px;font-weight:850;cursor:pointer}.v180AnalysisBtn:hover{background:#edf4ff;border-color:#8facdc}.v180CommuteBtn{color:#067647;border-color:#a6d9c0}.v180CommuteBtn:hover{background:#ecfdf3;border-color:#75c79e}@media(max-width:650px){.v180AnalysisBtn{flex:1;min-width:92px}.v180AnalysisLabel{width:100%}}`;
    document.head.appendChild(style);
    function list(){try{return typeof jobs!=='undefined'&&Array.isArray(jobs)?jobs:[]}catch{return[]}}
    function jobFor(item){return list().find(x=>String(x.job_key||'')===String(item?.dataset?.k||''))||null}
    function text(v){return String(v??'').replace(/<[^>]+>/g,' ').replace(/&#xd;/gi,' ').replace(/\s+/g,' ').trim()}
    function region(j){return text(j.region_name||j.workplace||j.region||j.companyAddress||(j.regions||j.work_regions||[]).join(', '))}
    function commuteDestination(j){return text(j.companyAddress||j.company_address||j.workplaceAddress||j.workplace_address||j.workplace||j.region_name||j.region||(j.regions||j.work_regions||[]).join(', '))}
    function alioDuty(j){const raw=String(j.screening_method||j.raw?.scrnprcdrMthdExpln||'').replace(/&#xd;/gi,'\n').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,' ');const m=raw.match(/(?:수행\s*업무|담당\s*업무)\s*[:：]?\s*([\s\S]{1,700})/i);if(!m)return'';return text(m[1].split(/\n\s*(?:근무기간|근무시간|보수|급여|근\s*무\s*지|근무지|전형|접수|제출|기타|채용조건)/i)[0]).slice(0,420)}
    function roleText(j){return text(j.job_detail||j.jobContent||j.description||j.recruit_field||j.jobsNm||alioDuty(j)||(j.roles||[]).join(' ')||(j.ncs_names||[]).join(' ')||j.title).slice(0,420)}
    function publicJob(j){const cls=text(j.companyClass||j.company_class);return ['ALIO','CLEANEYE'].includes(j.source)||/공기업|공공기관|지방공기업|지방출자|지방출연/.test(cls)}
    function corporateJob(j){const cls=text(j.companyClass||j.company_class);return ['CORPORATE','WORK24_OPEN'].includes(j.source)||/대기업|중견기업|외국계/.test(cls)}
    function commonParams(j){return {source:text(j.source),jobKey:text(j.job_key),company:text(j.company||j.organization),title:text(j.title),region:region(j),companyClass:text(j.companyClass||j.company_class),url:text(j.source_url||j.official_url||j.url)}}
    function analysisUrl(j,mode){const p=new URLSearchParams({...commonParams(j),mode,jobCont:roleText(j)});return 'job-fit-analysis.html?'+p.toString()}
    function commuteUrl(j){const p=new URLSearchParams({...commonParams(j),destination:commuteDestination(j)});return 'job-fit-commute.html?'+p.toString()}
    function decorate(item){if(!item||item.querySelector('.v180AnalysisTools'))return;const j=jobFor(item);if(!j)return;const pub=publicJob(j),corp=corporateJob(j);const actions=item.querySelector('.v166Actions');if(!actions)return;const box=document.createElement('div');box.className='v180AnalysisTools';const buttons=pub?[['institution','기관분석'],['role','직무분석'],['ncs','NCS 보기']]:corp?[['company','기업분석'],['role','직무분석']]:[];box.innerHTML='<span class="v180AnalysisLabel">추가분석</span>'+buttons.map(([m,l])=>`<button type="button" class="v180AnalysisBtn" data-analysis-mode="${m}">${l} ↗</button>`).join('')+`<button type="button" class="v180AnalysisBtn v180CommuteBtn" data-commute="1">통근시간 ↗</button>`;actions.appendChild(box)}
    document.querySelectorAll('.v166Item').forEach(decorate);
    document.addEventListener('click',e=>{const c=e.target.closest?.('.v180CommuteBtn');if(c){e.preventDefault();e.stopPropagation();const item=c.closest('.v166Item'),j=jobFor(item);if(j)window.open(commuteUrl(j),'_blank','noopener');return}const b=e.target.closest?.('.v180AnalysisBtn[data-analysis-mode]');if(b){e.preventDefault();e.stopPropagation();const item=b.closest('.v166Item'),j=jobFor(item);if(j)window.open(analysisUrl(j,b.dataset.analysisMode||'role'),'_blank','noopener');return}const s=e.target.closest?.('.v166Summary');if(s){const item=s.closest('.v166Item');setTimeout(()=>decorate(item),40);setTimeout(()=>decorate(item),300)}},true);
    const mo=new MutationObserver(ms=>{for(const rec of ms)for(const n of rec.addedNodes||[]){if(n?.nodeType!==1)continue;if(n.matches?.('.v166Item'))decorate(n);n.querySelectorAll?.('.v166Item').forEach(decorate)}});mo.observe(document.body,{childList:true,subtree:true});
  }
  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,120);return}if(d.getElementById('v180AnalysisButtonsScript'))return;const s=d.createElement('script');s.id='v180AnalysisButtonsScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,1080));if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1080);
})();
