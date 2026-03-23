/* ============================================================
   ADMIXTURE.JS — Données de l'animation admixture (slide 1)
   Composition démographique réunionnaise réelle :
     ~45% Afrique/Malgache  → var(--adm-afro-malg) #0D9488
     ~25% Inde du Sud       → var(--adm-inde)       #E05A4B
     ~15% Européen          → var(--adm-euro)        #0B1F3A
     ~8%  Zarabe/Gujarati   → var(--adm-zarabe)      #D97706
     ~7%  Chinois           → var(--adm-chinois)     #7C3AED

   Structure : 60 lignes uniques + copie exacte = loop seamless
   L'animation CSS translateY(-50%) reboucle sans saut visible.
   ============================================================ */

const ADMIX_ROWS = `
<div style="height:18px;display:flex;width:100%"><div style="width:57%;background:#0D9488"></div><div style="width:21%;background:#0B1F3A"></div><div style="width:22%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:46%;background:#0D9488"></div><div style="width:17%;background:#0B1F3A"></div><div style="width:29%;background:#E05A4B"></div><div style="width:8%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:37%;background:#0D9488"></div><div style="width:25%;background:#0B1F3A"></div><div style="width:5%;background:#7C3AED"></div><div style="width:33%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:15%;background:#0B1F3A"></div><div style="width:12%;background:#7C3AED"></div><div style="width:31%;background:#E05A4B"></div><div style="width:42%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:63%;background:#0D9488"></div><div style="width:37%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:50%;background:#0D9488"></div><div style="width:9%;background:#7C3AED"></div><div style="width:17%;background:#D97706"></div><div style="width:24%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:29%;background:#E05A4B"></div><div style="width:44%;background:#0D9488"></div><div style="width:27%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:14%;background:#0B1F3A"></div><div style="width:73%;background:#0D9488"></div><div style="width:13%;background:#D97706"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:58%;background:#0D9488"></div><div style="width:23%;background:#0B1F3A"></div><div style="width:19%;background:#D97706"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:8%;background:#0B1F3A"></div><div style="width:39%;background:#E05A4B"></div><div style="width:53%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:33%;background:#0B1F3A"></div><div style="width:67%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:16%;background:#D97706"></div><div style="width:26%;background:#E05A4B"></div><div style="width:21%;background:#0B1F3A"></div><div style="width:37%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:21%;background:#D97706"></div><div style="width:79%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:34%;background:#0B1F3A"></div><div style="width:19%;background:#7C3AED"></div><div style="width:47%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:29%;background:#E05A4B"></div><div style="width:18%;background:#7C3AED"></div><div style="width:41%;background:#0D9488"></div><div style="width:5%;background:#D97706"></div><div style="width:7%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:74%;background:#0D9488"></div><div style="width:26%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:39%;background:#0D9488"></div><div style="width:15%;background:#0B1F3A"></div><div style="width:30%;background:#E05A4B"></div><div style="width:16%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:70%;background:#0D9488"></div><div style="width:30%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:15%;background:#D97706"></div><div style="width:41%;background:#0D9488"></div><div style="width:17%;background:#0B1F3A"></div><div style="width:4%;background:#7C3AED"></div><div style="width:23%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:34%;background:#E05A4B"></div><div style="width:53%;background:#0D9488"></div><div style="width:13%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:71%;background:#0D9488"></div><div style="width:29%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:56%;background:#0D9488"></div><div style="width:31%;background:#E05A4B"></div><div style="width:13%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:61%;background:#0D9488"></div><div style="width:5%;background:#7C3AED"></div><div style="width:34%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:62%;background:#0D9488"></div><div style="width:38%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:63%;background:#E05A4B"></div><div style="width:37%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:17%;background:#D97706"></div><div style="width:38%;background:#0D9488"></div><div style="width:20%;background:#0B1F3A"></div><div style="width:25%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:43%;background:#E05A4B"></div><div style="width:57%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:24%;background:#E05A4B"></div><div style="width:9%;background:#D97706"></div><div style="width:67%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:57%;background:#0D9488"></div><div style="width:30%;background:#E05A4B"></div><div style="width:13%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:68%;background:#0D9488"></div><div style="width:32%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:9%;background:#7C3AED"></div><div style="width:13%;background:#D97706"></div><div style="width:47%;background:#0D9488"></div><div style="width:25%;background:#E05A4B"></div><div style="width:6%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:17%;background:#0B1F3A"></div><div style="width:49%;background:#0D9488"></div><div style="width:5%;background:#7C3AED"></div><div style="width:29%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:12%;background:#0B1F3A"></div><div style="width:39%;background:#E05A4B"></div><div style="width:49%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:62%;background:#0D9488"></div><div style="width:26%;background:#0B1F3A"></div><div style="width:12%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:82%;background:#0D9488"></div><div style="width:18%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:24%;background:#0B1F3A"></div><div style="width:59%;background:#0D9488"></div><div style="width:12%;background:#D97706"></div><div style="width:5%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:37%;background:#E05A4B"></div><div style="width:56%;background:#0D9488"></div><div style="width:7%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:52%;background:#0D9488"></div><div style="width:18%;background:#D97706"></div><div style="width:25%;background:#E05A4B"></div><div style="width:5%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:56%;background:#0D9488"></div><div style="width:15%;background:#0B1F3A"></div><div style="width:29%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:29%;background:#0B1F3A"></div><div style="width:71%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:57%;background:#0D9488"></div><div style="width:43%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:36%;background:#E05A4B"></div><div style="width:64%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:26%;background:#E05A4B"></div><div style="width:65%;background:#0D9488"></div><div style="width:9%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:32%;background:#E05A4B"></div><div style="width:18%;background:#0B1F3A"></div><div style="width:50%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:51%;background:#0D9488"></div><div style="width:11%;background:#D97706"></div><div style="width:38%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:11%;background:#D97706"></div><div style="width:24%;background:#E05A4B"></div><div style="width:7%;background:#0B1F3A"></div><div style="width:51%;background:#0D9488"></div><div style="width:7%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:54%;background:#0D9488"></div><div style="width:19%;background:#E05A4B"></div><div style="width:27%;background:#0B1F3A"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:42%;background:#0D9488"></div><div style="width:12%;background:#0B1F3A"></div><div style="width:30%;background:#E05A4B"></div><div style="width:16%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:19%;background:#0B1F3A"></div><div style="width:62%;background:#0D9488"></div><div style="width:19%;background:#D97706"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:60%;background:#0D9488"></div><div style="width:11%;background:#7C3AED"></div><div style="width:29%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:18%;background:#D97706"></div><div style="width:16%;background:#7C3AED"></div><div style="width:66%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:43%;background:#0D9488"></div><div style="width:39%;background:#E05A4B"></div><div style="width:18%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:46%;background:#0D9488"></div><div style="width:11%;background:#0B1F3A"></div><div style="width:13%;background:#7C3AED"></div><div style="width:30%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:54%;background:#0D9488"></div><div style="width:40%;background:#E05A4B"></div><div style="width:6%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:19%;background:#E05A4B"></div><div style="width:55%;background:#0D9488"></div><div style="width:6%;background:#D97706"></div><div style="width:14%;background:#0B1F3A"></div><div style="width:6%;background:#7C3AED"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:16%;background:#0B1F3A"></div><div style="width:52%;background:#0D9488"></div><div style="width:18%;background:#E05A4B"></div><div style="width:14%;background:#D97706"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:45%;background:#E05A4B"></div><div style="width:5%;background:#D97706"></div><div style="width:50%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:41%;background:#E05A4B"></div><div style="width:59%;background:#0D9488"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:26%;background:#7C3AED"></div><div style="width:74%;background:#E05A4B"></div></div>
<div style="height:18px;display:flex;width:100%"><div style="width:20%;background:#E05A4B"></div><div style="width:49%;background:#0D9488"></div><div style="width:17%;background:#0B1F3A"></div><div style="width:14%;background:#7C3AED"></div></div>
`.trim();

/**
 * Injecte les lignes admixture dans le conteneur #admix-bg.
 * Le contenu est doublé pour assurer un loop CSS seamless.
 */
function initAdmixture() {
  const container = document.getElementById('admix-bg');
  if (!container) return;
  // Double le contenu : 60 lignes + copie exacte = translateY(-50%) seamless
  container.innerHTML = ADMIX_ROWS + '\n' + ADMIX_ROWS;
}

// Exécution immédiate au chargement
document.addEventListener('DOMContentLoaded', initAdmixture);
