(function(){
  function getPriceIndex(tbl){
    if (tbl.dataset.priceIndex) return +tbl.dataset.priceIndex;
    const th = tbl.tHead && tbl.tHead.rows[0];
    if (th){
      const labels = [...th.cells].map(c => (c.textContent||'').toLowerCase());
      const i = labels.findIndex(t => /р[рp]ц|руб|цена|ндс/.test(t));
      if (i >= 0) return i;
    }
    const tb = tbl.tBodies && tbl.tBodies[0]; if (!tb) return -1;
    const sample = [...tb.rows].slice(0,30);
    const cols = Math.max(...sample.map(r=>r.cells.length),0);
    let best=-1,score=-1;
    for (let c=0;c<cols;c++){
      let s=0; for (const r of sample){
        const v=(r.cells[c]?.textContent||'').replace(/\s+/g,'').replace(',','.');
        if (/^\d{3,}(\.\d+)?$/.test(v)) s++;
      }
      if (s>score){score=s;best=c;}
    }
    return best;
  }
  function blankSubcatPrices(){
    document.querySelectorAll('table.price').forEach(tbl=>{
      const tb = tbl.tBodies && tbl.tBodies[0]; if(!tb) return;
      const pidx = getPriceIndex(tbl); if (pidx < 0) return;
      tb.querySelectorAll('tr.subcat').forEach(tr=>{
        const td = tr.cells[pidx]; if (td) td.textContent = '';
      });
    });
  }
  // Запуск на загрузке
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', blankSubcatPrices);
  else blankSubcatPrices();
  // Хук — выполняем ПОСЛЕ ваших функций
  ['applyDiscount','resetDiscount','filter'].forEach(fn=>{
    if (typeof window[fn]==='function'){
      const orig = window[fn];
      window[fn] = function(){ const r = orig.apply(this, arguments); blankSubcatPrices(); return r; };
    }
  });
})();

/* ---- next inline block ---- */

document.getElementById("promoCheckbox").addEventListener("change", function() {
  let checked = this.checked;
  document.querySelectorAll("table.price tbody tr").forEach(row => {
    let promoCell = row.querySelector("td.promo");
    let hasPromo = promoCell && promoCell.textContent.trim();
    if (checked) {
      row.style.display = hasPromo ? "" : "none"; // показываем только акционные
    } else {
      row.style.display = ""; // сброс — показать всё
    }
  });
});