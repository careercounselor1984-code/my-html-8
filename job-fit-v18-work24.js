(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  const inject=()=>{
    const d=frame.contentDocument;
    if(!d||!d.body||d.getElementById('work24LivePatch'))return;
    const s=d.createElement('script');
    s.id='work24LivePatch';
    s.textContent=`(()=>{
      const W24_API="https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-proxy";
      const W24_CACHE=new Map();
      let w24Seq=0,w24Timer=null;
      const W24_REGION={"서울특별시":"11000","부산광역시":"26000","대구광역시":"27000","인천광역시":"28000","광주광역시":"29000","대전광역시":"30000","울산광역시":"31000","경기도":"41000","강원특별자치도":"42000","충청북도":"43000","충청남도":"44000","전북특별자치도":"45000","전라남도":"46000","경상북도":"47000","경상남도":"48000","제주특별자치도":"50000","세종특별자치시":"36110"};
      const W24_SYNONYMS={
        "전기":["전기","전력","계전","전장","전기설비","전기통신","PLC","AMI"],
        "생산":["생산","제조","오퍼레이터","operator","조립","가공"],
        "품질":["품질","품질관리","QA","QC","검사"],
        "설비":["설비","설비보전","정비","유지보수","maintenance","공무"],
        "보전":["설비보전","정비","유지보수","maintenance","공무"],
        "회계":["회계","재무","경리","세무"]
      };
      const w24Style=document.createElement("style");
      w24Style.textContent=".pill.work24{background:#eafaf3;color:#067647;font-weight:900}.w24src{margin-top:10px;padding:10px 12px;border-radius:10px;background:#f0fdf4;color:#166534;font-size:11px;line-height:1.6}.w24loading{padding:10px 12px;border-radius:10px;background:#eff8ff;color:#175cd3;font-size:12px}";
      document.head.appendChild(w24Style);

      const baseSourceBadge=sourceBadge;
      sourceBadge=function(j){return j?.source==="WORK24"?'<span class="pill work24">고용24</span>':baseSourceBadge(j)};
      const baseRoles=roles;
      roles=function(j){if(j?.source==="WORK24")return j.recruit_field?[j.recruit_field]:[];return baseRoles(j)};
      const baseRoleText=roleText;
      roleText=function(j,r){if(j?.source!=="WORK24")return baseRoleText(j,r);return[
        j.recruit_field?"모집직종: "+j.recruit_field:"",
        (j.ncs_names||[]).length?"관련직종: "+j.ncs_names.join(", "):"",
        j.job_detail?"직무내용: "+j.job_detail:"",
        j.education_raw?"학력: "+j.education_raw:"",
        j.w24_career?"경력: "+j.w24_career:"",
        j.w24_major?"전공: "+j.w24_major:"",
        j.certifications?"자격면허: "+j.certifications:"",
        j.preference?"우대사항: "+j.preference:"",
        (j.regions||[]).length?"근무지역: "+j.regions.join(", "):""
      ].filter(Boolean).join("\n")};

      function w24Keywords(q){
        const text=String(q||"").trim();
        if(!text)return[];
        const out=[];
        for(const [key,vals] of Object.entries(W24_SYNONYMS))if(N(text).includes(N(key)))out.push(...vals);
        if(!out.length)out.push(...text.split(/[|,/]+/).map(x=>x.trim()).filter(x=>x.length>=2));
        return [...new Set(out)].slice(0,8)
      }
      function w24RegionCode(){return W24_REGION[$("sidoFilter")?.value]||""}
      function normalizeW24(x){
        const wanted=String(x.wantedAuthNo||"");
        const rel=String(x.relatedJobs||"").split(/[,/|]/).map(v=>v.trim()).filter(Boolean);
        const qual=[x.education?"학력: "+x.education:"",x.career?"경력: "+x.career:"",x.major?"전공: "+x.major:"",x.certificate?"자격면허: "+x.certificate:"",x.otherGuide?"기타안내: "+x.otherGuide:""] .filter(Boolean).join("\n");
        return{
          ...x,source:"WORK24",job_key:"W24:"+(wanted||x.url||Math.random()),company:x.company||"",title:x.title||"",
          regions:[x.region].filter(Boolean),region_name:x.region||"",workplace:x.region||"",employment_type:x.employmentType||"",
          education_raw:x.education||"",qualification:qual,preference:x.preference||"",ncs_names:rel,recruit_field:x.jobsNm||"",
          job_detail:x.jobContent||"",certifications:x.certificate||"",salary:x.pay||"",end_date:x.closeDate||"",source_url:x.url||"",
          first_seen_at:x.registeredDate||new Date().toISOString(),open:true,w24_career:x.career||"",w24_major:x.major||"",
          w24_detail_loaded:!!x.detailLoaded,w24_source_notice:x.sourceNotice||"본 자료는 고용노동부 고용24에서 제공된 채용정보입니다."
        }
      }
      async function w24Call(body){
        const r=await fetch(W24_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
        const text=await r.text();let data;
        try{data=JSON.parse(text)}catch{throw Error("고용24 서버 응답 해석 실패")}
        if(!r.ok||!data.ok)throw Error(data.error||("고용24 HTTP "+r.status));
        return data
      }
      async function ensureW24(force=false){
        const q=String($("q")?.value||"").trim(),sf=$("sourceFilter")?.value||"ALL";
        if(sf!=="WORK24"&&sf!=="ALL")return[];
        if(q.length<2){if(sf==="WORK24")$("sourceNotice").innerHTML='<div class="box"><b>고용24 실시간 연결됨</b><br>직무·공고 검색어를 2글자 이상 입력하면 고용24 상세정보까지 조회합니다.</div>';return[]}
        const keys=w24Keywords(q);if(!keys.length)return[];
        const cacheKey=keys.join("|")+"|"+w24RegionCode();
        if(!force&&W24_CACHE.has(cacheKey))return W24_CACHE.get(cacheKey);
        const seq=++w24Seq;
        if(sf==="WORK24")$("pick").innerHTML='<div class="w24loading">고용24 실시간 공고를 조회하고 상세 자격정보를 확인하는 중입니다.</div>';
        try{
          const data=await w24Call({action:"recommend_jobs",keywords:keys,regionCode:w24RegionCode(),limit:20,perKeyword:14,includeDetails:true});
          if(seq!==w24Seq)return[];
          const rows=(data.jobs||[]).map(normalizeW24);
          W24_CACHE.set(cacheKey,rows);
          jobs=jobs.filter(j=>j.source!=="WORK24").concat(rows);
          $("sourceNotice").innerHTML='<div class="ok"><b>고용24 실시간 연결됨 · '+rows.length+'건</b><br>목록 검색 후 상세 API의 모집직종·직무내용·학력·경력·자격면허·근무예정지를 함께 확인합니다.</div>';
          return rows
        }catch(e){
          if(seq!==w24Seq)return[];
          $("sourceNotice").innerHTML='<div class="warn"><b>고용24 일시 조회 실패</b><br>'+E(e.message)+'<br>ALIO·클린아이 기존 분석에는 영향이 없습니다.</div>';
          return[]
        }
      }

      const baseReqSummary=requirementSummary;
      requirementSummary=function(j,r){if(j?.source!=="WORK24")return baseReqSummary(j,r);const basic=[],must=[],pref=[];
        if(j.employment_type)basic.push("고용형태: "+j.employment_type);
        if(j.education_raw)basic.push("학력: "+j.education_raw);
        if(j.w24_career)basic.push("경력: "+j.w24_career);
        if((j.regions||[]).length)basic.push("근무지역: "+j.regions.join(", "));
        if(j.salary)basic.push("급여: "+j.salary);
        const cert=String(j.certifications||"");
        if(/필수|반드시|소지자만|자격증.*필요/.test(cert))must.push("자격면허: "+cert);else if(cert)pref.push("자격면허: "+cert);
        const career=String(j.w24_career||"");if(career&&!/무관|신입/.test(career)){if(/필수|경력만|경력자/.test(career)&&!/우대/.test(career))must.push("경력: "+career);else pref.push("경력: "+career)}
        if(j.w24_major)pref.push("관련 전공: "+j.w24_major);
        if(j.preference)pref.push(...splitClauses(j.preference));
        if(!must.length)must.push("상세 필수요건은 고용24 공고에서 최종 확인");
        if(!pref.length)pref.push("별도 우대조건은 상세 공고 확인");
        return{basic:basic.length?basic:["고용24 상세 기본정보 확인"],must:[...new Set(must)].slice(0,7),pref:[...new Set(pref)].slice(0,7),raw:roleText(j,r),note:"고용24 상세 API 기준입니다. 최종 지원조건·접수상태는 고용24 상세페이지를 확인하세요."}
      };
      function w24MinEdu(v){const n=N(v);if(!n||n.includes("무관"))return"무관";const first=String(v).split(/[-~]/)[0];if(/석사/.test(first))return"석사";if(/대졸\(4년\)|4년/.test(first))return"대졸";if(/대졸\(2~3년\)|전문대/.test(first))return"전문대졸";if(/고졸/.test(first))return"고졸";return"무관"}
      function w24RequiredMonths(v){const t=String(v||"");if(/우대|무관|신입/.test(t))return 0;let m=t.match(/(\d+)\s*년\s*(\d+)?\s*개월?\s*(?:이상|필수|경력)/);if(m)return(+m[1])*12+(+m[2]||0);m=t.match(/(\d+)\s*개월\s*(?:이상|필수|경력)/);return m?+m[1]:0}
      function analyzeW24(p,j,ro){const rows=[],hard=[],verify=[],minItems=[],midItems=[],maxItems=[];let strength=0;const add=(s,k,d)=>rows.push([s,k,d]);
        add("ok","공고출처","고용24 상세 API 공고");
        const ed=w24MinEdu(j.education_raw);if(ed==="무관"){add("ok","학력","학력 무관/제한 없음");minItems.push("학력 제한 없음")}else if((ER[p.edu]||0)>=(ER[ed]||0)){add("ok","학력",ed+" 이상 최소학력 충족 가능");minItems.push(ed+" 이상");strength++}else{add("bad","학력",ed+" 이상 최소학력 필요");hard.push("학력");minItems.push(ed+" 이상")}
        const need=w24RequiredMonths(j.w24_career);if(need){minItems.push("관련경력 "+need+"개월 이상");if(p.exp>=need){add("ok","경력",need+"개월 이상 충족");strength+=2}else{add("bad","경력",need+"개월 이상 필요 / 현재 "+p.exp+"개월");hard.push("경력")}}else if(j.w24_career&&/우대/.test(j.w24_career)){add("na","경력","경력은 우대조건으로 표시됨");midItems.push("경력우대: "+j.w24_career);if(p.exp>0)strength++}else{add("na","경력",j.w24_career||"필수 경력 제한 자동 식별 없음");if(p.exp>=12)strength+=2;else if(p.exp>0)strength++}
        const cert=String(j.certifications||"");if(cert){const hits=p.certs.filter(c=>N(cert).includes(N(c)));if(/필수|반드시|소지자만|자격증.*필요/.test(cert)){minItems.push("필수 자격면허 확인");if(hits.length){add("ok","자격/면허","보유자격이 필수 자격문구와 일치");strength+=2}else{add("warn","자격/면허","필수 자격 표현이 있어 보유자격과 상세 대조 필요");verify.push("필수 자격/면허")}}else{add(hits.length?"ok":"na","자격/면허",hits.length?"보유자격이 공고 자격면허 문구와 일치":"자격면허는 필수로 명시되지 않음/우대 가능");midItems.push("자격면허: "+cert);if(hits.length)strength++}}else add("na","자격/면허","별도 자격면허 자동 확인 없음");
        if(j.w24_major){if(p.major&&N(j.w24_major).includes(N(p.major))){add("ok","전공","관련 전공 문구와 입력 전공이 일치");strength++}else{add("warn","전공","관련 전공 조건/우대 여부 상세 확인 필요");verify.push("전공 조건")}midItems.push("관련 전공: "+j.w24_major)}else add("na","전공","전공 제한 자동 확인 없음");
        if(j.preference){midItems.push("우대사항: "+j.preference);if(p.certs.some(c=>N(j.preference).includes(N(c))))strength++}
        if(j.job_detail)midItems.push("직무내용과 연결되는 경험·성과 정리");
        if(p.exp>=12)midItems.push("관련 경험 1년 이상 활용");else midItems.push("관련 프로젝트·실무경험 보강");
        maxItems.push("고용24 상세 필수요건 전부 충족","주요 우대조건 복수 충족","모집직종과 직접 연결되는 경력·프로젝트·성과 보유","서류·면접에서 직무적합성을 사례로 설명 가능");
        if(!j.w24_detail_loaded){add("warn","상세정보","일부 상세정보를 불러오지 못해 고용24 원문 확인 필요");verify.push("고용24 상세 공고")}
        const tier=hard.length?0:(strength>=6?3:strength>=3?2:1);return{rows,hard:[...new Set(hard)],verify:[...new Set(verify)],tier,minItems:[...new Set(minItems.length?minItems:["고용24 상세 필수요건 확인"])],midItems:[...new Set(midItems)].slice(0,5),maxItems}
      }
      const baseAnalyze=analyze;analyze=function(p,j,ro){return j?.source==="WORK24"?analyzeW24(p,j,ro):baseAnalyze(p,j,ro)};

      const baseChoose=choose;choose=function(k){baseChoose(k);if(sel?.source==="WORK24"&&$("jobinfo")){const box=document.createElement("div");box.className="w24src";box.innerHTML='<b>출처: 고용24</b><br>목록+상세 API 정보를 분석에 사용했습니다. 최종 지원자격·업무·접수상태는 고용24 원문을 확인하세요.';$("jobinfo").appendChild(box)}};
      const baseShareText=shareText;shareText=function(){const t=baseShareText();return sel?.source==="WORK24"?t+"\n※ 자료출처: 고용노동부 고용24":t};

      function localRows(){const sf=$("sourceFilter").value,qq=N($("q").value);return jobs.filter(isOpen).filter(j=>(sf==="ALL"||j.source===sf)&&rmatch(j)&&(!qq||N([j.company,j.title,(j.ncs_names||[]).join(" "),j.recruit_field||"",j.job_detail||"",j.qualification||""].join(" ")).includes(qq))).sort((a,b)=>String(a.end_date||"99999999").localeCompare(String(b.end_date||"99999999"))).slice(0,180)}
      renderPick=function(){const sf=$("sourceFilter").value;if(sf==="SARAMIN"){$("pick").innerHTML='<div class="sub">사람인 API 승인 대기중입니다.</div>';return}const xs=localRows();$("pick").innerHTML=xs.length?xs.map(j=>card(j,true)).join(""):(String($("q").value||"").trim().length<2&&sf==="WORK24"?'<div class="sub">고용24 검색은 직무·공고 검색어를 2글자 이상 입력하세요.</div>':'<div class="sub">선택한 조건의 진행중 공고가 없습니다.</div>');document.querySelectorAll("#pick .pick").forEach(el=>el.addEventListener("click",()=>choose(el.dataset.k)))};
      async function liveRender(force=false){const sf=$("sourceFilter").value;if(sf==="WORK24"||sf==="ALL")await ensureW24(force);renderPick()}
      function connectedNotice(){const sf=$("sourceFilter").value;if(sf==="WORK24"){$("sourceNotice").innerHTML='<div class="box"><b>고용24 실시간 연결됨</b><br>검색어 2글자 이상 입력 시 상세 API까지 조회합니다.</div>'}else if(sf==="SARAMIN"){$("sourceNotice").innerHTML='<div class="warn"><b>사람인 API 승인 대기중</b><br>승인 후 대기업·중견기업 공고가 추가됩니다.</div>'}else $("sourceNotice").innerHTML=""}
      const sfEl=$("sourceFilter");if(sfEl){const opt=[...sfEl.options].find(o=>o.value==="WORK24");if(opt)opt.textContent="고용24 실시간";sfEl.addEventListener("change",()=>{connectedNotice();liveRender()})}
      const qEl=$("q");if(qEl)qEl.addEventListener("input",()=>{clearTimeout(w24Timer);w24Timer=setTimeout(()=>liveRender(),320)});
      $("sidoFilter")?.addEventListener("change",()=>{W24_CACHE.clear();liveRender()});$("sigunguFilter")?.addEventListener("change",renderPick);
      const sub=document.querySelector("header .sub");if(sub)sub.textContent="ALIO + 클린아이 + 고용24 실시간 · 시/도→구·군 검색 · 직무별 자격분석 · 맞춤공고 추천 · GPT 지원전략";

      const mb2=$("matchBtn");if(mb2)mb2.addEventListener("click",async()=>{const sf=$("sourceFilter").value;if(sf==="SARAMIN")return;if((sf==="WORK24"||sf==="ALL")&&String($("q").value||"").trim().length>=2)await ensureW24();let a=[];for(const j of jobs.filter(isOpen).filter(j=>(sf==="ALL"||j.source===sf)&&rmatch(j))){let rs=roles(j);if(!rs.length&&j.source==="CLEANEYE")rs=[j.recruit_field||"공고문 확인"];for(const ro of rs.slice(0,20))a.push(one(j,ro))}a.sort((x,y)=>y.sc-x.sc||String(x.j.end_date||"").localeCompare(String(y.j.end_date||"")));a=a.slice(0,25);mr.innerHTML='<div class="card"><h2>🎯 내 조건에 맞는 공고</h2><div class="sub">기존 판정엔진을 유지하며 고용24 공고는 상세 API 요건을 별도 분석합니다.</div>'+a.map(m=>{const v=m.a.hard.length?"조건 미충족 가능":m.a.verify.length?"지원 가능성 있음 · 확인 필요":"지원 가능성 높음",c=m.a.hard.length?"sbad":m.a.verify.length?"sw":"sok";return '<div class="item"><span class="status '+c+'">'+E(v)+'</span> '+sourceBadge(m.j)+' <strong>'+E(m.j.company)+' · '+E(m.j.title)+'</strong><div class="meta">추천직무: '+E(m.ro)+' · 추천점수 '+m.sc+' · '+E((m.j.regions||[]).join(", ")||"지역 미확인")+' · 마감 '+E(m.j.end_date||"미확인")+(m.j.salary?' · '+E(m.j.salary):'')+'</div><button class="btn secondary w24mo" data-k="'+E(m.j.job_key)+'" data-r="'+E(m.ro)+'">이 공고 상세분석</button></div>'}).join("")+'</div>';document.querySelectorAll(".w24mo").forEach(b=>b.onclick=()=>{choose(b.dataset.k);const rs=$("roleSel");if(rs){rs.value=b.dataset.r;role=b.dataset.r;renderRequirements();renderExtra()}window.scrollTo({top:$("check").offsetTop,behavior:"smooth"})})});
      connectedNotice();renderPick();
    })();`;
    d.body.appendChild(s);
  };
  frame.addEventListener('load',()=>setTimeout(inject,0));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,0);
})();