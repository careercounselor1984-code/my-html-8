(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(document.getElementById('v187InsightSummaryReady'))return;
    const marker=document.createElement('meta');marker.id='v187InsightSummaryReady';document.head.appendChild(marker);

    const style=document.createElement('style');
    style.textContent=`
      .v187InsightList{display:flex;flex-direction:column;gap:9px}
      .v187InsightCard{border:1px solid #ead7ad;background:#fffdf8;border-radius:11px;padding:11px 12px}
      .v187InsightTitle{font-size:13px;font-weight:950;color:#7a4b00;display:flex;align-items:center;gap:6px}
      .v187InsightText{font-size:12px;color:#344054;line-height:1.65;margin-top:4px}
      .v187InsightWhy{font-size:11px;color:#667085;line-height:1.55;margin-top:4px}
      .v187UseList{margin:0;padding-left:19px;font-size:12.5px;line-height:1.8;color:#344054}
      .v187UseList li+li{margin-top:5px}
      .v187UseLabel{font-weight:900;color:#2457d6}
      .v187EvidenceDetail{margin-top:10px;border:1px solid #e4e7ec;border-radius:10px;overflow:hidden;background:#fff}
      .v187EvidenceDetail summary{cursor:pointer;padding:9px 11px;font-size:11px;font-weight:850;color:#667085;background:#f8fafc}
      .v187EvidenceBody{padding:8px 10px}
      .v187EvidenceBody .v186Issue,.v187EvidenceBody .v186Evidence{padding:7px 0}
      .v187EvidenceBody .v186Meaning{display:none}
      .v187EvidenceBody .v186Issue{grid-template-columns:78px 58px 1fr}
      .v187EvidenceBody a{font-size:11.5px!important}
      .v187Hint{font-size:11px;color:#667085;line-height:1.55;margin-top:8px}
      @media(max-width:900px){.v187EvidenceBody .v186Issue{grid-template-columns:70px 52px 1fr}}
    `;
    document.head.appendChild(style);

    const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
    function collectRaw(){
      const issueBlock=[...document.querySelectorAll('.v186Block')].find(b=>/최근 핵심 이슈/.test(b.querySelector('h3')?.textContent||''));
      const dirBlock=[...document.querySelectorAll('.v186Block')].find(b=>/현재 사업·투자 방향/.test(b.querySelector('h3')?.textContent||''));
      if(!issueBlock||!dirBlock)return null;
      const issues=[...issueBlock.querySelectorAll('.v186Issue')].map(el=>({
        date:clean(el.querySelector('.v186Date')?.textContent),
        cat:clean(el.querySelector('.v186Cat')?.textContent),
        title:clean(el.querySelector('a')?.textContent),
        href:el.querySelector('a')?.getAttribute('href')||''
      })).filter(x=>x.title);
      const evidence=[...dirBlock.querySelectorAll('.v186Evidence')].map(el=>({
        title:clean(el.querySelector('b')?.textContent),
        meta:clean(el.querySelector('div')?.textContent),
        href:el.querySelector('a')?.getAttribute('href')||''
      })).filter(x=>x.title);
      return {issueBlock,dirBlock,issues,evidence};
    }

    function has(t,re){return re.test(t)}
    function insightFrom(issues,evidence){
      const all=issues.map(x=>x.title);
      const ev=evidence.map(x=>x.title+' '+x.meta);
      const out=[];
      const add=(key,icon,title,text,why,src=[])=>{if(out.some(x=>x.key===key))return;out.push({key,icon,title,text,why,src})};

      const strategy=issues.filter(x=>has(x.title,/장래사업|경영계획|기업가치제고/));
      if(strategy.length){
        const hasFuture=strategy.some(x=>/장래사업|경영계획/.test(x.title));
        const hasValue=strategy.some(x=>/기업가치제고/.test(x.title));
        add('strategy','🧭','중장기 전략을 공식적으로 제시·점검 중',
          `${hasFuture?'장래 사업·경영계획':''}${hasFuture&&hasValue?'과 ':''}${hasValue?'기업가치 제고계획·이행현황':''} 공시가 확인됩니다.`,
          '지원동기에서는 “회사가 어디로 가는지”를 설명할 때 가장 우선해서 볼 자료입니다.',strategy);
      }
      const facility=issues.filter(x=>has(x.title,/신규시설투자|시설투자|유형자산.*취득/));
      if(facility.length)add('facility','🏭','설비·생산 기반 투자 움직임 확인',
        '신규 시설투자 관련 공시가 확인됩니다. 실제 투자 대상·규모·목적은 원문에서 확인할 수 있습니다.',
        '생산·설비·공정·품질 직무 지원자는 회사의 생산능력·공정 경쟁력 강화와 자신의 직무를 연결하기 좋습니다.',facility);

      const expand=issues.filter(x=>has(x.title,/타법인.*취득|주식.*취득|영업양수|합병|분할/));
      if(expand.length)add('expand','📈','사업 확장·포트폴리오 조정 움직임',
        `${expand.some(x=>/타법인|주식.*취득/.test(x.title))?'타법인 지분 취득':''}${expand.some(x=>/타법인|주식.*취득/.test(x.title))&&expand.some(x=>/영업양수|합병|분할/.test(x.title))?'과 ':''}${expand.some(x=>/영업양수/.test(x.title))?'영업양수':''}${expand.some(x=>/합병|분할/.test(x.title))?'·사업재편':''} 관련 공시가 확인됩니다.`,
        '회사가 기존 사업만 유지하는지, 외부 투자나 사업 재편을 통해 영역을 넓히는지 파악하는 데 도움이 됩니다.',expand);

      const contract=issues.filter(x=>has(x.title,/단일판매|공급계약|수주/));
      if(contract.length)add('contract','🤝','최근 수주·공급계약 흐름 확인',
        '단일판매·공급계약 관련 공시가 확인됩니다.',
        '주요 고객·수주 산업·사업 성장 흐름을 이해하는 근거가 될 수 있습니다.',contract);

      const result=issues.filter(x=>has(x.title,/잠정.*실적|영업.*실적|매출액또는손익구조/));
      if(result.length)add('result','📊','최근 실적 변화 공시 확인',
        '잠정실적 또는 손익구조 변화 관련 공시가 확인됩니다.',
        '면접에서는 숫자를 외우기보다 매출·이익의 방향과 그 배경을 설명할 수 있으면 충분합니다.',result);

      const risk=issues.filter(x=>has(x.title,/중대재해|생산중단|영업정지|풍문또는보도에대한해명/));
      if(risk.length)add('risk','⚠️','최근 리스크·변동 이슈 확인 필요',
        '생산중단·중대재해·보도 해명 등 확인이 필요한 공시가 있습니다.',
        '지원 전 최근 이슈를 한 번 읽어두면 회사의 현재 상황을 더 균형 있게 이해할 수 있습니다.',risk);

      const investEvidence=evidence.filter(x=>/출자·투자/.test(x.title));
      if(investEvidence.length && !out.some(x=>x.key==='expand')){
        const names=investEvidence.slice(0,2).map(x=>clean(x.title.replace(/^출자·투자\s*·?\s*/,''))).filter(Boolean);
        add('invest','💼','타법인 출자·투자도 진행 중',
          `${names.length?names.join(', ')+' 등 ':''}타법인 출자현황에서 최근 증가 항목이 확인됩니다.`,
          '투자 목적이 신사업·기술확보인지, 단순 계열사 운영인지 원문 목적을 구분해서 보는 것이 좋습니다.',investEvidence);
      }
      return out.slice(0,4);
    }

    function usePoints(insights){
      const role=(document.getElementById('v183TargetRole')?.value||'').trim();
      const out=[];
      const s=insights.find(x=>x.key==='strategy');
      const f=insights.find(x=>x.key==='facility');
      const e=insights.find(x=>x.key==='expand'||x.key==='invest');
      const c=insights.find(x=>x.key==='contract');
      const r=insights.find(x=>x.key==='risk');
      if(s)out.push(`<span class="v187UseLabel">지원동기:</span> 장래 사업·경영계획이나 기업가치 제고계획에서 <b>지원직무와 직접 연결되는 방향 1개만</b> 골라 “왜 이 회사인가”의 근거로 사용하세요.`);
      if(f)out.push(`<span class="v187UseLabel">직무 연결:</span> 시설투자 공시는 ${role?`<b>${role}</b>이`: '지원직무가'} 생산능력·설비 안정성·공정 효율·품질에 어떻게 기여할 수 있는지 연결하기 좋은 소재입니다.`);
      if(e)out.push(`<span class="v187UseLabel">기업 이해:</span> 지분 취득·영업양수·출자 움직임은 회사가 사업영역을 넓히거나 포트폴리오를 조정하는 신호일 수 있으므로 <b>무엇을 왜 취득했는지</b> 원문 목적을 확인하세요.`);
      if(c)out.push(`<span class="v187UseLabel">면접 준비:</span> 최근 공급계약은 주요 고객·수요 산업과 연결해 “회사의 성장동력”을 설명하는 데 활용할 수 있습니다.`);
      if(r)out.push(`<span class="v187UseLabel">리스크 질문 대비:</span> 최근 리스크 공시가 있다면 사실관계만 확인하고 과도한 평가보다는 “회사가 어떻게 대응하는지”를 중심으로 보세요.`);
      if(!out.length)out.push(`<span class="v187UseLabel">활용 원칙:</span> DART 공시 제목을 그대로 외우지 말고, 최근 변화 중 지원직무와 연결되는 1~2개만 골라 지원동기와 면접 답변에 사용하세요.`);
      out.push(`<span class="v187UseLabel">답변 방식:</span> “최근 공시에서 ○○ 움직임을 확인했고 → 이것이 회사에 왜 중요한지 → ${role?role:'지원직무'}에서 내가 어떻게 기여할지” 순서로 말하면 됩니다.`);
      return out.slice(0,4);
    }

    function rawDetails(issues,evidence){
      const issueHtml=issues.map(x=>`<div class="v186Issue"><span class="v186Date">${x.date}</span><span class="v186Cat">${x.cat||'공시'}</span><div><a target="_blank" rel="noopener" href="${x.href}">${x.title}</a></div></div>`).join('');
      const evHtml=evidence.map(x=>`<div class="v186Evidence"><b>${x.title}</b><div>${x.meta}${x.href?` · <a target="_blank" rel="noopener" href="${x.href}">원문 확인 ↗</a>`:''}</div></div>`).join('');
      return `<details class="v187EvidenceDetail"><summary>근거 DART 공시·출자내역 펼치기 (${issues.length+evidence.length}건)</summary><div class="v187EvidenceBody">${issueHtml}${evHtml}</div></details>`;
    }

    function transform(){
      const result=document.getElementById('v183Result');
      if(!result||result.dataset.v187Done==='1')return;
      const raw=collectRaw();if(!raw||!raw.issues.length)return;
      const insights=insightFrom(raw.issues,raw.evidence);
      if(!insights.length)return;

      raw.issueBlock.classList.remove('v186Amber');
      raw.issueBlock.classList.add('v186Blue');
      raw.issueBlock.querySelector('h3').textContent='🔥 취준생이 알아둘 최근 핵심 변화';
      raw.issueBlock.innerHTML=`<h3>🔥 취준생이 알아둘 최근 핵심 변화</h3><div class="v187InsightList">${insights.map(x=>`<div class="v187InsightCard"><div class="v187InsightTitle"><span>${x.icon}</span>${x.title}</div><div class="v187InsightText">${x.text}</div><div class="v187InsightWhy"><b>왜 봐야 하나:</b> ${x.why}</div></div>`).join('')}</div><div class="v187Hint">공시 제목 자체보다 “회사가 최근 무엇을 추진하고 있는가”만 먼저 이해하도록 요약했습니다.</div>`;

      raw.dirBlock.querySelector('h3').textContent='🎯 입사지원서·면접에서 이렇게 활용';
      raw.dirBlock.innerHTML=`<h3>🎯 입사지원서·면접에서 이렇게 활용</h3><ul class="v187UseList">${usePoints(insights).map(x=>`<li>${x}</li>`).join('')}</ul>${rawDetails(raw.issues,raw.evidence)}`;
      result.dataset.v187Done='1';
    }

    const mo=new MutationObserver(()=>{setTimeout(()=>{const r=document.getElementById('v183Result');if(r)delete r.dataset.v187Done;transform()},0)});
    const start=()=>{const r=document.getElementById('v183Result');if(!r){setTimeout(start,250);return}mo.observe(r,{childList:true,subtree:false});transform()};
    start();
  }

  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,150);return}if(d.getElementById('v187InsightSummaryScript'))return;const s=d.createElement('script');s.id='v187InsightSummaryScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,1900));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1900);
})();
