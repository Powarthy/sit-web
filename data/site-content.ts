export type Locale = "fr" | "en" | "fi";

export const locales: Locale[] = ["fr", "en", "fi"];
export const defaultLocale: Locale = "fr";

export const siteSettings = {
  name: "The French Café",
  location: "Kuusamo, Finlande",
  siteUrl: "https://kahvilathefrench.cafe",
  address: "Kitkantie 2, 93600 Kuusamo",
  phone: "+358(0)504369455",
  email: "info@kahvilathefrench.cafe",
  heroImage: "/images/1.webp",
  heroImageAlt: "Pâtisseries fraîches et café servi sur une table lumineuse",
  reservationUrl: "https://thefrenchcafe.simplybook.it/v2/",
  instagramUrl: "https://www.instagram.com/kahvilathefrenchcafe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  mapUrl: "https://maps.google.com/?q=Kitkantie+2,+Kuusamo",
  openingHours: [
    { day: "Tue - Thu", hours: "07:00 – 17:00" },
    { day: "Fri", hours: "07:00 – 20:00 (happy hours)" },
    { day: "Sat", hours: "11:00 – 17:00" },
    { day: "Sun", hours: "11:00 – 15:00 (2nd Sunday only)" },
    { day: "Mon", hours: "Closed" }
  ],
  brunch: {
    cadence: "2e dimanche du mois",
    nextDate: "11:00 – 15:00 (café ouvert)",
    hours: "10:45 & 13:00",
    price: "45 € / personne",
    reservationNote: "Réservation obligatoire. Deux services : 10:45 et 13:00."
  },
  seasonal: {
    title: "Printemps gourmand",
    description: "Collection de pâtisseries aux agrumes nordiques et vanille de Madagascar.",
    cta: "Découvrir en boutique"
  }
};

export const openingHoursByLocale: Record<Locale, { day: string; hours: string }[]> = {
  fr: [
    { day: "Mar - Jeu", hours: "07:00 – 17:00" },
    { day: "Ven", hours: "07:00 – 20:00 (happy hours)" },
    { day: "Sam", hours: "11:00 – 17:00" },
    { day: "Dim", hours: "11:00 – 15:00 (2e dimanche uniquement)" },
    { day: "Lun", hours: "Fermé" }
  ],
  en: [
    { day: "Tue - Thu", hours: "07:00 – 17:00" },
    { day: "Fri", hours: "07:00 – 20:00 (happy hours)" },
    { day: "Sat", hours: "11:00 – 17:00" },
    { day: "Sun", hours: "11:00 – 15:00 (2nd Sunday only)" },
    { day: "Mon", hours: "Closed" }
  ],
  fi: [
    { day: "Ti - To", hours: "07:00 – 17:00" },
    { day: "Pe", hours: "07:00 – 20:00 (happy hours)" },
    { day: "La", hours: "11:00 – 17:00" },
    { day: "Su", hours: "11:00 – 15:00 (vain kuukauden 2. sunnuntai)" },
    { day: "Ma", hours: "Suljettu" }
  ]
};

export const ogImageUrl = `${siteSettings.siteUrl}${siteSettings.heroImage}`;

export const locationByLocale: Record<Locale, string> = {
  fr: "Kuusamo, Finlande",
  en: "Kuusamo, Finland",
  fi: "Kuusamo, Suomi"
};

export const seasonalByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "L'été gourmand",
    description: "Collection de pâtisseries aux fruits rouges et vanille de Madagascar."
  },
  en: {
    title: "Summer collection",
    description: "Seasonal pastries with red berries and Madagascar vanilla."
  },
  fi: {
    title: "Kesäkauden kokoelma",
    description: "Kausileivonnaisissa makuina raikkaita marjoja ja pehmeää vaniljaa."
  }
};

export const localizedRoutes = {
  home: { fr: "", en: "", fi: "" },
  brunch: { fr: "brunch", en: "brunch", fi: "brunssi" },
  menu: { fr: "menu", en: "menu", fi: "menu" },
  gallery: { fr: "gallerie", en: "gallery", fi: "galleria" },
  contact: { fr: "contact", en: "contact", fi: "yhteys" },
  about: { fr: "a-propos", en: "about", fi: "meista" },
  catering: { fr: "catering", en: "catering", fi: "catering" }
} as const;

export const buildLocalizedUrl = (locale: Locale, slug: string) =>
  `${siteSettings.siteUrl}/${locale}${slug ? `/${slug}` : ""}`;

export const getRouteAlternates = (routeKey: keyof typeof localizedRoutes) =>
  Object.fromEntries(
    locales.map((locale) => [locale, buildLocalizedUrl(locale, localizedRoutes[routeKey][locale])])
  );

type NavItem = { label: string; href: string };

type OfferCard = {
  title: string;
  description: string;
  highlights: string[];
};

type MenuItem = {
  name: string;
  detail: string;
};

type MenuSubsection = {
  title: string;
  description?: string;
  items: MenuItem[];
};

type MenuSection = {
  title: string;
  description: string;
  items: MenuItem[];
  subsections?: MenuSubsection[];
};

type PageContent = {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    badge: string;
    headline: string;
    subhead: string;
    primaryCta: string;
    secondaryCta: string;
    imageLabel: string;
    imageCaption: string;
    brunchNote: string;
  };
  signature: {
    title: string;
    description: string;
    highlights: string[];
  };
  now: {
    title: string;
    subtitle: string;
    items: { label: string; value: string }[];
  };
  offers: {
    title: string;
    cards: OfferCard[];
  };
  proof: {
    title: string;
    quotes: string[];
  };
  contactBlock: {
    title: string;
    cta: string;
  };
  brunchPage: {
    title: string;
    intro: string;
    details: { label: string; value: string }[];
    steps: string[];
    note: string;
    cta: string;
  };
  menuPage: {
    title: string;
    intro: string;
    sections: MenuSection[];
  };
  cateringPage: {
    title: string;
    intro: string;
    cards: { title: string; description: string }[];
    ctaTitle: string;
    ctaDescription: string;
    cta: string;
  };
  aboutPage: {
    title: string;
    intro: string;
    sections: {
      title: string;
      image: string;
      imageAlt: string;
      paragraphs: string[];
    }[];
    visionTitle: string;
    vision: string[];
    valuesTitle: string;
    values: { title: string; description: string }[];
  };
  contactPage: {
    title: string;
    intro: string;
    methods: { label: string; value: string }[];
    reservationTitle: string;
    reservationDescription: string;
  };
  footer: {
    description: string;
    rights: string;
  };
};

