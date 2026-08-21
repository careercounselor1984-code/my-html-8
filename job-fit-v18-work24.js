(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function work24Patch(){
    const W24_OPEN_API="https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-open-recruit";
    const W24_GENERAL_API="https://bowxlaiyjxknqccoughl.supabase.co/functions/v1/work24-proxy";
    const OPEN_CACHE=new Map(),GENERAL_CACHE=new Map();
    let openSeq=0,generalSeq=0,w24Timer=null;
    const REGION_CODE={"서울특별시":"11000","부산광역시":"26000","대구광역시":"27000","인천광역시":"28000","광주광역시":"29000","대전광역시":"30000","울산광역시":"31000","경기도":"41000","강원특별자치도":"42000","충청북도":"43000","충청남도":"44000","전북특별자치도":"45000","전라남도":"46000","경상북도":"47000","경상남도":"48000","제주특별자치도":"50000","세종특별자치시":"36110"};
    const SYN={
      "전기":["전기","전력","계전","전장","전기설비","전기통신","PLC","AMI"],
      "생산":["생산","제조","오퍼레이터","operator","조립","가공"],
      "품질":["품질","품질관리","QA","QC","검사"],
      "설비":["설비","설비보전","정비","유지보수","maintenance","공무"],
      "보전":["설비보전","정비","유지보수","maintenance","공무"],
      "회계":["회계","재무","경리","세무"]
    };
    const REGION_TERMS={
      "서울특별시":["서울"],"부산광역시":["부산","기장"],"대구광역시":["대구"],"인천광역시":["인천"],"광주광역시":["광주"],"대전광역시":["대전"],"울산광역시":["울산","울주"],"세종특별자치시":["세종"],
      "경기도":["경기","수원","성남","의정부","안양","부천","광명","평택","동두천","안산","고양","과천","구리","남양주","오산","시흥","군포","의왕","하남","용인","파주","이천","안성","김포","화성","광주","양주","포천","여주","연천","가평","양평"],
      "강원특별자치도":["강원","춘천","원주","강릉","동해","태백","속초","삼척","홍천","횡성","영월","평창","정선","철원","화천","양구","인제","고성","양양"],
      "충청북도":["충북","청주","충주","제천","보은","옥천","영동","증평","진천","괴산","음성","단양"],
      "충청남도":["충남","천안","공주","보령","아산","서산","논산","계룡","당진","금산","부여","서천","청양","홍성","예산","태안"],
      "전북특별자치도":["전북","전주","군산","익산","정읍","남원","김제","완주","진안","무주","장수","임실","순창","고창","부안"],
      "전라남도":["전남","목포","여수","순천","나주","광양","담양","곡성","구례","고흥","보성","화순","장흥","강진","해남","영암","무안","함평","영광","장성","완도","진도","신안"],
      "경상북도":["경북","포항","경주","김천","안동","구미","영주","영천","상주","문경","경산","의성","청송","영양","영덕","청도","고령","성주","칠곡","예천","봉화","울진","울릉"],
      "경상남도":["경남","창원","진주","통영","사천","김해","밀양","거제","양산","의령","함안","창녕","고성","남해","하동","산청","함양","거창","합천"],
      "제주특별자치도":["제주","서귀포"]
    };

    const style=document.createElement("style");
    style.textContent=".pill.work24open{background:#eef4ff;color:#3538cd;font-weight:900}.pill.work24general{background:#fff6ed;color:#b54708;font-weight:900}.w24src{margin-top:10px;padding:10px 12px;border-radius:10px;background:#f0fdf4;color:#166534;font-size:11px;line-height:1.6}.w24loading{padding:10px 12px;border-radius:10px;background:#eff8ff;color:#175cd3;font-size:12px}";
    document.head.appendChild(style);

    const sfEl=$("sourceFilter");
    if(sfEl){
      const old=[...sfEl.options].find(o=>o.value==="WORK24");
      if(old){old.value="WORK24_OPEN";old.textContent="고용24 공채속보 (중견·대기업+)"}
      if(![...sfEl.options].some(o=>o.value==="WORK24_GENERAL")){
        const opt=document.createElement("option");opt.value="WORK24_GENERAL";opt.textContent="고용24 전체 · 확장검색";
        const sar=[...sfEl.options].find(o=>o.value==="SARAMIN");sfEl.insertBefore(opt,sar||null)
      }
    }

    const baseSourceBadge=sourceBadge;
    sourceBadge=function(j){
      if(j?.source==="WORK24_OPEN")return '<span class="pill work24open">고용24 공채속보</span>';
      if(j?.source==="WORK24_GENERAL")return '<span class="pill work24general">고용24 확장</span>';
      return baseSourceBadge(j)
    };

    const baseRoles=roles;
    roles=function(j){
      if(j?.source==="WORK24_OPEN")return [j.title||"공채 공고 · 세부 직무 공식 확인"];
      if(j?.source==="WORK24_GENERAL")return j.recruit_field?[j.recruit_field]:[];
      return baseRoles(j)
    };

    const baseRoleText=roleText;
    roleText=function(j,r){
      if(j?.source==="WORK24_OPEN")return ["공채제목: "+(j.title||""),j.company_class?"기업구분: "+j.company_class:"","근무지역: 공식 채용사이트 확인 필요","상세 지원자격: 공식 채용사이트 확인 필요"].filter(Boolean).join("\n");
      if(j?.source!=="WORK24_GENERAL")return baseRoleText(j,r);
      return [j.recruit_field?"모집직종: "+j.recruit_field:"",(j.ncs_names||[]).length?"관련직종: "+j.ncs_names.join(", "):"",j.job_detail?"직무내용: "+j.job_detail:"",j.education_raw?"학력: "+j.education_raw:"",j.w24_career?"경력: "+j.w24_career:"",j.w24_major?"전공: "+j.w24_major:"",j.certifications?"자격면허: "+j.certifications:"",j.preference?"우대사항: "+j.preference:"",(j.regions||[]).length?"근무지역: "+j.regions.join(", "):""].filter(Boolean).join("\n")
    };

    const baseCard=card;
    card=function(j,pickable){
      if(j?.source!=="WORK24_OPEN")return baseCard(j,pickable);
      return '<div class="item '+(pickable?'pick ':'')+(sel?.job_key===j.job_key?'sel':'')+'" '+(pickable?'data-k="'+E(j.job_key)+'"':'')+'>'+sourceBadge(j)+' <strong>'+E(j.company)+' · '+E(j.title)+'</strong><div class="meta">'+E(j.company_class||"기업구분 확인")+' · 지역 공식 확인 필요 · '+E(j.employment_type||"고용형태 확인")+' · 마감 '+E(j.end_date||"미확인")+'</div></div>'
    };

    function keywords(q,max=8){
      const text=String(q||"").trim();if(!text)return[];
      const out=[text];for(const [key,vals] of Object.entries(SYN))if(N(text).includes(N(key)))out.push(...vals);
      if(out.length===1)out.push(...text.split(/[|,/]+/).map(x=>x.trim()).filter(x=>x.length>=2));
      return [...new Set(out.filter(x=>String(x).trim().length>=2))].slice(0,max)
    }
    function regionCode(){return REGION_CODE[$("sidoFilter")?.value]||""}
    function purge(type){jobs=jobs.filter(j=>j.source!==type)}
    function purgeAllW24(){jobs=jobs.filter(j=>j.source!=="WORK24_OPEN"&&j.source!=="WORK24_GENERAL")}

    async function callApi(url,body,label){
      const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const text=await r.text();let data;try{data=JSON.parse(text)}catch{throw Error(label+" 서버 응답 해석 실패")}
      if(!r.ok||!data.ok)throw Error(data.error||(label+" HTTP "+r.status));return data
    }

    function normalizeOpen(x,matched=[]){
      return{...x,source:"WORK24_OPEN",job_key:"W24OPEN:"+(x.empSeqno||x.url||Math.random()),company:x.company||"",title:x.title||"",company_class:x.companyClass||"",regions:[],region_name:"",workplace:"",employment_type:x.employmentType||"",education_raw:"",qualification:"",preference:"",ncs_names:[],recruit_field:"",job_detail:"",certifications:"",salary:"",end_date:x.endDate||"",source_url:x.url||"",first_seen_at:"",open:true,w24_open:true,w24_matched_keywords:matched,w24_source_notice:x.sourceNotice||"본 자료는 고용노동부 고용24 공채속보에서 제공된 정보입니다."}
    }
    function normalizeGeneral(x){
      const wanted=String(x.wantedAuthNo||""),rel=String(x.relatedJobs||"").split(/[,/|]/).map(v=>v.trim()).filter(Boolean);
      const qual=[x.education?"학력: "+x.education:"",x.career?"경력: "+x.career:"",x.major?"전공: "+x.major:"",x.certificate?"자격면허: "+x.certificate:"",x.otherGuide?"기타안내: "+x.otherGuide:""].filter(Boolean).join("\n");
      return{...x,source:"WORK24_GENERAL",job_key:"W24GEN:"+(wanted||x.url||Math.random()),company:x.company||"",title:x.title||"",regions:[x.region].filter(Boolean),region_name:x.region||"",workplace:x.region||"",employment_type:x.employmentType||"",education_raw:x.education||"",qualification:qual,preference:x.preference||"",ncs_names:rel,recruit_field:x.jobsNm||"",job_detail:x.jobContent||"",certifications:x.certificate||"",salary:x.pay||"",end_date:x.closeDate||"",source_url:x.url||"",first_seen_at:x.registeredDate||"",open:true,w24_career:x.career||"",w24_major:x.major||"",w24_detail_loaded:!!x.detailLoaded,w24_matched_keywords:x.matchedKeywords||x.queryMatchedKeywords||[],w24_source_notice:x.sourceNotice||"본 자료는 고용노동부 고용24에서 제공된 채용정보입니다."}
    }

    async function ensureOpen(force=false){
      const q=String($("q")?.value||"").trim(),sf=$("sourceFilter")?.value||"ALL";
      if(sf!=="WORK24_OPEN"&&sf!=="ALL")return[];
      if(q.length<2){purge("WORK24_OPEN");return[]}
      const ks=keywords(q,5),cacheKey=ks.join("|");if(!force&&OPEN_CACHE.has(cacheKey)){const rows=OPEN_CACHE.get(cacheKey);purge("WORK24_OPEN");jobs=jobs.concat(rows);return rows}
      const seq=++openSeq;if(sf==="WORK24_OPEN")$("pick").innerHTML='<div class="w24loading">중견·대기업 이상 고용24 공채속보를 조회하는 중입니다.</div>';
      try{
        const settled=await Promise.allSettled(ks.map(k=>callApi(W24_OPEN_API,{action:"search_open_recruit",keyword:k,limit:40},"고용24 공채속보").then(d=>({k,d}))));
        if(seq!==openSeq)return[];const map=new Map();
        for(const r of settled)if(r.status==="fulfilled")for(const x of r.value.d.jobs||[]){const id=x.empSeqno||x.url||x.company+"|"+x.title,prev=map.get(id),mk=[...new Set([...(prev?.w24_matched_keywords||[]),r.value.k])];map.set(id,normalizeOpen(x,mk))}
        const rows=[...map.values()];OPEN_CACHE.set(cacheKey,rows);purge("WORK24_OPEN");jobs=jobs.concat(rows);return rows
      }catch(e){if(seq!==openSeq)return[];$("sourceNotice").innerHTML='<div class="warn"><b>고용24 공채속보 일시 조회 실패</b><br>'+E(e.message)+'<br>ALIO·클린아이 기존 분석에는 영향이 없습니다.</div>';return[]}
    }

    async function ensureGeneral(force=false){
      const q=String($("q")?.value||"").trim(),sf=$("sourceFilter")?.value||"ALL";
      if(sf!=="WORK24_GENERAL")return[];
      if(q.length<2){purge("WORK24_GENERAL");return[]}
      const ks=keywords(q,8),cacheKey=ks.join("|")+"|"+regionCode();if(!force&&GENERAL_CACHE.has(cacheKey)){const rows=GENERAL_CACHE.get(cacheKey);purge("WORK24_GENERAL");jobs=jobs.concat(rows);return rows}
      const seq=++generalSeq;$("pick").innerHTML='<div class="w24loading">고용24 일반채용을 확장검색하고 상세 자격정보를 확인하는 중입니다.</div>';
      try{
        const data=await callApi(W24_GENERAL_API,{action:"recommend_jobs",keywords:ks,regionCode:regionCode(),limit:20,perKeyword:14,includeDetails:true},"고용24 일반채용");
        if(seq!==generalSeq)return[];const rows=(data.jobs||[]).map(normalizeGeneral);GENERAL_CACHE.set(cacheKey,rows);purge("WORK24_GENERAL");jobs=jobs.concat(rows);return rows
      }catch(e){if(seq!==generalSeq)return[];$("sourceNotice").innerHTML='<div class="warn"><b>고용24 일반채용 확장검색 실패</b><br>'+E(e.message)+'<br>기본 중견·대기업/공공 공고에는 영향이 없습니다.</div>';return[]}
    }

    function openRegionMatch(j){
      const sido=$("sidoFilter")?.value||"ALL";if(sido==="ALL")return true;
      const title=N(j.title||""),own=REGION_TERMS[sido]||[];if(own.some(x=>title.includes(N(x))))return true;
      for(const [region,terms] of Object.entries(REGION_TERMS)){if(region===sido)continue;if(terms.some(x=>x.length>=2&&title.includes(N(x))))return false}
      return true
    }
    function sourceMatch(j,sf){if(sf==="ALL")return j.source!=="WORK24_GENERAL";return j.source===sf}
    function queryMatch(j,q){if(!q)return true;const text=N([j.company,j.title,(j.ncs_names||[]).join(" "),j.recruit_field||"",j.job_detail||"",j.qualification||""].join(" "));if(text.includes(q))return true;return (j.w24_matched_keywords||[]).some(k=>N(k).includes(q)||q.includes(N(k)))}
    function localMatch(j){return j.source==="WORK24_OPEN"?openRegionMatch(j):rmatch(j)}
    function localRows(){const sf=$("sourceFilter").value,qq=N($("q").value);return jobs.filter(isOpen).filter(j=>sourceMatch(j,sf)&&localMatch(j)&&queryMatch(j,qq)).sort((a,b)=>String(a.end_date||"99999999").localeCompare(String(b.end_date||"99999999"))).slice(0,180)}

    const baseReq=requirementSummary;
    requirementSummary=function(j,r){
      if(j?.source==="WORK24_OPEN")return{basic:[j.company_class?"기업구분: "+j.company_class:"중견·대기업 이상 공채속보",j.employment_type?"고용형태: "+j.employment_type:"고용형태 공식 확인",j.end_date?"마감일: "+j.end_date:"마감일 공식 확인"],must:["상세 지원자격은 기업 공식 채용사이트 확인 필요","근무지역은 기업 공식 채용사이트 확인 필요"],pref:["우대조건은 기업 공식 채용사이트 확인 필요"],raw:roleText(j,r),note:"고용24 공채속보 목록 기준입니다. 상세 지원자격·근무지역·세부 직무는 공식 채용사이트에서 최종 확인해야 합니다."};
      if(j?.source!=="WORK24_GENERAL")return baseReq(j,r);
      const basic=[],must=[],pref=[];if(j.employment_type)basic.push("고용형태: "+j.employment_type);if(j.education_raw)basic.push("학력: "+j.education_raw);if(j.w24_career)basic.push("경력: "+j.w24_career);if((j.regions||[]).length)basic.push("근무지역: "+j.regions.join(", "));if(j.salary)basic.push("급여: "+j.salary);
      const cert=String(j.certifications||"");if(/필수|반드시|소지자만|자격증.*필요/.test(cert))must.push("자격면허: "+cert);else if(cert)pref.push("자격면허: "+cert);
      const career=String(j.w24_career||"");if(career&&!/무관|신입/.test(career)){if(/필수|경력만|경력자/.test(career)&&!/우대/.test(career))must.push("경력: "+career);else pref.push("경력: "+career)}if(j.w24_major)pref.push("관련 전공: "+j.w24_major);if(j.preference)pref.push(...splitClauses(j.preference));if(!must.length)must.push("상세 필수요건은 고용24 공고에서 최종 확인");if(!pref.length)pref.push("별도 우대조건은 상세 공고 확인");return{basic:basic.length?basic:["고용24 상세 기본정보 확인"],must:[...new Set(must)].slice(0,7),pref:[...new Set(pref)].slice(0,7),raw:roleText(j,r),note:"고용24 일반채용 상세 API 기준입니다. 최종 지원조건·접수상태는 고용24 상세페이지를 확인하세요."}
    };

    function minEdu(v){const n=N(v);if(!n||n.includes("무관"))return"무관";const first=String(v).split(/[-~]/)[0];if(/석사/.test(first))return"석사";if(/대졸\(4년\)|4년/.test(first))return"대졸";if(/대졸\(2~3년\)|전문대/.test(first))return"전문대졸";if(/고졸/.test(first))return"고졸";return"무관"}
    function requiredMonths(v){const t=String(v||"");if(/우대|무관|신입/.test(t))return 0;let m=t.match(/(\d+)\s*년\s*(\d+)?\s*개월?\s*(?:이상|필수|경력)/);if(m)return(+m[1])*12+(+m[2]||0);m=t.match(/(\d+)\s*개월\s*(?:이상|필수|경력)/);return m?+m[1]:0}
    function analyzeOpen(p,j){
      const rows=[],verify=["상세 지원자격"],minItems=["기업 공식 채용사이트 상세 지원자격 확인"],midItems=["공채제목과 연결되는 경험·성과 정리"],maxItems=["공식 필수요건 전부 충족","주요 우대조건 복수 충족","직무와 직접 연결되는 경험·성과 보유","서류·면접에서 직무적합성을 사례로 설명 가능"];const add=(s,k,d)=>rows.push([s,k,d]);
      add("ok","공고범위",(j.company_class||"중견·대기업 이상")+" · 고용24 공채속보");add("warn","지원자격","공채속보 목록에 상세 자격요건이 없어 공식 채용사이트 확인 필요");
      const sido=$("sidoFilter")?.value||"ALL";if(sido!=="ALL"){const own=(REGION_TERMS[sido]||[]).some(x=>N(j.title||"").includes(N(x)));if(own)add("ok","근무지역","공고 제목에서 "+sido+" 관련 표현 확인");else{add("warn","근무지역",sido+" 실제 배치 여부 공식 채용사이트 확인 필요");verify.push("근무지역")}}else add("na","근무지역","지역 필터 없음");
      add("warn","세부직무","공채제목 기준 직무 관련성은 있으나 모집직무 세부범위 공식 확인 필요");verify.push("모집직무 세부범위");return{rows,hard:[],verify:[...new Set(verify)],tier:1,minItems,midItems,maxItems}
    }
    function analyzeGeneral(p,j,ro){const rows=[],hard=[],verify=[],minItems=[],midItems=[],maxItems=[];let strength=0;const add=(s,k,d)=>rows.push([s,k,d]);add("ok","공고출처","고용24 일반채용 상세 API 공고");const ed=minEdu(j.education_raw);if(ed==="무관"){add("ok","학력","학력 무관/제한 없음");minItems.push("학력 제한 없음")}else if((ER[p.edu]||0)>=(ER[ed]||0)){add("ok","학력",ed+" 이상 최소학력 충족 가능");minItems.push(ed+" 이상");strength++}else{add("bad","학력",ed+" 이상 최소학력 필요");hard.push("학력");minItems.push(ed+" 이상")}
      const need=requiredMonths(j.w24_career);if(need){minItems.push("관련경력 "+need+"개월 이상");if(p.exp>=need){add("ok","경력",need+"개월 이상 충족");strength+=2}else{add("bad","경력",need+"개월 이상 필요 / 현재 "+p.exp+"개월");hard.push("경력")}}else if(j.w24_career&&/우대/.test(j.w24_career)){add("na","경력","경력은 우대조건으로 표시됨");midItems.push("경력우대: "+j.w24_career);if(p.exp>0)strength++}else{add("na","경력",j.w24_career||"필수 경력 제한 자동 식별 없음");if(p.exp>=12)strength+=2;else if(p.exp>0)strength++}
      const cert=String(j.certifications||"");if(cert){const hits=p.certs.filter(c=>N(cert).includes(N(c)));if(/필수|반드시|소지자만|자격증.*필요/.test(cert)){minItems.push("필수 자격면허 확인");if(hits.length){add("ok","자격/면허","보유자격이 필수 자격문구와 일치");strength+=2}else{add("warn","자격/면허","필수 자격 표현이 있어 보유자격과 상세 대조 필요");verify.push("필수 자격/면허")}}else{add(hits.length?"ok":"na","자격/면허",hits.length?"보유자격이 공고 자격면허 문구와 일치":"자격면허는 필수로 명시되지 않음/우대 가능");midItems.push("자격면허: "+cert);if(hits.length)strength++}}else add("na","자격/면허","별도 자격면허 자동 확인 없음");if(j.w24_major){if(p.major&&N(j.w24_major).includes(N(p.major))){add("ok","전공","관련 전공 문구와 입력 전공이 일치");strength++}else{add("warn","전공","관련 전공 조건/우대 여부 상세 확인 필요");verify.push("전공 조건")}midItems.push("관련 전공: "+j.w24_major)}else add("na","전공","전공 제한 자동 확인 없음");if(j.preference){midItems.push("우대사항: "+j.preference);if(p.certs.some(c=>N(j.preference).includes(N(c))))strength++}if(j.job_detail)midItems.push("직무내용과 연결되는 경험·성과 정리");if(p.exp>=12)midItems.push("관련 경험 1년 이상 활용");else midItems.push("관련 프로젝트·실무경험 보강");maxItems.push("고용24 상세 필수요건 전부 충족","주요 우대조건 복수 충족","모집직종과 직접 연결되는 경력·프로젝트·성과 보유","서류·면접에서 직무적합성을 사례로 설명 가능");if(!j.w24_detail_loaded){add("warn","상세정보","일부 상세정보를 불러오지 못해 고용24 원문 확인 필요");verify.push("고용24 상세 공고")}const tier=hard.length?0:(strength>=6?3:strength>=3?2:1);return{rows,hard:[...new Set(hard)],verify:[...new Set(verify)],tier,minItems:[...new Set(minItems.length?minItems:["고용24 상세 필수요건 확인"])],midItems:[...new Set(midItems)].slice(0,5),maxItems}
    }
    const baseAnalyze=analyze;analyze=function(p,j,ro){if(j?.source==="WORK24_OPEN")return analyzeOpen(p,j);if(j?.source==="WORK24_GENERAL")return analyzeGeneral(p,j,ro);return baseAnalyze(p,j,ro)};

    const baseChoose=choose;choose=function(k){baseChoose(k);if((sel?.source==="WORK24_OPEN"||sel?.source==="WORK24_GENERAL")&&$("jobinfo")){const box=document.createElement("div");box.className="w24src";box.innerHTML=sel.source==="WORK24_OPEN"?'<b>출처: 고용24 공채속보</b><br>중견·대기업 이상 및 공공부문 공채 후보입니다. 상세 지원자격·근무지역은 기업 공식 채용사이트에서 확인하세요.':'<b>출처: 고용24 일반채용 · 확장검색</b><br>중소기업까지 포함한 확장 결과입니다. 목록+상세 API 정보를 분석에 사용했으며 최종 조건은 고용24 원문을 확인하세요.';$("jobinfo").appendChild(box)}};
    const baseShare=shareText;shareText=function(){const t=baseShare();if(sel?.source==="WORK24_OPEN")return t+"\n※ 자료출처: 고용노동부 고용24 공채속보";if(sel?.source==="WORK24_GENERAL")return t+"\n※ 자료출처: 고용노동부 고용24 일반채용(확장검색)";return t};

    renderPick=function(){const sf=$("sourceFilter").value;if(sf==="SARAMIN"){$("pick").innerHTML='<div class="sub">사람인 API 승인 대기중입니다.</div>';return}const xs=localRows(),q=String($("q").value||"").trim();let empty='<div class="sub">선택한 조건의 진행중 공고가 없습니다.</div>';if(q.length<2&&sf==="WORK24_OPEN")empty='<div class="sub">고용24 공채속보 검색은 직무·공고 검색어를 2글자 이상 입력하세요.</div>';if(q.length<2&&sf==="WORK24_GENERAL")empty='<div class="sub">고용24 전체 확장검색은 검색어를 2글자 이상 입력하세요.</div>';$("pick").innerHTML=xs.length?xs.map(j=>card(j,true)).join(""):empty;document.querySelectorAll("#pick .pick").forEach(el=>el.addEventListener("click",()=>choose(el.dataset.k)))};

    async function liveRender(force=false){const sf=$("sourceFilter").value;connectedNotice();if(sf==="ALL"||sf==="WORK24_OPEN")await ensureOpen(force);if(sf==="WORK24_GENERAL")await ensureGeneral(force);renderPick()}
    function connectedNotice(){const sf=$("sourceFilter").value;if(sf==="WORK24_OPEN")$("sourceNotice").innerHTML='<div class="box"><b>고용24 공채속보 · 중견·대기업+</b><br>대기업·공기업·공공기관·중견기업·외국계 공채만 검색합니다. 근무지역·상세자격은 공식 채용사이트에서 확인합니다.</div>';else if(sf==="WORK24_GENERAL")$("sourceNotice").innerHTML='<div class="warn"><b>확장검색 · 중소기업까지 포함</b><br>이 출처를 직접 선택한 경우에만 고용24 일반채용을 조회합니다.</div>';else if(sf==="ALL")$("sourceNotice").innerHTML='<div class="box"><b>기본 검색범위: 중견·대기업 이상 + 공공부문</b><br>고용24 일반 중소기업 공고는 기본 결과에서 제외됩니다.</div>';else if(sf==="SARAMIN")$("sourceNotice").innerHTML='<div class="warn"><b>사람인 API 승인 대기중</b><br>승인 후 대기업·중견기업 공고가 추가됩니다.</div>';else $("sourceNotice").innerHTML=""}

    if(sfEl)sfEl.addEventListener("change",()=>{const sf=sfEl.value;if(sf!=="WORK24_GENERAL")purge("WORK24_GENERAL");if(sf!=="WORK24_OPEN"&&sf!=="ALL")purge("WORK24_OPEN");connectedNotice();setTimeout(()=>liveRender(),0)},true);
    const qEl=$("q");if(qEl)qEl.addEventListener("input",()=>{purgeAllW24();clearTimeout(w24Timer);w24Timer=setTimeout(()=>liveRender(),320)},true);
    $("sidoFilter")?.addEventListener("change",()=>{GENERAL_CACHE.clear();purgeAllW24();setTimeout(()=>liveRender(),0)},true);
    $("sigunguFilter")?.addEventListener("change",()=>setTimeout(renderPick,0),true);

    const sub=document.querySelector("header .sub");if(sub)sub.textContent="중견·대기업 이상 + 공공부문 중심 · ALIO + 클린아이 + 고용24 공채속보 · 지원가능성 분석 · GPT 지원전략";

    const matchBtn=$("matchBtn");if(matchBtn)matchBtn.addEventListener("click",async()=>{const sf=$("sourceFilter").value,q=String($("q").value||"").trim();if(sf==="SARAMIN")return;if((sf==="ALL"||sf==="WORK24_OPEN")&&q.length>=2)await ensureOpen();if(sf==="WORK24_GENERAL"&&q.length>=2)await ensureGeneral();let a=[];for(const j of jobs.filter(isOpen).filter(j=>sourceMatch(j,sf)&&localMatch(j))){let rs=roles(j);if(!rs.length&&j.source==="CLEANEYE")rs=[j.recruit_field||"공고문 확인"];if(!rs.length)rs=[j.title||"공고문 확인"];for(const ro of rs.slice(0,20))a.push(one(j,ro))}a.sort((x,y)=>y.sc-x.sc||String(x.j.end_date||"").localeCompare(String(y.j.end_date||"")));a=a.slice(0,25);const target=$("matchResults");if(!target)return;target.innerHTML='<div class="card"><h2>🎯 내 조건에 맞는 공고</h2><div class="sub">기본은 중견·대기업 이상 및 공공부문 중심입니다. 고용24 전체·확장검색을 직접 선택한 경우에만 중소기업 일반공고를 포함합니다.</div>'+a.map(m=>{const v=m.a.hard.length?"조건 미충족 가능":m.a.verify.length?"지원 가능성 있음 · 확인 필요":"지원 가능성 높음",c=m.a.hard.length?"sbad":m.a.verify.length?"sw":"sok";return '<div class="item"><span class="status '+c+'">'+E(v)+'</span> '+sourceBadge(m.j)+' <strong>'+E(m.j.company)+' · '+E(m.j.title)+'</strong><div class="meta">추천직무: '+E(m.ro)+' · 추천점수 '+m.sc+' · '+E((m.j.regions||[]).join(", ")||(m.j.source==="WORK24_OPEN"?"지역 공식 확인 필요":"지역 미확인"))+' · 마감 '+E(m.j.end_date||"미확인")+(m.j.salary?' · '+E(m.j.salary):'')+'</div><button class="btn secondary w24mo" data-k="'+E(m.j.job_key)+'" data-r="'+E(m.ro)+'">이 공고 상세분석</button></div>'}).join("")+'</div>';document.querySelectorAll(".w24mo").forEach(b=>b.onclick=()=>{choose(b.dataset.k);const rs=$("roleSel");if(rs){rs.value=b.dataset.r;role=b.dataset.r;renderRequirements();renderExtra()}window.scrollTo({top:$("check").offsetTop,behavior:"smooth"})})});

    connectedNotice();liveRender();
  }

  const inject=()=>{
    const d=frame.contentDocument;if(!d||!d.body||d.getElementById('work24LivePatchV16'))return;
    const s=d.createElement('script');s.id='work24LivePatchV16';s.textContent='('+work24Patch.toString()+')();';d.body.appendChild(s)
  };
  frame.addEventListener('load',()=>setTimeout(inject,0));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,0);
})();
