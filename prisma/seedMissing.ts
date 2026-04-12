/**
 * Additive seed script — adds ONLY the missing questions to existing sections.
 * Safe to run multiple times (checks for duplicates via question text).
 *
 * Usage: npx tsx prisma/seedMissing.ts
 */
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

/* ───────────────────── helpers ───────────────────── */
async function getSection(type: string) {
  const s = await prisma.section.findFirst({ where: { type } });
  if (!s) throw new Error(`Section ${type} not found`);
  return s;
}
async function nextOrder(sectionId: string) {
  const r = await prisma.question.aggregate({ where: { sectionId }, _max: { order: true } });
  return (r._max.order || 0) + 1;
}
async function exists(sectionId: string, text: string) {
  return !!(await prisma.question.findFirst({ where: { sectionId, text } }));
}

/* ================================================================
   PHASE 1 — LISTENING TEXT: 8 missing questions
   ================================================================ */
const missingListeningText = [
  { text: 'In his songs, Steve writes about his:', difficulty: 'MEDIUM' as Difficulty,
    speechText: "Steve: My songs are all about my kids, really. They inspire everything I write. Their little adventures, the funny things they say — it all goes into the music.",
    choices: [{ label: 'A', text: 'travels', isCorrect: false },{ label: 'B', text: 'children', isCorrect: true },{ label: 'C', text: 'hometown', isCorrect: false },{ label: 'D', text: 'childhood memories', isCorrect: false }] },
  { text: 'Steve enjoys recording with his band because:', difficulty: 'MEDIUM' as Difficulty,
    speechText: "Steve: Recording with the band is the best part. We're like a family in there. Everyone supports each other, and the atmosphere is just wonderful.",
    choices: [{ label: 'A', text: "it's like being in a family", isCorrect: true },{ label: 'B', text: "he doesn't have to sing", isCorrect: false },{ label: 'C', text: 'everyone helps write the songs', isCorrect: false },{ label: 'D', text: 'the studio is comfortable', isCorrect: false }] },
  { text: "Two friends are talking. What's the man's new phone number?", difficulty: 'EASY' as Difficulty,
    speechText: "Woman: I've lost your number. What is it again? Man: It's changed actually. My new number is zero seven, two eight four four, seven nine eight. Woman: Let me read that back — oh seven, two eight four four, seven nine eight? Man: That's right.",
    choices: [{ label: 'A', text: '07 2844 789', isCorrect: false },{ label: 'B', text: '07 2844 798', isCorrect: true },{ label: 'C', text: '07 2848 798', isCorrect: false },{ label: 'D', text: '07 2844 978', isCorrect: false }] },
  { text: 'What does the woman like about the clothes he designs?', difficulty: 'MEDIUM' as Difficulty,
    speechText: "Woman: I love your designs! They're so unique. I've never seen anything like them before. They're completely original. Man: Thank you, that means a lot to me.",
    choices: [{ label: 'A', text: 'They are comfortable', isCorrect: false },{ label: 'B', text: 'They are affordable', isCorrect: false },{ label: 'C', text: 'They are original', isCorrect: true },{ label: 'D', text: 'They are colourful', isCorrect: false }] },
  { text: 'What is the woman giving advice about?', difficulty: 'MEDIUM' as Difficulty,
    speechText: "Woman: The best thing you can do is go through all your stuff and just throw away anything you haven't used in a year. You'll feel so much better with less clutter around the house.",
    choices: [{ label: 'A', text: 'Throwing things away', isCorrect: true },{ label: 'B', text: 'Organising a party', isCorrect: false },{ label: 'C', text: 'Saving money', isCorrect: false },{ label: 'D', text: 'Cooking healthy meals', isCorrect: false }] },
  { text: 'What time is the party on Saturday?', difficulty: 'EASY' as Difficulty,
    speechText: "Man: The party is this Saturday. It starts at half past two in the afternoon. Don't be late! We're meeting at Sarah's house. Woman: Great, see you at two thirty then!",
    choices: [{ label: 'A', text: '1:30', isCorrect: false },{ label: 'B', text: '2:00', isCorrect: false },{ label: 'C', text: '2:30', isCorrect: true },{ label: 'D', text: '3:00', isCorrect: false }] },
  { text: "Which day is Jimmy's guitar lesson?", difficulty: 'EASY' as Difficulty,
    speechText: "Mother: Jimmy has his guitar lesson every Thursday after school. His teacher Mr Hendricks comes to the house at four o'clock. Jimmy always looks forward to Thursdays.",
    choices: [{ label: 'A', text: 'Thursday', isCorrect: true },{ label: 'B', text: 'Tuesday', isCorrect: false },{ label: 'C', text: 'Wednesday', isCorrect: false },{ label: 'D', text: 'Friday', isCorrect: false }] },
  { text: 'What does the woman like about Holidays in Europe?', difficulty: 'MEDIUM' as Difficulty,
    speechText: "Woman: It's a wonderful guide overall. I love the beautiful photographs and the descriptions are excellent. The only problem is the maps — they're quite small and hard to read.",
    choices: [{ label: 'A', text: 'the photographs', isCorrect: true },{ label: 'B', text: 'the maps', isCorrect: false },{ label: 'C', text: 'the price', isCorrect: false },{ label: 'D', text: 'the index', isCorrect: false }] },
];

/* ================================================================
   PHASE 2 — LISTENING IMAGE: 17 missing questions
   ================================================================ */
const missingListeningImage = [
  { text: 'Which girl is Sarah?', difficulty: 'EASY' as Difficulty,
    speechText: "Man: Which one is Sarah? Woman: She's the tall girl with long dark hair, wearing the striped top. She's standing near the window.",
    choices: [{ label: 'A', text: 'The short girl with blonde hair', isCorrect: false },{ label: 'B', text: 'The girl with glasses reading a book', isCorrect: false },{ label: 'C', text: 'The tall girl with long dark hair in a striped top', isCorrect: true }] },
  { text: 'How does the man go to work?', difficulty: 'EASY' as Difficulty,
    speechText: "Woman: How do you get to work these days? Man: I used to drive but now I cycle. It's much better for me and the environment. Takes about twenty minutes.",
    choices: [{ label: 'A', text: 'By car', isCorrect: false },{ label: 'B', text: 'By bicycle', isCorrect: true },{ label: 'C', text: 'By bus', isCorrect: false }] },
  { text: "What color is Mary's coat?", difficulty: 'EASY' as Difficulty,
    speechText: "Man: Is that Mary over there? Woman: Which one? Man: The one in the red coat by the door. Woman: Yes, that's her.",
    choices: [{ label: 'A', text: 'Blue', isCorrect: false },{ label: 'B', text: 'Red', isCorrect: true },{ label: 'C', text: 'Green', isCorrect: false }] },
  { text: "What is the man's favorite sport?", difficulty: 'EASY' as Difficulty,
    speechText: "Woman: Do you play any sports? Man: I play tennis sometimes and I go swimming, but football is my real passion. I play every weekend with my friends.",
    choices: [{ label: 'A', text: 'Tennis', isCorrect: false },{ label: 'B', text: 'Swimming', isCorrect: false },{ label: 'C', text: 'Football', isCorrect: true }] },
  { text: 'What time does the film finish?', difficulty: 'EASY' as Difficulty,
    speechText: "Man: The film starts at seven fifteen and it's about two hours long, so it should finish at around quarter past nine. Woman: OK, I'll pick you up at nine fifteen then.",
    choices: [{ label: 'A', text: '8:45', isCorrect: false },{ label: 'B', text: '9:00', isCorrect: false },{ label: 'C', text: '9:15', isCorrect: true }] },
  { text: 'What will Tim and his dad play today?', difficulty: 'EASY' as Difficulty,
    speechText: "Tim: Dad, can we play football today? Dad: Sorry Tim, the garden's too wet. How about a board game instead? We could play chess. Tim: OK, chess sounds fun!",
    choices: [{ label: 'A', text: 'Football', isCorrect: false },{ label: 'B', text: 'Chess', isCorrect: true },{ label: 'C', text: 'Tennis', isCorrect: false }] },
  { text: 'What will they do today?', difficulty: 'EASY' as Difficulty,
    speechText: "Woman: Shall we go to the beach today? Man: It looks like rain. Why don't we go to the cinema instead? Woman: Good idea. There's a new comedy on.",
    choices: [{ label: 'A', text: 'Go to the beach', isCorrect: false },{ label: 'B', text: 'Stay at home', isCorrect: false },{ label: 'C', text: 'Go to the cinema', isCorrect: true }] },
  { text: 'When will the shop open again?', difficulty: 'EASY' as Difficulty,
    speechText: "This is a recorded message. The shop is currently closed for refurbishment. We will reopen on Monday the fifteenth of March. We apologise for any inconvenience.",
    choices: [{ label: 'A', text: 'Saturday', isCorrect: false },{ label: 'B', text: 'Monday', isCorrect: true },{ label: 'C', text: 'Wednesday', isCorrect: false }] },
  { text: 'Where will the man leave his car tonight?', difficulty: 'EASY' as Difficulty,
    speechText: "Woman: Where are you going to park? Man: I'll leave the car in the garage tonight. It's supposed to be very cold and I don't want ice on the windscreen.",
    choices: [{ label: 'A', text: 'On the street', isCorrect: false },{ label: 'B', text: 'In a car park', isCorrect: false },{ label: 'C', text: 'In the garage', isCorrect: true }] },
  { text: "Which platform does the woman's train leave from?", difficulty: 'EASY' as Difficulty,
    speechText: "Woman: Excuse me, which platform for the London train? Man: That's platform three. It leaves in about ten minutes. Woman: Thank you!",
    choices: [{ label: 'A', text: 'Platform 1', isCorrect: false },{ label: 'B', text: 'Platform 2', isCorrect: false },{ label: 'C', text: 'Platform 3', isCorrect: true }] },
  { text: 'What size does the woman buy?', difficulty: 'EASY' as Difficulty,
    speechText: "Woman: Have you got this dress in a medium? Assistant: I'm sorry, we've only got small and large left. Woman: I'll try the large then. It might be OK.",
    choices: [{ label: 'A', text: 'Small', isCorrect: false },{ label: 'B', text: 'Medium', isCorrect: false },{ label: 'C', text: 'Large', isCorrect: true }] },
  { text: 'What time does the concert start?', difficulty: 'EASY' as Difficulty,
    speechText: "Man: What time does the concert start? Woman: The doors open at seven but the band doesn't come on stage until half past seven. Man: So seven thirty — let's get there early.",
    choices: [{ label: 'A', text: '7:00', isCorrect: false },{ label: 'B', text: '7:30', isCorrect: true },{ label: 'C', text: '8:00', isCorrect: false }] },
  { text: 'Where is Marianna talking to Jack?', difficulty: 'MEDIUM' as Difficulty,
    speechText: "Jack: It's so noisy in here with all these people eating and the clatter of dishes. Marianna: I know. Let's finish our coffee and find somewhere quieter.",
    choices: [{ label: 'A', text: 'In a library', isCorrect: false },{ label: 'B', text: 'In a restaurant or café', isCorrect: true },{ label: 'C', text: 'In a park', isCorrect: false }] },
  { text: 'What happened to the girl this afternoon?', difficulty: 'MEDIUM' as Difficulty,
    speechText: "Girl: You won't believe what happened! I was riding my bicycle to the shops and I went over a big stone. I fell off and hurt my knee. Mum had to come and pick me up.",
    choices: [{ label: 'A', text: 'She lost her bag', isCorrect: false },{ label: 'B', text: 'She missed the bus', isCorrect: false },{ label: 'C', text: 'She fell off her bicycle', isCorrect: true }] },
  { text: 'Which yoga position has the man found beneficial?', difficulty: 'MEDIUM' as Difficulty,
    speechText: "Man: I've tried lots of different yoga positions but the one that helps my back the most is the tree pose. You stand on one leg with your arms above your head. It's really improved my balance too.",
    choices: [{ label: 'A', text: 'The warrior pose', isCorrect: false },{ label: 'B', text: 'The downward dog', isCorrect: false },{ label: 'C', text: 'The tree pose', isCorrect: true }] },
  { text: 'Where will they sit?', difficulty: 'EASY' as Difficulty,
    speechText: "Man: Shall we sit inside or outside? Woman: It's such a lovely day, let's sit in the garden. Man: Good idea, there's a free table by the fountain.",
    choices: [{ label: 'A', text: 'Inside near the window', isCorrect: false },{ label: 'B', text: 'In the garden', isCorrect: true },{ label: 'C', text: 'At the bar', isCorrect: false }] },
  { text: 'Where is the new café?', difficulty: 'EASY' as Difficulty,
    speechText: "Woman: Have you seen the new café? It's right next to the bookshop on the main street. Man: Oh yes, I walked past it yesterday. It looks really nice.",
    choices: [{ label: 'A', text: 'Next to the bookshop', isCorrect: true },{ label: 'B', text: 'Opposite the bank', isCorrect: false },{ label: 'C', text: 'Behind the cinema', isCorrect: false }] },
];

