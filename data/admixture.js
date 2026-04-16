/* ============================================================
   ADMIXTURE.JS — Animation slide 1
   Composition démographique réunionnaise :
     ~45% Afrique/Malgache  #0D9488
     ~25% Inde du Sud       #E05A4B
     ~15% Européen          #0B1F3A
     ~8%  Zarabe/Gujarati   #D97706
     ~7%  Chinois           #7C3AED
   60 lignes uniques dupliquées → loop seamless translateY(-50%)
   ============================================================ */

(function() {
  /* Données : 60 lignes, chaque ligne = tableau de segments [width%, couleur] */
  var ROWS = [[[57,"#0D9488"],[21,"#0B1F3A"],[22,"#E05A4B"]],[[46,"#0D9488"],[17,"#0B1F3A"],[29,"#E05A4B"],[8,"#7C3AED"]],[[37,"#0D9488"],[25,"#0B1F3A"],[5,"#7C3AED"],[33,"#E05A4B"]],[[15,"#0B1F3A"],[12,"#7C3AED"],[31,"#E05A4B"],[42,"#0D9488"]],[[63,"#0D9488"],[37,"#E05A4B"]],[[50,"#0D9488"],[9,"#7C3AED"],[17,"#D97706"],[24,"#E05A4B"]],[[29,"#E05A4B"],[44,"#0D9488"],[27,"#0B1F3A"]],[[14,"#0B1F3A"],[73,"#0D9488"],[13,"#D97706"]],[[58,"#0D9488"],[23,"#0B1F3A"],[19,"#D97706"]],[[8,"#0B1F3A"],[39,"#E05A4B"],[53,"#0D9488"]],[[33,"#0B1F3A"],[67,"#0D9488"]],[[16,"#D97706"],[26,"#E05A4B"],[21,"#0B1F3A"],[37,"#0D9488"]],[[21,"#D97706"],[79,"#0D9488"]],[[34,"#0B1F3A"],[19,"#7C3AED"],[47,"#E05A4B"]],[[29,"#E05A4B"],[18,"#7C3AED"],[41,"#0D9488"],[5,"#D97706"],[7,"#0B1F3A"]],[[74,"#0D9488"],[26,"#0B1F3A"]],[[39,"#0D9488"],[15,"#0B1F3A"],[30,"#E05A4B"],[16,"#7C3AED"]],[[70,"#0D9488"],[30,"#0B1F3A"]],[[15,"#D97706"],[41,"#0D9488"],[17,"#0B1F3A"],[4,"#7C3AED"],[23,"#E05A4B"]],[[34,"#E05A4B"],[53,"#0D9488"],[13,"#0B1F3A"]],[[71,"#0D9488"],[29,"#E05A4B"]],[[56,"#0D9488"],[31,"#E05A4B"],[13,"#0B1F3A"]],[[61,"#0D9488"],[5,"#7C3AED"],[34,"#E05A4B"]],[[62,"#0D9488"],[38,"#E05A4B"]],[[63,"#E05A4B"],[37,"#0B1F3A"]],[[17,"#D97706"],[38,"#0D9488"],[20,"#0B1F3A"],[25,"#E05A4B"]],[[43,"#E05A4B"],[57,"#0D9488"]],[[24,"#E05A4B"],[9,"#D97706"],[67,"#0D9488"]],[[57,"#0D9488"],[30,"#E05A4B"],[13,"#7C3AED"]],[[68,"#0D9488"],[32,"#E05A4B"]],[[9,"#7C3AED"],[13,"#D97706"],[47,"#0D9488"],[25,"#E05A4B"],[6,"#0B1F3A"]],[[17,"#0B1F3A"],[49,"#0D9488"],[5,"#7C3AED"],[29,"#E05A4B"]],[[12,"#0B1F3A"],[39,"#E05A4B"],[49,"#0D9488"]],[[62,"#0D9488"],[26,"#0B1F3A"],[12,"#7C3AED"]],[[82,"#0D9488"],[18,"#0B1F3A"]],[[24,"#0B1F3A"],[59,"#0D9488"],[12,"#D97706"],[5,"#7C3AED"]],[[37,"#E05A4B"],[56,"#0D9488"],[7,"#0B1F3A"]],[[52,"#0D9488"],[18,"#D97706"],[25,"#E05A4B"],[5,"#7C3AED"]],[[56,"#0D9488"],[15,"#0B1F3A"],[29,"#E05A4B"]],[[29,"#0B1F3A"],[71,"#0D9488"]],[[57,"#0D9488"],[43,"#E05A4B"]],[[36,"#E05A4B"],[64,"#0D9488"]],[[26,"#E05A4B"],[65,"#0D9488"],[9,"#0B1F3A"]],[[32,"#E05A4B"],[18,"#0B1F3A"],[50,"#0D9488"]],[[51,"#0D9488"],[11,"#D97706"],[38,"#E05A4B"]],[[11,"#D97706"],[24,"#E05A4B"],[7,"#0B1F3A"],[51,"#0D9488"],[7,"#7C3AED"]],[[54,"#0D9488"],[19,"#E05A4B"],[27,"#0B1F3A"]],[[42,"#0D9488"],[12,"#0B1F3A"],[30,"#E05A4B"],[16,"#7C3AED"]],[[19,"#0B1F3A"],[62,"#0D9488"],[19,"#D97706"]],[[60,"#0D9488"],[11,"#7C3AED"],[29,"#E05A4B"]],[[18,"#D97706"],[16,"#7C3AED"],[66,"#0D9488"]],[[43,"#0D9488"],[39,"#E05A4B"],[18,"#7C3AED"]],[[46,"#0D9488"],[11,"#0B1F3A"],[13,"#7C3AED"],[30,"#E05A4B"]],[[54,"#0D9488"],[40,"#E05A4B"],[6,"#7C3AED"]],[[19,"#E05A4B"],[55,"#0D9488"],[6,"#D97706"],[14,"#0B1F3A"],[6,"#7C3AED"]],[[16,"#0B1F3A"],[52,"#0D9488"],[18,"#E05A4B"],[14,"#D97706"]],[[45,"#E05A4B"],[5,"#D97706"],[50,"#0D9488"]],[[41,"#E05A4B"],[59,"#0D9488"]],[[26,"#7C3AED"],[74,"#E05A4B"]],[[20,"#E05A4B"],[49,"#0D9488"],[17,"#0B1F3A"],[14,"#7C3AED"]]];

  function buildRow(segments) {
    var row = document.createElement('div');
    row.style.cssText = 'height:18px;display:flex;width:100%';
    segments.forEach(function(seg) {
      var cell = document.createElement('div');
      cell.style.width      = seg[0] + '%';
      cell.style.background = seg[1];
      row.appendChild(cell);
    });
    return row;
  }

  function init() {
    var container = document.getElementById('admix-bg');
    if (!container) return;
    /* 60 lignes + copie exacte pour le loop seamless translateY(-50%) */
    var fragment = document.createDocumentFragment();
    ROWS.concat(ROWS).forEach(function(segments) {
      fragment.appendChild(buildRow(segments));
    });
    container.appendChild(fragment);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
