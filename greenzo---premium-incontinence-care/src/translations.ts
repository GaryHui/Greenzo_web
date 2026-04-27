import { create } from 'zustand';

type Language = 'zh' | 'en' | 'ja' | 'hk';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'zh',
  setLanguage: (lang) => set({ language: lang }),
}));

export const translations = {
  zh: {
    nav: {
      home: '首页',
      products: '产品中心',
      story: '品牌故事',
      contact: '联系我们',
    },
    hero: {
      title: '守护每一份尊严与舒适',
      subtitle: '专注失禁护理，为晚年生活带来体贴入微的关怀。',
      cta: '了解更多',
      quote: '让舒适触及生活的每一个角落。',
    },
    story: {
      title: '品牌故事',
      content1: 'Greenzo（莞众）成立于2015年12月，由深耕失禁护理行业20余年的资深专家创立。我们深知高品质护理产品对提升生活质量的重要性。',
      content2: '我们的设计理念源自对生命的尊重，追求简洁、洁净、可靠的产品表达。我们不仅提供产品，更致力于为家庭和养老机构提供专业的护理解决方案。',
      experience: '20年行业底蕴',
      milestone: '1000万+',
      milestoneDesc: '成人纸尿片售出',
      trust: '守护千万家庭',
    },
    quality: {
      title: '工艺与细节',
      subtitle: '极致柔软，源于对每一根纤维的挑剔。',
      feature1: '5层瞬吸技术',
      feature1Desc: '专为瞬时锁水设计，保持皮肤持续干爽。',
      feature2: '云感亲肤',
      feature2Desc: '采用精选天然纤维，触感如云朵般轻盈。',
      feature3: '低敏标准',
      feature3Desc: '通过国际标准检测，无荧光剂，守护脆弱肌肤。',
    },
    gallery: {
      title: '视觉呈现',
      subtitle: '全方位的细节展示，让每一份用心清晰可见。',
      videoLabel: '产品演示视频',
    },
    standards: {
      title: '生产标准',
      subtitle: '严苛的质量管控体系，确保每一件产品的安全性。',
      iso: 'ISO 9001/14001双体系',
      medical: '医用级标准生产',
      sgs: 'SGS低敏检测认证',
    },
    products: {
      title: '产品中心',
      categories: {
        incontinence: {
          name: '失禁护理系统',
          items: [
            {
              id: 'diaper',
              name: '成人纸尿裤',
              desc: '1500ml超大吸水量，强力锁水不反渗，一片呵护全晚。',
              image: '', // Will fall back to ASSET_CONFIG or defined here
              specs: ['1500ml超大容量', '强力锁水因子', 'PE复合透气膜', '3D柔点面层'],
              features: '快吸大容量，保持12小時持續乾爽。強力鎖水技術有效防止反滲，PE複合透氣膜杜絕悶熱，給身體一整晚的溫情呵護。',
            },
            {
              id: 'pad',
              name: '成人护理垫',
              desc: '大容量吸收，强力锁水，洁净居家生活。',
              specs: ['PE防漏底膜', '绒毛浆吸收层', '菱形导流压纹', '大尺寸覆盖'],
              features: '医疗级护理标准，适用于手术后、产后及失能长者的日常翻身与更换护理。',
            }
          ]
        },
        household: {
          name: '生活用纸系列',
          items: [
            {
              id: 'soft-tissue',
              name: '抽取式面巾纸',
              desc: '原生木浆，亲肤柔软，湿水不易破。',
              specs: ['100%原生木浆', '三层加厚', '无荧光加白', '柔润质感'],
              features: '精选优质原生木浆，经过超高温处理，洁净卫生，适合全家使用。',
            }
          ]
        },
        personal: {
          name: '个人护理系列',
          items: [
            {
              id: 'wipe',
              name: '卫生湿巾',
              desc: '亲肤柔和，温和清洁，守护敏感肌肤。',
              specs: ['EDI纯水工艺', '珍珠纹无纺布', '弱酸性配方', '抽取式设计'],
              features: '不含酒精与香料，温和清洁的同时滋润皮肤，维持天然屏障。',
            }
          ]
        }
      },
      details: {
        close: '关闭详情',
      },
    },
    channels: {
      title: '全渠道覆盖',
      description: '线下覆盖珠三角连锁药店、医院周边、养老机构等；线上覆盖主流电商平台。',
    },
    contact: {
      title: '联系方式',
      address: '广东省东莞市东城街道下桥工业园路19号1栋',
      phone: '服务热线',
      email: '商务邮箱',
    },
  },
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      story: 'Brand Story',
      contact: 'Contact',
    },
    hero: {
      title: 'Embracing Comfort and Dignity',
      subtitle: 'Premium incontinence care designed for specialized comfort and protection.',
      cta: 'Learn More',
      quote: 'Bringing comfort to every corner of your life.',
    },
    story: {
      title: 'Our Story',
      content1: 'Born from 20 years of deep industry expertise, Greenzo was founded in 2015 with a mission to redefine incontinence care through quality and compassion.',
      content2: 'Our Japanese-inspired design philosophy focuses on simplicity, cleanliness, and reliability, serving both individual homes and professional care institutions.',
      experience: '20 Years of Expertise',
      milestone: '10M+',
      milestoneDesc: 'Diapers Sold',
      trust: 'Caring for Families',
    },
    quality: {
      title: 'Craftsmanship & Detail',
      subtitle: 'Extreme softness, born from precision in every fiber.',
      feature1: '5-Layer Absorption',
      feature1Desc: 'Designed for instant locking to keep skin dry.',
      feature2: 'Cloud-Like Touch',
      feature2Desc: 'Premium natural fibers for a lightweight feel.',
      feature3: 'Hypoallergenic',
      feature3Desc: 'Passed international standards with zero irritants.',
    },
    products: {
      title: 'Our Products',
      categories: {
        incontinence: {
          name: 'Incontinence Care',
          items: [
            {
              id: 'diaper',
              name: 'Adult Diapers',
              desc: '1500ml high absorption, anti-backflow, overnight care.',
              specs: ['1500ml High Capacity', 'Anti-Backflow Tech', 'PE Breathable Film', '3D Soft Surface'],
              features: 'Designed for heavy absorption (1500ml) with quick-dry and anti-backflow technology. The PE composite breathable film ensures comfort and protection throughout the night.',
            },
            {
              id: 'pad',
              name: 'Nursing Pads',
              desc: 'Maximum leakage protection and quick-dry surface.',
              specs: ['PE Backsheet', 'Fluff Pulp Core', 'Diamond Embossed', 'Extra Wide Coverage'],
              features: 'Medical-grade standards, ideal for post-surgery, postpartum, and daily protection for bedridden users.',
            }
          ]
        },
        household: {
          name: 'Household Paper',
          items: [
            {
              id: 'soft-tissue',
              name: 'Soft Facial Tissue',
              desc: 'Virgin pulp, skin-friendly and durable when wet.',
              specs: ['100% Virgin Pulp', '3-Ply Thickness', 'No Optical Brighteners', 'Soft Texture'],
              features: 'Premium virgin pulp treated at high temperatures for purity. Perfect for the whole family.',
            }
          ]
        },
        personal: {
          name: 'Personal Care',
          items: [
            {
              id: 'wipe',
              name: 'Hygiene Wipes',
              desc: 'Soft, gentle cleansing for sensitive skin care.',
              specs: ['EDI Pure Water', 'Pearl Texture Fabric', 'pH Balanced', 'Smooth Dispensing'],
              features: 'Free from alcohol and fragrance, gently cleanses while maintaining the skin\'s natural moisture barrier.',
            }
          ]
        }
      },
      details: {
        close: 'Close Details',
      },
    },
    gallery: {
      title: 'Visual Experience',
      subtitle: 'Detailed presentation of our commitment to excellence.',
      videoLabel: 'Product Demo Video',
    },
    standards: {
      title: 'Quality Standards',
      subtitle: 'Stringent quality control ensuring the safety of every single product.',
      iso: 'ISO 9001/14001 Dual System',
      medical: 'Medical Grade Production',
      sgs: 'SGS Hypoallergenic Certified',
    },
    channels: {
      title: 'Channel Presence',
      description: 'Strong presence in hospitals, elderly care, and pharmacies across the PRD region, as well as leading e-commerce platforms.',
    },
    contact: {
      title: 'Contact Us',
      address: 'Bldg 1, No. 19 Xiaqiao Industrial Road, Dongcheng District, Dongguan, Guangdong',
      phone: 'Hotline',
      email: 'Email',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      products: '製品紹介',
      story: 'ブランドストーリー',
      contact: 'お問い合わせ',
    },
    hero: {
      title: '尊厳を守り、心地よさを届ける',
      subtitle: '20年の経験に基づいた、究極の優しさと機能性を追求した介護ケア。',
      cta: '詳細を見る',
      quote: '暮らしのあらゆる瞬間に、心地よさを。',
    },
    story: {
      title: 'ブランド物語',
      content1: 'ケア業界で20年以上の経験を持つ専門家によって2015年に設立されたGreenzoは、品質と信頼に情熱を注いでいます。',
      content2: 'シンプルで清潔、そして信頼。日本的な美意識と革新を融合させ、より良い介護環境の実現を目指しています。',
      experience: '20年の実績',
      milestone: '1,000万+',
      milestoneDesc: '累計販売枚数',
      trust: '多くの家族に寄り添う',
    },
    quality: {
      title: '職人技と細部へのこだわり',
      subtitle: '究極の柔らかさは、一本一本の繊維へのこだわりから生まれます。',
      feature1: '5層瞬間吸収テクノロジー',
      feature1Desc: '瞬時に水分を閉じ込め、お肌を常にさらさらに保ちます。',
      feature2: '雲のような肌触り',
      feature2Desc: '厳選された天然繊維を使用し、軽やかで優しい付け心地を実現。',
      feature3: '低刺激基準',
      feature3Desc: '国際基準のテストをクリア。蛍光剤不使用で、デリケートな肌を守ります。',
    },
    products: {
      title: '製品紹介',
      categories: {
        incontinence: {
          name: '失禁ケアシステム',
          items: [
            {
              id: 'diaper',
              name: '大人用おむつ',
              desc: '1500mlの大吸収量。逆戻り防止で、一晩中お肌を保護します。',
              specs: ['1500ml大吸収量', '強力逆戻り防止', 'PE通気性フィルム', '3Dソフトシート'],
              features: '1500mlの吸収力と高度な逆戻り防止技術を採用。PE複合通気性フィルムにより、ムレを防ぎ、一晩中快適な眠りをサポートします。',
            },
            {
              id: 'pad',
              name: '介護用パッド',
              desc: '強力な吸水力と逆戻り防止。清潔な毎日をサポート。',
              specs: ['防水フィルム', '高密度パルプ層', 'ダイヤプレス加工', 'ワイドサイズ'],
              features: '医療現場で採用される品質。術後や産後のケア、寝たきりの方の日常的な介護に最適です。',
            }
          ]
        },
        household: {
          name: '生活用品シリーズ',
          items: [
            {
              id: 'soft-tissue',
              name: 'ソフトフェイシャルティッシュ',
              desc: 'バージンパルプ100％、肌に優しく水に強い。',
              specs: ['バージンパルプ100％', '3枚重ね', '蛍光剤不使用', '柔らかな質感'],
              features: '高温処理された高品質なバージンパルプを使用。清潔で衛生的、ご家族全員で安心してお使いいただけます。',
            }
          ]
        },
        personal: {
          name: 'パーソナルケア',
          items: [
            {
              id: 'wipe',
              name: 'ウェットタオル',
              desc: 'お肌に優しく、デリケートな部分もしっかり除菌・清潔に。',
              specs: ['EDI超純水使用', 'エンボス加工不織布', '弱酸性処方', 'ワンタッチ取り出し'],
              features: '香料・アルコール不使用。潤いを守りながら汚れを落とし、デリケートなお肌をケアします。',
            }
          ]
        }
      },
      details: {
        close: '詳細を閉じる',
      },
    },
    gallery: {
      title: 'ビジュアルギャラリー',
      subtitle: '細部までこだわった、妥協のないモノづくりを。',
      videoLabel: '製品デモンストレーションビデオ',
    },
    standards: {
      title: '品質基準',
      subtitle: '厳格な品質管理体制により、全製品の安全性を確保しています。',
      iso: 'ISO 9001/14001 認証',
      medical: '医療グレードの生産基準',
      sgs: 'SGS低刺激性テスト済み',
    },
    channels: {
      title: '流通ネットワーク',
      description: '珠江デルタ地域の病院、介護施設、薬局への供給に加え、主要オンラインショップでも展開中。',
    },
    contact: {
      title: 'お問い合わせ',
      address: '広東省東莞市東城街道下橋工業園路19号1棟',
      phone: 'お電話',
      email: 'メール',
    },
  },
  hk: {
    nav: {
      home: '首頁',
      products: '產品中心',
      story: '品牌故事',
      contact: '聯絡我們',
    },
    hero: {
      title: '守護每一份尊嚴與舒適',
      subtitle: '專注失禁護理，為晚年生活帶來體貼入微的關懷。',
      cta: '了解更多',
      quote: '讓舒適觸及生活的每一個角落。',
    },
    story: {
      title: '品牌故事',
      content1: 'Greenzo（莞眾）成立於2015年12月，由深耕失禁護理行業20餘年的資深專家創立。我們深知高品質護理產品對提升生活質量的重要性。',
      content2: '我們的設計理念源自對生命的尊重，追求簡潔、潔淨、可靠的產品表達。我們不僅提供產品，更致力於為家庭和養老機構提供專業的護理解決方案。',
      experience: '20年行業底蘊',
      milestone: '1000萬+',
      milestoneDesc: '成人紙尿片售出',
      trust: '守護千萬家庭',
    },
    quality: {
      title: '工藝與細節',
      subtitle: '極致柔軟，源於對每一根纖維的挑剔。',
      feature1: '5層瞬吸技術',
      feature1Desc: '專為瞬時鎖水設計，保持皮膚持續乾爽。',
      feature2: '雲感親膚',
      feature2Desc: '採用精選天然纖維，觸感如雲朵般輕盈。',
      feature3: '低敏標準',
      feature3Desc: '通過國際標準檢測，無螢光劑，守護脆弱肌膚。',
    },
    products: {
      title: '產品中心',
      categories: {
        incontinence: {
          name: '失禁護理系統',
          items: [
            {
              id: 'diaper',
              name: '成人紙尿褲',
              desc: '1500ml超大吸水量，強力鎖水不反滲，一片呵護全晚。',
              specs: ['1500ml超大容量', '強力鎖水因子', 'PE複合透氣膜', '3D柔點面層'],
              features: '快吸大容量，保持12小時持續乾爽。強力鎖水技術有效防止反滲，PE複合透氣膜杜絕悶熱，給身體一整晚的溫情呵護。',
            },
            {
              id: 'pad',
              name: '成人護理墊',
              desc: '大容量吸收，強力鎖水，潔淨居家生活。',
              specs: ['PE防漏底膜', '絨毛漿吸收層', '菱形導流壓紋', '大尺寸覆蓋'],
              features: '醫療級護理標準，適用於手術後、產後及失能長者的日常翻身與更換護理。',
            }
          ]
        },
        household: {
          name: '生活用紙系列',
          items: [
            {
              id: 'soft-tissue',
              name: '抽取式面巾紙',
              desc: '原生木漿，親膚柔軟，濕水不易破。',
              specs: ['100%原生木漿', '三層加厚', '無熒光加白', '柔潤質感'],
              features: '精選優質原生木漿，經過超高溫處理，潔淨衛生，適合全家使用。',
            }
          ]
        },
        personal: {
          name: '個人護理系列',
          items: [
            {
              id: 'wipe',
              name: '衛生濕巾',
              desc: '親膚柔和，溫和清潔，守護敏感肌膚。',
              specs: ['EDI純水工藝', '珍珠紋無紡布', '弱酸性配方', '抽取式設計'],
              features: '不含酒精與香料，溫和清潔的同時滋潤皮膚，維持天然屏障。',
            }
          ]
        }
      },
      details: {
        close: '關閉詳情',
      },
    },
    gallery: {
      title: '視覺呈現',
      subtitle: '全方位的細節展示，讓每一份用心清晰可見。',
      videoLabel: '產品演示視頻',
    },
    standards: {
      title: '生產標準',
      subtitle: '嚴苛的質量管控體系，確保每一件產品的安全性和舒適度。',
      iso: 'ISO 9001/14001 雙體系認證',
      medical: '醫用級標准生產',
      sgs: 'SGS低敏檢測認證',
    },
    channels: {
      title: '全渠道覆蓋',
      description: '線下覆蓋珠三角連鎖藥店、醫院周邊、養老機構等；線上覆蓋主流電商平台。',
    },
    contact: {
      title: '聯絡方式',
      address: '廣東省東莞市東城街道下橋工業園路19號1棟',
      phone: '服務熱線',
      email: '商務郵箱',
    },
  },
};
