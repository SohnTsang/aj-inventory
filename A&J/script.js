(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Bandwidth monitoring
  let totalBandwidth = 0;
  const startTime = performance.now();
  
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function logBandwidth() {
    if (!performance.getEntriesByType) return;
    
    const resources = performance.getEntriesByType('resource');
    let pageTotal = 0;
    
    console.group('🌐 Bandwidth Usage - ' + window.location.pathname);
    
    resources.forEach(resource => {
      if (resource.transferSize > 0) {
        pageTotal += resource.transferSize;
        if (resource.transferSize > 10000) { // Log files > 10KB
          console.log(`📦 ${resource.name.split('/').pop()} - ${formatBytes(resource.transferSize)}`);
        }
      }
    });
    
    totalBandwidth += pageTotal;
    console.log(`📊 This page: ${formatBytes(pageTotal)}`);
    console.log(`📈 Session total: ${formatBytes(totalBandwidth)}`);
    console.log(`⏱️ Load time: ${((performance.now() - startTime) / 1000).toFixed(2)}s`);
    console.groupEnd();
  }
  
  // Log bandwidth on page load
  window.addEventListener('load', () => setTimeout(logBandwidth, 1000));
  
  // Log bandwidth on navigation
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(logBandwidth, 1000);
    }
  }).observe(document, { subtree: true, childList: true });

  // Translations (moved to top to avoid TDZ when used below)
  const translations = window.translations = {
    en: {
	      'nav.home': 'Home', 'nav.about': 'About Us', 'nav.services': 'Our Services', 'nav.brand': 'Brand', 'nav.products': 'Our Products', 'nav.news': 'News', 'nav.achievements': 'Achievements', 'nav.contact': 'Contact',
      'hero.title': 'A&J HAKKO SINGAPORE',
      'hero.lead': 'Seamless cargo solutions across Asian waters, delivered with precision and trust since 1954.',
      'hero.ctaServices': 'Our Services', 'hero.ctaContact': 'Contact',
      'services.title': 'Our Services', 'services.subtitle': 'Comprehensive logistics solutions designed to connect Asia and deliver excellence across every touchpoint', 'services.details': 'Details',
      'services.hero.tag': 'Our Services', 'services.hero.title': 'Our Services',
      'services.logistics.nav': 'Logistics', 'services.retail.nav': 'Retail', 'services.events.nav': 'Events', 'services.investment.nav': 'Investment',
      'services.logistics.title': 'Logistics Services', 'services.logistics.summary': 'We provide end-to-end logistics solutions for the import, export, and distribution of food products between Japan and Singapore.', 'services.logistics.description': 'We provide end-to-end logistics solutions for the import, export, and distribution of food products between Japan and Singapore. Our handling range covers everything from processed foods and rice to meat products, ensuring that all items are delivered under optimal temperature conditions — ambient, chilled, or frozen — without compromising quality. With a total warehouse capacity exceeding 60,000 pallets, and a fleet of company-owned refrigerated trucks, we have established a seamless cold chain from Japan to the final destination. In addition to regular sea freight, we also arrange air shipments and customized logistics solutions based on clients\' needs.',
      'services.events.title': 'Event & Exhibition Support', 'services.events.summary': 'We provide comprehensive event support services for Japanese food fairs and pop-up promotions held at major department stores across Singapore.', 'services.events.description': 'We provide comprehensive event support services for Japanese food fairs and pop-up promotions held at major department stores across Singapore. From export documentation and customs clearance to temperature-controlled delivery and post-event handling, our services cover every step. Working closely with our Malaysian subsidiary, A&J Malaysia, we aim to expand these capabilities across Asia and deliver greater value to both Japanese suppliers and local partners.',
      'services.investment.title': 'Investment & Partnership', 'services.investment.summary': 'To promote Japanese food culture across Asia, A&J HAKKO also invests in food-related ventures in Singapore, Thailand, and China.', 'services.investment.description': 'To promote Japanese food culture across Asia, A&J HAKKO also invests in food-related ventures in Singapore, Thailand, and China. By combining our logistics expertise with local market insights, we continue to create opportunities for people throughout Asia to experience and enjoy the rich flavors of Japan.',
      'services.retail.title': 'Retail Support', 'services.retail.summary': 'Beyond logistics, we actively support sales and marketing of food products in Singapore.', 'services.retail.description': 'Beyond logistics, we actively support sales and marketing of food products in Singapore. By leveraging our strong local retail network — including department stores, supermarkets, and online platforms — we help Japanese brands effectively reach consumers. Our team also conducts in-store promotions, tasting events, and feedback sessions, allowing us to incorporate real consumer insights into our sales strategies and strengthen brand presence in the market.',
      'brand.title': 'Our Brand',
      'about.subtitle': 'BRINGING ASIA CLOSER TOGETHER', 'about.body': 'A&J HAKKO PTE LTD is dedicated to delivering the authentic taste and quality of Japanese food — not only within Japan but throughout Asia.<br> Rooted in the long-established Hakko Unyu Co., Ltd., a logistics company with over 70 years of history, we have developed the expertise to transport Japanese food products overseas while maintaining their freshness and quality.<br> By leveraging our logistics know-how and adapting to diverse local practices, we support the smooth and reliable distribution of Japanese food across Asia.', 'about.learnMore': 'Learn More',
      'company.title': 'Company Information', 'company.intro': 'A&J HAKKO is dedicated to delivering the finest Japanese food products not only domestically but throughout Asia. Rooted in HAKKO UNYU CO., LTD., a company with over 70 years of history since its founding, we have cultivated logistics expertise that preserves food quality while delivering products intact across Asia.', 'company.stat1': 'Import Experience', 'company.stat2': 'Containers Handled', 'company.stat3': 'Monthly Boxes', 'company.stat4': 'Japanese Partners',
      'company.overview.title': 'Company Overview',
      'company.table.name': 'Company Name', 'company.table.registration': 'Registration Number', 'company.table.ceo': 'Representative', 'company.table.ceo.name': 'Mr. Shuhei Miwa, Managing Director', 'company.table.address': 'Address', 'company.table.phone': 'Phone', 'company.table.fax': 'FAX',
      'company.licenses.title': 'Licenses & Permits', 'company.licenses.food': 'Food Import Registration', 'company.licenses.food.desc': 'Registration to Import Processed Food Products and Food Appliances', 'company.licenses.meat': 'Meat & Fish License', 'company.licenses.meat.desc': 'Licence for Import/Export/Transhipment of Meat and Fish Products', 'company.licenses.produce': 'Fresh Produce License', 'company.licenses.produce.desc': 'Licence for Import/Transhipment of Fresh Fruits and Vegetables', 'company.licenses.liquor': 'Liquor License', 'company.licenses.liquor.desc': 'Liquor Licence (Class 1A, 1B, 2A, 2B, 3A, 3B, 4)', 'company.licenses.rice': 'Rice License', 'company.licenses.rice.desc': 'Rice Import & Distribution License', 'company.licenses.factory': 'Factory Registration', 'company.licenses.factory.desc': 'Factory Notification and Registration',
      'company.products.title': 'Products We Handle', 'company.products.food.title': 'Food Products', 'company.products.food.desc': 'Processed foods, seafood, seaweed, seasonings, ice cream, alcoholic beverages, rice, beef, mineral water, and fresh produce.', 'company.products.home.title': 'Home Goods', 'company.products.home.desc': 'Bedding and related items.', 'company.products.cosmetics.title': 'Cosmetics', 'company.products.cosmetics.desc': 'Beauty and personal care products.', 'company.products.general.title': 'General Merchandise', 'company.products.general.desc': 'Various other goods and products.',
      'company.history.title': 'Company History', 'company.history.2011': 'Established A&J HAKKO PTE. LTD. in Singapore as a wholly owned subsidiary of HAKKO UNYU CO., LTD (Japan).', 'company.history.2012': 'Opened the "$2 Shop NANAIRO" (the store has since closed) in Tampines and launched food and household goods import business for the Singapore market.', 'company.history.2013a': 'Began logistics coordination services for Japanese department store fairs.', 'company.history.2013b': 'Started importing and distributing Hokkaido Crossbred Beef in Singapore.', 'company.history.2015': 'Started a logistics business focused on frozen goods, including storage and delivery.', 'company.history.2016': 'Relocated office and warehouse to support business growth.', 'company.history.2017a': 'Established a joint venture in Thailand — JST Foods Co., Ltd. — with local partners from Thailand and Singapore.', 'company.history.2017b': 'Opened a Châteraisé franchise store in Ekkamai, Bangkok.', 'company.history.2018': 'Opened a second Châteraisé franchise store in Bangsue, Bangkok.', 'company.history.2019a': 'Formed a joint venture in China — CJS Holdings Pte., Ltd. — with partners from China and Singapore.', 'company.history.2019b': 'Commenced import and export customs clearance operations.', 'company.history.2019c': 'Established A&J HAKKO (M) SDN. BHD. in Malaysia as a wholly owned subsidiary.', 'company.history.2022a': 'Expanded cold storage capacity to 3,000 pallets to accommodate growing volume of frozen cargo.', 'company.history.2022b': 'Launched online retail operations through Lazada Singapore.', 'company.history.2023': 'Started consignment sales at Isetan Singapore.', 'company.history.2025': 'Relocated to the current office and warehouse facility to further enhance logistics operations.',
      'company.hero.tag': 'About Us', 'company.hero.title': 'Bringing Asia Closer Together',
      'company.hero.badge': 'Since 1954', 'company.hero.title1': 'Bringing Asia', 'company.hero.title2': 'Closer Together', 'company.hero.description': 'With over 70 years of heritage from HAKKO UNYU CO., LTD., we\'ve mastered the art of preserving quality while delivering authentic Japanese products across Asia.', 'company.stats.import': 'Years Import Experience', 'company.stats.containers': 'Containers Handled', 'company.stats.monthly': 'Monthly Box Volume', 'company.stats.partners': 'Japanese Partners', 'company.overview.label': 'Company Information', 'company.overview.title': 'Corporate Overview', 'company.licenses.label': 'Compliance', 'company.licenses.title': 'Licenses & Certifications', 'company.history.label': 'Our Journey', 'company.history.title': 'Milestones of Growth', 'company.group.label': 'Network', 'company.group.title': 'Group Companies', 'company.group.subtitle': 'A powerful network of specialized companies delivering excellence across Asia', 'company.group.japan': 'Japan', 'company.group.malaysia': 'Malaysia', 'company.group.hakko.desc': 'Transportation, port handling, customs clearance', 'company.group.auto.desc': 'Automotive maintenance, private vehicle inspection', 'company.group.travel.desc': 'Travel agency services', 'company.group.bayfront.desc': 'Tugboat services, port services', 'company.group.vanliner.desc': 'Container transportation services', 'company.group.hutec.desc': 'Temporary staffing services', 'company.group.insurance.desc': 'Insurance services', 'company.group.shoji.desc': 'Export business', 'company.group.malaysia.desc': 'Import business',
      'location.title': 'Location', 'location.subtitle': 'Strategically positioned across Asia-Pacific for seamless logistics coverage', 'location.hours': 'Business hours', 'location.email': 'Email', 'location.phone': 'Phone', 'location.directions': 'Get Directions',
      'location.my.title': 'Malaysia', 'location.my.addr': 'No. 33-5, 5th Floor, The Boulevard Office, Mid Valley City, Lingkaran Syed Putra, 59200, Kuala Lumpur, Malaysia',
      'location.sg.title': 'Singapore', 'location.sg.addr': '1 Buroh Lane, #2M-04, Singapore 618292',
      'location.jp.title': 'Japan', 'location.jp.addr': '〒8830-0062 Miyazaki Prefecture, Hyuga City, Oaza Nichiya 16392',
      'achievements.title': 'Achievements', 'achievements.subtitle': 'Delivering excellence across Asia-Pacific with proven results', 'achievements.import': 'Years of import experience', 'achievements.containers': 'Containers handled', 'achievements.monthly': 'Boxes handled monthly', 'achievements.partners': 'Japanese business partners',
      'products.title': 'Our Products', 'products.subtitle': 'Premium Japanese products delivered fresh to your doorstep', 'products.hero.tag': 'Our Products', 'products.hero.title': 'Our Products', 'products.p1': 'Premium Supplements', 'products.p2': 'Skincare Essentials', 'products.p3': 'Cosmetics', 'products.p4': 'Snacks & Beverages', 'products.shop': 'Visit Lazada', 'products.shopNow': 'Visit Our Lazada', 'products.viewAll': 'View all',
	      'news.title': 'Latest News', 'news.hero.tag': 'News & Updates', 'news.hero.title': 'Latest News & Updates', 'news.viewAll': 'View all news', 'news.noNews': 'No news yet.', 'news.noNewsAvailable': 'No news available', 'news.checkBack': 'Check back later for the latest updates.'
    },
    enTitle: {
      'achievements.onTimeTip': 'On-time deliveries divided by total deliveries completed in the last quarter.',
      'achievements.lanesTip': 'Count of active lanes and countries served in the current month.',
      'achievements.clearanceTip': 'Average time from arrival to customs release, last quarter.',
      'achievements.skusTip': 'Total SKUs handled or TEUs processed per month.'
    },
	    jp: {
	    'nav.home': 'ホーム', 'nav.about': '会社情報', 'nav.services': '事業内容', 'nav.brand': 'ブランド', 'nav.products': '製品', 'nav.news': 'ニュース', 'nav.achievements': '実績', 'nav.contact': '問い合わせ先',
      'hero.title': '信頼できる越境物流',
      'hero.lead': 'マレーシアとシンガポールを中心に、迅速かつ丁寧に輸送します。',
      'hero.ctaServices': '事業内容', 'hero.ctaContact': '問い合わせ先',
      'services.title': '事業内容一覧', 'services.subtitle': 'アジアを結び、あらゆる接点で卓越性を提供する包括的な物流ソリューション', 'services.details': '詳細',
      'services.hero.tag': '事業内容', 'services.hero.title': '事業内容',
      'services.logistics.nav': '物流', 'services.retail.nav': '小売', 'services.events.nav': 'イベント', 'services.investment.nav': '出資',
      'services.logistics.title': '物流事業', 'services.logistics.summary': '日本からシンガポールへの食品輸出入、配送および卸売販売をワンストップで行っています。扱う日本食品は加工品や米、肉など多岐に渡り、温度に関わらず品質を保ったまま店舗までお届けします。', 'services.logistics.description': '日本からシンガポールへの食品輸出入、配送および卸売販売をワンストップで行っています。扱う日本食品は加工品や米、肉など多岐に渡り、温度に関わらず品質を保ったまま店舗までお届けします。現在、常温・冷蔵・冷凍の倉庫には合計60,000パレットを超える保管スペースを確保しており、自社冷凍トラックを活用することで、日本から現地目的地までの配送を低温で一貫して行えるコールドチェーンを確立しています。また、コンテナ船での定期輸送のほか、航空便など、用途に合わせた輸送のアレンジが可能です。',
      'services.events.title': '催事支援事業', 'services.events.summary': '物流・小売事業に加え、現地の百貨店における日本食品の催事出展もサポートしています。日本から現地への通関を含む輸出業務をはじめ、品質を保ったままで店舗へ配送、さらにイベント後のサポートまでワンストップで対応しています。', 'services.events.description': '物流・小売事業に加え、現地の百貨店における日本食品の催事出展もサポートしています。日本から現地への通関を含む輸出業務をはじめ、品質を保ったままで店舗へ配送、さらにイベント後のサポートまでワンストップで対応しています。またさらに、マレーシアに拠点を置く子会社、A&J Malaysiaと密に連携することで、シンガポールだけでなくアジアに広くサービスを拡張していきます。',
      'services.investment.title': '出資事業', 'services.investment.summary': '現地で日本食を楽しめる機会を提供するため、シンガポールやタイ、中国でのアジア飲食関連事業への出資を行っています。今後も当社の物流ノウハウを活かし、海外でも日本の食品に親しんでいただけるよう、多角的に事業を支援していきます。', 'services.investment.description': '現地で日本食を楽しめる機会を提供するため、シンガポールやタイ、中国でのアジア飲食関連事業への出資を行っています。今後も当社の物流ノウハウを活かし、海外でも日本の食品に親しんでいただけるよう、多角的に事業を支援していきます。',
      'services.retail.title': '小売事業', 'services.retail.summary': 'A＆J HAKKO PTE LTDでは、モノを運ぶだけでなく、現地とのコミュニケーションを通じて商品の良さを最大限お伝えしたいと考えているため、シンガポールの店舗における日本食品の販売支援も行なっています。', 'services.retail.description': 'A＆J HAKKO PTE LTDでは、モノを運ぶだけでなく、現地とのコミュニケーションを通じて商品の良さを最大限お伝えしたいと考えているため、シンガポールの店舗における日本食品の販売支援も行なっています。百貨店、食料品店、オンラインサイトを含む当社の幅広い販路を活かしながら、店舗担当者へのヒアリングや売場づくり、試食会などのイベントアレンジも実施することで、現地の生の声を掬い上げ、販売戦略に反映することが可能です。',
      'brand.title': 'ブランド',
      'about.subtitle': 'アジアを身近に', 'about.body': 'A&J HAKKO PTE LTDは、日本の食品のおいしさを国内だけでなく、広くアジアに届けることをミッションとしています。創業から70年以上の歴史を持つ八興運輸株式会社をルーツとし、食品の品質を落とすことなく、そのままアジアに届ける物流のノウハウを培ってきました。海外での多様な物流習慣に対応し、日本の味を世界へ伝えるサポートを行っています。', 'about.learnMore': '会社情報を見る',
      'location.title': '所在地', 'location.subtitle': 'シームレスな物流カバレッジのためにアジア太平洋地域に戦略的に配置', 'location.hours': '営業時間', 'location.email': 'メール', 'location.phone': '電話', 'location.directions': '場所を確認',
      'location.my.title': 'マレーシア', 'location.my.addr': 'No. 33-5, 5th Floor, The Boulevard Office, Mid Valley City, Lingkaran Syed Putra, 59200, Kuala Lumpur, Malaysia',
      'location.sg.title': 'シンガポール', 'location.sg.addr': '1 Buroh Lane, #2M-04, Singapore 618292',
      'location.jp.title': '日本', 'location.jp.addr': '〒8830-0062宮崎県日向市大字日知屋16392番地',
      'company.intro': 'A&J HAKKO PTE LTDは、日本の食品のおいしさを国内だけでなく、広くアジアに届けることをミッションとしています。創業から70年以上の歴史を持つ八興運輸株式会社をルーツとし、食品の品質を落とすことなく、そのままアジアに届ける物流のノウハウを培ってきました。海外での多様な物流習慣に対応し、日本の味を世界へ伝えるサポートを行っています。', 'company.stat1': '輸入実績', 'company.stat2': 'コンテナ取扱い', 'company.stat3': '月間取扱い箱数', 'company.stat4': '日本企業取引先',
      'company.overview.title': '会社概要',
      'company.table.name': '社名', 'company.table.registration': '法人番号', 'company.table.ceo': '代表者', 'company.table.ceo.name': '代表取締役社長　三輪修平', 'company.table.address': '所在地', 'company.table.phone': '電話番号', 'company.table.fax': 'FAX',
      'company.licenses.title': '許認可', 'company.licenses.food': '食品輸入登録', 'company.licenses.food.desc': '加工食品・食品器具輸入登録', 'company.licenses.meat': '肉類・魚類ライセンス', 'company.licenses.meat.desc': '肉類・魚類製品の輸入/輸出/積替ライセンス', 'company.licenses.produce': '青果物ライセンス', 'company.licenses.produce.desc': '生鮮果物・野菜の輸入/積替ライセンス', 'company.licenses.liquor': '酒類ライセンス', 'company.licenses.liquor.desc': '酒類ライセンス（クラス1A、1B、2A、2B、3A、3B、4）', 'company.licenses.rice': '米ライセンス', 'company.licenses.rice.desc': '米輸入・販売ライセンス', 'company.licenses.factory': '工場登録', 'company.licenses.factory.desc': '工場届出・登録',
      'company.products.title': '取扱い貨物', 'company.products.food.title': '食品全般', 'company.products.food.desc': '加工食品、魚介類、海藻類、調味料、アイスクリーム、酒類、米、牛肉、ミネラルウォーター、青果物等', 'company.products.home.title': '寝具', 'company.products.home.desc': '寝具および関連商品', 'company.products.cosmetics.title': '化粧品', 'company.products.cosmetics.desc': '美容・パーソナルケア製品', 'company.products.general.title': '雑品等', 'company.products.general.desc': 'その他各種商品',
      'company.history.title': '沿革', 'company.history.2011': '八興運輸㈱100%子会社としてA&J HAKKO PTE LTD設立', 'company.history.2012': '$2ショップ NANAIROをTampinesにオープン（現在閉店）。同時にシンガポール向け食品雑貨輸入事業開始', 'company.history.2013a': '日系デパート物産展　物流取りまとめ事業開始', 'company.history.2013b': '北海道産　交雑牛（牛肉）輸入販売開始', 'company.history.2015': '冷凍を主とした物流事業開始（保管・配送）', 'company.history.2016': 'ビジネス拡大に伴い、事務所兼倉庫移転', 'company.history.2017a': 'タイ・シンガポール拠点の会社と共にタイに合弁会社 JST Foods Co., Ltd設立', 'company.history.2017b': 'タイのEkkamaiにてシャトレーゼ社フランチャイズ店舗をオープン', 'company.history.2018': 'タイのBANGSUEにてシャトレーゼ社フランチャイズ店舗をオープン', 'company.history.2019a': '中国・シンガポール拠点の会社と共に中国に合弁会社 CJS Holdings Pte.,Ltd設立', 'company.history.2019b': '輸出入通関事業を開始', 'company.history.2019c': 'A&J HAKKOの100%子会社としてA&J HAKKO (M) SDN.BHD.をマレーシアに設立', 'company.history.2022a': '取扱貨物増加に伴い冷凍倉庫格納数を3000パレットに拡充', 'company.history.2022b': 'LAZADA オンライン販売開始', 'company.history.2023': '伊勢丹シンガポール委託販売開始', 'company.history.2025': '事務所兼倉庫を現在の場所に移転',
      'company.hero.tag': '会社情報', 'company.hero.title': 'アジアを身近に',
      'company.hero.badge': '1954年創業', 'company.hero.title1': 'アジアを', 'company.hero.title2': '身近に', 'company.hero.description': '八興運輸株式会社から70年以上の歴史を持つ当社は、品質を保持しながら本格的な日本製品をアジア全域にお届けする技術を習得してきました。', 'company.stats.import': '輸入実績', 'company.stats.containers': 'コンテナ取扱い実績', 'company.stats.monthly': '月間取扱い箱数', 'company.stats.partners': '日本企業取引先', 'company.overview.label': '企業情報', 'company.overview.title': '会社概要', 'company.licenses.label': 'コンプライアンス', 'company.licenses.title': '許認可', 'company.history.label': '当社の歴史', 'company.history.title': '沿革', 'company.history.2025': '事務所兼倉庫を現在の場所に移転', 'company.history.2023': '伊勢丹シンガポール委託販売開始', 'company.history.2022b': 'LAZADA オンライン販売開始', 'company.history.2022a': '取扱貨物増加に伴い冷凍倉庫格納数を3000パレットに拡充', 'company.history.2019c': 'A&J HAKKOの100%子会社としてA&J HAKKO (M) SDN.BHD.をマレーシアに設立', 'company.history.2019b': '輸出入通関事業を開始', 'company.history.2019a': '中国・シンガポール拠点の会社と共に中国に合弁会社 CJS Holdings Pte.,Ltd設立', 'company.history.2018': 'タイのBANGSUEにてシャトレーゼ社フランチャイズ店舗をオープン', 'company.history.2017b': 'タイのEkkamaiにてシャトレーゼ社フランチャイズ店舗をオープン', 'company.history.2017a': 'タイ・シンガポール拠点の会社と共にタイに合弁会社 JST Foods Co., Ltd設立', 'company.history.2016': 'ビジネス拡大に伴い、事務所兼倉庫移転', 'company.history.2015': '冷凍を主とした物流事業開始（保管・配送）', 'company.history.2013b': '北海道産　交雑牛（牛肉）輸入販売開始', 'company.history.2013a': '日系デパート物産展　物流取りまとめ事業開始', 'company.history.2012': '$2ショップ NANAIROをTampinesにオープン（現在閉店）。同時にシンガポール向け食品雑貨輸入事業開始', 'company.history.2011': '八興運輸㈱100%子会社としてA&J HAKKO PTE LTD設立', 'company.group.label': 'ネットワーク', 'company.group.title': 'グループ企業', 'company.group.subtitle': 'アジア全域で卓越性を提供する専門企業の強力なネットワーク', 'company.group.japan': '日本', 'company.group.malaysia': 'マレーシア', 'company.group.hakko.desc': '運送業・港湾荷役業・通関業', 'company.group.auto.desc': '自動車整備事業・民間車検工場', 'company.group.travel.desc': '旅行業', 'company.group.bayfront.desc': '曳船業・ポートサービス業', 'company.group.vanliner.desc': 'コンテナ輸送事業', 'company.group.hutec.desc': '労働者派遣業', 'company.group.insurance.desc': '保険業', 'company.group.shoji.desc': '輸出業', 'company.group.malaysia.desc': '輸入業',
      'achievements.title': '実績', 'achievements.subtitle': '実証された成果でアジア太平洋地域に卓越性を提供', 'achievements.import': '輸入実績', 'achievements.containers': 'コンテナ取扱い実績', 'achievements.monthly': '月間ハンドリング数量', 'achievements.partners': '日本企業取引先',
      'products.title': '製品', 'products.subtitle': '新鮮な状態でお客様のもとへお届けする高品質な日本製品', 'products.hero.tag': '製品', 'products.hero.title': 'プレミアム日本製品', 'products.p1': 'プレミアムサプリ', 'products.p2': 'スキンケア', 'products.p3': 'コスメ', 'products.p4': 'スナック・飲料', 'products.shop': 'Lazadaで購入', 'products.shopNow': 'Lazadaで購入', 'products.viewAll': 'すべて見る',
	      'news.title': '最新ニュース', 'news.hero.tag': 'ニュース', 'news.hero.title': '最新ニュース', 'news.viewAll': 'ニュース一覧へ', 'news.noNews': 'まだニュースはありません。', 'news.noNewsAvailable': 'ニュースはありません', 'news.checkBack': '最新情報は後ほどご確認ください。'
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

  // Services section - static grid (no carousel functionality)

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

  // Products continuous scrolling marquee (same as brand section)
  (function initProductsMarquee() {
    const track = document.getElementById('products-grid');
    const prevBtn = document.querySelector('.products-nav.prev');
    const nextBtn = document.querySelector('.products-nav.next');
    if (!track) return;
    
    let position = 0;
    let isPaused = false;
    let trackWidth = 0;
    
    function setupAnimation(cardsHtml = []) {
      let products = cardsHtml;
      
      if (!products.length && location.protocol === 'file:') {
        products = [
          '<article class="product-card"><img src="./images/test.png" alt="Premium Supplement"><h4>Premium Supplement</h4></article>',
          '<article class="product-card"><img src="./images/test.png" alt="Skincare Essential"><h4>Skincare Essential</h4></article>',
          '<article class="product-card"><img src="./images/test.png" alt="Japanese Snacks"><h4>Japanese Snacks</h4></article>',
          '<article class="product-card"><img src="./images/test.png" alt="Beauty Products"><h4>Beauty Products</h4></article>',
          '<article class="product-card"><img src="./images/test.png" alt="Health Drinks"><h4>Health Drinks</h4></article>',
          '<article class="product-card"><img src="./images/test.png" alt="Organic Foods"><h4>Organic Foods</h4></article>',
          '<article class="product-card"><img src="./images/test.png" alt="Traditional Tea"><h4>Traditional Tea</h4></article>',
          '<article class="product-card"><img src="./images/test.png" alt="Wellness Kit"><h4>Wellness Kit</h4></article>'
        ];
      }
      
      if (!products.length) return;
      
      track.innerHTML = products.join('');
      const originalProducts = Array.from(track.children);
      
      // Duplicate for seamless scrolling
      originalProducts.forEach(product => {
        track.appendChild(product.cloneNode(true));
      });
      
      console.log('PRODUCTS MARQUEE: Found', originalProducts.length, 'products');
      
      // Calculate track width
      trackWidth = 0;
      originalProducts.forEach((product, index) => {
        trackWidth += product.offsetWidth;
        if (index < originalProducts.length - 1) {
          trackWidth += 24;
        }
      });
      
      console.log('📐 Products track width:', trackWidth + 'px');
      
      function animate() {
        if (!isPaused) {
          position -= 1;
          if (Math.abs(position) >= trackWidth) {
            position = 0;
          }
          track.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animate);
      }
      
      track.addEventListener('mouseenter', () => { isPaused = true; });
      track.addEventListener('mouseleave', () => { isPaused = false; });
      
      // Navigation buttons
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          position += 300;
          if (position > 0) position = -trackWidth + 300;
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          position -= 300;
          if (Math.abs(position) >= trackWidth) position = 0;
        });
      }
      
      window.addEventListener('resize', () => {
        trackWidth = 0;
        originalProducts.forEach((product, index) => {
          trackWidth += product.offsetWidth;
          if (index < originalProducts.length - 1) {
            trackWidth += 24;
          }
        });
      });
      
      animate();
    }
    
    window.initProductsSlider = function(cardsHtml = [], opts = {}) {
      if (Array.isArray(cardsHtml) && cardsHtml.length || opts.immediate) {
        setTimeout(() => setupAnimation(cardsHtml), 100);
      } else {
        setTimeout(() => setupAnimation([]), 1000);
      }
    };
    
    // Auto-init for local
    if (location.protocol === 'file:') {
      setTimeout(() => setupAnimation([]), 1000);
    }
  })();

  // Simple loop: scroll original Firebase logos, reset when last logo appears on right
  (function initBrandMarquee(){
    const track = document.querySelector('.brand-track');
    if (!track) return;
    
    let position = 0;
    let isPaused = false;
    const speed = 1; // Pixels per frame
    let frameCount = 0;
    let trackWidth = 0;
    let viewportWidth = 0;
    
    function setupAnimation() {
      const originalLogos = Array.from(track.children);
      if (originalLogos.length === 0) return;
      
      // Duplicate logos for seamless scrolling
      originalLogos.forEach(logo => {
        const clone = logo.cloneNode(true);
        track.appendChild(clone);
      });
      
      console.log('� SIMPLE LOOP SETUP: Found', originalLogos.length, 'Firebase logos');
      
      // Calculate track width properly
      trackWidth = 0;
      originalLogos.forEach((logo, index) => {
        trackWidth += logo.offsetWidth;
        if (index < originalLogos.length - 1) {
          trackWidth += 48; // gap between logos
        }
      });
      
      // Get viewport width
      const viewport = document.querySelector('.brand-viewport');
      viewportWidth = viewport ? viewport.offsetWidth : window.innerWidth;
      
      console.log('📐 Track width:', trackWidth + 'px');
      console.log('📐 Viewport width:', viewportWidth + 'px');
      console.log('🎯 Will reset when position reaches:', -(trackWidth - viewportWidth) + 'px');
      
      function animate() {
        if (!isPaused) {
          position -= 1;
          
          // Reset when first half completely scrolled
          if (Math.abs(position) >= trackWidth) {
            position = 0;
          }
          
          track.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(animate);
      }
      
      track.addEventListener('mouseenter', () => { isPaused = true; });
      track.addEventListener('mouseleave', () => { isPaused = false; });
      
      // Recalculate on resize
      window.addEventListener('resize', () => {
        trackWidth = 0;
        originalLogos.forEach((logo, index) => {
          trackWidth += logo.offsetWidth;
          if (index < originalLogos.length - 1) {
            trackWidth += 48;
          }
        });
      });
      
      animate();
    }
    
    let lastCount = 0;
    let stableCount = 0;
    const checkInterval = setInterval(() => {
      const currentCount = track.children.length;
      if (currentCount === lastCount) {
        stableCount++;
        if (stableCount >= 3 && currentCount > 0) {
          clearInterval(checkInterval);
          setTimeout(setupAnimation, 1500);
        }
      } else {
        stableCount = 0;
        lastCount = currentCount;
      }
    }, 500);
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
  langButtons.forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    const newLang = b.getAttribute('data-lang') || 'en';
    setLang(newLang);
  }));

  function setLang(lang) {
    // Update all language buttons across the page
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String((btn.getAttribute('data-lang')||'') === lang));
      if ((btn.getAttribute('data-lang')||'') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    localStorage.setItem('lang', lang);
    const dict = translations[lang] || translations.en;
    
    // Update all elements with data-i18n attributes
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
    
    // Update tooltips
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (!key) return;
      const val = (translations[`${lang}Title`]||{})[key];
      if (val) el.setAttribute('title', val);
    });
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', lang === 'jp' ? 'ja' : (lang === 'zh' ? 'zh' : 'en'));
    
    // Handle address and company name language switching
    document.querySelectorAll('.addr-jp, .addr-en').forEach((el) => {
      if (lang === 'jp') {
        el.style.display = el.classList.contains('addr-jp') ? 'block' : 'none';
      } else {
        el.style.display = el.classList.contains('addr-en') ? 'block' : 'none';
      }
    });
    
    document.querySelectorAll('.company-jp, .company-en').forEach((el) => {
      if (lang === 'jp') {
        el.style.display = el.classList.contains('company-jp') ? 'inline' : 'none';
      } else {
        el.style.display = el.classList.contains('company-en') ? 'inline' : 'none';
      }
    });
    
    document.querySelectorAll('.map-jp, .map-en').forEach((el) => {
      if (lang === 'jp') {
        el.style.display = el.classList.contains('map-jp') ? 'block' : 'none';
      } else {
        el.style.display = el.classList.contains('map-en') ? 'block' : 'none';
      }
    });
    
    // Trigger a custom event to notify other parts of the application
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }

  // translations defined at top of file
})();
