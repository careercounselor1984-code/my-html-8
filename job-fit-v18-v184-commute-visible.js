(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(document.getElementById('v184CommuteVisibleReady'))return;
    const marker=document.createElement('meta');marker.id='v184CommuteVisibleReady';document.head.appendChild(marker);

    const style=document.createElement('style');
    style.textContent=`
      .v184CommuteDirect{background:#fff!important;color:#067647!important;border:1px solid #86cda8!important}
      .v184CommuteDirect:hover{background:#ecfdf3!important;border-color:#5eb989!important}
    `;
    document.head.appendChild(style);

    const plain=v=>String(v??'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    function list(){try{return typeof jobs!=='undefined'&&Array.isArray(jobs)?jobs:[]}catch{return[]}}
    function jobFor(item){return list().find(x=>String(x.job_key||'')===String(item?.dataset?.k||''))||null}
    function compactLine(item,label){
      const raw=item?.querySelector('.v174Compact textarea')?.value||'';
      const line=raw.split(/\r?\n/).find(x=>x.trim().startsWith(label+':'));
      return line?line.slice(line.indexOf(':')+1).trim():'';
    }
    function destination(j,item){
      return compactLine(item,'주소')||plain(j?.workplaceAddress||j?.workplace_address||j?.workplace||j?.region_name||j?.region||j?.companyAddress||j?.company_address||(j?.regions||j?.work_regions||[]).join(', '));
    }
    function commuteUrl(j,item){
      const p=new URLSearchParams({
        source:plain(j?.source),
        jobKey:plain(j?.job_key),
        company:compactLine(item,'업체')||plain(j?.company||j?.organization),
        title:plain(j?.title)||plain(item?.querySelector('.v166Summary strong')?.textContent),
        region:plain(j?.region_name||j?.region||(j?.regions||j?.work_regions||[]).join(', ')),
        companyClass:plain(j?.companyClass||j?.company_class),
        url:plain(j?.source_url||j?.official_url||j?.url),
        destination:destination(j,item)
      });
      return 'job-fit-commute.html?'+p.toString();
    }
    function decorate(item){
      if(!item)return;
      const actions=item.querySelector('.v174CompactActions');
      if(!actions||actions.querySelector('.v184CommuteDirect'))return;
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn v184CommuteDirect';
      btn.textContent='🚗 통근시간';
      btn.title='Kakao 자동차·대중교통 통근시간 확인';
      actions.appendChild(btn);
    }
    function scan(root=document){root.querySelectorAll?.('.v166Item').forEach(decorate)}
    scan();
    const mo=new MutationObserver(ms=>{
      for(const rec of ms){
        for(const n of rec.addedNodes||[]){
          if(n?.nodeType!==1)continue;
          if(n.matches?.('.v166Item'))decorate(n);
          n.querySelectorAll?.('.v166Item').forEach(decorate);
          const item=n.closest?.('.v166Item');if(item)decorate(item);
        }
      }
    });
    mo.observe(document.body,{childList:true,subtree:true});

    document.addEventListener('click',e=>{
      const btn=e.target.closest?.('.v184CommuteDirect');
      if(!btn)return;
      e.preventDefault();e.stopPropagation();
      const item=btn.closest('.v166Item'),j=jobFor(item);
      if(!item)return;
      const url=commuteUrl(j||{},item);
      window.open(url,'_blank','noopener');
    },true);
  }

  function inject(){
    const d=frame.contentDocument;
    if(!d||!d.body){setTimeout(inject,120);return}
    if(d.getElementById('v184CommuteVisibleScript'))return;
    const s=d.createElement('script');
    s.id='v184CommuteVisibleScript';
    s.textContent='('+patch.toString()+')();';
    d.body.appendChild(s);
  }
  frame.addEventListener('load',()=>setTimeout(inject,1180));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1180);
})();
