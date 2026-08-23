/* 국민취업지원제도 수당 법령·2026 업무매뉴얼 점검 보조 패치 v1
 * 기존 페이지 기능을 변경하지 않고, 수당 관련 핵심 판정 기준을 안내하는 독립 패널을 추가합니다.
 * 기준: 2026 국민취업지원제도 업무매뉴얼 및 구직자취업촉진법 체계
 */
(function(){
  'use strict';
  if (window.__KUA_BENEFIT_LAWCHECK_V1__) return;
  window.__KUA_BENEFIT_LAWCHECK_V1__ = true;

  const CSS = `
  .kua-lawcheck{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:18px auto;max-width:1120px;padding:0 14px;color:#172033}
  .kua-lawcheck *{box-sizing:border-box}
  .kua-law-card{background:#fff;border:1px solid #dfe6ef;border-radius:16px;box-shadow:0 6px 20px rgba(25,42,70,.06);overflow:hidden}
  .kua-law-head{padding:18px 20px;background:#f7f9fc;border-bottom:1px solid #e6ebf2}
  .kua-law-head h2{font-size:20px;margin:0 0 6px}.kua-law-head p{margin:0;color:#5b6577;font-size:14px;line-height:1.55}
  .kua-law-body{padding:18px 20px}.kua-law-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
  .kua-law-item{border:1px solid #e4e9f0;border-radius:12px;padding:14px;background:#fff}
  .kua-law-item h3{font-size:16px;margin:0 0 8px}.kua-law-item p,.kua-law-item li{font-size:14px;line-height:1.6;color:#3d4757}
  .kua-law-item ul{margin:8px 0 0;padding-left:18px}
  .kua-law-badge{display:inline-block;font-size:12px;font-weight:700;padding:3px 8px;border-radius:999px;background:#eef4ff;color:#1e56a0;margin-right:6px}
  .kua-law-note{margin-top:14px;padding:12px 14px;border-radius:10px;background:#fff8e8;color:#6b531c;font-size:13px;line-height:1.55}
  .kua-law-calc{margin-top:16px;border-top:1px solid #e7ebf0;padding-top:16px}
  .kua-law-calc h3{font-size:17px;margin:0 0 12px}.kua-form-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  .kua-field{display:flex;flex-direction:column;gap:6px}.kua-field label{font-size:13px;font-weight:700;color:#3b4556}
  .kua-field select,.kua-field input{width:100%;padding:10px 11px;border:1px solid #ccd5e0;border-radius:9px;background:#fff;font-size:14px}
  .kua-result{margin-top:12px;padding:14px;border-radius:12px;background:#f4f7fb;border:1px solid #dce4ef;font-size:14px;line-height:1.65}
  .kua-result strong{font-size:16px}.kua-result small{display:block;color:#667085;margin-top:6px}
  .kua-law-foot{padding:12px 20px 18px;color:#697386;font-size:12px;line-height:1.5}
  @media(max-width:760px){.kua-law-grid,.kua-form-grid{grid-template-columns:1fr}.kua-law-head,.kua-law-body{padding:15px}.kua-lawcheck{padding:0 8px}}
  `;

  const html = `
  <section class="kua-lawcheck" id="kua-lawcheck-v1">
    <div class="kua-law-card">
      <div class="kua-law-head">
        <h2>수당 발생·구직촉진수당 판단 가이드</h2>
        <p>지정일만으로 수당이 자동 발생하는 것이 아닙니다. 회차, 구직활동 이행, 소득, 취업·유예·중단 여부를 함께 확인합니다.</p>
      </div>
      <div class="kua-law-body">
        <div class="kua-law-grid">
          <div class="kua-law-item"><h3><span class="kua-law-badge">1유형</span>1회차</h3><p><b>IAP 수립 완료</b>가 지급요건입니다. 1회차 지급주기는 수급자격 인정통지일부터 IAP 수립일까지이며 1개월보다 짧을 수 있습니다.</p></div>
          <div class="kua-law-item"><h3><span class="kua-law-badge">1유형</span>2회차 이후</h3><p>IAP 수립일 다음 날부터 월력상 1개월 단위입니다. 지급주기별 계획한 구직활동을 모두 이행하면 전액 지급합니다.</p></div>
          <div class="kua-law-item"><h3>구직활동 일부 이행</h3><ul><li>계획한 활동의 50% 이상 이행: 월 지급액의 50% 지급</li><li>50% 미만 이행: 해당 지급주기 전액 부지급</li><li>재진단 필수 대면상담을 넣는 지급주기는 구직활동 3개 이상 계획</li></ul></div>
          <div class="kua-law-item"><h3>지정일</h3><p>지정일은 <b>수당 자동발생일이 아니라 지급신청일</b>입니다. 2회차 이후 원칙적으로 지급주기의 마지막 날이며, 신청 후 구직활동·소득 등을 확인해 지급 여부를 결정합니다.</p></div>
          <div class="kua-law-item"><h3>취업으로 종료되는 지급주기</h3><p>주 30시간 이상 임금근로, 신규 창업, 월 소득 250만원 이상 노무제공자로 취업하여 취업지원이 종료되면 취·창업일이 포함된 지급주기는 구직활동을 이행한 것으로 인정할 수 있습니다. 불완전 취업 또는 본인 희망 종료는 별도 판단합니다.</p></div>
          <div class="kua-law-item"><h3>지급중단과 지급정지</h3><ul><li><b>구직활동 미이행</b> → 지급중단. 3회면 나머지 구직촉진수당 수급권 소멸, 취업지원서비스는 유지 가능</li><li><b>소득 기준 초과</b> → 지급정지. 3회면 수급자격 인정 철회 및 취업지원 중단</li></ul></div>
          <div class="kua-law-item"><h3><span class="kua-law-badge">2유형</span>참여장려수당</h3><p>IAP 수립 다음 날부터 1개월 단위로, <b>고용센터 또는 위탁기관에 방문하여 30분 이상 집중취업상담</b>을 한 경우 월 1회 2만원, 최대 5회입니다. 외부 출장상담은 이 요건에 포함시키지 않습니다.</p></div>
          <div class="kua-law-item"><h3><span class="kua-law-badge">2유형</span>2026 훈련참여지원수당</h3><p><b>2026년 폐지</b>되었으며 2025년 취업지원 신청자까지 종전 기준으로 지원합니다.</p></div>
        </div>

        <div class="kua-law-note">※ 가족수당은 지급주기 중 하루라도 부양가족 요건에 해당하면 그 지급주기에는 전액 지급하는 방식입니다. 수급자별 월 지급액에 따라 소득 기준금액도 달라질 수 있습니다.</div>

        <div class="kua-law-calc">
          <h3>빠른 판정</h3>
          <div class="kua-form-grid">
            <div class="kua-field"><label>회차</label><select id="kuaRound"><option value="1">1회차</option><option value="2" selected>2회차 이후</option></select></div>
            <div class="kua-field"><label>계획한 구직활동 수</label><input id="kuaPlanned" type="number" min="0" max="20" value="2"></div>
            <div class="kua-field"><label>이행한 구직활동 수</label><input id="kuaDone" type="number" min="0" max="20" value="2"></div>
            <div class="kua-field"><label>월 구직촉진수당 지급액</label><select id="kuaMonthly"><option value="60" selected>60만원</option><option value="70">70만원</option><option value="80">80만원</option><option value="90">90만원</option><option value="100">100만원</option></select></div>
            <div class="kua-field"><label>지급주기 신고소득</label><input id="kuaIncome" type="number" min="0" step="1" value="0" placeholder="만원"></div>
            <div class="kua-field"><label>프로그램 참여수당 포함 여부</label><select id="kuaProgram"><option value="no" selected>아니오/없음</option><option value="yes">예 — 지급정지 판정은 별도 확인</option></select></div>
          </div>
          <div class="kua-result" id="kuaResult"></div>
        </div>
      </div>
      <div class="kua-law-foot">업무 보조용 요약입니다. 실제 처분·지급 결정은 최신 법령, 고시, 업무매뉴얼 및 전산 확인 결과를 우선합니다.</div>
    </div>
  </section>`;

  function threshold(monthly){
    // 2026: 기준금액 = 월 단위 지급액의 2배 또는 1인가구 기준중위소득 60% 중 큰 금액.
    // 매뉴얼 표: 60만원 수급자는 1,538,543원, 70~100만원은 각 지급액 2배가 더 큼.
    return monthly === 60 ? 153.8543 : monthly * 2;
  }
  function render(){
    const r = document.getElementById('kuaResult'); if(!r) return;
    const round = +document.getElementById('kuaRound').value;
    const planned = Math.max(0,+document.getElementById('kuaPlanned').value||0);
    const done = Math.max(0,+document.getElementById('kuaDone').value||0);
    const monthly = +document.getElementById('kuaMonthly').value;
    const income = Math.max(0,+document.getElementById('kuaIncome').value||0);
    const program = document.getElementById('kuaProgram').value;

    if(round===1){
      r.innerHTML='<strong>1회차는 IAP 수립 완료 여부를 먼저 확인</strong><small>1회차는 단순 구직활동 횟수 계산보다 IAP 수립 의무를 모두 이행하고 계획 수립을 완료했는지가 지급요건입니다.</small>';
      return;
    }
    const ratio = planned>0 ? done/planned : 0;
    let activityRate = ratio>=1 ? 1 : ratio>=0.5 ? 0.5 : 0;
    let activityText = activityRate===1?'구직활동 전부 이행':activityRate===0.5?'구직활동 50% 이상 일부 이행':'구직활동 50% 미만 이행';
    let activityPay = monthly*activityRate;
    const t = threshold(monthly);

    if(activityRate===0){
      r.innerHTML=`<strong>판정: 해당 지급주기 전액 부지급</strong><small>${activityText}. 정당한 사유가 있는 경우 지급중단 여부가 달라질 수 있으므로 유예·정당한 사유를 별도 확인하세요.</small>`;
      return;
    }

    if(income<=monthly){
      r.innerHTML=`<strong>예상: ${activityPay.toFixed(0)}만원 지급 범위</strong><small>${activityText}. 신고소득 ${income.toFixed(0)}만원이 월 지급액 ${monthly}만원 이하입니다. 최종 지급액은 다른 제한사유를 함께 확인합니다.</small>`;
      return;
    }

    const incomeLimitPay = Math.max(0, Math.min(monthly, t-income));
    let pay = Math.min(activityPay, incomeLimitPay);
    if(income < t){
      r.innerHTML=`<strong>예상: ${pay.toFixed(1).replace('.0','')}만원 감액 지급</strong><small>기준금액 약 ${t.toFixed(1)}만원 - 신고소득 ${income.toFixed(1)}만원을 적용한 한도와 구직활동 이행률에 따른 한도 중 작은 금액으로 판단합니다.</small>`;
    } else if(income === t){
      r.innerHTML=`<strong>판정: 0원 지급(부지급)</strong><small>신고소득이 기준금액과 같습니다. 지급정지와는 구분하여 관리해야 합니다.</small>`;
    } else if(program==='yes'){
      r.innerHTML=`<strong>추가 확인 필요: 0원 지급 또는 지급정지</strong><small>총 신고소득은 기준금액을 넘지만 프로그램 참여수당이 포함되어 있습니다. 프로그램 수당을 제외한 신고소득이 기준금액을 넘는지 분리 확인해야 합니다.</small>`;
    } else {
      r.innerHTML=`<strong>판정: 지급정지 가능</strong><small>프로그램 수당을 제외한 신고소득이 기준금액 약 ${t.toFixed(1)}만원을 초과한 것으로 입력되었습니다. 지급정지는 횟수를 별도 관리하며 3회 시 취업지원 전체 중단 사유가 될 수 있습니다.</small>`;
    }
  }

  function injectInto(doc){
    if(!doc || doc.getElementById('kua-lawcheck-v1')) return false;
    const style=doc.createElement('style');style.textContent=CSS;(doc.head||doc.documentElement).appendChild(style);
    const wrap=doc.createElement('div');wrap.innerHTML=html;const node=wrap.firstElementChild;
    const candidates=[
      doc.querySelector('[id*="수당"],[class*="수당"],[id*="benefit"],[class*="benefit"],[id*="allowance"],[class*="allowance"]'),
      doc.querySelector('main'), doc.querySelector('.container'), doc.body
    ].filter(Boolean);
    const target=candidates[0];
    if(target===doc.body) target.appendChild(node); else target.parentNode.insertBefore(node,target.nextSibling);
    ['kuaRound','kuaPlanned','kuaDone','kuaMonthly','kuaIncome','kuaProgram'].forEach(id=>doc.getElementById(id)?.addEventListener('input',render));
    render(); return true;
  }

  function boot(){
    let done=injectInto(document);
    document.querySelectorAll('iframe').forEach(f=>{
      const tryFrame=()=>{try{if(injectInto(f.contentDocument)) done=true;}catch(e){}};
      tryFrame(); f.addEventListener('load',tryFrame,{once:false});
    });
    if(!done){setTimeout(boot,800);}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
