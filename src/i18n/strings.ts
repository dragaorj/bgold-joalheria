/**
 * All visible copy, per language.
 *
 * The page tells one story, in order: a couple's story becomes a drawing made
 * to their measure, the drawing becomes gold in BGold's own workshop, the
 * couple chooses every detail, can follow and even take part in the making,
 * receives the film of how their rings were made, and gets them quickly.
 * Each BGold differentiator lives inside a moment of that story, never in a
 * list.
 *
 * Headlines are arrays of phrases: each phrase starts on its own line and
 * wraps naturally (balanced) if the screen is narrow. No hard line breaks
 * inside sentences, so nothing breaks awkwardly at any width.
 */

export type Lang = "pt" | "en" | "es";
export const LANGS: { id: Lang; short: string; name: string; html: string }[] = [
  { id: "pt", short: "PT", name: "Português", html: "pt-BR" },
  { id: "en", short: "EN", name: "English", html: "en" },
  { id: "es", short: "ES", name: "Español", html: "es" },
];

export interface Dict {
  meta: { title: string; description: string };
  nav: {
    home: string;
    links: { joalheria: string; criacoes: string; processo: string; contato: string };
    cta: string;
    menu: string;
    close: string;
    primary: string;
    language: string;
    toLight: string;
    toDark: string;
    top: string;
    skip: string;
    pause: string;
    play: string;
    scrollHint: string;
    whatsapp: string;
  };
  loader: string;
  film: {
    label: string;
    description: string;
    chapters: string;
    rule: [string, string, string, string, string, string];
    intro: { title: string[]; support: string };
    inicio: { title: string; support: string };
    arte: { title: string; left: [string, string]; right: [string, string]; support: string };
    precisao: { a: string; b: string; support: string };
    joia: { title: [string, string]; support: string };
    signature: { name: string; sub: string; cta: string };
  };
  art: { title: string[]; text: string; alt: string; more: string; videos: string[] };
  creations: {
    title: string[];
    items: { name: string; text: string; alt: string }[];
    more: string;
    note: string;
  };
  touch: { title: string[]; text: string; altMain: string; altDetail: string };
  contact: { title: string[]; text: string; primary: string; secondary: string };
  clients: {
    title: string[];
    lead: string;
    exampleNote: string;
    rating: string;
    items: { name: string; product: string; headline?: string; text: string }[];
  };
  footer: { line: string; legal: string };
}

