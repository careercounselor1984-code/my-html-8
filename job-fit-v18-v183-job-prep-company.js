(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(document.getElementById('v183JobPrepCompanyReady'))return;
    const marker=document.createElement('meta');marker.id='v183JobPrepCompanyReady';document.head.appendChild(marker);
    const API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/company-job-prep';
    const $=id=>document.getElementById(id);
    const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const text=v=>String(v??'').trim();
    const num=v=>Number(v||0);

    const style=document.createElement('style');
    style.textContent=`
      .v183Hero{background:linear-gradient(135deg,#f7faff,#fff);border:1px solid #cfe0ff;border-radius:14px;padding:17px}
      .v183HeroTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}.v183Name{font-size:22px;font-weight:950;color:#172033}.v183OneLine{font-size:13px;color:#475467;line-height:1.65;margin-top:5px}.v183Tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.v183Tag{display:inline-block;padding:4px 8px;border-radius:999px;background:#eef4ff;color:#2457d6;font-size:11px;font-weight:900}.v183Tag.g{background:#ecfdf3;color:#067647}.v183Tag.a{background:#fff4e5;color:#a15c00}
      .v183Actions{display:flex;gap:7px;flex-wrap:wrap}.v183MiniBtn{border:1px solid #cbd5e1;background:#fff;color:#344054;border-radius:8px;padding:8px 10px;font-size:11px;font-weight:850;cursor:pointer;text-decoration:none}.v183MiniBtn:hover{background:#f8fafc}.v183MiniBtn.green{border-color:#a6d9c0;color:#067647;background:#f6fef9}
      .v183Grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.v183Block{background:#fff;border:1px solid #e4e7ec;border-radius:13px;padding:14px}.v183Block h3{margin:0 0 9px;font-size:14px;color:#172033}.v183Block ul{margin:0;padding-left:19px;font-size:12.5px;line-height:1.78;color:#344054}.v183Block li+li{margin-top:3px}.v183Blue{border-color:#cfe0ff;background:#f8fbff}.v183Blue h3{color:#2457d6}.v183Green{border-color:#b7e4ca;background:#f7fdf9}.v183Green h3{color:#067647}
      .v183Keywords{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.v183Keyword{padding:5px 8px;border-radius:8px;background:#eef4ff;color:#2457d6;font-size:11px;font-weight:900}
      .v183Finance{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.v183Metric{border:1px solid #e4e7ec;border-radius:10px;padding:11px;background:#fff}.v183Metric .lab{font-size:11px;color:#667085;font-weight:800}.v183Metric .val{font-size:17px;font-weight:950;margin-top:5px}.v183Metric .chg{font-size:10.5px;color:#667085;margin-top:3px}.v183Up{color:#067647!important}.v183Down{color:#b42318!important}
      .v183Disclosure{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-top:1px solid #edf0f4}.v183Disclosure:first-of-type{border-top:0}.v183DisclosureDate{font-size:11px;color:#667085;white-space:nowrap}.v183Disclosure a{font-size:12.5px;color:#2457d6;font-weight:800;text-decoration:none}.v183Disclosure a:hover{text-decoration:underline}
      .v183Detail{margin-top:12px;border:1px solid #e4e7ec;border-radius:12px;background:#fff;overflow:hidden}.v183Detail summary{cursor:pointer;padding:12px 14px;font-size:12px;font-weight:900;color:#475467;background:#f8fafc}.v183DetailBody{padding:13px 14px}.v183Rows{display:grid;grid-template-columns:115px 1fr;gap:6px 10px;font-size:12px;line-height:1.55}.v183Rows b{color:#667085}.v183Rows span{overflow-wrap:anywhere}.v183Note{font-size:11px;color:#667085;line-height:1.65;margin-top:10px}.v183Empty{font-size:12px;color:#667085;line-height:1.65}.v183Loading{padding:22px;text-align:center;color:#2457d6;font-size:12px;font-weight:850}
      @media(max-width:900px){.v183Grid2,.v183Finance{grid-template-columns:1fr}.v183Rows{grid-template-columns:95px 1fr}}
    `;
    document.head.appendChild(style);

    function resetPanel(){
      const sec=$('companyAnalysis');if(!sec)return false;
      sec.innerHTML=`
        <div class="card">
          <h2>🏭 입사지원·면접용 기업분석</h2>
          <div class="box"><b>회사 소개를 길게 보여주는 화면이 아닙니다.</b><br>자기소개서·지원동기 작성과 면접 준비에 실제로 쓸 수 있는 기업정보만 공식 API에서 골라 정리합니다.</div>
          <div class="row3" style="margin-top:12px">
            <div><label>기업명</label><input id="v183CompanyName" placeholder="예: 현대자동차, 세진중공업"></div>
            <div><label>지원직무</label><input id="v183TargetRole" placeholder="예: 생산직, 설비보전, 품질관리"></div>
            <div><label>근무지/사업장 주소 <span class="sub">(선택)</span></label><input id="v183CompanyAddress" placeholder="예: 울산 북구 염포로 700"></div>
          </div>
          <div class="actions"><button class="btn" id="v183Run" type="button">취업준비용 기업분석</button></div>
          <div class="sub">지원직무를 입력하면 자소서·면접 포인트를 그 직무에 맞춰 보여줍니다. 주소는 국민연금 사업장 매칭과 통근시간 확인 정확도를 높이는 데 사용합니다.</div>
        </div>
        <div id="v183Result"></div>`;
      $('v183Run')?.addEventListener('click',run);
      ['v183CompanyName','v183TargetRole','v183CompanyAddress'].forEach(id=>$(id)?.addEventListener('keydown',e=>{if(e.key==='Enter')run()}));
      return true;
    }

    function waitPanel(tries=0){if(resetPanel())return;if(tries<30)setTimeout(()=>waitPanel(tries+1),180)}

    function marketName(v){return ({Y:'유가증권시장',K:'코스닥',N:'코넥스',E:'비상장/기타'})[text(v)]||'공시기업'}
    function fmtDate(v){const s=text(v).replace(/\D/g,'');return s.length===8?`${s.slice(0,4)}.${s.slice(4,6)}.${s.slice(6,8)}`:(text(v)||'확인 안 됨')}
    function fmtMonth(v){const s=text(v).replace(/\D/g,'');return s.length>=6?`${s.slice(0,4)}.${s.slice(4,6)}`:(text(v)||'확인 안 됨')}
    function won(v){if(v==null||!Number.isFinite(Number(v)))return '확인 안 됨';const n=Number(v),a=Math.abs(n);if(a>=1e12)return `${(n/1e12).toFixed(1)}조원`;if(a>=1e8)return `${Math.round(n/1e8).toLocaleString('ko-KR')}억원`;if(a>=1e4)return `${Math.round(n/1e4).toLocaleString('ko-KR')}만원`;return `${Math.round(n).toLocaleString('ko-KR')}원`}
    function changeText(v){if(v==null||!Number.isFinite(Number(v)))return '';const n=Number(v);return `${n>0?'전년 대비 +':''}${n}%`}
    function changeClass(v){return Number(v)>0?'v183Up':Number(v)<0?'v183Down':''}
    function mainNps(d){const n=d?.nps||{};return n.selected||n.companyWideCandidate||null}
    function designationTags(d){return (d?.badge?.designations||[]).map(x=>`<span class="v183Tag g">${esc(x.label||'고용24 공식 지정')}${x.selectedYear?' · '+esc(x.selectedYear):''}</span>`).join('')}
    function companyOneLine(d){const bits=[];if(d.dart?.available)bits.push(marketName(d.dart.corpClass));if(d.industry)bits.push(d.industry);const n=mainNps(d);if(n?.subscriberCount)bits.push(`국민연금 가입자 약 ${Number(n.subscriberCount).toLocaleString('ko-KR')}명`);return bits.length?bits.join(' · '):'공식 API에서 확인되는 정보 범위 내에서 취업준비 포인트를 정리했습니다.'}
    function applicationPoints(d){const out=[],role=text(d.targetRole),industry=text(d.industry),n=mainNps(d),ds=d?.badge?.designations||[],f=d.finance;
      if(industry)out.push(`<b>회사 이해:</b> ${esc(industry)} 업종이라는 점을 지원동기에서 ${role?'<b>'+esc(role)+'</b> 업무와 연결하세요.':'희망직무와 연결하세요.'}`);
      if(role)out.push(`<b>직무 연결:</b> 회사 소개를 반복하기보다 '${esc(role)}에서 내가 어떤 문제를 해결하고 기여할지'를 중심으로 작성하는 편이 좋습니다.`);
      if(n?.subscriberCount)out.push(`<b>기업 규모 참고:</b> 국민연금 가입자 약 ${Number(n.subscriberCount).toLocaleString('ko-KR')}명 규모의 사업장 자료가 확인됩니다. 규모에 맞는 협업·안전·프로세스 경험을 연결할 수 있습니다.`);
      if(ds.length)out.push(`<b>공식 지정:</b> 고용24에서 ${esc(ds.map(x=>x.label).join(' · '))} 등재가 확인됩니다. 지원동기의 보조 근거로만 활용하세요.`);
      if(f?.revenue?.current!=null){const g=f.revenueGrowthPct;out.push(`<b>경영 흐름:</b> ${f.year}년 매출 ${esc(won(f.revenue.current))}${g!=null?' · 전년 대비 '+(g>0?'+':'')+g+'%':''}. 숫자를 그대로 쓰기보다 회사의 사업 흐름을 이해했다는 근거로 활용하세요.`)}
      if(!out.length)out.push('기업의 공식 확인정보가 제한적입니다. 회사 홈페이지의 사업소개와 지원 공고의 직무내용을 함께 확인해 지원동기를 작성하세요.');return out.slice(0,5)}
    function interviewPoints(d){const out=[],role=text(d.targetRole),industry=text(d.industry),disc=d.disclosures||[];
      if(industry)out.push(`이 회사의 주된 업종이 <b>${esc(industry)}</b>이라는 점과 주요 고객·제품·현장 특성을 설명할 수 있도록 준비`);
      if(role)out.push(`<b>${esc(role)}</b>이 회사의 생산·서비스 과정에서 어떤 역할을 하는지 30초 안에 설명할 수 있도록 준비`);
      if(d.finance?.revenue?.current!=null)out.push(`최근 매출·영업이익 흐름을 숫자 암기보다 <b>증가/감소 방향과 그 의미</b> 중심으로 이해`);
      if(disc.length)out.push(`최근 공시 중 '${esc(disc[0].title)}' 같은 이슈를 한두 개 골라 회사의 최근 변화로 확인`);
      out.push('“왜 이 회사인가?”와 “왜 이 직무인가?”를 서로 연결해서 답변 준비');return out.slice(0,5)}
    function questions(d){const role=text(d.targetRole)||'지원직무',industry=text(d.industry)||'회사의 사업';const keys=d?.jobPrep?.keywords||[];const q=[`왜 이 회사의 ${role}에 지원했나요?`,`이 회사가 속한 ${industry} 분야에서 중요하다고 생각하는 변화는 무엇인가요?`,`본인의 경험 중 ${role}에 가장 직접적으로 도움이 되는 경험은 무엇인가요?`];if(keys[0])q.push(`${keys[0]}와 관련해 실제로 문제를 해결하거나 개선한 경험이 있나요?`);if(keys[1])q.push(`${keys[1]}을 중요하게 생각하는 이유와 본인의 사례를 말해보세요.`);return q.slice(0,5)}
    function financeHtml(d){const f=d.finance;if(!f||(!f.revenue&&!f.operatingIncome&&!f.netIncome))return '<div class="v183Empty">최근 연간 재무정보를 자동 확인하지 못했습니다. 비상장기업이거나 DART 재무공시 대상이 아닌 경우일 수 있습니다.</div>';const m=[['매출',f.revenue,f.revenueGrowthPct],['영업이익',f.operatingIncome,f.operatingGrowthPct],['당기순이익',f.netIncome,f.netGrowthPct]];return `<div class="v183Finance">${m.map(([lab,x,g])=>`<div class="v183Metric"><div class="lab">${lab} · ${esc(f.year)}년</div><div class="val">${esc(won(x?.current))}</div><div class="chg ${changeClass(g)}">${esc(changeText(g)||'전년 비교 확인 안 됨')}</div></div>`).join('')}</div>`}
    function disclosuresHtml(d){const xs=d.disclosures||[];if(!xs.length)return '<div class="v183Empty">최근 1년간 취업준비에 바로 참고할 만한 DART 공시를 자동 선별하지 못했습니다.</div>';return xs.map(x=>`<div class="v183Disclosure"><span class="v183DisclosureDate">${esc(fmtDate(x.date))}</span><a target="_blank" rel="noopener" href="https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${encodeURIComponent(x.receiptNo||'')}">${esc(x.title)}</a></div>`).join('')+`<div class="v183Note">공시 제목은 최근 변화 파악용 출발점입니다. 면접에서 언급하기 전 원문 내용을 확인하세요.</div>`}
    function detailHtml(d){const dart=d.dart||{},n=mainNps(d);return `<details class="v183Detail"><summary>▸ 기업 기본정보·국민연금 원자료 펼치기</summary><div class="v183DetailBody"><div class="v183Grid2" style="margin-top:0"><div><h3 style="font-size:13px;margin:0 0 8px">OpenDART 기본정보</h3>${dart.available?`<div class="v183Rows"><b>정식명칭</b><span>${esc(dart.corpName||'')}</span><b>대표자</b><span>${esc(dart.ceoName||'')}</span><b>시장</b><span>${esc(marketName(dart.corpClass))}${dart.stockCode?' · '+esc(dart.stockCode):''}</span><b>설립일</b><span>${esc(fmtDate(dart.establishedDate))}</span><b>홈페이지</b><span>${esc(dart.homepage||'확인 안 됨')}</span></div>`:'<div class="v183Empty">DART 기업개황 미확인</div>'}</div><div><h3 style="font-size:13px;margin:0 0 8px">국민연금 참고정보</h3>${n?`<div class="v183Rows"><b>자료기준월</b><span>${esc(fmtMonth(n.dataMonth))}</span><b>가입자수</b><span>${num(n.subscriberCount).toLocaleString('ko-KR')}명</span><b>신규취득</b><span>${num(n.newAcquisitions).toLocaleString('ko-KR')}명</span><b>상실</b><span>${num(n.lossCount).toLocaleString('ko-KR')}명</span><b>업종</b><span>${esc(n.industryName||'')}</span><b>사업장주소</b><span>${esc(n.roadAddress||n.lotAddress||'')}</span></div>`:'<div class="v183Empty">정확히 매칭되는 국민연금 사업장 미확인</div>'}</div></div><div class="v183Note">국민연금 가입자·신규취득·상실 수치는 사업장 신고자료 기준 참고지표이며 실제 전체 임직원·채용·퇴사 인원과 동일하지 않을 수 있습니다.</div></div></details>`}

    function render(d,name,address,role){const root=$('v183Result');if(!root)return;const tags=[];if(d.dart?.available)tags.push(`<span class="v183Tag">${esc(marketName(d.dart.corpClass))}</span>`);if(d.industry)tags.push(`<span class="v183Tag">${esc(d.industry)}</span>`);const n=mainNps(d);if(n?.subscriberCount)tags.push(`<span class="v183Tag g">가입자 약 ${Number(n.subscriberCount).toLocaleString('ko-KR')}명</span>`);tags.push(designationTags(d));const destination=address||d?.company?.address||d.dart?.address||n?.roadAddress||n?.lotAddress||'';const commute=`job-fit-commute.html?${new URLSearchParams({company:name,title:role||'기업분석',source:'CORPORATE',destination}).toString()}`;
      root.innerHTML=`<div class="card">
        <div class="v183Hero"><div class="v183HeroTop"><div><div class="v183Name">${esc(d.dart?.corpName||name)}</div><div class="v183OneLine">${esc(companyOneLine(d))}</div><div class="v183Tags">${tags.join('')}</div></div><div class="v183Actions">${destination?`<a class="v183MiniBtn green" target="_blank" rel="noopener" href="${esc(commute)}">🚗 통근시간 확인</a>`:''}${d.dart?.homepage?`<a class="v183MiniBtn" target="_blank" rel="noopener" href="${/^https?:/i.test(d.dart.homepage)?esc(d.dart.homepage):'https://'+esc(d.dart.homepage)}">회사 홈페이지 ↗</a>`:''}</div></div></div>
        <div class="v183Grid2"><div class="v183Block v183Blue"><h3>✍️ 자소서·지원동기에 활용할 핵심</h3><ul>${applicationPoints(d).map(x=>'<li>'+x+'</li>').join('')}</ul></div><div class="v183Block v183Green"><h3>🔗 ${role?esc(role)+' ':''}직무 연결 포인트</h3>${role?`<div class="v183Empty">아래 키워드 중 본인이 실제 경험으로 설명할 수 있는 것만 골라 자소서와 면접 사례에 연결하세요.</div><div class="v183Keywords">${(d.jobPrep?.keywords||[]).map(x=>`<span class="v183Keyword">${esc(x)}</span>`).join('')}</div>`:'<div class="v183Empty">지원직무를 입력하면 직무별 강조 키워드를 보여줍니다.</div>'}</div></div>
        <div class="v183Grid2"><div class="v183Block"><h3>💬 면접 전에 알아둘 내용</h3><ul>${interviewPoints(d).map(x=>'<li>'+x+'</li>').join('')}</ul></div><div class="v183Block"><h3>❓ 예상 면접 질문</h3><ul>${questions(d).map(x=>'<li>'+esc(x)+'</li>').join('')}</ul></div></div>
        <div class="v183Block" style="margin-top:12px"><h3>📈 최근 경영 흐름 · DART</h3>${financeHtml(d)}<div class="v183Note">재무수치는 지원동기에 숫자를 나열하기보다 회사의 성장·수익성 흐름을 이해하는 참고자료로 사용하세요.</div></div>
        <div class="v183Block" style="margin-top:12px"><h3>📰 최근 회사 이슈 확인 · DART 공시</h3>${disclosuresHtml(d)}</div>
        ${detailHtml(d)}
      </div>`;
    }

    let running=false;
    async function run(){if(running)return;const name=text($('v183CompanyName')?.value),role=text($('v183TargetRole')?.value),address=text($('v183CompanyAddress')?.value),root=$('v183Result');if(!name){$('v183CompanyName')?.focus();return}running=true;if(root)root.innerHTML='<div class="card v183Loading">DART · 국민연금 · 고용24 정보를 취업준비 관점으로 정리하는 중...</div>';try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({companyName:name,companyAddress:address,targetRole:role})});const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||`HTTP ${r.status}`);render(d,name,address,role)}catch(e){if(root)root.innerHTML=`<div class="card"><div class="err">기업분석을 완료하지 못했습니다. ${esc(e.message||e)}</div></div>`}finally{running=false}}

    waitPanel();
  }

  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,120);return}if(d.getElementById('v183JobPrepCompanyScript'))return;const s=d.createElement('script');s.id='v183JobPrepCompanyScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,1350));if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1350);
})();
