import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBolt,
  FaBrain,
  FaChartLine,
  FaCheck,
  FaEnvelope,
  FaEye,
  FaMapMarkerAlt,
  FaPlay,
  FaTiktok,
  FaWhatsapp,
  FaWordpress,
} from "react-icons/fa";
import { SiBrevo, SiCanva, SiClaude, SiGooglegemini, SiMeta, SiN8N, SiOpenai } from "react-icons/si";

const WHATSAPP_URL =
  "https://wa.me/212609510158?text=Bonjour%20Hamza%2C%20j%27ai%20d%C3%A9couvert%20votre%20portfolio%20et%20j%27aimerais%20%C3%A9changer%20sur%20un%20projet.";

const toolStack = [
  { name: "Meta Ads", Icon: SiMeta },
  { name: "TikTok Ads", Icon: FaTiktok },
  { name: "Brevo", Icon: SiBrevo },
  { name: "CapCut", Icon: FaPlay },
  { name: "Canva", Icon: SiCanva },
  { name: "WordPress", Icon: FaWordpress },
  { name: "Claude", Icon: SiClaude },
  { name: "ChatGPT", Icon: SiOpenai },
  { name: "n8n", Icon: SiN8N },
  { name: "Google Workspace", Icon: SiGooglegemini },
];

