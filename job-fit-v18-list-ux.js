(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function listUxPatch(){
    if(!document.getElementById('categoryTabsPatchReady')){setTimeout(listUxPatch,60);return}
    if(document.getElementById('listUxPatchReady'))return;
    const ready=document.createElement('meta');ready.id='listUxPatchReady';document.head.appendChild(ready);

    const GU={
      '전국':[],
      '서울특별시':['종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구','강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구','구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'],
      '부산광역시':['중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'],
      '대구광역시':['중구','동구','서구','남구','북구','수성구','달서구','달성군','군위군'],
      '인천광역시':['중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'],
      '광주광역시':['동구','서구','남구','북구','광산구'],
      '대전광역시':['동구','중구','서구','유성구','대덕구'],
      '울산광역시':['중구','남구','동구','북구','울주군'],
      '세종특별자치시':[],
      '경기도':['수원시','성남시','의정부시','안양시','부천시','광명시','평택시','동두천시','안산시','고양시','과천시','구리시','남양주시','오산시','시흥시','군포시','의왕시','하남시','용인시','파주시','이천시','안성시','김포시','화성시','광주시','양주시','포천시','여주시','연천군','가평군','양평군'],
      '강원특별자치도':['춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'],
      '충청북도':['청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군','음성군','단양군'],
      '충청남도':['천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'],
      '전북특별자치도':['전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'],
      '전라남도':['목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'],
      '경상북도':['포항시','경주시','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'],
      '경상남도':['창원시','진주시','통영시','사천시','김해시','밀양시','거제시','양산시','의령군','함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'],
      '제주특별자치도':['제주시','서귀포시']
    };
    const ALIAS={'서울특별시':['서울'],'부산광역시':['부산'],'대구광역시':['대구'],'인천광역시':['인천'],'광주광역시':['광주'],'대전광역시':['대전'],'울산광역시':['울산'],'세종특별자치시':['세종'],'경기도':['경기'],'강원특별자치도':['강원'],'충청북도':['충북'],'충청남도':['충남'],'전북특별자치도':['전북','전라북도'],'전라남도':['전남'],'경상북도':['경북'],'경상남도':['경남'],'제주특별자치도':['제주']};
    const state={public:{page:1,open:new Set()},mid:{page:1,open:new Set()},sme:{page:1,open:new Set()}};
    const PAGE=10;
    let syncing=false,timer=null;

    const style=document.createElement('style');
    style.textContent=`
      .uxHide{display:none!important}.uxList{margin-top:8px}.uxItem{border:1px solid #e4e7ec;border-radius:11px;background:#fff;margin-bottom:8px;overflow:hidden}.uxSummary{display:flex;align-items:center;gap:8px;padding:11px 12px;cursor:pointer}.uxSummary:hover{background:#f8fafc}.uxTitle{border:0;background:transparent;padding:0;text-align:left;font:inherit;font-weight:850;color:#172033;cursor:pointer;flex:1;line-height:1.45}.uxArrow{font-size:12px;color:#667085;transition:transform .15s}.uxItem.open .uxArrow{transform:rotate(180deg)}.uxDetail{display:none;border-top:1px solid #e4e7ec;padding:12px;background:#fcfcfd}.uxItem.open .uxDetail{display:block}.uxDetail .meta{margin-bottom:9px}.uxCopyBox{margin-top:10px;padding:10px;background:#f6fef9;border:1px solid #abefc6;border-radius:10px}.uxCopyBox textarea{min-height:170px;margin-top:7px;background:#fff;line-height:1.55;font-size:12px}.uxActions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}.uxActions .btn{margin-top:0}.uxPager{display:flex;justify-content:center;align-items:center;gap:5px;flex-wrap:wrap;margin:13px 0 4px}.uxPager button{border:1px solid #d0d5dd;background:#fff;color:#344054;border-radius:7px;padding:6px 9px;font-size:12px;font-weight:800;cursor:pointer}.uxPager button.on{background:#2457d6;color:#fff;border-color:#2457d6}.uxPager button:disabled{opacity:.4;cursor:default}.uxPageInfo{font-size:11px;color:#667085;margin:0 5px}.uxCount{font-size:12px;color:#667085;margin:6px 0 10px}.uxRegionNote{font-size:11px;color:#667085;margin-top:5px}`;
    document.head.appendChild(style);

    function esc(v){return E(v)}
    function ensureGu(sidoId,guId){
      const sido=$(sidoId);if(!sido)return null;
      let gu=$(guId);if(!gu){const wrap=document.createElement('div');wrap.innerHTML='<label>구·군</label><select id="'+guId+'"></select>';const parent=sido.closest('div');parent?.after(wrap);gu=$(guId)}
      const fill=()=>{const arr=GU[sido.value]||[];const old=gu.value;gu.innerHTML='<option value="ALL">전체</option>'+arr.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('');if(arr.includes(old))gu.value=old;else gu.value='ALL'};
      fill();sido.addEventListener('change',fill);return gu
    }
    function ensureMidRegion(){
      if($('midSido'))return;
      const head=$('midQ')?.closest('.catHead');if(!head)return;
      const a=document.createElement('div');a.innerHTML='<label>시·도</label><select id="midSido"></select>';const b=document.createElement('div');b.innerHTML='<label>구·군</label><select id="midGu"><option value="ALL">전체</option></select>';head.insertBefore(b,head.firstChild);head.insertBefore(a,b);
      const s=$('midSido');s.innerHTML=Object.keys(GU).map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('');s.value='울산광역시';const fill=()=>{const arr=GU[s.value]||[];$('midGu').innerHTML='<option value="ALL">전체</option>'+arr.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('')};fill();s.addEventListener('change',fill)
    }
    function textOf(j){return[(j.regions||[]).join(' '),j.region_name||'',j.workplace||'',j.region||'',j.companyAddress||'',j.institution_address||'',j.title||''].join(' ')}
    function locationMatch(j,sido,gu){
      const t=N(textOf(j));
      if(gu&&gu!=='ALL'&&!t.includes(N(gu)))return false;
      if(!sido||sido==='전국')return true;
      const selected=[sido,...(ALIAS[sido]||[])].some(x=>t.includes(N(x)));
      if(selected)return true;
      if(j.source==='WORK24_OPEN'&&!(j.regions||[]).length&&!j.region_name&&!j.workplace)return gu==='ALL';
      return false
    }
    function queryMatch(j,q){if(!q)return true;const nq=N(q),t=N([j.company,j.title,(j.ncs_names||[]).join(' '),j.recruit_field||'',j.job_detail||'',j.description||'',j.qualification||'',(j.roles||[]).join(' ')].join(' '));if(t.includes(nq))return true;return(j.w24_matched_keywords||[]).some(k=>N(k).includes(nq)||nq.includes(N(k)))}
    function sourceTag(j){if(j.source==='ALIO')return'<span class="catBadge public">ALIO</span>';if(j.source==='CLEANEYE')return'<span class="catBadge public">클린아이</span>';if(j.source==='CORPORATE')return'<span class="catBadge mid">기업DB</span>';if(j.source==='WORK24_OPEN')return'<span class="catBadge mid">고용24 공채속보</span>';return'<span class="catBadge sme">고용24 일반채용</span>'}
    function regionLine(j){return(j.regions||[]).join(', ')||j.region_name||j.workplace||j.region||'지역 확인 필요'}
    function copyText(j){
      let rs=[];try{rs=roles(j)||[]}catch{}const ro=rs.length===1?rs[0]:(j.recruit_field||'');let req=null;try{req=requirementSummary(j,ro)}catch{}
      const must=(req?.must||[]).filter(x=>x&&!/별도 .*없|미확인/.test(x)).slice(0,2).join(' / ')||'공식 공고문 확인';
      const pref=(req?.pref||[]).filter(x=>x&&!/별도 .*없|미확인/.test(x)).slice(0,2).join(' / ')||'공식 공고문 확인';
      const lines=['[채용정보 안내]','○ 기관/기업: '+(j.company||'확인 필요'),'○ 공고: '+(j.title||'확인 필요'),ro?'○ 지원직무: '+ro:'','○ 근무지역: '+regionLine(j),j.employment_type?'○ 고용형태: '+j.employment_type:'',j.salary?'○ 급여/연봉: '+j.salary:'','○ 마감일: '+(j.end_date||'공고 확인'),'○ 핵심 자격: '+must,'○ 우대조건: '+pref,'','공고 확인: '+(j.source_url||'공식 채용페이지 확인 필요'),'※ 세부 자격요건·접수방법은 공식 공고문을 꼭 확인해주세요.'];return lines.filter(Boolean).join('\n')
    }
    function card(j,kind){
      const open=state[kind].open.has(j.job_key),meta=[regionLine(j),j.company_class||j.employment_type||'',j.salary||'',j.end_date?'마감 '+j.end_date:''].filter(Boolean).join(' · '),official=j.source_url?'<a class="btn secondary" target="_blank" rel="noopener" href="'+esc(j.source_url)+'">공식 공고</a>':'';
      return'<div class="uxItem '+(open?'open':'')+'" data-k="'+esc(j.job_key)+'"><div class="uxSummary" data-toggle="1">'+sourceTag(j)+'<button class="uxTitle" type="button" data-toggle="1">'+esc(j.company)+' · '+esc(j.title)+'</button><span class="uxArrow">▼</span></div><div class="uxDetail"><div class="meta">'+esc(meta)+'</div><div class="uxCopyBox"><b>📤 내담자 복사용</b><textarea readonly>'+esc(copyText(j))+'</textarea><div class="uxActions"><button class="btn green uxCopy" type="button">복사용 문구 복사</button><button class="btn uxAnalyze" type="button">지원가능성 분석</button>'+official+'</div></div></div></div>'
    }
    function pager(kind,total){const pages=Math.max(1,Math.ceil(total/PAGE)),cur=Math.min(state[kind].page,pages);state[kind].page=cur;if(pages<=1)return'';const nums=[];let a=Math.max(1,cur-2),b=Math.min(pages,a+4);a=Math.max(1,b-4);for(let i=a;i<=b;i++)nums.push('<button class="'+(i===cur?'on':'')+'" data-p="'+i+'">'+i+'</button>');return'<div class="uxPager" data-kind="'+kind+'"><button data-p="'+(cur-1)+'" '+(cur<=1?'disabled':'')+'>이전</button>'+nums.join('')+'<span class="uxPageInfo">'+cur+' / '+pages+'</span><button data-p="'+(cur+1)+'" '+(cur>=pages?'disabled':'')+'>다음</button></div>'}
    function rows(kind){
      let xs=[],q='',sido='전국',gu='ALL';
      if(kind==='public'){q=$('publicQ')?.value||'';sido=$('publicSido')?.value||'전국';gu=$('publicGu')?.value||'ALL';xs=jobs.filter(j=>['ALIO','CLEANEYE'].includes(j.source)&&isOpen(j))}
      if(kind==='mid'){q=$('midQ')?.value||'';sido=$('midSido')?.value||'전국';gu=$('midGu')?.value||'ALL';xs=jobs.filter(j=>['CORPORATE','WORK24_OPEN'].includes(j.source)&&isOpen(j));const seen=new Set();xs=xs.sort((a,b)=>(a.source==='CORPORATE'?-1:1)-(b.source==='CORPORATE'?-1:1)).filter(j=>{const k=N(j.company+'|'+j.title);if(seen.has(k))return false;seen.add(k);return true})}
      if(kind==='sme'){q=$('smeQ')?.value||'';sido=$('smeSido')?.value||'전국';gu=$('smeGu')?.value||'ALL';xs=jobs.filter(j=>j.source==='WORK24_GENERAL'&&isOpen(j)&&/중소기업|소기업/.test(String(j.companySize||'')))}
      return xs.filter(j=>queryMatch(j,q)&&locationMatch(j,sido,gu)).sort((a,b)=>String(a.end_date||'99999999').localeCompare(String(b.end_date||'99999999')))
    }
    function host(kind){return $(kind==='public'?'uxPublicList':kind==='mid'?'uxMidList':'uxSmeList')}
    function renderKind(kind){
      const el=host(kind);if(!el)return;const xs=rows(kind),pages=Math.max(1,Math.ceil(xs.length/PAGE));if(state[kind].page>pages)state[kind].page=pages;const start=(state[kind].page-1)*PAGE,show=xs.slice(start,start+PAGE);el.innerHTML='<div class="uxCount">총 '+xs.length+'건 · '+state[kind].page+'/'+pages+'페이지 · 한 페이지 10건</div>'+(show.length?show.map(j=>card(j,kind)).join(''):'<div class="catEmpty">선택한 조건의 공고가 없습니다.</div>')+pager(kind,xs.length);bind(el,kind)
    }
    function bind(el,kind){
      el.onclick=async e=>{const page=e.target.closest('[data-p]');if(page&&!page.disabled){state[kind].page=+page.dataset.p;renderKind(kind);return}const item=e.target.closest('.uxItem');if(!item)return;const key=item.dataset.k;if(e.target.closest('[data-toggle]')){state[kind].open.has(key)?state[kind].open.delete(key):state[kind].open.add(key);renderKind(kind);return}if(e.target.closest('.uxAnalyze')){document.querySelector('.tab[data-t="check"]')?.click();if(jobs.some(j=>j.job_key===key))choose(key);document.getElementById('check')?.scrollIntoView({behavior:'smooth',block:'start'});return}if(e.target.closest('.uxCopy')){const ta=item.querySelector('textarea');try{await navigator.clipboard.writeText(ta.value)}catch{ta.select();document.execCommand('copy')}const b=e.target.closest('.uxCopy'),old=b.textContent;b.textContent='✓ 복사 완료';setTimeout(()=>b.textContent=old,1200)}}
    }
    function makeHost(kind,after){const id=kind==='public'?'uxPublicList':kind==='mid'?'uxMidList':'uxSmeList';if($(id))return $(id);const d=document.createElement('div');d.id=id;d.className='uxList';after.after(d);return d}
    function hideOriginals(){
      ['publicCount','publicList','midOpenCount','midOpenList','corplist','smeCount','smeList'].forEach(id=>$(id)?.classList.add('uxHide'));
      const moh=$('midOpenCount')?.previousElementSibling;if(moh?.tagName==='H3')moh.classList.add('uxHide');const ch=$('corplist')?.previousElementSibling;if(ch?.tagName==='H3')ch.classList.add('uxHide')
    }
    function setup(){
      ensureGu('publicSido','publicGu');ensureMidRegion();ensureGu('smeSido','smeGu');
      hideOriginals();
      const ph=$('publicQ')?.closest('.catHead'),mh=$('midQ')?.closest('.catHead'),sh=$('smeQ')?.closest('.catHead');if(ph)makeHost('public',ph);if(mh)makeHost('mid',mh);if(sh)makeHost('sme',sh);
      const on=(id,ev,kind)=>$(id)?.addEventListener(ev,()=>{state[kind].page=1;renderKind(kind)});
      ['publicSido','publicGu'].forEach(id=>on(id,'change','public'));on('publicQ','input','public');['midSido','midGu'].forEach(id=>on(id,'change','mid'));on('midQ','input','mid');['smeSido','smeGu'].forEach(id=>on(id,'change','sme'));on('smeQ','input','sme');
      const obs=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(syncing)return;syncing=true;hideOriginals();renderKind('public');renderKind('mid');renderKind('sme');syncing=false},20)};
      ['publicList','midOpenList','corplist','smeList'].forEach(id=>{const el=$(id);if(el)new MutationObserver(obs).observe(el,{childList:true,subtree:true})});
      renderKind('public');renderKind('mid');renderKind('sme')
    }
    setup()
  }

  const inject=()=>{const d=frame.contentDocument;if(!d||!d.body||d.getElementById('listUxPatchScript'))return;const s=d.createElement('script');s.id='listUxPatchScript';s.textContent='('+listUxPatch.toString()+')();';d.body.appendChild(s)};
  frame.addEventListener('load',()=>setTimeout(inject,80));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,80)
})();
