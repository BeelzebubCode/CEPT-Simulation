export const listeningLongGroups = [
  // ─── GROUP 1: ADAM (answer key: B D A C D) ───────────────────────────────
  {
    passage: 'You will hear Adam talking about his work as an underwater diving instructor. Listen and answer questions 1–5.',
    speechText: `My name is Adam. I first became attracted to underwater diving through my training when I was in the army. It was there that I really discovered a passion for it. When I'm selecting the team I work with underwater, I'm always willing to give young people an opportunity — I think it's important to bring new talent through. You have to feel that the risk involved has to be acknowledged though; it's not something you can ignore. According to my own experience, working in a deep water tank in a studio actually produces less exciting images than filming in real open water. I also dislike using artificial light because it makes my working conditions too unpredictable and difficult to manage.`,
    questions: [
      {
        text: 'How did Adam first become attracted to underwater diving?',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'Through watching a television documentary', isCorrect: false },
          { label: 'B', text: 'Through training he did while in the army', isCorrect: true },   // B ✓
          { label: 'C', text: 'Through a recommendation from a close friend', isCorrect: false },
          { label: 'D', text: 'Through attending a diving course at school', isCorrect: false },
        ],
      },
      {
        text: 'When selecting his underwater team, Adam says he is particularly willing to…',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'choose only divers with formal qualifications', isCorrect: false },
          { label: 'B', text: 'select people who have served in the military', isCorrect: false },
          { label: 'C', text: 'recruit those with the strongest physical ability', isCorrect: false },
          { label: 'D', text: 'offer opportunities to young people', isCorrect: true },           // D ✓
        ],
      },
      {
        text: 'According to Adam, what must be acknowledged when working underwater?',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'The risks that are involved', isCorrect: true },                  // A ✓
          { label: 'B', text: 'The financial cost of the equipment', isCorrect: false },
          { label: 'C', text: 'The importance of teamwork', isCorrect: false },
          { label: 'D', text: 'The impact on marine life', isCorrect: false },
        ],
      },
      {
        text: 'What does Adam say about working in a deep water tank in a studio?',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'It is safer than diving in open water', isCorrect: false },
          { label: 'B', text: 'It produces better quality footage', isCorrect: false },
          { label: 'C', text: 'It results in less exciting images', isCorrect: true },           // C ✓
          { label: 'D', text: 'It is more comfortable for the team', isCorrect: false },
        ],
      },
      {
        text: 'Why does Adam dislike using artificial light?',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'It is too expensive to hire the equipment', isCorrect: false },
          { label: 'B', text: 'It makes the images look unrealistic', isCorrect: false },
          { label: 'C', text: 'It takes a long time to set up correctly', isCorrect: false },
          { label: 'D', text: 'It makes his working conditions too unpredictable', isCorrect: true }, // D ✓
        ],
      },
    ],
  },

  // ─── GROUP 2: ANNA (answer key: B C B A C) ───────────────────────────────
  {
    passage: 'You will hear Anna talking about her job as a journalist. Listen and answer questions 6–10.',
    speechText: `I'm Anna, and I work as a journalist. The thing I enjoy most about my job is definitely meeting new people — every interview brings someone different. Now, I have to say that I don't think the job is as glamorous as most people seem to imagine. In reality it involves a lot of hard, unglamorous work behind the scenes. In my day-to-day work I always try to avoid asking personal questions that aren't really necessary for the story. In my free time I love skiing — it's the hobby I've had the longest and I'd never give it up. I sometimes feel I dislike the way tight deadlines can pile up all at once. And when I think about what's ahead, I have definite plans to write a book about my experiences in journalism.`,
    questions: [
      {
        text: 'What does Anna enjoy most about her work?',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'Writing feature articles on important issues', isCorrect: false },
          { label: 'B', text: 'Meeting a wide variety of different people', isCorrect: true },   // B ✓
          { label: 'C', text: 'Travelling to different countries for stories', isCorrect: false },
          { label: 'D', text: 'Working independently without supervision', isCorrect: false },
        ],
      },
      {
        text: 'What does Anna think about her job as a journalist?',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'It is more exciting than she had expected', isCorrect: false },
          { label: 'B', text: 'It is far more stressful than other careers', isCorrect: false },
          { label: 'C', text: 'It is not as glamorous as people tend to imagine', isCorrect: true }, // C ✓
          { label: 'D', text: 'It requires more travel than she would like', isCorrect: false },
        ],
      },
      {
        text: 'When carrying out her work, Anna tries to avoid…',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'interviewing people she has not met before', isCorrect: false },
          { label: 'B', text: 'asking personal questions that are not needed', isCorrect: true }, // B ✓
          { label: 'C', text: 'working during evenings and weekends', isCorrect: false },
          { label: 'D', text: 'writing about topics she finds difficult', isCorrect: false },
        ],
      },
      {
        text: "What is Anna's main hobby in her free time?",
        difficulty: 'EASY' as const,
        choices: [
          { label: 'A', text: 'Skiing', isCorrect: true },                                       // A ✓
          { label: 'B', text: 'Swimming', isCorrect: false },
          { label: 'C', text: 'Cycling', isCorrect: false },
          { label: 'D', text: 'Rock climbing', isCorrect: false },
        ],
      },
      {
        text: "What are Anna's plans for the future?",
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'To move into television journalism', isCorrect: false },
          { label: 'B', text: 'To retire and travel the world', isCorrect: false },
          { label: 'C', text: 'To write a book about her experiences', isCorrect: true },        // C ✓
          { label: 'D', text: 'To start her own newspaper', isCorrect: false },
        ],
      },
    ],
  },

  // ─── GROUP 3: BEN (answer key: C A C B A) ────────────────────────────────
  {
    passage: 'You will hear Ben talking about where he lives. Listen and answer questions 11–15.',
    speechText: `My name is Ben. I've been living in the city for about three years now. I moved here after finishing university and I have to say I really enjoy city life — there is always something going on, which I find exciting. The area where I live is fantastic; it's particularly good because it's close to a huge variety of restaurants and cafés, which I really take advantage of. I usually get around by cycling — it's by far the most convenient way to travel, and it keeps me fit as well. I suppose one of the best things about living here is that the majority of my close friends have settled in the same area, so we see each other very regularly.`,
    questions: [
      {
        text: 'How long has Ben been living in the city?',
        difficulty: 'EASY' as const,
        choices: [
          { label: 'A', text: 'One year', isCorrect: false },
          { label: 'B', text: 'Two years', isCorrect: false },
          { label: 'C', text: 'Three years', isCorrect: true },                                  // C ✓
          { label: 'D', text: 'Four years', isCorrect: false },
        ],
      },
      {
        text: 'What does Ben enjoy about living in the city?',
        difficulty: 'EASY' as const,
        choices: [
          { label: 'A', text: 'There is always something happening', isCorrect: true },          // A ✓
          { label: 'B', text: 'It is quieter than living in the countryside', isCorrect: false },
          { label: 'C', text: 'The cost of living is lower than elsewhere', isCorrect: false },
          { label: 'D', text: 'The public transport system is excellent', isCorrect: false },
        ],
      },
      {
        text: 'What does Ben particularly like about the area where he lives?',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'It is very peaceful and quiet', isCorrect: false },
          { label: 'B', text: 'It has very good sports facilities nearby', isCorrect: false },
          { label: 'C', text: 'It is close to many restaurants and cafés', isCorrect: true },   // C ✓
          { label: 'D', text: 'It is near the city centre', isCorrect: false },
        ],
      },
      {
        text: 'How does Ben usually travel around the city?',
        difficulty: 'EASY' as const,
        choices: [
          { label: 'A', text: 'By car', isCorrect: false },
          { label: 'B', text: 'By cycling', isCorrect: true },                                   // B ✓
          { label: 'C', text: 'By bus', isCorrect: false },
          { label: 'D', text: 'By walking', isCorrect: false },
        ],
      },
      {
        text: 'What does Ben say about his close friends?',
        difficulty: 'MEDIUM' as const,
        choices: [
          { label: 'A', text: 'Most of them live in the same area as him', isCorrect: true },   // A ✓
          { label: 'B', text: 'They often visit him at the weekend', isCorrect: false },
          { label: 'C', text: 'They have recently moved to the city', isCorrect: false },
          { label: 'D', text: 'They help him with his cycling journeys', isCorrect: false },
        ],
      },
    ],
  },
];