/* ================================================================
   PHASE 3 — READING FILL IN THE BLANK: missing passages
   ================================================================ */
type FBQ = {
  text: string; difficulty: Difficulty; passage: string;
  blanks: { blankNumber: number; choices: { label: string; text: string; isCorrect: boolean }[] }[];
};
const missingFillBlank: FBQ[] = [
  // 13. John Ruskin (2) — different from Ruskin 1 already in DB
  { text: 'Fill in all the blanks in the passage.', difficulty: 'HARD' as Difficulty,
    passage: "In the nineteenth century, John Ruskin, an English writer and art critic, made great efforts to encourage people to draw. His ideas were [1]_____ known across Europe. His teaching [2]_____ at developing a deeper understanding of art. He believed that anyone could learn to [3]_____ beautiful drawings. His influence has [4]_____ to shape art education even today. It takes real [5]_____ of Ruskin's work to appreciate his legacy.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'narrowly',isCorrect:false},{label:'B',text:'widely',isCorrect:true},{label:'C',text:'hardly',isCorrect:false},{label:'D',text:'slightly',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'aimed',isCorrect:true},{label:'B',text:'pointed',isCorrect:false},{label:'C',text:'directed',isCorrect:false},{label:'D',text:'focused',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'make',isCorrect:true},{label:'B',text:'do',isCorrect:false},{label:'C',text:'have',isCorrect:false},{label:'D',text:'get',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'gone',isCorrect:false},{label:'B',text:'arrived',isCorrect:false},{label:'C',text:'reached',isCorrect:false},{label:'D',text:'come',isCorrect:true}] },
      { blankNumber: 5, choices: [{label:'A',text:'understanding',isCorrect:true},{label:'B',text:'knowledge',isCorrect:false},{label:'C',text:'learning',isCorrect:false},{label:'D',text:'study',isCorrect:false}] },
    ] },
  // Amelia Earhart
  { text: 'Fill in all the blanks in the passage.', difficulty: 'MEDIUM' as Difficulty,
    passage: "Amelia Earhart, the pioneering woman pilot, had [1]_____ first flying lesson in January 1921. She convinced herself that she was destined [2]_____ fly. She saved up money and [3]_____ bought her own plane. She flew it [4]_____ the country, setting several records. She had [5]_____ money to support her dream of aviation.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'her',isCorrect:true},{label:'B',text:'the',isCorrect:false},{label:'C',text:'a',isCorrect:false},{label:'D',text:'his',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'for',isCorrect:false},{label:'B',text:'to',isCorrect:true},{label:'C',text:'at',isCorrect:false},{label:'D',text:'with',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'then',isCorrect:true},{label:'B',text:'soon',isCorrect:false},{label:'C',text:'later',isCorrect:false},{label:'D',text:'after',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'around',isCorrect:true},{label:'B',text:'through',isCorrect:false},{label:'C',text:'over',isCorrect:false},{label:'D',text:'across',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'enough',isCorrect:true},{label:'B',text:'plenty',isCorrect:false},{label:'C',text:'lots',isCorrect:false},{label:'D',text:'much',isCorrect:false}] },
    ] },
  // Board games in cafés
  { text: 'Fill in all the blanks in the passage.', difficulty: 'MEDIUM' as Difficulty,
    passage: "In cities across Canada, you might be struck by the number of cafés [1]_____ solely to the playing of board games. Many of them have [2]_____ up in recent years. They follow a simple [3]_____ of combining food with fun. The atmosphere appeals to [4]_____ people who enjoy socialising. Customers often become [5]_____ to their favourite games and visit regularly.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'designed',isCorrect:true},{label:'B',text:'built',isCorrect:false},{label:'C',text:'made',isCorrect:false},{label:'D',text:'planned',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'grown',isCorrect:false},{label:'B',text:'sprung',isCorrect:true},{label:'C',text:'come',isCorrect:false},{label:'D',text:'turned',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'model',isCorrect:true},{label:'B',text:'plan',isCorrect:false},{label:'C',text:'idea',isCorrect:false},{label:'D',text:'system',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'outgoing',isCorrect:true},{label:'B',text:'quiet',isCorrect:false},{label:'C',text:'lonely',isCorrect:false},{label:'D',text:'shy',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'attached',isCorrect:false},{label:'B',text:'glued to',isCorrect:true},{label:'C',text:'stuck',isCorrect:false},{label:'D',text:'fixed',isCorrect:false}] },
    ] },
  // Cheap English Books
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "Have you just started to learn English? Do you want to buy some English books [1]_____ beginners? We [2]_____ many different titles available. You can borrow [3]_____ from the library too. We have [4]_____ books arriving every week. Our shop [5]_____ be open all day Saturday.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'For',isCorrect:true},{label:'B',text:'To',isCorrect:false},{label:'C',text:'At',isCorrect:false},{label:'D',text:'With',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'have',isCorrect:true},{label:'B',text:'has',isCorrect:false},{label:'C',text:'had',isCorrect:false},{label:'D',text:'having',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'them',isCorrect:true},{label:'B',text:'it',isCorrect:false},{label:'C',text:'those',isCorrect:false},{label:'D',text:'one',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'more',isCorrect:true},{label:'B',text:'much',isCorrect:false},{label:'C',text:'most',isCorrect:false},{label:'D',text:'many',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'will',isCorrect:true},{label:'B',text:'would',isCorrect:false},{label:'C',text:'shall',isCorrect:false},{label:'D',text:'can',isCorrect:false}] },
    ] },
  // Computer game review
  { text: 'Fill in all the blanks in the passage.', difficulty: 'MEDIUM' as Difficulty,
    passage: "This game seems to tick all [1]_____ right boxes. It draws the gaming community [2]_____ with exciting multiplayer modes. It is an action game in [3]_____ players pilot spacecraft through dangerous territory. There is also a chance to collaborate [4]_____ one another in co-op missions. [5]_____ not a lot of the game is original, it's still hugely entertaining.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'the',isCorrect:true},{label:'B',text:'a',isCorrect:false},{label:'C',text:'some',isCorrect:false},{label:'D',text:'every',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'in',isCorrect:false},{label:'B',text:'on',isCorrect:true},{label:'C',text:'up',isCorrect:false},{label:'D',text:'at',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'which',isCorrect:true},{label:'B',text:'that',isCorrect:false},{label:'C',text:'where',isCorrect:false},{label:'D',text:'what',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'with',isCorrect:true},{label:'B',text:'to',isCorrect:false},{label:'C',text:'for',isCorrect:false},{label:'D',text:'at',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'Although',isCorrect:true},{label:'B',text:'Because',isCorrect:false},{label:'C',text:'Since',isCorrect:false},{label:'D',text:'Unless',isCorrect:false}] },
    ] },
  // Graphology at work
  { text: 'Fill in all the blanks in the passage.', difficulty: 'HARD' as Difficulty,
    passage: "Graphology, the science of analysing handwriting, is used by recruitment personnel in many companies. Job applicants [1]_____ often asked to provide a handwriting sample. The analysts pay close attention [2]_____ the size and shape of the letters. The slant [3]_____ the writing is also considered important. There is much debate [4]_____ whether graphology is truly scientific. However, many employers combine it [5]_____ other assessment methods.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'are',isCorrect:true},{label:'B',text:'is',isCorrect:false},{label:'C',text:'were',isCorrect:false},{label:'D',text:'been',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'to',isCorrect:true},{label:'B',text:'at',isCorrect:false},{label:'C',text:'on',isCorrect:false},{label:'D',text:'for',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'of',isCorrect:true},{label:'B',text:'in',isCorrect:false},{label:'C',text:'at',isCorrect:false},{label:'D',text:'for',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'about',isCorrect:true},{label:'B',text:'on',isCorrect:false},{label:'C',text:'with',isCorrect:false},{label:'D',text:'for',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'with',isCorrect:true},{label:'B',text:'to',isCorrect:false},{label:'C',text:'by',isCorrect:false},{label:'D',text:'for',isCorrect:false}] },
    ] },
  // Graphology with Eleanor Sturgeon
  { text: 'Fill in all the blanks in the passage.', difficulty: 'HARD' as Difficulty,
    passage: "Can your handwriting reveal anything at all concerning your character? Enough, perhaps, to decide whether you will get the job you applied [1]_____. Graphologists look at [2]_____ you form your letters. They analyse the pressure [3]_____ the way you connect strokes. Supporters trust the method [4]_____ it has been used for centuries. Critics say more research needs to [5]_____ been done.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'for',isCorrect:true},{label:'B',text:'to',isCorrect:false},{label:'C',text:'at',isCorrect:false},{label:'D',text:'with',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'how',isCorrect:true},{label:'B',text:'what',isCorrect:false},{label:'C',text:'which',isCorrect:false},{label:'D',text:'who',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'and',isCorrect:true},{label:'B',text:'but',isCorrect:false},{label:'C',text:'or',isCorrect:false},{label:'D',text:'so',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'because',isCorrect:true},{label:'B',text:'although',isCorrect:false},{label:'C',text:'unless',isCorrect:false},{label:'D',text:'while',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'have',isCorrect:true},{label:'B',text:'has',isCorrect:false},{label:'C',text:'had',isCorrect:false},{label:'D',text:'be',isCorrect:false}] },
    ] },
  // Diamonds are forever
  { text: 'Fill in all the blanks in the passage.', difficulty: 'HARD' as Difficulty,
    passage: "The word 'diamond' comes from the Greek word 'adamas', meaning 'unconquerable'. Diamonds have been a source of fascination for centuries. They are [1]_____ of the hardest substances on Earth. [2]_____ formed deep underground, they take millions of years to reach the surface. Diamonds [3]_____ are of gem quality are extremely rare. The value [4]_____ a diamond is determined by its cut, colour and clarity. Diamonds have been treasured [5]_____ ancient times.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'one',isCorrect:true},{label:'B',text:'some',isCorrect:false},{label:'C',text:'any',isCorrect:false},{label:'D',text:'few',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'being',isCorrect:true},{label:'B',text:'been',isCorrect:false},{label:'C',text:'be',isCorrect:false},{label:'D',text:'are',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'which',isCorrect:true},{label:'B',text:'who',isCorrect:false},{label:'C',text:'what',isCorrect:false},{label:'D',text:'where',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'of',isCorrect:true},{label:'B',text:'for',isCorrect:false},{label:'C',text:'to',isCorrect:false},{label:'D',text:'by',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'since',isCorrect:true},{label:'B',text:'from',isCorrect:false},{label:'C',text:'for',isCorrect:false},{label:'D',text:'during',isCorrect:false}] },
    ] },
  // Dear Maria
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "It's good to be back home in my country but I still think [1]_____ all the friends I made in our English class, especially you. I was sad [2]_____ I left England because my visit [3]_____ too short. I would [4]_____ to return to England but [5]_____ time I will stay for a longer time. Sophie",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'about',isCorrect:true},{label:'B',text:'for',isCorrect:false},{label:'C',text:'of',isCorrect:false},{label:'D',text:'with',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'when',isCorrect:true},{label:'B',text:'because',isCorrect:false},{label:'C',text:'after',isCorrect:false},{label:'D',text:'while',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'was',isCorrect:true},{label:'B',text:'is',isCorrect:false},{label:'C',text:'were',isCorrect:false},{label:'D',text:'be',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'like',isCorrect:true},{label:'B',text:'want',isCorrect:false},{label:'C',text:'hope',isCorrect:false},{label:'D',text:'wish',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'this',isCorrect:true},{label:'B',text:'next',isCorrect:false},{label:'C',text:'that',isCorrect:false},{label:'D',text:'some',isCorrect:false}] },
    ] },
  // Dear Lorna
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "How are you? I've got a job in the Tourist Information Office. I start work at half past seven, so I [1]_____ to get up very early! I love the job. A large [2]_____ of tourists come in every day asking [3]_____ places to visit. I always recommend [4]_____ castle — it's beautiful. I'm [5]_____ my uniform today for the first time!",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'have',isCorrect:true},{label:'B',text:'must',isCorrect:false},{label:'C',text:'need',isCorrect:false},{label:'D',text:'should',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'number',isCorrect:true},{label:'B',text:'amount',isCorrect:false},{label:'C',text:'group',isCorrect:false},{label:'D',text:'crowd',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'about',isCorrect:true},{label:'B',text:'for',isCorrect:false},{label:'C',text:'of',isCorrect:false},{label:'D',text:'on',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'the',isCorrect:true},{label:'B',text:'a',isCorrect:false},{label:'C',text:'this',isCorrect:false},{label:'D',text:'that',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'in',isCorrect:true},{label:'B',text:'on',isCorrect:false},{label:'C',text:'at',isCorrect:false},{label:'D',text:'wearing',isCorrect:false}] },
    ] },
  // Dear Sir
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "Dear Sir, I read your advertisement for English courses in the newspaper. I would [1]_____ to have some more information. How [2]_____ does a four-week course cost? Can I study [3]_____ Saturday mornings? I want [4]_____ improve my English for work. Please reply to [5]_____ email address. Yours faithfully",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'like',isCorrect:true},{label:'B',text:'want',isCorrect:false},{label:'C',text:'wish',isCorrect:false},{label:'D',text:'hope',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'much',isCorrect:true},{label:'B',text:'many',isCorrect:false},{label:'C',text:'more',isCorrect:false},{label:'D',text:'most',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'on',isCorrect:true},{label:'B',text:'at',isCorrect:false},{label:'C',text:'in',isCorrect:false},{label:'D',text:'for',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'to',isCorrect:true},{label:'B',text:'for',isCorrect:false},{label:'C',text:'at',isCorrect:false},{label:'D',text:'with',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'this',isCorrect:true},{label:'B',text:'that',isCorrect:false},{label:'C',text:'my',isCorrect:false},{label:'D',text:'the',isCorrect:false}] },
    ] },
  // Eating your greens
  { text: 'Fill in all the blanks in the passage.', difficulty: 'HARD' as Difficulty,
    passage: "Eating my greens is something I've always enjoyed. As a child, I'd happily [1]_____ my way through large servings of green vegetables. I loved the way they looked, [2]_____ with butter. There is such a [3]_____ of leafy vegetables available today. They are an excellent [4]_____ of vitamins and minerals. The [5]_____ nutrients in cooked greens are still highly beneficial.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'munch',isCorrect:true},{label:'B',text:'eat',isCorrect:false},{label:'C',text:'chew',isCorrect:false},{label:'D',text:'bite',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'shining',isCorrect:false},{label:'B',text:'glistening',isCorrect:true},{label:'C',text:'glowing',isCorrect:false},{label:'D',text:'sparkling',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'diversity',isCorrect:true},{label:'B',text:'variety',isCorrect:false},{label:'C',text:'range',isCorrect:false},{label:'D',text:'selection',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'source',isCorrect:true},{label:'B',text:'supply',isCorrect:false},{label:'C',text:'provider',isCorrect:false},{label:'D',text:'origin',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'remaining',isCorrect:true},{label:'B',text:'lasting',isCorrect:false},{label:'C',text:'staying',isCorrect:false},{label:'D',text:'keeping',isCorrect:false}] },
    ] },
  // Henry Davies
  { text: 'Fill in all the blanks in the passage.', difficulty: 'MEDIUM' as Difficulty,
    passage: "In 1948 businessman Henry Davies was reading a newspaper when he suddenly [1]_____ across an advertisement that changed his life. He applied [2]_____ the position immediately. He wasn't sure [3]_____ to expect. The interview convinced him [4]_____ this was his calling. He went on [5]_____ become one of the most successful entrepreneurs of his era.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'came',isCorrect:true},{label:'B',text:'ran',isCorrect:false},{label:'C',text:'went',isCorrect:false},{label:'D',text:'got',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'for',isCorrect:true},{label:'B',text:'to',isCorrect:false},{label:'C',text:'at',isCorrect:false},{label:'D',text:'with',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'what',isCorrect:true},{label:'B',text:'which',isCorrect:false},{label:'C',text:'how',isCorrect:false},{label:'D',text:'that',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'that',isCorrect:true},{label:'B',text:'which',isCorrect:false},{label:'C',text:'what',isCorrect:false},{label:'D',text:'this',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'to',isCorrect:true},{label:'B',text:'and',isCorrect:false},{label:'C',text:'for',isCorrect:false},{label:'D',text:'with',isCorrect:false}] },
    ] },
  // Honey
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "Honey [1]_____ one of nature's most remarkable foods. It has been used [2]_____ a sweetener for thousands of years. [3]_____ are many different types of honey available. Bees collect nectar [4]_____ flowers to produce it. [5]_____ taste depends on which flowers the bees visit.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'Is',isCorrect:true},{label:'B',text:'Are',isCorrect:false},{label:'C',text:'Was',isCorrect:false},{label:'D',text:'Be',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'As',isCorrect:true},{label:'B',text:'like',isCorrect:false},{label:'C',text:'for',isCorrect:false},{label:'D',text:'to',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'There',isCorrect:true},{label:'B',text:'They',isCorrect:false},{label:'C',text:'These',isCorrect:false},{label:'D',text:'Those',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'on',isCorrect:true},{label:'B',text:'from',isCorrect:false},{label:'C',text:'at',isCorrect:false},{label:'D',text:'in',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'The',isCorrect:true},{label:'B',text:'A',isCorrect:false},{label:'C',text:'Its',isCorrect:false},{label:'D',text:'Their',isCorrect:false}] },
    ] },
  // Hello Silvio
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "Hello Silvio, There's [1]_____ to be an extra swimming competition next week and not [2]_____ people in the team [3]_____ free to compete. Jane [4]_____ you to swim in six races! Is that [5]_____ much swimming for you?",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'going',isCorrect:true},{label:'B',text:'being',isCorrect:false},{label:'C',text:'having',isCorrect:false},{label:'D',text:'making',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'enough',isCorrect:true},{label:'B',text:'many',isCorrect:false},{label:'C',text:'much',isCorrect:false},{label:'D',text:'some',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'are',isCorrect:true},{label:'B',text:'is',isCorrect:false},{label:'C',text:'were',isCorrect:false},{label:'D',text:'was',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'wants',isCorrect:true},{label:'B',text:'asks',isCorrect:false},{label:'C',text:'needs',isCorrect:false},{label:'D',text:'tells',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'too',isCorrect:true},{label:'B',text:'very',isCorrect:false},{label:'C',text:'so',isCorrect:false},{label:'D',text:'really',isCorrect:false}] },
    ] },
  // Hi Helga (seaside trip)
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "Hi Helga! I went to [1]_____ seaside last Saturday. I was feeling fed [2]_____ and wanted some fresh air. I had always been scared [3]_____ the big rides at the fairground. But actually it was [4]_____ fun! You should come [5]_____ me next time.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'the',isCorrect:true},{label:'B',text:'a',isCorrect:false},{label:'C',text:'that',isCorrect:false},{label:'D',text:'this',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'up',isCorrect:true},{label:'B',text:'down',isCorrect:false},{label:'C',text:'out',isCorrect:false},{label:'D',text:'off',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'of',isCorrect:true},{label:'B',text:'about',isCorrect:false},{label:'C',text:'from',isCorrect:false},{label:'D',text:'for',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'much',isCorrect:true},{label:'B',text:'very',isCorrect:false},{label:'C',text:'so',isCorrect:false},{label:'D',text:'really',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'with',isCorrect:false},{label:'B',text:'to',isCorrect:false},{label:'C',text:'for',isCorrect:false},{label:'D',text:'time',isCorrect:true}] },
    ] },
  // Hi Jan (holiday)
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "Hi Jan! Dad and I are having a lovely time on holiday here. We go to the beach every day and [1]_____ is a lot to do at the hotel in the evenings. It's perfect [2]_____ families. We [3]_____ at the hotel at midday for lunch. Tomorrow we [4]_____ a barbecue on the beach. [5]_____ you soon! Love, Emma",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'there',isCorrect:true},{label:'B',text:'it',isCorrect:false},{label:'C',text:'here',isCorrect:false},{label:'D',text:'that',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'for',isCorrect:true},{label:'B',text:'to',isCorrect:false},{label:'C',text:'with',isCorrect:false},{label:'D',text:'at',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'arrive',isCorrect:true},{label:'B',text:'come',isCorrect:false},{label:'C',text:'get',isCorrect:false},{label:'D',text:'reach',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'have',isCorrect:true},{label:'B',text:'make',isCorrect:false},{label:'C',text:'do',isCorrect:false},{label:'D',text:'take',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'See',isCorrect:true},{label:'B',text:'Meet',isCorrect:false},{label:'C',text:'Look',isCorrect:false},{label:'D',text:'Watch',isCorrect:false}] },
    ] },
  // Hello Sergei
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "Hello Sergei, I am studying very hard at the moment. I find [1]_____ lot of the subjects difficult, but [2]_____ are all very interesting. I hope I can get a good job when I [3]_____ finished the course. I would [4]_____ to go and work [5]_____ another country because I enjoy travelling. Alice",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'a',isCorrect:true},{label:'B',text:'the',isCorrect:false},{label:'C',text:'this',isCorrect:false},{label:'D',text:'some',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'they',isCorrect:true},{label:'B',text:'it',isCorrect:false},{label:'C',text:'we',isCorrect:false},{label:'D',text:'these',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'have',isCorrect:true},{label:'B',text:'has',isCorrect:false},{label:'C',text:'had',isCorrect:false},{label:'D',text:'am',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'would',isCorrect:false},{label:'B',text:'want',isCorrect:false},{label:'C',text:'wish',isCorrect:false},{label:'D',text:'like',isCorrect:true}] },
      { blankNumber: 5, choices: [{label:'A',text:'in',isCorrect:true},{label:'B',text:'at',isCorrect:false},{label:'C',text:'to',isCorrect:false},{label:'D',text:'on',isCorrect:false}] },
    ] },
  // Juggling
  { text: 'Fill in all the blanks in the passage.', difficulty: 'MEDIUM' as Difficulty,
    passage: "Juggling involves throwing a number of objects up into the air and catching them [1]_____ dropping a single one. Probably the most common objects used are balls, but [2]_____ of balls some jugglers use clubs or rings. Jugglers often perform [3]_____ circuses and at festivals. The art [4]_____ juggling dates back thousands of years. It is practised [5]_____ people of all ages around the world.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'without',isCorrect:true},{label:'B',text:'despite',isCorrect:false},{label:'C',text:'unless',isCorrect:false},{label:'D',text:'except',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'instead',isCorrect:true},{label:'B',text:'because',isCorrect:false},{label:'C',text:'rather',isCorrect:false},{label:'D',text:'apart',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'in',isCorrect:true},{label:'B',text:'at',isCorrect:false},{label:'C',text:'on',isCorrect:false},{label:'D',text:'by',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'of',isCorrect:true},{label:'B',text:'for',isCorrect:false},{label:'C',text:'in',isCorrect:false},{label:'D',text:'to',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'by',isCorrect:true},{label:'B',text:'for',isCorrect:false},{label:'C',text:'to',isCorrect:false},{label:'D',text:'with',isCorrect:false}] },
    ] },
  // Light pollution
  { text: 'Fill in all the blanks in the passage.', difficulty: 'MEDIUM' as Difficulty,
    passage: "Light pollution occurs when powerful electric lights around us stop us seeing the stars in the night sky. Amazingly, many city dwellers [1]_____ never seen the Milky Way. The problem is [2]_____ just about astronomy — it affects wildlife too. Animals that navigate [3]_____ the stars become disoriented. Light pollution is increasing [4]_____ a result of urbanisation. Responsible lighting combined [5]_____ better planning can help reduce the problem.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'have',isCorrect:true},{label:'B',text:'has',isCorrect:false},{label:'C',text:'had',isCorrect:false},{label:'D',text:'having',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'not',isCorrect:true},{label:'B',text:'none',isCorrect:false},{label:'C',text:'neither',isCorrect:false},{label:'D',text:'never',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'by',isCorrect:true},{label:'B',text:'with',isCorrect:false},{label:'C',text:'from',isCorrect:false},{label:'D',text:'at',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'as',isCorrect:true},{label:'B',text:'like',isCorrect:false},{label:'C',text:'for',isCorrect:false},{label:'D',text:'by',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'with',isCorrect:true},{label:'B',text:'to',isCorrect:false},{label:'C',text:'by',isCorrect:false},{label:'D',text:'for',isCorrect:false}] },
    ] },
  // Newmarket letter
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "Newmarket, England, 20th July. Dear Maria, How are you? I'm studying hard [1]_____ England. I have lessons for five [2]_____ a day. I am beginning [3]_____ understand more English now. Last weekend I [4]_____ to London and visited the British Museum. It was [5]_____ interesting!",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'in',isCorrect:true},{label:'B',text:'at',isCorrect:false},{label:'C',text:'on',isCorrect:false},{label:'D',text:'to',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'hours',isCorrect:true},{label:'B',text:'times',isCorrect:false},{label:'C',text:'periods',isCorrect:false},{label:'D',text:'lessons',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'to',isCorrect:true},{label:'B',text:'for',isCorrect:false},{label:'C',text:'at',isCorrect:false},{label:'D',text:'with',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'went',isCorrect:true},{label:'B',text:'go',isCorrect:false},{label:'C',text:'gone',isCorrect:false},{label:'D',text:'going',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'very',isCorrect:true},{label:'B',text:'much',isCorrect:false},{label:'C',text:'so',isCorrect:false},{label:'D',text:'too',isCorrect:false}] },
    ] },
  // The hot river
  { text: 'Fill in all the blanks in the passage.', difficulty: 'HARD' as Difficulty,
    passage: "Deep in the Amazon jungle there's an amazing natural phenomenon: a river so hot it almost boils. How on [1]_____ is that possible? Geologists speak [2]_____ volcanic activity beneath the surface. The heat [3]_____ raise water temperature to dangerous levels. Scientists want [4]_____ be sure the heat source is fully understood. The area needs [5]_____ protected from development.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'earth',isCorrect:true},{label:'B',text:'world',isCorrect:false},{label:'C',text:'land',isCorrect:false},{label:'D',text:'ground',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'Of',isCorrect:true},{label:'B',text:'About',isCorrect:false},{label:'C',text:'On',isCorrect:false},{label:'D',text:'For',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'Can',isCorrect:true},{label:'B',text:'Must',isCorrect:false},{label:'C',text:'Will',isCorrect:false},{label:'D',text:'Should',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'To be',isCorrect:true},{label:'B',text:'Being',isCorrect:false},{label:'C',text:'Been',isCorrect:false},{label:'D',text:'Be',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'to be',isCorrect:true},{label:'B',text:'being',isCorrect:false},{label:'C',text:'been',isCorrect:false},{label:'D',text:'be',isCorrect:false}] },
    ] },
  // The Café
  { text: 'Fill in all the blanks in the passage.', difficulty: 'MEDIUM' as Difficulty,
    passage: "By seven o'clock in the morning the little café is crowded, every table [1]_____. The [2]_____ of fresh coffee fills the air. The newspapers are out of [3]_____ but there's a board that [4]_____ daily specials. Morning sunlight [5]_____ through the big windows.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'filled',isCorrect:true},{label:'B',text:'taken',isCorrect:false},{label:'C',text:'used',isCorrect:false},{label:'D',text:'occupied',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'feeling',isCorrect:true},{label:'B',text:'smell',isCorrect:false},{label:'C',text:'scent',isCorrect:false},{label:'D',text:'sense',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'date',isCorrect:true},{label:'B',text:'time',isCorrect:false},{label:'C',text:'stock',isCorrect:false},{label:'D',text:'order',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'offers',isCorrect:true},{label:'B',text:'gives',isCorrect:false},{label:'C',text:'shows',isCorrect:false},{label:'D',text:'presents',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'shines',isCorrect:true},{label:'B',text:'glows',isCorrect:false},{label:'C',text:'lights',isCorrect:false},{label:'D',text:'beams',isCorrect:false}] },
    ] },
  // Ways of Communicating
  { text: 'Fill in all the blanks in the passage.', difficulty: 'HARD' as Difficulty,
    passage: "People, in common with all social animals, must be able to communicate. [1]_____ through communication can one animal influence [2]_____. [3]_____ communication has evolved, so has its complexity. Animals use [4]_____ bodies to send signals. Some species have developed [5]_____ sophisticated systems of communication.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'Only',isCorrect:true},{label:'B',text:'Just',isCorrect:false},{label:'C',text:'Even',isCorrect:false},{label:'D',text:'Still',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'another',isCorrect:true},{label:'B',text:'other',isCorrect:false},{label:'C',text:'others',isCorrect:false},{label:'D',text:'each',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'As',isCorrect:true},{label:'B',text:'When',isCorrect:false},{label:'C',text:'While',isCorrect:false},{label:'D',text:'Since',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'their',isCorrect:true},{label:'B',text:'the',isCorrect:false},{label:'C',text:'its',isCorrect:false},{label:'D',text:'our',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'such',isCorrect:true},{label:'B',text:'so',isCorrect:false},{label:'C',text:'very',isCorrect:false},{label:'D',text:'quite',isCorrect:false}] },
    ] },
  // Piano competition
  { text: 'Fill in all the blanks in the passage.', difficulty: 'EASY' as Difficulty,
    passage: "This year's piano competition is even bigger [1]_____ last year. Pianists from all over [2]_____ world are going to take part. They will all have [3]_____ play three pieces. The person [4]_____ wins will get a gold medal. There will [5]_____ a concert after the competition.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'than',isCorrect:true},{label:'B',text:'then',isCorrect:false},{label:'C',text:'that',isCorrect:false},{label:'D',text:'as',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'the',isCorrect:true},{label:'B',text:'a',isCorrect:false},{label:'C',text:'this',isCorrect:false},{label:'D',text:'our',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'to',isCorrect:true},{label:'B',text:'for',isCorrect:false},{label:'C',text:'at',isCorrect:false},{label:'D',text:'in',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'who',isCorrect:true},{label:'B',text:'which',isCorrect:false},{label:'C',text:'what',isCorrect:false},{label:'D',text:'that',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'be',isCorrect:true},{label:'B',text:'is',isCorrect:false},{label:'C',text:'are',isCorrect:false},{label:'D',text:'been',isCorrect:false}] },
    ] },
  // Riverside Hotel
  { text: 'Fill in all the blanks in the passage.', difficulty: 'MEDIUM' as Difficulty,
    passage: "The Riverside Hotel has had a reputation for excellent food ever [1]_____ the day it opened in 1949. It was started by a businessman who turned an old house [2]_____ a hotel. The restaurant [3]_____ popular from the very beginning. [4]_____ a guest at the hotel is a truly memorable experience. It has [5]_____ welcoming atmosphere.",
    blanks: [
      { blankNumber: 1, choices: [{label:'A',text:'since',isCorrect:true},{label:'B',text:'from',isCorrect:false},{label:'C',text:'for',isCorrect:false},{label:'D',text:'at',isCorrect:false}] },
      { blankNumber: 2, choices: [{label:'A',text:'into',isCorrect:true},{label:'B',text:'to',isCorrect:false},{label:'C',text:'for',isCorrect:false},{label:'D',text:'at',isCorrect:false}] },
      { blankNumber: 3, choices: [{label:'A',text:'was',isCorrect:true},{label:'B',text:'is',isCorrect:false},{label:'C',text:'been',isCorrect:false},{label:'D',text:'be',isCorrect:false}] },
      { blankNumber: 4, choices: [{label:'A',text:'Being',isCorrect:true},{label:'B',text:'To be',isCorrect:false},{label:'C',text:'Been',isCorrect:false},{label:'D',text:'Be',isCorrect:false}] },
      { blankNumber: 5, choices: [{label:'A',text:'a',isCorrect:true},{label:'B',text:'the',isCorrect:false},{label:'C',text:'an',isCorrect:false},{label:'D',text:'its',isCorrect:false}] },
    ] },
];

