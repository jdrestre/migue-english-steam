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

  /* ==================== ESTACIÓN 2: STEAM NEWSPAPER & PAST SIMPLE ==================== */
  station2Data: {
    timeMachineExamples: [
      {
        id: "tm-fortnite",
        icon: "🎮",
        interest: "Fortnite en Play",
        subject: "I",
        presentVerb: "play",
        pastVerb: "played",
        rest: "Fortnite on Play.",
        esPresent: "Hoy juego Fortnite en Play.",
        esPast: "Ayer jugué Fortnite en Play.",
        ruleTag: "+ed"
      },
      {
        id: "tm-piano",
        icon: "🎹",
        interest: "Piano",
        subject: "I",
        presentVerb: "practice",
        pastVerb: "practiced",
        rest: "the piano.",
        esPresent: "Hoy practico el piano.",
        esPast: "Ayer practiqué el piano.",
        ruleTag: "+d"
      },
      {
        id: "tm-mrbeast",
        icon: "▶️",
        interest: "YouTube MrBeast",
        subject: "I",
        presentVerb: "watch",
        pastVerb: "watched",
        rest: "MrBeast on YouTube.",
        esPresent: "Hoy veo a MrBeast en YouTube.",
        esPast: "Ayer vi a MrBeast en YouTube.",
        ruleTag: "+ed"
      },
      {
        id: "tm-melody",
        icon: "🎵",
        interest: "Canción en Piano",
        subject: "I",
        presentVerb: "make",
        pastVerb: "made",
        rest: "a cool piano song.",
        esPresent: "Hoy hago una canción genial en piano.",
        esPast: "Ayer hice una canción genial en piano.",
        ruleTag: "Irregular!"
      }
    ],

    pastVerbQuiz: [
      {
        id: "vq-work",
        base: "work",
        es: "trabajar",
        answer: "worked",
        kind: "regular",
        options: ["worked", "working", "workd"],
        tipOk: "¡Perfecto! 'work' es regular: solo agrega -ed → worked.",
        tipRetry: "Pista: 'work' es verbo regular. Agrega exactamente '-ed' al final."
      },
      {
        id: "vq-create",
        base: "create",
        es: "crear",
        answer: "created",
        kind: "regular",
        options: ["createed", "created", "creating"],
        tipOk: "¡Excelente! Como 'create' ya termina en -e, solo agrega -d → created.",
        tipRetry: "Pista: 'create' ya termina en 'e', no repitas la 'e'. Solo pega una 'd'."
      },
      {
        id: "vq-make",
        base: "make",
        es: "hacer / construir",
        answer: "made",
        kind: "irregular",
        options: ["maked", "made", "making"],
        tipOk: "¡Crack! 'make' es irregular estrella: en pasado siempre es 'made'.",
        tipRetry: "Pista: ¡Cuidado! 'make' es irregular (nunca se dice 'maked'). Cambia a m-a-d-e."
      },
      {
        id: "vq-paint",
        base: "paint",
        es: "pintar",
        answer: "painted",
        kind: "regular",
        options: ["painted", "panted", "paintd"],
        tipOk: "¡Súper! 'paint' + -ed → painted (pinté / pintamos).",
        tipRetry: "Pista: mantén la palabra 'paint' completa y agrega '-ed'."
      },
      {
        id: "vq-use",
        base: "use",
        es: "usar",
        answer: "used",
        kind: "regular",
        options: ["useed", "usid", "used"],
        tipOk: "¡Muy bien! 'use' ya termina en -e, solo agrega -d → used.",
        tipRetry: "Pista: 'use' termina en 'e', solo pon una 'd' al final."
      },
      {
        id: "vq-learn",
        base: "learn",
        es: "aprender",
        answer: "learned",
        kind: "regular",
        options: ["learned", "learnd", "learning"],
        tipOk: "¡Lo lograste! 'learn' + -ed → learned (aprendí / aprendimos).",
        tipRetry: "Pista: 'learn' es regular en inglés americano: agrega '-ed'."
      }
    ],

    namePresets: [
      { en: "THE BENEDICTINO STEAM TIMES", es: "El Diario STEAM del Benedictino" },
      { en: "MIGUEL'S STEAM NEWS", es: "Noticias STEAM de Miguel" },
      { en: "3RD GRADE DAILY PRESS", es: "Prensa Diaria de 3° Primaria" }
    ],

    titlePresets: [
      { en: "Our Amazing STEAM Project!", es: "¡Nuestro Increíble Proyecto STEAM!" },
      { en: "Making a Maze and a Dream Catcher!", es: "¡Haciendo un Laberinto y un Atrapasueños!" },
      { en: "3rd Grade Engineers Built & Created!", es: "¡Ingenieros de 3° Construyeron y Crearon!" }
    ],

    whoChips: [
      { id: "who-classmates", en: "my classmates", es: "mis compañeros" },
      { id: "who-teachers", en: "my teachers", es: "mis profesores" },
      { id: "who-english-miss", en: "my English teacher", es: "mi Miss de Inglés" },
      { id: "who-friends", en: "my friends", es: "mis amigos" }
    ],

    whereChips: [
      { id: "wh-classroom", en: "in our 3rd grade classroom", es: "en nuestro salón de tercero", scope: "room" },
      { id: "wh-steam-room", en: "in the STEAM classroom", es: "en el salón de STEAM", scope: "room" },
      { id: "wh-school", en: "at Colegio Benedictino de Santa María", es: "en el Colegio Benedictino de Santa María", scope: "school" },
      { id: "wh-at-school", en: "at school", es: "en el colegio (corto)", scope: "school" }
    ],

    storyVerbs: [
      { en: "created", es: "creamos", kind: "regular", creation: true },
      { en: "made", es: "hicimos", kind: "irregular", creation: true },
      { en: "built", es: "construimos", kind: "irregular", creation: true },
      { en: "worked on", es: "trabajamos en", kind: "regular", creation: false },
      { en: "designed", es: "diseñamos", kind: "regular", creation: false },
      { en: "painted", es: "pintamos", kind: "regular", creation: false }
    ],

    materialChips: [
      { en: "cardboard", es: "cartón" },
      { en: "paper", es: "papel" },
      { en: "wool and thread", es: "lana e hilo" },
      { en: "colors and markers", es: "colores y marcadores" },
      { en: "scissors and glue", es: "tijeras y pegante" },
      { en: "recycled materials", es: "materiales reciclados" }
    ],

    learningChips: [
      { en: "how to build a maze and a dream catcher", es: "cómo construir un laberinto y un atrapasueños" },
      { en: "about teamwork and creativity", es: "sobre trabajo en equipo y creatividad" },
      { en: "new English words and STEAM skills", es: "nuevas palabras en inglés y habilidades STEAM" },
      { en: "to be patient and solve problems", es: "a tener paciencia y resolver problemas" }
    ],

    photoModes: [
      {
        id: "constructor",
        label: "👷 Foto Constructor STEAM",
        src: "assets/images/miguel-constructor.jpg",
        captionEn: "Reporter Miguel Ángel ready with his tools for the 3rd Grade STEAM Project!",
        objectPos: "center 34%"
      },
      {
        id: "retrato",
        label: "📸 Foto Reportero Oficial",
        src: "assets/images/miguel-retrato.jpg",
        captionEn: "Miguel Ángel, 3rd Grade student reporter at Colegio Benedictino de Santa María.",
        objectPos: "center 20%"
      },
      {
        id: "familia",
        label: "👨‍👩‍👦 Foto Familiar de Miguel",
        src: "assets/images/miguel-familia.jpg",
        captionEn: "Miguel Ángel and his lovely family supporting him in his school activities!",
        objectPos: "center 14%"
      },
      {
        id: "sketch",
        label: "✏️ Marco de Dibujo (Martes)",
        src: "",
        captionEn: "Tip for Tuesday: Draw your Maze and Dream Catcher inside this box on your paper!",
        objectPos: "center"
      }
    ]
  },

  /* ==================== ESTACIÓN 3: 5 PREGUNTAS DE METACOGNICIÓN ==================== */
  station3Data: {
    whyWarmups: [
      {
        id: "wu-piano",
        icon: "🎹",
        topic: "Piano y Música",
        q: "Why do you like playing the piano?",
        qEs: "¿Por qué te gusta tocar el piano?",
        blue: "I like playing the piano",
        green: "because",
        purple: "making music is fun and relaxing",
        fullEn: "I like playing the piano because making music is fun and relaxing.",
        fullEs: "Me gusta tocar el piano porque hacer música es divertido y relajante."
      },
      {
        id: "wu-fortnite",
        icon: "🎮",
        topic: "Fortnite en Play",
        q: "Why do you like playing Fortnite on Play?",
        qEs: "¿Por qué te gusta jugar Fortnite en Play?",
        blue: "I like playing Fortnite on Play",
        green: "because",
        purple: "it is exciting and creative",
        fullEn: "I like playing Fortnite on Play because it is exciting and creative.",
        fullEs: "Me gusta jugar Fortnite en Play porque es emocionante y creativo."
      },
      {
        id: "wu-mrbeast",
        icon: "▶️",
        topic: "YouTube MrBeast",
        q: "Why do you like watching MrBeast?",
        qEs: "¿Por qué te gusta ver a MrBeast?",
        blue: "I like watching MrBeast",
        green: "because",
        purple: "his challenges are surprising",
        fullEn: "I like watching MrBeast because his challenges are surprising.",
        fullEs: "Me gusta ver a MrBeast porque sus retos son sorprendentes."
      }
    ],

    keywordRadar: [
      {
        id: "kr-q1",
        questionEn: "What was your favorite task in STEAM? Why?",
        keyword: "favorite task",
        correctKey: "favorite",
        options: [
          { key: "favorite", label: "⭐ Cuál fue tu tarea favorita" },
          { key: "boring", label: "😴 Cuál fue la parte más aburrida" },
          { key: "learn", label: "🧠 Qué aprendiste del proyecto" }
        ],
        tipOk: "¡Exacto! Cuando veas 'favorite task', habla de lo que MÁS te gustó + because.",
        tipRetry: "Pista: busca la palabra 'favorite' (se parece mucho a 'favorita' en español)."
      },
      {
        id: "kr-q2",
        questionEn: "Was the maze process more difficult than making the dream catcher? Why?",
        keyword: "more difficult than",
        correctKey: "compare",
        options: [
          { key: "easier", label: "✨ Cuál tarea fue más fácil" },
          { key: "compare", label: "⚖️ Si el laberinto fue más difícil que el atrapasueños" },
          { key: "where", label: "🏫 Dónde se hizo el proyecto" }
        ],
        tipOk: "¡Muy bien! Empieza con 'Was...' (pregunta de Sí o No) + comparativo 'more difficult than'.",
        tipRetry: "Pista: mira 'maze... more difficult than... dream catcher' — está comparando cuál fue más difícil."
      },
      {
        id: "kr-q3",
        questionEn: "Which STEAM task was easier for you? And why?",
        keyword: "easier for you",
        correctKey: "easier",
        options: [
          { key: "easier", label: "✨ Cuál tarea fue más fácil para ti" },
          { key: "compare", label: "⚖️ Cuál tarea fue más difícil" },
          { key: "favorite", label: "⭐ Quién participó contigo" }
        ],
        tipOk: "¡Súper! 'easier' viene de 'easy' (fácil) + -er = más fácil.",
        tipRetry: "Pista: 'easier' viene de 'easy' (fácil). Pregunta cuál te pareció más fácil."
      },
      {
        id: "kr-q4",
        questionEn: "What was the most boring part of STEAM? Why?",
        keyword: "most boring",
        correctKey: "boring",
        options: [
          { key: "learn", label: "🧠 Qué aprendiste al final" },
          { key: "favorite", label: "⭐ Tu actividad favorita" },
          { key: "boring", label: "😴 Cuál fue la parte más aburrida" }
        ],
        tipOk: "¡Crack! 'most boring' significa 'la más aburrida'. Responde con respeto + because.",
        tipRetry: "Pista: 'boring' significa 'aburrido'. Busca la opción que pregunta por la parte más aburrida."
      },
      {
        id: "kr-q5",
        questionEn: "What did you learn from this STEAM?",
        keyword: "did you learn",
        correctKey: "learn",
        options: [
          { key: "boring", label: "😴 Qué fue lo más lento" },
          { key: "learn", label: "🧠 Qué aprendiste de este proyecto" },
          { key: "easier", label: "✨ Qué materiales usaste" }
        ],
        tipOk: "¡Excelente! 'did you learn' pregunta en pasado: siempre responde con 'I learned...'.",
        tipRetry: "Pista: 'learn' significa 'aprender'. Pregunta qué aprendiste en STEAM."
      }
    ],

    officialQuestions: [
      {
        id: "q1",
        shortLabel: "P1. Favorita",
        questionEn: "What was your favorite task in STEAM? Why?",
        questionHtml: "What was your <mark class=\"kw-highlight\">favorite task</mark> in STEAM? <mark class=\"kw-why\">Why</mark>?",
        questionEs: "¿Cuál fue tu tarea favorita en STEAM? ¿Por qué?",
        parentTip: "Guía papás: Miguel elige cuál tarea le gustó más, oprime el puente verde 'because' y cuenta su razón.",
        usesSteamItems: true,
        needsBecause: true,
        reasons: [
          { en: "it was fun and creative", es: "fue divertido y creativo" },
          { en: "I liked designing and building it", es: "me gustó diseñarlo y construirlo" },
          { en: "I loved using colors and materials", es: "me encantó usar colores y materiales" },
          { en: "it was interesting to make", es: "fue interesante hacerlo" }
        ]
      },
      {
        id: "q2",
        shortLabel: "P2. ¿Más difícil?",
        questionEn: "Was the maze process more difficult than making the dream catcher? Why?",
        questionHtml: "Was the <mark class=\"kw-highlight\">maze process more difficult than</mark> making the <mark class=\"kw-highlight\">dream catcher</mark>? <mark class=\"kw-why\">Why</mark>?",
        questionEs: "¿El proceso del laberinto fue más difícil que hacer el atrapasueños? ¿Por qué?",
        parentTip: "Guía papás: Como empieza con 'Was...', primero responde 'Yes, it was' o 'No, it wasn't' y luego 'because'.",
        needsBecause: true,
        mainOptions: [
          { id: "yes", en: "Yes, it was", es: "Sí lo fue (el laberinto fue más difícil)" },
          { id: "no", en: "No, it wasn't", es: "No lo fue (el atrapasueños fue más difícil)" }
        ],
        reasonsByMain: {
          yes: [
            { en: "the maze had many small parts", es: "el laberinto tenía muchas partes pequeñas" },
            { en: "building the walls took more time", es: "construir las paredes tomó más tiempo" },
            { en: "it needed more planning and patience", es: "necesitó más planeación y paciencia" }
          ],
          no: [
            { en: "weaving the dream catcher was harder for me", es: "tejer el atrapasueños fue más difícil para mí" },
            { en: "tying the thread took more patience", es: "amarrar el hilo tomó más paciencia" },
            { en: "making the maze was easier for me", es: "hacer el laberinto fue más fácil para mí" }
          ]
        }
      },
      {
        id: "q3",
        shortLabel: "P3. Más fácil",
        questionEn: "Which STEAM task was easier for you? And why?",
        questionHtml: "Which STEAM task was <mark class=\"kw-highlight\">easier</mark> for you? And <mark class=\"kw-why\">why</mark>?",
        questionEs: "¿Cuál tarea de STEAM fue más fácil para ti? ¿Y por qué?",
        parentTip: "Guía papás: 'easier' = más fácil. Verifiquen que coincida con su opinión de la Pregunta 2.",
        usesSteamItems: true,
        needsBecause: true,
        reasons: [
          { en: "the steps were clear and simple", es: "los pasos fueron claros y simples" },
          { en: "I used simple materials", es: "usé materiales simples" },
          { en: "I enjoyed making it step by step", es: "disfruté hacerlo paso a paso" },
          { en: "I worked well with my classmates", es: "trabajé bien con mis compañeros" }
        ]
      },
      {
        id: "q4",
        shortLabel: "P4. Más aburrida",
        questionEn: "What was the most boring part of STEAM? Why?",
        questionHtml: "What was the <mark class=\"kw-highlight\">most boring</mark> part of STEAM? <mark class=\"kw-why\">Why</mark>?",
        questionEs: "¿Cuál fue la parte más aburrida de STEAM? ¿Por qué?",
        parentTip: "Guía papás: Puede ser honesto y respetuoso (ej. esperar que seque el pegante o cortar piezas), o decir que todo fue divertido.",
        needsBecause: true,
        mainOptions: [
          { id: "glue", en: "waiting for the glue to dry", es: "esperar a que secara el pegante", positive: false },
          { id: "cutting", en: "cutting the small pieces", es: "cortar las piezas pequeñas", positive: false },
          { id: "repeating", en: "repeating a difficult step", es: "repetir un paso difícil", positive: false },
          { id: "cleaning", en: "cleaning up the materials", es: "recoger y limpiar los materiales", positive: false },
          { id: "nothing", en: "Nothing! Everything was fun", es: "¡Nada! Todo fue divertido", positive: true }
        ],
        reasonsStandard: [
          { en: "it was slow", es: "era lento" },
          { en: "it took a long time", es: "tomó mucho tiempo" },
          { en: "I wanted to keep building", es: "yo quería seguir construyendo" },
          { en: "it was repetitive", es: "era repetitivo" }
        ],
        reasonsPositive: [
          { en: "I liked all the activities", es: "me gustaron todas las actividades" },
          { en: "building with my classmates was exciting", es: "construir con mis compañeros fue emocionante" }
        ]
      },
      {
        id: "q5",
        shortLabel: "P5. ¿Qué aprendiste?",
        questionEn: "What did you learn from this STEAM?",
        questionHtml: "What <mark class=\"kw-highlight\">did you learn</mark> from this STEAM?",
        questionEs: "¿Qué aprendiste de este proyecto STEAM?",
        parentTip: "Guía papás: Esta pregunta no tiene 'Why?'. Lo más importante es responder en pasado: 'I learned...' (nunca 'I did learned').",
        needsBecause: false,
        learnOptions: [
          { id: "lrn-build", en: "how to make a maze and a dream catcher", es: "cómo hacer un laberinto y un atrapasueños" },
          { id: "lrn-words", en: "new English words to compare activities", es: "nuevas palabras en inglés para comparar actividades" },
          { id: "lrn-patience", en: "to work with patience and creativity", es: "a trabajar con paciencia y creatividad" },
          { id: "lrn-news", en: "to write a STEAM newspaper in Past Simple", es: "a escribir un periódico STEAM en pasado simple" }
        ]
      }
    ]
  },

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
    { es: "salon de arte", displayEs: "salón de arte", en: "in the art room" },
    { es: "laboratorio", displayEs: "laboratorio", en: "in the science lab" },
    { es: "biblioteca", displayEs: "biblioteca", en: "in the library" },
    { es: "patio", displayEs: "patio", en: "in the school yard" },
    { es: "cancha", displayEs: "cancha", en: "on the sports field" },
    { es: "auditorio", displayEs: "auditorio", en: "in the auditorium" },
    { es: "salon", displayEs: "salón", en: "in our classroom" },
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
