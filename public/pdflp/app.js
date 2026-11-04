'use strict';
const iconPaths={book:'<path d="M16 6C12 3 7 3 3 5v23c4-2 9-2 13 1m0-23c4-3 9-3 13-1v23c-4-2-9-2-13 1V6Z"/>',compare:'<path d="M5 27V18h4v9M14 27V11h4v16M23 27V4h4v23"/>',list:'<path d="M11 7h17M11 16h17M11 25h17"/><circle cx="4" cy="7" r="1"/><circle cx="4" cy="16" r="1"/><circle cx="4" cy="25" r="1"/>',sheet:'<path d="M8 3h11l7 7v19H8zM19 3v8h7M12 16h9M12 21h9M12 25h6"/>',question:'<circle cx="16" cy="16" r="13"/><path d="M12 12a4 4 0 1 1 7 3c-2 1-3 2-3 5M16 24h.01"/>',bulb:'<path d="M10 20a9 9 0 1 1 12 0c-2 2-2 3-2 5h-8c0-2 0-3-2-5ZM12 29h8M16 1v2M3 5l2 2M27 5l2-2M1 15h3M28 15h3"/>',pen:'<path d="M5 21C1 16 25 0 28 5S8 27 4 25s18-12 23-9-6 11-14 12 5-7 14-5"/>',person:'<circle cx="16" cy="9" r="6"/><path d="M6 29v-3a10 10 0 0 1 20 0v3"/>',people:'<circle cx="12" cy="10" r="5"/><path d="M3 29v-4a9 9 0 0 1 18 0v4M23 5a5 5 0 0 1 0 10M25 20a9 9 0 0 1 4 8"/>',books:'<path d="M3 5h5v23H3zM12 3h5v25h-5zM20 6l5-1 4 22-5 1z"/>',gift:'<path d="M4 13h24v6H4zM7 19v11h18V19M16 13v17M16 13C4 14 6 1 12 5c3 2 4 8 4 8Zm0 0c12 1 10-12 4-8-3 2-4 8-4 8Z"/>'};
const icon=name=>`<svg class="icon" viewBox="0 0 32 32" aria-hidden="true">${iconPaths[name]||iconPaths.book}</svg>`;
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cover=(book,lazy=true)=>`<span class="book-cover"><img src="${book.image}" width="640" height="906" alt="${esc(book.series+' '+book.circle+' '+book.title+' 表紙')}" ${lazy?'loading="lazy"':''}><span class="number-patch" aria-hidden="true">${book.circle}</span></span>`;
const dialogs=[...document.querySelectorAll('dialog')];let lastTrigger=null;
function openDialog(dialog,trigger){lastTrigger=trigger||document.activeElement;dialogs.forEach(d=>{if(d.open)d.close();});dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;}
dialogs.forEach(dialog=>{dialog.addEventListener('close',()=>{if(!dialogs.some(d=>d.open)){document.body.classList.remove('modal-open');if(lastTrigger&&lastTrigger.isConnected)lastTrigger.focus({preventScroll:true});}});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
function openBook(id,trigger){const b=BOOKS.find(b=>b.id===id);if(!b)return;document.querySelector('#book-detail').innerHTML=`<div class="book-detail-grid"><div class="detail-cover">${cover(b,false)}</div><div><p class="detail-series">${b.series} ${b.circle} ／ 自習・講師用</p><h2 id="book-dialog-title">${esc(b.title)}</h2><p class="detail-lead">${esc(b.lead)}</p><ul class="detail-points">${b.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><div class="detail-actions"><button class="button primary" data-samples-book="${b.id}">冒頭4ページを見る</button><button class="button outline" data-purchase="${esc(b.title)}">購入先を確認する</button></div><p class="detail-note">購入者本人用の本編と、指定の生徒用資料を分けて使用します。</p></div></div>`;openDialog(document.querySelector('#book-dialog'),trigger);}
let sampleBook=BOOKS[0],page=0;
const select=document.querySelector('#sample-select');select.innerHTML=BOOKS.map(b=>`<option value="${b.id}">${b.series} ${b.circle} ${esc(b.title)}</option>`).join('');
function showSample(){const img=document.querySelector('#sample-image');img.src=sampleBook.samples[page];img.alt=`${sampleBook.title} 本文サンプル ${page+1}ページ目（Sample透かし付き）`;document.querySelector('#sample-counter').textContent=`${page+1} / 4 ページ`;document.querySelector('#sample-prev').disabled=page===0;document.querySelector('#sample-next').disabled=page===3;const viewport=document.querySelector('#sample-viewport');viewport.scrollTop=0;viewport.scrollLeft=0;}
function openSamples(id,trigger){sampleBook=BOOKS.find(b=>b.id===id)||BOOKS[0];page=0;select.value=sampleBook.id;document.querySelector('#sample-viewport').classList.remove('zoomed');document.querySelector('#sample-zoom').setAttribute('aria-pressed','false');document.querySelector('#sample-zoom').textContent='拡大';showSample();openDialog(document.querySelector('#sample-dialog'),trigger);}
select.addEventListener('change',()=>{sampleBook=BOOKS.find(b=>b.id===select.value);page=0;showSample();});
document.querySelector('#sample-prev').addEventListener('click',()=>{if(page>0){page--;showSample();}});document.querySelector('#sample-next').addEventListener('click',()=>{if(page<3){page++;showSample();}});
function zoom(){const on=document.querySelector('#sample-viewport').classList.toggle('zoomed');document.querySelector('#sample-zoom').setAttribute('aria-pressed',String(on));document.querySelector('#sample-zoom').textContent=on?'全体表示':'拡大';}
document.querySelector('#sample-zoom').addEventListener('click',zoom);document.querySelector('#sample-image').addEventListener('click',zoom);
document.querySelector('#sample-dialog').addEventListener('keydown',e=>{if(['SELECT','INPUT','TEXTAREA'].includes(e.target.tagName))return;if(e.key==='ArrowLeft'&&page>0){e.preventDefault();page--;showSample();}if(e.key==='ArrowRight'&&page<3){e.preventDefault();page++;showSample();}});
function notice(name,purchase,trigger){document.querySelector('#notice-title').textContent=purchase?'販売ページ準備中':`${name}のページは準備中です`;document.querySelector('#notice-text').textContent=purchase?`${name}の購入先は準備中です。\n販売価格とリンクは準備が整い次第、設定します。`:'現在は表示と操作の確認用です。\nこのボタンから外部ページへは移動しません。';openDialog(document.querySelector('#notice-dialog'),trigger);}
document.addEventListener('click',e=>{const el=e.target.closest('button,a');if(!el)return;if(['data-book','data-open-samples','data-samples-book','data-purchase','data-unavailable'].some(k=>el.hasAttribute(k)))e.preventDefault();if(el.hasAttribute('data-book'))openBook(el.dataset.book,el);else if(el.hasAttribute('data-open-samples'))openSamples(BOOKS[0].id,el);else if(el.hasAttribute('data-samples-book'))openSamples(el.dataset.samplesBook,el);else if(el.hasAttribute('data-purchase'))notice(el.dataset.purchase,true,el);else if(el.hasAttribute('data-unavailable'))notice(el.dataset.unavailable,false,el);else if(el.hasAttribute('data-close'))el.closest('dialog').close();});
const menuButton=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('#mobile-nav');menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!expanded));menuButton.setAttribute('aria-label',expanded?'メニューを開く':'メニューを閉じる');mobileNav.hidden=expanded;});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','メニューを開く');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.focus();}});
const backTop=document.querySelector('[data-back-top]');window.addEventListener('scroll',()=>{backTop.hidden=window.scrollY<700;},{passive:true});backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));