/* ================================================================
   PHASE 4 — READING COMPREHENSION: missing passages
   ================================================================ */
type RCPassage = {
  passage: string; difficulty: Difficulty;
  questions: { text: string; choices: { label: string; text: string; isCorrect: boolean }[] }[];
};
const missingReadingComp: RCPassage[] = [
  {
    passage: `Homage to Kefalonia\n\nWhen I told people I was going to the Greek island of Kefalonia, several of them warned me I would be disappointed. They said there wasn't much to see. How wrong they were!\n\nThe town of Sami has a wonderful atmosphere in the evenings. The streets fill with a mix of the entire population – families, elderly couples, and children running about. One place you must not miss is the Melissani cave. I recommend visiting at noon when the sunlight shines directly into the cave, creating an unforgettable blue glow on the water.\n\nKefalonia bears traces of different cultures. There are ruins of buildings from a different age and culture, influenced by nearby Italy. When the film "Captain Corelli's Mandolin" was made here, the director said the inhabitants of the island are very special people.`,
    difficulty: 'MEDIUM' as Difficulty,
    questions: [
      { text: 'When the writer mentioned she was going to Kefalonia, other people were:', choices: [
        { label: 'A', text: 'excited for her', isCorrect: false },{ label: 'B', text: 'discouraging', isCorrect: true },
        { label: 'C', text: 'jealous', isCorrect: false },{ label: 'D', text: 'supportive', isCorrect: false }] },
      { text: 'In the evenings, the streets in the town of Sami are full of:', choices: [
        { label: 'A', text: 'tourists only', isCorrect: false },{ label: 'B', text: 'market stalls', isCorrect: false },
        { label: 'C', text: 'a mix of the entire population', isCorrect: true },{ label: 'D', text: 'cars and traffic', isCorrect: false }] },
      { text: 'What does the writer recommend about the Melissani cave?', choices: [
        { label: 'A', text: 'seeing the cave at a particular time for the best view', isCorrect: true },{ label: 'B', text: 'avoiding it in summer', isCorrect: false },
        { label: 'C', text: 'visiting with a guide', isCorrect: false },{ label: 'D', text: 'swimming in the cave', isCorrect: false }] },
      { text: 'What does the writer say about influences from abroad in Kefalonia?', choices: [
        { label: 'A', text: 'There are ruins of buildings from a different age and culture', isCorrect: true },{ label: 'B', text: 'The food is international', isCorrect: false },
        { label: 'C', text: 'Most people speak English', isCorrect: false },{ label: 'D', text: 'There are many foreign hotels', isCorrect: false }] },
      { text: 'What did the director of the film say about Kefalonia?', choices: [
        { label: 'A', text: 'The scenery is average', isCorrect: false },{ label: 'B', text: 'The inhabitants of the island are very special', isCorrect: true },
        { label: 'C', text: 'It was difficult to film there', isCorrect: false },{ label: 'D', text: 'The weather was unreliable', isCorrect: false }] },
    ],
  },
  {
    passage: `Letter to the Newport Evening News\n\nDear Editor,\n\nI am writing to thank the kind people of Newport who came to help me last Tuesday. I had parked my car on Bridge Street while I went shopping. When I came back, I found the car door had been forced open. My bag was still there, and surprisingly, nothing was stolen.\n\nI started to cry — not because of the break-in, but because I was so anxious about it all. Several people came over and helped me. One man called the police, and a woman bought me a cup of tea from the café on the corner. I was amazed at their kindness and I wanted to say thank you publicly.\n\nYours sincerely,\nMrs Jean Patterson`,
    difficulty: 'EASY' as Difficulty,
    questions: [
      { text: 'What is the writer trying to do in the letter?', choices: [
        { label: 'A', text: 'Complain about crime', isCorrect: false },{ label: 'B', text: 'Show her thanks', isCorrect: true },
        { label: 'C', text: 'Describe a holiday', isCorrect: false },{ label: 'D', text: 'Advertise a shop', isCorrect: false }] },
      { text: 'What will the reader learn from the letter?', choices: [
        { label: 'A', text: 'Bridge Street is dangerous', isCorrect: false },{ label: 'B', text: 'Shopping in Newport is expensive', isCorrect: false },
        { label: 'C', text: 'There are some kind people in Newport', isCorrect: true },{ label: 'D', text: 'Mrs Patterson shops every Tuesday', isCorrect: false }] },
      { text: 'How did the writer feel after her experience?', choices: [
        { label: 'A', text: 'Surprised that nothing was stolen', isCorrect: true },{ label: 'B', text: 'Angry at the police', isCorrect: false },
        { label: 'C', text: 'Happy about the break-in', isCorrect: false },{ label: 'D', text: 'Disappointed in people', isCorrect: false }] },
      { text: 'Why did the writer cry?', choices: [
        { label: 'A', text: 'She lost her bag', isCorrect: false },{ label: 'B', text: 'She was hurt', isCorrect: false },
        { label: 'C', text: 'She missed her bus', isCorrect: false },{ label: 'D', text: 'She was anxious', isCorrect: true }] },
      { text: 'What would be a good headline for the letter?', choices: [
        { label: 'A', text: 'Crime Wave Hits Newport', isCorrect: false },{ label: 'B', text: 'Police Catch Criminals', isCorrect: false },
        { label: 'C', text: "Woman's bad day has a happy ending", isCorrect: true },{ label: 'D', text: 'Bridge Street Closed', isCorrect: false }] },
    ],
  },
  {
    passage: `Laurence Stephen Lowry\n\nLaurence Stephen Lowry was born in Manchester, England, in 1887. He worked as a rent collector for many years. After work, he studied art at evening classes and painted scenes of the industrial north of England.\n\nLowry's family liked his paintings but for many years nobody else was interested. Then, in 1939, an important art dealer saw his work and was impressed. Lowry became famous because this important man liked his paintings and promoted them.\n\nWhen Lowry stopped working in the office, he became rich from selling his paintings. Today, Lowry's work is loved in his own country. A major gallery in Salford is named after him.`,
    difficulty: 'EASY' as Difficulty,
    questions: [
      { text: 'What did Lowry do after work?', choices: [
        { label: 'A', text: 'He played sports', isCorrect: false },{ label: 'B', text: 'He studied art', isCorrect: true },
        { label: 'C', text: 'He watched television', isCorrect: false },{ label: 'D', text: 'He went travelling', isCorrect: false }] },
      { text: "Lowry's family:", choices: [
        { label: 'A', text: 'liked his paintings', isCorrect: true },{ label: 'B', text: 'discouraged him from painting', isCorrect: false },
        { label: 'C', text: 'sold his paintings', isCorrect: false },{ label: 'D', text: 'never saw his paintings', isCorrect: false }] },
      { text: 'Lowry became famous because:', choices: [
        { label: 'A', text: 'he won a competition', isCorrect: false },{ label: 'B', text: 'he appeared on television', isCorrect: false },
        { label: 'C', text: 'an important man liked his paintings', isCorrect: true },{ label: 'D', text: 'he moved to London', isCorrect: false }] },
      { text: 'When Lowry stopped working in the office, he:', choices: [
        { label: 'A', text: 'became rich', isCorrect: true },{ label: 'B', text: 'stopped painting', isCorrect: false },
        { label: 'C', text: 'moved abroad', isCorrect: false },{ label: 'D', text: 'became ill', isCorrect: false }] },
      { text: "Today, Lowry's work is:", choices: [
        { label: 'A', text: 'forgotten', isCorrect: false },{ label: 'B', text: 'loved in his own country', isCorrect: true },
        { label: 'C', text: 'very controversial', isCorrect: false },{ label: 'D', text: 'only known abroad', isCorrect: false }] },
    ],
  },
  {
    passage: `Don't Call Me\n\nI've had it with mobile phones. Everywhere you go, people are glued to their screens. On the bus, in restaurants, even in the cinema – there's always someone talking loudly or texting.\n\nMy main complaint is that mobile phones are anti-social. People sit together at a table and instead of talking to each other, they stare at their phones. And I find it extremely annoying when phones go off in public places – especially libraries and theatres.\n\nIn classrooms, mobiles cause constant interruptions. Teachers spend half their time asking students to put their phones away. There should be strict rules about phone use in schools.`,
    difficulty: 'MEDIUM' as Difficulty,
    questions: [
      { text: "What is the writer's aim in the article?", choices: [
        { label: 'A', text: 'To sell a new phone', isCorrect: false },{ label: 'B', text: 'To express dislike of mobile phones', isCorrect: true },
        { label: 'C', text: 'To recommend a phone app', isCorrect: false },{ label: 'D', text: 'To praise phone technology', isCorrect: false }] },
      { text: "What is the writer's main complaint?", choices: [
        { label: 'A', text: 'Phones are too expensive', isCorrect: false },{ label: 'B', text: 'Mobile phones are anti-social', isCorrect: true },
        { label: 'C', text: 'Phones break easily', isCorrect: false },{ label: 'D', text: 'Phone batteries die quickly', isCorrect: false }] },
      { text: 'How does the writer feel about using mobile phones in public places?', choices: [
        { label: 'A', text: 'Annoyed', isCorrect: true },{ label: 'B', text: 'Indifferent', isCorrect: false },
        { label: 'C', text: 'Supportive', isCorrect: false },{ label: 'D', text: 'Amused', isCorrect: false }] },
      { text: 'What does the writer think about phones in schools?', choices: [
        { label: 'A', text: 'They are useful for learning', isCorrect: false },{ label: 'B', text: 'There are interruptions to lessons because of mobile phones', isCorrect: true },
        { label: 'C', text: 'Students should have the latest phones', isCorrect: false },{ label: 'D', text: 'Teachers should use phones more', isCorrect: false }] },
    ],
  },
  {
    passage: `Little Chefs\n\nPhilippe Durand runs cooking classes for children aged 8 to 14 at his restaurant in London. The classes take place every Saturday morning and have become extremely popular, with a long waiting list.\n\nPhilippe started the classes because he wanted children to learn about good food from an early age. "If children learn to cook now, they will be confident about cooking in the future," he says.\n\nFiora, aged 11, joined the course because her mother wanted her to develop an interest in cooking. "At first I wasn't keen," says Fiora, "but now I love it. Last week I learned to cut up onions properly – it was harder than I thought!"`,
    difficulty: 'EASY' as Difficulty,
    questions: [
      { text: 'What is the writer trying to do in this text?', choices: [
        { label: 'A', text: 'Describe how some children spend their spare time', isCorrect: true },{ label: 'B', text: 'Advertise a restaurant', isCorrect: false },
        { label: 'C', text: 'Review a cookbook', isCorrect: false },{ label: 'D', text: 'Complain about school dinners', isCorrect: false }] },
      { text: 'What can the reader learn from the text?', choices: [
        { label: 'A', text: 'Why the classes are so successful', isCorrect: true },{ label: 'B', text: 'How to cook French food', isCorrect: false },
        { label: 'C', text: 'Where to buy cooking equipment', isCorrect: false },{ label: 'D', text: 'What children eat at school', isCorrect: false }] },
      { text: 'Why did Fiora join the course?', choices: [
        { label: 'A', text: 'Her mother wanted her to develop an interest', isCorrect: true },{ label: 'B', text: 'She wanted to be a chef', isCorrect: false },
        { label: 'C', text: 'Her friends were already on the course', isCorrect: false },{ label: 'D', text: 'She saw it on television', isCorrect: false }] },
      { text: 'What does Philippe say about his young students?', choices: [
        { label: 'A', text: 'They will be confident about cooking in the future', isCorrect: true },{ label: 'B', text: 'They should become professional chefs', isCorrect: false },
        { label: 'C', text: 'They need to practise every day', isCorrect: false },{ label: 'D', text: 'They are already excellent cooks', isCorrect: false }] },
      { text: 'What would one of Philippe\'s students say?', choices: [
        { label: 'A', text: 'I was on a waiting list for ages, but now I\'m on the course. Last week I cut up some onions – it was hard!', isCorrect: true },
        { label: 'B', text: 'I hate cooking and want to leave the class', isCorrect: false },
        { label: 'C', text: 'The teacher never lets us cook anything', isCorrect: false },
        { label: 'D', text: 'The classes are too easy and boring', isCorrect: false }] },
    ],
  },
  {
    passage: `Notting Hill Carnival\n\nThe Notting Hill Carnival is one of the largest street festivals in Europe. It takes place annually in August in the streets of west London, near Notting Hill Gate. The carnival started in the 1960s as a small celebration of Caribbean culture by the area's immigrant community, and has grown into an enormous event.\n\nDuring the carnival, music and colour fill the streets of London. Dancers wear spectacular costumes decorated with feathers, sequins and bright fabrics. There are stages playing calypso, soca, reggae and other Caribbean music styles.\n\nAlthough the carnival is a celebration of the traditions of black British culture, everyone seems to participate in it. Each year, over a million people from all backgrounds join in the festivities.`,
    difficulty: 'MEDIUM' as Difficulty,
    questions: [
      { text: "What is the writer's main aim in writing the text?", choices: [
        { label: 'A', text: 'To understand and describe the Notting Hill Carnival', isCorrect: true },{ label: 'B', text: 'To criticise the carnival', isCorrect: false },
        { label: 'C', text: 'To sell carnival tickets', isCorrect: false },{ label: 'D', text: 'To compare different festivals', isCorrect: false }] },
      { text: 'According to the passage, Notting Hill Carnival:', choices: [
        { label: 'A', text: 'takes place every week', isCorrect: false },{ label: 'B', text: 'is held annually in August', isCorrect: true },
        { label: 'C', text: 'only lasts one day', isCorrect: false },{ label: 'D', text: 'is held indoors', isCorrect: false }] },
      { text: 'During the Notting Hill Carnival:', choices: [
        { label: 'A', text: 'the streets are empty', isCorrect: false },{ label: 'B', text: 'only Caribbean music is played', isCorrect: false },
        { label: 'C', text: 'music and colour fill the streets of London', isCorrect: true },{ label: 'D', text: 'shops are closed', isCorrect: false }] },
      { text: 'The writer claims that:', choices: [
        { label: 'A', text: 'dancers wear ordinary clothes', isCorrect: false },{ label: 'B', text: 'dancers in the carnival wear special clothes', isCorrect: true },
        { label: 'C', text: 'there is no music at the carnival', isCorrect: false },{ label: 'D', text: 'the carnival is very small', isCorrect: false }] },
      { text: 'Although the carnival is a celebration of the traditions of black British culture:', choices: [
        { label: 'A', text: 'nobody attends', isCorrect: false },{ label: 'B', text: 'everyone seems to participate in it', isCorrect: true },
        { label: 'C', text: 'it is losing popularity', isCorrect: false },{ label: 'D', text: 'people are indifferent', isCorrect: false }] },
    ],
  },
  {
    passage: `A Hotel Under the Sea\n\nArchitects have designed a luxury hotel that will be built beneath the surface of the sea. The hotel will only have a small number of rooms — 21 in total — making it an exclusive destination. Each room will have large windows so that guests can watch the ocean life near the hotel.\n\nThe designers say the best thing about the hotel is that it won't cause any damage to the environment. The building will use renewable energy and its construction will not disturb the marine ecosystem.\n\n"It's great to stay in such a beautiful hotel that is also good for the planet," said one potential guest who saw the plans.`,
    difficulty: 'MEDIUM' as Difficulty,
    questions: [
      { text: 'What is the writer doing in this text?', choices: [
        { label: 'A', text: 'Giving information about an underwater hotel', isCorrect: true },{ label: 'B', text: 'Advertising a holiday', isCorrect: false },
        { label: 'C', text: 'Reviewing a restaurant', isCorrect: false },{ label: 'D', text: 'Describing a diving trip', isCorrect: false }] },
      { text: 'What do we learn about the hotel?', choices: [
        { label: 'A', text: 'It will have hundreds of rooms', isCorrect: false },{ label: 'B', text: 'It will only have a small number of rooms', isCorrect: true },
        { label: 'C', text: 'It is already open', isCorrect: false },{ label: 'D', text: 'It is very cheap', isCorrect: false }] },
      { text: 'What can guests do in the hotel?', choices: [
        { label: 'A', text: 'Go scuba diving', isCorrect: false },{ label: 'B', text: 'Watch the ocean life near the hotel', isCorrect: true },
        { label: 'C', text: 'Feed the fish', isCorrect: false },{ label: 'D', text: 'Swim with dolphins', isCorrect: false }] },
      { text: 'What is the best thing about the hotel, according to the designers?', choices: [
        { label: 'A', text: "It won't cause any damage to the environment", isCorrect: true },{ label: 'B', text: 'It is very cheap', isCorrect: false },
        { label: 'C', text: 'It has a swimming pool', isCorrect: false },{ label: 'D', text: 'It is close to the beach', isCorrect: false }] },
      { text: 'What might a guest in this hotel say?', choices: [
        { label: 'A', text: 'The room is too small', isCorrect: false },
        { label: 'B', text: "It's great to stay in such a beautiful hotel that is also good for the planet", isCorrect: true },
        { label: 'C', text: 'The food is terrible', isCorrect: false },{ label: 'D', text: 'I prefer staying on land', isCorrect: false }] },
    ],
  },
  {
    passage: `Michael Fenton's Home Exercise Programme\n\nMichael Fenton believes you don't need a gym to stay fit. He's developed an exercise programme that you can do while doing the housework. For example, when you're vacuuming, you can do lunges down the hallway. While waiting for the kettle to boil, you can do calf raises. Ironing? That's a great time to practise standing on one leg for balance.\n\n"The key," says Michael, "is to keep moving throughout the day. You don't need expensive equipment or a gym membership. You can exercise while doing everyday tasks." After following his programme, you might feel tired but pleased with what you've accomplished.`,
    difficulty: 'EASY' as Difficulty,
    questions: [
      { text: 'What is the author trying to do in the text?', choices: [
        { label: 'A', text: 'Talk about keeping fit at home', isCorrect: true },{ label: 'B', text: 'Sell gym equipment', isCorrect: false },
        { label: 'C', text: 'Describe a sport', isCorrect: false },{ label: 'D', text: 'Review a fitness app', isCorrect: false }] },
      { text: 'Why would somebody read this text?', choices: [
        { label: 'A', text: 'To learn how to save time in the kitchen', isCorrect: true },{ label: 'B', text: 'To find a gym nearby', isCorrect: false },
        { label: 'C', text: 'To buy exercise equipment', isCorrect: false },{ label: 'D', text: 'To learn about professional athletes', isCorrect: false }] },
      { text: 'What does the writer think about this exercise programme?', choices: [
        { label: 'A', text: 'You can exercise while doing the housework', isCorrect: true },{ label: 'B', text: 'You need expensive equipment', isCorrect: false },
        { label: 'C', text: 'Only fit people should try it', isCorrect: false },{ label: 'D', text: 'It takes too long', isCorrect: false }] },
      { text: "How might you feel after Michael Fenton's exercise programme?", choices: [
        { label: 'A', text: 'Tired but pleased', isCorrect: true },{ label: 'B', text: 'Bored', isCorrect: false },
        { label: 'C', text: 'Angry', isCorrect: false },{ label: 'D', text: 'Confused', isCorrect: false }] },
    ],
  },
  {
    passage: `Letter to Teenage Magazine\n\nDear Editor,\n\nI am writing about a problem that makes me furious every time I travel by train. Adults can be so thoughtless! Last week I was on a crowded train and there were too few seats for everyone. An older man put his briefcase on the seat next to him so nobody could sit down.\n\nI asked politely if I could sit there, but he just ignored me. Some passengers really do behave badly. To make things worse, when I tried to leave the train at my stop, somebody stood on my foot and hurt me very badly. I had to limp home.\n\nWhere have all the nice people gone?\n\nCharlotte, aged 15`,
    difficulty: 'EASY' as Difficulty,
    questions: [
      { text: 'What is the writer complaining about in the letter?', choices: [
        { label: 'A', text: 'Adults can be thoughtless on trains', isCorrect: true },{ label: 'B', text: 'Train tickets are too expensive', isCorrect: false },
        { label: 'C', text: 'Trains are always late', isCorrect: false },{ label: 'D', text: 'The train was too cold', isCorrect: false }] },
      { text: 'What will the reader discover from the letter?', choices: [
        { label: 'A', text: 'There are too few seats on trains', isCorrect: true },{ label: 'B', text: 'Charlotte likes travelling', isCorrect: false },
        { label: 'C', text: 'Trains are comfortable', isCorrect: false },{ label: 'D', text: 'Charlotte is a student', isCorrect: false }] },
      { text: "What is the writer's opinion about some passengers?", choices: [
        { label: 'A', text: 'They behave badly', isCorrect: true },{ label: 'B', text: 'They are friendly', isCorrect: false },
        { label: 'C', text: 'They read interesting books', isCorrect: false },{ label: 'D', text: 'They dress well', isCorrect: false }] },
      { text: "Why couldn't the writer leave the train easily?", choices: [
        { label: 'A', text: 'Somebody had hurt her', isCorrect: true },{ label: 'B', text: 'Doors were locked', isCorrect: false },
        { label: 'C', text: 'She couldn\'t find the exit', isCorrect: false },{ label: 'D', text: 'The train didn\'t stop', isCorrect: false }] },
      { text: "What would be a good headline for Charlotte's letter?", choices: [
        { label: 'A', text: 'Where have all the nice people gone?', isCorrect: true },{ label: 'B', text: 'New Train Service Launched', isCorrect: false },
        { label: 'C', text: 'Train Prices Reduced', isCorrect: false },{ label: 'D', text: 'Best Trains in Europe', isCorrect: false }] },
    ],
  },
  {
    passage: `The Price of a Perfect Holiday?\n\nCruise ships are often seen as the ultimate holiday experience — floating hotels offering endless entertainment, fine dining, and relaxation on the open sea. But there is a hidden cost that many passengers don't consider.\n\nLarge cruise ships cause a significant amount of air pollution because they use types of fuel that are not permitted on land. An enormous amount of waste water isn't recycled but is discharged directly into the sea.\n\nIn some cities, cruise ship passengers have become unpopular because they don't spend money on meals — they eat on the ship. While they seem to offer ideal relaxing holidays, these giant vessels aren't environmentally friendly at all.`,
    difficulty: 'HARD' as Difficulty,
    questions: [
      { text: 'The purpose of the text is to:', choices: [
        { label: 'A', text: 'Advertise cruise holidays', isCorrect: false },{ label: 'B', text: 'Explain some of the problems that cruise ships cause', isCorrect: true },
        { label: 'C', text: 'Compare different types of holidays', isCorrect: false },{ label: 'D', text: 'Describe a personal cruise experience', isCorrect: false }] },
      { text: 'One reason cruise ships cause a lot of air pollution is because:', choices: [
        { label: 'A', text: 'They travel too fast', isCorrect: false },{ label: 'B', text: 'They use types of fuel that are not permitted on land', isCorrect: true },
        { label: 'C', text: 'They carry too many passengers', isCorrect: false },{ label: 'D', text: 'They are too old', isCorrect: false }] },
      { text: 'What do we learn about the waste products on cruise ships?', choices: [
        { label: 'A', text: "An enormous amount of the waste water isn't recycled", isCorrect: true },{ label: 'B', text: 'All waste is carefully treated', isCorrect: false },
        { label: 'C', text: 'Waste is stored on board', isCorrect: false },{ label: 'D', text: 'Passengers produce very little waste', isCorrect: false }] },
      { text: 'Why are cruise ship passengers not popular in some cities?', choices: [
        { label: 'A', text: "They don't spend money on meals", isCorrect: true },{ label: 'B', text: 'They are too noisy', isCorrect: false },
        { label: 'C', text: 'They cause traffic jams', isCorrect: false },{ label: 'D', text: 'They steal from shops', isCorrect: false }] },
      { text: 'Which best describes large cruise ships?', choices: [
        { label: 'A', text: 'They are very cheap', isCorrect: false },
        { label: 'B', text: "They seem to offer ideal relaxing holidays, but they aren't environmentally friendly", isCorrect: true },
        { label: 'C', text: 'They are the safest way to travel', isCorrect: false },{ label: 'D', text: 'They are becoming smaller', isCorrect: false }] },
    ],
  },
  {
    passage: `Ainsley Harriott\n\nAinsley Harriott is one of the most recognisable TV cooks in Britain. But Ainsley is much more than just a cook — he's an entertainer. He describes his life as a mix of cooking, comedy, and family.\n\nAinsley enjoys spending time with his family when he's not working. He says the best ideas come to him early in the morning or late at night, when everything is quiet. During the day, he is often busy filming or doing live shows.\n\nFans describe him as "the TV cook who loves making people laugh, watching football and having a happy family life." Ainsley agrees: "That's exactly who I am."`,
    difficulty: 'EASY' as Difficulty,
    questions: [
      { text: "What is the writer's main purpose in writing the text?", choices: [
        { label: 'A', text: 'To describe how Ainsley lives', isCorrect: true },{ label: 'B', text: 'To sell a cookbook', isCorrect: false },
        { label: 'C', text: 'To review a TV show', isCorrect: false },{ label: 'D', text: 'To advertise a restaurant', isCorrect: false }] },
      { text: 'What would a reader learn about Ainsley from the text?', choices: [
        { label: 'A', text: 'He enjoys spending time with his family', isCorrect: true },{ label: 'B', text: 'He hates cooking', isCorrect: false },
        { label: 'C', text: 'He lives alone', isCorrect: false },{ label: 'D', text: 'He never watches TV', isCorrect: false }] },
      { text: 'What does he say about his working life?', choices: [
        { label: 'A', text: 'He gets his best ideas at certain times', isCorrect: true },{ label: 'B', text: 'He works from home', isCorrect: false },
        { label: 'C', text: 'He only cooks on weekends', isCorrect: false },{ label: 'D', text: 'He wants to retire soon', isCorrect: false }] },
      { text: 'Which of the following is the best description of the writer?', choices: [
        { label: 'A', text: 'The TV cook who loves making people laugh, watching football and having a happy family life', isCorrect: true },
        { label: 'B', text: 'A serious chef who never smiles', isCorrect: false },
        { label: 'C', text: 'A football player who cooks', isCorrect: false },{ label: 'D', text: 'A comedian who hates food', isCorrect: false }] },
    ],
  },
  {
    passage: `Activity Centre\n\nLast weekend, I went to an activity centre in the countryside with a group of friends. Some of us already knew each other, but there were new people too. We were shown a range of outdoor activities including rock climbing, kayaking, and mountain biking.\n\nThe centre is set in beautiful countryside, and accommodation was provided in wooden cabins. Our instructor encouraged us to try things we'd never done before. I was terrified of rock climbing, but once I started, I found I could do it! It was an interesting and rewarding weekend.\n\nThe centre's motto is: "Work with a group — we show you a range of outdoor activities that you didn't realize you could do!"`,
    difficulty: 'EASY' as Difficulty,
    questions: [
      { text: 'What is the writer trying to do in this text?', choices: [
        { label: 'A', text: 'Say how she spent some free time', isCorrect: true },{ label: 'B', text: 'Sell outdoor equipment', isCorrect: false },
        { label: 'C', text: 'Complain about a holiday', isCorrect: false },{ label: 'D', text: 'Describe school lessons', isCorrect: false }] },
      { text: 'What can the reader learn from the text?', choices: [
        { label: 'A', text: 'What sort of activities you can experience at the Centre', isCorrect: true },{ label: 'B', text: 'How to become a rock climbing instructor', isCorrect: false },
        { label: 'C', text: 'Where to buy camping equipment', isCorrect: false },{ label: 'D', text: 'How to build a cabin', isCorrect: false }] },
      { text: 'How do you think the writer might describe her weekend?', choices: [
        { label: 'A', text: 'Boring', isCorrect: false },{ label: 'B', text: 'Interesting', isCorrect: true },
        { label: 'C', text: 'Terrible', isCorrect: false },{ label: 'D', text: 'Ordinary', isCorrect: false }] },
      { text: 'What do we learn about the group?', choices: [
        { label: 'A', text: 'Some of them already knew each other', isCorrect: true },{ label: 'B', text: 'They were all strangers', isCorrect: false },
        { label: 'C', text: 'They were all from the same school', isCorrect: false },{ label: 'D', text: 'They were all experts', isCorrect: false }] },
      { text: 'Which of the following advertisements describes the Activity Centre?', choices: [
        { label: 'A', text: 'Set in beautiful countryside. Accommodation provided. Work with a group – we show you outdoor activities!', isCorrect: true },
        { label: 'B', text: 'Learn to cook in the countryside', isCorrect: false },
        { label: 'C', text: 'Five-star hotel with spa treatments', isCorrect: false },
        { label: 'D', text: 'Day trip to the beach — no accommodation', isCorrect: false }] },
    ],
  },
  {
    passage: `Six Months Ago I Made a Rash Decision\n\nSix months ago I started working at a nursery school. When the first day arrived, I was surprised that the day had come round so quickly. When I arrived, I realized I should have done more preparation — I didn't even know the children's names!\n\nThe parents were glad to leave their children and head off to work. My worst moment during those early days was so difficult that it was hard to put into words. One little boy cried for two hours straight, and I had no idea how to comfort him.\n\nI've learned a lot since then. One important lesson is that adults sometimes forget that children have worries too. We assume they are carefree, but they can feel anxious and need reassurance.`,
    difficulty: 'MEDIUM' as Difficulty,
    questions: [
      { text: 'When the first day of the job arrived, the writer was surprised:', choices: [
        { label: 'A', text: 'that the day had come round so quickly', isCorrect: true },{ label: 'B', text: 'by how many children there were', isCorrect: false },
        { label: 'C', text: 'that the school was so big', isCorrect: false },{ label: 'D', text: 'by the other teachers', isCorrect: false }] },
      { text: 'When the writer arrived to start her job, she:', choices: [
        { label: 'A', text: 'felt completely ready', isCorrect: false },{ label: 'B', text: 'Realized she should have done more preparation', isCorrect: true },
        { label: 'C', text: 'met all the parents', isCorrect: false },{ label: 'D', text: 'left immediately', isCorrect: false }] },
      { text: 'According to the writer, the parents were:', choices: [
        { label: 'A', text: 'Worried about their children', isCorrect: false },{ label: 'B', text: 'Angry with the school', isCorrect: false },
        { label: 'C', text: 'Glad to leave their children', isCorrect: true },{ label: 'D', text: 'Late for work', isCorrect: false }] },
      { text: "The writer's worst moment:", choices: [
        { label: 'A', text: 'Was hard to put into words', isCorrect: true },{ label: 'B', text: 'Was actually funny', isCorrect: false },
        { label: 'C', text: 'Happened on the last day', isCorrect: false },{ label: 'D', text: 'Involved a parent', isCorrect: false }] },
      { text: 'According to the writer, adults:', choices: [
        { label: 'A', text: 'Sometimes forget that children have worries too', isCorrect: true },{ label: 'B', text: 'Always understand children', isCorrect: false },
        { label: 'C', text: 'Should not work with children', isCorrect: false },{ label: 'D', text: 'Are better than children', isCorrect: false }] },
    ],
  },
];

