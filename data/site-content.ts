export type Locale = "fr" | "en" | "fi";

export const locales: Locale[] = ["fr", "en", "fi"];
export const defaultLocale: Locale = "fr";

export const siteSettings = {
  name: "The French Café",
  location: "Kuusamo, Finlande",
  siteUrl: "https://kahvilathefrench.cafe",
  address: "Kitkantie 2, 93600 Kuusamo, Finlande",
  phone: "0504369455",
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
    hours: "10:45 & 12:45",
    price: "45 € / personne",
    reservationNote: "Réservation obligatoire. Deux services : 10:45 et 12:45."
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
    title: "Printemps gourmand",
    description: "Collection de pâtisseries aux agrumes nordiques et vanille de Madagascar."
  },
  en: {
    title: "Spring collection",
    description: "Seasonal pastries with Nordic citrus and Madagascar vanilla."
  },
  fi: {
    title: "Kevätkokoelma",
    description: "Kausileivonnaiset pohjoisilla sitruksilla ja Madagaskarin vaniljalla."
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
    { label: "Yhteys", href: `/fi/${localizedRoutes.contact.fi}` }
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
        { label: "Brunch signature", value: "2e dimanche · 10:45 & 12:45" },
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
        { label: "Cadence", value: "2e dimanche du mois" },
        { label: "Services", value: "10:45 & 12:45" },
        { label: "Café ouvert", value: "11:00 – 15:00" },
        { label: "Prix", value: "45 € / personne" }
      ],
      steps: [
        "Réservez en ligne en quelques clics",
        "Choisissez votre créneau de 90 minutes",
        "Profitez d'une table élégante et d'un menu complet"
      ],
      note: "Réservation obligatoire. Deux services : 10:45 et 12:45.",
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
      title: "À propos",
      intro: "Une maison née à Kuusamo, entre précision française et douceur nordique.",
      sections: [
        {
          title: "L’histoire de The French Café",
          image: "/images/story-cafe.jpg",
          imageAlt: "Intérieur du café avec lumière douce et pâtisseries",
          paragraphs: [
            "The French Café est né d’une idée simple, mais profondément ambitieuse : créer à Kuusamo un lieu chaleureux, raffiné et vivant, où la pâtisserie, le café et l’accueil seraient pensés comme une véritable expérience.",
            "L’histoire commence en décembre 2020, lors d’une journée d’hiver à Kuusamo. Autour d’une tasse de café chaud, une idée lancée presque spontanément commence peu à peu à prendre de l’ampleur, jusqu’à devenir le grand projet de vie d’un couple d’entrepreneurs franco-finlandais. Après plus de deux années de préparation, The French Café ouvre finalement ses portes en avril 2023, au cœur de Kuusamo.",
            "Dès le départ, nous avons voulu construire bien plus qu’un café. Nous voulions donner naissance à une maison qui reflète notre manière de travailler, de recevoir et de créer. Ce projet a demandé de la vision, de la persévérance, du travail et une vraie exigence dans chaque détail. C’est cette base qui définit encore aujourd’hui l’âme de The French Café."
          ]
        },
        {
          title: "Moona Mankinen",
          image: "/images/moona.jpg",
          imageAlt: "Moona Mankinen en cuisine",
          paragraphs: [
            "Après le lycée, Moona décide de suivre sa vocation et de devenir pâtissière. Curieuse, aventureuse et passionnée par les autres cultures, elle part effectuer un stage d’été à Nice, dans le sud de la France. Ce qui devait être un séjour de trois mois se transforme finalement en une aventure de plus de six ans. Sur place, elle se forme dans une école locale d’hôtellerie-restauration comme boulangère-pâtissière, puis se spécialise ensuite comme cheffe de partie desserts.",
            "Au fil des années, elle acquiert une expérience solide dans différents établissements, avec un passage marquant au prestigieux hôtel Le Negresco à Nice. Elle y occupe plusieurs fonctions, notamment au sein du restaurant gastronomique Le Chantecler, récompensé par une étoile Michelin, où elle peut développer sa créativité et encadrer une équipe de pâtissiers. Cette expérience a profondément façonné son regard sur l’exigence, la précision technique et la qualité du geste. Aujourd’hui, Moona est au cœur de la cuisine et de la pâtisserie de The French Café."
          ]
        },
        {
          title: "Arthur Bataille",
          image: "/images/Arthur.jpg",
          imageAlt: "Arthur Bataille en salle",
          paragraphs: [
            "Arthur est originaire de Mardié, près d’Orléans, dans le centre de la France, une région connue pour ses châteaux, ses vins et ses fruits. Très tôt, il choisit la voie de l’hôtellerie-restauration. Il commence d’abord par une formation de cuisine, avant de réaliser que ce sont surtout les échanges humains, la salle et le service qui le passionnent. Après son diplôme, il poursuit donc sa formation dans le service en restauration.",
            "Lui aussi part ensuite à Nice, où il rejoint le Negresco. Il travaille comme serveur dans plusieurs restaurants de l’hôtel, avec une expérience particulièrement marquante au Chantecler, restaurant gastronomique tourné vers le fine dining. C’est là que les parcours français et finlandais se croisent. Arthur découvre la Finlande puis Kuusamo en janvier 2019. Il y trouve un rythme de vie, une nature et une atmosphère qui le touchent profondément. Pour lui, le choix de construire une nouvelle vie à Kuusamo et d’y ouvrir un café devient alors une évidence. Aujourd’hui, il veille à l’accueil, au service en salle et à l’univers des boissons au sein de The French Café."
          ]
        }
      ],
      visionTitle: "Notre vision du lieu",
      vision: [
        "Notre ambition est d’offrir une expérience complète : un café soigneusement torréfié par des micro-torréfacteurs, un service attentionné, des pâtisseries réalisées à la main selon des techniques françaises, et un lieu à la fois élégant, chaleureux et accueillant.",
        "Nous accordons une place centrale à la qualité et à la localité. Nous cherchons à travailler avec des matières premières produites localement, ainsi qu’avec des producteurs et produits finlandais, tout en cultivant une identité inspirée par la France. The French Café est, au fond, l’union de deux cultures."
      ],
      valuesTitle: "Nos valeurs",
      values: [
        { title: "Exigence", description: "Des gestes précis, des recettes maîtrisées, une attention constante portée à la qualité." },
        { title: "Hospitalité", description: "Un accueil sincère, un service attentionné et une expérience chaleureuse." },
        { title: "Ancrage local", description: "Une maison installée à Kuusamo, nourrie par la qualité des producteurs et de son environnement." }
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
        { label: "Signature brunch", value: "2nd Sunday · 10:45 & 12:45" },
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
        { label: "Cadence", value: "Every 2nd Sunday" },
        { label: "Seatings", value: "10:45 & 12:45" },
        { label: "Café open", value: "11:00 – 15:00" },
        { label: "Price", value: "€45 per guest" }
      ],
      steps: [
        "Book online in a few clicks",
        "Choose your 90-minute seating",
        "Enjoy a refined table and full menu"
      ],
      note: "Reservations required. Two seatings: 10:45 and 12:45.",
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
      badge: "Signature-talo",
      headline: "Signature-kahvila ja patisserie Kuusamossa",
      subhead: "Hienot leivonnaiset, erikoiskahvi ja lämmin vieraanvaraisuus — talo, jossa viihdytään.",
      primaryCta: "Varaa pöytä",
      secondaryCta: "Tutustu menuun",
      imageLabel: "Talo",
      imageCaption: "Aamun valo, tuoreet leivonnaiset, lempeä tila.",
      brunchNote: "Kuukauden 2. sunnuntai · Kahvila auki 11:00 – 15:00"
    },
    signature: {
      title: "Ranskalainen käsityö, pohjoinen lämpö",
      description: "Hienot leivonnaiset, erikoiskahvi ja valoisa tunnelma – intiimi paikka hengähtää.",
      highlights: [
        "Leivonnaiset leivotaan joka aamu",
        "Huolella valittu erikoiskahvi",
        "Signature-brunssi rajatuilla paikoilla",
        "Lämmin, hienostunut palvelu"
      ]
    },
    now: {
      title: "Nyt",
      subtitle: "Kauden hetket nautittavaksi",
      items: [
        { label: "Signature-brunssi", value: "Kuukauden 2. sunnuntai · 10:45 & 12:45" },
        { label: "Kahvila auki", value: "11:00 – 15:00 sinä päivänä" },
        { label: "Kahvihetki", value: "Happy hours perjantaisin" }
      ]
    },
    offers: {
      title: "Talon tärkeimmät elämykset",
      cards: [
        {
          title: "Patisserie",
          description: "Sesonkiset entremet, éclairit ja elegantit tortut.",
          highlights: ["Päivittäinen valikoima", "Premium-raaka-aineet", "Kevyet tekstuurit"]
        },
        {
          title: "Signature-brunssi",
          description: "Kuukausittainen rituaali ranskalais-nordic-twistillä.",
          highlights: ["Maistelumenu", "Rajoitetut paikat", "Helppo varaus"]
        },
        {
          title: "Kahvi & juomat",
          description: "Huolella tehdyt espressot, latet ja premium-haudukkeet.",
          highlights: ["Lahdesta paahto", "Pohjoinen maito", "Tarkka palvelu"]
        },
        {
          title: "Catering & tilaukset",
          description: "Räätälöidyt leivonnaiset ja viimeistellyt kattaukset.",
          highlights: ["Räätälöitävä", "Toimitus", "Oma yhteyshenkilö"]
        }
      ]
    },
    proof: {
      title: "Tunnustettu laadustaan",
      quotes: [
        "Kuusamon parhaiden artesaanileipomoiden joukossa.",
        "Arvio 4,9/5 palvelun ja makujen hienostuneisuudesta.",
        "Kuusamo Lifestyle -valinta signature-brunssista."
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
        { label: "Rytmi", value: "Kuukauden 2. sunnuntai" },
        { label: "Istunnot", value: "10:45 & 12:45" },
        { label: "Kahvila auki", value: "11:00 – 15:00" },
        { label: "Hinta", value: "45 € / henkilö" }
      ],
      steps: [
        "Varaa verkossa muutamassa klikkauksessa",
        "Valitse 90 minuutin istunto",
        "Nauti tyylikkäästä pöydästä ja kokonaismenuusta"
      ],
      note: "Varaus pakollinen. Kaksi kattausta: 10:45 ja 12:45.",
      cta: "Varaa brunssi"
    },
    menuPage: {
      title: "Menu",
      intro: "Huolellisesti kuratoitu valikoima, jossa hienot leivonnaiset, suolaiset herkut ja erikoiskahvi kohtaavat.",
      sections: [
        {
          title: "Makea",
          description: "Talon leivonnaiset, jotka valmistetaan tarkkuudella ja huolella.",
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
          title: "Suolainen",
          description: "Runsas ja hienostunut valikoima talon suolaisia herkkuja.",
          items: [
            { name: "Kinkku-juustocroque monsieur", detail: "Juurileipä, Kuusamon Juuston juustokastike, Kuusamon Juuston emmental ja laadukas kinkku." },
            { name: "Italialainen tryffelicroque monsieur", detail: "Juurileipä, Kuusamon Juuston juustokastike, Kuusamon Juuston emmental ja italialainen tryffelikastike." },
            { name: "Kinkkuquiche", detail: "Kinkku ja Kuusamon Juuston juusto ohuella voitaikinapohjalla." },
            { name: "Kasvisquiche", detail: "Kauden kasvikset Kuusamon Juuston juustolla ohuella voitaikinapohjalla." },
            { name: "Sipulipiirakka", detail: "Kasvispiirakka kypsennettyjä sipuleita ja pickles, tarjoillaan aiolin kera." },
            { name: "Saaristolainen", detail: "Talon gluteeniton tumma leipä, vatkattu Aura sinihomejuusto punajuurella kahdella tavalla." },
            { name: "Gluteeniton croque monsieur", detail: "Gluteeniton leipä, Kuusamon Juuston juustokastike, Kuusamon Juuston emmental ja kinkku." }
          ]
        },
        {
          title: "Juomat",
          description: "Kahvin ystäville suunniteltu menu, jossa espresso ja maitopohjaiset juomat ovat keskiössä.",
          items: [],
          subsections: [
            {
              title: "Erikoiskahvi",
              description: "Kahvimme valmistetaan tarkkuudella jokaisen kupin tasapainon, rakenteen ja aromien paljastamiseksi.",
              items: [
                { name: "Espresso", detail: "" },
                { name: "Double espresso", detail: "" },
                { name: "Americano", detail: "" },
                { name: "Kofeiiniton", detail: "" }
              ]
            },
            {
              title: "Maitopohjaiset juomat",
              description: "Huolella valmistetut espresso-maitojuomat gourmet-henkisessä ja tasapainoisessa hengessä.",
              items: [
                { name: "Cappuccino", detail: "" },
                { name: "Latte", detail: "" },
                { name: "Mocha", detail: "" },
                { name: "Vanilja latte", detail: "" },
                { name: "Karamelli latte", detail: "" }
              ]
            },
            {
              title: "Teet & muut kuumat juomat",
              description: "Huolellisesti valittu valikoima teitä täydentämään juomavalikoimaamme.",
              items: [
                { name: "Laaja valikoima Kofeiinikompanian suosittelemia teitä", detail: "" },
                { name: "Matcha latte", detail: "" },
                { name: "Chai latte", detail: "" },
                { name: "Gourmet-kaakao", detail: "" }
              ]
            },
            {
              title: "Kylmät juomat",
              description: "Ravistavat gourmet-kylmät juomat samalla laatuhenkellä valmistettuina.",
              items: [
                { name: "Kinuski", detail: "" },
                { name: "Vanilja-kookos", detail: "" },
                { name: "Minttusuklaa", detail: "" },
                { name: "Mocha", detail: "" },
                { name: "Karamelli latte", detail: "" },
                { name: "Vanilja latte", detail: "" }
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
      intro: "Kuusamossa syntynyt talo, jossa ranskalainen tarkkuus kohtaa pohjoisen pehmeyden.",
      sections: [
        {
          title: "The French Cafén tarina",
          image: "/images/story-cafe.jpg",
          imageAlt: "Kahvilan lämmin tunnelma",
          paragraphs: [
            "The French Café syntyi yksinkertaisesta mutta kunnianhimoisesta ideasta: luoda Kuusamoon lämmin, hienostunut talo, jossa leivonnaiset, kahvi ja vieraanvaraisuus muodostavat kokonaisuuden.",
            "Tarina alkaa joulukuussa 2020, eräänä talvipäivänä Kuusamossa. Kahvikupin äärellä ajatuksesta kasvoi vähitellen franco‑suomalaisen pariskunnan elämänprojekti. Yli kahden vuoden valmistelun jälkeen The French Café avasi ovensa huhtikuussa 2023 Kuusamon keskustassa.",
            "Alusta asti halusimme rakentaa enemmän kuin kahvilan: talon, joka heijastaa tapaamme tehdä, vastaanottaa ja luoda. Tämä perusta määrittää yhä The French Cafén hengen."
          ]
        },
        {
          title: "Moona Mankinen",
          image: "/images/moona.jpg",
          imageAlt: "Moona Mankinen työssään",
          paragraphs: [
            "Lukion jälkeen Moona seurasi kutsumustaan ja ryhtyi pâtisserie‑opintoihin. Hän lähti kesäharjoitteluun Nizzaan, jonka piti kestää kolme kuukautta — mutta matka venyi yli kuudeksi vuodeksi. Hän kouluttautui paikallisessa hotelli‑ ja ravintola‑alan oppilaitoksessa leipuri‑kondiittoriksi ja erikoistui jälkiruokiin.",
            "Hän työskenteli useissa ravintoloissa, mukaan lukien arvostettu Le Negresco. Erityisen merkittävä kokemus oli Le Chanteclerissa, Michelin‑tähdellä palkitussa fine dining ‑ravintolassa, jossa hän kehitti luovuuttaan ja johti pâtisserie‑tiimiä. Moona vastaa tänään The French Cafén keittiöstä ja leivonnaisista."
          ]
        },
        {
          title: "Arthur Bataille",
          image: "/images/Arthur.jpg",
          imageAlt: "Arthur Bataille salissa",
          paragraphs: [
            "Arthur on kotoisin Mardiésta, Orléansin läheltä Keski‑Ranskasta — alueelta, joka tunnetaan linnoistaan, viineistään ja hedelmistään. Hän valitsi varhain hotelli‑ ja ravintola‑alan, aloitti keittiöopinnoilla ja huomasi nopeasti, että häntä kiehtoo erityisesti palvelu ja kohtaaminen.",
            "Hän muutti myös Nizzaan ja liittyi Le Negrescoon, työskennellen hotellin ravintoloissa, erityisesti Le Chanteclerissa. Siellä ranskalaiset ja suomalaiset polut kohtasivat. Arthur tutustui Suomeen ja Kuusamoon tammikuussa 2019. Luonto ja elämänrytmi tekivät vaikutuksen, ja päätös rakentaa elämä Kuusamoon syntyi. Tänään hän vastaa salista, juomista ja vastaanotosta The French Caféssa."
          ]
        }
      ],
      visionTitle: "Paikan visio",
      vision: [
        "Tavoitteena on kokonaisvaltainen kokemus: huolella paahdettu erikoiskahvi, käsin tehdyt artesaanileivonnaiset, huomaavainen palvelu ja tila, joka tuntuu elegantilta ja lämpimältä.",
        "Laatu ja paikallisuus ovat kaiken ytimessä. Haemme paikallisia raaka‑aineita ja suomalaisia kumppaneita, mutta pidämme identiteetin ranskalaisena. The French Café on kahden kulttuurin — ranskalaisen ja suomalaisen — liitto."
      ],
      valuesTitle: "Arvomme",
      values: [
        { title: "Tarkkuus", description: "Tarkat työvaiheet, hallitut reseptit ja jatkuva laatuun panostaminen." },
        { title: "Vieraanvaraisuus", description: "Aito vastaanotto, huomaavainen palvelu ja lämmin kokemus." },
        { title: "Paikallisuus", description: "Kuusamoon juurtunut talo, jonka taustalla ovat paikalliset tuottajat." }
      ]
    },
    contactPage: {
      title: "Yhteys",
      intro: "Kaikki tarvittava vierailuun tai seuraavan tilauksen suunnitteluun.",
      methods: [
        { label: "Puhelin", value: "0504369455" },
        { label: "Sähköposti", value: "info@kahvilathefrench.cafe" },
        { label: "Osoite", value: "Kitkantie 2, 93600 Kuusamo, Suomi" }
      ],
      reservationTitle: "Helppo varaus",
      reservationDescription: "Varaa pöytä tai brunssi suoraan linkistämme."
    },
    footer: {
      description: "Ranskalainen kahvila ja patisserie Kuusamossa. Signature-brunssi, artesaaniluomukset ja lempeä palvelu.",
      rights: "Kaikki oikeudet pidätetään."
    }
  }
};