document.documentElement.classList.add("js");

// 06: a native selector keeps the destination, price and included extras together.
(() => {
 const picker=document.querySelector('#basic-store-picker');
 const fallback=document.querySelector('#basic-store-fallback');
 const choice=document.querySelector('#basic-store');
 if(!picker || !fallback || !choice)return;
 const detail=document.querySelector('#basic-store-detail');
 const booth=document.querySelector('#basic-booth-action');
 const note=document.querySelector('#basic-note-action');
 const coconala=document.querySelector('#basic-coconala-action');
 function updateStore(){
  const isNote=choice.value==='note';
  const isCoconala=choice.value==='coconala';
  if(isNote){
   detail.textContent='ボイスサンプル＋読み方２記事セット';
  }else if(isCoconala){
   detail.textContent='講師用・生徒用・規約等をPDF１冊に収録。個別サポートは含まれません。';
  }else{
   detail.replaceChildren(document.createTextNode('基礎５巻セットのみ。'),document.createElement('br'));
   const comparison=document.createElement('span');
   comparison.className='store-comparison';
   comparison.textContent='noteは55,000円・２記事特典付き';
   detail.append(comparison);
  }
  booth.hidden=isNote||isCoconala;
  note.hidden=!isNote;
  coconala.hidden=!isCoconala;
 }
 choice.addEventListener('change',updateStore);
 window.addEventListener('pageshow',updateStore);
 updateStore();
 fallback.hidden=true;
 picker.hidden=false;
})();

