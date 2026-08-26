(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  function patch(){
    if(document.getElementById('v192CompanySummaryFixReady'))return;
    const mark=document.createElement('meta');mark.id='v192CompanySummaryFixReady';document.head.appendChild(mark);
    const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
    const style=document.createElement('style');
    style.textContent=`
      .v192List{display:flex;flex-direction:column;gap:9px}.v192Card{border:1px solid #dbe5f5;border-radius:11px;background:#fff;padding:11px 12px}.v192Title{font-size:13px;font-weight:950;color:#172033}.v192Text{font-size:12px;line-height:1.7;color:#344054;margin-top:4px}.v192Use{font-size:11px;line-height:1.6;color:#667085;margin-top:5px}.v192Tag{display:inline-block;padding:3px 7px;border-radius:999px;background:#eef4ff;color:#2457d6;font-size:10.5px;font-weight:900;margin-right:6px}.v192Evidence{margin-top:10px;border:1px solid #e4e7ec;border-radius:10px;overflow:hidden;background:#fff}.v192Evidence summary{cursor:pointer;background:#f8fafc;padding:9px 11px;font-size:11px;font-weight:850;color:#667085}.v192EvidenceBody{padding:9px 11px}.v192EvidenceRow{padding:7px 0;border-top:1px solid #edf0f4;font-size:11.5px;line-height:1.55;color:#475467}.v192EvidenceRow:first-child{border-top:0}.v192EvidenceRow a{color:#2457d6;text-decoration:none;font-weight:800}.v192Bullet{margin:0;padding-left:19px;font-size:12.5px;line-height:1.8;color:#344054}.v192Bullet li+li{margin-top:5px}
    `;document.head.appendChild(style);

    function rawBlocks(){
      const blocks=[...document.querySelectorAll('.v186Block')];
      const issue=blocks.find(b=>/최근 핵심 이슈\s*·\s*DART 공시/.test(clean(b.querySelector('h3')?.textContent)));
      const direction=blocks.find(b=>/현재 투자·사업 방향\s*·\s*DART 근거/.test(clean(b.querySelector('h3')?.textContent)));
      if(!issue||!direction)return null;
      const issues=[...issue.querySelectorAll('.v186Issue')].map(el=>({
        date:clean(el.querySelector('.v186Date')?.textContent),cat:clean(el.querySelector('.v186Cat')?.textContent),title:clean(el.querySelector('a')?.textContent||el.textContent),href:el.querySelector('a')?.href||''
      })).filter(x=>x.title);
      const evidence=[...direction.querySelectorAll('.v186Evidence')].map(el=>({title:clean(el.querySelector('b')?.textContent),meta:clean(el.querySelector('div')?.textContent),href:el.querySelector('a')?.href||''})).filter(x=>x.title);
      return {issue,direction,issues,evidence};
    }
    function group(issues,evidence){
      const cards=[];const add=(key,icon,title,text,use,src=[])=>{if(!cards.some(x=>x.key===key))cards.push({key,icon,title,text,use,src})};
      const strategy=issues.filter(x=>/장래사업|경영계획|기업가치제고/.test(x.title));
      if(strategy.length)add('strategy','🧭','중장기 전략 방향을 공식적으로 공개 중','장래사업·경영계획 또는 기업가치 제고계획 공시가 확인됩니다. 회사가 앞으로 무엇을 강화하려는지 파악할 때 가장 먼저 볼 자료입니다.','지원동기에서는 이 중 지원직무와 직접 연결되는 방향 1개만 골라 사용하세요.',strategy);
      const facility=issues.filter(x=>/신규시설투자|시설투자|유형자산.*취득/.test(x.title));
      if(facility.length)add('facility','🏭','생산·설비 투자 움직임 확인','신규시설투자 등 생산기반 확대와 연결되는 공시가 확인됩니다.','생산·설비·공정·품질 지원자는 생산능력, 설비 안정성, 공정 효율과 자신의 경험을 연결하기 좋습니다.',facility);
      const contract=issues.filter(x=>/단일판매|공급계약|수주/.test(x.title));
      if(contract.length)add('contract','🤝','최근 수주·공급계약 흐름 존재','단일판매·공급계약 관련 공시가 확인됩니다. 최근 고객 수요와 사업 흐름을 이해하는 근거가 될 수 있습니다.','면접에서는 계약 제목을 외우기보다 어떤 사업에서 수요가 발생하고 있는지 설명하는 데 활용하세요.',contract);
      const expand=issues.filter(x=>/타법인.*취득|주식.*취득|영업양수|합병|분할/.test(x.title));
      const invest=evidence.filter(x=>/^출자·투자/.test(x.title)&&!/합계/.test(x.title));
      if(expand.length||invest.length){
        const names=invest.slice(0,2).map(x=>x.title.replace(/^출자·투자\s*·?\s*/,''));
        add('expand','📈','사업확장·출자 움직임 확인',`${expand.length?'타법인 지분 취득·사업재편 관련 공시가 확인됩니다. ':''}${names.length?names.join(', ')+' 등 최근 출자 증가 항목도 확인됩니다.':''}`,'신사업·기술확보 목적의 투자와 계열사 운영 목적 투자를 구분해서 보는 것이 좋습니다.',[...expand,...invest]);
      }
      const result=issues.filter(x=>/잠정.*실적|연결재무제표기준영업|매출액.*손익/.test(x.title));
      if(result.length)add('result','📊','최근 실적 변화도 공식 공시','최근 잠정실적 또는 손익 관련 공시가 확인됩니다.','면접에서는 숫자 암기보다 매출·영업이익이 개선인지 둔화인지와 그 배경을 이해하는 데 쓰세요.',result);
      const risk=issues.filter(x=>/중대재해|생산중단|영업정지|풍문|보도.*해명/.test(x.title));
      if(risk.length)add('risk','⚠️','최근 리스크·변동 이슈 확인 필요','중대재해, 생산중단, 보도 해명 등 지원 전에 한 번 확인할 가치가 있는 공시가 있습니다.','사실관계와 회사 대응만 확인하고 과도하게 해석하지 않는 것이 좋습니다.',risk);
      return cards.slice(0,4);
    }
    function evidenceHtml(issues,evidence){
      const rows=[];
      for(const x of issues)rows.push(`<div class="v192EvidenceRow"><span class="v192Tag">${esc(x.cat||'공시')}</span>${esc(x.date)} · ${x.href?`<a target="_blank" rel="noopener" href="${esc(x.href)}">${esc(x.title)}</a>`:esc(x.title)}</div>`);
      for(const x of evidence)rows.push(`<div class="v192EvidenceRow"><b>${esc(x.title)}</b><br>${esc(x.meta)}</div>`);
      return `<details class="v192Evidence"><summary>근거 DART 공시·출자내역 보기 (${rows.length}건)</summary><div class="v192EvidenceBody">${rows.join('')}</div></details>`;
    }
    function transform(){
      const raw=rawBlocks();if(!raw||raw.issue.dataset.v192Done==='1')return false;
      const cards=group(raw.issues,raw.evidence);if(!cards.length)return false;
      const role=clean(document.getElementById('v183TargetRole')?.value);
      raw.issue.dataset.v192Done='1';raw.direction.dataset.v192Done='1';
      raw.issue.classList.remove('v186Amber');raw.issue.classList.add('v186Blue');
      raw.issue.innerHTML=`<h3>🔥 취준생이 알아둘 최근 핵심 변화</h3><div class="v192List">${cards.map(c=>`<div class="v192Card"><div class="v192Title">${c.icon} ${esc(c.title)}</div><div class="v192Text">${esc(c.text)}</div><div class="v192Use"><b>취업준비 활용:</b> ${esc(c.use)}</div></div>`).join('')}</div>`;
      const uses=[];
      if(cards.some(c=>c.key==='strategy'))uses.push(`<b>지원동기:</b> 장래사업·기업가치 제고계획에서 ${role?`<b>${esc(role)}</b>과 연결되는`: '지원직무와 연결되는'} 방향 1개를 골라 “왜 이 회사인가”의 근거로 사용하세요.`);
      if(cards.some(c=>c.key==='facility'))uses.push(`<b>직무 연결:</b> 시설투자는 생산능력·설비 안정성·품질·공정효율과 연결해 본인의 경험을 설명하기 좋은 소재입니다.`);
      if(cards.some(c=>c.key==='contract'))uses.push(`<b>면접 대비:</b> 최근 공급계약은 주요 고객·수요 산업과 회사의 성장 흐름을 설명하는 소재로 활용하세요.`);
      if(cards.some(c=>c.key==='expand'))uses.push(`<b>기업 이해:</b> 출자·지분취득은 무엇에 투자했는지보다 <b>왜 투자했는지</b>를 확인해야 합니다.`);
      if(cards.some(c=>c.key==='risk'))uses.push(`<b>최근 이슈:</b> 리스크 공시는 사실관계와 회사 대응을 확인해 면접에서 균형 있게 답할 준비를 하세요.`);
      uses.push(`<b>답변 공식:</b> “최근 DART에서 ○○ 움직임 확인 → 회사에 왜 중요한지 → ${role?esc(role):'지원직무'}에서 내가 어떻게 기여할지” 순서면 충분합니다.`);
      raw.direction.innerHTML=`<h3>🎯 입사지원서·면접에서 이렇게 활용</h3><ul class="v192Bullet">${uses.slice(0,4).map(x=>`<li>${x}</li>`).join('')}</ul>${evidenceHtml(raw.issues,raw.evidence)}`;
      return true;
    }
    function runPoll(){let n=0;const t=setInterval(()=>{n++;transform();if(n>=30)clearInterval(t)},350)}
    document.addEventListener('click',e=>{const b=e.target?.closest?.('button');if(b&&/기업분석|분석/.test(clean(b.textContent)))runPoll()},true);
    setTimeout(runPoll,700);
  }
  function inject(){const d=frame.contentDocument;if(!d||!d.body){setTimeout(inject,120);return}if(d.getElementById('v192CompanySummaryFixScript'))return;const s=d.createElement('script');s.id='v192CompanySummaryFixScript';s.textContent='('+patch.toString()+')();';d.body.appendChild(s)}
  frame.addEventListener('load',()=>setTimeout(inject,1800));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,1800);
})();
