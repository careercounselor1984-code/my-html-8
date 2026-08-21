(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(!document.getElementById('v169DetailReady')){setTimeout(patch,100);return}
    if(document.getElementById('v171CompactReady'))return;
    const ready=document.createElement('meta');ready.id='v171CompactReady';document.head.appendChild(ready);

    const style=document.createElement('style');
    style.textContent=`
      .v170Compact{margin-top:8px;padding:9px 10px;background:#f6fef9;border:1px solid #abefc6;border-radius:10px}
      .v170CompactTitle{font-size:12px;font-weight:900;color:#344054;margin-bottom:6px}
      .v170Compact textarea{width:100%;box-sizing:border-box;height:132px;min-height:132px;resize:vertical;border:1px solid #d0d5dd;border-radius:8px;background:#fff;color:#172033;padding:8px 10px;font:12px/1.48 system-ui,-apple-system,'Noto Sans KR',sans-serif}
      .v170CompactActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}.v170CompactActions .btn{margin-top:0}
    `;
    document.head.appendChild(style);

    function row(form,label){
      const r=[...form.querySelectorAll('.v169Row')].find(x=>x.querySelector('label')?.textContent.trim()===label);
      if(!r)return[];
      return [...r.querySelectorAll('input,textarea')].map(x=>String(x.value||'').trim()).filter(Boolean);
    }
    function plain(v){return String(v||'').replace(/&#xd;/gi,'\n').replace(/<[^>]+>/g,' ').replace(/\r/g,'').replace(/[ \t]+/g,' ').trim()}
    function shortWork(v){
      const lines=plain(v).split(/\n+/).map(x=>x.trim()).filter(Boolean).map(x=>x.replace(/^[▶■◆●○\-•]+\s*/,'').replace(/^직무내용\s*[:：]?\s*/,'').trim()).filter(x=>x&&!/^(근무시간|급여조건|근무장소|기타사항|근무형태|접수방법|제출서류)\s*[:：]/.test(x)&&!/^◈/.test(x));
      const uniq=[];for(const x of lines){if(!uniq.includes(x))uniq.push(x);if(uniq.length>=4)break}
      let out=uniq.join('   • ');
      if(!out)out=plain(v)||'확인 필요';
      return out.length>360?out.slice(0,357)+'...':out;
    }
    function shortEmployment(v){return plain(v).replace(/\s*\/\s*파견근로\s*비희망/gi,'').replace(/\s*\/\s*대체인력채용\s*비희망/gi,'').replace(/\s*\/\s*파견근로\s*희망/gi,'').trim()||'확인 필요'}
    function shortPay(v){return plain(v).replace(/\s*이상,?\s*$/,'').replace(/(시급|월급|연봉)\s*(\d)/,'$1 $2').trim()||'확인 필요'}
    function shortWorkCond(vals){
      const xs=vals.map(plain).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i);
      let s=xs.join(' ');
      s=s.replace(/^평일\s*:\s*/,'').replace(/,?\s*주\s*\d+\s*일\s*근무.*$/,'').trim();
      if(xs[0]&&/주\s*\d+\s*일/.test(xs[0])&&!s.includes(xs[0]))s=xs[0]+' '+s;
      return s||'확인 필요';
    }
    function compactify(item){
      const form=item?.querySelector('.v169Form');
      if(!form)return false;
      const title=row(form,'제목')[0]||'확인 필요';
      const company=row(form,'업체명')[0]||'확인 필요';
      const address=row(form,'주소')[0]||'확인 필요';
      const work=shortWork(row(form,'업무')[0]||'확인 필요');
      const ce=row(form,'경력/학력');
      const emp=shortEmployment(row(form,'고용형태')[0]||'확인 필요');
      const pay=shortPay(row(form,'급여')[0]||'확인 필요');
      const wc=row(form,'근무조건');
      const link=row(form,'링크')[0]||'확인 필요';
      const text=[
        title,
        '업체: '+company,
        '주소: '+address,
        '업무: '+work,
        (ce[0]||'경력: 확인 필요')+' / '+(ce[1]||'학력: 확인 필요'),
        '고용형태: '+emp,
        '급여: '+pay,
        '근무: '+shortWorkCond(wc),
        '링크: '+link
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
    if(!d||!d.body||d.getElementById('v171CompactScript'))return;
    const s=d.createElement('script');s.id='v171CompactScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s);
  };
  frame.addEventListener('load',()=>setTimeout(inject,380));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,380);
})();