const copy = {
  fr: {
    languageName: "العربية",
    langLabel: "Afficher la version arabe",
    menuLabel: "Ouvrir le menu",
    closeLabel: "Fermer l’aperçu",
    previewLabel: "Aperçu du créatif",
    cvPreviewTitle: "Aperçu du CV",
    cvCloseLabel: "Fermer l’aperçu du CV",
    brandRole: "Media Buyer · Digital Marketer",
    nav: [
      ["À propos", "#a-propos"],
      ["Résultats", "#resultats"],
      ["Créatifs", "#creatifs"],
      ["Méthode", "#methode"],
    ],
    whatsappShort: "Parlons-en",
    whatsapp: "Démarrer une conversation",
    email: "Envoyer un email",
    hero: {
      status: "Disponible pour de nouveaux projets · Casablanca",
      lead: "Media buyer & créatif digital",
      titleA: "Je transforme",
      titleAccent: "l’attention",
      titleB: "en conversations.",
      text: "Des campagnes Meta et TikTok pensées pour toucher la bonne audience, tester les bons angles et produire des résultats lisibles — au Maroc et dans le GCC.",
      cv: "Prévisualiser mon CV",
      portraitAlt: "Portrait professionnel de Hamza Elhatimy",
      signalSwitcherLabel: "Choisir un indicateur du hero",
      signals: [
        ["Coût par conversation", "0,78 €", "meilleure performance documentée"],
        ["Conversations", "188+", "documentées sur deux comptes"],
        ["Audience GCC", "25 M", "portée potentielle structurée"],
      ],
      trust: ["Acquisition GCC", "Créatifs social-first", "Décisions pilotées par les KPI"],
    },
    statLabels: ["conversations documentées", "meilleur coût / conversation", "marchés couverts", "approche : tester puis scaler"],
    about: {
      kicker: "Le profil",
      title: "Stratégie, exécution et créativité dans un seul profil.",
      text: "Je relie le media buying, le contenu et les outils web pour construire un parcours d’acquisition cohérent — du premier scroll à la conversation WhatsApp.",
      note: "Je ne me contente pas de lancer des campagnes : je formule l’angle, conçois le test, lis la donnée et améliore le système.",
      cards: [
        ["01", "Stratégie média", "Structure de campagne, audience, budget et plan de test."],
        ["02", "Creative strategy", "Hooks, visuels et formats conçus pour le canal."],
        ["03", "Systèmes digitaux", "Landing pages, reporting et automatisations utiles."],
      ],
    },
    results: {
      kicker: "Preuves de performance",
      title: "Des chiffres concrets, présentés avec contexte.",
      intro: "Résultats anonymisés de campagnes à objectif conversations pour des agences marocaines de location de voitures. Une conversation initiée n’est pas présentée comme une vente.",
      cards: [
        {
          market: "Marché saoudien · Compte B",
          label: "Meilleure efficacité",
          result: "57",
          unit: "conversations",
          cost: "0,78 €",
          details: [["84,39 €", "Dépenses"], ["9 756", "Portée"], ["21 788", "Impressions"]],
        },
        {
          market: "Marché saoudien · Compte A",
          label: "Plus grand volume campagne",
          result: "52",
          unit: "conversations",
          cost: "1,33 $",
          details: [["184,53 $", "Dépenses"], ["22 936", "Portée"], ["39 104", "Impressions"]],
        },
      ],
      footnote: "Objectif Meta : conversations par message · Attribution indiquée dans les exports · Les performances futures dépendent de l’offre, du budget et du marché.",
      audienceTitle: "Une audience GCC structurée, pas simplement élargie.",
      audienceText: "Ciblage arabophone autour des principaux pôles saoudiens et de signaux liés au voyage, au premium et à l’automobile.",
      audienceFacts: [["21,3–25,1 M", "Audience estimée"], ["25–55 ans", "Tranche d’âge"], ["Arabe", "Langue"]],
      audienceAlt: "Paramètres de ciblage Meta Ads pour l’Arabie saoudite",
      enlarge: "Voir la preuve complète",
    },
    creative: {
      kicker: "Portfolio créatif",
      title: "Des concepts pensés pour arrêter le scroll — sans couper le visuel.",
      intro: "Une sélection multi-secteurs pour montrer la capacité à adapter l’angle, l’univers et le rythme visuel à chaque offre.",
      conceptBadge: "Concept créatif · IA",
      clientBadge: "Travail sélectionné · Automobile",
      open: "Ouvrir le visuel complet",
      concepts: [
        ["/assets/concept-auto-premium.jpg", "Automobile premium", "Luxe · GCC", "Concept publicitaire automobile premium, SUV noir de nuit"],
        ["/assets/concept-beauty-serum.jpg", "Beauty e-commerce", "Produit · Conversion", "Concept publicitaire e-commerce pour un sérum beauté"],
        ["/assets/concept-food-delivery.jpg", "Food delivery", "Local · Social-first", "Concept publicitaire pour une offre burger en livraison"],
      ],
      selectedTitle: "Directions développées pour la location automobile",
      selectedText: "Deux approches existantes pour une audience arabophone : claire et accessible, puis sombre et premium.",
      selected: [
        ["/assets/creative-light.png", "Direction claire", "Créatif automobile clair en arabe"],
        ["/assets/creative-dark.png", "Direction premium", "Créatif automobile sombre en arabe"],
      ],
    },
    method: {
      kicker: "La méthode",
      title: "Un système simple pour apprendre vite et investir mieux.",
      steps: [
        ["01", "Comprendre", "L’offre, la marge, l’audience et le vrai objectif business."],
        ["02", "Formuler", "Un angle fort, une promesse claire et des variations créatives."],
        ["03", "Tester", "Audiences, hooks, formats et placements avec une lecture propre."],
        ["04", "Optimiser", "Réallouer vers les gagnants et documenter chaque apprentissage."],
      ],
    },
    stack: { kicker: "Stack", title: "Les outils au service de l’idée — pas l’inverse." },
    cta: {
      kicker: "Votre prochain test",
      title: "Une offre à faire grandir ? Construisons la campagne qui la rend visible.",
      text: "Parlons de votre audience, de vos créatifs et du résultat que vous voulez mesurer.",
    },
    footer: "Portfolio de Hamza Elhatimy · Media Buyer & Digital Marketer",
    location: "Nouaceur, Casablanca-Settat",
  },
  ar: {
    languageName: "FR",
    langLabel: "عرض النسخة الفرنسية",
    menuLabel: "فتح القائمة",
    closeLabel: "إغلاق المعاينة",
    previewLabel: "معاينة التصميم الإعلاني",
    cvPreviewTitle: "معاينة السيرة الذاتية",
    cvCloseLabel: "إغلاق معاينة السيرة الذاتية",
    brandRole: "مشتري إعلانات · مسوّق رقمي",
    nav: [["نبذة عني", "#a-propos"], ["النتائج", "#resultats"], ["التصاميم", "#creatifs"], ["المنهجية", "#methode"]],
    whatsappShort: "لنتحدث",
    whatsapp: "ابدأ محادثة",
    email: "إرسال بريد إلكتروني",
    hero: {
      status: "متاح لمشاريع جديدة · الدار البيضاء",
      lead: "مشتري إعلانات ومبدع رقمي",
      titleA: "أحوّل",
      titleAccent: "الانتباه",
      titleB: "إلى محادثات.",
      text: "حملات Meta وTikTok مصممة للوصول إلى الجمهور المناسب، واختبار الزوايا الأقوى، وتحقيق نتائج واضحة في المغرب ودول الخليج.",
      cv: "معاينة السيرة الذاتية",
      portraitAlt: "صورة مهنية لحمزة الحاتمي",
      signalSwitcherLabel: "اختيار مؤشر من الواجهة الرئيسية",
      signals: [
        ["تكلفة المحادثة", "0,78 €", "أفضل نتيجة موثقة"],
        ["المحادثات", "188+", "موثقة على حسابين"],
        ["جمهور الخليج", "25 M", "وصول محتمل منظم"],
      ],
      trust: ["اكتساب العملاء في الخليج", "إبداعات مهيأة للسوشيال", "قرارات مبنية على المؤشرات"],
    },
    statLabels: ["محادثة موثقة", "أفضل تكلفة للمحادثة", "أسواق مستهدفة", "النهج: اختبار ثم توسيع"],
    about: {
      kicker: "الملف المهني",
      title: "الاستراتيجية والتنفيذ والإبداع في ملف واحد.",
      text: "أربط شراء الإعلانات بالمحتوى وأدوات الويب لبناء مسار اكتساب متكامل، من أول ظهور للإعلان إلى محادثة واتساب.",
      note: "لا أكتفي بإطلاق الحملات؛ أصوغ الزاوية، وأصمم الاختبار، وأحلل البيانات، ثم أطوّر النظام.",
      cards: [
        ["01", "استراتيجية الإعلانات", "هيكلة الحملات والجمهور والميزانية وخطة الاختبار."],
        ["02", "الاستراتيجية الإبداعية", "خطافات وتصاميم وصيغ مناسبة لكل منصة."],
        ["03", "الأنظمة الرقمية", "صفحات هبوط وتقارير وأتمتة تخدم النمو."],
      ],
    },
    results: {
      kicker: "أدلة الأداء",
      title: "أرقام واضحة مقدمة ضمن سياقها.",
      intro: "نتائج مجهّلة لحملات محادثات لصالح وكالات مغربية لتأجير السيارات. المحادثة المبدوءة لا تُقدّم على أنها عملية بيع.",
      cards: [
        { market: "السوق السعودي · الحساب B", label: "أفضل كفاءة", result: "57", unit: "محادثة", cost: "0,78 €", details: [["84,39 €", "الإنفاق"], ["9 756", "الوصول"], ["21 788", "الظهور"]] },
        { market: "السوق السعودي · الحساب A", label: "أعلى حجم في حملة", result: "52", unit: "محادثة", cost: "1,33 $", details: [["184,53 $", "الإنفاق"], ["22 936", "الوصول"], ["39 104", "الظهور"]] },
      ],
      footnote: "هدف Meta: المحادثات عبر الرسائل · نافذة الإسناد كما تظهر في التقارير · النتائج المستقبلية تعتمد على العرض والميزانية والسوق.",
      audienceTitle: "جمهور خليجي منظم، وليس مجرد جمهور واسع.",
      audienceText: "استهداف ناطق بالعربية حول أهم المدن السعودية وإشارات السفر والفخامة والسيارات.",
      audienceFacts: [["21,3–25,1 M", "الجمهور المتوقع"], ["25–55", "الفئة العمرية"], ["العربية", "اللغة"]],
      audienceAlt: "إعدادات استهداف إعلانات Meta للسعودية",
      enlarge: "عرض الدليل كاملاً",
    },
    creative: {
      kicker: "ملف الإبداعات",
      title: "أفكار توقف التمرير — مع عرض التصميم كاملاً.",
      intro: "اختيارات من قطاعات متعددة تُظهر القدرة على تكييف الزاوية والأسلوب والإيقاع البصري مع كل عرض.",
      conceptBadge: "تصميم مفاهيمي · ذكاء اصطناعي",
      clientBadge: "عمل مختار · سيارات",
      open: "فتح التصميم كاملاً",
      concepts: [
        ["/assets/concept-auto-premium.jpg", "سيارات فاخرة", "فخامة · الخليج", "تصميم إعلاني مفاهيمي لسيارة فاخرة ليلاً"],
        ["/assets/concept-beauty-serum.jpg", "تجارة إلكترونية للجمال", "منتج · تحويل", "تصميم إعلاني مفاهيمي لسيروم عناية بالبشرة"],
        ["/assets/concept-food-delivery.jpg", "توصيل الطعام", "محلي · سوشيال", "تصميم إعلاني مفاهيمي لعرض برغر وتوصيل"],
      ],
      selectedTitle: "اتجاهات مطوّرة لقطاع تأجير السيارات",
      selectedText: "مقاربتان لجمهور عربي: الأولى مضيئة وسهلة، والثانية داكنة وفاخرة.",
      selected: [["/assets/creative-light.png", "اتجاه مضيء", "تصميم سيارات عربي بإخراج فاتح"], ["/assets/creative-dark.png", "اتجاه فاخر", "تصميم سيارات عربي بإخراج داكن"]],
    },
    method: {
      kicker: "المنهجية",
      title: "نظام بسيط للتعلّم بسرعة واستثمار الميزانية بذكاء.",
      steps: [
        ["01", "الفهم", "العرض والهامش والجمهور والهدف التجاري الحقيقي."],
        ["02", "الصياغة", "زاوية قوية ووعد واضح وتنوعات إبداعية."],
        ["03", "الاختبار", "الجمهور والخطافات والصيغ والمواضع بقراءة دقيقة."],
        ["04", "التحسين", "توجيه الميزانية نحو الأفضل وتوثيق كل تعلّم."],
      ],
    },
    stack: { kicker: "الأدوات", title: "الأدوات تخدم الفكرة، وليس العكس." },
    cta: { kicker: "اختبارك القادم", title: "لديك عرض يستحق النمو؟ لنبنِ الحملة التي تمنحه الظهور.", text: "لنتحدث عن جمهورك وإبداعاتك والنتيجة التي تريد قياسها." },
    footer: "ملف حمزة الحاتمي · مشتري إعلانات ومسوق رقمي",
    location: "النواصر، الدار البيضاء سطات",
  },
};

