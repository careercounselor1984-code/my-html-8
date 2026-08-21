(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    if(document.getElementById('v173PublicCopyReady'))return;
    const ready=document.createElement('meta');ready.id='v173PublicCopyReady';document.head.appendChild(ready);
    const plain=v=>String(v??'').replace(/&#xd;/gi,'\n').replace(/<[^>]+>/g,' ').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
    const shortRegion=v=>plain(v).replace(/^\(?\d{5}\)?\s*/,'').replace(/울산광역시/g,'울산').replace(/서울특별시/g,'서울').replace(/부산광역시/g,'부산').replace(/대구광역시/g,'대구').replace(/인천광역시/g,'인천').replace(/광주광역시/g,'광주').replace(/대전광역시/g,'대전').replace(/세종특별자치시/g,'세종').replace(/강원특별자치도/g,'강원').replace(/전북특별자치도/g,'전북').replace(/제주특별자치도/g,'제주').replace(/\s{2,}/g,' ').trim();
    const lines=v=>plain(v).split(/\n+/).map(x=>x.trim()).filter(Boolean);
    function afterLabel(text,labels){for(const l of lines(text)){for(const key of labels){const re=new RegExp('(?:^|[○●■□▶◆-])\\s*'+key+'\\s*[:：]\\s*(.+)$','i');const m=l.match(re);if(m&&m[1])return m[1].trim()}}return''}
    function alioDuties(j){const ls=lines(j.screening_method||j.raw?.scrnprcdrMthdExpln||'');let st=-1;for(let i=0;i<ls.length;i++){if(/수행\s*업무|담당\s*업무/.test(ls[i])){st=i+1;break}}const out=[];if(st>=0){for(let i=st;i<ls.length;i++){let x=ls[i];if(/^[○●■□▶◆]\s*(근무기간|근무시간|보수|급여|근\s*무\s*지|근무지|전형|접수|제출|기타|채용조건)/.test(x))break;x=x.replace(/^[\-–—•○●]+\s*/,'').trim();if(!x)continue;if(/^(근무기간|근무시간|보수|급여|근무지|전형|접수|문의)/.test(x))break;x=x.replace(/\s*:\s*/,' - ').replace(/\s{2,}/g,' ').trim();if(x&&!out.includes(x))out.push(x);if(out.length>=3)break}}if(!out.length){const n=Array.isArray(j.ncs_names)?j.ncs_names.filter(Boolean):[];if(n.length)return n.slice(0,3).join(' · ')}let s=out.join(' • ');if(s.length>260)s=s.slice(0,257)+'...';return s||'공고문 확인'}
    function alioAddress(j){const t=j.screening_method||j.raw?.scrnprcdrMthdExpln||'';let a=afterLabel(t,['근\\s*무\\s*지','근무장소']);if(!a)a=(j.work_regions||j.regions||[]).join(', ')||'';a=shortRegion(a);return a||'공고문 확인'}
    function alioEmployment(j){const t=j.screening_method||j.raw?.scrnprcdrMthdExpln||'';const detail=afterLabel(t,['채용신분','채용형태','고용형태']);const types=Array.isArray(j.hire_types)?j.hire_types.filter(Boolean):[];if(detail&&types.length&&!detail.includes(types[0]))return detail+'('+types[0]+')';return detail||types.join(', ')||j.employment_type||'공고문 확인'}
    function alioPay(j){const t=j.screening_method||j.raw?.scrnprcdrMthdExpln||'';let p=afterLabel(t,['보\\s*수','급여수준','급여','임금']);if(!p)return j.salary||'공고문 확인';p=p.replace(/내부기준에\s*의거\s*산정/,'내부기준 산정').replace(/,?\s*사대보험.*$/,'').replace(/,?\s*4대보험.*$/,'').replace(/,?\s*건설근로자퇴직공제.*$/,'').trim();p=p.replace(/주휴수당\s*별도\s*지급/,'주휴수당 별도');return p||'공고문 확인'}
    function alioWork(j){const t=j.screening_method||j.raw?.scrnprcdrMthdExpln||'';let w=afterLabel(t,['근무시간']);if(!w){const m=plain(t).match(/주\s*\d+\s*일[^\n,]*(?:,\s*)?(?:1일\s*\d+\s*시간[^\n,]*)?/);if(m)w=m[0]}w=plain(w).replace(/을\s*원칙으로.*$/,'').replace(/하되.*$/,'').replace(/사업소\s*사정.*$/,'').replace(/\s{2,}/g,' ').trim();return w||'공고문 확인'}
    function alioLink(j){const n=j.alio_sn||j.raw?.recrutPblntSn;return n?'https://job.alio.go.kr/recruitview.do?idx='+encodeURIComponent(n):(j.source_url||'')}
    function cleanCareer(v){const s=plain(v);return s==='학력무관'||s==='관계없음'?'무관':(s||'공고문 확인')}
    function buildAlio(j){return[plain(j.title)||'공고명 확인','업체: '+(plain(j.company)||'기관 확인'),'주소: '+alioAddress(j),'업무: '+alioDuties(j),'경력: '+(plain(j.recruit_type)||'공고문 확인')+' / 학력: '+cleanCareer(j.education_raw),'고용형태: '+alioEmployment(j),'급여: '+alioPay(j),'근무: '+alioWork(j),'링크: '+(alioLink(j)||'공고문 확인')].join('\n')}
    function buildClean(j){return[plain(j.title)||'공고명 확인','업체: '+(plain(j.organization||j.company)||'기관 확인'),'주소: '+(shortRegion(j.institution_address||j.workplace||j.region_name)||'공고문 확인'),'업무: '+(plain(j.job_detail||j.recruit_field)||'공고문 확인'),'경력: '+(plain(j.recruit_type)||'공고문 확인')+' / 학력: 공고문 확인','고용형태: '+(plain(j.employment_type)||'공고문 확인'),'급여: '+(plain(j.salary)||'공고문 확인'),'근무: '+(plain(j.work_hours)||'공고문 확인'),'링크: '+(plain(j.source_url)||'공고문 확인')].join('\n')}
    function enhance(item){const ta=item?.querySelector('.v170Compact textarea');if(!ta)return;const j=window.jobs?.find?.(x=>x.job_key===item.dataset.k);if(!j)return;if(j.source==='ALIO')ta.value=buildAlio(j);else if(j.source==='CLEANEYE')ta.value=buildClean(j)}
    function scan(){document.querySelectorAll('.v166Item').forEach(enhance)}
    window.addEventListener('click',e=>{const item=e.target.closest?.('.v166Item');if(!item)return;if(e.target.closest('.v166Summary')){setTimeout(()=>enhance(item),80);setTimeout(()=>enhance(item),500)}},true);
    setTimeout(scan,700);setTimeout(scan,1800);
  }
  const inject=()=>{const d=frame.contentDocument;if(!d||!d.body||d.getElementById('v173PublicCopyScript'))return;const s=d.createElement('script');s.id='v173PublicCopyScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)};
  frame.addEventListener('load',()=>setTimeout(inject,430));if(frame.contentDocument?.readyState==='complete')setTimeout(inject,430);
})();