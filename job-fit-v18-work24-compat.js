(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;
  const inject=()=>{
    const d=frame.contentDocument;
    if(!d||!d.body||d.getElementById('work24CompatPatch'))return;
    const s=d.createElement('script');
    s.id='work24CompatPatch';
    s.textContent=`(()=>{
      const W24_REGION_ALIAS={"서울특별시":["서울"],"부산광역시":["부산"],"대구광역시":["대구"],"인천광역시":["인천"],"광주광역시":["광주"],"대전광역시":["대전"],"울산광역시":["울산"],"세종특별자치시":["세종"],"경기도":["경기"],"강원특별자치도":["강원"],"충청북도":["충북"],"충청남도":["충남"],"전북특별자치도":["전북","전라북도"],"전라남도":["전남"],"경상북도":["경북"],"경상남도":["경남"],"제주특별자치도":["제주"]};
      window.rmatch=function(j){
        const sido=$("sidoFilter")?.value||"ALL",gu=$("sigunguFilter")?.value||"ALL";
        const text=N([...(j?.regions||[]),j?.region_name||"",j?.workplace||"",j?.institution_address||""].join(" "));
        if(sido!=="ALL"&&!([sido,...(W24_REGION_ALIAS[sido]||[])].some(x=>text.includes(N(x)))))return false;
        if(gu!=="ALL"&&!text.includes(N(gu)))return false;
        return true
      };
      window.one=function(j,ro){
        const p=person();p.ext={};
        const x=roleText(j,ro);
        if(/대한민국\\s*국적/.test(x))p.ext.national="unknown";
        if(/보훈전형|취업지원대상자|국가유공자/.test((ro||"")+" "+x))p.ext.veteran="unknown";
        if(/장애인전형/.test((ro||"")+" "+x))p.ext.disabled="unknown";
        if(j?.source==="CLEANEYE"&&j.region_restriction==="Y")p.ext.local=N(p.residence)&&N(j.region_name||"").includes(N(p.residence))?"yes":"unknown";
        const a=analyze(p,j,ro);
        let sc=70+a.tier*8-a.hard.length*35-a.verify.length*5;
        const h=N([j?.title||"",(j?.ncs_names||[]).join(" "),j?.recruit_field||"",j?.job_detail||"",roleText(j,ro)].join(" "));
        if(p.major&&h.includes(N(p.major)))sc+=8;
        for(const c of p.certs)if(c&&h.includes(N(c)))sc+=6;
        if(p.exp>=12)sc+=4;
        return{j,ro,a,sc:Math.max(0,Math.min(100,sc))}
      };
      window.mr=$("matchResults");
    })();`;
    d.body.appendChild(s);
  };
  frame.addEventListener('load',()=>setTimeout(inject,0));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,0);
})();