const pt: Dict = {
  meta: {
    title: "BGold Joalheria · Alianças feitas à mão, sob medida para o casal",
    description:
      "Alianças de casamento, anéis de noivado e joias personalizadas feitos na oficina da BGold, sob medida para cada casal.",
  },
  nav: {
    home: "BGold Joalheria no Instagram (abre em nova aba)",
    links: { joalheria: "A Joalheria", criacoes: "Nossas Criações", processo: "Nosso Processo", contato: "Contato" },
    cta: "Fale com a BGold",
    menu: "Menu",
    close: "Fechar",
    primary: "Principal",
    language: "Idioma",
    toLight: "Ativar modo claro",
    toDark: "Ativar modo escuro",
    top: "Voltar ao topo",
    skip: "Pular o filme",
    pause: "Pausar vídeo",
    play: "Reproduzir vídeo",
    scrollHint: "Role para baixo",
    whatsapp: "Fale com a BGold no WhatsApp",
  },
  loader: "Carregando o filme",
  film: {
    label: "Filme BGold: do desenho à joia",
    description:
      "Um filme acompanha a rolagem da página: o desenho técnico de um anel de noivado ganha forma em metal e diamantes, ergue-se do papel, é recebido por uma mão e colocado no dedo de quem o recebe.",
    chapters: "Capítulos do filme",
    rule: ["Origem", "Desenho", "Oficina", "Detalhes", "A joia", "BGold"],
    intro: {
      title: ["Existem histórias que merecem durar para sempre."],
      support: "Na BGold, cada aliança é desenhada e feita à mão na nossa oficina, para um único casal.",
    },
    inicio: {
      title: "Tudo começa com um significado.",
      support:
        "Primeiro, ouvimos a história de vocês. Depois ela vira traço, medida e proporção, no tamanho exato da mão de cada um.",
    },
    arte: {
      title: "A arte está em cada detalhe.",
      left: ["A arte", "está"],
      right: ["em cada", "detalhe."],
      support: "Nada chega pronto de fábrica. O ouro é fundido, moldado e polido aqui, pelas mãos de quem vai atender vocês.",
    },
    precisao: {
      a: "Feitas com precisão.",
      b: "Criadas para emocionar.",
      support:
        "Largura, peso, acabamento, pedras, uma gravação por dentro: vocês escolhem cada detalhe, nós acertamos cada décimo de milímetro.",
    },
    joia: {
      title: ["Mais do que alianças.", "Símbolos de uma vida."],
      support: "Se quiserem, vocês acompanham tudo de perto: conhecem a oficina e ajudam a fazer a própria aliança.",
    },
    signature: {
      name: "BGold Joalheria.",
      sub: "O amor é eterno. Cada detalhe também.",
      cta: "Crie sua aliança conosco",
    },
  },
  art: {
    title: ["A beleza de uma joia começa muito antes de estar pronta."],
    text: "Por isso filmamos o caminho. Enquanto a aliança de vocês ganha forma na bancada, registramos cada etapa. Vocês recebem o vídeo de como ela foi feita, pronto para passar no dia do casamento.",
    alt: "Vídeos de criações BGold: anel solitário na mão, par de alianças no estojo e brincos de pedras.",
    more: "Mais vídeos da oficina",
    videos: ["Solitário na mão","Alianças no estojo","Brincos de pedras","Três solitários","Pulseira no estojo","Solitário no dedo"],
  },
  creations: {
    title: ["Joias para", "histórias únicas."],
    items: [
      {
        name: "Alianças de Casamento",
        text: "Feitas do zero para as mãos de vocês dois, na largura, no peso e no acabamento que escolherem.",
        alt: "Par de alianças de ouro em um estojo marfim.",
      },
      {
        name: "Anéis de Noivado",
        text: "Para o pedido que vocês vão contar pelo resto da vida.",
        alt: "Anel de noivado com halo de pedras usado junto à aliança de ouro.",
      },
      {
        name: "Joias Personalizadas",
        text: "Tem uma ideia, um desenho ou uma joia de família? Transformamos em uma peça que só existe uma vez.",
        alt: "Brincos de ouro com duas pedras redondas em um estojo vermelho.",
      },
    ],
    more: "Ver no Instagram",
    note: "Veja as peças mais recentes saindo da oficina no Instagram",
  },
  touch: {
    title: ["Entre o ouro e a emoção,", "existe a arte."],
    text: "E ela não precisa de meses. Como tudo é feito na nossa oficina, sem intermediários, a aliança fica pronta rápido, sem pular nenhuma etapa do cuidado.",
    altMain: "Anel solitário apresentado em um estojo preto.",
    altDetail: "Detalhe da pedra de um anel solitário entre os dedos.",
  },
  contact: {
    title: ["Vamos transformar sua história", "em uma joia?"],
    text: "Conte quando é o grande dia e o que vocês imaginam. Marcamos uma visita à oficina e começamos o desenho juntos.",
    primary: "Fale com a BGold",
    secondary: "Conheça nossas criações",
  },
  clients: {
    "title": [
      "O que dizem sobre nós?"
    ],
    "lead": "Cada aliança tem um casal por trás. Estas são algumas das histórias que passaram pela nossa bancada.",
    "exampleNote": "Depoimentos e imagens ilustrativos.",
    "rating": "5 de 5 estrelas",
    "items": [
      {
        "name": "Camila R.",
        "product": "Alianças de casamento",
        "headline": "Atendimento impecável",
        "text": "Foi o melhor atendimento de todo o planejamento do casamento. Explicaram cada detalhe com paciência, sem pressa nenhuma."
      },
      {
        "name": "Juliana M.",
        "product": "Joia personalizada",
        "text": "Levei o anel da minha avó e eles transformaram num anel de noivado lindo, sem perder a história da peça."
      },
      {
        "name": "Ricardo S.",
        "product": "Anel de noivado",
        "headline": "Ela disse sim",
        "text": "Eu não entendia nada de joia. Me mostraram as opções com calma e o pedido foi perfeito. Ela chorou, eu também."
      },
      {
        "name": "Felipe A.",
        "product": "Alianças de casamento",
        "text": "Ficou pronta antes do prazo e veio com o vídeo de como foi feita. Passamos o vídeo na festa e todo mundo se emocionou."
      },
      {
        "name": "André L.",
        "product": "Alianças de casamento",
        "headline": "Vimos nascer",
        "text": "Fomos até a oficina ver a nossa aliança sendo feita. É o tipo de experiência que a gente não esquece."
      },
      {
        "name": "Mariana T.",
        "product": "Alianças de casamento",
        "text": "Cuidado em cada detalhe, da gravação por dentro até a caixa. Dá para ver que é feito com carinho."
      },
      {
        "name": "Beatriz C.",
        "product": "Anel de noivado",
        "text": "Acertaram a medida de primeira e o acabamento é perfeito. Recomendo de olhos fechados."
      },
      {
        "name": "Larissa N.",
        "product": "Joia personalizada",
        "headline": "Me senti cuidada",
        "text": "Atenciosos do primeiro contato até a entrega. Responderam todas as minhas dúvidas, até as mais bobas."
      },
      {
        "name": "Paulo H.",
        "product": "Alianças de bodas",
        "text": "Renovamos os votos depois de 25 anos e as alianças novas vieram da BGold. Trabalho de ourives de verdade."
      }
    ]
  },
  footer: { line: "O amor é eterno. Cada detalhe também.", legal: "BGold Joalheria" },
};