export const navigation: Record<Locale, NavItem[]> = {
  fr: [
    { label: "Accueil", href: `/fr/${localizedRoutes.home.fr}` },
    { label: "Brunch", href: `/fr/${localizedRoutes.brunch.fr}` },
    { label: "Menu", href: `/fr/${localizedRoutes.menu.fr}` },
    { label: "Galerie", href: `/fr/${localizedRoutes.gallery.fr}` },
    { label: "À propos", href: `/fr/${localizedRoutes.about.fr}` },
    { label: "Contact", href: `/fr/${localizedRoutes.contact.fr}` }
  ],
  en: [
    { label: "Home", href: `/en/${localizedRoutes.home.en}` },
    { label: "Brunch", href: `/en/${localizedRoutes.brunch.en}` },
    { label: "Menu", href: `/en/${localizedRoutes.menu.en}` },
    { label: "Gallery", href: `/en/${localizedRoutes.gallery.en}` },
    { label: "About", href: `/en/${localizedRoutes.about.en}` },
    { label: "Contact", href: `/en/${localizedRoutes.contact.en}` }
  ],
  fi: [
    { label: "Etusivu", href: `/fi/${localizedRoutes.home.fi}` },
    { label: "Brunssi", href: `/fi/${localizedRoutes.brunch.fi}` },
    { label: "Menu", href: `/fi/${localizedRoutes.menu.fi}` },
    { label: "Galleria", href: `/fi/${localizedRoutes.gallery.fi}` },
    { label: "Meistä", href: `/fi/${localizedRoutes.about.fi}` },
    { label: "Yhteystiedot", href: `/fi/${localizedRoutes.contact.fi}` }
  ]
};

const resolveLocale = (locale?: string): Locale => {
  if (!locale) return defaultLocale;
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
};

export const getLocaleContent = (locale: Locale | string | undefined) => content[resolveLocale(locale)];
export const getLocaleNavigation = (locale: Locale | string | undefined) => navigation[resolveLocale(locale)];