// 10: technical set destinations keep their own direct sales links.
(() => {
 const picker=document.querySelector('#tech-store-picker');
 const fallback=document.querySelector('#tech-store-fallback');
 const choice=document.querySelector('#tech-store');
 if(!picker || !fallback || !choice)return;
 const detail=document.querySelector('#tech-store-detail');
 const booth=document.querySelector('#tech-booth-action');
 const coconala=document.querySelector('#tech-coconala-action');
 function updateStore(){
  const isCoconala=choice.value==='coconala';
  detail.textContent=isCoconala?'講師用・生徒用・規約等をPDF１冊に収録。個別サポートは含まれません。':'BOOTHの販売ページで技術11巻セットを選べます。';
  booth.hidden=isCoconala;
  coconala.hidden=!isCoconala;
 }
 choice.addEventListener('change',updateStore);
 window.addEventListener('pageshow',updateStore);
 updateStore();
 fallback.hidden=true;
 picker.hidden=false;
})();

// Single-volume choices share the existing four-page sample viewer.
(() => {
 const bookChoice=document.querySelector('#single-book');
 const sampleLink=document.querySelector('#single-sample');
 const selection=document.querySelector('#single-selection');
 const action=document.querySelector('#single-purchase-action');
 const shelf=document.querySelector('[data-shelf="single"]');
 if(!bookChoice || !sampleLink || !selection || !action || !shelf)return;
 function updateSingle(){
  const book=BOOKS.find(item=>item.id===bookChoice.value)||BOOKS[0];
  sampleLink.dataset.samplesBook=book.id;
  selection.textContent=`${book.series} ${book.circle} ${book.title}`;
  shelf.innerHTML=cover(book);
  action.setAttribute('aria-label',`${book.title}をBOOTHで見る（新しいタブで開く）`);
 }
 bookChoice.addEventListener('change',updateSingle);
 window.addEventListener('pageshow',updateSingle);
 updateSingle();
})();

// Use a normal Blob download for the PDF embedded in the standalone preview.
(() => {
 const link=document.querySelector('.free-pdf-download');
 const href=link&&link.getAttribute('href');
 if(!href || !href.startsWith('data:application/pdf;base64,') || !URL.createObjectURL)return;
 try{
  const bytes=Uint8Array.from(atob(href.split(',')[1]),c=>c.charCodeAt(0));
  link.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
 }catch(error){ /* Retain the embedded download if Blob conversion is unavailable. */ }
})();