const en: Dict = {
  meta: {
    title: "BGold Joalheria · Handmade wedding bands, made to measure",
    description:
      "Wedding bands, engagement rings and custom jewels made in BGold's own workshop, to the measure of each couple.",
  },
  nav: {
    home: "BGold Joalheria on Instagram (opens in a new tab)",
    links: { joalheria: "About", criacoes: "Our Creations", processo: "Our Process", contato: "Contact" },
    cta: "Talk to BGold",
    menu: "Menu",
    close: "Close",
    primary: "Main",
    language: "Language",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    top: "Back to top",
    skip: "Skip the film",
    pause: "Pause video",
    play: "Play video",
    scrollHint: "Scroll down",
    whatsapp: "Talk to BGold on WhatsApp",
  },
  loader: "Loading the film",
  film: {
    label: "BGold film: from drawing to jewel",
    description:
      "A film follows the scroll of the page: the technical drawing of an engagement ring takes shape in metal and diamonds, rises from the paper, is received by a hand and placed on the finger of the one who receives it.",
    chapters: "Film chapters",
    rule: ["Origin", "Drawing", "Workshop", "Details", "The jewel", "BGold"],
    intro: {
      title: ["Some stories deserve to last forever."],
      support: "At BGold, every wedding band is designed and handmade in our own workshop, for one couple only.",
    },
    inicio: {
      title: "It all begins with a meaning.",
      support:
        "First, we listen to your story. Then it becomes lines, measurements and proportions, sized exactly to each of your hands.",
    },
    arte: {
      title: "Art lives in every detail.",
      left: ["Art", "lives"],
      right: ["in every", "detail."],
      support: "Nothing arrives ready-made from a factory. The gold is cast, shaped and polished here, by the same hands that will look after you.",
    },
    precisao: {
      a: "Made with precision.",
      b: "Created to move you.",
      support:
        "Width, weight, finish, stones, an engraving inside: you choose every detail, we get every tenth of a millimetre right.",
    },
    joia: {
      title: ["More than wedding bands.", "Symbols of a lifetime."],
      support: "If you like, you can follow it all up close: visit the workshop and help make your own rings.",
    },
    signature: {
      name: "BGold Joalheria.",
      sub: "Love is eternal. So is every detail.",
      cta: "Create your ring with us",
    },
  },
  art: {
    title: ["The beauty of a jewel begins long before it is finished."],
    text: "That is why we film the journey. While your rings take shape on the bench, we record every step. You receive the video of how they were made, ready to play on your wedding day.",
    alt: "Videos of BGold creations: a solitaire ring on a hand, a pair of wedding bands in a box and stone earrings.",
    more: "More videos from the workshop",
    videos: ["Solitaire on a hand","Wedding bands in a box","Stone earrings","Three solitaires","Bracelet in a box","Solitaire on a finger"],
  },
  creations: {
    title: ["Jewels for", "unique stories."],
    items: [
      {
        name: "Wedding Bands",
        text: "Made from scratch for both your hands, in the width, weight and finish you choose.",
        alt: "A pair of gold wedding bands in an ivory box.",
      },
      {
        name: "Engagement Rings",
        text: "For the proposal you will be telling for the rest of your lives.",
        alt: "Halo engagement ring worn with a gold wedding band.",
      },
      {
        name: "Custom Jewels",
        text: "Have an idea, a sketch or a family piece? We turn it into a jewel that exists only once.",
        alt: "Gold earrings with two round stones in a red box.",
      },
    ],
    more: "View on Instagram",
    note: "See the latest pieces leaving the workshop on Instagram",
  },
  touch: {
    title: ["Between gold and emotion,", "there is art."],
    text: "And it doesn't take months. Because everything is made in our own workshop, with no middlemen, your rings are ready quickly, without skipping a single step.",
    altMain: "A solitaire ring presented in a black box.",
    altDetail: "Close-up of a solitaire stone held between the fingers.",
  },
  contact: {
    title: ["Shall we turn your story", "into a jewel?"],
    text: "Tell us when the big day is and what you have in mind. We'll book a visit to the workshop and start the design together.",
    primary: "Talk to BGold",
    secondary: "Discover our creations",
  },
  clients: {
    "title": [
      "What do people say about us?"
    ],
    "lead": "Every ring has a couple behind it. These are some of the stories that passed through our bench.",
    "exampleNote": "Illustrative testimonials and images.",
    "rating": "5 out of 5 stars",
    "items": [
      {
        "name": "Camila R.",
        "product": "Wedding bands",
        "headline": "Flawless service",
        "text": "The best service of our whole wedding planning. They explained every detail patiently, never in a hurry."
      },
      {
        "name": "Juliana M.",
        "product": "Custom jewel",
        "text": "I brought my grandmother's ring and they turned it into a beautiful engagement ring without losing its story."
      },
      {
        "name": "Ricardo S.",
        "product": "Engagement ring",
        "headline": "She said yes",
        "text": "I knew nothing about jewellery. They walked me through the options calmly and the proposal was perfect. She cried, so did I."
      },
      {
        "name": "Felipe A.",
        "product": "Wedding bands",
        "text": "Ready before the deadline and it came with the video of how it was made. We played it at the party and everyone was moved."
      },
      {
        "name": "André L.",
        "product": "Wedding bands",
        "headline": "We watched it being born",
        "text": "We went to the workshop to see our rings being made. The kind of experience you never forget."
      },
      {
        "name": "Mariana T.",
        "product": "Wedding bands",
        "text": "Care in every detail, from the engraving inside to the box. You can tell it is made with love."
      },
      {
        "name": "Beatriz C.",
        "product": "Engagement ring",
        "text": "They got the size right the first time and the finish is perfect. I recommend them without a second thought."
      },
      {
        "name": "Larissa N.",
        "product": "Custom jewel",
        "headline": "I felt looked after",
        "text": "Attentive from the first message to the delivery. They answered every question, even the silly ones."
      },
      {
        "name": "Paulo H.",
        "product": "Anniversary bands",
        "text": "We renewed our vows after 25 years and the new bands came from BGold. Real goldsmith work."
      }
    ]
  },
  footer: { line: "Love is eternal. So is every detail.", legal: "BGold Joalheria" },
};

