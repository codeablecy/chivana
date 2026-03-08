import type { Project, BlogPost, SiteSettings } from "./types"

export const siteSettings: SiteSettings = {
  companyName: "Chivana Real Estate",
  phone: "+34 655 754 978",
  email: "info@chivana-realestate.com",
  address: "Cuesta de la Higuera, 19",
  city: "El Viso de San Juan",
  province: "Toledo",
  postalCode: "45215",
  officeLat: 40.0716,
  officeLng: -3.9397,
  metaTitle: "Chivana Real Estate | Viviendas Exclusivas cerca de Madrid",
  metaDescription:
    "Casas exclusivas a solo 35 km de Madrid y 33 km de Toledo. 4 dormitorios, 3 banos, amplias, luminosas y sostenibles.",
  officeHours: "Lunes a Viernes: 10:00h - 14:30h y 15:30h - 19:00h | Sabados: 10:00h - 14:00h",
  socialInstagram: "https://instagram.com/chivanarealestate",
  socialFacebook: "https://facebook.com/chivanarealestate",
}

export const projects: Project[] = [
  {
    slug: "viso-1",
    name: "El Mirador del Viso de San Juan",
    tagline: "Casas exclusivas a solo 35 km de Madrid y 33 km de Toledo",
    description:
      "Vivir tranquilo es vivir mejor, a un paso de Madrid y Toledo. En El Mirador del Viso de San Juan, un proyecto de Chivana Real Estate, disenamos viviendas amplias, luminosas y funcionales con materiales de primera calidad. Pensadas para familias que buscan tranquilidad y calidad de vida.",
    heroImage: "/images/hero.jpg",
    tags: ["En Construccion", "Ultimas Unidades"],
    location: {
      address: "Cuesta de la Higuera, 19",
      city: "El Viso de San Juan",
      province: "La Sagra, Toledo",
      postalCode: "45215",
      lat: 40.0716,
      lng: -3.9397,
      distances: [
        "35 km a Madrid centro",
        "33 km a Toledo",
        "Acceso directo a la autovia A-42",
      ],
      amenities: [
        { name: "Colegio Publico El Viso", distance: "500 m", type: "education" },
        { name: "Centro de Salud", distance: "800 m", type: "health" },
        { name: "Estacion de Cercanias", distance: "2 km", type: "transport" },
        { name: "Supermercado Mercadona", distance: "1 km", type: "shopping" },
        { name: "Parque Municipal", distance: "300 m", type: "leisure" },
        { name: "IES La Sagra", distance: "1.5 km", type: "education" },
        { name: "Farmacia", distance: "600 m", type: "health" },
        { name: "Acceso A-42", distance: "3 km", type: "transport" },
      ],
    },
    features: [
      {
        title: "Luminosas",
        description: "Amplios ventanales que inundan cada estancia de luz natural.",
        icon: "Sun",
      },
      {
        title: "Calidad Premium",
        description: "Materiales de primera y acabados de lujo en cada detalle.",
        icon: "Shield",
      },
      {
        title: "Sostenibles",
        description: "Aerotermia y suelo radiante refrescante para maximo confort.",
        icon: "Leaf",
      },
      {
        title: "Jardin Privado",
        description: "Cada vivienda con jardin propio y opcion de piscina.",
        icon: "Home",
      },
    ],
    phases: [
      { name: "Fase 1", subtitle: "Viviendas 3 - 8", status: "vendida", label: "100% vendida" },
      { name: "Fase 2", subtitle: "Viviendas 18 - 29", status: "vendida", label: "100% vendida" },
      { name: "Fase 3", subtitle: "Viviendas 9 - 17", status: "vendida", label: "100% vendida" },
      { name: "Fase 4", subtitle: "Viviendas 38 - 44", status: "vendida", label: "100% vendidas" },
      {
        name: "Fase 5",
        subtitle: "Viviendas 30 - 37",
        status: "disponible",
        label: "Ultimas 3 viviendas",
        date: "Julio 2026",
      },
    ],
    propertyTypes: [
      {
        name: "Unifamiliar Tipo A",
        area: "183.80 m\u00B2",
        rooms: 4,
        baths: 3,
        garden: "56 m\u00B2",
        description:
          "Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad.",
        image: "/images/living-room.jpg",
      },
      {
        name: "Unifamiliar Tipo A Simetrico",
        area: "183.81 m\u00B2",
        rooms: 4,
        baths: 3,
        garden: "56 m\u00B2",
        description:
          "Diseno luminoso con estancias amplias, buhardilla versatil, cocinas modernas y suelos ceramicos de primeras marcas.",
        image: "/images/kitchen.jpg",
      },
      {
        name: "Unifamiliar Tipo B",
        area: "181.82 m\u00B2",
        rooms: 4,
        baths: 3,
        garden: "56 m\u00B2",
        description:
          "Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad.",
        image: "/images/bedroom.jpg",
      },
      {
        name: "Unifamiliar Tipo C",
        area: "175.25 m\u00B2",
        rooms: 4,
        baths: 3,
        garden: "75 m\u00B2",
        description:
          "Distribucion optimizada, buhardilla funcional, cocinas contemporaneas y acabados de lujo.",
        image: "/images/bathroom.jpg",
      },
      {
        name: "Unifamiliar Tipo C Simetrico",
        area: "175.25 m\u00B2",
        rooms: 4,
        baths: 3,
        garden: "75 m\u00B2",
        description:
          "Diseno versatil con amplios espacios, buhardilla funcional y suelos de primeras marcas.",
        image: "/images/exterior.jpg",
      },
    ],
    pricing: [
      {
        type: "Unifamiliar Tipo A",
        area: "183.80 m²",
        price: "268.000€",
        details: "4 hab. + 3 banos - Jardin 56 m²",
        available: 1,
        sold: 12,
        images: [{ src: "/images/living-room.jpg", alt: "Salon principal" }],
        rooms: 4,
        baths: 3,
        garden: "56 m²",
        description:
          "Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad.",
      },
      {
        type: "Unifamiliar Tipo A Simetrico",
        area: "183.81 m²",
        price: "268.000€",
        details: "4 hab. + 3 banos - Jardin 56 m²",
        available: 1,
        sold: 10,
        images: [{ src: "/images/kitchen.jpg", alt: "Cocina moderna" }],
        rooms: 4,
        baths: 3,
        garden: "56 m²",
        description:
          "Diseno luminoso con estancias amplias, buhardilla versatil, cocinas modernas y suelos ceramicos de primeras marcas.",
      },
      {
        type: "Unifamiliar Tipo B",
        area: "181.82 m²",
        price: "Consultar",
        details: "4 hab. + 3 banos - Jardin 56 m²",
        available: 0,
        sold: 10,
        images: [{ src: "/images/bedroom.jpg", alt: "Dormitorio principal" }],
        rooms: 4,
        baths: 3,
        garden: "56 m²",
        description:
          "Espacio funcional con diseno simetrico, amplias estancias, buhardilla versatil y materiales de alta calidad.",
      },
      {
        type: "Unifamiliar Tipo C",
        area: "175.25 m²",
        price: "Consultar",
        details: "4 hab. + 3 banos - Jardin 75 m²",
        available: 1,
        sold: 3,
        images: [{ src: "/images/bathroom.jpg", alt: "Bano completo" }],
        rooms: 4,
        baths: 3,
        garden: "75 m²",
        description:
          "Distribucion optimizada, buhardilla funcional, cocinas contemporaneas y acabados de lujo.",
      },
      {
        type: "Unifamiliar Tipo C Simetrico",
        area: "175.25 m²",
        price: "Consultar",
        details: "4 hab. + 3 banos - Jardin 75 m²",
        available: 0,
        sold: 4,
        images: [{ src: "/images/exterior.jpg", alt: "Exterior de la vivienda" }],
        rooms: 4,
        baths: 3,
        garden: "75 m²",
        description:
          "Diseno versatil con amplios espacios, buhardilla funcional y suelos de primeras marcas.",
      },
    ],
    gallery: {
      photos: [
        { src: "/images/hero.jpg", alt: "Vista aerea de la urbanizacion" },
        { src: "/images/exterior.jpg", alt: "Exterior de la vivienda" },
        { src: "/images/living-room.jpg", alt: "Salon principal" },
        { src: "/images/kitchen.jpg", alt: "Cocina moderna" },
        { src: "/images/bedroom.jpg", alt: "Dormitorio principal" },
        { src: "/images/bathroom.jpg", alt: "Bano completo" },
      ],
      construction: [
        { src: "/images/construction.jpg", alt: "Avance de obras" },
        { src: "/images/hero.jpg", alt: "Vista general del proyecto" },
        { src: "/images/exterior.jpg", alt: "Fachada en construccion" },
      ],
      tour360: [
        {
          url: "https://my.matterport.com/show/?m=exJgkPPjZJc&ss=2&sr=,-.66",
        },
      ],
    },
    qualities: [
      {
        title: "Cubiertas",
        description:
          "Aislamiento y proteccion termica de alta eficiencia para maxima comodidad.",
        icon: "Layers",
      },
      {
        title: "Fachadas",
        description:
          "Acabado exterior con aislamiento termico avanzado y materiales de primera calidad.",
        icon: "ShieldCheck",
      },
      {
        title: "Sanitarios y Griferias",
        description: "Equipamiento de bano de primeras marcas con diseno moderno.",
        icon: "Droplets",
      },
      {
        title: "Instalaciones",
        description:
          "Sistemas de aerotermia, suelo radiante refrescante y las mejores prestaciones energeticas.",
        icon: "Zap",
      },
    ],
    status: "active",
    totalUnits: 44,
    availableUnits: 3,
    customFields: {},
  },
  {
    slug: "viso-2",
    name: "El Mirador del Viso - Fase II",
    tagline: "Nuevas viviendas exclusivas con piscina comunitaria en El Viso de San Juan",
    description:
      "La segunda fase de nuestro exitoso proyecto en El Viso de San Juan. 30 nuevas viviendas unifamiliares con piscina comunitaria, zonas verdes y los mismos estandares de calidad premium que nos caracterizan. Diseno contemporaneo con certificacion energetica A.",
    heroImage: "/images/exterior.jpg",
    tags: ["Proximamente", "Pre-Venta"],
    location: {
      address: "Cuesta de la Higuera",
      city: "El Viso de San Juan",
      province: "La Sagra, Toledo",
      postalCode: "45215",
      lat: 40.073,
      lng: -3.938,
      distances: [
        "35 km a Madrid centro",
        "33 km a Toledo",
        "Acceso directo a la autovia A-42",
      ],
      amenities: [
        { name: "Colegio Publico El Viso", distance: "600 m", type: "education" },
        { name: "Centro de Salud", distance: "900 m", type: "health" },
        { name: "Estacion de Cercanias", distance: "2.2 km", type: "transport" },
        { name: "Supermercado Mercadona", distance: "1.1 km", type: "shopping" },
        { name: "Parque Municipal", distance: "400 m", type: "leisure" },
        { name: "Polideportivo Municipal", distance: "800 m", type: "leisure" },
      ],
    },
    features: [
      {
        title: "Diseno Moderno",
        description: "Arquitectura contemporanea con lineas limpias y funcionales.",
        icon: "Sun",
      },
      {
        title: "Alta Eficiencia",
        description: "Certificacion energetica A con las mejores prestaciones.",
        icon: "Shield",
      },
      {
        title: "Piscina Comunitaria",
        description: "Zona de piscina y areas verdes comunitarias para toda la familia.",
        icon: "Leaf",
      },
      {
        title: "Parcelas Generosas",
        description: "Parcelas de hasta 100 m\u00B2 con amplias zonas ajardinadas.",
        icon: "Home",
      },
    ],
    phases: [
      {
        name: "Pre-Venta",
        subtitle: "Viviendas 1 - 30",
        status: "disponible",
        label: "Apertura de ventas Q1 2027",
        date: "Marzo 2027",
      },
    ],
    propertyTypes: [
      {
        name: "Unifamiliar Tipo D",
        area: "195.50 m\u00B2",
        rooms: 4,
        baths: 3,
        garden: "80 m\u00B2",
        description:
          "Vivienda de nueva generacion con distribucion abierta, cocina isla, suite principal con vestidor y buhardilla multifuncional.",
        image: "/images/living-room.jpg",
      },
      {
        name: "Unifamiliar Tipo E",
        area: "210.00 m\u00B2",
        rooms: 5,
        baths: 3,
        garden: "100 m\u00B2",
        description:
          "La vivienda mas amplia de la promocion, con 5 dormitorios, doble salon y parcela de 100 m\u00B2. Ideal para familias grandes.",
        image: "/images/kitchen.jpg",
      },
    ],
    pricing: [
      {
        type: "Unifamiliar Tipo D",
        area: "195.50 m\u00B2",
        price: "295.000\u20AC",
        details: "4 hab. + 3 banos - Jardin 80 m\u00B2",
        available: 18,
        sold: 0,
      },
      {
        type: "Unifamiliar Tipo E",
        area: "210.00 m\u00B2",
        price: "335.000\u20AC",
        details: "5 hab. + 3 banos - Jardin 100 m\u00B2",
        available: 12,
        sold: 0,
      },
    ],
    gallery: {
      photos: [
        { src: "/images/exterior.jpg", alt: "Render del proyecto Viso 2" },
        { src: "/images/living-room.jpg", alt: "Interior conceptual salon" },
        { src: "/images/kitchen.jpg", alt: "Cocina concepto" },
        { src: "/images/bedroom.jpg", alt: "Dormitorio principal" },
      ],
      construction: [],
    },
    qualities: [
      {
        title: "Fachada Ventilada",
        description: "Sistema de fachada ventilada con acabado ceramico de alta durabilidad.",
        icon: "Layers",
      },
      {
        title: "Domotica Integrada",
        description: "Control inteligente de iluminacion, climatizacion y seguridad.",
        icon: "Zap",
      },
      {
        title: "Carpinteria Premium",
        description: "Ventanas de aluminio RPT con rotura de puente termico y vidrio bajo emisivo.",
        icon: "ShieldCheck",
      },
      {
        title: "Griferias Roca",
        description: "Equipamiento sanitario Roca de ultima generacion en todos los banos.",
        icon: "Droplets",
      },
    ],
    status: "coming-soon",
    totalUnits: 30,
    availableUnits: 30,
    customFields: {},
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Eficiencia energetica y confort en cada detalle",
    excerpt:
      "El Mirador del Viso integra soluciones modernas como aerotermia y suelo radiante refrescante, garantizando maximo confort con un consumo energetico reducido.",
    content:
      "El Mirador del Viso integra soluciones modernas como aerotermia y suelo radiante refrescante, garantizando maximo confort con un consumo energetico reducido. Nuestras viviendas cuentan con certificacion energetica de alta eficiencia, lo que se traduce en un menor gasto en climatizacion y un mayor confort en todas las estaciones del ano.",
    image: "/images/exterior.jpg",
    date: "17 ago 2025",
    readTime: "1 Min.",
    published: true,
  },
  {
    id: "2",
    title: "Diseno y Confort",
    excerpt:
      "Casas luminosas y espaciosas, pensadas para tu familia. Cada vivienda cuenta con 4 dormitorios, 3 banos y una buhardilla amplia y versatil.",
    content:
      "Casas luminosas y espaciosas, pensadas para tu familia. Cada vivienda cuenta con 4 dormitorios, 3 banos y una buhardilla amplia y versatil. Los espacios han sido disenados para maximizar la entrada de luz natural y ofrecer la mejor funcionalidad en cada rincon del hogar.",
    image: "/images/living-room.jpg",
    date: "17 ago 2025",
    readTime: "1 Min.",
    published: true,
  },
  {
    id: "3",
    title: "Naturaleza y Bienestar",
    excerpt:
      "Conecta con la naturaleza y vive sin estres. En El Mirador del Viso encontraras aire puro, cielos abiertos y paisajes naturales.",
    content:
      "Conecta con la naturaleza y vive sin estres. En El Mirador del Viso encontraras aire puro, cielos abiertos y paisajes naturales. La ubicacion privilegiada de nuestro proyecto te permite disfrutar de un entorno natural excepcional, a pocos minutos de los principales servicios.",
    image: "/images/location.jpg",
    date: "17 ago 2025",
    readTime: "1 Min.",
    published: true,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getActiveProjects(): Project[] {
  return projects.filter((p) => p.status !== "sold-out")
}

export function getPublishedPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.published)
}
