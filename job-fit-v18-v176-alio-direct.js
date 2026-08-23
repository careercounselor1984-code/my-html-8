(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    if(document.getElementById('v176AlioDirectReady'))return;
    const m=document.createElement('meta');m.id='v176AlioDirectReady';document.head.appendChild(m);
    const plain=v=>String(v??'').replace(/&#xd;/gi,'\n').replace(/<[^>]+>/g,' ').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
    const lines=v=>plain(v).split(/\n+/).map(x=>x.trim()).filter(Boolean);
    const shortRegion=v=>plain(v).replace(/^\(?\d{5}\)?\s*/,'').replace(/울산광역시/g,'울산').replace(/서울특별시/g,'서울').replace(/부산광역시/g,'부산').replace(/대구광역시/g,'대구').replace(/인천광역시/g,'인천').replace(/광주광역시/g,'광주').replace(/대전광역시/g,'대전').replace(/세종특별자치시/g,'세종').replace(/강원특별자치도/g,'강원').replace(/전북특별자치도/g,'전북').replace(/제주특별자치도/g,'제주').replace(/\s{2,}/g,' ').trim();
    function afterLabel(text,labels){for(const l of lines(text)){for(const key of labels){const m=l.match(new RegExp('(?:^|[○●■□▶◆-])\\s*'+key+'\\s*[:：]\\s*(.+)$','i'));if(m&&m[1])return m[1].trim()}}return''}
    function txt(j){return j.screening_method||j.raw?.scrnprcdrMthdExpln||''}
    function duties(j){const ls=lines(txt(j));let st=-1;for(let i=0;i<ls.length;i++){if(/수행\s*업무|담당\s*업무/.test(ls[i])){st=i+1;break}}const out=[];if(st>=0){for(let i=st;i<ls.length;i++){let x=ls[i];if(/^[○●■□▶◆]?\s*(근무기간|근무시간|보수|급여|근\s*무\s*지|근무지|전형|접수|제출|기타|채용조건)/.test(x))break;x=x.replace(/^[\-–—•○●]+\s*/,'').trim();if(!x)continue;x=x.replace(/\s*:\s*/,' - ').replace(/\s{2,}/g,' ').trim();if(x&&!out.includes(x))out.push(x);if(out.length>=3)break}}if(!out.length){const n=Array.isArray(j.ncs_names)?j.ncs_names.filter(Boolean):[];return n.length?n.slice(0,3).join(' · '):'공고문 확인'}let s=out.join(' • ');return s.length>260?s.slice(0,257)+'...':s}
    function address(j){let a=afterLabel(txt(j),['근\\s*무\\s*지','근무장소']);if(!a)a=(j.work_regions||j.regions||[]).join(', ');return shortRegion(a)||'공고문 확인'}
    function employment(j){const d=afterLabel(txt(j),['채용신분','채용형태','고용형태']),types=Array.isArray(j.hire_types)?j.hire_types.filter(Boolean):[];if(d&&types.length&&!d.includes(types[0]))return d+'('+types[0]+')';return d||types.join(', ')||j.employment_type||'공고문 확인'}
    function pay(j){let p=afterLabel(txt(j),['보\\s*수','급여수준','급여','임금']);if(!p)return j.salary||'공고문 확인';return p.replace(/내부기준에\s*의거\s*산정/,'내부기준 산정').replace(/주휴수당\s*별도\s*지급/,'주휴수당 별도').replace(/,?\s*(?:사대보험|4대보험).*$/,'').trim()||'공고문 확인'}
    function work(j){let w=afterLabel(txt(j),['근무시간']);if(!w){const m=plain(txt(j)).match(/주\s*\d+\s*일[^\n,]*(?:,\s*)?(?:1일\s*\d+\s*시간[^\n,]*)?/);if(m)w=m[0]}return plain(w).replace(/을\s*원칙으로.*$/,'').replace(/하되.*$/,'').replace(/사업소\s*사정.*$/,'').trim()||'공고문 확인'}
    function edu(v){const s=plain(v);return /^(학력무관|관계없음)$/.test(s)?'무관':(s||'공고문 확인')}
    function link(j){const n=j.alio_sn||j.raw?.recrutPblntSn;return n?'https://job.alio.go.kr/recruitview.do?idx='+encodeURIComponent(n):(j.source_url||'공고문 확인')}
    function build(j){return [plain(j.title)||'공고명 확인','업체: '+(plain(j.company)||'기관 확인'),'주소: '+address(j),'업무: '+duties(j),'경력: '+(plain(j.recruit_type)||'공고문 확인')+' / 학력: '+edu(j.education_raw),'고용형태: '+employment(j),'급여: '+pay(j),'근무: '+work(j),'링크: '+link(j)].join('\n')}
    function enhance(item){
      if(!item)return;
      let list=[];try{if(typeof jobs!=='undefined'&&Array.isArray(jobs))list=jobs}catch{}
      const j=list.find(x=>x.job_key===item.dataset.k);
      if(!j||j.source!=='ALIO')return;
      const ta=item.querySelector('.v174Compact textarea,.v170Compact textarea,.v166Copy textarea');
      if(ta&&ta.dataset.userEdited!=='1')ta.value=build(j);
    }
    document.querySelectorAll('.v166Item').forEach(enhance);
    window.addEventListener('click',e=>{
      const item=e.target.closest?.('.v166Item');if(!item)return;
      if(e.target.closest('.v166Summary')){setTimeout(()=>enhance(item),20);setTimeout(()=>enhance(item),180);setTimeout(()=>enhance(item),700)}
    },true);
    const mo=new MutationObserver(ms=>{for(const m of ms){for(const n of m.addedNodes||[]){if(n?.nodeType!==1)continue;if(n.matches?.('.v166Item'))enhance(n);n.querySelectorAll?.('.v166Item').forEach(enhance)}}});
    mo.observe(document.body,{childList:true,subtree:true});
  }
  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,100);return}if(d.getElementById('v176AlioDirectScript'))return;const s=d.createElement('script');s.id='v176AlioDirectScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,520));if(frame.contentDocument?.readyState==='complete')setTimeout(inject,520);
})();
