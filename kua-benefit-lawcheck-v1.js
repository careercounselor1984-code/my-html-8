/* KUA allowance legal/manual patch - 2026-08-23 rev3
 * Narrow corrections only. Keeps the original counselor-guide UI and law API module intact.
 * Basis: 2026 국민취업지원제도 업무매뉴얼 + 구직자취업촉진법/시행령.
 */
(function(){
'use strict';
if(window.__KUA_BENEFIT_LAWCHECK_V4__) return;
window.__KUA_BENEFIT_LAWCHECK_V4__=true;
var MEDIAN60=153.8543; // 2026 1인가구 기준중위소득 60%, 단위: 만원
var EPS=0.0001;
function txt(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
function money(v){var n=Math.round(v*10)/10;return String(n).replace(/\.0$/,'')+'만원';}
function all(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}
function strongInfo(title){return all('.info').filter(function(el){var s=el.querySelector('strong');return s&&txt(s.textContent)===title;});}
function setInfo(el,title,body){if(!el)return;el.innerHTML='<strong>'+title+'</strong>'+body;}
function findDetails(parts){return all('details').find(function(d){var s=d.querySelector('summary');var t=txt(s&&s.textContent);return parts.every(function(p){return t.indexOf(p)>=0;});});}
window.calcAllowance=function(suffix){
 suffix=suffix||'';
 var m=document.getElementById('allowMonthly'+suffix),g=document.getElementById('generalIncome'+suffix),p=document.getElementById('programIncome'+suffix),out=document.getElementById('allowCalcOut'+suffix);
 if(!m||!g||!p||!out)return;
 var monthly=Math.max(0,Number(m.value)||0),general=Math.max(0,Number(g.value)||0),program=Math.max(0,Number(p.value)||0),total=general+program,threshold=Math.max(monthly*2,MEDIAN60),head='',detail='';
 if(total<=monthly+EPS){head='예상: 월 지급액 전액 지급 범위';detail='신고소득 '+money(total)+'이 월 단위 지급액 '+money(monthly)+' 이하입니다.';}
 else if(total<threshold-EPS){var pay=Math.min(monthly,Math.max(0,threshold-total));head='예상 감액 지급액: '+money(pay);detail='2026 기준금액 '+money(threshold)+' - 신고소득 '+money(total)+'을 적용한 한도입니다.';}
 else if(Math.abs(total-threshold)<=EPS){head='판정: 0원 지급(부지급)';detail='총 신고소득이 기준금액과 같습니다. 지급정지와 구분하여 처리합니다.';}
 else if(general>threshold+EPS){head='판정: 지급정지 가능';detail='프로그램 참여수당을 제외한 신고소득 '+money(general)+'이 기준금액 '+money(threshold)+'을 초과합니다. 지급정지 횟수는 별도로 관리합니다.';}
 else{head='판정: 0원 지급(부지급)';detail='총 신고소득은 기준금액을 초과하지만 프로그램 참여수당을 제외한 신고소득은 기준금액 이하입니다. 지급정지와 구분합니다.';}
 out.innerHTML='<strong>'+head+'</strong><br>'+detail+'<br><small>※ 소득만 반영한 상담 참고용 계산입니다. 구직활동 일부 이행, 유예·종료 등 다른 제한사유가 있으면 최종 지급액은 달라질 수 있습니다.</small>';
};
var calcCard=document.getElementById('t1-allow-calc');
if(calcCard){
 var helper=calcCard.querySelector('.callout');
 if(helper)helper.innerHTML='<b>상담 참고용</b><br>2026 소득 기준금액은 <b>월 단위 지급액의 2배</b>와 <b>1인가구 기준중위소득 60%(153만 8,543원)</b> 중 더 큰 금액입니다. 일반소득과 프로그램 참여로 발생한 소득을 구분해서 입력하세요.';
 if(!document.getElementById('kua-family-allowance-note')){
  var fam=document.createElement('div');fam.id='kua-family-allowance-note';fam.className='callout green';
  fam.innerHTML='<b>2026 가족수당 핵심</b><br>Ⅰ유형 구직촉진수당 수급자 중 가족수당 대상 부양가족은 <b>1인당 10만원, 월 최대 40만원</b>을 추가 지급합니다. 대상은 수급자격 심사 시 확정된 가구원 중 <b>18세 이하 미성년자·70세 이상 고령자·중증장애인</b>과, 취업지원 신청일 이후 수급자 본인 또는 배우자(사실혼 포함)가 출산한 신생아입니다. <b>중증장애가 있는 미성년자 또는 고령자는 1인당 20만원</b>이며, 지급주기 중 <b>하루라도 요건을 충족하면 해당 지급주기 가족수당 전액</b>을 지급합니다. 같은 부양가족 몫은 2명 이상 신청인이 동시에 받을 수 없고, 부양가족 본인이 Ⅰ유형 참여자인 경우 지급대상에서 제외됩니다.';
  if(helper&&helper.parentNode)helper.parentNode.insertBefore(fam,helper.nextSibling);else calcCard.appendChild(fam);
 }
}
strongInfo('지정일').forEach(function(el){setInfo(el,'지정일','지정일은 수당이 자동 발생하는 날이 아니라 <b>지급신청일</b>입니다. 수당신청서와 구직활동 이행결과를 제출하고 해당 지급주기의 소득·취업 여부 등을 확인한 뒤 지급 여부가 결정됩니다.');});
strongInfo('소득신고는 무조건 먼저').forEach(function(el){setInfo(el,'소득 발생 시 먼저 알리기','알바·일용근로·단시간근로·프리랜서·사업소득·프로그램 수당 등 소득이 생기면 상담사에게 먼저 알리고, <b>지정일의 구직촉진수당 지급신청서에 소득 발생 여부·금액·발생일(기간)</b>을 신고합니다.');});
strongInfo('소득신고').forEach(function(el){var t=txt(el.textContent);if(t.indexOf('알바')>=0||t.indexOf('프리랜서')>=0)setInfo(el,'소득신고','소득이 생기면 상담사에게 먼저 알리고, 지정일 지급신청서에 소득 발생 여부·금액·발생일(기간)을 신고합니다. 취업소득은 취업일자·형태·주 소정근로시간·회사명도 함께 신고합니다.');});
strongInfo('지급정지 누적 주의').forEach(function(el){setInfo(el,'지급정지 누적 주의','프로그램 참여수당을 제외한 신고소득이 기준금액을 초과하여 <b>지급정지</b>가 3회가 되면 수급자격 인정 철회 및 취업지원 중단으로 이어집니다. 소득을 미신고하거나 적게 신고해 수당을 받은 경우에는 별도로 부정수급 처분 대상이 될 수 있습니다.');});
var incomeCard=document.getElementById('t1-income-employ-important');
if(incomeCard&&!document.getElementById('kua-stop-distinction')){var n=document.createElement('div');n.id='kua-stop-distinction';n.className='info blue';n.innerHTML='<strong>지급정지 ≠ 지급중단</strong><b>소득 기준 초과에 따른 지급정지 3회</b>는 수급자격 인정 철회·취업지원 전체 중단, <b>구직활동 미이행에 따른 지급중단 3회</b>는 남은 구직촉진수당 수급권 소멸로 구분합니다. 후자의 경우 취업지원서비스는 남은 기간 계속될 수 있습니다.';var copy=incomeCard.querySelector('.copybox');incomeCard.insertBefore(n,copy||null);}
function patchEmployment(el){setInfo(el,'취업으로 종료되는 지급주기','지급주기 중 <b>① 주 30시간 이상 임금근로자로 취업, ② 사업자등록으로 신규 창업, ③ 월 소득 250만원 이상 노무제공자로 취업</b>하여 취업지원이 종료되면 취·창업일이 포함된 지급주기는 구직활동을 이행한 것으로 인정할 수 있습니다. <b>정규직 여부나 상용 고용보험 가입 자체가 이 인정의 공통 필수요건은 아닙니다.</b> 불완전 취업·본인 희망 종료는 별도 판단합니다.');}
strongInfo('취업이 구직활동으로 인정되는 기준').forEach(patchEmployment);strongInfo('취업 인정은 아무 취업이나 되는 것이 아님').forEach(patchEmployment);
function patchLaborStartup(el){setInfo(el,'노무제공·창업은 종료요건 확인','노무제공자는 <b>월 소득 250만원 이상</b> 여부, 창업은 <b>사업자등록을 통한 신규 창업</b> 여부 등 취업지원 종료요건을 확인합니다. 실제 지급주기 적용은 취·창업일과 종료사유를 함께 확인하세요.');}
strongInfo('프리랜서·창업은 이렇게 봅니다').forEach(patchLaborStartup);strongInfo('프리랜서·창업 기준도 따로 확인').forEach(patchLaborStartup);
if(incomeCard&&!document.getElementById('kua-success-allowance-note')){var success=document.createElement('div');success.id='kua-success-allowance-note';success.className='info purplebox';success.innerHTML='<strong>취업성공수당은 별도 판정</strong>위의 ‘취업으로 지급주기 종료 인정’ 기준과 <b>취업성공수당 지급기준은 다릅니다.</b> 취업성공수당 지급대상자 중 임금근로자는 원칙적으로 <b>주 30시간 이상 근로 + 고용보험 피보험자격</b>을 동시에 충족해야 합니다(고용보험 적용 제외 사업·사업장은 예외 기준 확인). 지급요건을 갖춘 취·창업 후 <b>6개월 근속 시 50만원, 이어 6개월 추가 근속 시 100만원</b>으로 총 150만원을 지급합니다. <b>유예기간 중 취·창업은 취업지원 기간 내 취업에 해당하지 않아 취업성공수당 대상이 아닙니다.</b> 창업·노무제공자는 사업운영·소득 등 별도 지급요건을 확인하세요.';var cp=incomeCard.querySelector('.copybox');incomeCard.insertBefore(success,cp||null);}
var faq2=findDetails(['참여장려수당','전화상담']);
if(faq2){var sum=faq2.querySelector('summary');Array.prototype.slice.call(faq2.children).forEach(function(c){if(c!==sum)c.remove();});var a=document.createElement('div');a.className='ans';a.innerHTML='<span class="tag">2유형</span> 참여장려수당은 IAP 수립일 다음 날부터 1개월 단위로, <b>고용센터 또는 위탁기관에 방문하여 30분 이상 집중취업상담</b>을 한 경우 월 1회 2만원, 최대 5회(총 10만원) 지급합니다. 전화·문자상담이나 외부 출장상담은 방문요건으로 보지 않습니다.';faq2.appendChild(a);}
strongInfo('방문상담').forEach(function(el){var t=txt(el.textContent);if(t.indexOf('2만원')>=0||t.indexOf('참여장려')>=0||t.indexOf('2유형')>=0)setInfo(el,'참여장려수당 방문요건','IAP 수립일 다음 날부터 1개월 단위로 <b>고용센터 또는 위탁기관에 직접 방문해 30분 이상 집중취업상담</b>을 실시한 경우 월 1회 2만원, 최대 5회(총 10만원)입니다. 전화·문자·외부 출장상담은 방문요건으로 보지 않습니다.');});
if(faq2&&!document.getElementById('kua-type2-2026-note')){var note=document.createElement('div');note.id='kua-type2-2026-note';note.className='info blue';note.innerHTML='<strong>2026 수당 변경</strong><b>훈련참여지원수당은 2026년 폐지</b>되어 2025년 취업지원 신청자까지만 종전 기준을 적용합니다.';faq2.parentNode.insertBefore(note,faq2.nextSibling);}
var partial=all('details').find(function(d){var t=txt(d.querySelector('summary')&&d.querySelector('summary').textContent);return t.indexOf('구직활동')>=0&&(t.indexOf('적게')>=0||t.indexOf('일부')>=0||t.indexOf('못')>=0);});
if(partial){var sm=partial.querySelector('summary');Array.prototype.slice.call(partial.children).forEach(function(c){if(c!==sm)c.remove();});var pa=document.createElement('div');pa.className='ans';pa.innerHTML='계획한 구직활동의 <b>50% 이상을 이행하면 해당 지급주기 월 지급액의 50%를 지급</b>하고, <b>50% 미만이면 전액 부지급</b>합니다. 정당한 사유·유예·취업종료 등 별도 사유가 있으면 그 기준을 함께 확인합니다.';partial.appendChild(pa);}
var imgCard=document.getElementById('type1IncomeImageCard');if(imgCard){var sp=imgCard.querySelector('.img-head span');if(sp&&txt(sp.textContent).indexOf('2026 최신')<0)sp.textContent=txt(sp.textContent)+' · 2026 최신 판정은 아래 텍스트·계산기 우선';}
all('[id^="allowMonthly"]').forEach(function(el){var suffix=el.id.slice('allowMonthly'.length);try{window.calcAllowance(suffix);}catch(e){}});
})();