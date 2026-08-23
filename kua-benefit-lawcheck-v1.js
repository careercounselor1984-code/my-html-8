/* KUA allowance legal/manual patch - 2026-08-23
 * Applies narrow corrections to the existing counselor guide without replacing its UI.
 * Basis: 2026 국민취업지원제도 업무매뉴얼 / 구직자취업촉진법 체계.
 */
(function(){
'use strict';
if(window.__KUA_BENEFIT_LAWCHECK_V2__) return;
window.__KUA_BENEFIT_LAWCHECK_V2__=true;
var MEDIAN60=153.8543; // 2026 1인가구 기준중위소득 60%, 단위: 만원
var EPS=0.0001;
function txt(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
function money(v){var n=Math.round(v*10)/10;return String(n).replace(/\.0$/,'')+'만원';}
function all(sel,root){return Array.prototype.slice.call((root||document).querySelectorAll(sel));}
function strongInfo(title){return all('.info').filter(function(el){var s=el.querySelector('strong');return s&&txt(s.textContent)===title;});}
function setInfo(el,title,body){if(!el)return;el.innerHTML='<strong>'+title+'</strong>'+body;}
function findDetails(parts){return all('details').find(function(d){var s=d.querySelector('summary');var t=txt(s&&s.textContent);return parts.every(function(p){return t.indexOf(p)>=0;});});}
function replaceContaining(needle,html){all('div,p,span,small,li').forEach(function(el){if(el.children.length>3)return;var t=txt(el.textContent);if(t.indexOf(needle)>=0)el.innerHTML=html;});}

// 1) 2026 소득 감액·0원 지급·지급정지 계산식 교체
window.calcAllowance=function(suffix){
 suffix=suffix||'';
 var m=document.getElementById('allowMonthly'+suffix),g=document.getElementById('generalIncome'+suffix),p=document.getElementById('programIncome'+suffix),out=document.getElementById('allowCalcOut'+suffix);
 if(!m||!g||!p||!out)return;
 var monthly=Number(m.value)||0, general=Math.max(0,Number(g.value)||0), program=Math.max(0,Number(p.value)||0);
 var total=general+program;
 var threshold=Math.max(monthly*2,MEDIAN60);
 var head='',detail='';
 if(total<=monthly+EPS){
   head='예상: 월 지급액 전액 지급 범위';
   detail='신고소득 '+money(total)+'이 월 단위 지급액 '+money(monthly)+' 이하입니다.';
 }else if(total<threshold-EPS){
   var pay=Math.min(monthly,Math.max(0,threshold-total));
   head='예상 감액 지급액: '+money(pay);
   detail='2026 기준금액 '+money(threshold)+' - 신고소득 '+money(total)+'을 적용한 한도입니다.';
 }else if(Math.abs(total-threshold)<=EPS){
   head='판정: 0원 지급(부지급)';
   detail='총 신고소득이 기준금액과 같습니다. 지급정지와 구분하여 처리합니다.';
 }else if(general>threshold+EPS){
   head='판정: 지급정지 가능';
   detail='프로그램 참여수당을 제외한 신고소득 '+money(general)+'이 기준금액 '+money(threshold)+'을 초과합니다. 지급정지 횟수는 별도로 관리합니다.';
 }else{
   head='판정: 0원 지급(부지급)';
   detail='총 신고소득은 기준금액을 초과하지만, 프로그램 참여수당을 제외한 신고소득이 기준금액을 초과하지 않습니다. 지급정지와 구분합니다.';
 }
 out.innerHTML='<strong>'+head+'</strong><br>'+detail+'<br><small>※ 소득만 반영한 계산입니다. 구직활동 일부 이행(50% 지급) 등 다른 제한사유가 함께 있으면 최종 지급액은 더 낮아질 수 있습니다.</small>';
};

// 기존 도움말의 잘못된 기준선 문구 정정
replaceContaining('기준선은 월 지급예정액의 2배','<strong>2026 소득 기준금액</strong> 월 단위 지급액의 2배와 1인가구 기준중위소득 60%(153만 8,543원) 중 더 큰 금액을 적용합니다.');
replaceContaining('월 지급예정액의 2배','<strong>2026 소득 기준금액</strong> 월 단위 지급액의 2배와 1인가구 기준중위소득 60%(153만 8,543원) 중 더 큰 금액을 적용합니다.');

// 2) 지정일·소득 신고 표현 정정
strongInfo('지정일').forEach(function(el){setInfo(el,'지정일','지정일은 수당이 자동 발생하는 날이 아니라 <b>지급신청일</b>입니다. 수당신청서와 구직활동 이행결과를 제출하고, 해당 지급주기의 소득·취업 여부 등을 확인한 뒤 지급 여부가 결정됩니다.');});
strongInfo('소득신고는 무조건 먼저').forEach(function(el){setInfo(el,'소득 발생 시 먼저 알리기','알바·일용근로·단시간근로·프리랜서·사업소득·프로그램 수당 등 소득이 생기면 금액이 작아도 상담사에게 먼저 알리고, <b>지정일의 구직촉진수당 지급신청서에 소득 발생 여부·금액·발생일(기간)</b>을 신고합니다.');});
strongInfo('소득신고').forEach(function(el){var t=txt(el.textContent);if(t.indexOf('알바')>=0||t.indexOf('프리랜서')>=0)setInfo(el,'소득신고','소득이 생기면 상담사에게 먼저 알리고, 지정일 지급신청서에 소득 발생 여부·금액·발생일(기간)을 신고합니다. 취업소득은 취업일자·형태·주 소정근로시간·회사명도 함께 신고합니다.');});

// 3) 지급정지 누적 문구: 미신고와 지급정지를 혼동하지 않도록 분리
strongInfo('지급정지 누적 주의').forEach(function(el){setInfo(el,'지급정지 누적 주의','프로그램 참여수당을 제외한 신고소득이 기준금액을 초과하여 <b>지급정지</b>가 3회가 되면 수급자격 인정 철회 및 취업지원 중단으로 이어집니다. 소득을 미신고하거나 적게 신고해 수당을 받은 경우에는 별도로 부정수급 처분 대상이 될 수 있습니다.');});

// 4) 취업으로 종료되는 지급주기 인정 요건 정정
strongInfo('취업 인정은 아무 취업이나 되는 것이 아님').forEach(function(el){setInfo(el,'취업으로 종료되는 지급주기','지급주기 중 <b>① 주 30시간 이상 임금근로자로 취업, ② 신규 창업(사업자등록), ③ 월 소득 250만원 이상 노무제공자로 취업</b>하여 취업지원이 종료되면 취·창업일이 포함된 지급주기는 구직활동을 이행한 것으로 인정할 수 있습니다. 정규직 여부나 상용 고용보험 가입 자체가 이 인정의 공통 필수요건은 아닙니다. 불완전 취업·본인 희망 종료는 별도 판단합니다.');});
strongInfo('프리랜서·창업 기준도 따로 확인').forEach(function(el){setInfo(el,'노무제공·창업은 종료요건 확인','노무제공자는 월 소득 250만원 이상 여부, 창업은 사업자등록 등 취업지원 종료요건을 확인합니다. 실제 지급주기 적용은 취·창업일과 종료사유를 함께 확인하세요.');});

// 5) 지급정지와 지급중단 구분을 기존 1유형 핵심 카드에 짧게 추가
var incomeCard=document.getElementById('t1-income-employ-important');
if(incomeCard&&!document.getElementById('kua-stop-distinction')){
 var n=document.createElement('div');n.id='kua-stop-distinction';n.className='info blue';n.innerHTML='<strong>지급정지 ≠ 지급중단</strong><b>소득 기준 초과에 따른 지급정지 3회</b>는 수급자격 인정 철회·취업지원 전체 중단, <b>구직활동 미이행에 따른 지급중단 3회</b>는 남은 구직촉진수당 수급권 소멸로 구분합니다. 후자의 경우 취업지원서비스는 남은 기간 계속될 수 있습니다.';
 var copy=incomeCard.querySelector('.copybox');incomeCard.insertBefore(n,copy||null);
}

// 6) 2유형 참여장려수당의 방문·30분 요건과 2026 폐지수당 명시
var faq2=findDetails(['참여장려수당','전화상담']);
if(faq2){var sum=faq2.querySelector('summary');var children=Array.prototype.slice.call(faq2.children);children.forEach(function(c){if(c!==sum)c.remove();});var a=document.createElement('div');a.className='faq-answer';a.innerHTML='<span class="tag">2유형</span> 참여장려수당은 IAP 수립일 다음 날부터 1개월 단위로, <b>고용센터 또는 위탁기관에 방문하여 30분 이상 집중취업상담</b>을 한 경우 월 1회 2만원, 최대 5회(총 10만원) 지급합니다. 전화·문자상담이나 외부 출장상담은 방문요건으로 보지 않습니다.';faq2.appendChild(a);}
strongInfo('방문상담').forEach(function(el){var t=txt(el.textContent);if(t.indexOf('2만원')>=0||t.indexOf('참여장려')>=0||t.indexOf('2유형')>=0)setInfo(el,'참여장려수당 방문요건','IAP 수립일 다음 날부터 1개월 단위로 <b>고용센터 또는 위탁기관에 직접 방문해 30분 이상 집중취업상담</b>을 실시한 경우 월 1회 2만원, 최대 5회(총 10만원)입니다. 전화·문자·외부 출장상담은 방문요건으로 보지 않습니다.');});
if(faq2&&!document.getElementById('kua-type2-2026-note')){var note=document.createElement('div');note.id='kua-type2-2026-note';note.className='info blue';note.innerHTML='<strong>2026 수당 변경</strong><b>훈련참여지원수당은 2026년 폐지</b>되어 2025년 취업지원 신청자까지만 종전 기준을 적용합니다.';faq2.parentNode.insertBefore(note,faq2.nextSibling);}

// 7) 구직활동 일부 이행 FAQ를 50% 기준으로 정확화
var partial=all('details').find(function(d){var t=txt(d.querySelector('summary')&&d.querySelector('summary').textContent);return t.indexOf('구직활동')>=0&&(t.indexOf('적게')>=0||t.indexOf('일부')>=0||t.indexOf('못')>=0);});
if(partial){var sm=partial.querySelector('summary');Array.prototype.slice.call(partial.children).forEach(function(c){if(c!==sm)c.remove();});var pa=document.createElement('div');pa.className='faq-answer';pa.innerHTML='계획한 구직활동의 <b>50% 이상을 이행하면 해당 지급주기 월 지급액의 50%를 지급</b>하고, <b>50% 미만이면 전액 부지급</b>합니다. 다만 정당한 사유·유예·취업종료 등 별도 사유가 있으면 그 기준을 함께 확인합니다.';partial.appendChild(pa);}

// 8) 재진단 이미지와 텍스트가 충돌하지 않도록 최신 텍스트 우선 표시
var imgCard=document.getElementById('type1IncomeImageCard');if(imgCard){var sp=imgCard.querySelector('.img-head span');if(sp&&txt(sp.textContent).indexOf('2026 최신')<0)sp.textContent=txt(sp.textContent)+' · 2026 최신 판정은 아래 텍스트·계산기 우선';}

// 현재 화면의 모든 소득 계산기를 새 공식으로 즉시 재계산
all('[id^="allowMonthly"]').forEach(function(el){var suffix=el.id.slice('allowMonthly'.length);try{window.calcAllowance(suffix);}catch(e){}});
})();