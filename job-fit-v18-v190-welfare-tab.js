(()=>{
  const frame=document.getElementById('app');
  if(!frame)return;

  function patch(){
    if(document.getElementById('v190WelfareTabReady'))return;
    const marker=document.createElement('meta');
    marker.id='v190WelfareTabReady';
    document.head.appendChild(marker);

    const $=id=>document.getElementById(id);
    const style=document.createElement('style');
    style.textContent=`
      .v190WelfareShell{background:#fff;border:1px solid #e4e7ec;border-radius:14px;overflow:hidden;box-shadow:0 3px 14px #1018280a}
      .v190WelfareTop{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;border-bottom:1px solid #e4e7ec;background:#f8fafc}
      .v190WelfareTop b{font-size:14px;color:#172033}.v190WelfareTop span{font-size:11px;color:#667085}
      .v190WelfareFrame{display:block;width:100%;height:76vh;min-height:700px;border:0;background:#f5f7fb}
      .v190Open{border:1px solid #d0d5dd;background:#fff;color:#344054;border-radius:8px;padding:7px 10px;font-size:11px;font-weight:850;text-decoration:none;white-space:nowrap}
      @media(max-width:760px){.v190WelfareTop{align-items:flex-start;flex-direction:column}.v190WelfareFrame{height:82vh;min-height:620px}}
    `;
    document.head.appendChild(style);

    function activate(btn,panel){
      document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===btn));
      document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('on',x===panel));
    }

    function cleanEmbeddedWelfare(iframe){
      try{
        const d=iframe.contentDocument;
        if(!d||!d.body)return;
        if(d.getElementById('v190EmbedStyle'))return;
        const s=d.createElement('style');
        s.id='v190EmbedStyle';
        s.textContent=`
          header{display:none!important}
          body{background:#f5f7fb!important}
          .wrap{max-width:none!important;padding:14px!important}
        `;
        d.head.appendChild(s);
        const cards=[...d.querySelectorAll('.wrap > .card')];
        const backCard=cards.find(c=>c.querySelector('a[href*="job-fit-v18"]'));
        if(backCard)backCard.style.display='none';
      }catch(e){}
    }

    function ensureFrame(){
      const host=$('v190WelfareHost');
      if(!host||host.dataset.loaded==='1')return;
      host.dataset.loaded='1';
      const iframe=document.createElement('iframe');
      iframe.className='v190WelfareFrame';
      iframe.title='복지·정책 연계 지원센터';
      iframe.loading='lazy';
      iframe.src='welfare-policy.html?v=06&embed=1';
      iframe.addEventListener('load',()=>cleanEmbeddedWelfare(iframe));
      host.appendChild(iframe);
    }

    function add(){
      const tabs=document.querySelector('.tabs'),wrap=document.querySelector('.wrap');
      if(!tabs||!wrap)return false;
      if($('v190WelfareTab'))return true;

      const btn=document.createElement('button');
      btn.className='tab';
      btn.id='v190WelfareTab';
      btn.type='button';
      btn.textContent='🧩 복지·정책';
      tabs.appendChild(btn);

      const panel=document.createElement('section');
      panel.id='v190WelfarePanel';
      panel.className='panel';
      panel.innerHTML=`
        <div class="v190WelfareShell">
          <div class="v190WelfareTop">
            <div><b>🧩 복지·정책 연계 지원센터</b><br><span>복지로 중앙·지자체 정책과 청년정책을 내담자 조건에 맞춰 검색합니다.</span></div>
            <a class="v190Open" href="welfare-policy.html?v=06" target="_blank" rel="noopener">전체화면으로 열기 ↗</a>
          </div>
          <div id="v190WelfareHost"></div>
        </div>`;
      wrap.appendChild(panel);

      btn.addEventListener('click',()=>{
        activate(btn,panel);
        ensureFrame();
      });
      return true;
    }

    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(add()||tries>=40)clearInterval(timer);
    },150);
  }

  function inject(){
    const d=frame.contentDocument;
    if(!d||!d.body){setTimeout(inject,150);return}
    if(d.getElementById('v190WelfareTabScript'))return;
    const s=d.createElement('script');
    s.id='v190WelfareTabScript';
    s.textContent='('+patch.toString()+')();';
    d.body.appendChild(s);
  }

  frame.addEventListener('load',()=>setTimeout(inject,2000));
  if(frame.contentDocument?.readyState==='complete')setTimeout(inject,2000);
})();
