(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(!document.getElementById('v169DetailReady')){setTimeout(patch,100);return}
    if(document.getElementById('v172CompactReady'))return;
    const ready=document.createElement('meta');ready.id='v172CompactReady';document.head.appendChild(ready);

    const style=document.createElement('style');
    style.textContent=`
      .v170Compact{margin-top:8px;padding:9px 10px;background:#f6fef9;border:1px solid #abefc6;border-radius:10px}
      .v170CompactTitle{font-size:12px;font-weight:900;color:#344054;margin-bottom:6px}
      .v170Compact textarea{width:100%;box-sizing:border-box;height:128px;min-height:128px;resize:vertical;border:1px solid #d0d5dd;border-radius:8px;background:#fff;color:#172033;padding:8px 10px;font:12px/1.48 system-ui,-apple-system,'Noto Sans KR',sans-serif}
      .v170CompactActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}.v170CompactActions .btn{margin-top:0}
    `;
    document.head.appendChild(style);

    function row(form,label){
      const r=[...form.querySelectorAll('.v169Row')].find(x=>x.querySelector('label')?.textContent.trim()===label);
      if(!r)return[];
      return [...r.querySelectorAll('input,textarea')].map(x=>String(x.value||'').trim()).filter(Boolean);
    }
    function plain(v){return String(v||'').replace(/&#xd;/gi,'\n').replace(/<[^>]+>/g,' ').replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim()}
    function cleanTitle(v){
      return plain(v)
        .replace(/\[[^\]]*(?:채용대행|고용센터|일자리센터|취업지원)[^\]]*\]/gi,'')
        .replace(/^[▶■◆●○◈\-•]+\s*/,'')
        .replace(/\s{2,}/g,' ')
        .trim()||'확인 필요';
    }
    function shortAddress(v){
      return plain(v)
        .replace(/^\(?\d{5}\)?\s*/,'')
        .replace(/^\d{5}\s+/,'')
        .replace(/서울특별시/g,'서울').replace(/부산광역시/g,'부산').replace(/대구광역시/g,'대구')
        .replace(/인천광역시/g,'인천').replace(/광주광역시/g,'광주').replace(/대전광역시/g,'대전')
        .replace(/울산광역시/g,'울산').replace(/세종특별자치시/g,'세종')
        .replace(/강원특별자치도/g,'강원').replace(/전북특별자치도/g,'전북').replace(/제주특별자치도/g,'제주')
        .replace(/\s{2,}/g,' ').trim()||'확인 필요';
    }
    function shortWork(v,title){
      const raw=plain(v);
      const nt=cleanTitle(title).replace(/\s/g,'');
      const noise=/(근무시간|근무요일|근무형태|근무장소|근무지|급여|임금|시급|월급|연봉|접수방법|접수기간|제출서류|전형방법|채용절차|지원방법|지원문의|문의처|담당자|연락처|복리후생|우대사항|자격요건|필수사항|기타사항|고용형태|모집인원|채용인원|4대보험|퇴직급여|퇴직연금|식사제공|통근버스)/i;
      let parts=raw.split(/\n+|\s*[•●◆▶]\s*|\s*;\s*/).map(x=>x.trim()).filter(Boolean);
      const picked=[];
      for(let x of parts){
        x=x.replace(/^[▶■◆●○◈\-•]+\s*/,'')
          .replace(/^(?:직무내용|담당업무|주요업무|업무내용|업무)\s*[:：]?\s*/,'')
          .replace(/^[-–—]\s*/,'').trim();
        if(!x||noise.test(x))continue;
        const nx=x.replace(/\s/g,'');
        if(nt&&nx.length>8&&(nt.includes(nx)||nx.includes(nt)))continue;
        if(/(?:모집|채용)\s*(?:공고|안내|합니다|중)/.test(x)&&x.length<90)continue;
        x=x.replace(/\s{2,}/g,' ').replace(/[,.]\s*$/,'').trim();
        if(x.length>105)x=x.slice(0,102)+'...';
        if(x&&!picked.some(y=>y===x)){picked.push(x);if(picked.length>=3)break}
      }
      if(!picked.length){
        let fallback=raw.replace(/\s+/g,' ').trim();
        if(fallback.length>210)fallback=fallback.slice(0,207)+'...';
        return fallback||'확인 필요';
      }
      let out=picked.join(' • ');
      if(out.length>230)out=out.slice(0,227)+'...';
      return out;
    }
    function shortCareer(v){return plain(v).replace(/^경력\s*:\s*/,'').replace(/^관계없음$/,'무관').replace(/^경력무관$/,'무관').trim()||'확인 필요'}
    function shortEdu(v){return plain(v).replace(/^학력\s*:\s*/,'').replace(/^학력무관$/,'무관').replace(/^관계없음$/,'무관').trim()||'확인 필요'}
    function shortEmployment(v){
      let s=plain(v).replace(/\s*\/\s*파견근로\s*(?:비희망|희망)/gi,'').replace(/\s*\/\s*대체인력채용\s*(?:비희망|희망)/gi,'').trim();
      s=s.replace(/\s{2,}/g,' ');
      return s||'확인 필요';
    }
    function shortPay(v){
      let s=plain(v).replace(/\s*이상,?\s*$/,'').replace(/,+\s*$/,'').trim();
      const m=s.match(/^(연봉|월급|시급|일급)\s*([\d,]+)\s*원/);
      if(m){
        const n=Number(m[2].replace(/,/g,''));
        if(Number.isFinite(n)){
          if(m[1]==='연봉'&&n>=1000000)s='연봉 '+Math.round(n/10000).toLocaleString('ko-KR')+'만원';
          else s=m[1]+' '+n.toLocaleString('ko-KR')+'원';
        }
      }
      return s||'확인 필요';
    }
    function shortWorkCond(vals){
      const src=vals.map(plain).filter(Boolean).join(' ');
      const day=src.match(/주\s*(\d+)\s*일/);
      const weekdays=/월\s*[~\-～]\s*금|월요일\s*[~\-～]\s*금요일/.test(src)?'(월~금)':'';
      const times=[...src.matchAll(/(?:오전|오후)?\s*(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?\s*[~\-～]\s*(?:오전|오후)?\s*(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?|\b(\d{1,2}:\d{2})\s*[~\-～]\s*(\d{1,2}:\d{2})\b/g)];
      let time='';
      if(times.length){
        const m=times[0];
        if(m[5])time=m[5]+'~'+m[6];
        else if(m[1]&&m[3])time=String(m[1]).padStart(2,'0')+':'+String(m[2]||'00').padStart(2,'0')+'~'+String(m[3]).padStart(2,'0')+':'+String(m[4]||'00').padStart(2,'0');
      }
      const head=day?'주 '+day[1]+'일'+weekdays:(weekdays?'주 5일'+weekdays:'');
      if(head||time)return [head,time].filter(Boolean).join(' ');
      let s=src.replace(/^평일\s*:\s*/,'').replace(/▶?\s*근무시간\s*:\s*/g,'').replace(/,?\s*주\s*\d+\s*일\s*근무.*$/,'').trim();
      return s.length>90?s.slice(0,87)+'...':(s||'확인 필요');
    }
    function compactify(item){
      const form=item?.querySelector('.v169Form');
      if(!form)return false;
      const title=cleanTitle(row(form,'제목')[0]);
      const company=plain(row(form,'업체명')[0])||'확인 필요';
      const address=shortAddress(row(form,'주소')[0]);
      const work=shortWork(row(form,'업무')[0]||'',title);
      const ce=row(form,'경력/학력');
      const career=shortCareer(ce[0]);
      const edu=shortEdu(ce[1]);
      const emp=shortEmployment(row(form,'고용형태')[0]);
      const pay=shortPay(row(form,'급여')[0]);
      const wc=row(form,'근무조건');
      const link=plain(row(form,'링크')[0])||'확인 필요';
      const text=[
        title,
        '업체: '+company,
        '주소: '+address,
        '업무: '+work,
        '경력: '+career+' / 학력: '+edu,
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
      setTimeout(()=>mo.disconnect(),5000);
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
    if(!d||!d.body||d.getElementById('v172CompactScript'))return;
    const s=d.createElement('script');s.id='v172CompactScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s);
  };
  frame.addEventListener('load',()=>setTimeout(inject,380));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,380);
})();