const es: Dict = {
  meta: {
    title: "BGold Joalheria · Alianzas hechas a mano, a la medida de la pareja",
    description:
      "Alianzas de boda, anillos de compromiso y joyas personalizadas hechos en el taller de BGold, a la medida de cada pareja.",
  },
  nav: {
    home: "BGold Joalheria en Instagram (se abre en una pestaña nueva)",
    links: { joalheria: "La Joyería", criacoes: "Nuestras Creaciones", processo: "Nuestro Proceso", contato: "Contacto" },
    cta: "Habla con BGold",
    menu: "Menú",
    close: "Cerrar",
    primary: "Principal",
    language: "Idioma",
    toLight: "Activar modo claro",
    toDark: "Activar modo oscuro",
    top: "Volver arriba",
    skip: "Saltar la película",
    pause: "Pausar video",
    play: "Reproducir video",
    scrollHint: "Desliza hacia abajo",
    whatsapp: "Habla con BGold por WhatsApp",
  },
  loader: "Cargando la película",
  film: {
    label: "Película BGold: del dibujo a la joya",
    description:
      "Una película acompaña el desplazamiento de la página: el dibujo técnico de un anillo de compromiso toma forma en metal y diamantes, se eleva del papel, es recibido por una mano y colocado en el dedo de quien lo recibe.",
    chapters: "Capítulos de la película",
    rule: ["Origen", "Diseño", "Taller", "Detalles", "La joya", "BGold"],
    intro: {
      title: ["Hay historias que merecen durar para siempre."],
      support: "En BGold, cada alianza se diseña y se hace a mano en nuestro propio taller, para una sola pareja.",
    },
    inicio: {
      title: "Todo comienza con un significado.",
      support:
        "Primero, escuchamos su historia. Después se convierte en trazo, medida y proporción, al tamaño exacto de la mano de cada uno.",
    },
    arte: {
      title: "El arte está en cada detalle.",
      left: ["El arte", "está"],
      right: ["en cada", "detalle."],
      support: "Nada llega hecho de fábrica. El oro se funde, se moldea y se pule aquí, por las manos de quien los va a atender.",
    },
    precisao: {
      a: "Hechas con precisión.",
      b: "Creadas para emocionar.",
      support:
        "Ancho, peso, acabado, piedras, un grabado por dentro: ustedes eligen cada detalle, nosotros cuidamos cada décima de milímetro.",
    },
    joia: {
      title: ["Más que alianzas.", "Símbolos de una vida."],
      support: "Si quieren, pueden seguirlo todo de cerca: conocer el taller y ayudar a hacer su propia alianza.",
    },
    signature: {
      name: "BGold Joalheria.",
      sub: "El amor es eterno. Cada detalle también.",
      cta: "Crea tu alianza con nosotros",
    },
  },
  art: {
    title: ["La belleza de una joya comienza mucho antes de estar terminada."],
    text: "Por eso filmamos el camino. Mientras su alianza toma forma en el banco de trabajo, registramos cada etapa. Ustedes reciben el video de cómo se hizo, listo para mostrar el día de la boda.",
    alt: "Videos de creaciones BGold: anillo solitario en la mano, par de alianzas en el estuche y aretes de piedras.",
    more: "Más videos del taller",
    videos: ["Solitario en la mano","Alianzas en el estuche","Aretes de piedras","Tres solitarios","Pulsera en el estuche","Solitario en el dedo"],
  },
  creations: {
    title: ["Joyas para", "historias únicas."],
    items: [
      {
        name: "Alianzas de Boda",
        text: "Hechas desde cero para las manos de ustedes dos, con el ancho, el peso y el acabado que elijan.",
        alt: "Par de alianzas de oro en un estuche marfil.",
      },
      {
        name: "Anillos de Compromiso",
        text: "Para la pedida que van a contar el resto de su vida.",
        alt: "Anillo de compromiso con halo de piedras junto a una alianza de oro.",
      },
      {
        name: "Joyas Personalizadas",
        text: "¿Tienen una idea, un dibujo o una joya de familia? La convertimos en una pieza que existe una sola vez.",
        alt: "Aretes de oro con dos piedras redondas en un estuche rojo.",
      },
    ],
    more: "Ver en Instagram",
    note: "Vean las piezas más recientes saliendo del taller en Instagram",
  },
  touch: {
    title: ["Entre el oro y la emoción,", "existe el arte."],
    text: "Y no hace falta esperar meses. Como todo se hace en nuestro taller, sin intermediarios, la alianza está lista rápido, sin saltarse ningún paso.",
    altMain: "Anillo solitario presentado en un estuche negro.",
    altDetail: "Detalle de la piedra de un anillo solitario entre los dedos.",
  },
  contact: {
    title: ["¿Transformamos su historia", "en una joya?"],
    text: "Cuéntennos cuándo es el gran día y qué imaginan. Agendamos una visita al taller y empezamos el diseño juntos.",
    primary: "Habla con BGold",
    secondary: "Conoce nuestras creaciones",
  },
  clients: {
    "title": [
      "¿Qué dicen sobre nosotros?"
    ],
    "lead": "Cada alianza tiene una pareja detrás. Estas son algunas de las historias que pasaron por nuestro banco de trabajo.",
    "exampleNote": "Testimonios e imágenes ilustrativos.",
    "rating": "5 de 5 estrellas",
    "items": [
      {
        "name": "Camila R.",
        "product": "Alianzas de boda",
        "headline": "Atención impecable",
        "text": "La mejor atención de toda la planificación de la boda. Explicaron cada detalle con paciencia, sin ninguna prisa."
      },
      {
        "name": "Juliana M.",
        "product": "Joya personalizada",
        "text": "Llevé el anillo de mi abuela y lo transformaron en un anillo de compromiso precioso, sin perder la historia de la pieza."
      },
      {
        "name": "Ricardo S.",
        "product": "Anillo de compromiso",
        "headline": "Dijo que sí",
        "text": "No sabía nada de joyas. Me mostraron las opciones con calma y la pedida fue perfecta. Ella lloró, yo también."
      },
      {
        "name": "Felipe A.",
        "product": "Alianzas de boda",
        "text": "Estuvo lista antes del plazo y vino con el video de cómo se hizo. Lo pusimos en la fiesta y todos se emocionaron."
      },
      {
        "name": "André L.",
        "product": "Alianzas de boda",
        "headline": "La vimos nacer",
        "text": "Fuimos al taller a ver nuestra alianza haciéndose. Es el tipo de experiencia que no se olvida."
      },
      {
        "name": "Mariana T.",
        "product": "Alianzas de boda",
        "text": "Cuidado en cada detalle, del grabado por dentro hasta la caja. Se nota que está hecho con cariño."
      },
      {
        "name": "Beatriz C.",
        "product": "Anillo de compromiso",
        "text": "Acertaron la medida a la primera y el acabado es perfecto. Lo recomiendo con los ojos cerrados."
      },
      {
        "name": "Larissa N.",
        "product": "Joya personalizada",
        "headline": "Me sentí cuidada",
        "text": "Atentos desde el primer mensaje hasta la entrega. Respondieron todas mis dudas, hasta las más tontas."
      },
      {
        "name": "Paulo H.",
        "product": "Alianzas de aniversario",
        "text": "Renovamos los votos después de 25 años y las alianzas nuevas vinieron de BGold. Trabajo de orfebre de verdad."
      }
    ]
  },
  footer: { line: "El amor es eterno. Cada detalle también.", legal: "BGold Joalheria" },
};

export const DICTS: Record<Lang, Dict> = { pt, en, es };
