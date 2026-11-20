/* Datos pedagógicos A1, anclajes motivacionales y glosario bilingüe local */

window.APP_DATA = {
  student: {
    name: "Miguel Ángel",
    grade: "3rd Grade (Tercero de Primaria)",
    school: "Colegio Benedictino de Santa María",
    examSchedule: "Martes de 8:00 a.m. a 10:00 a.m."
  },

  /* Hechos 100% confirmados en el correo de la Miss */
  verifiedCoreItems: [
    {
      id: "steam-maze",
      en: "The Maze",
      es: "El proceso del laberinto",
      category: "steam",
      verified: true
    },
    {
      id: "steam-dream-catcher",
      en: "The Dream Catcher",
      es: "La creación del atrapasueños",
      category: "steam",
      verified: true
    }
  ],

  /* Sugerencias opcionales para papás (NO se agregan solas; solo si aparecen en el cuaderno) */
  optionalCulturalChips: [
    { en: "Flower Fair", es: "Feria de las Flores", category: "cultural" },
    { en: "Barranquilla Carnival", es: "Carnaval de Barranquilla", category: "cultural" },
    { en: "Halloween", es: "Halloween", category: "cultural" },
    { en: "Christmas", es: "Navidad", category: "cultural" },
    { en: "Independence Day", es: "Día de la Independencia", category: "cultural" },
    { en: "Thanksgiving", es: "Día de Acción de Gracias", category: "cultural" }
  ],

  /* Código de colores LEGO */
  legoLegend: [
    {
      cls: "lego-blue",
      title: "Azul: Cosa 1 / Sujeto / Palabra Llave",
      desc: "Quién hace la acción, la primera actividad o la pista clave de la pregunta.",
      example: "The Maze / Playing the piano / MrBeast challenges"
    },
    {
      cls: "lego-orange",
      title: "Naranja: Acción / Verbo / Comparativo",
      desc: "El verbo (is, are, was, created) o el adjetivo comparativo.",
      example: "is / are / was more difficult / created"
    },
    {
      cls: "lego-green",
      title: "Verde: Puente / Conector",
      desc: "Palabras que unen ideas, comparan o explican el porqué en inglés.",
      example: "than / and / because / First, Then, Finally"
    },
    {
      cls: "lego-purple",
      title: "Morado: Cosa 2 / Opinión de Miguel",
      desc: "El segundo elemento a comparar o la cualidad/opinión que elige Miguel.",
      example: "the dream catcher / fun / creative / exciting"
    }
  ],

  /* Retos guiados de la Estación 0 (Solo ejemplos planteados para armar por colores LEGO) */
  station0Challenges: [
    {
      id: "ch-steam-maze",
      label: "STEAM: Maze vs Dream Catcher",
      es: "El laberinto fue más difícil que el atrapasueños.",
      targetEn: "The maze was more difficult than the dream catcher.",
      pieces: [
        { id: "p1", en: "The maze", es: "El laberinto", color: "blue", role: "Cosa 1" },
        { id: "p2", en: "was more difficult", es: "fue más difícil", color: "orange", role: "Pasado + Comparativo" },
        { id: "p3", en: "than", es: "que", color: "green", role: "Conector" },
        { id: "p4", en: "the dream catcher", es: "el atrapasueños", color: "purple", role: "Cosa 2" }
      ],
      shuffleOrder: [2, 3, 0, 1]
    },
    {
      id: "ch-piano",
      label: "Gustos: Piano 🎹",
      es: "Tocar piano es divertido y creativo.",
      targetEn: "Playing the piano is fun and creative.",
      pieces: [
        { id: "p1", en: "Playing the piano", es: "Tocar piano", color: "blue", role: "Sujeto" },
        { id: "p2", en: "is", es: "es", color: "orange", role: "Acción" },
        { id: "p3", en: "fun", es: "divertido", color: "purple", role: "Opinión 1" },
        { id: "p4", en: "and", es: "y", color: "green", role: "Conector" },
        { id: "p5", en: "creative", es: "creativo", color: "purple", role: "Opinión 2" }
      ],
      shuffleOrder: [3, 4, 1, 0, 2]
    },
    {
      id: "ch-fortnite",
      label: "Gustos: Fortnite 🎮",
      es: "Jugar Fortnite en Play es más emocionante que las tareas.",
      targetEn: "Playing Fortnite on Play is more exciting than homework.",
      pieces: [
        { id: "p1", en: "Playing Fortnite on Play", es: "Jugar Fortnite en Play", color: "blue", role: "Cosa 1" },
        { id: "p2", en: "is more exciting", es: "es más emocionante", color: "orange", role: "Comparativo" },
        { id: "p3", en: "than", es: "que", color: "green", role: "Conector" },
        { id: "p4", en: "homework", es: "las tareas", color: "purple", role: "Cosa 2" }
      ],
      shuffleOrder: [1, 3, 2, 0]
    },
    {
      id: "ch-mrbeast",
      label: "Gustos: MrBeast ▶️",
      es: "Los retos de MrBeast son emocionantes.",
      targetEn: "MrBeast challenges are exciting.",
      pieces: [
        { id: "p1", en: "MrBeast challenges", es: "Los retos de MrBeast", color: "blue", role: "Sujeto" },
        { id: "p2", en: "are", es: "son", color: "orange", role: "Acción" },
        { id: "p3", en: "exciting", es: "emocionantes", color: "purple", role: "Opinión" }
      ],
      shuffleOrder: [2, 0, 1]
    }
  ],

  /* 5 principios neuroeducativos para los papás */
  neuroRules: [
    "Seguridad afectiva primero: explica cada regla en español sin afán. Si Miguel entiende la idea en español, su cerebro aprende el inglés sin miedo.",
    "Fórmulas tipo LEGO (máximo 3 a 4 piezas): a los 9 años la memoria de trabajo retiene mejor bloques cortos de color que listas largas de gramática.",
    "Calentamiento con sus gustos (Piano, Fortnite en Play, MrBeast): usamos ejemplos que le gustan para encender su motivación y luego aplicamos la misma fórmula al proyecto STEAM.",
    "Efecto de generación: Miguel recuerda mucho más las respuestas que nacen de su propia opinión real que las frases copiadas.",
    "Bloques de 15 minutos + pausa de 5 minutos: usa el temporizador de arriba para estudiar una estación, descansar y celebrar cada logro."
  ],

  /* Anclajes motivacionales para futuras estaciones (Calentamiento antes de la misión STEAM) */
  interestWarmups: {
    comparatives: [
      {
        badge: "Regla 1: Corta (-er + than)",
        icon: "🎹",
        blue: "Playing piano",
        orange: "is calmer",
        green: "than",
        purple: "playing Fortnite on Play",
        en: "Playing piano is calmer than playing Fortnite on Play.",
        es: "Tocar piano es más tranquilo que jugar Fortnite en Play."
      },
      {
        badge: "Regla 2: Larga (more + adj + than)",
        icon: "▶️",
        blue: "MrBeast challenges",
        orange: "are more exciting",
        green: "than",
        purple: "homework",
        en: "MrBeast challenges are more exciting than homework.",
        es: "Los retos de MrBeast son más emocionantes que las tareas."
      },
      {
        badge: "Regla 3: Irregular (better + than)",
        icon: "🎮",
        blue: "Making music on the piano",
        orange: "is better",
        green: "than",
        purple: "being bored",
        en: "Making music on the piano is better than being bored.",
        es: "Hacer música en el piano es mejor que estar aburrido."
      }
    ],
    pastSimple: [
      {
        en: "Yesterday, I played Fortnite on Play, I practiced the piano, and I watched MrBeast on YouTube.",
        es: "Ayer jugué Fortnite en Play, practiqué el piano y vi a MrBeast en YouTube."
      }
    ],
    because: [
      {
        q: "Why do you like playing the piano or watching MrBeast?",
        a: "I like playing the piano because the music is fun and creative!",
        es: "Me gusta tocar el piano porque la música es divertida y creativa."
      }
    ]
  },

  /* Mini-entrenador de reglas de Comparatives (Estación 1) */
  comparativeQuizItems: [
    {
      id: "qz-easy",
      base: "easy",
      es: "fácil",
      answer: "short",
      correctForm: "easier than",
      options: [
        { type: "short", label: "easier than (-er)" },
        { type: "long", label: "more easy than" },
        { type: "irregular", label: "better than" }
      ],
      tipOk: "¡Exacto! 'easy' termina en -y, cambia a 'i' + '-er': easier than.",
      tipRetry: "Pista: 'easy' es palabra corta terminada en -y (ea-sy). Usa la regla corta (-ier)."
    },
    {
      id: "qz-difficult",
      base: "difficult",
      es: "difícil",
      answer: "long",
      correctForm: "more difficult than",
      options: [
        { type: "short", label: "difficulter than" },
        { type: "long", label: "more difficult than" },
        { type: "irregular", label: "better than" }
      ],
      tipOk: "¡Super! 'difficult' es larga (di-ffi-cult = 3 golpes), por eso lleva 'more'.",
      tipRetry: "Pista: cuenta los golpes de voz: di-ffi-cult (3 golpes = palabra larga). Usa 'more'."
    },
    {
      id: "qz-hard",
      base: "hard",
      es: "duro / difícil",
      answer: "short",
      correctForm: "harder than",
      options: [
        { type: "short", label: "harder than (-er)" },
        { type: "long", label: "more hard than" },
        { type: "irregular", label: "better than" }
      ],
      tipOk: "¡Muy bien! 'hard' tiene solo 1 golpe de voz, se le pega '-er': harder than.",
      tipRetry: "Pista: 'hard' tiene solo 1 golpe de voz (palabra corta). Lleva '-er'."
    },
    {
      id: "qz-colorful",
      base: "colorful",
      es: "colorido",
      answer: "long",
      correctForm: "more colorful than",
      options: [
        { type: "short", label: "colorfuler than" },
        { type: "long", label: "more colorful than" },
        { type: "irregular", label: "better than" }
      ],
      tipOk: "¡Excelente! 'colorful' (co-lor-ful) es larga, ideal para fiestas culturales y el atrapasueños.",
      tipRetry: "Pista: co-lor-ful tiene 3 golpes de voz (palabra larga). Usa 'more'."
    },
    {
      id: "qz-interesting",
      base: "interesting",
      es: "interesante",
      answer: "long",
      correctForm: "more interesting than",
      options: [
        { type: "short", label: "interestinger than" },
        { type: "long", label: "more interesting than" },
        { type: "irregular", label: "better than" }
      ],
      tipOk: "¡Genial! 'interesting' es larga, siempre va con 'more interesting than'.",
      tipRetry: "Pista: in-te-res-ting es una palabra larga. Usa 'more'."
    },
    {
      id: "qz-good",
      base: "good",
      es: "bueno",
      answer: "irregular",
      correctForm: "better than",
      options: [
        { type: "short", label: "gooder than" },
        { type: "long", label: "more good than" },
        { type: "irregular", label: "better than (Irregular)" }
      ],
      tipOk: "¡Crack! 'good' es irregular: nunca se dice gooder, siempre es 'better than'.",
      tipRetry: "Pista: ¡Cuidado con la trampa! 'good' es irregular (no usa -er ni more)."
    }
  ],

  /* Banco de adjetivos comparativos A1 para el Constructor LEGO (Estación 1) */
  comparativeAdjectives: [
    { id: "adj-easier", en: "easier", es: "más fácil", group: "short", base: "easy" },
    { id: "adj-harder", en: "harder", es: "más difícil / duro", group: "short", base: "hard" },
    { id: "adj-faster", en: "faster", es: "más rápido", group: "short", base: "fast" },
    { id: "adj-longer", en: "longer", es: "más largo", group: "short", base: "long" },
    { id: "adj-more-difficult", en: "more difficult", es: "más difícil", group: "long", base: "difficult" },
    { id: "adj-more-interesting", en: "more interesting", es: "más interesante", group: "long", base: "interesting" },
    { id: "adj-more-colorful", en: "more colorful", es: "más colorido", group: "long", base: "colorful" },
    { id: "adj-more-exciting", en: "more exciting", es: "más emocionante", group: "long", base: "exciting" },
    { id: "adj-more-creative", en: "more creative", es: "más creativo", group: "long", base: "creative" },
    { id: "adj-more-fun", en: "more fun", es: "más divertido", group: "long", base: "fun" },
    { id: "adj-better", en: "better", es: "mejor", group: "irregular", base: "good" }
  ],

  /* Glosario local Español -> Inglés A1 (orientado a STEAM, manualidades, colegio y gustos de Miguel) */
  esToEnGlossary: [
    { es: "atrapasuenos", displayEs: "atrapasueños", en: "the dream catcher" },
    { es: "atrapasueños", displayEs: "atrapasueños", en: "the dream catcher" },
    { es: "el laberinto", displayEs: "el laberinto", en: "the maze" },
    { es: "laberinto", displayEs: "laberinto", en: "the maze" },
    { es: "mas dificil que", displayEs: "más difícil que", en: "more difficult than" },
    { es: "mas facil que", displayEs: "más fácil que", en: "easier than" },
    { es: "mas divertido que", displayEs: "más divertido que", en: "more fun than" },
    { es: "mas interesante que", displayEs: "más interesante que", en: "more interesting than" },
    { es: "mas colorido que", displayEs: "más colorido que", en: "more colorful than" },
    { es: "mas emocionante que", displayEs: "más emocionante que", en: "more exciting than" },
    { es: "mejor que", displayEs: "mejor que", en: "better than" },
    { es: "feria de las flores", displayEs: "Feria de las Flores", en: "Flower Fair" },
    { es: "carnaval de barranquilla", displayEs: "Carnaval de Barranquilla", en: "Barranquilla Carnival" },
    { es: "dia de la independencia", displayEs: "Día de la Independencia", en: "Independence Day" },
    { es: "tocar piano", displayEs: "tocar piano", en: "playing the piano" },
    { es: "jugar fortnite", displayEs: "jugar Fortnite", en: "playing Fortnite on Play" },
    { es: "ver mr beast", displayEs: "ver MrBeast", en: "watching MrBeast on YouTube" },
    { es: "compañeros", displayEs: "compañeros", en: "my classmates" },
    { es: "profesores", displayEs: "profesores", en: "my teachers" },
    { es: "salon", displayEs: "salón", en: "our classroom" },
    { es: "colegio", displayEs: "colegio", en: "school" },
    { es: "porque", displayEs: "porque", en: "because" },
    { es: "fue", displayEs: "fue", en: "it was" },
    { es: "divertido", displayEs: "divertido", en: "fun" },
    { es: "creativo", displayEs: "creativo", en: "creative" },
    { es: "interesante", displayEs: "interesante", en: "interesting" },
    { es: "colorido", displayEs: "colorido", en: "colorful" },
    { es: "emocionante", displayEs: "emocionante", en: "exciting" },
    { es: "facil", displayEs: "fácil", en: "easy" },
    { es: "dificil", displayEs: "difícil", en: "difficult" },
    { es: "aburrido", displayEs: "aburrido", en: "boring" },
    { es: "largo", displayEs: "largo", en: "long" },
    { es: "lento", displayEs: "lento", en: "slow" },
    { es: "rapido", displayEs: "rápido", en: "fast" },
    { es: "carton", displayEs: "cartón", en: "cardboard" },
    { es: "papel", displayEs: "papel", en: "paper" },
    { es: "lana", displayEs: "lana", en: "wool" },
    { es: "hilo", displayEs: "hilo", en: "thread" },
    { es: "pegante", displayEs: "pegante", en: "glue" },
    { es: "tijeras", displayEs: "tijeras", en: "scissors" },
    { es: "colores", displayEs: "colores", en: "colors" },
    { es: "pintar", displayEs: "pintar", en: "painting" },
    { es: "cortar", displayEs: "cortar", en: "cutting" },
    { es: "tejer", displayEs: "tejer", en: "weaving" },
    { es: "esperar", displayEs: "esperar", en: "waiting" },
    { es: "construir", displayEs: "construir", en: "building" },
    { es: "hacer", displayEs: "hacer", en: "making" },
    { es: "creamos", displayEs: "creamos", en: "we created" },
    { es: "hicimos", displayEs: "hicimos", en: "we made" },
    { es: "pintamos", displayEs: "pintamos", en: "we painted" },
    { es: "usamos", displayEs: "usamos", en: "we used" },
    { es: "trabajamos", displayEs: "trabajamos", en: "we worked" },
    { es: "aprendi", displayEs: "aprendí", en: "I learned" },
    { es: "paciencia", displayEs: "paciencia", en: "patience" },
    { es: "musica", displayEs: "música", en: "music" },
    { es: "piano", displayEs: "piano", en: "piano" },
    { es: "navidad", displayEs: "Navidad", en: "Christmas" },
    { es: "fiesta", displayEs: "fiesta", en: "celebration" }
  ]
};
