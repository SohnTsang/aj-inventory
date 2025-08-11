(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });
  }

  // Compute header height for hero and scroll offset
  function setHeaderHeightVar() {
    const header = document.querySelector('.site-header');
    const h = header ? header.getBoundingClientRect().height : 72;
    document.documentElement.style.setProperty('--header-h', `${Math.round(h)}px`);
  }
  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);

  // Smooth scroll for same-page anchors with offset handling
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const dest = document.querySelector(hash);
    if (!dest) return;
    e.preventDefault();
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
    const y = dest.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  // Reveal on scroll - 15% threshold
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add('in'));
  } else if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: [0, 0.15, 1] });

    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Disable hero micro parallax (no transform on scroll)
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.transform = '';

  // Hide header on scroll down, show on scroll up
  const headerEl = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;
  function onScrollDirection() {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    const threshold = 5;
    if (currentY <= 2) {
      headerEl && headerEl.classList.remove('hide');
    } else if (delta > threshold) {
      headerEl && headerEl.classList.add('hide');
    } else if (delta < -threshold) {
      headerEl && headerEl.classList.remove('hide');
    }
    lastScrollY = currentY;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScrollDirection);
      ticking = true;
    }
  }, { passive: true });

  // Services carousel (pointer, keys, buttons, progress, auto-advance, peek next)
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const progressBar = document.querySelector('.slider-progress .bar');
  let index = 0;

  function updateCarousel() {
    if (!track) return;
    const cards = Array.from(track.children);
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24');
    const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
    const visible = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visible);
    index = Math.max(0, Math.min(index, maxIndex));
    const offset = -(index * (cardWidth + gap));
    track.style.transform = `translateX(${offset}px)`;
    if (progressBar) progressBar.style.width = `${((index) / (maxIndex || 1)) * 100}%`;
  }

  function getVisibleCards() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function move(delta) {
    if (!track) return;
    const cards = Array.from(track.children);
    const visible = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visible);
    index += delta;
    if (index > maxIndex) index = 0; // loop to start
    if (index < 0) index = maxIndex; // loop to end
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => move(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => move(1));
  window.addEventListener('resize', () => updateCarousel());
  updateCarousel();

  // Auto-advance services
  let servicesTimer = null;
  function startServicesAuto() {
    stopServicesAuto();
    servicesTimer = setInterval(() => move(1), 3500);
  }
  function stopServicesAuto() { if (servicesTimer) { clearInterval(servicesTimer); servicesTimer = null; } }
  if (track) {
    track.addEventListener('mouseenter', stopServicesAuto);
    track.addEventListener('mouseleave', startServicesAuto);
    startServicesAuto();
  }

  // Keyboard + drag support on track
  if (track) {
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    });

    // basic drag / swipe
    let startX = 0; let dragging = false; let lastX = 0;
    const onDown = (x) => { dragging = true; startX = x; lastX = x; track.style.transition = 'none'; };
    const onMove = (x) => {
      if (!dragging) return;
      const dx = x - startX;
      track.style.transform = `translateX(calc(${-(index)*(track.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24'))}px + ${dx}px))`;
      lastX = x;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      const dx = lastX - startX;
      const threshold = 40; // px
      if (dx > threshold) move(-1); else if (dx < -threshold) move(1); else updateCarousel();
      track.style.transition = '';
    };

    // Disable drag/scroll by pointer per request
    track.style.touchAction = 'none';
  }

  // Count-up metrics (quick stop)
  const counters = Array.from(document.querySelectorAll('.countup'));
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const isFloat = !Number.isInteger(target);
    const duration = 600; // ms
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const value = target * p;
      el.textContent = isFloat ? value.toFixed(1) : Math.round(value).toString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    counters.forEach((el) => io2.observe(el));
  } else {
    counters.forEach((el) => animateCounter(el));
  }

  // Simple tooltips via title attr provided in data-i18n-title
  document.querySelectorAll('.tip').forEach((btn) => {
    const key = btn.getAttribute('data-i18n-title');
    if (key) btn.setAttribute('title', translations.enTitle[key] || '');
  });

  // Products continuous scroll (two rows)
  function initProductsMarquee() {
    const rows = document.querySelectorAll('.products-row .products-track');
    rows.forEach((trackEl, idx) => {
      let offset = 0;
      let rafId;
      const speed = idx % 2 === 0 ? 0.4 : 0.25; // subtle difference per row
      const step = () => {
        offset -= speed;
        trackEl.style.transform = `translateX(${offset}px)`;
        const first = trackEl.children[0];
        if (first) {
          const w = first.getBoundingClientRect().width + parseFloat(getComputedStyle(trackEl).columnGap || getComputedStyle(trackEl).gap || '18');
          if (-offset > w) {
            trackEl.appendChild(first);
            offset += w;
          }
        }
        rafId = requestAnimationFrame(step);
      };
      const start = () => { if (!prefersReduced) rafId = requestAnimationFrame(step); };
      const stop = () => { if (rafId) cancelAnimationFrame(rafId); };
      start();
      trackEl.addEventListener('mouseenter', stop);
      trackEl.addEventListener('mouseleave', start);
    });
  }
  initProductsMarquee();

  // Brand marquee full width
  (function initBrandMarquee(){
    const track = document.querySelector('.brand-track');
    const viewport = document.querySelector('.brand-viewport');
    if (!track || !viewport) return;
    let offset = 0; let raf;
    const speed = 0.35;

    function ensureOverflow() {
      // Duplicate children until content exceeds viewport width sufficiently
      const base = Array.from(track.children);
      if (base.length === 0) return;
      const targetWidth = Math.max(viewport.clientWidth * 1.5, viewport.clientWidth + 200);
      while (track.scrollWidth < targetWidth) {
        for (let i = 0; i < base.length && track.scrollWidth < targetWidth; i++) {
          track.appendChild(base[i].cloneNode(true));
        }
      }
    }

    function step(){
      offset -= speed;
      track.style.transform = `translateX(${offset}px)`;
      const first = track.children[0];
      if (first) {
        const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24');
        const w = first.getBoundingClientRect().width + gap;
        if (-offset > w) { track.appendChild(first); offset += w; }
      }
      raf = requestAnimationFrame(step);
    }
    const start = () => { if (!prefersReduced) raf = requestAnimationFrame(step); };
    const stop = () => { if (raf) cancelAnimationFrame(raf); };

    ensureOverflow();
    start();
    window.addEventListener('resize', () => { stop(); offset = 0; track.style.transform = 'translateX(0)'; ensureOverflow(); start(); });
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
  })();

  // Language memory + i18n (minimal demo content)
  const langButtons = document.querySelectorAll('.lang-btn');
  const storedLang = localStorage.getItem('lang') || 'en';
  setLang(storedLang);
  langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.getAttribute('data-lang') || 'en')));

  function setLang(lang) {
    document.querySelectorAll('.lang-btn').forEach((btn) => btn.setAttribute('aria-pressed', String((btn.getAttribute('data-lang')||'') === lang)));
    localStorage.setItem('lang', lang);
    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const val = dict[key];
      if (val) el.textContent = val;
    });
    // titles for tooltips
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (!key) return;
      const val = (translations[`${lang}Title`]||{})[key];
      if (val) el.setAttribute('title', val);
    });
    // html lang attr
    document.documentElement.setAttribute('lang', lang === 'jp' ? 'ja' : (lang === 'zh' ? 'zh' : 'en'));
  }

  // Minimal translation strings (demo). Replace with your real localized copy.
  const translations = {
    en: {
      'nav.home': 'Home', 'nav.about': 'About Us', 'nav.services': 'Our Services', 'nav.brand': 'Brand', 'nav.products': 'Our Products', 'nav.achievements': 'Achievements', 'nav.contact': 'Contact',
      'hero.title': 'Reliable Cross-Border Logistics',
      'hero.lead': 'We move your goods between Malaysia, Singapore, and beyond with speed and care.',
      'hero.ctaServices': 'Our Services', 'hero.ctaContact': 'Contact',
      'services.title': 'Our Services', 'services.details': 'Details',
      'services.sea.title': 'Sea Freight', 'services.sea.value': 'Reliable schedules for regional and global routes.', 'services.sea.b1': 'FCL/LCL options', 'services.sea.b2': 'Door-to-door', 'services.sea.b3': 'Competitive lead times',
      'services.air.title': 'Air Freight', 'services.air.value': 'Express options for time-critical shipments.', 'services.air.b1': 'Consolidated rates', 'services.air.b2': 'Temperature control', 'services.air.b3': 'Proactive tracking',
      'services.customs.title': 'Customs & Compliance', 'services.customs.value': 'Fast, accurate declarations and permits.', 'services.customs.b1': 'HS classification', 'services.customs.b2': 'License handling', 'services.customs.b3': 'Audit-ready records',
      'services.warehousing.title': 'Warehousing', 'services.warehousing.value': 'Secure storage with inventory visibility.', 'services.warehousing.b1': 'FIFO/FEFO support', 'services.warehousing.b2': 'Value-added services', 'services.warehousing.b3': 'Cycle counts',
      'services.consolidation.title': 'Consolidation & Last‑Mile', 'services.consolidation.value': 'Smarter loads, efficient delivery to door.', 'services.consolidation.b1': 'Cross-dock flows', 'services.consolidation.b2': 'Route optimization', 'services.consolidation.b3': 'POD visibility',
      'services.trade.title': 'Trade Support', 'services.trade.value': 'Documentation and lane setup made simple.', 'services.trade.b1': 'FTA utilization', 'services.trade.b2': 'Supplier onboarding', 'services.trade.b3': 'Exception handling',
      'brand.title': 'Brand',
      'about.title': 'About Us', 'about.body': 'A&J is a cross‑border logistics partner focused on reliability and transparency. We operate seamlessly across MY and SG with strong carrier and customs relationships.', 'about.b1': 'Regional lane expertise', 'about.b2': 'Compliance-first operations', 'about.b3': 'Service SLAs you can trust',
      'location.title': 'Location', 'location.hours': 'Business hours', 'location.email': 'Email', 'location.phone': 'Phone',
      'location.my.title': 'Malaysia', 'location.my.addr': 'No. 123, Industrial Park, Johor Bahru',
      'location.sg.title': 'Singapore', 'location.sg.addr': '88 Logistics Ave, Jurong',
      'location.jp.title': 'Japan', 'location.jp.addr': 'Chiyoda City, Tokyo',
      'achievements.title': 'Achievements', 'achievements.onTime': 'On‑time delivery rate', 'achievements.lanes': 'Lanes/countries covered', 'achievements.clearance': 'Average clearance time', 'achievements.skus': 'Monthly handled SKUs/TEUs',
      'products.title': 'Our Products', 'products.p1': 'Premium Supplements', 'products.p2': 'Skincare Essentials', 'products.p3': 'Cosmetics', 'products.p4': 'Snacks & Beverages', 'products.shop': 'Shop on Lazada', 'products.shopNow': 'Shop Now'
    },
    enTitle: {
      'achievements.onTimeTip': 'On-time deliveries divided by total deliveries completed in the last quarter.',
      'achievements.lanesTip': 'Count of active lanes and countries served in the current month.',
      'achievements.clearanceTip': 'Average time from arrival to customs release, last quarter.',
      'achievements.skusTip': 'Total SKUs handled or TEUs processed per month.'
    },
    jp: {
      'nav.home': 'ホーム', 'nav.about': '会社情報', 'nav.services': 'サービス', 'nav.brand': 'ブランド', 'nav.products': '製品', 'nav.achievements': '実績', 'nav.contact': '連絡先',
      'hero.title': '信頼できる越境物流',
      'hero.lead': 'マレーシアとシンガポールを中心に、迅速かつ丁寧に輸送します。',
      'hero.ctaServices': 'サービス', 'hero.ctaContact': '連絡先',
      'services.title': 'サービス一覧', 'services.details': '詳細',
      'services.sea.title': '海上輸送', 'services.sea.value': '地域内外の安定したスケジュール。', 'services.sea.b1': 'FCL/LCL対応', 'services.sea.b2': 'ドア・ツー・ドア', 'services.sea.b3': '競争力のあるリードタイム',
      'services.air.title': '航空輸送', 'services.air.value': '時間厳守の案件に最適。', 'services.air.b1': '混載レート', 'services.air.b2': '温度管理', 'services.air.b3': '能動的な追跡',
      'services.customs.title': '通関・コンプライアンス', 'services.customs.value': '迅速で正確な申告と許可。', 'services.customs.b1': 'HSコード分類', 'services.customs.b2': '許認可対応', 'services.customs.b3': '監査対応の記録',
      'services.warehousing.title': '倉庫', 'services.warehousing.value': '可視化された安全な保管。', 'services.warehousing.b1': 'FIFO/FEFO対応', 'services.warehousing.b2': '付加価値業務', 'services.warehousing.b3': 'サイクルカウント',
      'services.consolidation.title': '集約・ラストワンマイル', 'services.consolidation.value': 'スマートな積載と効率的な配送。', 'services.consolidation.b1': 'クロスドック', 'services.consolidation.b2': 'ルート最適化', 'services.consolidation.b3': 'POD可視化',
      'services.trade.title': 'トレードサポート', 'services.trade.value': '書類・レーン構築を簡単に。', 'services.trade.b1': 'FTA活用', 'services.trade.b2': 'サプライヤー登録', 'services.trade.b3': '例外対応',
      'brand.title': 'ブランド',
      'about.title': '会社情報', 'about.body': 'A&Jは信頼性と透明性を重視した越境物流パートナーです。MYとSGをシームレスに運用し、キャリアや税関との強固な関係を有します。', 'about.b1': '地域レーンの専門性', 'about.b2': 'コンプライアンス第一の運用', 'about.b3': '信頼できるSLA',
      'location.title': '所在地', 'location.hours': '営業時間', 'location.email': 'メール', 'location.phone': '電話',
      'location.my.title': 'マレーシア', 'location.my.addr': 'ジョホールバル 工業団地 123番地',
      'location.sg.title': 'シンガポール', 'location.sg.addr': 'ジュロン ロジスティクス通り 88',
      'location.jp.title': '日本', 'location.jp.addr': '東京都 千代田区',
      'achievements.title': '実績', 'achievements.onTime': '定時納品率', 'achievements.lanes': '対応レーン/国数', 'achievements.clearance': '平均通関時間', 'achievements.skus': '月間取扱SKU/TEU',
      'products.title': '製品', 'products.p1': 'プレミアムサプリ', 'products.p2': 'スキンケア', 'products.p3': 'コスメ', 'products.p4': 'スナック・飲料', 'products.shop': 'Lazadaで購入', 'products.shopNow': '今すぐ購入'
    },
    jpTitle: {
      'achievements.onTimeTip': '直近四半期の納品完了件数に対する定時納品件数の割合。',
      'achievements.lanesTip': '当月に運用中のレーンおよび国の合計。',
      'achievements.clearanceTip': '到着から通関許可までの平均時間（直近四半期）。',
      'achievements.skusTip': '月間で取り扱ったSKUまたはTEUの合計。'
    },
    zh: {
      'nav.home': '首页', 'nav.about': '关于我们', 'nav.services': '服务', 'nav.brand': '品牌', 'nav.products': '产品', 'nav.achievements': '成绩', 'nav.contact': '联系',
      'hero.title': '可靠的跨境物流',
      'hero.lead': '高效安全，连接马来西亚、新加坡及更多地区。',
      'hero.ctaServices': '服务', 'hero.ctaContact': '联系',
      'services.title': '我们的服务', 'services.details': '详情',
      'services.sea.title': '海运', 'services.sea.value': '区域与全球航线，时效稳定。', 'services.sea.b1': '整箱/拼箱', 'services.sea.b2': '门到门', 'services.sea.b3': '具竞争力的时效',
      'services.air.title': '空运', 'services.air.value': '时效敏感货物的优选。', 'services.air.b1': '合并价', 'services.air.b2': '温控', 'services.air.b3': '主动跟踪',
      'services.customs.title': '清关与合规', 'services.customs.value': '快速准确的申报与许可。', 'services.customs.b1': '税则归类', 'services.customs.b2': '证照办理', 'services.customs.b3': '可审计记录',
      'services.warehousing.title': '仓储', 'services.warehousing.value': '安全存储与库存可视化。', 'services.warehousing.b1': '先进先出', 'services.warehousing.b2': '增值服务', 'services.warehousing.b3': '循环盘点',
      'services.consolidation.title': '集运与末端配送', 'services.consolidation.value': '更聪明的装载，高效到门。', 'services.consolidation.b1': '越库作业', 'services.consolidation.b2': '路线优化', 'services.consolidation.b3': '签收可视化',
      'services.trade.title': '贸易支持', 'services.trade.value': '文档与航线搭建更简单。', 'services.trade.b1': 'FTA利用', 'services.trade.b2': '供应商入驻', 'services.trade.b3': '异常处理',
      'brand.title': '品牌',
      'about.title': '关于我们', 'about.body': 'A&J 专注于可靠与透明的跨境物流。在马来西亚与新加坡之间无缝运作，并与承运人和海关保持良好合作。', 'about.b1': '区域航线经验', 'about.b2': '合规优先的操作', 'about.b3': '可信赖的SLA',
      'location.title': '地址', 'location.hours': '营业时间', 'location.email': '邮箱', 'location.phone': '电话',
      'location.my.title': '马来西亚', 'location.my.addr': '新山 工业园 123号',
      'location.sg.title': '新加坡', 'location.sg.addr': '裕廊 物流大道 88号',
      'location.jp.title': '日本', 'location.jp.addr': '东京都 千代田区',
      'achievements.title': '成绩', 'achievements.onTime': '准时交付率', 'achievements.lanes': '覆盖的航线/国家', 'achievements.clearance': '平均清关时间', 'achievements.skus': '月度SKU/TEU处理量',
      'products.title': '我们的产品', 'products.p1': '高端保健品', 'products.p2': '护肤品', 'products.p3': '彩妆', 'products.p4': '零食饮料', 'products.shop': '前往 Lazada', 'products.shopNow': '立即购买'
    },
    zhTitle: {
      'achievements.onTimeTip': '上季度按时交付次数与完成交付总次数之比。',
      'achievements.lanesTip': '当月服务中的航线与国家数量。',
      'achievements.clearanceTip': '从到港到通关放行的平均时间（上季度）。',
      'achievements.skusTip': '每月处理的SKU或TEU总量。'
    }
  };
})();


