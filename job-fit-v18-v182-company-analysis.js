(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(document.getElementById('v182CompanyAnalysisReady'))return;
    const marker=document.createElement('meta');
    marker.id='v182CompanyAnalysisReady';
    document.head.appendChild(marker);

    const COMPANY_API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/job-company-enrichment';
    const BADGE_API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-company-badge';
    const $=id=>document.getElementById(id);
    const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const txt=v=>String(v??'').trim();
    const num=v=>Number(v||0);

    const style=document.createElement('style');
    style.textContent=`
      .v179Duty{padding:0!important;overflow:hidden}
      .v182DutyHead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 13px;cursor:pointer;user-select:none;background:#f8fbff}
      .v182DutyHead:hover{background:#f1f6ff}.v182DutyHead:focus{outline:2px solid #bfd4ff;outline-offset:-2px}
      .v182DutyHead .v179DutyTitle{margin:0!important;pointer-events:none}.v182DutyToggle{flex:0 0 auto;color:#2457d6;font-size:11px;font-weight:900;white-space:nowrap}
      .v182DutyBody{padding:0 13px 12px}.v182DutyBody[hidden]{display:none!important}
      .v182CompanySearch{display:grid;grid-template-columns:1.1fr 1.5fr auto;gap:10px;align-items:end;margin-top:12px}.v182CompanySearch .btn{margin-top:0;min-height:39px}
      .v182ResultHead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}.v182ResultName{font-size:21px;font-weight:950;color:#172033}.v182ResultSub{font-size:12px;color:#667085;margin-top:4px;line-height:1.55}
      .v182Kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:13px}.v182Kpi{border:1px solid #e4e7ec;border-radius:11px;padding:12px;background:#fff}.v182KpiLabel{font-size:11px;color:#667085;font-weight:800}.v182KpiValue{font-size:18px;font-weight:950;color:#172033;margin-top:5px;line-height:1.3}.v182KpiNote{font-size:10.5px;color:#98a2b3;margin-top:4px;line-height:1.4}
      .v182InfoGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.v182Info{border:1px solid #e4e7ec;border-radius:12px;padding:13px;background:#fff}.v182Info h3{font-size:13px;margin:0 0 8px;color:#344054}.v182Rows{display:grid;grid-template-columns:110px 1fr;gap:6px 9px;font-size:12px;line-height:1.55}.v182Rows b{color:#667085}.v182Rows span{min-width:0;overflow-wrap:anywhere}
      .v182Tag{display:inline-block;padding:4px 8px;border-radius:999px;background:#eef4ff;color:#2457d6;font-size:11px;font-weight:900;margin:2px 4px 2px 0}.v182Tag.green{background:#ecfdf3;color:#067647}.v182Tag.orange{background:#fff4e5;color:#a15c00}
      .v182Counsel{margin-top:12px;border:1px solid #cfe0ff;background:#f8fbff;border-radius:12px;padding:13px}.v182Counsel h3{margin:0 0 7px;font-size:13px;color:#2457d6}.v182Counsel ul{margin:0;padding-left:19px;font-size:12px;line-height:1.75;color:#344054}
      .v182SourceNote{font-size:11px;color:#667085;line-height:1.6;margin-top:10px}.v182Loading{padding:18px;text-align:center;color:#667085;font-size:12px}.v182Error{padding:12px;border-radius:10px;background:#fef3f2;color:#b42318;font-size:12px;line-height:1.6}
      @media(max-width:900px){.v182CompanySearch,.v182Kpis,.v182InfoGrid{grid-template-columns:1fr}.v182Rows{grid-template-columns:92px 1fr}}
    `;
    document.head.appendChild(style);

    function makeDutyCollapsible(panel){
      if(!panel)return;
      if(panel.querySelector(':scope > .v182DutyHead')&&panel.querySelector(':scope > .v182DutyBody'))return;
      const title=panel.querySelector(':scope > .v179DutyTitle');
      if(!title)return;
      const wasOpen=panel.dataset.v182Open==='1';
      const body=document.createElement('div');
      body.className='v182DutyBody';
      const children=[...panel.children].filter(x=>x!==title);
      children.forEach(x=>body.appendChild(x));
      const head=document.createElement('div');
      head.className='v182DutyHead';
      head.setAttribute('role','button');
      head.setAttribute('tabindex','0');
      head.setAttribute('aria-expanded',wasOpen?'true':'false');
      const toggle=document.createElement('span');
      toggle.className='v182DutyToggle';
      toggle.textContent=wasOpen?'접기 ▲':'펼치기 ▼';
      head.appendChild(title);
      head.appendChild(toggle);
      body.hidden=!wasOpen;
      panel.insertBefore(head,panel.firstChild);
      panel.appendChild(body);
      const change=()=>{
        const open=body.hidden;
        body.hidden=!open;
        panel.dataset.v182Open=open?'1':'0';
        head.setAttribute('aria-expanded',open?'true':'false');
        toggle.textContent=open?'접기 ▲':'펼치기 ▼';
      };
      head.addEventListener('click',change);
      head.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();change()}});
    }
    function scanDuty(){document.querySelectorAll('.v179Duty').forEach(makeDutyCollapsible)}
    const dutyObserver=new MutationObserver(()=>setTimeout(scanDuty,0));
    dutyObserver.observe(document.body,{childList:true,subtree:true});
    scanDuty();

    function addCompanyTab(){
      const tabs=document.querySelector('.tabs');
      const wrap=document.querySelector('.wrap');
      if(!tabs||!wrap||$('v182CompanyTab'))return;
      const btn=document.createElement('button');
      btn.className='tab';
      btn.id='v182CompanyTab';
      btn.dataset.t='companyAnalysis';
      btn.textContent='🏭 기업분석';
      const corpTab=[...tabs.querySelectorAll('.tab')].find(x=>x.dataset.t==='corp');
      corpTab?.after(btn)||tabs.appendChild(btn);

      const sec=document.createElement('section');
      sec.id='companyAnalysis';
      sec.className='panel';
      sec.innerHTML=`
        <div class="card">
          <h2>🏭 기업분석</h2>
          <div class="box"><b>기업명만 검색하면</b> OpenDART · 국민연금 가입사업장 · 고용24 강소기업 공식정보를 묶어 상담사가 보기 좋은 핵심만 정리합니다.</div>
          <div class="v182CompanySearch">
            <div><label>기업명</label><input id="v182CompanyName" placeholder="예: 현대자동차, 세진중공업"></div>
            <div><label>근무지/사업장 주소 <span class="sub">(선택)</span></label><input id="v182CompanyAddress" placeholder="예: 울산 북구 염포로 700"></div>
            <button class="btn" id="v182CompanyRun" type="button">기업 분석</button>
          </div>
          <div class="sub" style="margin-top:8px">주소를 입력하면 국민연금에서 동일 사업장을 찾는 정확도가 높아집니다. 주소가 없어도 기업명 기준으로 조회합니다.</div>
        </div>
        <div id="v182CompanyResult"></div>`;
      const corpPanel=$('corp');
      corpPanel?.after(sec)||wrap.appendChild(sec);

      btn.addEventListener('click',()=>{
        document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===btn));
        document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('on',x===sec));
        setTimeout(()=>$('v182CompanyName')?.focus(),40);
      });
      $('v182CompanyRun')?.addEventListener('click',runCompanyAnalysis);
      ['v182CompanyName','v182CompanyAddress'].forEach(id=>$(id)?.addEventListener('keydown',e=>{if(e.key==='Enter')runCompanyAnalysis()}));
    }

    async function post(url,body){
      const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d=await r.json().catch(()=>({}));
      if(!r.ok||!d?.ok)throw new Error(d?.error||('HTTP '+r.status));
      return d;
    }
    function fmtDate(v){
      const s=txt(v).replace(/\D/g,'');
      if(s.length!==8)return txt(v)||'확인 안 됨';
      return `${s.slice(0,4)}.${s.slice(4,6)}.${s.slice(6,8)}`;
    }
    function yearsSince(v){
      const s=txt(v).replace(/\D/g,'');if(s.length!==8)return '';
      const y=+s.slice(0,4),m=+s.slice(4,6),d=+s.slice(6,8),now=new Date();
      let years=now.getFullYear()-y;if(now.getMonth()+1<m||(now.getMonth()+1===m&&now.getDate()<d))years--;
      return years>=0?`설립 약 ${years}년`:'';
    }
    function corpClass(v){return ({Y:'유가증권시장',K:'코스닥',N:'코넥스',E:'기타/비상장'})[txt(v)]||'확인 안 됨'}
    function fmtMonth(v){const s=txt(v).replace(/\D/g,'');return s.length>=6?`${s.slice(0,4)}.${s.slice(4,6)}`:(txt(v)||'확인 안 됨')}
    function npsMain(nps){return nps?.selected||nps?.companyWideCandidate||nps?.candidates?.[0]||null}
    function npsScopeLabel(nps){if(nps?.selected)return '주소까지 일치한 사업장';if(nps?.companyWideCandidate)return '기업명 정확 일치 사업장';if(nps?.candidates?.length)return '유사 후보 사업장';return '조회 결과 없음'}
    function tagsHtml(badge){
      const ds=badge?.designations||[];
      if(!ds.length)return '<span class="sub">확인된 공식 지정 없음'+(!badge?.regionCode?' · 주소 미입력 시 지역 강소기업 판별 제한':'')+'</span>';
      return ds.map(x=>`<span class="v182Tag green">${esc(x.label||'공식 지정')}${x.selectedYear?' · '+esc(x.selectedYear):''}</span>`).join('');
    }
    function counselorPoints(enrich,badge){
      const out=[],dart=enrich?.dart||{},nps=enrich?.nps||{},n=npsMain(nps);
      if(dart.available){
        out.push(`OpenDART 기준 ${corpClass(dart.corpClass)}${dart.establishedDate?' · '+fmtDate(dart.establishedDate)+' 설립':''}.`);
      }else out.push('OpenDART 기업개황이 자동 확인되지 않아 상장·공시 정보는 별도 확인이 필요합니다.');
      if(n){
        out.push(`국민연금 신고자료 기준 가입자 ${num(n.subscriberCount).toLocaleString('ko-KR')}명 · 신규취득 ${num(n.newAcquisitions).toLocaleString('ko-KR')}명 · 상실 ${num(n.lossCount).toLocaleString('ko-KR')}명 (${fmtMonth(n.dataMonth)} 자료).`);
        if(num(n.newAcquisitions)||num(n.lossCount)){
          const gap=num(n.newAcquisitions)-num(n.lossCount);
          out.push(`최근 자료에서 신규취득이 상실보다 ${Math.abs(gap).toLocaleString('ko-KR')}명 ${gap>0?'많음':gap<0?'적음':'으로 동일'} — 실제 채용·퇴사 인원과 동일한 값은 아닙니다.`);
        }
        if(nps.confidence==='company_only'&&enrich?.company?.address)out.push('공고 근무지와 국민연금 사업장 주소가 달라 회사 전체 참고값으로만 보는 것이 안전합니다.');
      }else out.push('국민연금 가입사업장 자료가 정확 일치하지 않아 인원 규모·변동 지표는 표시하지 않았습니다.');
      const ds=badge?.designations||[];
      if(ds.length)out.push(`고용24 공식목록에서 ${ds.map(x=>x.label).filter(Boolean).join(' · ')} 등재가 확인됩니다.`);
      return out.slice(0,5);
    }
    function renderCompany(enrich,badge,requestedName,requestedAddress){
      const result=$('v182CompanyResult');if(!result)return;
      const dart=enrich?.dart||{},nps=enrich?.nps||{},n=npsMain(nps),dartOk=!!dart.available;
      const name=dartOk?(dart.corpName||requestedName):(enrich?.company?.name||requestedName);
      const address=requestedAddress||dart.address||n?.roadAddress||n?.lotAddress||'';
      const listed=dartOk&&['Y','K','N'].includes(txt(dart.corpClass));
      const kpiListed=dartOk?(listed?'상장사':'비상장/기타'):'확인 안 됨';
      const kpiFounded=dartOk&&dart.establishedDate?fmtDate(dart.establishedDate):'확인 안 됨';
      const kpiWorkers=n?`${num(n.subscriberCount).toLocaleString('ko-KR')}명`:'확인 안 됨';
      const kpiFlow=n?`취득 ${num(n.newAcquisitions).toLocaleString('ko-KR')} · 상실 ${num(n.lossCount).toLocaleString('ko-KR')}`:'확인 안 됨';
      const points=counselorPoints(enrich,badge);
      result.innerHTML=`
        <div class="card">
          <div class="v182ResultHead">
            <div><div class="v182ResultName">${esc(name)}</div><div class="v182ResultSub">${address?esc(address):'주소 정보 확인 안 됨'}</div></div>
            <div>${dartOk?'<span class="v182Tag">OpenDART 확인</span>':'<span class="v182Tag orange">DART 미확인</span>'}${n?'<span class="v182Tag green">국민연금 확인</span>':'<span class="v182Tag orange">국민연금 미확인</span>'}</div>
          </div>
          <div class="v182Kpis">
            <div class="v182Kpi"><div class="v182KpiLabel">상장·공시 구분</div><div class="v182KpiValue">${esc(kpiListed)}</div><div class="v182KpiNote">${dartOk?esc(corpClass(dart.corpClass)):'OpenDART 자동조회 기준'}</div></div>
            <div class="v182Kpi"><div class="v182KpiLabel">설립일</div><div class="v182KpiValue">${esc(kpiFounded)}</div><div class="v182KpiNote">${dartOk?esc(yearsSince(dart.establishedDate)):'기업개황 확인 필요'}</div></div>
            <div class="v182Kpi"><div class="v182KpiLabel">국민연금 가입자</div><div class="v182KpiValue">${esc(kpiWorkers)}</div><div class="v182KpiNote">${n?esc(fmtMonth(n.dataMonth)+' 신고자료'):'정확 일치 자료 없음'}</div></div>
            <div class="v182Kpi"><div class="v182KpiLabel">최근 취득·상실</div><div class="v182KpiValue" style="font-size:15px">${esc(kpiFlow)}</div><div class="v182KpiNote">채용·퇴사 인원으로 단정 금지</div></div>
          </div>
          <div class="v182InfoGrid">
            <div class="v182Info"><h3>기업 기본정보 · OpenDART</h3>${dartOk?`<div class="v182Rows">
              <b>대표자</b><span>${esc(dart.ceoName||'확인 안 됨')}</span>
              <b>정식명칭</b><span>${esc(dart.corpName||name)}</span>
              <b>영문명</b><span>${esc(dart.corpNameEng||'확인 안 됨')}</span>
              <b>시장구분</b><span>${esc(corpClass(dart.corpClass))}${dart.stockCode?' · '+esc(dart.stockCode):''}</span>
              <b>설립일</b><span>${esc(fmtDate(dart.establishedDate))}</span>
              <b>업종코드</b><span>${esc(dart.industryCode||'확인 안 됨')}</span>
              <b>홈페이지</b><span>${esc(dart.homepage||'확인 안 됨')}</span>
            </div>`:`<div class="sub">기업명이 DART 공시기업과 정확하게 자동 매칭되지 않았습니다. 비상장기업이거나 명칭 확인이 필요한 경우일 수 있습니다.</div>`}</div>
            <div class="v182Info"><h3>고용 참고지표 · 국민연금</h3>${n?`<div class="v182Rows">
              <b>매칭기준</b><span>${esc(npsScopeLabel(nps))}</span>
              <b>자료기준월</b><span>${esc(fmtMonth(n.dataMonth))}</span>
              <b>가입자수</b><span>${num(n.subscriberCount).toLocaleString('ko-KR')}명</span>
              <b>신규취득</b><span>${num(n.newAcquisitions).toLocaleString('ko-KR')}명</span>
              <b>상실</b><span>${num(n.lossCount).toLocaleString('ko-KR')}명</span>
              <b>업종</b><span>${esc(n.industryName||'확인 안 됨')}</span>
              <b>사업장주소</b><span>${esc(n.roadAddress||n.lotAddress||'확인 안 됨')}</span>
            </div>`:`<div class="sub">기업명과 정확히 연결되는 국민연금 사업장 자료를 찾지 못했습니다.</div>`}</div>
          </div>
          <div class="v182Info" style="margin-top:12px"><h3>고용24 공식 지정</h3>${tagsHtml(badge)}</div>
          <div class="v182Counsel"><h3>상담사가 볼 핵심</h3><ul>${points.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul></div>
          <div class="v182SourceNote">※ DART는 기업개황 공시정보, 국민연금은 사업장 신고자료, 고용24는 강소기업 관련 공식목록을 활용합니다. 국민연금 가입자수·신규취득·상실 수치는 실제 전체 임직원수·채용자수·퇴사자수와 동일하지 않을 수 있으므로 상담 참고지표로만 사용하세요.</div>
        </div>`;
    }

    let running=false;
    async function runCompanyAnalysis(){
      if(running)return;
      const name=txt($('v182CompanyName')?.value),address=txt($('v182CompanyAddress')?.value),result=$('v182CompanyResult');
      if(!name){$('v182CompanyName')?.focus();return}
      running=true;if(result)result.innerHTML='<div class="card v182Loading">DART · 국민연금 · 고용24 공식정보를 확인하는 중...</div>';
      try{
        const enrich=await post(COMPANY_API,{action:'enrich',companyName:name,companyAddress:address,npsLimit:5});
        const badgeAddress=address||txt(enrich?.dart?.address)||txt(enrich?.nps?.selected?.roadAddress)||txt(enrich?.nps?.companyWideCandidate?.roadAddress);
        let badge=null;
        try{badge=await post(BADGE_API,{action:'match',companyName:name,companyAddress:badgeAddress})}catch(e){badge={ok:false,error:e.message,designations:[]}}
        renderCompany(enrich,badge,name,address);
      }catch(e){if(result)result.innerHTML='<div class="card"><div class="v182Error">기업분석 조회를 완료하지 못했습니다. '+esc(e.message||e)+'</div></div>'}
      finally{running=false}
    }

    addCompanyTab();
  }

  function inject(){
    const d=frame.contentDocument;
    if(!d||!d.body){setTimeout(inject,120);return}
    if(d.getElementById('v182CompanyAnalysisScript'))return;
    const s=d.createElement('script');
    s.id='v182CompanyAnalysisScript';
    s.textContent='('+patch.toString()+')();';
    d.body.appendChild(s);
  }
  frame.addEventListener('load',()=>setTimeout(inject,1100));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1100);
})();
