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
      example: "The Maze / I / favorite task"
    },
    {
      cls: "lego-orange",
      title: "Naranja: Acción en Pasado / Comparativo",
      desc: "El verbo en Past Simple o el adjetivo que compara dos cosas.",
      example: "created / easier than / more difficult than"
    },
    {
      cls: "lego-green",
      title: "Verde: Puente / Conector",
      desc: "Palabras que unen ideas o explican el porqué en inglés.",
      example: "than / because / First, Then, Finally"
    },
    {
      cls: "lego-purple",
      title: "Morado: Cosa 2 / Opinión de Miguel",
      desc: "El segundo elemento a comparar o la razón personal que elige Miguel.",
      example: "the dream catcher / it was creative"
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
        rule: "Corto (-er than)",
        en: "Playing piano is calmer than playing Fortnite on Play.",
        es: "Tocar piano es más tranquilo que jugar Fortnite en Play."
      },
      {
        rule: "Largo (more ... than)",
        en: "MrBeast challenges are more exciting than homework.",
        es: "Los retos de MrBeast son más emocionantes que las tareas."
      },
      {
        rule: "Irregular (better than)",
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
