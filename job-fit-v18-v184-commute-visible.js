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
      .v184Modal{position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:22px}
      .v184Modal[hidden]{display:none!important}.v184ModalBox{width:min(900px,96vw);height:min(760px,92vh);background:#fff;border-radius:16px;box-shadow:0 24px 70px rgba(15,23,42,.3);overflow:hidden;display:flex;flex-direction:column}
      .v184ModalHead{height:48px;flex:0 0 48px;padding:0 13px 0 17px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e4e7ec;background:#fff}.v184ModalTitle{font-size:14px;font-weight:950;color:#172033}.v184ModalClose{border:1px solid #d0d5dd;background:#fff;border-radius:8px;width:34px;height:34px;font-size:19px;cursor:pointer;color:#475467}.v184ModalClose:hover{background:#f2f4f7}.v184ModalFrame{width:100%;height:100%;border:0;display:block;background:#f5f7fb}
      @media(max-width:640px){.v184Modal{padding:0}.v184ModalBox{width:100vw;height:100vh;border-radius:0}}
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
    function ensureModal(){
      let modal=document.getElementById('v184CommuteModal');
      if(modal)return modal;
      modal=document.createElement('div');modal.id='v184CommuteModal';modal.className='v184Modal';modal.hidden=true;
      modal.innerHTML='<div class="v184ModalBox" role="dialog" aria-modal="true" aria-label="통근시간 확인"><div class="v184ModalHead"><div class="v184ModalTitle">🚗 통근시간 확인 · Kakao</div><button type="button" class="v184ModalClose" aria-label="닫기">×</button></div><iframe class="v184ModalFrame" title="통근시간 확인"></iframe></div>';
      document.body.appendChild(modal);
      const close=()=>{modal.hidden=true;const f=modal.querySelector('iframe');if(f)f.src='about:blank';document.documentElement.style.overflow=''};
      modal.querySelector('.v184ModalClose')?.addEventListener('click',close);
      modal.addEventListener('click',e=>{if(e.target===modal)close()});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
      return modal;
    }
    function openModal(url){
      const modal=ensureModal(),f=modal.querySelector('iframe');
      if(f)f.src=url;
      modal.hidden=false;document.documentElement.style.overflow='hidden';
    }
    window.v184OpenCommuteModal=openModal;

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
      const direct=e.target.closest?.('.v184CommuteDirect');
      if(direct){
        e.preventDefault();e.stopImmediatePropagation();
        const item=direct.closest('.v166Item'),j=jobFor(item);
        if(!item)return;
        openModal(commuteUrl(j||{},item));
        return;
      }
      const link=e.target.closest?.('a[href*="job-fit-commute.html"]');
      if(link){
        e.preventDefault();e.stopImmediatePropagation();
        openModal(link.getAttribute('href'));
      }
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