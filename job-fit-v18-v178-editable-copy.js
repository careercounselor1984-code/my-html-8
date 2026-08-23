(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    if(document.getElementById('v178EditableCopyReady'))return;
    const m=document.createElement('meta');m.id='v178EditableCopyReady';document.head.appendChild(m);
    const PREFIX='jobfit_copy_edit_v178_';
    const style=document.createElement('style');
    style.textContent='.v178Hint{font-size:10px;color:#667085;font-weight:600;margin-left:6px}.v174Compact textarea,.v166Copy textarea{cursor:text!important;background:#fff!important}';
    document.head.appendChild(style);
    function storageKey(item){return PREFIX+(item?.dataset?.k||'unknown')}
    function setup(ta){
      if(!ta||ta.dataset.v178Ready==='1')return;
      const item=ta.closest('.v166Item');
      ta.dataset.v178Ready='1';
      ta.readOnly=false;ta.removeAttribute('readonly');
      ta.title='내용을 직접 수정한 뒤 복사할 수 있습니다.';
      try{
        const saved=sessionStorage.getItem(storageKey(item));
        if(saved!==null){ta.value=saved;ta.dataset.userEdited='1'}
      }catch{}
      ta.addEventListener('input',()=>{
        ta.dataset.userEdited='1';
        try{sessionStorage.setItem(storageKey(item),ta.value)}catch{}
      });
      const title=ta.closest('.v174Compact,.v166Copy')?.querySelector('.v174CompactTitle,b');
      if(title&&!title.querySelector?.('.v178Hint')){
        const hint=document.createElement('span');hint.className='v178Hint';hint.textContent='· 직접 수정 가능';title.appendChild(hint);
      }
    }
    function scan(root=document){root.querySelectorAll?.('.v174Compact textarea,.v166Copy textarea').forEach(setup)}
    scan();
    const mo=new MutationObserver(ms=>{for(const rec of ms){for(const n of rec.addedNodes||[]){if(n?.nodeType!==1)continue;if(n.matches?.('.v174Compact textarea,.v166Copy textarea'))setup(n);scan(n)}}});
    mo.observe(document.body,{childList:true,subtree:true});
  }
  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,100);return}if(d.getElementById('v178EditableCopyScript'))return;const s=d.createElement('script');s.id='v178EditableCopyScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,760));if(frame.contentDocument?.readyState==='complete')setTimeout(inject,760);
})();
