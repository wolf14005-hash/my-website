/* main.js — تنقّل + تشغيل فيديو الهيرو في home + صفحة المعايير + زر "فتح" للمؤشرات
   + مودال فيديو تعريفي يظهر تلقائياً عند فتح الصفحة ويظهر مجددًا عند كل تحديث.

   ملاحظات:
   - المودال لا يحفظ "تم الإغلاق"، لذلك سيظهر مجددًا كل مرة تعيد فيها تحميل الصفحة.
   - التشغيل التلقائي للمودال متوافق قدر الإمكان: video.muted = true و playsinline.
*/

document.addEventListener("DOMContentLoaded", () => {
  // ===== عناصر عامة =====
  const navLinks = [...document.querySelectorAll("[data-route]")];
  const backButton = document.getElementById("backButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");

  const heroVideo = document.getElementById("heroVideo");
  const videoToggle = document.getElementById("videoToggle");
  const videoIcon = document.getElementById("videoIcon");
  const heroFsBtn = document.getElementById("heroFullscreen");

  let pageHistory = ["home"];
  let currentPage = "home";

  // ===== أدوات ملء الشاشة للفيديو =====
  function enterFullscreenForVideo(videoEl) {
    const canWebkit = typeof videoEl?.webkitEnterFullscreen === "function";
    const ua = navigator.userAgent || "";
    if (canWebkit && /iPad|iPhone|iPod/.test(ua)) {
      try { videoEl.webkitEnterFullscreen(); return true; } catch(e){}
    }
    const req = videoEl?.requestFullscreen || videoEl?.webkitRequestFullscreen || videoEl?.msRequestFullscreen;
    if (req) { try { req.call(videoEl); return true; } catch(e){} }
    return false;
  }
  function exitFullscreenIfAny() {
    const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      try { exit.call(document); } catch(e){}
    }
  }

  // ===== تشغيل/إيقاف فيديو الهيرو حسب الصفحة =====
  let triedHeroOnce = false;
  async function autoplayHeroSafe() {
    if (!heroVideo) return;
    try {
      heroVideo.muted = true;
      heroVideo.playsInline = true;
      heroVideo.setAttribute?.("playsinline", "");
      if (!triedHeroOnce && heroVideo.readyState < 2) heroVideo.load();
      await heroVideo.play();
      if (videoIcon) videoIcon.className = "fas fa-pause";
    } catch(e) {
      if (videoIcon) videoIcon.className = "fas fa-play";
      console.warn("Hero autoplay blocked or failed:", e);
    } finally {
      triedHeroOnce = true;
    }
  }
  function pauseHeroSafe() {
    if (!heroVideo) return;
    try { heroVideo.pause(); } catch(_){}
    if (videoIcon) videoIcon.className = "fas fa-play";
  }
  function ensureHeroAutoplayIfHome() {
    if (currentPage === "home" && heroVideo?.paused) autoplayHeroSafe();
  }
  window.addEventListener("pageshow", ensureHeroAutoplayIfHome);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") ensureHeroAutoplayIfHome();
  });
  heroVideo?.addEventListener("loadeddata", ensureHeroAutoplayIfHome);
  heroVideo?.addEventListener("canplay", ensureHeroAutoplayIfHome);
  heroVideo?.addEventListener("error", () => {
    console.error("Video error:", heroVideo.error);
  });

  // ===== البيانات: المجالات ⟶ المعايير ⟶ المؤشرات =====
  const CRITERIA_DATA = {
    leadership: {
      title: "القيادة والتخطيط المدرسي",
      weight: "25%",
      items: [
        { title: "فاعلية القيادة", weight: "—", clauses: [
          { title: "تنظيم إداري وتوزيع أدوار", pdf: "file/1/1.pdf", file: "" },
          { title: "تعزيز قيم المواطنة والهوية", pdf: "file/1/2.pdf ", file: "" },
          { title: "غرس أخلاقيات مهنة التعليم", pdf: "file/1/3.pdf", file: "" },
          { title: "تشجيع المجتمع على اجراء البحوث ", pdf: "file/1/4.pdf", file: "" },
          { title: "تواصل قيادي فعّال", pdf: "", file: "file/1/5.pdf" },
          { title: "متابعة تنفيذ الخطط", pdf: "", file: "file/1/6.pdf" },
        ]},
        { title: "خطة المدرسة وارتباطها مع الخطط الأخرى", weight: "—", clauses: [
          { title: "صياغة الرؤية والرسالة وفق الجودة", pdf: "file/1/2/1.pdf", file: "" },
          { title: "خطة أهداف ومجالات واضحة", pdf: "file/1/2/2.pdf", file: "" },
          { title: "استراتيجية تنفيذية محدثة", pdf: "file/1/2/3.pdf", file: "" },
          { title: "متابعة تنفيذ الخطة", pdf: "", file: "file/1/2/4.pdf" },
          { title: "إشراك المجتمع المدرسي بالخطة", pdf: "file/1/2/5.pdf", file: "" },
          { title: "تقويم داخلي دوري للخطة", pdf: "", file: "file/1/2/6.pdf" },
          { title: "متابعة سنوية محكومة", pdf: "", file: "file/1/2/7.pdf" },
          { title: "ارتباط الخطة بالخطط الأخرى", pdf: "file/1/2/8.pdf", file: "" },
        ]},
      ],
    },
    admin: {
      title: "التنظيم الإداري",
      weight: "20%",
      items: [
        { title: "المجالس واللجان والفرق المدرسية", weight: "—", clauses: [
          { title: "تفعيل أدلة الفرق والمجالس", pdf: "file/2/1/1.pdf", file: "" },
          { title: "لجان فاعلة لتحسين الأداء", pdf: "file/2/1/2.pdf", file: "" },
        ]},
        { title: "إجراءات الأمن والسلامة", weight: "—", clauses: [
          { title: "أدوات وإرشادات السلامة متوفرة", pdf: "file/2/2/1.pdf", file: "" },
          { title: "خطط إخلاء وتدريب", pdf: "file/2/2/2.pdf", file: "" },
          { title: "صيانة مرافق دورية", pdf: "file/2/2/3.pdf", file: "" },
          { title: "جاهزية للطوارئ", pdf: "file/2/2/4.pdf", file: "" },
          { title: "نقل مدرسي آمن", pdf: "file/2/2/5.pdf", file: "" },
          { title: "غرفة طوارئ وتجهيزاتها", pdf: "file/2/2/6.pdf", file: "" },
          { title: "تدريب العاملين على السلامة", pdf: "file/2/2/7.pdf", file: "" },
          { title: "متابعة تطبيق تعليمات السلامة", pdf: "file/2/2/8.pdf", file: "" },
        ]},
        { title: "القوانين والأنظمة واللوائح", weight: "—", clauses: [
          { title: "توفر القوانين والأنظمة المدرسية", pdf: "file/2/3/1.pdf", file: "" },
          { title: "تفعيل اللوائح ومتابعة الأثر", pdf: "file/2/3/2.pdf", file: "" },
          { title: "التزام فعاليات الطابور", pdf: "file/2/3/3.pdf", file: "" },
          { title: "إجراءات إدارية منضبطة", pdf: "file/2/3/4.pdf", file: "" },
        ]},
      ],
    },
    quality: {
      title: "جودة الأداء المدرسي",
      weight: "42.5%",
      items: [
        { title: "تطوير أداء الهيئة التعليمية", weight: "—", clauses: [
          { title: "تقنيات حديثة داعمة للتعليم", pdf: "file/3/1/1.pdf", file: "" },
          { title: "برامج نمو مهني للمعلمين", pdf: "file/3/1/2.pdf", file: "" },
          { title: "زيارات إشرافية وتغذية راجعة", pdf: "file/3/1/3.pdf", file: "" },
          { title: "التزام بتنفيذ الخطط التعليمية", pdf: "file/3/1/4.pdf", file: "" },
          { title: "تحسن أداء الهيئة التعليمية", pdf: "file/3/1/5.pdf", file: "" },
          { title: "تنوع أساليب واستراتيجيات التدريس", pdf: "file/3/1/6.pdf", file: "" },
          { title: "أساليب تحفيز للكادر التعليمي", pdf: "file/3/1/7.pdf", file: "" },
          { title: "تنمية مهارات وقدرات المعلمين", pdf: "file/3/1/8.pdf", file: "" },
          { title: "توظيف الموارد التعليمية بكفاءة", pdf: "file/3/1/9.pdf", file: "" },
        ]},
        { title: "التحصيل الدراسي", weight: "—", clauses: [
          { title: "تحليل بيانات الوزارة للتحصيل", pdf: "file/3/2/1.pdf", file: "" },
          { title: "تحليل دوري لنتائج التحصيل", pdf: "file/3/2/2.pdf", file: "" },
          { title: "إجراءات داعمة لرفع التحصيل", pdf: "file/3/2/3.pdf", file: "" },
          { title: "خطط رفع المستوى الدراسي", pdf: "file/3/2/4.pdf", file: "" },
          { title: "مراكز متقدمة على مستوى المحافظة", pdf: "file/3/2/5.pdf", file: "" },
          { title: "توظيف الوسائل والمصادر للتعلم", pdf: "file/3/2/6.pdf", file: "" },
          { title: "آلية تحفيز الطلبة المتفوقين", pdf: "file/3/2/7.pdf", file: "" },
        ]},
        { title: "الأنشطة المدرسية والرعاية الطلابية", weight: "—", clauses: [
          { title: "حصر فئات الرعاية الطلابية", pdf: "file/3/3/1.pdf", file: "" },
          { title: "برامج دعم للدمج والمستويات", pdf: "file/3/3/2.pdf", file: "" },
          { title: "مشاركة في مسابقات وأنشطة", pdf: "file/3/3/3.pdf", file: "" },
          { title: "بيئة مدرسية داعمة وآمنة", pdf: "file/3/3/4.pdf", file: "" },
          { title: "فعاليات وأنشطة متنوعة", pdf: "file/3/3/5.pdf", file: "" },
          { title: "إبراز المواهب والإنجازات", pdf: "", file: "file/3/3/6.pdf" },
          { title: "تكريم فئات الرعاية المختلفة", pdf: "file/3/3/7.pdf", file: "" },
          { title: "الالتزام بضوابط الأنشطة وتوثيقها", pdf: "file/3/3/8.pdf", file: "" },
          { title: "أنشطة لا منهجية منظّمة", pdf: "", file: "file/3/3/9.pdf" },
          { title: "احتفالات مناسبات وطنية ودينية", pdf: "file/3/3/10.pdf", file: "" },
          { title: "توجيه الأنشطة للقيم والسلوك", pdf: "file/3/3/11.pdf", file: "" },
          { title: "نشر ثقافة العمل التطوعي", pdf: "file/3/3/12.pdf", file: "" },
        ]},
      ],
    },
    partnership: {
      title: "الشراكة المجتمعية",
      weight: "12.5%",
      items: [
        { title: "الشراكة المجتمعية", weight: "—", clauses: [
          { title: "تفعيل مجلس أولياء الأمور واجتماعاته", pdf: "file/4/1.pdf", file: "" },
          { title: "مساهمة المجلس برفع التحصيل", pdf: "file/4/2.pdf", file: "" },
          { title: "مشاركة أولياء الأمور في الأنشطة", pdf: "file/4/3.pdf", file: "" },
          { title: "شراكات لمشروعات الاستدامة", pdf: "file/4/4.pdf", file: "" },
          { title: "توظيف خبرات ومهارات أولياء الأمور", pdf: "file/4/5.pdf", file: "" },
          { title: "مشاركة في حل مشكلات الطلبة", pdf: "file/4/6.pdf", file: "" },
          { title: "شراكات مع مؤسسات المجتمع المحلي", pdf: "file/4/7.pdf", file: "" },
          { title: "مبادرات مجتمعية مؤثرة", pdf: "file/4/8.pdf", file: "" },
          { title: "دعم تعلم الطلبة وتحسين البيئة", pdf: "file/4/9.pdf", file: "" },
        ]},
      ],
    },
  };

  // ===== صفحات =====
  const pages = () => [...document.querySelectorAll("[data-page]")];
  const normalizePageName = (name) => String(name || "").trim().toLowerCase();

  function showPage(pageRaw) {
    const page = normalizePageName(pageRaw);
    const all = pages();
    let found = false;

    all.forEach((sec) => {
      const isTarget = normalizePageName(sec.dataset.page) === page;
      sec.classList.toggle("hidden", !isTarget);
      sec.classList.toggle("block", isTarget);
      if (isTarget) found = true;
    });

    navLinks.forEach((a) => {
      const active = normalizePageName(a.dataset.route) === page;
      a.setAttribute("aria-current", active ? "page" : "false");
      a.classList.toggle("text-indigo-600", active);
      a.classList.toggle("font-bold", active);
    });

    if (found) currentPage = page;

    if (currentPage === "home") autoplayHeroSafe(); else pauseHeroSafe();

    if (pageHistory.length > 1 && currentPage !== "home") backButton?.classList.remove("hidden");
    else backButton?.classList.add("hidden");

    if (mobileMenu?.dataset.open === "true") toggleMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateTo(pageRaw) {
    const page = normalizePageName(pageRaw);
    if (pageHistory[pageHistory.length - 1] !== page) pageHistory.push(page);
    showPage(page);
    history.replaceState(null, "", `#${page}`);
  }

  function goBack() {
    if (pageHistory.length > 1) {
      pageHistory.pop();
      const prev = pageHistory[pageHistory.length - 1];
      showPage(prev);
      history.replaceState(null, "", `#${prev}`);
    }
  }

  function toggleMobileMenu(force) {
    if (!mobileMenu) return;
    const open = typeof force === "boolean" ? force : mobileMenu.dataset.open !== "true";
    mobileMenu.dataset.open = open ? "true" : "false";
    mobileMenu.classList.toggle("hidden", !open);
  }

  // ===== صفحة "المعايير" (تُنشأ ديناميكيًا) =====
  function ensureCriteriaPage() {
    let sec = document.querySelector('[data-page="criteria"]');
    if (sec) return sec;

    sec = document.createElement("section");
    sec.setAttribute("data-page", "criteria");
    sec.className = "hidden";
    sec.innerHTML = `
      <div class="container mx-auto container-std px-4 py-14">
        <div class="mb-8 flex items-center justify-between">
          <button type="button" id="criteriaBack" class="inline-flex items-center gap-2 px-3 h-10 rounded-lg border text-sm hover:bg-gray-50">
            <i class="fas fa-arrow-right"></i><span>رجوع</span>
          </button>
          <div id="criteriaWeight" class="text-sm text-gray-600"></div>
        </div>

        <header class="mb-6">
          <h2 id="criteriaTitle" class="text-2xl md:text-3xl font-extrabold"></h2>
          <p id="criteriaSubtitle" class="text-gray-600 mt-2"></p>
        </header>

        <div id="criteriaList" class="grid md:grid-cols-2 gap-6"></div>
      </div>
    `;
    document.querySelector("main").appendChild(sec);
    sec.querySelector("#criteriaBack").addEventListener("click", goBack);
    return sec;
  }

  const clauseState = {};

  function renderCriteriaPage(key) {
    const data = CRITERIA_DATA[key];
    const sec = ensureCriteriaPage();
    const titleEl = sec.querySelector("#criteriaTitle");
    const subEl = sec.querySelector("#criteriaSubtitle");
    const weightEl = sec.querySelector("#criteriaWeight");
    const listEl = sec.querySelector("#criteriaList");

    if (!data) {
      titleEl.textContent = "المعايير";
      subEl.textContent = "";
      weightEl.textContent = "";
      listEl.innerHTML = `<div class="text-gray-600">لا توجد بيانات لهذا القسم.</div>`;
      return;
    }

    titleEl.textContent = data.title;
    subEl.textContent = "اضغط «عرض المؤشرات» لفتح اللوح وعرض قائمة المؤشرات الخاصة بكل معيار.";
    weightEl.textContent = data.weight ? `الوزن النسبي: ${data.weight}` : "";

    listEl.innerHTML = data.items.map((item, idx) => {
      const keyId = `${key}-${idx}`;
      const count = item.clauses?.length || 0;
      return `
        <article class="bg-white rounded-2xl border shadow-sm">
          <div class="p-5 flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h3
                class="font-bold cursor-pointer focus:outline-none"
                role="button" tabindex="0"
                aria-controls="clauses-panel-${keyId}"
                aria-expanded="false"
                data-criteria-title
                data-key="${key}" data-index="${idx}"
              >${item.title}</h3>
              ${item.weight && item.weight !== "—" ? `<div class="mt-1 text-xs text-gray-500">الوزن: ${item.weight}</div>` : ``}
              <div class="mt-1 text-xs text-gray-500">عدد المؤشرات: ${count}</div>
            </div>
            <div class="shrink-0 inline-flex items-center px-2 h-7 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">معيار</div>
          </div>

          <div class="px-5 pb-5">
            <button type="button"
              class="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              data-open-clauses data-key="${key}" data-index="${idx}"
              aria-controls="clauses-panel-${keyId}" aria-expanded="false">
              <i class="fa-solid fa-list-ul"></i><span>عرض المؤشرات</span>
            </button>
          </div>

          <div id="clauses-panel-${keyId}" class="overflow-hidden transition-all duration-300 ease-in-out max-h-0" role="region" aria-label="قائمة المؤشرات">
            <div class="pt-0 px-5 pb-5"><div id="slide-${keyId}"></div></div>
          </div>
        </article>
      `;
    }).join("");

    listEl.querySelectorAll("[data-open-clauses]").forEach((btn) => {
      btn.addEventListener("click", () => togglePanel(btn.getAttribute("data-key"), parseInt(btn.getAttribute("data-index"), 10) || 0));
    });
    listEl.querySelectorAll("[data-criteria-title]").forEach((titleBtn) => {
      const keyAttr = titleBtn.getAttribute("data-key");
      const idx = parseInt(titleBtn.getAttribute("data-index"), 10) || 0;
      titleBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); togglePanel(keyAttr, idx); }
      });
      titleBtn.addEventListener("click", () => togglePanel(keyAttr, idx));
    });
  }

  function renderIndicatorsList(key, idx) {
    const itemKey = `${key}-${idx}`;
    const item = (CRITERIA_DATA[key] || {}).items?.[idx];
    if (!item?.clauses?.length) return;
    const slideBox = document.getElementById(`slide-${itemKey}`);
    if (!slideBox) return;

    slideBox.innerHTML = `
      <ol class="space-y-3">
        ${item.clauses.map((c, i) => {
          const href = c.pdf || c.file || "";
          return `
            <li class="bg-gray-50 border rounded-xl p-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="font-semibold">المؤشر ${i + 1}: ${c.title}</div>
                <div>
                  <button type="button"
                    class="inline-flex items-center gap-2 px-3 h-10 rounded-lg bg-white border hover:bg-gray-50"
                    data-open-indicator data-href="${href}"
                    aria-label="فتح${href ? ' الملف' : ''}"
                    title="${href ? 'فتح الملف' : 'لا يوجد ملف مرتبط'}">
                    <i class="fa-solid fa-up-right-from-square"></i><span>فتح</span>
                  </button>
                </div>
              </div>
            </li>
          `;
        }).join("")}
      </ol>
    `;

    slideBox.querySelectorAll("[data-open-indicator]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const href = btn.getAttribute("data-href");
        if (href) window.open(href, "_blank", "noopener,noreferrer");
        else alert("لا يوجد ملف مرتبط بهذا المؤشر حاليًا.");
      });
    });
  }

  function togglePanel(key, idx) {
    const itemKey = `${key}-${idx}`;
    const panel = document.getElementById(`clauses-panel-${itemKey}`);
    const article = panel?.closest("article");
    const btn = article?.querySelector(`[data-open-clauses][data-key="${key}"][data-index="${idx}"]`);
    const titleBtn = article?.querySelector(`[data-criteria-title][data-key="${key}"][data-index="${idx}"]`);
    if (!panel || !btn || !titleBtn) return;

    if (!clauseState[itemKey]) clauseState[itemKey] = { open: false };
    const opening = !clauseState[itemKey].open;

    if (opening) {
      renderIndicatorsList(key, idx);
      panel.style.maxHeight = "none";
      const h = panel.scrollHeight;
      panel.style.maxHeight = h + "px";
      clauseState[itemKey].open = true;
      btn.querySelector("span").textContent = "إخفاء المؤشرات";
      btn.setAttribute("aria-expanded", "true");
      titleBtn.setAttribute("aria-expanded", "true");
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      requestAnimationFrame(() => { panel.style.maxHeight = "0px"; });
      clauseState[itemKey].open = false;
      btn.querySelector("span").textContent = "عرض المؤشرات";
      btn.setAttribute("aria-expanded", "false");
      titleBtn.setAttribute("aria-expanded", "false");
    }
  }

  function bindCriteriaButtonsToPage() {
    document.querySelectorAll('[data-toggle="criteria"]').forEach((btn) => {
      if (btn.dataset.bound === "page") return;
      btn.dataset.bound = "page";

      btn.addEventListener("click", () => {
        let key = btn.getAttribute("data-criteria");
        if (!key) {
          const target = btn.getAttribute("data-target") || "";
          const m = target.match(/#criteria-([\w-]+)/i);
          if (m && m[1]) key = m[1];
        }
        if (!CRITERIA_DATA[key]) {
          const normalized = (key || "").replace(/-/g, "").toLowerCase();
          if (CRITERIA_DATA[normalized]) key = normalized;
        }
        renderCriteriaPage(key || "");
        navigateTo("criteria");
      });
    });
  }
  bindCriteriaButtonsToPage();

  // ===== ربط التنقل =====
  function bindNav() {
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const page = link.dataset.route;
        if (!page) return;
        e.preventDefault();
        navigateTo(page);
      });
    });
    mobileMenuToggle?.addEventListener("click", () => toggleMobileMenu());
    mobileMenu?.querySelectorAll("[data-route]")?.forEach((a) => a.addEventListener("click", () => toggleMobileMenu(false)));
    window.addEventListener("hashchange", () => {
      const target = (location.hash || "#home").replace("#", "");
      navigateTo(target || "home");
    });
    backButton?.addEventListener("click", goBack);
  }
  bindNav();

  // ===== أزرار فيديو الهيرو (يدوي) =====
  if (videoToggle && heroVideo) {
    videoToggle.addEventListener("click", () => {
      if (heroVideo.paused) {
        heroVideo.play().then(() => { if (videoIcon) videoIcon.className = "fas fa-pause"; }).catch(() => {});
      } else {
        heroVideo.pause();
        if (videoIcon) videoIcon.className = "fas fa-play";
      }
    });
  }
  if (heroVideo && heroFsBtn) {
    heroFsBtn.addEventListener("click", () => {
      enterFullscreenForVideo(heroVideo) || alert("المتصفح لا يدعم ملء الشاشة لهذا الفيديو.");
    });
  }

  // ===== مودال الفيديو التعريفي (يظهر تلقائياً عند فتح الصفحة ويظهر مجددًا عند كل تحديث) =====
  (function setupIntroVideoModal() {
    const modal    = document.getElementById("introVideoModal");
    const video    = document.getElementById("introVideo");
    const closeBtn = document.getElementById("introVideoClose");
    const fsBtn    = document.getElementById("introVideoFullscreen");
    if (!modal || !video || !closeBtn) return;

    // ✳️ ضع مسار الفيديو هنا:
    const INTRO_VIDEO_URL = "videos/10.mp4"; // مثال: videos/intro.mp4

    function openIntroVideo() {
      // جهّز الفيديو
      video.src = INTRO_VIDEO_URL;
      video.muted = true;              // لتجاوز سياسات autoplay
      video.playsInline = true;        // iOS
      video.setAttribute("playsinline", "");

      // أظهر المودال
      modal.classList.add("is-open");
      modal.classList.remove("hidden");
      document.documentElement.classList.add("body-locked");

      // جرب التشغيل
      const tryPlay = () => {
        video.play().catch((err) => {
          // إذا منع المتصفح التشغيل التلقائي، اترك controls ظاهرة ليضغط المستخدم
          console.warn("Intro autoplay blocked:", err);
          video.setAttribute("controls", "controls");
        });
      };

      // إذا كان المصدر جاهزاً شغّله، وإلا انتظر canplay
      if (video.readyState >= 2) tryPlay();
      else video.addEventListener("canplay", tryPlay, { once: true });
    }

    function closeIntroVideo() {
      exitFullscreenIfAny();
      try { video.pause(); } catch(e){}
      video.removeAttribute("src");
      video.load(); // حرّر المصدر

      modal.classList.remove("is-open");
      setTimeout(() => modal.classList.add("hidden"), 200);
      document.documentElement.classList.remove("body-locked");
    }

    // إغلاقات وأزرار
    closeBtn.addEventListener("click", closeIntroVideo);
    modal.addEventListener("click", (e) => {
      // أغلق بالنقر خارج إطار الفيديو
      const frame = e.target.closest(".max-w-4xl, .modal-frame");
      if (!frame) closeIntroVideo();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeIntroVideo();
    });
    fsBtn?.addEventListener("click", () => {
      enterFullscreenForVideo(video) || alert("المتصفح لا يدعم ملء الشاشة لهذا الفيديو.");
    });

    // ✅ افتح المودال تلقائياً كل مرة تُحمّل فيها الصفحة
    // (لا نستخدم localStorage، لذلك سيظهر مجددًا بعد كل refresh)
    setTimeout(openIntroVideo, 200);
  })();

  // ===== ابدأ حسب الهاش =====
  const initial = (location.hash || "#home").replace("#", "");
  const allowed = ["home", "about", "services", "news", "contact", "criteria"];
  if (allowed.includes(normalizePageName(initial))) {
    if (normalizePageName(initial) === "criteria") renderCriteriaPage("leadership");
    navigateTo(initial);
  } else {
    navigateTo("home");
  }
});
