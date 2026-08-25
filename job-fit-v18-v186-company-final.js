(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(document.getElementById('v186CompanyFinalReady'))return;
    const marker=document.createElement('meta');marker.id='v186CompanyFinalReady';document.head.appendChild(marker);
    const API='https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/company-job-prep';
    const $=id=>document.getElementById(id);
    const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const txt=v=>String(v??'').trim();
    const n=v=>Number(String(v??'').replace(/,/g,''));

    const style=document.createElement('style');
    style.textContent=`
      .v186Hero{border:1px solid #cfe0ff;background:linear-gradient(135deg,#f7faff,#fff);border-radius:15px;padding:17px}.v186HeroTop{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;flex-wrap:wrap}.v186Name{font-size:24px;font-weight:950;color:#172033}.v186Sub{font-size:13px;color:#475467;line-height:1.65;margin-top:5px}.v186Tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.v186Tag{display:inline-block;padding:4px 8px;border-radius:999px;background:#eef4ff;color:#2457d6;font-size:11px;font-weight:900}.v186Tag.g{background:#ecfdf3;color:#067647}.v186Tag.a{background:#fff4e5;color:#a15c00}.v186Actions{display:flex;gap:7px;flex-wrap:wrap}.v186Btn{border:1px solid #cbd5e1;background:#fff;color:#344054;border-radius:8px;padding:8px 10px;font-size:11px;font-weight:850;cursor:pointer;text-decoration:none}.v186Btn.green{border-color:#9bd5b4;color:#067647;background:#f6fef9}
      .v186Summary{margin-top:12px;border:1px solid #d7e3ff;background:#f8fbff;border-radius:13px;padding:14px}.v186Summary h3{margin:0 0 8px;font-size:14px;color:#2457d6}.v186Summary p{margin:0;font-size:13px;line-height:1.75;color:#344054}
      .v186Grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.v186Block{border:1px solid #e4e7ec;background:#fff;border-radius:13px;padding:14px}.v186Block h3{margin:0 0 9px;font-size:14px;color:#172033}.v186Block ul{margin:0;padding-left:19px;font-size:12.5px;line-height:1.8;color:#344054}.v186Block li+li{margin-top:3px}.v186Blue{background:#f8fbff;border-color:#cfe0ff}.v186Blue h3{color:#2457d6}.v186Green{background:#f7fdf9;border-color:#b7e4ca}.v186Green h3{color:#067647}.v186Amber{background:#fffaf0;border-color:#f1d7a2}.v186Amber h3{color:#9a6700}.v186Rose{background:#fff8f7;border-color:#f4c7c3}.v186Rose h3{color:#b42318}
      .v186Issue{display:grid;grid-template-columns:82px 64px 1fr;gap:9px;align-items:start;padding:9px 0;border-top:1px solid #edf0f4}.v186Issue:first-child{border-top:0}.v186Date{font-size:11px;color:#667085}.v186Cat{font-size:10.5px;font-weight:900;padding:3px 6px;border-radius:999px;background:#eef4ff;color:#2457d6;text-align:center}.v186Issue a{display:block;font-size:12.5px;font-weight:850;color:#2457d6;text-decoration:none;line-height:1.45}.v186Meaning{font-size:11px;color:#667085;line-height:1.55;margin-top:3px}
      .v186Evidence{padding:9px 0;border-top:1px solid #edf0f4}.v186Evidence:first-child{border-top:0}.v186Evidence b{display:block;font-size:12.5px;color:#344054}.v186Evidence div{font-size:11px;color:#667085;line-height:1.55;margin-top:3px}.v186Evidence a{color:#2457d6;text-decoration:none;font-weight:800}
      .v186Metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.v186Metric{border:1px solid #e4e7ec;background:#fff;border-radius:10px;padding:11px}.v186Metric span{display:block;font-size:11px;color:#667085;font-weight:800}.v186Metric b{display:block;font-size:17px;margin-top:4px;color:#172033}.v186Metric em{display:block;font-style:normal;font-size:10.5px;color:#667085;margin-top:3px}.v186Up{color:#067647!important}.v186Down{color:#b42318!important}
      .v186Kw{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.v186Kw span{padding:5px 8px;border-radius:8px;background:#eef4ff;color:#2457d6;font-size:11px;font-weight:900}.v186Tiny{font-size:11px;color:#667085;line-height:1.65;margin-top:9px}.v186Empty{font-size:12px;color:#667085;line-height:1.65}.v186Detail{margin-top:12px;border:1px solid #e4e7ec;border-radius:12px;background:#fff;overflow:hidden}.v186Detail summary{cursor:pointer;padding:12px 14px;background:#f8fafc;font-size:12px;font-weight:900;color:#475467}.v186DetailBody{padding:13px 14px}.v186Rows{display:grid;grid-template-columns:120px 1fr;gap:6px 10px;font-size:12px;line-height:1.55}.v186Rows b{color:#667085}.v186Rows span{overflow-wrap:anywhere}
      .v186Modal{position:fixed;inset:0;z-index:999999;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:20px}.v186ModalCard{position:relative;width:min(900px,100%);height:min(760px,calc(100vh - 40px));background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 24px 80px rgba(15,23,42,.28)}.v186ModalClose{position:absolute;z-index:2;right:12px;top:10px;width:34px;height:34px;border:1px solid #d0d5dd;border-radius:999px;background:#fff;font-size:19px;cursor:pointer}.v186Modal iframe{width:100%;height:100%;border:0}
      @media(max-width:900px){.v186Grid,.v186Metrics{grid-template-columns:1fr}.v186Issue{grid-template-columns:72px 58px 1fr}.v186Rows{grid-template-columns:95px 1fr}}
    `;document.head.appendChild(style);

    const fmtDate=v=>{const s=txt(v).replace(/\D/g,'');return s.length===8?`${s.slice(0,4)}.${s.slice(4,6)}.${s.slice(6,8)}`:txt(v)};
    const money=v=>{if(v==null||!Number.isFinite(Number(v)))return '확인 안 됨';const x=Number(v),a=Math.abs(x);if(a>=1e12)return `${(x/1e12).toFixed(1)}조원`;if(a>=1e8)return `${Math.round(x/1e8).toLocaleString('ko-KR')}억원`;if(a>=1e4)return `${Math.round(x/1e4).toLocaleString('ko-KR')}만원`;return `${Math.round(x).toLocaleString('ko-KR')}원`};
    const pct=v=>v==null||!Number.isFinite(Number(v))?'':`${Number(v)>0?'+':''}${Number(v)}%`;
    const market=v=>({Y:'유가증권시장',K:'코스닥',N:'코넥스',E:'비상장/기타'})[txt(v)]||'DART 공시기업';
    const dartUrl=no=>no?`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${encodeURIComponent(no)}`:'#';
    const home=v=>{let s=txt(v);if(!s)return'';return /^https?:\/\//i.test(s)?s:'https://'+s};
    const mainNps=d=>{const x=d?.nps||{};return x.selected||x.companyWideCandidate||null};

    function issueMeta(title){
      const t=txt(title);
      if(/장래사업|경영계획/.test(t))return{score:100,cat:'전략',meaning:'회사가 향후 사업·경영 방향을 공식적으로 밝힌 공시입니다. 지원동기와 면접에서 가장 먼저 확인할 자료입니다.'};
      if(/기업가치제고/.test(t))return{score:98,cat:'전략',meaning:'중장기 성장·수익성·자본배분 방향을 확인할 수 있는 공시입니다.'};
      if(/신규시설투자|시설투자|유형자산.*취득/.test(t))return{score:95,cat:'투자',meaning:'생산능력·설비·사업 확대와 연결될 수 있는 투자 공시입니다.'};
      if(/단일판매|공급계약|수주/.test(t))return{score:90,cat:'수주',meaning:'최근 수주·고객·사업 확대 흐름을 확인하는 데 유용한 공시입니다.'};
      if(/연결재무제표기준영업|잠정.*실적|매출액.*손익/.test(t))return{score:82,cat:'실적',meaning:'가장 최근 실적 흐름을 보여주는 공시입니다. 숫자보다 증가·감소 방향과 배경을 이해하세요.'};
      if(/생산중단|영업정지|중대재해/.test(t))return{score:88,cat:'리스크',meaning:'사업운영·안전 관련 리스크입니다. 생산·현장직 면접에서는 특히 확인할 가치가 있습니다.'};
      if(/대표이사.*변경/.test(t))return{score:72,cat:'조직',meaning:'리더십·조직 변화와 관련된 공시입니다.'};
      if(/풍문|보도.*해명/.test(t))return{score:76,cat:'이슈',meaning:'시장에 알려진 이슈에 대한 회사의 공식 입장을 확인할 수 있습니다.'};
      if(/지속가능경영/.test(t))return{score:68,cat:'ESG',meaning:'환경·안전·공급망·사회책임 등 비재무 방향을 확인하는 자료입니다.'};
      if(/기업설명회|IR/.test(t))return{score:65,cat:'IR',meaning:'최근 경영성과와 사업 설명 자료가 제시될 가능성이 높은 공시입니다.'};
      if(/자기주식|배당|주식소각|주주총회|최대주주|임원ㆍ주요주주/.test(t))return{score:5,cat:'자본',meaning:'투자자에게는 중요하지만 일반 취업준비 활용도는 낮아 핵심 이슈에서는 후순위로 둡니다.'};
      return{score:35,cat:'공시',meaning:'최근 공식 공시입니다. 제목만으로 의미를 단정하지 말고 원문에서 실제 내용을 확인하세요.'};
    }
    function topIssues(d){return (d.disclosures||[]).map(x=>({...x,_m:issueMeta(x.title)})).filter(x=>x._m.score>=35).sort((a,b)=>b._m.score-a._m.score||String(b.date).localeCompare(String(a.date))).slice(0,6)}
    function meaningfulEvidence(d){
      const out=[];
      for(const x of topIssues(d).filter(x=>['전략','투자','수주','실적','리스크','이슈'].includes(x._m.cat)).slice(0,4))out.push({kind:'공시',title:x.title,meta:`${fmtDate(x.date)} · ${x._m.meaning}`,url:dartUrl(x.receiptNo)});
      for(const x of (d.investments?.recentIncreases||[]).filter(x=>txt(x.name)&&Number(x.changeAmount||0)>0).slice(0,4))out.push({kind:'출자',title:x.name,meta:`${x.purpose?'목적: '+x.purpose+' · ':''}${money(x.changeAmount)} 증가 · ${d.investments?.reportLabel||'DART 정기보고서'}`});
      return out.slice(0,6);
    }
    function trendSentence(d){const f=d.finance;if(!f)return'';const parts=[];if(f.revenue?.current!=null)parts.push(`매출 ${money(f.revenue.current)}${f.revenueGrowthPct!=null?' ('+pct(f.revenueGrowthPct)+')':''}`);if(f.operatingIncome?.current!=null)parts.push(`영업이익 ${money(f.operatingIncome.current)}${f.operatingGrowthPct!=null?' ('+pct(f.operatingGrowthPct)+')':''}`);return parts.join(' · ')}
    function summaryText(d){
      const name=txt(d.dart?.corpName||d.company?.name),industry=txt(d.industry),emp=d.employees?.totalEmployees,role=txt(d.targetRole),issue=topIssues(d)[0],f=trendSentence(d);const bits=[];
      bits.push(`<b>${esc(name)}</b>은(는) ${industry?'<b>'+esc(industry)+'</b> 분야의 ':''}${esc(market(d.dart?.corpClass))} 기업입니다.`);
      if(emp)bits.push(`DART 직원현황 기준 약 <b>${Number(emp).toLocaleString('ko-KR')}명</b> 규모입니다.`);
      if(issue)bits.push(`최근 확인할 공식 이슈는 <b>‘${esc(issue.title)}’</b>이며, ${esc(issue._m.meaning)}`);
      if(f)bits.push(`최근 재무 흐름은 ${esc(f)}입니다.`);
      if(role)bits.push(`<b>${esc(role)}</b> 지원자는 이 회사의 최근 변화와 자신의 직무경험을 연결해 설명하는 것이 핵심입니다.`);
      return bits.join(' ');
    }
    function applicationPoints(d){
      const role=txt(d.targetRole),issues=topIssues(d),ev=meaningfulEvidence(d),keys=d?.jobPrep?.keywords||[],out=[];
      if(issues[0])out.push(`<b>지원동기:</b> ‘${esc(issues[0].title)}’ 공시를 원문으로 확인한 뒤, 회사가 최근 어떤 방향을 공식적으로 제시했는지 한 문장으로 정리하고 ${role?'<b>'+esc(role)+'</b>과 연결하세요.':'희망직무와 연결하세요.'}`);
      if(ev.find(x=>x.kind==='출자')){const x=ev.find(x=>x.kind==='출자');out.push(`<b>사업·투자 소재:</b> ${esc(x.title)} 관련 출자 목적을 확인해 신사업·기술·생산 확대와 실제 관련이 있는 경우에만 자소서 소재로 사용하세요.`)}
      if(role)out.push(`<b>직무 기여:</b> 회사 소개를 반복하지 말고 “${esc(role)}에서 내가 어떤 문제를 해결할 수 있는가”를 경험 중심으로 작성하세요.`);
      if(keys.length)out.push(`<b>경험 키워드:</b> ${keys.slice(0,5).map(esc).join(' · ')} 중 실제 경험이 있는 것만 골라 STAR 방식으로 준비하세요.`);
      if(d.finance)out.push(`<b>기업 이해:</b> ${esc(d.finance.reportLabel||'최근 보고서')} 실적의 증가·감소 방향을 이해해 두되 자소서에 재무숫자를 과도하게 나열하지 마세요.`);
      return out.slice(0,5)
    }
    function interviewQuestions(d){
      const name=txt(d.dart?.corpName||d.company?.name),role=txt(d.targetRole)||'지원직무',issues=topIssues(d),keys=d?.jobPrep?.keywords||[],q=[];
      q.push(`왜 ${name}의 ${role}에 지원했나요?`);
      if(issues[0])q.push(`최근 ${name}의 ‘${issues[0].title}’ 공시를 봤다면, 이 내용이 회사와 ${role}에 어떤 의미가 있다고 생각하나요?`);
      if(issues[1])q.push(`최근 회사의 또 다른 이슈인 ‘${issues[1].title}’에 대해 알고 있는 내용을 설명해보세요.`);
      q.push(`${role}에서 가장 중요하다고 생각하는 역량은 무엇이며, 이를 보여주는 본인의 실제 경험은 무엇인가요?`);
      if(keys[0])q.push(`${keys[0]}과 관련해 문제를 해결하거나 개선한 경험을 구체적으로 말해보세요.`);
      return q.slice(0,5)
    }
    function issueHtml(d){const xs=topIssues(d);if(!xs.length)return '<div class="v186Empty">취업준비 활용도가 높은 최근 DART 공시를 자동 선별하지 못했습니다.</div>';return xs.map(x=>`<div class="v186Issue"><span class="v186Date">${esc(fmtDate(x.date))}</span><span class="v186Cat">${esc(x._m.cat)}</span><div><a target="_blank" rel="noopener" href="${dartUrl(x.receiptNo)}">${esc(x.title)}</a><div class="v186Meaning">${esc(x._m.meaning)}</div></div></div>`).join('')}
    function evidenceHtml(d){const xs=meaningfulEvidence(d);if(!xs.length)return '<div class="v186Empty">DART에서 취업준비에 바로 쓸 만한 전략·투자 근거를 충분히 확인하지 못했습니다.</div>';return xs.map(x=>`<div class="v186Evidence"><b>${esc(x.kind)} · ${esc(x.title)}</b><div>${esc(x.meta)}${x.url?` · <a href="${x.url}" target="_blank" rel="noopener">원문 확인 ↗</a>`:''}</div></div>`).join('')}
    function financeHtml(d){const f=d.finance;if(!f)return '<div class="v186Empty">최근 DART 재무제표 핵심값을 확인하지 못했습니다.</div>';const rows=[['매출',f.revenue,f.revenueGrowthPct],['영업이익',f.operatingIncome,f.operatingGrowthPct],['당기순이익',f.netIncome,f.netGrowthPct]];return `<div class="v186Metrics">${rows.map(([lab,x,g])=>`<div class="v186Metric"><span>${esc(lab)} · ${esc(f.reportLabel||f.year||'')}</span><b>${esc(money(x?.current))}</b><em class="${Number(g)>0?'v186Up':Number(g)<0?'v186Down':''}">${g==null?'비교값 확인 안 됨':'전년 동기/전기 대비 '+esc(pct(g))}</em></div>`).join('')}</div><div class="v186Tiny">※ 분기·반기 수치는 누적 기준일 수 있습니다. 면접에서는 숫자 암기보다 증가·감소 방향과 사업 배경을 이해하는 용도로 활용하세요.</div>`}
    function employeeHtml(d){const e=d.employees;if(!e)return '<div class="v186Empty">DART 직원현황을 확인하지 못했습니다.</div>';const divs=(e.divisions||[]).filter(x=>!/(합계|성별)/.test(txt(x.name))).slice(0,5);return `<div class="v186Metrics"><div class="v186Metric"><span>DART 직원 수</span><b>${e.totalEmployees?Number(e.totalEmployees).toLocaleString('ko-KR')+'명':'확인 안 됨'}</b><em>${esc(e.reportLabel||'')}</em></div><div class="v186Metric"><span>평균 근속</span><b>${e.avgTenure!=null?esc(e.avgTenure)+'년':'확인 안 됨'}</b><em>합계행 기준 참고값</em></div><div class="v186Metric"><span>1인 평균급여</span><b>${e.avgSalary!=null?esc(money(e.avgSalary)):'확인 안 됨'}</b><em>${/반기|분기/.test(txt(e.reportLabel))?'해당 보고기간 누적값 · 연봉 아님':'DART 보고서 기준'}</em></div></div>${divs.length?`<div class="v186Kw">${divs.map(x=>`<span>${esc(x.name)} ${Number(x.count||0).toLocaleString('ko-KR')}명</span>`).join('')}</div>`:''}`}
    function detailHtml(d){const dart=d.dart||{},np=mainNps(d);return `<details class="v186Detail"><summary>▸ 기업 기본정보 · 국민연금 원자료 펼치기</summary><div class="v186DetailBody"><div class="v186Rows"><b>기업명</b><span>${esc(dart.corpName||d.company?.name||'')}</span><b>시장구분</b><span>${esc(market(dart.corpClass))}${dart.stockCode?' · '+esc(dart.stockCode):''}</span><b>대표업종</b><span>${esc(d.industry||'확인 안 됨')}</span><b>설립일</b><span>${esc(fmtDate(dart.establishedDate)||'확인 안 됨')}</span><b>본사주소</b><span>${esc(dart.address||'확인 안 됨')}</span><b>국민연금 가입자</b><span>${np?.subscriberCount?Number(np.subscriberCount).toLocaleString('ko-KR')+'명':'확인 안 됨'}</span><b>국민연금 사업장</b><span>${esc(np?.roadAddress||np?.lotAddress||'확인 안 됨')}</span></div><div class="v186Tiny">※ 국민연금 가입자수는 사업장 신고자료이며 전체 임직원수와 다를 수 있습니다. DART 직원현황이 있는 기업은 DART 수치를 우선 참고하세요.</div></div></details>`}
    function openCommute(company,address){document.querySelector('.v186Modal')?.remove();const m=document.createElement('div');m.className='v186Modal';const p=new URLSearchParams({company:company||'',destination:address||'',region:address||''});m.innerHTML=`<div class="v186ModalCard"><button class="v186ModalClose" type="button">×</button><iframe src="job-fit-commute.html?${p.toString()}" title="통근시간 확인"></iframe></div>`;document.body.appendChild(m);const close=()=>m.remove();m.querySelector('.v186ModalClose')?.addEventListener('click',close);m.addEventListener('click',e=>{if(e.target===m)close()});const k=e=>{if(e.key==='Escape'){close();document.removeEventListener('keydown',k)}};document.addEventListener('keydown',k)}

    function render(d){const result=$('v183Result');if(!result)return;const dart=d.dart||{},name=txt(dart.corpName||d.company?.name),addr=txt(d.company?.address||dart.address||mainNps(d)?.roadAddress),role=txt(d.targetRole),hp=home(dart.homepage),des=d?.badge?.designations||[];result.innerHTML=`
      <div class="v186Hero"><div class="v186HeroTop"><div><div class="v186Name">${esc(name)}</div><div class="v186Sub">${esc([market(dart.corpClass),d.industry,addr].filter(Boolean).join(' · '))}</div><div class="v186Tags"><span class="v186Tag">${esc(market(dart.corpClass))}</span>${d.industry?`<span class="v186Tag">${esc(d.industry)}</span>`:''}${d.employees?.totalEmployees?`<span class="v186Tag g">DART 직원 ${Number(d.employees.totalEmployees).toLocaleString('ko-KR')}명</span>`:''}${des.slice(0,2).map(x=>`<span class="v186Tag g">${esc(x.label)}</span>`).join('')}</div></div><div class="v186Actions"><button id="v186Commute" class="v186Btn green" type="button">🚗 통근시간 확인</button>${hp?`<a class="v186Btn" href="${esc(hp)}" target="_blank" rel="noopener">회사 홈페이지 ↗</a>`:''}</div></div></div>
      <div class="v186Summary"><h3>🎯 면접 전 30초 기업요약</h3><p>${summaryText(d)}</p></div>
      <div class="v186Grid"><div class="v186Block v186Amber"><h3>🔥 최근 핵심 이슈 · DART</h3>${issueHtml(d)}</div><div class="v186Block v186Blue"><h3>🚀 현재 사업·투자 방향 · DART 근거</h3>${evidenceHtml(d)}<div class="v186Tiny">※ 공시 제목·출자 목적에서 확인되는 공식 근거만 표시합니다. 제목만 보고 회사의 미래전략을 과도하게 단정하지 않습니다.</div></div></div>
      <div class="v186Grid"><div class="v186Block v186Blue"><h3>✍️ 입사지원서에 활용할 핵심</h3><ul>${applicationPoints(d).map(x=>`<li>${x}</li>`).join('')}</ul>${(d?.jobPrep?.keywords||[]).length?`<div class="v186Kw">${d.jobPrep.keywords.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}</div><div class="v186Block v186Green"><h3>💬 예상 면접 질문</h3><ul>${interviewQuestions(d).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>
      <div class="v186Block" style="margin-top:12px"><h3>📊 최근 경영 흐름 · DART 재무제표</h3>${financeHtml(d)}</div>
      <div class="v186Grid"><div class="v186Block"><h3>👥 직원 현황 · DART</h3>${employeeHtml(d)}</div><div class="v186Block"><h3>🧭 지원 전 마지막 체크</h3><ul><li>최근 전략·투자 공시 원문 1~2개는 직접 읽고 핵심을 한 문장으로 정리</li><li>${role?`<b>${esc(role)}</b>이 회사의 사업과 어떤 방식으로 연결되는지 설명 준비`:'지원직무를 정한 뒤 회사 사업과의 연결점을 설명 준비'}</li><li>최근 실적은 숫자 암기보다 증가·감소 방향과 사업 배경 중심으로 이해</li><li>생산·현장직은 안전·품질·표준작업·설비 대응 경험을 실제 사례로 준비</li><li>지원 공고의 자격요건·근무지·교대 여부는 기업분석과 별도로 최종 확인</li></ul></div></div>
      ${detailHtml(d)}`;
      $('v186Commute')?.addEventListener('click',()=>openCommute(name,addr));
    }
    async function run(){const name=txt($('v183CompanyName')?.value),role=txt($('v183TargetRole')?.value),address=txt($('v183CompanyAddress')?.value),result=$('v183Result');if(!name){$('v183CompanyName')?.focus();return}if(result)result.innerHTML='<div class="card" style="padding:22px;text-align:center;color:#2457d6;font-weight:850">DART 공시·재무·직원·출자정보를 취업준비 관점으로 분석하는 중...</div>';try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({companyName:name,targetRole:role,companyAddress:address})});const d=await r.json();if(!r.ok||!d?.ok)throw new Error(d?.error||`HTTP ${r.status}`);render(d)}catch(e){if(result)result.innerHTML=`<div class="card"><div style="padding:12px;border-radius:10px;background:#fef3f2;color:#b42318;font-size:12px">기업분석을 완료하지 못했습니다. ${esc(e.message||e)}</div></div>`}}

    document.addEventListener('click',e=>{const t=e.target?.closest?.('#v183Run');if(!t)return;e.preventDefault();e.stopImmediatePropagation();run()},true);
    document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;if(!['v183CompanyName','v183TargetRole','v183CompanyAddress'].includes(e.target?.id))return;e.preventDefault();e.stopImmediatePropagation();run()},true);
  }

  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,150);return}if(d.getElementById('v186CompanyFinalScript'))return;const s=d.createElement('script');s.id='v186CompanyFinalScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,1700));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1700);
})();
