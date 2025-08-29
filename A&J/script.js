(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Translations (moved to top to avoid TDZ when used below)
  const translations = {
    en: {
	      'nav.home': 'Home', 'nav.about': 'About Us', 'nav.services': 'Our Services', 'nav.brand': 'Brand', 'nav.products': 'Our Products', 'nav.news': 'News', 'nav.achievements': 'Achievements', 'nav.contact': 'Contact',
      'hero.title': 'Reliable Cross-Border Logistics',
      'hero.lead': 'We move your goods between Malaysia, Singapore, and beyond with speed and care.',
      'hero.ctaServices': 'Our Services', 'hero.ctaContact': 'Contact',
      'services.title': 'Our Services', 'services.details': 'Details',
      'services.logistics.title': 'Logistics Business', 'services.logistics.summary': 'One-stop food import/export, delivery and wholesale services from Japan to Singapore with cold chain logistics.', 'services.logistics.body': 'We provide comprehensive food import/export, delivery and wholesale services from Japan to Singapore. Our Japanese food products range from processed foods to rice and meat, maintaining quality regardless of temperature until delivery to stores. We currently have storage space for over 2000 pallets in our cold storage facilities, and by utilizing our own refrigerated trucks, we have established a cold chain that enables consistent low-temperature delivery from Japan to local destinations. In addition to regular shipping by container ships, we can also arrange transportation by air freight and other methods according to your needs.', 'services.logistics.features.title': 'Key Features', 'services.logistics.features.f1': '2000+ pallet cold storage capacity', 'services.logistics.features.f2': 'Own fleet of refrigerated trucks', 'services.logistics.features.f3': 'End-to-end cold chain logistics', 'services.logistics.features.f4': 'Sea and air freight options',
      'services.events.title': 'Event Support Business', 'services.events.summary': 'Support for Japanese food event exhibitions at local department stores with end-to-end logistics.', 'services.events.body': 'In addition to our logistics business, we also support Japanese food event exhibitions at local department stores. We provide one-stop support from export operations including customs clearance from Japan to local destinations, delivery to stores while maintaining quality, and post-event support. Furthermore, by working closely with our subsidiary A&J Malaysia, which is based in Malaysia, we are expanding our services widely throughout Asia, not just Singapore.', 'services.events.features.title': 'Event Services', 'services.events.features.f1': 'Export operations and customs clearance', 'services.events.features.f2': 'Quality-maintained delivery to venues', 'services.events.features.f3': 'Post-event logistics support', 'services.events.features.f4': 'Pan-Asian expansion through A&J Malaysia',
      'services.investment.title': 'Investment Business', 'services.investment.summary': 'Strategic investments in Asian food and beverage businesses to expand Japanese food accessibility.', 'services.investment.body': 'A&J HAKKO invests in Asian food and beverage businesses in Singapore, Thailand, and China to provide opportunities for people to enjoy Japanese food locally. We will continue to leverage our logistics expertise to support businesses in various ways so that people overseas can become familiar with Japanese food products.', 'services.investment.features.title': 'Investment Focus', 'services.investment.features.f1': 'Strategic investments in F&B businesses', 'services.investment.features.f2': 'Focus on Singapore, Thailand, and China', 'services.investment.features.f3': 'Leveraging logistics expertise', 'services.investment.features.f4': 'Expanding Japanese food accessibility',
      'brand.title': 'Our Customers',
      'about.subtitle': 'Bringing Asia Closer Together', 'about.body': 'A&J HAKKO delivers Japan’s finest foods across Asia, powered by Hakko Transport’s 70+ years of reliability. Our logistics protect freshness end-to-end and adapt to each market, so authentic Japanese flavors arrive exactly as intended.', 'about.learnMore': 'Learn More About Us',
      'company.title': 'Company Information', 'company.intro': 'A&J HAKKO is dedicated to delivering the finest Japanese food products not only domestically but throughout Asia. Rooted in Hakko Transport Co., Ltd., a company with over 70 years of history since its founding, we have cultivated logistics expertise that preserves food quality while delivering products intact across Asia.', 'company.history.title': 'Our Heritage', 'company.history.body': 'Founded on the strong foundation of Hakko Transport Co., Ltd., which has been operating for over 70 years, A&J HAKKO brings decades of logistics expertise to the Asian market. We have developed specialized knowledge in food transportation, ensuring that products maintain their quality and freshness throughout the supply chain.', 'company.stat1': 'Years of Experience', 'company.stat2': 'Pallet Capacity', 'company.stat3': 'Countries', 'company.stat4': 'Cold Chain',
      'location.title': 'Location', 'location.hours': 'Business hours', 'location.email': 'Email', 'location.phone': 'Phone',
      'location.my.title': 'Malaysia', 'location.my.addr': 'No. 33-5, 5th Floor, The Boulevard Office, Mid Valley City, Lingkaran Syed Putra, 59200, Kuala Lumpur, Malaysia',
      'location.sg.title': 'Singapore', 'location.sg.addr': '1 Buroh Lane, #2M-04, Singapore 618292',
      'location.jp.title': 'Japan', 'location.jp.addr': '〒8830-0062 Miyazaki Prefecture, Hyuga City, Oaza Nichiya 16392',
      'achievements.title': 'Achievements', 'achievements.onTime': 'On‑time delivery rate', 'achievements.lanes': 'Lanes/countries covered', 'achievements.clearance': 'Average clearance time', 'achievements.skus': 'Monthly handled SKUs/TEUs',
      'products.title': 'Our Products', 'products.p1': 'Premium Supplements', 'products.p2': 'Skincare Essentials', 'products.p3': 'Cosmetics', 'products.p4': 'Snacks & Beverages', 'products.shop': 'Shop on Lazada', 'products.shopNow': 'Shop Now', 'products.viewAll': 'View all',
	      'news.title': 'Latest News', 'news.viewAll': 'View all news'
    },
    enTitle: {
      'achievements.onTimeTip': 'On-time deliveries divided by total deliveries completed in the last quarter.',
      'achievements.lanesTip': 'Count of active lanes and countries served in the current month.',
      'achievements.clearanceTip': 'Average time from arrival to customs release, last quarter.',
      'achievements.skusTip': 'Total SKUs handled or TEUs processed per month.'
    },
	    jp: {
	      'nav.home': 'ホーム', 'nav.about': '会社情報', 'nav.services': 'サービス', 'nav.brand': 'ブランド', 'nav.products': '製品', 'nav.news': 'ニュース', 'nav.achievements': '実績', 'nav.contact': '連絡先',
      'hero.title': '信頼できる越境物流',
      'hero.lead': 'マレーシアとシンガポールを中心に、迅速かつ丁寧に輸送します。',
      'hero.ctaServices': 'サービス', 'hero.ctaContact': '連絡先',
      'services.title': 'サービス一覧', 'services.details': '詳細',
      'services.logistics.title': '物流事業', 'services.logistics.summary': '日本からシンガポールへの食品輸出入、配送および卸売販売をコールドチェーンでワンストップ提供。', 'services.logistics.body': '日本からシンガポールへの食品輸出入、配送および卸売販売をワンストップで行っています。扱う日本食品は加工品や米、肉など多岐に渡り、温度に関わらず品質を保ったまま店舗までお届けします。現在、冷凍倉庫には2000パレットを超える保管スペースを確保しており、自社冷凍トラックを活用することで、日本から現地目的地までの配送を低温で一貫して行えるコールドチェーンを確立しています。', 'services.logistics.features.title': '主な特徴', 'services.logistics.features.f1': '2000パレット以上の冷蔵倉庫容量', 'services.logistics.features.f2': '自社冷凍トラック保有', 'services.logistics.features.f3': 'エンドツーエンドコールドチェーン物流', 'services.logistics.features.f4': '海上・航空輸送オプション',
      'services.events.title': '催事支援事業', 'services.events.summary': '現地百貨店での日本食品催事出展をエンドツーエンドでサポート。', 'services.events.body': '物流事業に加え、現地の百貨店における日本食品の催事出展もサポートしています。日本から現地への通関を含む輸出業務、品質を保ったままで店舗へ配送、さらにイベント後のサポートまでワンストップで対応しています。', 'services.events.features.title': 'イベントサービス', 'services.events.features.f1': '輸出業務・通関手続き', 'services.events.features.f2': '品質保持した会場への配送', 'services.events.features.f3': 'イベント後の物流サポート', 'services.events.features.f4': 'A&J Malaysiaとの連携によるアジア展開',
      'services.investment.title': '出資事業', 'services.investment.summary': '日本食のアクセシビリティ拡大のためのアジア飲食事業への戦略的投資。', 'services.investment.body': 'A&J HAKKOは、現地で日本食を楽しめる機会を提供するため、シンガポールやタイ、中国でのアジア飲食関連事業への出資を行っています。今後も当社の物流ノウハウを活かし、海外でも日本の食品に親しんでいただけるよう、多角的に事業を支援していきます。', 'services.investment.features.title': '投資フォーカス', 'services.investment.features.f1': '飲食事業への戦略的投資', 'services.investment.features.f2': 'シンガポール、タイ、中国に焦点', 'services.investment.features.f3': '物流専門知識の活用', 'services.investment.features.f4': '日本食アクセシビリティの拡大',
      'brand.title': 'お客様',
      'about.subtitle': 'アジアを身近に', 'about.body': 'A&J HAKKOは、創業70年以上の八興運輸を基盤に、日本の上質な食品をアジア各地へ届けます。各国の物流慣習に柔軟に対応し、鮮度と品質を守って、本来の味わいのままお届けします。', 'about.learnMore': '会社情報を見る',
      'location.title': '所在地', 'location.hours': '営業時間', 'location.email': 'メール', 'location.phone': '電話',
      'location.my.title': 'マレーシア', 'location.my.addr': 'No. 33-5, 5th Floor, The Boulevard Office, Mid Valley City, Lingkaran Syed Putra, 59200, Kuala Lumpur, Malaysia',
      'location.sg.title': 'シンガポール', 'location.sg.addr': '1 Buroh Lane, #2M-04, Singapore 618292',
      'location.jp.title': '日本', 'location.jp.addr': '〒8830-0062宮崎県日向市大字日知屋16392番地',
      'achievements.title': '実績', 'achievements.onTime': '定時納品率', 'achievements.lanes': '対応レーン/国数', 'achievements.clearance': '平均通関時間', 'achievements.skus': '月間取扱SKU/TEU',
      'products.title': '製品', 'products.p1': 'プレミアムサプリ', 'products.p2': 'スキンケア', 'products.p3': 'コスメ', 'products.p4': 'スナック・飲料', 'products.shop': 'Lazadaで購入', 'products.shopNow': '今すぐ購入', 'products.viewAll': 'すべて見る',
	      'news.title': '最新ニュース', 'news.viewAll': 'ニュース一覧へ'
    },
    jpTitle: {
      'achievements.onTimeTip': '直近四半期の納品完了件数に対する定時納品件数の割合。',
      'achievements.lanesTip': '当月に運用中のレーンおよび国の合計。',
      'achievements.clearanceTip': '到着から通関許可までの平均時間（直近四半期）。',
      'achievements.skusTip': '月間で取り扱ったSKUまたはTEUの合計。'
    },
	    zh: {
	      'nav.home': '首页', 'nav.about': '关于我们', 'nav.services': '服务', 'nav.brand': '品牌', 'nav.products': '产品', 'nav.news': '新闻', 'nav.achievements': '成绩', 'nav.contact': '联系',
      'hero.title': '可靠的跨境物流',
      'hero.lead': '高效安全，连接马来西亚、新加坡及更多地区。',
      'hero.ctaServices': '服务', 'hero.ctaContact': '联系',
      'services.title': '我们的服务', 'services.details': '详情',
      'services.logistics.title': '物流业务', 'services.logistics.summary': '从日本到新加坡的食品进出口、配送和批发销售一站式冷链服务。', 'services.logistics.body': '我们提供从日本到新加坡的食品进出口、配送和批发销售一站式服务。我们的日本食品涵盖加工食品、大米和肉类等多种类别，无论温度如何都能保持品质直到店铺。目前，我们的冷库设施拥有超过2000个托盘的存储空间，通过使用自有的冷藏车队，我们建立了从日本到当地目的地的一致低温配送冷链。', 'services.logistics.features.title': '主要特点', 'services.logistics.features.f1': '2000+托盘冷库容量', 'services.logistics.features.f2': '自有冷藏车队', 'services.logistics.features.f3': '端到端冷链物流', 'services.logistics.features.f4': '海运和空运选择',
      'services.events.title': '活动支持业务', 'services.events.summary': '为当地百货商店日本食品活动展览提供端到端物流支持。', 'services.events.body': '除了物流业务外，我们还支持在当地百货商店举办的日本食品活动展览。我们提供一站式支持，包括从日本到当地的出口业务（包括清关）、保持品质的店铺配送以及活动后支持。', 'services.events.features.title': '活动服务', 'services.events.features.f1': '出口业务和清关', 'services.events.features.f2': '保质配送到场地', 'services.events.features.f3': '活动后物流支持', 'services.events.features.f4': '通过A&J马来西亚实现泛亚洲扩展',
      'services.investment.title': '投资业务', 'services.investment.summary': '对亚洲餐饮业务进行战略投资，扩大日本食品的可及性。', 'services.investment.body': 'A&J HAKKO在新加坡、泰国和中国投资亚洲餐饮业务，为人们提供在当地享受日本食品的机会。我们将继续利用我们的物流专业知识，以多种方式支持企业，让海外人士熟悉日本食品。', 'services.investment.features.title': '投资重点', 'services.investment.features.f1': '对餐饮业务的战略投资', 'services.investment.features.f2': '专注于新加坡、泰国和中国', 'services.investment.features.f3': '利用物流专业知识', 'services.investment.features.f4': '扩大日本食品可及性',
      'brand.title': '我们的客户',
      'about.subtitle': '连接亚洲，走向世界', 'about.body': 'A&J HAKKO 依托 八兴运输 超过 70 年的实力，将日本优质食品送达全亚洲。我们以专业物流全程守护新鲜，灵活适配各国流程，让地道日本风味完好如初地抵达。', 'about.learnMore': '了解更多',
      'location.title': '地址', 'location.hours': '营业时间', 'location.email': '邮箱', 'location.phone': '电话',
      'location.my.title': '马来西亚', 'location.my.addr': 'No. 33-5, 5th Floor, The Boulevard Office, Mid Valley City, Lingkaran Syed Putra, 59200, Kuala Lumpur, Malaysia',
      'location.sg.title': '新加坡', 'location.sg.addr': '1 Buroh Lane, #2M-04, Singapore 618292',
      'location.jp.title': '日本', 'location.jp.addr': '〒8830-0062 宫崎県日向市大字日知屋16392番地',
      'achievements.title': '成绩', 'achievements.onTime': '准时交付率', 'achievements.lanes': '覆盖的航线/国家', 'achievements.clearance': '平均清关时间', 'achievements.skus': '月度SKU/TEU处理量',
      'products.title': '我们的产品', 'products.p1': '高端保健品', 'products.p2': '护肤品', 'products.p3': '彩妆', 'products.p4': '零食饮料', 'products.shop': '前往 Lazada', 'products.shopNow': '立即购买', 'products.viewAll': '查看全部',
	      'news.title': '最新资讯', 'news.viewAll': '查看全部'
    },
    zhTitle: {
      'achievements.onTimeTip': '上季度按时交付次数与完成交付总次数之比。',
      'achievements.lanesTip': '当月服务中的航线与国家数量。',
      'achievements.clearanceTip': '从到港到通关放行的平均时间（上季度）。',
      'achievements.skusTip': '每月处理的SKU或TEU总量。'
    }
  };

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  const navClose = document.querySelector('.nav-close');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
      document.body.classList.toggle('menu-open', !expanded);
    });
    if (navClose) {
      navClose.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navList.classList.remove('show');
        document.body.classList.remove('menu-open');
      });
    }
    // Close menu when a nav link is clicked
    navList.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      navToggle.setAttribute('aria-expanded', 'false');
      navList.classList.remove('show');
      document.body.classList.remove('menu-open');
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

  // Header background change on scroll
  const headerEl = document.querySelector('.site-header');
  let ticking = false;
  function onScroll() {
    const heroHeight = window.innerHeight;
    const currentY = window.scrollY;
    if (headerEl) {
      if (currentY > heroHeight * 0.8) {
        headerEl.classList.add('solid');
      } else {
        headerEl.classList.remove('solid');
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Services carousel
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const progressBar = document.querySelector('.slider-progress .bar');
  let index = 0;

  function updateCarousel() {
    if (!track) return;
    const slides = Array.from(track.children);
    const maxIndex = Math.max(0, slides.length - 1);
    index = Math.max(0, Math.min(index, maxIndex));
    if (progressBar) progressBar.style.width = `${((index) / (maxIndex || 1)) * 100}%`;
    
    // On mobile, show one card at a time
    if (window.innerWidth <= 1024) {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.style.display = 'grid';
          slide.style.opacity = '0';
          slide.style.transform = 'translateY(20px)';
          setTimeout(() => {
            slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            slide.style.opacity = '1';
            slide.style.transform = 'translateY(0)';
          }, 50);
        } else {
          slide.style.display = 'none';
          slide.style.transition = 'none';
        }
      });
    } else {
      // On desktop, show all cards
      slides.forEach((slide) => {
        slide.style.display = 'grid';
        slide.style.opacity = '1';
        slide.style.transform = 'translateY(0)';
      });
    }
  }

  function move(delta) {
    if (!track || window.innerWidth > 1024) return;
    const slides = Array.from(track.children);
    const maxIndex = Math.max(0, slides.length - 1);
    index += delta;
    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => move(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => move(1));
  
  let servicesTimer = null;
  function startServicesAuto() {
    if (window.innerWidth > 1024) return;
    stopServicesAuto();
    servicesTimer = setInterval(() => move(1), 4000);
  }
  function stopServicesAuto() { if (servicesTimer) { clearInterval(servicesTimer); servicesTimer = null; } }
  
  if (track) {
    track.addEventListener('mouseenter', stopServicesAuto);
    track.addEventListener('mouseleave', startServicesAuto);
    updateCarousel();
    startServicesAuto();
  }
  
  window.addEventListener('resize', () => {
    updateCarousel();
    if (window.innerWidth <= 1024) {
      startServicesAuto();
    } else {
      stopServicesAuto();
    }
  });

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

  // Products slider: show/hide controls based on content
  (function initProductsSlider(){
    const viewport = document.querySelector('.products-viewport');
    const rows = Array.from(document.querySelectorAll('.products-row .products-track'));
    const prevBtn = document.querySelector('.products-btn.prev');
    const nextBtn = document.querySelector('.products-btn.next');
    if (!rows.length || !viewport) return;
    
    let currentSlide = 0;
    let totalSlides = 0;
    let animating = false;

    function updateSlider() {
      const totalProducts = rows.reduce((sum, row) => sum + row.children.length, 0);
      totalSlides = Math.ceil(totalProducts / 8); // 8 products per slide (4x2)
      
      // Show/hide controls based on whether sliding is needed
      const needsSliding = totalSlides > 1;
      if (prevBtn) prevBtn.style.display = needsSliding ? 'grid' : 'none';
      if (nextBtn) nextBtn.style.display = needsSliding ? 'grid' : 'none';
    }

    function step(dir) {
      if (animating || totalSlides <= 1) return;
      animating = true;
      
      currentSlide += dir;
      if (currentSlide >= totalSlides) currentSlide = 0;
      if (currentSlide < 0) currentSlide = totalSlides - 1;
      
      rows.forEach((row) => {
        const slideWidth = row.getBoundingClientRect().width;
        row.style.transition = 'transform 320ms ease-out';
        row.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      });
      
      setTimeout(() => { animating = false; }, 340);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => step(1));
    
    // Auto-slide if multiple slides
    let timer = null;
    function startAuto() {
      if (totalSlides > 1) {
        timer = setInterval(() => step(1), 3500);
      }
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    
    if (viewport) {
      viewport.addEventListener('mouseenter', stopAuto);
      viewport.addEventListener('mouseleave', startAuto);
    }
    
    updateSlider();
    startAuto();
    window.addEventListener('resize', updateSlider);
  })();

  // Brand marquee infinite scroll
  (function initBrandMarquee(){
    const track = document.querySelector('.brand-track');
    const viewport = document.querySelector('.brand-viewport');
    if (!track || !viewport) return;
    let offset = 0; let raf;
    const speed = 0.5;

    function duplicateContent() {
      const original = Array.from(track.children);
      if (original.length === 0) return;
      // Clone all items to create seamless loop
      original.forEach(item => {
        track.appendChild(item.cloneNode(true));
      });
    }

    function step(){
      offset -= speed;
      track.style.transform = `translateX(${offset}px)`;
      
      // Reset when we've scrolled past half the content
      const totalWidth = track.scrollWidth / 2; // Half because we duplicated
      if (-offset >= totalWidth) {
        offset = 0;
      }
      raf = requestAnimationFrame(step);
    }
    
    const start = () => { if (!prefersReduced) raf = requestAnimationFrame(step); };
    const stop = () => { if (raf) cancelAnimationFrame(raf); };

    duplicateContent();
    start();
    window.addEventListener('resize', () => { stop(); offset = 0; track.style.transform = 'translateX(0)'; start(); });
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
  })();

  // Language memory + i18n (minimal demo content)
  const langButtons = document.querySelectorAll('.lang-btn');
  const storedLang = localStorage.getItem('lang') || 'en';
  // Delay initial setLang until DOM is ready to avoid missing nodes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setLang(storedLang), { once: true });
  } else {
    setLang(storedLang);
  }
  langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.getAttribute('data-lang') || 'en')));

  function setLang(lang) {
    document.querySelectorAll('.lang-btn').forEach((btn) => btn.setAttribute('aria-pressed', String((btn.getAttribute('data-lang')||'') === lang)));
    localStorage.setItem('lang', lang);
    const dict = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const val = dict[key];
      if (val) {
        if (key === 'about.body') {
          el.innerHTML = val;
        } else if (key === 'location.jp.title' || key === 'location.my.title') {
          const link = el.querySelector('a');
          if (link) link.textContent = val;
        } else {
          el.textContent = val;
        }
      }
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

  // translations defined at top of file
})();