/* ================================================================
   MAIN — run all phases
   ================================================================ */
async function main() {
  console.log('=== Adding missing CEPT questions ===\n');

  // Phase 1
  const lt = await getSection('LISTENING_TEXT');
  let order = await nextOrder(lt.id);
  let added = 0;
  for (const q of missingListeningText) {
    if (await exists(lt.id, q.text)) { console.log(`  Skip LT: ${q.text.substring(0, 50)}…`); continue; }
    await prisma.question.create({ data: {
      sectionId: lt.id, text: q.text, speechText: q.speechText, difficulty: q.difficulty, order: order++,
      choices: { create: q.choices.map((c, ci) => ({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: ci + 1 })) },
    }});
    added++;
  }
  console.log(`✅ Phase 1 — Listening Text: added ${added} questions\n`);

  // Phase 2
  const li = await getSection('LISTENING_IMAGE');
  order = await nextOrder(li.id);
  added = 0;
  for (const q of missingListeningImage) {
    if (await exists(li.id, q.text)) { console.log(`  Skip LI: ${q.text.substring(0, 50)}…`); continue; }
    await prisma.question.create({ data: {
      sectionId: li.id, text: q.text, speechText: q.speechText, difficulty: q.difficulty, order: order++,
      choices: { create: q.choices.map((c, ci) => ({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: ci + 1 })) },
    }});
    added++;
  }
  console.log(`✅ Phase 2 — Listening Image: added ${added} questions\n`);

  // Phase 3
  const rf = await getSection('READING_FILL_BLANK');
  order = await nextOrder(rf.id);
  added = 0;
  for (const q of missingFillBlank) {
    // Check by passage start (first 60 chars) to avoid duplicates
    const passageStart = q.passage.substring(0, 60);
    const dup = await prisma.question.findFirst({ where: { sectionId: rf.id, passage: { startsWith: passageStart } } });
    if (dup) { console.log(`  Skip FB: ${passageStart.substring(0, 50)}…`); continue; }
    const allChoices: { label: string; text: string; isCorrect: boolean; order: number; blankNumber: number }[] = [];
    let choiceOrder = 1;
    for (const blank of q.blanks) {
      for (const c of blank.choices) {
        allChoices.push({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: choiceOrder++, blankNumber: blank.blankNumber });
      }
    }
    await prisma.question.create({ data: {
      sectionId: rf.id, text: q.text, passage: q.passage, difficulty: q.difficulty, order: order++,
      choices: { create: allChoices },
    }});
    added++;
  }
  console.log(`✅ Phase 3 — Fill in the Blank: added ${added} passages\n`);

  // Phase 4
  const rc = await getSection('READING_COMPREHENSION');
  order = await nextOrder(rc.id);
  added = 0;
  for (const p of missingReadingComp) {
    const passageStart = p.passage.substring(0, 60);
    const dup = await prisma.question.findFirst({ where: { sectionId: rc.id, passage: { startsWith: passageStart } } });
    if (dup) { console.log(`  Skip RC: ${passageStart.substring(0, 50)}…`); continue; }
    for (const q of p.questions) {
      await prisma.question.create({ data: {
        sectionId: rc.id, text: q.text, passage: p.passage, difficulty: p.difficulty, order: order++,
        choices: { create: q.choices.map((c, ci) => ({ label: c.label, text: c.text, isCorrect: c.isCorrect, order: ci + 1 })) },
      }});
    }
    added++;
  }
  console.log(`✅ Phase 4 — Reading Comprehension: added ${added} passages\n`);

  // Summary
  const counts = await prisma.section.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { questions: true } } },
  });
  console.log('=== Final question counts ===');
  for (const s of counts) {
    console.log(`  ${s.type}: ${s._count.questions}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
