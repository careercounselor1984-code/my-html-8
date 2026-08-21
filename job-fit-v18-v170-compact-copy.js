(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(!document.getElementById('v169DetailReady')){setTimeout(patch,100);return}
    if(document.getElementById('v170CompactReady'))return;
    const ready=document.createElement('meta');ready.id='v170CompactReady';document.head.appendChild(ready);

    const style=document.createElement('style');
    style.textContent=`
      .v170Compact{margin-top:8px;padding:9px 10px;background:#f6fef9;border:1px solid #abefc6;border-radius:10px}
      .v170CompactTitle{font-size:12px;font-weight:900;color:#344054;margin-bottom:6px}
      .v170Compact textarea{width:100%;box-sizing:border-box;height:145px;min-height:145px;resize:vertical;border:1px solid #d0d5dd;border-radius:8px;background:#fff;color:#172033;padding:8px 10px;font:12px/1.5 system-ui,-apple-system,'Noto Sans KR',sans-serif}
      .v170CompactActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}.v170CompactActions .btn{margin-top:0}
    `;
    document.head.appendChild(style);

    function row(form,label){
      const r=[...form.querySelectorAll('.v169Row')].find(x=>x.querySelector('label')?.textContent.trim()===label);
      if(!r)return[];
      return [...r.querySelectorAll('input,textarea')].map(x=>String(x.value||'').trim()).filter(Boolean);
    }
    function compactify(item){
      const form=item?.querySelector('.v169Form');
      if(!form)return false;
      const title=row(form,'제목')[0]||'확인 필요';
      const company=row(form,'업체명')[0]||'확인 필요';
      const address=row(form,'주소')[0]||'확인 필요';
      const work=row(form,'업무')[0]||'확인 필요';
      const ce=row(form,'경력/학력');
      const emp=row(form,'고용형태')[0]||'확인 필요';
      const pay=row(form,'급여')[0]||'확인 필요';
      const wc=row(form,'근무조건');
      const link=row(form,'링크')[0]||'확인 필요';
      const other=row(form,'기타')[0]||'확인 필요';
      const text=[
        '제목: '+title,
        '업체명: '+company,
        '주소: '+address,
        '업무: '+work,
        (ce[0]||'경력: 확인 필요')+' / '+(ce[1]||'학력: 확인 필요'),
        '고용형태: '+emp,
        '급여: '+pay,
        '근무조건: '+(wc.length?wc.join(' / '):'확인 필요'),
        '링크: '+link,
        '기타: '+other
      ].join('\n');
      item.querySelector('.v169Extra')?.remove();
      item.querySelectorAll('.v170Compact').forEach(x=>x.remove());
      const box=document.createElement('div');
      box.className='v170Compact';
      box.innerHTML='<div class="v170CompactTitle">📤 내담자 복사용</div><textarea readonly></textarea><div class="v170CompactActions"><button class="btn green v169Copy" type="button">복사용 문구 복사</button><button class="btn uxAnalyze" type="button">지원가능성 분석</button><button class="btn v169OfficialPrint" type="button">🖨 공식 공고 열기 · 인쇄</button></div>';
      box.querySelector('textarea').value=text;
      form.replaceWith(box);
      return true;
    }
    function watch(item){
      if(!item)return;
      if(compactify(item))return;
      const mo=new MutationObserver(()=>{if(compactify(item))mo.disconnect()});
      mo.observe(item,{childList:true,subtree:true});
      setTimeout(()=>mo.disconnect(),8000);
    }

    document.querySelectorAll('.v166Item').forEach(item=>watch(item));
    window.addEventListener('click',e=>{
      const item=e.target.closest?.('.v166Item');
      if(!item)return;
      if(e.target.closest('.v166Summary'))setTimeout(()=>watch(item),0);
    },true);
  }

  const inject=()=>{
    const d=frame.contentDocument;
    if(!d||!d.body||d.getElementById('v170CompactScript'))return;
    const s=d.createElement('script');s.id='v170CompactScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s);
  };
  frame.addEventListener('load',()=>setTimeout(inject,380));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,380);
})();
