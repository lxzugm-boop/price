(function(){
      const sel = document.getElementById('warehouseSel');
      function disc(wh){ return (wh==='Санкт-Петербург' || wh==='Москва') ? 0 : 0.05; }
      function recalc(){
        const d = disc(sel.value);
        document.querySelectorAll('td.opt-rub').forEach(td=>{
          const base = parseFloat(td.getAttribute('data-base-optrub'));
          if (isNaN(base)){ td.textContent=''; return; }
          const val = Math.round(base * (1-d));
          td.textContent = val.toLocaleString('ru-RU');
        });
      }
      sel.addEventListener('change', recalc);
      recalc();
    })();