const serviceIcons = [FaChartLine, FaBrain, FaBolt];

function Brand({ t }) {
  return (
    <a className="brand" href="#accueil" aria-label="Hamza Elhatimy">
      <span className="brand-mark"><img src="/assets/site-logo-v1.png" alt="" /></span>
      <span className="brand-copy"><strong>Hamza Elhatimy</strong><small>{t.brandRole}</small></span>
    </a>
  );
}

function ContactButtons({ t }) {
  return (
    <div className="contact-buttons">
      <a className="button button-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><FaWhatsapp aria-hidden="true" />{t.whatsapp}</a>
      <a className="button button-ghost" href="mailto:hamzaelhatimy7@gmail.com"><FaEnvelope aria-hidden="true" />{t.email}</a>
    </div>
  );
}

function Lightbox({ item, t, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={t.previewLabel} onClick={onClose}>
      <button type="button" onClick={onClose} aria-label={t.closeLabel}>×</button>
      <figure onClick={(event) => event.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        {item.title && <figcaption>{item.title}</figcaption>}
      </figure>
    </div>
  );
}

function CvPreview({ t, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="cv-modal" role="dialog" aria-modal="true" aria-label={t.cvPreviewTitle} onClick={onClose}>
      <div className="cv-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="cv-modal-header">
          <div><span>PDF · 2026</span><h2>{t.cvPreviewTitle}</h2></div>
          <button type="button" onClick={onClose} aria-label={t.cvCloseLabel}>×</button>
        </div>
        <iframe src="/assets/Hamza-Elhatimy-CV-2026.pdf#toolbar=0&navpanes=0&scrollbar=1" title={t.cvPreviewTitle} />
      </div>
    </div>
  );
}

export function App() {
  const [language, setLanguage] = useState("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [cvOpen, setCvOpen] = useState(false);
  const [activeSignal, setActiveSignal] = useState(0);
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const openPreview = (src, alt, title = "") => setLightbox({ src, alt, title });
  const closeMenu = () => setMenuOpen(false);
  const switchLanguage = () => {
    setLanguage((current) => current === "fr" ? "ar" : "fr");
    setMenuOpen(false);
    setActiveSignal(0);
  };

  const handleHeroPointer = (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    event.currentTarget.style.setProperty("--pointer-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${y * 100}%`);
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 3.5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 4.5}deg`);
  };

  const resetHeroPointer = (event) => {
    event.currentTarget.style.setProperty("--pointer-x", "72%");
    event.currentTarget.style.setProperty("--pointer-y", "38%");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Brand t={t} />
          <nav className={menuOpen ? "open" : ""} aria-label="Navigation principale">
            {t.nav.map(([label, href]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
          </nav>
          <div className="header-actions">
            <button className="language-switch" type="button" onClick={switchLanguage} aria-label={t.langLabel}>{t.languageName}</button>
            <a className="header-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer"><FaWhatsapp aria-hidden="true" />{t.whatsappShort}</a>
            <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={t.menuLabel}><span /><span /></button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="accueil" onPointerMove={handleHeroPointer} onPointerLeave={resetHeroPointer}>
          <div className="hero-orb" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <span className="status-pill"><i />{t.hero.status}</span>
              <p className="hero-lead">{t.hero.lead}</p>
              <h1>{t.hero.titleA} <em>{t.hero.titleAccent}</em><br />{t.hero.titleB}</h1>
              <p className="hero-text">{t.hero.text}</p>
              <ContactButtons t={t} />
              <button className="cv-link" type="button" onClick={() => setCvOpen(true)}><FaEye aria-hidden="true" />{t.hero.cv}</button>
              <div className="hero-trust">
                {t.hero.trust.map((item) => <span key={item}><FaCheck aria-hidden="true" />{item}</span>)}
              </div>
            </div>

            <div className="portrait-stage reveal">
              <div className="portrait-frame"><img src="/assets/hamza-profile.jpg" alt={t.hero.portraitAlt} /></div>
              <div className="portrait-name"><span>Hamza</span><strong>Elhatimy</strong></div>
              <div className="floating-result" aria-live="polite">
                <div className="signal-value" key={`${language}-${activeSignal}`}>
                  <span>{t.hero.signals[activeSignal][0]}</span><strong>{t.hero.signals[activeSignal][1]}</strong><small>{t.hero.signals[activeSignal][2]}</small>
                </div>
                <div className="signal-switcher" role="tablist" aria-label={t.hero.signalSwitcherLabel}>
                  {t.hero.signals.map(([label], index) => (
                    <button key={label} type="button" role="tab" aria-selected={activeSignal === index} aria-label={label} className={activeSignal === index ? "active" : ""} onClick={() => setActiveSignal(index)}>{index + 1}</button>
                  ))}
                </div>
              </div>
              <div className="portrait-dots" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="stats-band" aria-label="Indicateurs clés">
          <div className="container stats-grid reveal">
            {["188+", "0,78 €", "GCC + MA", "A/B"].map((value, index) => (
              <div className="headline-stat" key={value}><strong>{value}</strong><span>{t.statLabels[index]}</span></div>
            ))}
          </div>
        </section>

        <section className="about section" id="a-propos">
          <div className="container">
            <div className="split-heading reveal">
              <span className="section-index">01 / {t.about.kicker}</span>
              <div><h2>{t.about.title}</h2><p>{t.about.text}</p></div>
            </div>
            <div className="about-layout reveal">
              <aside className="about-note"><span>HE / 2026</span><p>{t.about.note}</p></aside>
              <div className="service-grid">
                {t.about.cards.map(([number, title, description], index) => {
                  const Icon = serviceIcons[index];
                  return <article className="service-card" key={number}><div className="service-meta"><span>{number}</span><Icon aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></article>;
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="results section" id="resultats">
          <div className="container">
            <div className="section-heading reveal">
              <div><span className="section-index">02 / {t.results.kicker}</span><h2>{t.results.title}</h2></div>
              <p>{t.results.intro}</p>
            </div>
            <div className="result-grid reveal">
              {t.results.cards.map((card, index) => (
                <article className={`result-card result-${index + 1}`} key={card.market}>
                  <div className="result-top"><span>{card.label}</span><span>0{index + 1}</span></div>
                  <h3>{card.market}</h3>
                  <div className="result-number"><strong>{card.result}</strong><span>{card.unit}</span></div>
                  <div className="cost-row"><span>CPA</span><strong>{card.cost}</strong></div>
                  <div className="mini-metrics">
                    {card.details.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
                  </div>
                </article>
              ))}
            </div>
            <p className="result-footnote reveal">{t.results.footnote}</p>

            <div className="audience-card reveal">
              <div className="audience-copy">
                <span className="mini-kicker">GCC / KSA</span>
                <h3>{t.results.audienceTitle}</h3>
                <p>{t.results.audienceText}</p>
                <div className="audience-facts">{t.results.audienceFacts.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
              </div>
              <button className="audience-preview" type="button" onClick={() => openPreview("/assets/audience-ksa.png", t.results.audienceAlt, t.results.audienceTitle)} aria-label={t.results.enlarge}>
                <img src="/assets/audience-ksa.png" alt={t.results.audienceAlt} />
                <span>{t.results.enlarge}<FaArrowRight aria-hidden="true" /></span>
              </button>
            </div>
          </div>
        </section>

        <section className="creative-section section" id="creatifs">
          <div className="container">
            <div className="section-heading creative-heading reveal">
              <div><span className="section-index">03 / {t.creative.kicker}</span><h2>{t.creative.title}</h2></div>
              <p>{t.creative.intro}</p>
            </div>
            <div className="concept-grid reveal">
              {t.creative.concepts.map(([src, title, tag, alt]) => (
                <article className="concept-card" key={src}>
                  <button type="button" onClick={() => openPreview(src, alt, title)} aria-label={`${t.creative.open} : ${title}`}>
                    <img src={src} alt={alt} />
                    <span className="image-action"><FaArrowRight aria-hidden="true" /></span>
                  </button>
                  <div className="concept-copy"><span>{t.creative.conceptBadge}</span><h3>{title}</h3><p>{tag}</p></div>
                </article>
              ))}
            </div>

            <div className="selected-work reveal">
              <div className="selected-intro"><span>{t.creative.clientBadge}</span><h3>{t.creative.selectedTitle}</h3><p>{t.creative.selectedText}</p></div>
              <div className="selected-grid">
                {t.creative.selected.map(([src, title, alt]) => (
                  <article key={src}>
                    <button type="button" onClick={() => openPreview(src, alt, title)} aria-label={`${t.creative.open} : ${title}`}><img src={src} alt={alt} /></button>
                    <h4>{title}</h4>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="method section" id="methode">
          <div className="container">
            <div className="split-heading reveal"><span className="section-index">04 / {t.method.kicker}</span><div><h2>{t.method.title}</h2></div></div>
            <div className="method-grid reveal">
              {t.method.steps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
            </div>
          </div>
        </section>

        <section className="stack section">
          <div className="container reveal"><span className="section-index">05 / {t.stack.kicker}</span><h2>{t.stack.title}</h2></div>
          <div className="marquee" aria-label="Outils utilisés"><div className="marquee-track">{[...toolStack, ...toolStack].map(({ name, Icon }, index) => <div className="tool" key={`${name}-${index}`}><Icon aria-hidden="true" /><span>{name}</span></div>)}</div></div>
        </section>

        <section className="cta-section" id="contact">
          <div className="container cta-inner reveal">
            <div><span className="section-index">06 / {t.cta.kicker}</span><h2>{t.cta.title}</h2><p>{t.cta.text}</p></div>
            <ContactButtons t={t} />
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <Brand t={t} />
          <p>© 2026 · {t.footer}</p>
          <div className="footer-links"><a href="mailto:hamzaelhatimy7@gmail.com">hamzaelhatimy7@gmail.com</a><span><FaMapMarkerAlt aria-hidden="true" />{t.location}</span></div>
        </div>
      </footer>

      {lightbox && <Lightbox item={lightbox} t={t} onClose={() => setLightbox(null)} />}
      {cvOpen && <CvPreview t={t} onClose={() => setCvOpen(false)} />}
    </>
  );
}