export const content: Record<Locale, PageContent> = {
  fr: {
    seo: {
      title: "The French Café | Café-pâtisserie premium à Kuusamo",
      description: "Pâtisserie artisanale française, café de spécialité et brunch signature à Kuusamo. Réservez votre table ou une commande spéciale."
    },
    hero: {
      badge: "Maison artisanale",
      headline: "L'art de vivre café & pâtisserie à Kuusamo",
      subhead: "Pâtisserie fine, café de spécialité et accueil sincère — une maison chaleureuse où l'on prend le temps.",
      primaryCta: "Réserver une table",
      secondaryCta: "Découvrir la carte",
      imageLabel: "La maison",
      imageCaption: "Lumière du matin, pâtisseries fraîches, tables délicates.",
      brunchNote: "2e dimanche · Café ouvert 11:00 – 15:00"
    },
    signature: {
      title: "L'artisanat français, la chaleur nordique",
      description: "Pâtisseries fines, café de spécialité, tables lumineuses — une adresse intime pour venir respirer et savourer.",
      highlights: [
        "Pâtisseries fines façonnées chaque matin",
        "Café de spécialité soigneusement sourcé",
        "Brunch signature en série limitée",
        "Service délicat, ambiance chaleureuse"
      ]
    },
    now: {
      title: "En ce moment",
      subtitle: "Instants à savourer cette saison",
      items: [
        { label: "Brunch signature", value: "Dates ouvertes · 10:45 & 13:00" },
        { label: "Ouverture du café", value: "11:00 – 15:00 ce dimanche" },
        { label: "Pause café", value: "Happy hours le vendredi" }
      ]
    },
    offers: {
      title: "Les essentiels de la maison",
      cards: [
        {
          title: "Pâtisserie fine",
          description: "Entremets délicats, éclairs signature et tartes de saison au dressage précis.",
          highlights: ["Sélection quotidienne", "Ingrédients premium", "Textures aériennes"]
        },
        {
          title: "Brunch signature",
          description: "Un rituel mensuel aux accents français et scandinaves, servi avec élégance.",
          highlights: ["Menu dégustation", "Places limitées", "Réservation fluide"]
        },
        {
          title: "Boissons & café",
          description: "Espressos soignés, lattés créatifs et infusions haut de gamme.",
          highlights: ["Torréfaction nordique", "Lait nordique", "Service précis"]
        },
        {
          title: "Catering & commandes",
          description: "Pâtisseries personnalisées et buffets élégants pour vos événements.",
          highlights: ["Sur-mesure", "Livraison possible", "Conseil dédié"]
        }
      ]
    },
    proof: {
      title: "Une adresse reconnue pour son exigence",
      quotes: [
        "Classé parmi les meilleures pâtisseries artisanales du nord de la Finlande.",
        "Noté 4,9/5 pour la finesse des créations et l'accueil.",
        "Sélectionné par Kuusamo Lifestyle pour son brunch signature."
      ]
    },
    contactBlock: {
      title: "Venez vivre la maison",
      cta: "Nous trouver"
    },
    brunchPage: {
      title: "Le brunch signature",
      intro: "Un rendez-vous gourmand mensuel qui associe pâtisserie française, inspirations nordiques et service attentionné.",
      details: [
        { label: "Cadence", value: "Dates ouvertes à la réservation" },
        { label: "Services", value: "10:45 & 13:00" },
        { label: "Café ouvert", value: "11:00 – 15:00" },
        { label: "Prix", value: "45 € / personne" }
      ],
      steps: [
        "Réservez en ligne en quelques clics",
        "Choisissez votre créneau de 90 minutes",
        "Profitez d'une table élégante et d'un menu complet"
      ],
      note: "Réservation obligatoire. Deux services : 10:45 et 13:00.",
      cta: "Réserver le brunch"
    },
    menuPage: {
      title: "Menu & carte",
      intro: "Une carte pensée avec soin, où pâtisseries fines, saveurs salées et café de spécialité se rencontrent.",
      sections: [
        {
          title: "Sucré",
          description: "Pâtisseries de la maison, réalisées avec exigence et sens du détail.",
          items: [
            { name: "Crème brûlée", detail: "Une crème brûlée classique parfumée à la vanille." },
            { name: "L'amour", detail: "Mousse au chocolat noir, cœur framboise et croustillant aux fruits rouges." },
            { name: "Comme un Snickers", detail: "Mousse au chocolat noir et caramel aux cacahuètes, biscuit au chocolat noir et glaçage au chocolat au lait." },
            { name: "Cœur chocolat vegan", detail: "Une mousse au chocolat avec des éclats de chocolat noir." },
            { name: "Galet de Laponie", detail: "La pâtisserie signature avec des baies de la saison." },
            { name: "Flan parisien", detail: "Parfumé à la vanille de Madagascar et une base de pâte à croissant maison." }
          ]
        },
        {
          title: "Salé",
          description: "Une sélection salée maison, généreuse et soignée.",
          items: [
            { name: "Croque monsieur jambon fromage", detail: "Pain au levain, sauce fromage de Kuusamon Juusto, emmental de Kuusamon Juusto et jambon de qualité." },
            { name: "Croque monsieur à la truffe italienne", detail: "Pain au levain, sauce au fromage de Kuusamon Juusto, emmental de Kuusamon Juusto et sauce à la truffe italienne." },
            { name: "Quiche au jambon", detail: "Jambon et fromage de Kuusamon Juusto, une base de pâte feuilletée fine." },
            { name: "Quiche végétarienne", detail: "Des légumes de saison avec fromage de Kuusamon Juusto, une base de pâte feuilletée fine." },
            { name: "Tarte à l'oignon", detail: "Une tarte végétarienne avec des oignons cuits et pickles, servie avec un aïoli." },
            { name: "Saaristolainen", detail: "Pain noir sans gluten maison, fromage bleu Aura monté avec de la betterave en deux façons." },
            { name: "Croque monsieur sans gluten", detail: "Pain de mie sans gluten, sauce fromage de Kuusamon Juusto, emmental de Kuusamon Juusto et jambon." }
          ]
        },
        {
          title: "Boissons",
          description: "Une carte pensée pour les amateurs de café, où l'espresso et les boissons lactées occupent une place centrale.",
          items: [],
          subsections: [
            {
              title: "Café de spécialité",
              description: "Nos cafés sont préparés avec exigence pour révéler l'équilibre, la texture et les arômes de chaque tasse.",
              items: [
                { name: "Espresso", detail: "" },
                { name: "Double espresso", detail: "" },
                { name: "Americano", detail: "" },
                { name: "Décaféiné", detail: "" }
              ]
            },
            {
              title: "Boissons lactées",
              description: "Des boissons espresso lactées préparées avec soin, dans un esprit gourmand et équilibré.",
              items: [
                { name: "Cappuccino", detail: "" },
                { name: "Latte", detail: "" },
                { name: "Mocha", detail: "" },
                { name: "Latte vanille", detail: "" },
                { name: "Latte caramel", detail: "" }
              ]
            },
            {
              title: "Thés & autres boissons chaudes",
              description: "Une sélection de thés choisis avec soin pour compléter notre univers boissons.",
              items: [
                { name: "Vaste sélection de thés recommandés par Kofeiinikompania", detail: "" },
                { name: "Matcha latte", detail: "" },
                { name: "Chai latte", detail: "" },
                { name: "Chocolat chaud gourmand", detail: "" }
              ]
            },
            {
              title: "Boissons froides",
              description: "Des boissons froides gourmandes et rafraîchissantes, pensées dans le même esprit de qualité.",
              items: [
                { name: "Kinuski", detail: "" },
                { name: "Vanilja-kookos", detail: "" },
                { name: "Minttusuklaa", detail: "" },
                { name: "Mocha", detail: "" },
                { name: "Caramel latte", detail: "" },
                { name: "Vanilja latte", detail: "" }
              ]
            }
          ]
        }
      ]
    },
    cateringPage: {
      title: "Catering & événements",
      intro: "Des créations sur mesure pour vos moments privés ou professionnels, avec un service à la hauteur de votre événement.",
      cards: [
        {
          title: "Commandes spéciales",
          description: "Gâteaux de célébration, pièces montées et pâtisseries personnalisées."
        },
        {
          title: "Événements privés",
          description: "Brunchs intimes, anniversaires, moments d'exception."
        },
        {
          title: "Corporate & hôtels",
          description: "Buffets élégants, pauses café premium, livraison ponctuelle."
        }
      ],
      ctaTitle: "Parlons de votre projet",
      ctaDescription: "Notre équipe vous répond sous 24h avec une proposition raffinée et claire.",
      cta: "Demander un devis"
    },
    aboutPage: {
      title: "Meist?",
      intro: "Kuusamossa sijaitseva ranskalainen kahvila, jossa ranskalainen palvelu ja pohjoiset raaka-aineet kohtaavat.",
      sections: [
        {
          title: "The French Caf?n tarina",
          image: "/images/story-cafe.jpg",
          imageAlt: "Kahvilan l?mmin tunnelma",
          paragraphs: [
            "The French Caf? syntyi yksinkertaisesta mutta kunnianhimoisesta ideasta: luoda Kuusamoon l?mmin, hienostunut talo, jossa leivonnaiset, kahvi ja vieraanvaraisuus muodostavat kokonaisuuden.",
            "Tarina alkaa joulukuussa 2020, er??n? talvip?iv?n? Kuusamossa. Kahvikupin ??rell? ajatuksesta kasvoi v?hitellen ranskalais-suomalaisen pariskunnan el?m?nprojekti. Yli kahden vuoden valmistelun j?lkeen The French Caf? avasi ovensa huhtikuussa 2023 Kuusamon keskustassa.",
            "Alusta asti halusimme rakentaa enemm?n kuin kahvilan: talon, joka heijastaa tapaamme tehd?, vastaanottaa ja luoda. T?m? perusta m??ritt?? yh? The French Caf?n hengen."
          ]
        },
        {
          title: "Moona Mankinen",
          image: "/images/moona.jpg",
          imageAlt: "Moona Mankinen ty?ss??n",
          paragraphs: [
            "Lukion j?lkeen Moona seurasi kutsumustaan ja ryhtyi leivontaopintoihin. H?n l?hti kes?harjoitteluun Nizzaan, jonka piti kest?? kolme kuukautta, mutta matka venyi yli kuudeksi vuodeksi. H?n kouluttautui paikallisessa hotelli- ja ravintola-alan oppilaitoksessa leipuri-kondiittoriksi ja erikoistui j?lkiruokiin.",
            "H?n ty?skenteli useissa ravintoloissa, mukaan lukien arvostetussa Le Negrescossa. Erityisen merkitt?v? kokemus oli Le Chanteclerissa, Michelin-t?hdell? palkitussa fine dining -ravintolassa, jossa h?n kehitti luovuuttaan ja johti p?tisserie-tiimi?. Moona vastaa The French Caf?n keitti?st? ja leivonnaisista."
          ]
        },
        {
          title: "Arthur Bataille",
          image: "/images/Arthur.jpg",
          imageAlt: "Arthur Bataille salissa",
          paragraphs: [
            "Arthur on kotoisin Mardi?sta, Orl?ansin l?helt? Keski-Ranskasta - alueelta, joka tunnetaan linnoistaan, viineist??n ja hedelmist??n. H?n valitsi varhain hotelli- ja ravintola-alan, aloitti keitti?opinnoilla ja huomasi nopeasti, ett? h?nt? kiehtoo erityisesti palvelu ja asiakkaiden kohtaaminen.",
            "H?n muutti my?s Nizzaan ja liittyi Le Negrescoon, ty?skennellen hotellin ravintoloissa, erityisesti Le Chanteclerissa. Siell? ranskalaiset ja suomalaiset polut kohtasivat. Arthur tutustui Suomeen ja Kuusamoon tammikuussa 2019. Paikallinen luonto ja el?m?nrytmi tekiv?t vaikutuksen, ja p??t?s rakentaa el?m? Kuusamoon syntyi. Arthur vastaa salista, juomista ja vastaanotosta The French Caf?ssa."
          ]
        }
      ],
      visionTitle: "Paikan visio",
      vision: [
        "Tavoitteena on kokonaisvaltainen kokemus: huolella paahdettu erikoiskahvi, k?sin tehdyt artesaanileivonnaiset, huomaavainen palvelu ja tila, joka tuntuu elegantilta ja l?mpim?lt?.",
        "Laatu ja paikallisuus ovat kaiken ytimess?. Suosimme paikallisia raaka-aineita ja suomalaisia kumppaneita, mutta pid?mme identiteetin ranskalaisena. The French Caf? on kahden kulttuurin - ranskalaisen ja suomalaisen - liitto."
      ],
      valuesTitle: "Arvomme",
      values: [
        { title: "Tarkkuus", description: "Tarkat ty?vaiheet, hallitut reseptit ja jatkuva laatuun panostaminen." },
        { title: "Vieraanvaraisuus", description: "Aito vastaanotto, huomaavainen palvelu ja l?mmin kokemus." },
        { title: "Paikallisuus", description: "Kuusamoon juurtunut talo, jonka taustalla ovat paikalliset tuottajat." }
      ]
    },
    contactPage: {
      title: "Contact",
      intro: "Tout ce dont vous avez besoin pour nous rendre visite ou nous confier votre prochaine commande.",
      methods: [
        { label: "Téléphone", value: "0504369455" },
        { label: "Email", value: "info@kahvilathefrench.cafe" },
        { label: "Adresse", value: "Kitkantie 2, 93600 Kuusamo, Finlande" }
      ],
      reservationTitle: "Réservation simple",
      reservationDescription: "Réservez une table ou un brunch en quelques clics grâce à notre lien direct."
    },
    footer: {
      description: "Maison de café et pâtisserie française à Kuusamo. Brunch signature, créations artisanales et service délicat.",
      rights: "Tous droits réservés."
    }
  },
  en: {
    seo: {
      title: "The French Café | Premium patisserie & brunch in Kuusamo",
      description: "French artisan patisserie, specialty coffee, and signature brunch in Kuusamo. Reserve a table or plan your catering."
    },
    hero: {
      badge: "Signature house",
      headline: "A signature café & patisserie in Kuusamo",
      subhead: "Fine patisserie, specialty coffee and warm hospitality — a house made for lingering and savoring.",
      primaryCta: "Reserve a table",
      secondaryCta: "Explore the menu",
      imageLabel: "The house",
      imageCaption: "Morning light, fresh pastries, gentle tables.",
      brunchNote: "2nd Sunday · Café open 11:00 – 15:00"
    },
    signature: {
      title: "French craft, Nordic warmth",
      description: "Fine pastries, specialty coffee, light-filled tables — an intimate address to slow down and savor.",
      highlights: [
        "Pastries crafted fresh every morning",
        "Carefully sourced specialty coffee",
        "Signature brunch in limited seating",
        "Warm, refined hospitality"
      ]
    },
    now: {
      title: "Right now",
      subtitle: "Seasonal moments to savor",
      items: [
        { label: "Signature brunch", value: "Open booking dates · 10:45 & 13:00" },
        { label: "Café open", value: "11:00 – 15:00 that Sunday" },
        { label: "Coffee ritual", value: "Happy hours on Friday" }
      ]
    },
    offers: {
      title: "House essentials",
      cards: [
        {
          title: "Fine patisserie",
          description: "Seasonal entremets, éclairs and elegant tarts with a refined finish.",
          highlights: ["Daily selection", "Premium ingredients", "Airy textures"]
        },
        {
          title: "Signature brunch",
          description: "A monthly ritual with French and Nordic accents, served with grace.",
          highlights: ["Tasting menu", "Limited seats", "Smooth booking"]
        },
        {
          title: "Coffee & beverages",
          description: "Carefully crafted espressos, lattes and premium infusions.",
          highlights: ["Nordic roast", "Nordic dairy", "Precise service"]
        },
        {
          title: "Catering & orders",
          description: "Custom pastries and refined buffets for your events.",
          highlights: ["Made-to-measure", "Delivery possible", "Dedicated advice"]
        }
      ]
    },
    proof: {
      title: "Recognized for its craftsmanship",
      quotes: [
        "Ranked among the best artisan patisseries in Northern Finland.",
        "Rated 4.9/5 for hospitality and refined creations.",
        "Selected by Kuusamo Lifestyle for its signature brunch."
      ]
    },
    contactBlock: {
      title: "Visit the house",
      cta: "Find us"
    },
    brunchPage: {
      title: "Signature brunch",
      intro: "A monthly gourmet rendez-vous blending French pastry, Nordic inspiration and attentive service.",
      details: [
        { label: "Cadence", value: "Open booking dates" },
        { label: "Seatings", value: "10:45 & 13:00" },
        { label: "Café open", value: "11:00 – 15:00" },
        { label: "Price", value: "€45 per guest" }
      ],
      steps: [
        "Book online in a few clicks",
        "Choose your 90-minute seating",
        "Enjoy a refined table and full menu"
      ],
      note: "Reservations required. Two seatings: 10:45 and 13:00.",
      cta: "Book the brunch"
    },
    menuPage: {
      title: "Menu",
      intro: "A carefully curated selection where fine pastries, savoury dishes and specialty coffee meet.",
      sections: [
        {
          title: "Sweet",
          description: "House-made pastries crafted with precision and attention to detail.",
          items: [
            { name: "Crème brûlée", detail: "A classic vanilla-infused crème brûlée." },
            { name: "L'Amour", detail: "Dark chocolate mousse, raspberry heart and red fruit crisp." },
            { name: "Like a Snickers", detail: "Dark chocolate and peanut caramel mousse, dark chocolate biscuit and milk chocolate glaze." },
            { name: "Vegan chocolate heart", detail: "Chocolate mousse with dark chocolate chunks." },
            { name: "Lapland pebble", detail: "Our signature pastry with seasonal berries." },
            { name: "Parisian flan", detail: "Flavoured with Madagascar vanilla on a house-made croissant dough base." }
          ]
        },
        {
          title: "Savory",
          description: "A generous and refined selection of house-made savoury dishes.",
          items: [
            { name: "Ham & cheese croque monsieur", detail: "Sourdough bread, Kuusamon Juusto cheese sauce, Kuusamon Juusto emmental and quality ham." },
            { name: "Italian truffle croque monsieur", detail: "Sourdough bread, Kuusamon Juusto cheese sauce, Kuusamon Juusto emmental and Italian truffle sauce." },
            { name: "Ham quiche", detail: "Ham and Kuusamon Juusto cheese on a fine puff pastry base." },
            { name: "Vegetarian quiche", detail: "Seasonal vegetables with Kuusamon Juusto cheese on a fine puff pastry base." },
            { name: "Onion tart", detail: "A vegetarian tart with cooked onions and pickles, served with aioli." },
            { name: "Saaristolainen", detail: "House-made gluten-free dark bread, whipped Aura blue cheese with beetroot two ways." },
            { name: "Gluten-free croque monsieur", detail: "Gluten-free bread, Kuusamon Juusto cheese sauce, Kuusamon Juusto emmental and ham." }
          ]
        },
        {
          title: "Drinks",
          description: "A menu designed for coffee lovers, where espresso and milk-based drinks take centre stage.",
          items: [],
          subsections: [
            {
              title: "Specialty coffee",
              description: "Our coffees are prepared with precision to reveal the balance, texture and aromas of every cup.",
              items: [
                { name: "Espresso", detail: "" },
                { name: "Double espresso", detail: "" },
                { name: "Americano", detail: "" },
                { name: "Decaf", detail: "" }
              ]
            },
            {
              title: "Milk-based drinks",
              description: "Espresso and milk drinks prepared with care in a gourmet yet balanced spirit.",
              items: [
                { name: "Cappuccino", detail: "" },
                { name: "Latte", detail: "" },
                { name: "Mocha", detail: "" },
                { name: "Vanilla latte", detail: "" },
                { name: "Caramel latte", detail: "" }
              ]
            },
            {
              title: "Teas & other hot drinks",
              description: "A thoughtful selection of teas to complement our drinks menu.",
              items: [
                { name: "Wide selection of teas recommended by Kofeiinikompania", detail: "" },
                { name: "Matcha latte", detail: "" },
                { name: "Chai latte", detail: "" },
                { name: "Gourmet hot chocolate", detail: "" }
              ]
            },
            {
              title: "Cold drinks",
              description: "Refreshing gourmet cold drinks crafted with the same quality spirit.",
              items: [
                { name: "Kinuski", detail: "" },
                { name: "Vanilja-kookos", detail: "" },
                { name: "Minttusuklaa", detail: "" },
                { name: "Mocha", detail: "" },
                { name: "Caramel latte", detail: "" },
                { name: "Vanilja latte", detail: "" }
              ]
            }
          ]
        }
      ]
    },
    cateringPage: {
      title: "Catering & events",
      intro: "Tailored creations for private or professional occasions with service worthy of your gathering.",
      cards: [
        {
          title: "Special orders",
          description: "Celebration cakes, croquembouche and bespoke pastries."
        },
        {
          title: "Private events",
          description: "Intimate brunches, anniversaries, meaningful moments."
        },
        {
          title: "Corporate & hotels",
          description: "Elegant buffets, premium coffee breaks, punctual delivery."
        }
      ],
      ctaTitle: "Let's craft your event",
      ctaDescription: "We reply within 24h with a clear, refined proposal.",
      cta: "Request a proposal"
    },
    aboutPage: {
      title: "About",
      intro: "A house born in Kuusamo, where French precision meets Nordic softness.",
      sections: [
        {
          title: "The story of The French Café",
          image: "/images/story-cafe.jpg",
          imageAlt: "Café interior with morning light",
          paragraphs: [
            "The French Café was born from a simple yet ambitious idea: create in Kuusamo a warm, refined house where pastry, coffee, and hospitality form a true experience.",
            "The story begins in December 2020 on a winter day in Kuusamo. Over a cup of coffee, an intuition grew into a life project for a Franco-Finnish couple. After more than two years of preparation, The French Café opened its doors in April 2023 in the heart of Kuusamo.",
            "From the beginning, we wanted more than a café. We wanted a house that reflects how we work, welcome, and create. The project demanded vision, perseverance, and a true attention to detail — the foundation that still shapes The French Café today."
          ]
        },
        {
          title: "Moona Mankinen",
          image: "/images/moona.jpg",
          imageAlt: "Moona Mankinen in the pastry kitchen",
          paragraphs: [
            "After high school, Moona chose to follow her vocation and become a pastry chef. Curious and passionate about other cultures, she completed a summer internship in Nice, in the south of France. What was meant to be three months became more than six years. She trained in a local hospitality school as a baker-pastry chef, then specialized as a pastry chef de partie.",
            "Over the years, she gained solid experience across several establishments, including the prestigious Le Negresco in Nice. She held multiple positions, notably within Le Chantecler, a Michelin‑starred restaurant, where she developed her creativity and led a pastry team. Today, Moona is at the heart of the kitchen and pastry work at The French Café."
          ]
        },
        {
          title: "Arthur Bataille",
          image: "/images/Arthur.jpg",
          imageAlt: "Arthur Bataille welcoming guests",
          paragraphs: [
            "Arthur is from Mardié near Orléans in central France, a region known for its châteaux, wines, and fruits. He chose hospitality early, first training in the kitchen before realizing his passion lay in service, dining room life, and human connection. He continued his studies in restaurant service.",
            "He also moved to Nice and joined Le Negresco, working in several of the hotel’s restaurants, including the fine‑dining Le Chantecler. It was there that French and Finnish paths crossed. Arthur discovered Finland and Kuusamo in January 2019, drawn by the rhythm of life and the surrounding nature. Today, he leads the welcome, dining room service, and beverages at The French Café."
          ]
        }
      ],
      visionTitle: "Our vision of the house",
      vision: [
        "Our ambition is to offer a complete experience: carefully roasted coffee by micro‑roasters, attentive service, artisanal pastries made by hand with French techniques, and a space that feels elegant, warm, and welcoming.",
        "Quality and locality are central. We seek to work with local ingredients and Finnish producers while cultivating a French‑inspired identity. The French Café is, at its core, the union of two cultures."
      ],
      valuesTitle: "Our values",
      values: [
        { title: "High standards", description: "Precise gestures, mastered recipes, constant attention to quality." },
        { title: "Hospitality", description: "Sincere welcome, attentive service, and a warm experience." },
        { title: "Local roots", description: "A house in Kuusamo, shaped by local producers and its surroundings." }
      ]
    },
    contactPage: {
      title: "Contact",
      intro: "Everything you need to visit us or plan your next order.",
      methods: [
        { label: "Phone", value: "0504369455" },
        { label: "Email", value: "info@kahvilathefrench.cafe" },
        { label: "Address", value: "Kitkantie 2, 93600 Kuusamo, Finland" }
      ],
      reservationTitle: "Easy reservations",
      reservationDescription: "Reserve a table or brunch instantly via our direct link."
    },
    footer: {
      description: "A French café and patisserie house in Kuusamo. Signature brunch, artisanal creations and gentle service.",
      rights: "All rights reserved."
    }
  },
  fi: {
    seo: {
      title: "The French Café | Premium-leipomo & brunssi Kuusamossa",
      description: "Ranskalainen artesaanileipomo, erikoiskahvi ja signature-brunssi Kuusamossa. Varaa pöytä tai catering-palvelu."
    },
    hero: {
      badge: "Ranskalainen kahvila",
      headline: "Ranskalainen kahvila ja pâtisserie Kuusamossa",
      subhead: "Herkulliset, käsityönä valmistetut leivokset, erikoiskahvit ja lämmin tunnelma - kahvila, missä viihdytään.",
      primaryCta: "Varaa pöytä",
      secondaryCta: "Tutustu menuun",
      imageLabel: "Notre maison",
      imageCaption: "Aamun valo, tuoreet leivonnaiset, lempeä tila.",
      brunchNote: "Kuukauden 2. sunnuntai · Kahvila avoinna 11:00 – 15:00"
    },
    signature: {
      title: "Ranskalaiset tekniikat, käsityö ja paikalliset maut",
      description: "Herkulliset leivonnaiset, erikoiskahvit ja kaunis kahvilamiljöö – täydellinen paikka nautiskelulle.",
      highlights: [
        "Leivonnaiset leivotaan joka aamu",
        "Huolella valittu papu",
        "Talon signature-brunssi pöytävarauksella",
        "Lämminhenkinen asiakaspalvelu"
      ]
    },
    now: {
      title: "Nyt",
      subtitle: "Tämänhetkiset nautinnot",
      items: [
        { label: "Signature-brunssi", value: "Avoimet varauspäivät · 10:45 & 13:00" },
        { label: "Kahvila auki", value: "11:00 – 15:00 sinä päivänä" },
        { label: "Tapahtumat", value: "Happy hours perjantaisin" }
      ]
    },
    offers: {
      title: "Talon herkullisimmat elämykset",
      cards: [
        {
          title: "Pâtisserie",
          description: "Sesonkileivokset, kakut ja macaronsit.",
          highlights: ["Päivittäinen valikoima", "Laadukkaat raaka-aineet", "Moniulotteisia tekstuureja"]
        },
        {
          title: "Signature-brunssi",
          description: "Kuukausittainen rituaali ranskalais-nordic-twistillä.",
          highlights: ["Vaihtuva brunssimenu", "Rajoitetusti paikkoja", "Helppo varaus"]
        },
        {
          title: "Kahvi & juomat",
          description: "Huolella valmistetut espressot, latet ja teet.",
          highlights: ["Lahtelaisen pienpaahtimo papu", "Kotimainen maito", "Pöytiintarjoilu"]
        },
        {
          title: "Catering & tilaukset",
          description: "Räätälöidyt tuotteet asiakkaan toiveiden mukaisesti toteutettuna.",
          highlights: ["Räätälöidyt tuotteet", "Toimitus", "Asiantunteva palvelu"]
        }
      ]
    },
    proof: {
      title: "Tunnustusta laadusta",
      quotes: [
        "Kuusamon parhaiden konditorioiden joukossa.",
        "Arvio 4,9/5 palvelun ja makujen tasapainosta.",
        "Kuusamo Lifestyle- lehden suosittelema brunssimme."
      ]
    },
    contactBlock: {
      title: "Tervetuloa taloon",
      cta: "Löydä meidät"
    },
    brunchPage: {
      title: "Signature-brunssi",
      intro: "Kuukausittainen gourmet-kohtaaminen ranskalaisella ja pohjoismaisella vivahteella.",
      details: [
        { label: "Ajankohta", value: "Avoimet varauspäivät" },
        { label: "Kattaukset", value: "10:45 & 13:00" },
        { label: "Kahvila palvelee", value: "11:00 – 15:00" },
        { label: "Hinta", value: "45 € / henkilö" }
      ],
      steps: [
        "Varaa verkossa muutamassa klikkauksessa",
        "Valitse 90 minuutin istunto",
        "Nauti tyylikkäästä pöydästä ja kokonaismenuusta"
      ],
      note: "Vain pöytävarauksella. Kaksi kattausta: 10:45 ja 13:00.",
      cta: "Varaa brunssi"
    },
    menuPage: {
      title: "Menu",
      intro: "Rakkaudella luotu valikoima käsinvalmistettuja tuotteita aina suolaisista ja makeista konditoriatuotteista erikoiskahveihin.",
      sections: [
        {
          title: "Makeat",
          description: "Talossa rakkaudella valmistetut leivokset.",
          items: [
            { name: "Crème brûlée", detail: "Klassinen vaniljalla maustettu crème brûlée." },
            { name: "L'Amour", detail: "Tumma suklaamousse, vadelmasydän ja punaiset marjat crispy." },
            { name: "Kuin Snickers", detail: "Tumma suklaa- ja maapähkinäkaramellimousse, tumman suklaan keksi ja maitosuklaakuorrute." },
            { name: "Vegaaninen suklaasydän", detail: "Suklaamousse tumman suklaan paloilla." },
            { name: "Lapin kivi", detail: "Talon signature-leivonnainen kauden marjoilla." },
            { name: "Pariisilainen flan", detail: "Madagaskarin vaniljalla maustettu talon croissant-taikinapohjalla." }
          ]
        },
        {
          title: "Suolaiset",
          description: "Runsas ja hienostunut valikoima talon suolaisia herkkuja.",
          items: [
            { name: "Croque Monsieur kinkulla ja juustolla", detail: "Juurileipä, Kuusamon Juuston juustokastike, Kuusamon Juuston emmental ja laadukas kinkku." },
            { name: "Croque Monsieur italialaisella tryffelillä ja Mustaleimalla", detail: "Juurileipä, Kuusamon Juuston juustokastike, Kuusamon Juuston emmental ja italialainen tryffelikastike." },
            { name: "Quiche kinkulla", detail: "Kinkku ja Kuusamon Juuston juusto ohuella voitaikinapohjalla." },
            { name: "Quiche sesongin kasviksilla", detail: "Kauden kasvikset Kuusamon Juuston juustolla ohuella voitaikinapohjalla." },
            { name: "Sipulipiiras", detail: "Kasvispiirakka kypsennettyjä sipuleita ja pickles, tarjoillaan aiolin kera." },
            { name: "Ranskalainen saaristolainen", detail: "Talon gluteeniton tumma leipä, vatkattu Aura sinihomejuusto punajuurella kahdella tavalla." },
            { name: "Croque Monsieur gluteenittomana", detail: "Gluteeniton leipä, Kuusamon Juuston juustokastike, Kuusamon Juuston emmental ja kinkku." }
          ]
        },
        {
          title: "Juomat",
          description: "Kahvin ystäville suunniteltu menu, jossa espresso ja maitopohjaiset juomat ovat keskiössä.",
          items: [],
          subsections: [
            {
              title: "Erikoiskahvit",
              description: "Kahvimme valmistetaan tarkkuudella jokaisen kupin tasapainon, rakenteen ja aromien paljastamiseksi.",
              items: [
                { name: "Espresso", detail: "" },
                { name: "Tuplaespresso", detail: "" },
                { name: "Americano", detail: "" },
                { name: "Kofeiiniton", detail: "" }
              ]
            },
            {
              title: "Maitopohjaiset juomat",
              description: "Rakkaudella valmistetut maitokahvit.",
              items: [
                { name: "Cappuccino", detail: "" },
                { name: "Latte", detail: "" },
                { name: "Mocha", detail: "" },
                { name: "Vaniljalatte", detail: "" },
                { name: "Caramel-latte", detail: "" }
              ]
            },
            {
              title: "Teet & muut kuumat juomat",
              description: "Huolellisesti valittu valikoima teetä täydentämään juomavalikoimaamme.",
              items: [
                { name: "Laaja teelista Kofeiinikomppanian suosittelemana.", detail: "" },
                { name: "Matcha latte", detail: "" },
                { name: "Chai latte", detail: "" },
                { name: "Talon herkkukaakao", detail: "" }
              ]
            },
            {
              title: "Kylmät juomat",
              description: "Raikkaat kylmät juomat.",
              items: [
                { name: "Kinuskipirtelö", detail: "" },
                { name: "Vanilja-kookospirtelö", detail: "" },
                { name: "Minttusuklaapirtelö", detail: "" },
                { name: "Mocha", detail: "" },
                { name: "Caramel-latte", detail: "" },
                { name: "Vaniljalatte", detail: "" }
              ]
            }
          ]
        }
      ]
    },
    cateringPage: {
      title: "Catering & tapahtumat",
      intro: "Räätälöidyt luomukset yksityisiin tai ammatillisiin tilaisuuksiin.",
      cards: [
        {
          title: "Erikoistilaukset",
          description: "Juhlakakut, croquembouche ja personoidut leivonnaiset."
        },
        {
          title: "Yksityistilaisuudet",
          description: "Intiimit brunssit, merkkipäivät, tärkeät hetket."
        },
        {
          title: "Corporate & hotellit",
          description: "Tyylikkäät buffetit, premium-kahvitauot, toimitus ajallaan."
        }
      ],
      ctaTitle: "Suunnitellaan yhdessä",
      ctaDescription: "Vastaamme 24 tunnin sisällä selkeällä, hienostuneella ehdotuksella.",
      cta: "Pyydä tarjous"
    },
    aboutPage: {
      title: "Meistä",
      intro: "Kuusamossa sijaitseva ranskalainen kahvila, jossa ranskalainen palvelu ja pohjoiset raaka-aineet kohtaavat.",
      sections: [
        {
          title: "The French Cafén tarina",
          image: "/images/story-cafe.jpg",
          imageAlt: "Kahvilan lämmin tunnelma",
          paragraphs: [
            "The French Café syntyi yksinkertaisesta mutta kunnianhimoisesta ideasta: luoda Kuusamoon lämminhenkinen ja hienostunut kahvila-konditoria, jossa leivonnaiset, kahvi ja vieraanvaraisuus muodostavat lähtemättömän kahvilakokemuksen.",
            "Tarinamme alkoi eräänä talvisena päivänä tammikuussa 2020. Kahvikupin äärellä ilmaan kuiskatusta ajatuksesta kasvoi vähitellen ranskalais‑suomalaisen pariskunnan elämänprojekti. Yli kahden vuoden valmistelun jälkeen The French Café avasi ovensa huhtikuussa 2023 Kuusamon keskustassa.",
            "Alusta asti tavoitteenamme oli rakentaa enemmän kuin vain kahvila: paikka, joka heijastaa tapaamme tehdä, palvella ja luoda. Tämä perusta määrittää yhä The French Cafén hengen."
          ]
        },
        {
          title: "Moona Mankinen",
          image: "/images/moona.jpg",
          imageAlt: "Moona Mankinen työssään",
          paragraphs: [
            "Lukion jälkeen Moona seurasi kutsumustaan ja ryhtyi leivontaopintoihin. Hän lähti kesäharjoitteluun Nizzaan, jonka piti kestää kolme kuukautta, mutta matka venyi yli kuudeksi vuodeksi. Moona kouluttautui paikallisessa hotelli‑ ja ravintola‑alan oppilaitoksessa leipuri‑kondiittoriksi ja erikoistui myöhemmin työn ohessa ravintolan jälkiruokiin.",
            "Moona työskenteli useissa ravintoloissa ja leipomossa, mukaan lukien arvostetussa Le Negresco-palatsissa. Erityisen merkittävä kokemus oli kyseisen luksushotellin Le Chantecler-niminen, kahdella Michelin‑tähdellä palkittu fine dining ‑ravintola, jossa hän oppi ja kehitti luovuuttaan sekä myöhemmin johti pâtisserie-tiimiä. Moona vastaa The French Cafén keittiöstä ja konditoriatuotteista."
          ]
        },
        {
          title: "Arthur Bataille",
          image: "/images/Arthur.jpg",
          imageAlt: "Arthur Bataille salissa",
          paragraphs: [
            "Arthur on kotoisin Mardiésta, Orléansin esikaupunkialueelta Keski‑Ranskasta — alueelta, joka tunnetaan linnoistaan, viineistään ja hedelmistään. Arthur valitsi varhain hotelli‑ ja ravintola‑alan, aloitti keittiöopinnoilla ja huomasi nopeasti, että häntä kiehtoo erityisesti palvelu ja asiakkaiden kohtaaminen.",
            "Arthur muutti Nizzaan ja pääsi Le Negrescoon töihin. Arthur työskenteli salin puolella asiakaspalvelussa hotellin eri ravintoloissa, erityisesti Le Chanteclerissa. Siellä ranskalaiset ja suomalaiset polut kohtasivat. Arthur tutustui Suomeen ja Kuusamoon ensimmäisen kerran tammikuussa 2019. Paikallinen luonto ja elämänrytmi tekivät vaikutuksen, ja päätös rakentaa elämä Kuusamoon syntyi vähitellen. Arthur vastaa asiakaspalvelusta ja tarjoilusta sekä juomien valmistuksesta The French Caféssa."
          ]
        }
      ],
      visionTitle: "Visiomme",
      vision: [
        "Tavoitteenamme on luoda kokonaisvaltainen ja uniikki kahvilakokemus: huolella paahdettu erikoiskahvi, käsityönä valmistetut konditoriatuotteet, lämminhenkinen palvelu ja kaunis kahvilamiljöö.",
        "Laatu ja paikallisuus ovat kaiken ytimessä. Suosimme paikallisia raaka‑aineita ja suomalaisia kumppaneita, mutta pidämme identiteetin ranskalaisena. The French Café on kahden kulttuurin — ranskalaisen ja suomalaisen — liitto."
      ],
      valuesTitle: "Arvomme",
      values: [
        { title: "Tarkkuus", description: "Ammattitaito, huolella kehitetyt reseptit ja jatkuva laatuun panostaminen ovat meille tärkeää." },
        { title: "Vieraanvaraisuus", description: "Lämmin vastaanotto ja asiakaspalvelu luovat kokonaisvaltaisen kahvilakokemuksen." },
        { title: "Paikallisuus", description: "Kuusamon helmet, kuten marjat, kala ja juustot ovat lähellä sydäntämme. Siksi pyrimmekin tukemaan paikallista elintarviketuotantoa- ja taloutta mahdollisimman paljon hyödyntämällä lähellä tuotettua." }
      ]
    },
    contactPage: {
      title: "Yhteystietomme",
      intro: "Täältä löydät yhteystietomme, olitpa sitten tulossa kahville tai tilaamaan herkkuja kotiin.",
      methods: [
        { label: "Puhelin", value: "+358(0)504369455" },
        { label: "Sähköposti", value: "info@kahvilathefrench.cafe" },
        { label: "Osoite", value: "Kitkantie 2, 93600 Kuusamo" }
      ],
      reservationTitle: "Pöytävaraukset",
      reservationDescription: "Varaa brunssi suoraa linkkimme kautta."
    },
    footer: {
      description: "Ranskalainen kahvila ja pâtisserie Kuusamossa. Signature-brunssi, artesaaniluomukset ja lämmin asiakaspalvelu.",
      rights: "Kaikki oikeudet pidätetään."
    }
  }
};
