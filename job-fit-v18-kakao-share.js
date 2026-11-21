/* 채용정보 도우미: 공고 카드에서 카카오톡 공유창 바로 열기.
 * 중간 공유 페이지 없이 기존 8개 항목과 원문 링크만 사용.
 * 카카오 SDK 로드 전 버튼을 눌렀으면 자동 팝업 재시도 대신 안내.
 */
(function(){
"use strict";
const frame=document.getElementById("app");
if(!frame)return;
const SDK_URL="https://t1.kakaocdn.net/kakao_js_sdk/2.8.5/kakao.min.js";
const SDK_INTEGRITY="sha384-v6JKY3z4FUkWq21oZDHZe74YvuPk/WUrVLrDHTBojHXClOSa3iXy7sCXPY1jkFbj";
const CONFIG_URL=new URL("../my-html-4/kakao-share-config.js?v=20261121-config",location.href).href;
const allowed=["work24.go.kr","work.go.kr","job.alio.go.kr","alio.go.kr","cleaneye.go.kr","saramin.co.kr","jobkorea.co.kr","alba.co.kr","incruit.com"];
let sdkPromise=null;
let observedDocument=null;
function script(src,integrity){
 return new Promise((resolve,reject)=>{
  const s=document.createElement("script");s.src=src;s.async=true;
  if(integrity){s.integrity=integrity;s.crossOrigin="anonymous"}
  s.onload=resolve;s.onerror=()=>reject(Error("카카오 공유 스크립트를 불러오지 못했어."));
  document.head.appendChild(s);
 });
}
function prepare(){
 if(sdkPromise)return sdkPromise;
 sdkPromise=Promise.all([
  window.GOODJOB_KAKAO_JS_KEY?Promise.resolve():script(CONFIG_URL),
  window.Kakao?.Share?Promise.resolve():script(SDK_URL,SDK_INTEGRITY)
 ]).then(()=>{
  const key=String(window.GOODJOB_KAKAO_JS_KEY||"").trim();
  const sdk=window.Kakao;
  if(!key||!sdk||typeof sdk.init!=="function"||typeof sdk.isInitialized!=="function")
   throw Error("카카오 공유 초기화 정보를 확인하지 못했어.");
  if(!sdk.isInitialized())sdk.init(key);
  if(typeof sdk.Share?.sendDefault!=="function")throw Error("카카오 공유 모듈이 없어.");
  return sdk;
 }).catch(err=>{sdkPromise=null;throw err});
 return sdkPromise;
}
const clean=v=>String(v??"").replace(/\s+/g," ").trim();
function validSource(raw){
 try{
  if(!raw||raw.length>2500)return null;
  const u=new URL(raw);
  if(u.protocol!=="https:"||u.username||u.password||(u.port&&u.port!=="443"))return null;
  return allowed.some(host=>u.hostname===host||u.hostname.endsWith("."+host))?u:null;
 }catch{return null}
}
function readOriginal(text,job){
 const m=String(text||"").match(/(?:^|\n)\s*🔗\s*(https:\/\/[^\s]+)/);
 const candidates=[m?.[1],job?.official_url,job?.source_url,job?.url,job?.link];
 for(const candidate of candidates){const result=validSource(clean(candidate));if(result)return result}
 return null;
}
function buildText(original){
 const raw=String(original||"").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 const tags=["📢","🏢","🛠️","📍","👤","📄","🕒","💰"];
 const caps=[45,30,38,36,23,34,34,22];
 const lines=tags.map((icon,i)=>{
  const line=raw.find(s=>s.startsWith(icon));
  const val=clean(line?line.slice(icon.length):"미확인")||"미확인";
  const chars=Array.from(val);
  return icon+" "+(chars.length>caps[i]?chars.slice(0,caps[i]-1).join("").trimEnd()+"…":val);
 });
 let result=lines.join("\n"),guard=0;
 while(result.length>200&&guard++<400){
  const candidates=lines.map((line,i)=>({i,n:Array.from(line).length})).filter(x=>x.n>11).sort((a,b)=>b.n-a.n);
  if(!candidates.length)break;
  const index=candidates[0].i;
  const chars=Array.from(lines[index]);
  if(chars.at(-1)==="…")chars.pop();
  chars.pop();
  lines[index]=chars.join("").trimEnd()+"…";
  result=lines.join("\n");
 }
 if(result.length>200)throw Error("카카오 공유용 문구가 너무 길어.");
 return result;
}
function feedback(btn,message,error){
 const box=btn.parentElement?.querySelector(".gjKakaoShareStatus");
 if(box){box.textContent=message;box.style.color=error?"#b91c1c":"#166534"}
}
function doShare(btn){
 const card=btn.closest(".v166Item");
 const textarea=card?.querySelector(".v174Compact textarea");
 if(!card||!textarea){feedback(btn,"공고 문구를 찾을 수 없어.",true);return}
 let jobs=[];
 try{jobs=Array.isArray(frame.contentWindow?.jobs)?frame.contentWindow.jobs:[]}catch{}
 const job=jobs.find(x=>x.job_key===card.dataset.k)||null;
 const original=readOriginal(textarea.value,job);
 if(!original){feedback(btn,"원문 공고 링크가 없어. 복사용 문구의 🔗 주소를 확인해 줘.",true);return}
 const sdk=window.Kakao;
 if(!sdk||!sdk.isInitialized?.()||typeof sdk.Share?.sendDefault!=="function"){
  feedback(btn,"카카오 공유 준비 중이야. 버튼을 다시 눌러 줘.",true);
  prepare().catch(err=>feedback(btn,"카카오 연결 실패: "+(err?.message||String(err)),true));
  return;
 }
 try{
  const text=buildText(textarea.value);
  const redirect=new URL("./job-open.html",location.href);
  redirect.searchParams.set("to",original.href);
  const link=redirect.href;
  sdk.Share.sendDefault({
   objectType:"text",text,
   link:{mobileWebUrl:link,webUrl:link},
   buttons:[{title:"원문 공고 보기",link:{mobileWebUrl:link,webUrl:link}}]
  });
  feedback(btn,"카카오톡에서 보낼 상대를 선택해 줘.",false);
 }catch(err){feedback(btn,"카카오 공유 오류: "+(err?.message||String(err)),true)}
}
function addButton(actions){
 if(actions.querySelector(".gjKakaoDirectBtn"))return;
 const btn=actions.ownerDocument.createElement("button");
 btn.type="button";btn.className="btn gjKakaoDirectBtn";btn.textContent="💬 카카오톡 공유";
 btn.style.cssText="background:#fee500!important;color:#332b00!important;border:1px solid #e4c600!important;border-radius:7px;font-weight:850;cursor:pointer";
 const status=actions.ownerDocument.createElement("span");
 status.className="gjKakaoShareStatus";status.style.cssText="font-size:11px;align-self:center;line-height:1.4";
 actions.append(btn,status);
 btn.addEventListener("click",event=>{
  event.preventDefault();event.stopPropagation();doShare(btn);
 });
}
function setup(){
 let doc;
 try{doc=frame.contentDocument}catch{return}
 if(!doc?.body||doc===observedDocument)return;
 observedDocument=doc;
 const scan=root=>{
  if(root.matches?.(".v174CompactActions"))addButton(root);
  root.querySelectorAll?.(".v174CompactActions").forEach(addButton);
 };
 scan(doc.body);
 const observer=new MutationObserver(records=>{
  for(const record of records)
   for(const node of record.addedNodes)
    if(node.nodeType===1)scan(node);
 });
 observer.observe(doc.body,{childList:true,subtree:true});
}
frame.addEventListener("load",setup);
if(frame.contentDocument?.readyState==="complete")setup();
prepare().catch(err=>console.warn("[채용정보 카카오 공유] 초기화 대기:",err?.message||err));
})();
