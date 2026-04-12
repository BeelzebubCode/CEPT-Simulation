/**
 * seedRC2.ts – Add 17 missing Reading Comprehension passages
 * Run:  npx tsx prisma/seedRC2.ts
 */
import { PrismaClient, SectionType } from '@prisma/client';
const prisma = new PrismaClient();

interface QData {
  text: string;
  choices: { label: string; text: string; isCorrect: boolean }[];
}

interface PassageData {
  title: string;
  passage: string;
  questions: QData[];
}

const passages: PassageData[] = [
  // ─── 1. AMANDA ───
  {
    title: 'Amanda',
    passage: `Amanda hadn't been back to the small town of Hawkins for over fifteen years. She stood outside Heinzelman's shop, the old-fashioned general store that had been on the corner of Main Street for as long as anyone could remember, and hesitated before pushing the door open.

The bell above the door tinkled as she stepped inside. Mary Louise Heinzelman looked up from behind the wooden counter. Her face broke into a wide smile of pure delight. "Well, I never!" she exclaimed. "Amanda Cole! Is that really you? Oh my goodness, I can't believe it! Just wait until I tell everyone! You know, just last Tuesday Mrs Henderson was saying—"

Amanda quickly cut in, raising her hand with a smile. "I'm just on holiday, Mary Louise. A flying visit, that's all." She wanted to stop the flood of chatter before it swept her away entirely. Mary Louise was famous for her ability to talk non-stop, and Amanda had neither the time nor the energy for it right now.

Mary Louise waved enthusiastically and came around the counter. Seeing that familiar gesture, Amanda was suddenly transported back to her childhood. She and Mary Louise had grown up on the same street, attended the same tiny school, shared the same dreams of leaving Hawkins one day. Of course, Mary Louise had stayed, and Amanda had left.

"How's little Mattie?" Mary Louise asked. "She must be, what, twenty-five by now?"

Amanda laughed. "Mattie turns thirty next month, actually. She was always so much younger than me — a full twelve years between us — so people always thought she was even younger than she was."`,
    questions: [
      {
        text: 'When Amanda first entered Heinzelman\'s shop, Mary Louise seemed:',
        choices: [
          { label: 'A', text: 'annoyed that the shop was busy', isCorrect: false },
          { label: 'B', text: 'delighted that Amanda had returned', isCorrect: true },
          { label: 'C', text: 'confused about who Amanda was', isCorrect: false },
          { label: 'D', text: 'upset about something that had happened', isCorrect: false },
        ],
      },
      {
        text: 'From what Mary Louise says, it seems that:',
        choices: [
          { label: 'A', text: 'she had been expecting Amanda\'s visit', isCorrect: false },
          { label: 'B', text: 'she wanted to close the shop early', isCorrect: false },
          { label: 'C', text: 'she thought it was late for a customer call', isCorrect: true },
          { label: 'D', text: 'she was planning to leave town', isCorrect: false },
        ],
      },
      {
        text: 'Amanda quickly told Mary Louise that she was on holiday because she wanted to:',
        choices: [
          { label: 'A', text: 'avoid answering personal questions', isCorrect: false },
          { label: 'B', text: 'stop Mary Louise talking so much', isCorrect: true },
          { label: 'C', text: 'make Mary Louise feel less worried', isCorrect: false },
          { label: 'D', text: 'explain why she hadn\'t come sooner', isCorrect: false },
        ],
      },
      {
        text: 'Seeing Mary Louise wave to her, Amanda remembered that Mary Louise:',
        choices: [
          { label: 'A', text: 'had had a very similar childhood to hers', isCorrect: true },
          { label: 'B', text: 'had always wanted to travel abroad', isCorrect: false },
          { label: 'C', text: 'had never liked living in Hawkins', isCorrect: false },
          { label: 'D', text: 'had been her teacher at school', isCorrect: false },
        ],
      },
      {
        text: 'From what Amanda says about Mattie, it is clear that:',
        choices: [
          { label: 'A', text: 'Mattie was a lot younger than Amanda', isCorrect: true },
          { label: 'B', text: 'Mattie had recently moved to Hawkins', isCorrect: false },
          { label: 'C', text: 'Mattie and Amanda were the same age', isCorrect: false },
          { label: 'D', text: 'Mattie had never met Mary Louise', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 2. CHRIS SHARMA ───
  {
    title: 'Chris Sharma',
    passage: `Few climbers have shaped the sport as profoundly as Chris Sharma. Born in Santa Cruz, California, in 1981, Sharma began climbing at the age of twelve and by fifteen had won the US National Bouldering Championship. Over the following decade, he established himself as the most accomplished sport climber in the world, completing first ascents at grades that many had believed impossible. His 2001 ascent of Realization — a 5.15a route at Céüse in the French Alps — remains one of the defining moments in climbing history.

When asked about completing Realization, Sharma speaks with a quiet intensity. "That route meant everything to me," he says. "It wasn't just another climb — it was the hardest thing anyone had ever done on rock. I knew it would change the conversation about what was possible."

Life after Realization, however, was not entirely straightforward. Sharma suddenly found himself in the spotlight in a way he hadn't anticipated. Journalists, film crews, and sponsors all wanted a piece of him, and the shy Californian struggled with the constant attention. "I'm a climber, not a celebrity," he says. "All that media stuff — it was overwhelming. I just wanted to be on the rock."

In recent years, Sharma has spoken openly about his gratitude for the climbing community. He praises the younger generation of climbers who push him to stay motivated and credits his training partners for keeping him sharp. "I couldn't do this alone," he admits. "The support I get from other climbers is what keeps me going."

Looking back on his career, Sharma reflects on the passion that has driven him since childhood. "This sport has always fascinated me," he says thoughtfully. "But I'd be lying if I said I've never needed a break. There have been times when I've had to step away completely, just to come back with fresh eyes."`,
    questions: [
      {
        text: 'What is the writer doing in the first paragraph?',
        choices: [
          { label: 'A', text: 'Comparing Sharma with other famous athletes', isCorrect: false },
          { label: 'B', text: 'Explaining why climbing is a dangerous sport', isCorrect: false },
          { label: 'C', text: 'Describing the route at Céüse in detail', isCorrect: false },
          { label: 'D', text: 'Summing up the main achievements of Sharma\'s climbing career', isCorrect: true },
        ],
      },
      {
        text: 'What was Sharma\'s attitude on completing Realization?',
        choices: [
          { label: 'A', text: 'He considered it an important event in his career', isCorrect: true },
          { label: 'B', text: 'He felt it was easier than people expected', isCorrect: false },
          { label: 'C', text: 'He was disappointed with his performance', isCorrect: false },
          { label: 'D', text: 'He thought it was just another climb', isCorrect: false },
        ],
      },
      {
        text: 'What does Sharma say about his life after Realization?',
        choices: [
          { label: 'A', text: 'He enjoyed being in the public eye', isCorrect: false },
          { label: 'B', text: 'He found the attention he received hard to deal with', isCorrect: true },
          { label: 'C', text: 'He decided to retire from climbing', isCorrect: false },
          { label: 'D', text: 'He moved to France permanently', isCorrect: false },
        ],
      },
      {
        text: 'What does Sharma say about his recent involvement in climbing?',
        choices: [
          { label: 'A', text: 'He prefers to climb alone nowadays', isCorrect: false },
          { label: 'B', text: 'He no longer enjoys the sport as much', isCorrect: false },
          { label: 'C', text: 'He is grateful for the support he gets from other climbers', isCorrect: true },
          { label: 'D', text: 'He wants to become a climbing instructor', isCorrect: false },
        ],
      },
      {
        text: 'Which of the following is Sharma most likely to say about himself?',
        choices: [
          { label: 'A', text: 'I have always found climbing easy and natural', isCorrect: false },
          { label: 'B', text: 'I wish I had chosen a different career', isCorrect: false },
          { label: 'C', text: 'Climbing is just a hobby for me, nothing more', isCorrect: false },
          { label: 'D', text: 'Although this sport has always fascinated me, I have needed to take a break from it occasionally', isCorrect: true },
        ],
      },
    ],
  },

  // ─── 3. EWAN MCGREGOR AND CHARLEY BOORMAN ───
  {
    title: 'Ewan McGregor and Charley Boorman',
    passage: `When actors Ewan McGregor and Charley Boorman first came up with the idea of riding motorcycles around the world, they expected their wives to say no immediately. But to their surprise, both Eve and Ollie seemed to accept the plan without too much fuss. "I think they could see how excited we were," McGregor recalls. "They knew there was no point trying to stop us."

The original motivation for the trip was straightforward: the pair wanted to make a television programme. They planned a route that would take them from London to New York the long way — east through Europe, across Central Asia, through Siberia, and eventually across the Pacific to Alaska and down through Canada. By the time they returned, they had covered over 19,000 miles.

McGregor, who had relatively little experience on a motorbike before the trip, threw himself into an intensive training course. But the early days were tough. "The first week of training made me really sad," he admits. "I kept falling off, and I thought I'd never be able to do it. I felt completely useless."

Now back in the comfort of his London home, McGregor says he misses the open road. But it's not the excitement of the big cities that he thinks about most. "I miss the quieter places," he says. "The empty roads in Mongolia, the stillness of Siberia — those are the moments that stay with you."

Critics have praised the resulting TV series, and most agree that its success comes down to one thing above all: the people involved. McGregor and Boorman's genuine friendship and natural humour make for compelling viewing, and the programme works because audiences feel they are travelling alongside two likeable, honest companions rather than watching polished Hollywood stars.`,
    questions: [
      {
        text: 'When McGregor and Boorman first had the idea for their trip, their wives:',
        choices: [
          { label: 'A', text: 'were angry about the plan', isCorrect: false },
          { label: 'B', text: 'refused to let them go', isCorrect: false },
          { label: 'C', text: 'seemed to accept it', isCorrect: true },
          { label: 'D', text: 'wanted to come along', isCorrect: false },
        ],
      },
      {
        text: 'In the beginning, why did the actors decide to travel a long way?',
        choices: [
          { label: 'A', text: 'to make a TV programme', isCorrect: true },
          { label: 'B', text: 'to raise money for charity', isCorrect: false },
          { label: 'C', text: 'to test a new type of motorbike', isCorrect: false },
          { label: 'D', text: 'to write a book about their journey', isCorrect: false },
        ],
      },
      {
        text: 'What does McGregor say about his motorbike training?',
        choices: [
          { label: 'A', text: 'It was easy from the start', isCorrect: false },
          { label: 'B', text: 'It made him sad initially', isCorrect: true },
          { label: 'C', text: 'He enjoyed every moment of it', isCorrect: false },
          { label: 'D', text: 'He had already done it before', isCorrect: false },
        ],
      },
      {
        text: 'Now he is back home, McGregor:',
        choices: [
          { label: 'A', text: 'wants to do the trip again immediately', isCorrect: false },
          { label: 'B', text: 'misses the quieter places they went to', isCorrect: true },
          { label: 'C', text: 'is glad he never has to ride again', isCorrect: false },
          { label: 'D', text: 'cannot remember the details of the journey', isCorrect: false },
        ],
      },
      {
        text: 'The writer thinks the TV programme is good because of:',
        choices: [
          { label: 'A', text: 'the people who took part in it', isCorrect: true },
          { label: 'B', text: 'the stunning photography', isCorrect: false },
          { label: 'C', text: 'the dramatic music', isCorrect: false },
          { label: 'D', text: 'the expensive motorbikes they used', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 4. MAKING A CAREER IN MUSIC ───
  {
    title: 'Making a Career in Music',
    passage: `For every musician who makes it to the top, there are thousands who never get the chance to perform in front of a large audience. The music industry is fiercely competitive, and anyone who wants a career in it is fortunate if they are discovered by a talent scout or record label. But for those who aren't so lucky, there are still ways to build a successful career — it just takes hard work, creativity, and a great deal of patience.

The first step is to develop a strong personal brand. Musicians are advised to market themselves by showing that they are different from other musicians. In a world full of talented performers, it's not enough to be good — you have to stand out. Think about what makes you unique, and communicate that clearly in everything you do, from your stage presence to your social media profiles.

While musicians are waiting for their career to take off, they should find work that will help them in their profession. This might mean teaching music, working as a session musician, or taking a job at a recording studio. Any experience that keeps you connected to the industry is valuable, and it can open doors to future opportunities.

A professional website is essential. However, musicians should remember that the website should be easy to use. Visitors should be able to find information quickly, listen to samples of your music, and contact you without difficulty. A cluttered or confusing website will drive potential fans and industry contacts away.

When it comes to selling your music, think locally as well as globally. Musicians should ask local businesses to support events they organise. A café, bookshop, or clothes shop might be willing to host a small performance or sell your CDs if you approach them in the right way. These grassroots connections can be surprisingly effective.

Finally, if you are fortunate enough to attract the interest of a music company, remember that professionalism matters. Musicians have to be respectful towards the companies they work with. Reply to emails promptly, meet deadlines, and behave in a way that makes people want to work with you again. A reputation for being reliable is just as important as raw talent.`,
    questions: [
      {
        text: 'The first paragraph says that anyone who wants a career in music:',
        choices: [
          { label: 'A', text: 'should move to a big city', isCorrect: false },
          { label: 'B', text: 'is fortunate if they are discovered by a talent scout', isCorrect: true },
          { label: 'C', text: 'needs to have a university degree', isCorrect: false },
          { label: 'D', text: 'should only play one type of music', isCorrect: false },
        ],
      },
      {
        text: 'How are musicians advised to market themselves?',
        choices: [
          { label: 'A', text: 'They should copy what successful musicians do', isCorrect: false },
          { label: 'B', text: 'They should spend a lot of money on advertising', isCorrect: false },
          { label: 'C', text: 'They should show that they are different from other musicians', isCorrect: true },
          { label: 'D', text: 'They should only perform in expensive venues', isCorrect: false },
        ],
      },
      {
        text: 'While musicians are waiting for their career to start, they should:',
        choices: [
          { label: 'A', text: 'stop performing until they are discovered', isCorrect: false },
          { label: 'B', text: 'give up music and find a different career', isCorrect: false },
          { label: 'C', text: 'find work that will help them in their profession', isCorrect: true },
          { label: 'D', text: 'travel to other countries to find new audiences', isCorrect: false },
        ],
      },
      {
        text: 'What advice is given to musicians concerning their websites?',
        choices: [
          { label: 'A', text: 'The website should have as much information as possible', isCorrect: false },
          { label: 'B', text: 'The website should be easy to use', isCorrect: true },
          { label: 'C', text: 'The website should only contain photographs', isCorrect: false },
          { label: 'D', text: 'The website should be updated every day', isCorrect: false },
        ],
      },
      {
        text: 'Regarding sales, the fifth paragraph suggests that musicians should:',
        choices: [
          { label: 'A', text: 'only sell music online', isCorrect: false },
          { label: 'B', text: 'give their music away for free', isCorrect: false },
          { label: 'C', text: 'ask local businesses to support events they organise', isCorrect: true },
          { label: 'D', text: 'hire a professional sales team', isCorrect: false },
        ],
      },
      {
        text: 'What does the final paragraph say about working for music companies?',
        choices: [
          { label: 'A', text: 'Musicians should negotiate hard for better deals', isCorrect: false },
          { label: 'B', text: 'Musicians have to be respectful towards the companies', isCorrect: true },
          { label: 'C', text: 'Musicians should avoid signing contracts', isCorrect: false },
          { label: 'D', text: 'Musicians should only work with small companies', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 5. PIANO PLAYERS — WHEN THEY WERE YOUNG ───
  {
    title: 'Piano Players — When They Were Young',
    passage: `Ivan Korolyov grew up in a small village in eastern Russia together with his younger sister. His first music lessons were unusual — they were with an elderly violinist who lived next door, not a piano teacher. Old Mr Petrov taught Ivan the basics of reading music and understanding rhythm. It was only later that Ivan turned to the piano. As well as performing, Ivan always had a passion for writing his own compositions. He began creating short pieces at the age of ten, and by fourteen he had composed his first full-length sonata.

Oleg Maisenberg was the middle child in a large family — he had two brothers and a sister. From an early age, he showed exceptional talent and was sent abroad to study at the Vienna Conservatory at the age of sixteen, where he spent two years developing his skills under some of Europe's finest teachers. The intensity of those years in Austria shaped Oleg's technique and musical understanding in ways he could never have achieved at home.

Josef Lhévinne was born into a musical family in Moscow, and everyone expected him to become a professional musician. But as a boy, Josef's interests extended far beyond the piano. He loved mathematics and history, and his school reports praised him for his dedication to these academic subjects. "Music was my first love," Josef would later say, "but I enjoyed knowing about the wider world just as much."`,
    questions: [
      {
        text: 'Who had more than one sister or brother?',
        choices: [
          { label: 'A', text: 'Ivan', isCorrect: false },
          { label: 'B', text: 'Oleg', isCorrect: true },
          { label: 'C', text: 'Josef', isCorrect: false },
          { label: 'D', text: 'All of them', isCorrect: false },
        ],
      },
      {
        text: 'Who enjoyed other subjects as well as music?',
        choices: [
          { label: 'A', text: 'Ivan', isCorrect: false },
          { label: 'B', text: 'Oleg', isCorrect: false },
          { label: 'C', text: 'Josef', isCorrect: true },
          { label: 'D', text: 'None of them', isCorrect: false },
        ],
      },
      {
        text: 'Who studied in another country for two years?',
        choices: [
          { label: 'A', text: 'Ivan', isCorrect: false },
          { label: 'B', text: 'Oleg', isCorrect: true },
          { label: 'C', text: 'Josef', isCorrect: false },
          { label: 'D', text: 'Ivan and Oleg', isCorrect: false },
        ],
      },
      {
        text: 'Who had music lessons with someone who wasn\'t a piano player?',
        choices: [
          { label: 'A', text: 'Ivan', isCorrect: true },
          { label: 'B', text: 'Oleg', isCorrect: false },
          { label: 'C', text: 'Josef', isCorrect: false },
          { label: 'D', text: 'Oleg and Josef', isCorrect: false },
        ],
      },
      {
        text: 'Who also wrote music?',
        choices: [
          { label: 'A', text: 'Ivan', isCorrect: true },
          { label: 'B', text: 'Oleg', isCorrect: false },
          { label: 'C', text: 'Josef', isCorrect: false },
          { label: 'D', text: 'All of them', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 6. RACING DRIVER (CARRIE WILSON) ───
  {
    title: 'Racing Driver — Carrie Wilson',
    passage: `Carrie Wilson's introduction to motor racing came through an unlikely route — radio-controlled model cars. As a teenager, she spent weekends travelling to competitions across the country with her father, and it was the car journeys themselves, rather than the events, that she found most enjoyable. They would talk for hours about engineering, speed, and the dream of one day racing a real car.

That dream came closer one day when Carrie saw a documentary about the legendary Brazilian driver Emerson Fittipaldi. Watching him take corners at incredible speed, Carrie turned to her father and said: "One day I'm going to be that fast." From that moment, her ambition was clear — she hoped to match Fittipaldi's speed on a real racing circuit.

School, however, became a challenge. Between practice sessions, fitness training, and weekend competitions, Carrie found it increasingly difficult to keep up with her homework. "There weren't enough hours in the day," she recalls. "My teachers were supportive, but I was always handing things in late."

As soon as Carrie left school at eighteen, her father became her full-time trainer. He designed fitness programmes, studied race data, and helped her prepare for her first professional season. "Dad was the best coach I could have asked for," Carrie says.

Now competing in the national touring car series, Carrie is realistic about her position. At twenty-one, she is very inexperienced compared with some other drivers who have been racing since childhood. Many of her competitors have years of professional experience that she simply doesn't have yet.

Despite this, Carrie remains optimistic. "I make mistakes in every race," she admits, "but I believe I learn from the mistakes I makes. Every race teaches me something new, and every error is a lesson that makes me faster next time."`,
    questions: [
      {
        text: 'When Carrie Wilson took part in competitions for radio-controlled cars:',
        choices: [
          { label: 'A', text: 'she always won first place', isCorrect: false },
          { label: 'B', text: 'she didn\'t enjoy the events themselves', isCorrect: false },
          { label: 'C', text: 'she found the journeys to the events enjoyable', isCorrect: true },
          { label: 'D', text: 'she went alone without her family', isCorrect: false },
        ],
      },
      {
        text: 'According to the second paragraph, Carrie hoped:',
        choices: [
          { label: 'A', text: 'to become a racing car designer', isCorrect: false },
          { label: 'B', text: 'to move to Brazil one day', isCorrect: false },
          { label: 'C', text: 'to match Fittipaldi\'s speed', isCorrect: true },
          { label: 'D', text: 'to make a documentary about racing', isCorrect: false },
        ],
      },
      {
        text: 'What does the third paragraph say about Carrie\'s time at school?',
        choices: [
          { label: 'A', text: 'She got excellent grades in all subjects', isCorrect: false },
          { label: 'B', text: 'She decided to leave school early', isCorrect: false },
          { label: 'C', text: 'She had difficulty in doing all her homework', isCorrect: true },
          { label: 'D', text: 'Her teachers told her to stop racing', isCorrect: false },
        ],
      },
      {
        text: 'What happened as soon as Carrie left school?',
        choices: [
          { label: 'A', text: 'She got a job in a garage', isCorrect: false },
          { label: 'B', text: 'She went to university', isCorrect: false },
          { label: 'C', text: 'Her father became her trainer', isCorrect: true },
          { label: 'D', text: 'She moved to another country', isCorrect: false },
        ],
      },
      {
        text: 'What does the fifth paragraph say about Carrie\'s situation now?',
        choices: [
          { label: 'A', text: 'She is very inexperienced compared with some other drivers', isCorrect: true },
          { label: 'B', text: 'She is the most successful driver in the series', isCorrect: false },
          { label: 'C', text: 'She is thinking about retiring', isCorrect: false },
          { label: 'D', text: 'She has more experience than most competitors', isCorrect: false },
        ],
      },
      {
        text: 'In the final paragraph, what does Carrie say about her progress?',
        choices: [
          { label: 'A', text: 'She never makes any mistakes now', isCorrect: false },
          { label: 'B', text: 'She believes she learns from the mistakes she makes', isCorrect: true },
          { label: 'C', text: 'She thinks progress is impossible', isCorrect: false },
          { label: 'D', text: 'She wants to change to a different sport', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 7. STEVE GREEN / TREES ───
  {
    title: 'Steve Green and the Urban Forest',
    passage: `On the outskirts of Sheffield, where old factories once stood, Steve Green is engaged in an ambitious project. He is planting trees — thousands of them — to redevelop an area outside the city that has been neglected for decades. Where there were once grey industrial buildings and piles of rubble, young oaks, birches, and willows are now taking root.

Green's project highlights a growing trend in the UK. As advances in agriculture continue, better ways of farming are found, and more land can be freed up for tree planting. Modern farming techniques mean that the same amount of food can be produced on smaller areas, leaving marginal land available for reforestation.

The British didn't always appreciate their trees. For most of the twentieth century, woodlands were seen as nothing more than a resource to be exploited. Then, on the night of 15 October 1987, everything changed. A single night of bad weather — the Great Storm — destroyed an estimated fifteen million trees across southern England. Suddenly, the nation woke up to just how valuable its trees really were.

Since that night, interest in tree conservation has grown enormously. The clearest evidence of this increasing interest is shown by the number of people joining a tree conservation club. The Woodland Trust, Britain's largest organisation dedicated to the protection of native woodland, has seen its membership increase tenfold over the past three decades.

Meanwhile, in schools across the country, a teacher named Lesley Robinson is doing her part. Robinson helps children appreciate trees through a programme of hands-on activities — planting saplings, identifying species, and studying the wildlife that depends on woodland habitats. "If we want to protect our trees," she says, "we need to start by teaching our children to love them."`,
    questions: [
      {
        text: 'Steve Green is planting trees to:',
        choices: [
          { label: 'A', text: 'redevelop an area outside the city', isCorrect: true },
          { label: 'B', text: 'provide wood for local factories', isCorrect: false },
          { label: 'C', text: 'create a park in the city centre', isCorrect: false },
          { label: 'D', text: 'study the effects of pollution on nature', isCorrect: false },
        ],
      },
      {
        text: 'More land can be used for growing trees when:',
        choices: [
          { label: 'A', text: 'the government closes old factories', isCorrect: false },
          { label: 'B', text: 'better ways of farming are found', isCorrect: true },
          { label: 'C', text: 'people move away from the countryside', isCorrect: false },
          { label: 'D', text: 'trees are imported from abroad', isCorrect: false },
        ],
      },
      {
        text: 'The British suddenly started to value trees because of:',
        choices: [
          { label: 'A', text: 'a new law that protected woodland', isCorrect: false },
          { label: 'B', text: 'a famous painting of English trees', isCorrect: false },
          { label: 'C', text: 'a single night of bad weather', isCorrect: true },
          { label: 'D', text: 'a television programme about forests', isCorrect: false },
        ],
      },
      {
        text: 'Evidence of increasing interest in trees is shown by the number of:',
        choices: [
          { label: 'A', text: 'people joining a tree conservation club', isCorrect: true },
          { label: 'B', text: 'books published about gardening', isCorrect: false },
          { label: 'C', text: 'trees planted in London parks', isCorrect: false },
          { label: 'D', text: 'schools that teach environmental science', isCorrect: false },
        ],
      },
      {
        text: 'Lesley Robinson:',
        choices: [
          { label: 'A', text: 'runs a tree conservation club for adults', isCorrect: false },
          { label: 'B', text: 'writes books about British trees', isCorrect: false },
          { label: 'C', text: 'helps children appreciate trees', isCorrect: true },
          { label: 'D', text: 'works with Steve Green on his project', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 8. THE WISDOM OF BIRDS ───
  {
    title: 'The Wisdom of Birds — An Illustrated History of Ornithology by Tim Birkhead',
    passage: `For centuries, human beings have been fascinated by birds. Our ancestors held all manner of extraordinary beliefs about them — that swallows hibernated under the mud at the bottom of ponds, for example, or that barnacle geese hatched from shellfish. From our modern perspective, it is difficult to understand how such ideas were ever taken seriously, but they reflect how little was known about the natural world before the age of scientific inquiry.

Tim Birkhead's excellent book traces this journey from superstition to science. Rather than producing a simple timeline, Birkhead focuses on developments in the way that knowledge is gained — how ornithologists moved from casual observation and folklore towards rigorous, evidence-based research. The result is a book that is as much about the history of scientific method as it is about birds.

One of the book's great strengths is its willingness to challenge accepted wisdom. Birkhead argues that it is necessary to question generally held beliefs, even those that seem well established. Science advances not through blind acceptance, but through scepticism and testing.

A key figure in the book is the seventeenth-century naturalist John Ray, who published what might appear to be little more than a catalogue of bird species. Birkhead, however, shows that Ray's book is more important than a first impression would suggest. It was, in fact, the first systematic attempt to classify birds according to their physical characteristics rather than their supposed mystical properties.

Some of the most entertaining passages in the book concern the sheer stubbornness with which old beliefs were maintained. Birkhead describes how sailors would report seeing swallows landing on ships in mid-ocean — clear evidence that the birds were migrating, not hibernating — and yet for decades, the hibernation theory persisted. Beliefs about birds were rarely changed in the light of fresh evidence.

Ultimately, Birkhead argues that ornithology matters because the study of birds helps us to make sense of the world. Birds have been used to study migration, evolution, ecology, and behaviour, and the insights gained have applications far beyond the field of ornithology itself.`,
    questions: [
      {
        text: 'What point is made about our ancestors\' beliefs concerning birds?',
        choices: [
          { label: 'A', text: 'They were based on careful observation', isCorrect: false },
          { label: 'B', text: 'It is difficult to understand how they were taken seriously', isCorrect: true },
          { label: 'C', text: 'They were surprisingly accurate', isCorrect: false },
          { label: 'D', text: 'They have been proven correct by modern science', isCorrect: false },
        ],
      },
      {
        text: 'What is the focus of Birkhead\'s book?',
        choices: [
          { label: 'A', text: 'Developments in the way that knowledge is gained', isCorrect: true },
          { label: 'B', text: 'A complete list of all known bird species', isCorrect: false },
          { label: 'C', text: 'The personal life of Tim Birkhead', isCorrect: false },
          { label: 'D', text: 'Birds that are in danger of extinction', isCorrect: false },
        ],
      },
      {
        text: 'What point does the reviewer make in the third paragraph?',
        choices: [
          { label: 'A', text: 'Science should always follow tradition', isCorrect: false },
          { label: 'B', text: 'It is necessary to question generally held beliefs', isCorrect: true },
          { label: 'C', text: 'Old theories are usually correct', isCorrect: false },
          { label: 'D', text: 'Scientists rarely disagree with each other', isCorrect: false },
        ],
      },
      {
        text: 'According to the fourth paragraph, John Ray\'s book:',
        choices: [
          { label: 'A', text: 'is more important than a first impression would suggest', isCorrect: true },
          { label: 'B', text: 'is too old to be of any interest today', isCorrect: false },
          { label: 'C', text: 'was written mainly for children', isCorrect: false },
          { label: 'D', text: 'contains many factual errors', isCorrect: false },
        ],
      },
      {
        text: 'The reviewer refers to swallows landing on ships in mid-ocean to show that:',
        choices: [
          { label: 'A', text: 'swallows are excellent navigators', isCorrect: false },
          { label: 'B', text: 'ships were important for bird conservation', isCorrect: false },
          { label: 'C', text: 'beliefs about birds were rarely changed in the light of fresh evidence', isCorrect: true },
          { label: 'D', text: 'sailors were better scientists than professors', isCorrect: false },
        ],
      },
      {
        text: 'What point does the reviewer make in the sixth paragraph?',
        choices: [
          { label: 'A', text: 'Ornithology is a declining field of study', isCorrect: false },
          { label: 'B', text: 'Birds should be kept in captivity for research', isCorrect: false },
          { label: 'C', text: 'Only professional scientists can study birds', isCorrect: false },
          { label: 'D', text: 'The study of birds helps us to make sense of the world', isCorrect: true },
        ],
      },
    ],
  },

  // ─── 9. HURST (CABINET MAKER) ───
  {
    title: 'Hurst — A Master Cabinet Maker',
    passage: `The workshop was tucked away at the end of a narrow lane, and when the writer arrived, she was greeted by a tall, wiry man with sawdust in his hair and calloused hands. David Hurst didn't look much like the man she had seen in the glossy magazine photographs. She was not sure if her first impression of Hurst was accurate — surely this quiet, unassuming figure couldn't be the celebrated craftsman whose furniture sold for thousands of pounds?

But as Hurst began to talk about his work, any doubts quickly vanished. He has few problems selling his furniture because he is known to be a skilled craftsman. His reputation has been built over thirty years of painstaking attention to detail, and buyers — many of them serious collectors — seek him out. "I've never had to advertise," he says simply. "People hear about the quality, and they come to me."

Hurst is deeply concerned about the decline of cabinet making as a craft. When asked what has led to this decline, he is characteristically direct. "It's the consumers," he says. "Consumers will accept poor quality furniture. They go to a big chain store, buy something made of chipboard and plastic veneer, and don't think twice about it. As long as people are happy with that, there's no incentive for young people to learn proper woodworking."

Despite his frustration, Hurst is clear about what makes good furniture. He believes that it is essential for craftsmen to produce functional designs. "Beauty is important," he says, "but a chair that looks wonderful and is uncomfortable to sit on is a failure. Everything I make has to work."

As the afternoon light faded through the workshop windows, the writer prepared to leave. Her final impression of Hurst was that he has an unusual attitude to his work. Unlike many craftsmen who see furniture as a way to express artistic ambition, Hurst seems entirely focused on service — on making things that last, that function, and that bring quiet satisfaction to the people who use them every day.`,
    questions: [
      {
        text: 'When she arrived at the workshop, the writer:',
        choices: [
          { label: 'A', text: 'was not sure if her first impression of Hurst was accurate', isCorrect: true },
          { label: 'B', text: 'immediately recognised Hurst from his photographs', isCorrect: false },
          { label: 'C', text: 'was disappointed by the size of the workshop', isCorrect: false },
          { label: 'D', text: 'thought Hurst was unfriendly', isCorrect: false },
        ],
      },
      {
        text: 'Hurst has few problems selling his furniture because he:',
        choices: [
          { label: 'A', text: 'charges very low prices', isCorrect: false },
          { label: 'B', text: 'is known to be a skilled craftsman', isCorrect: true },
          { label: 'C', text: 'advertises in expensive magazines', isCorrect: false },
          { label: 'D', text: 'only makes furniture for celebrities', isCorrect: false },
        ],
      },
      {
        text: 'What does Hurst think has led to the decline in the craft of cabinet making?',
        choices: [
          { label: 'A', text: 'Young people are not interested in woodworking', isCorrect: false },
          { label: 'B', text: 'The price of good wood has increased', isCorrect: false },
          { label: 'C', text: 'Consumers will accept poor quality furniture', isCorrect: true },
          { label: 'D', text: 'The government doesn\'t support small businesses', isCorrect: false },
        ],
      },
      {
        text: 'Hurst believes that it is essential for craftsmen to:',
        choices: [
          { label: 'A', text: 'use the most expensive materials possible', isCorrect: false },
          { label: 'B', text: 'create pieces that are mainly decorative', isCorrect: false },
          { label: 'C', text: 'produce functional designs', isCorrect: true },
          { label: 'D', text: 'follow the latest fashion trends', isCorrect: false },
        ],
      },
      {
        text: 'The writer\'s final impression of Hurst is that he:',
        choices: [
          { label: 'A', text: 'has an unusual attitude to his work', isCorrect: true },
          { label: 'B', text: 'is planning to retire soon', isCorrect: false },
          { label: 'C', text: 'doesn\'t enjoy making furniture any more', isCorrect: false },
          { label: 'D', text: 'is difficult to talk to', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 10. THE ORIGINS OF AGRICULTURE ───
  {
    title: 'The Origins of Agriculture',
    passage: `In 1914, the botanist Lilian Gibbs was exploring the tropical forests of Borneo when she noticed something unexpected. A large number of the trees in the forest were very similar in their shape — too similar, in fact, to be entirely natural. Gibbs suspected that centuries earlier, people had been managing these trees, selecting and planting particular species. She had stumbled upon evidence of a practice now known as "proto-farming."

The consequences of farming for human civilisation cannot be overstated. When people began to cultivate crops rather than simply gathering wild food, it resulted in eventual changes in communal living. Settled farming communities developed, populations grew, and the first towns and cities began to appear.

But when and where did farming first begin? For many years, scholars pointed to the Fertile Crescent in the Middle East as the birthplace of agriculture. According to the third paragraph, the most recent evidence shows that proto-farming first appeared in the Middle East, around 11,000 years ago, with the cultivation of wheat, barley, and lentils.

Interestingly, the food grown in the early days of farming was probably not part of the everyday diet. Archaeologists believe it was eaten on special occasions — at feasts, religious ceremonies, or important community gatherings. Growing crops was too laborious and uncertain to serve as a daily food source.

After the era of what researchers call "garden farms" — small plots tended by hand — there seems to have been a period of uncertainty. People appeared to be unsure about whether they could get suitable types of crop for domestic agriculture on a larger scale. The transition from small-scale gardening to full-scale farming took many generations.

According to the final paragraph, proto-farming underwent a significant change in its development. It went from being experimental to being essential — from a curious supplement to the hunter-gatherer diet to the very foundation of human civilisation.`,
    questions: [
      {
        text: 'What did Lilian Gibbs notice about the trees in the forest?',
        choices: [
          { label: 'A', text: 'They were being destroyed by insects', isCorrect: false },
          { label: 'B', text: 'A large number were very similar in their shape', isCorrect: true },
          { label: 'C', text: 'They were much older than expected', isCorrect: false },
          { label: 'D', text: 'They produced unusual fruit', isCorrect: false },
        ],
      },
      {
        text: 'In the second paragraph, what does the writer say about farming?',
        choices: [
          { label: 'A', text: 'It was only practised in tropical areas', isCorrect: false },
          { label: 'B', text: 'It resulted in eventual changes in communal living', isCorrect: true },
          { label: 'C', text: 'It was harmful to the environment', isCorrect: false },
          { label: 'D', text: 'It was unpopular with early humans', isCorrect: false },
        ],
      },
      {
        text: 'According to the third paragraph, the most recent evidence shows that proto-farming:',
        choices: [
          { label: 'A', text: 'started in Africa', isCorrect: false },
          { label: 'B', text: 'began less than 5,000 years ago', isCorrect: false },
          { label: 'C', text: 'first appeared in the Middle East', isCorrect: true },
          { label: 'D', text: 'was discovered by accident', isCorrect: false },
        ],
      },
      {
        text: 'In the fourth paragraph, the writer says that the food grown in the early days of farming was probably:',
        choices: [
          { label: 'A', text: 'used to feed animals', isCorrect: false },
          { label: 'B', text: 'traded with neighbouring communities', isCorrect: false },
          { label: 'C', text: 'eaten on special occasions', isCorrect: true },
          { label: 'D', text: 'stored for the winter months', isCorrect: false },
        ],
      },
      {
        text: 'In the fourth paragraph, the writer says that after the era of "garden farms", people seemed to be unsure about whether:',
        choices: [
          { label: 'A', text: 'farming was better than hunting', isCorrect: false },
          { label: 'B', text: 'they could get suitable types of crop for domestic agriculture', isCorrect: true },
          { label: 'C', text: 'the soil was good enough for growing food', isCorrect: false },
          { label: 'D', text: 'they should move to different regions', isCorrect: false },
        ],
      },
      {
        text: 'According to the final paragraph, what change did proto-farming undergo in its development?',
        choices: [
          { label: 'A', text: 'It moved from tropical to temperate regions', isCorrect: false },
          { label: 'B', text: 'It became less popular over time', isCorrect: false },
          { label: 'C', text: 'It went from being experimental to being essential', isCorrect: true },
          { label: 'D', text: 'It was replaced by animal farming', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 11. TRAFFIC IN THE PARK ───
  {
    title: 'Traffic in the Park',
    passage: `The Peak District National Park is one of the most beautiful areas in England, attracting millions of visitors every year. But there is a growing problem that threatens to spoil the very thing that makes it special. The writer's purpose is clear: to show people how serious the Park's traffic problem is.

Every weekend, and increasingly on weekdays too, the narrow lanes of the Park are choked with cars, coaches, and lorries. Traffic jams spoil people's experiences of the Park. Instead of breathing fresh country air, visitors find themselves sitting in stationary vehicles, engines running, surrounded by exhaust fumes. The contrast between the natural beauty of the landscape and the reality of gridlocked roads could hardly be greater.

So what can be done? The text sets out several ways in which the traffic situation in the Park could be improved. These range from introducing a congestion charge for private vehicles to investing in better public transport links. A new bus service connecting major towns to popular walking routes has already been trialled with promising results.

Martin Doughty, chairman of the National Park Authority, is cautious about extreme measures. "It would be unfair to stop people using cars in the Park," he says. "Many of our visitors are elderly or have young families, and they simply cannot get here any other way. What we need is a balanced approach — better alternatives, not blanket bans."

However, Doughty is clear that the situation cannot continue as it is. "The traffic jams and pollution are getting worse," he admits. "I would urge visitors: please don't make unnecessary journeys through the Park, and use public transport when you can."`,
    questions: [
      {
        text: 'Why has the writer written this text?',
        choices: [
          { label: 'A', text: 'To encourage more people to visit the Park', isCorrect: false },
          { label: 'B', text: 'To show people how serious the Park\'s traffic problem is', isCorrect: true },
          { label: 'C', text: 'To persuade the government to close the Park to cars', isCorrect: false },
          { label: 'D', text: 'To advertise a new bus service in the Park', isCorrect: false },
        ],
      },
      {
        text: 'What would a reader learn from the text?',
        choices: [
          { label: 'A', text: 'The best time to visit the Park', isCorrect: false },
          { label: 'B', text: 'How the traffic situation in the Park could be improved', isCorrect: true },
          { label: 'C', text: 'The history of the Peak District', isCorrect: false },
          { label: 'D', text: 'How to get to the Park by train', isCorrect: false },
        ],
      },
      {
        text: 'What does Martin Doughty say about the situation in the Park?',
        choices: [
          { label: 'A', text: 'All cars should be banned immediately', isCorrect: false },
          { label: 'B', text: 'The problem is not as bad as people think', isCorrect: false },
          { label: 'C', text: 'It would be unfair to stop people using cars in the Park', isCorrect: true },
          { label: 'D', text: 'Only local residents should be allowed to drive in the Park', isCorrect: false },
        ],
      },
      {
        text: 'What does the writer say about traffic in the Park?',
        choices: [
          { label: 'A', text: 'It is only a problem at weekends', isCorrect: false },
          { label: 'B', text: 'Traffic jams spoil people\'s experiences of the Park', isCorrect: true },
          { label: 'C', text: 'Most visitors prefer to walk rather than drive', isCorrect: false },
          { label: 'D', text: 'The roads in the Park are very wide', isCorrect: false },
        ],
      },
      {
        text: 'Which of the following might Martin Doughty say?',
        choices: [
          { label: 'A', text: 'The Park should be closed to all visitors', isCorrect: false },
          { label: 'B', text: 'There is no traffic problem in the Park', isCorrect: false },
          { label: 'C', text: 'Please don\'t make unnecessary journeys through the Park and use public transport when you can', isCorrect: true },
          { label: 'D', text: 'We should build more car parks in the Park', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 12. WHITE STAR SCHOOL ───
  {
    title: 'White Star School',
    passage: `In a quiet corner of the Devon countryside, a remarkable educational experiment is taking place. White Star School opened its doors three years ago and has already attracted attention from educators across the country. The writer's aim is to give information about a new school that does things very differently from the mainstream.

The most unusual thing about White Star School is the teaching method. Instead of sitting in traditional classrooms, students spend much of their time outdoors — in the school's orchard, by the river that runs through the grounds, and in the surrounding woodland. Lessons in science, geography, and even mathematics are conducted outside wherever possible.

The school owes its existence to one woman's determination. Jane Bartlett, a former secondary school teacher, started White Star School because she wanted to stay in the area after moving to Devon. Unable to find a teaching position that matched her educational philosophy, she decided to create her own school.

Bartlett's long-term vision extends beyond the classroom. In the future, Jane would like the students to encourage others to care for the environment. "Our children are learning to understand and respect the natural world," she says. "I want them to go out and spread that knowledge — to become ambassadors for the planet."

What would a teacher at the White Star School say about it? One member of staff summed it up perfectly: "Although we spend a lot of time outdoors, it's very important to us that the children get the best education possible. We follow the national curriculum carefully — we just deliver it in a rather different setting."`,
    questions: [
      {
        text: 'What is the writer trying to do in the text?',
        choices: [
          { label: 'A', text: 'Give information about a new school', isCorrect: true },
          { label: 'B', text: 'Criticise the national education system', isCorrect: false },
          { label: 'C', text: 'Persuade parents to send their children to White Star', isCorrect: false },
          { label: 'D', text: 'Compare different schools in Devon', isCorrect: false },
        ],
      },
      {
        text: 'The most unusual thing about White Star School is:',
        choices: [
          { label: 'A', text: 'the size of the school buildings', isCorrect: false },
          { label: 'B', text: 'the number of students', isCorrect: false },
          { label: 'C', text: 'the teaching method', isCorrect: true },
          { label: 'D', text: 'the school uniform', isCorrect: false },
        ],
      },
      {
        text: 'Jane Bartlett started White Star School because:',
        choices: [
          { label: 'A', text: 'she wanted to stay in the area', isCorrect: true },
          { label: 'B', text: 'she was asked to by the local council', isCorrect: false },
          { label: 'C', text: 'she wanted to become famous', isCorrect: false },
          { label: 'D', text: 'she had always dreamed of running a school', isCorrect: false },
        ],
      },
      {
        text: 'In the future, Jane would like the students to:',
        choices: [
          { label: 'A', text: 'become professional scientists', isCorrect: false },
          { label: 'B', text: 'move to the countryside', isCorrect: false },
          { label: 'C', text: 'study at the best universities', isCorrect: false },
          { label: 'D', text: 'encourage others to care for the environment', isCorrect: true },
        ],
      },
      {
        text: 'What would a teacher at the White Star School say about it?',
        choices: [
          { label: 'A', text: 'We don\'t follow the national curriculum at all', isCorrect: false },
          { label: 'B', text: 'The school is only suitable for older children', isCorrect: false },
          { label: 'C', text: 'Although we spend a lot of time outdoors, it\'s very important to us that the children get the best education possible', isCorrect: true },
          { label: 'D', text: 'We never go inside the school building', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 13. WILDERNESS IN SOUTHERN UTAH ───
  {
    title: 'Wilderness in Southern Utah',
    passage: `The red-rock desert of southern Utah is one of the most dramatic landscapes in the United States. Towering sandstone cliffs, deep canyons, and ancient rock formations stretch for hundreds of miles under enormous skies. But this fragile wilderness is under threat, and the writer wants to consider whether the damage caused by off-road driving can be limited.

The word "wilderness" means different things to different people. However, the definition shared by both the general public and US legislation is relatively straightforward: wilderness means areas which are inhabited or visited by few people — places where nature exists largely undisturbed by human activity.

In recent years, southern Utah has experienced significant environmental changes. The region has always been arid, but there has been a reduction in the level of rainfall, making the desert ecosystem even more fragile than before. Rivers and streams that once flowed year-round now dry up for months at a time.

Into this delicate environment come off-road vehicles, or ORVs. The effect of ORV use in Tenmile Canyon has been particularly devastating. The noise, pollution, and physical damage caused by the vehicles have led to the disappearance of some types of fish and insects that once thrived in the canyon's streams and pools.

Many environmental organisations in the region are deeply frustrated. Their view is clear: there are not enough police officers in areas used by ORV drivers. Without proper enforcement, existing rules about where and when ORVs can be driven are routinely ignored. Drivers venture into protected areas, damage ancient rock art, and disturb nesting wildlife — and there is simply nobody there to stop them.`,
    questions: [
      {
        text: 'The first paragraph indicates that the writer wants to:',
        choices: [
          { label: 'A', text: 'encourage more tourists to visit southern Utah', isCorrect: false },
          { label: 'B', text: 'explain why the desert climate is changing', isCorrect: false },
          { label: 'C', text: 'consider whether damage caused by off-road driving can be limited', isCorrect: true },
          { label: 'D', text: 'describe the history of the region', isCorrect: false },
        ],
      },
      {
        text: 'According to the second paragraph, which definition of wilderness is shared by the general public and US legislation?',
        choices: [
          { label: 'A', text: 'areas without any roads or pathways', isCorrect: false },
          { label: 'B', text: 'areas which are inhabited or visited by few people', isCorrect: true },
          { label: 'C', text: 'areas owned by the government', isCorrect: false },
          { label: 'D', text: 'areas where farming is not permitted', isCorrect: false },
        ],
      },
      {
        text: 'What change that has occurred in southern Utah is mentioned in the third paragraph?',
        choices: [
          { label: 'A', text: 'The temperature has decreased significantly', isCorrect: false },
          { label: 'B', text: 'New animal species have appeared', isCorrect: false },
          { label: 'C', text: 'Tourism has declined sharply', isCorrect: false },
          { label: 'D', text: 'There has been a reduction in the level of rainfall', isCorrect: true },
        ],
      },
      {
        text: 'What effect has the use of ORVs in Tenmile Canyon recently had?',
        choices: [
          { label: 'A', text: 'It has created new jobs for local people', isCorrect: false },
          { label: 'B', text: 'It has improved access to remote areas', isCorrect: false },
          { label: 'C', text: 'It has attracted more visitors to the region', isCorrect: false },
          { label: 'D', text: 'The disappearance of some types of fish and insects', isCorrect: true },
        ],
      },
      {
        text: 'What view do many environmental organisations in the region have?',
        choices: [
          { label: 'A', text: 'ORVs should be encouraged as a tourist attraction', isCorrect: false },
          { label: 'B', text: 'The canyon should be closed to all visitors', isCorrect: false },
          { label: 'C', text: 'More research needs to be done on the local wildlife', isCorrect: false },
          { label: 'D', text: 'There are not enough police officers in areas used by ORV drivers', isCorrect: true },
        ],
      },
    ],
  },

  // ─── 14. ATHLETICS IN JAMAICA ───
  {
    title: 'Athletics in Jamaica',
    passage: `Every March, the National Stadium in Kingston, Jamaica, comes alive with the sound of cheering crowds, pounding feet, and the crack of starting pistols. The writer is discussing the importance of an athletics championship that has shaped Jamaican sport for over a century — the Inter-Secondary Schools Boys and Girls Championships, known simply as "Champs."

The Championships are one of the oldest school athletics competitions in the world. They started over 100 years ago, in 1910, when six boys' schools agreed to hold a combined sports day. Since then, the event has grown into a massive five-day competition involving thousands of young athletes from over one hundred schools across the island.

Former champion Dwayne Simpson, who won the 200 metres in 2003, speaks passionately about the impact of the event. "Champs encourages young athletes to do their best," he says. "When you're standing on that track with forty thousand people watching, you find a level of motivation you never knew you had."

The event also serves as a valuable preparation for the international stage. According to Nathaniel Day, a sports journalist who has covered Champs for over twenty years, the event helps young athletes get used to being filmed. "At Champs, every race is broadcast live on television," Day explains. "By the time these kids reach the Olympics, they've already experienced the pressure of performing in front of cameras."

Which statement best describes the Jamaica Schools Championships? It's an important event which helps young athletes to improve — and, as the long list of Olympic medals won by former Champs competitors demonstrates, its influence extends far beyond the island itself.`,
    questions: [
      {
        text: 'What is the writer doing in this text?',
        choices: [
          { label: 'A', text: 'Comparing Jamaican athletes with American athletes', isCorrect: false },
          { label: 'B', text: 'Discussing the importance of an athletics championship', isCorrect: true },
          { label: 'C', text: 'Explaining how to train for a running race', isCorrect: false },
          { label: 'D', text: 'Criticising the Jamaican education system', isCorrect: false },
        ],
      },
      {
        text: 'What does the text say about the Championships?',
        choices: [
          { label: 'A', text: 'They were cancelled during the war', isCorrect: false },
          { label: 'B', text: 'They started over 100 years ago', isCorrect: true },
          { label: 'C', text: 'They are only open to boys', isCorrect: false },
          { label: 'D', text: 'They take place every month', isCorrect: false },
        ],
      },
      {
        text: 'What does Dwayne Simpson say about the Championships?',
        choices: [
          { label: 'A', text: 'They are too competitive', isCorrect: false },
          { label: 'B', text: 'They should be held more often', isCorrect: false },
          { label: 'C', text: 'They encourage young athletes to do their best', isCorrect: true },
          { label: 'D', text: 'They are not as good as they used to be', isCorrect: false },
        ],
      },
      {
        text: 'According to Nathaniel Day, the event:',
        choices: [
          { label: 'A', text: 'is too expensive to organise', isCorrect: false },
          { label: 'B', text: 'helps young athletes get used to being filmed', isCorrect: true },
          { label: 'C', text: 'should not be shown on television', isCorrect: false },
          { label: 'D', text: 'only attracts local audiences', isCorrect: false },
        ],
      },
      {
        text: 'Which best describes the Jamaica Schools Championships?',
        choices: [
          { label: 'A', text: 'A small local event for primary school children', isCorrect: false },
          { label: 'B', text: 'It\'s an important event which helps young athletes to improve', isCorrect: true },
          { label: 'C', text: 'A holiday celebration with music and dancing', isCorrect: false },
          { label: 'D', text: 'An event that is no longer popular in Jamaica', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 15. A MATTER OF METRES (GIANTS) ───
  {
    title: 'A Matter of Metres',
    passage: `Almost every culture in the world has stories about giants — enormous beings who tower over ordinary humans. In this text, the author is describing large creatures that appear in myths, legends, and folklore from every corner of the globe.

According to the texts and traditions that have survived, some giants are portrayed as gentle and kind. They protect travellers, guard treasure, or use their enormous strength to help human communities. These are the "good giants" — the ones who appear in fairy tales as friendly, if rather clumsy, companions.

However, the best description, according to the author, of giants in Germanic and Scandinavian tales is quite different. In these northern European traditions, giants are terrifying. They are associated with chaos, destruction, and the wild forces of nature. The frost giants of Norse mythology, for example, are enemies of the gods — powerful, unpredictable, and frightening.

The question of whether giants ever really existed has fascinated scientists for centuries. Archaeological digs have occasionally turned up very large bones — the remains of animals, or in rare cases, unusually tall humans — that may have inspired the legends. These discoveries have led some researchers to suggest that ancient people, finding such bones, simply assumed that giants had once walked the earth.

The author believes that while most giant stories are clearly products of the imagination, some of the stories may be true — or at least inspired by real observations. The boundary between myth and reality, it seems, is not always as clear as we might think.`,
    questions: [
      {
        text: 'In this text the author is describing:',
        choices: [
          { label: 'A', text: 'famous buildings', isCorrect: false },
          { label: 'B', text: 'large creatures', isCorrect: true },
          { label: 'C', text: 'ancient cities', isCorrect: false },
          { label: 'D', text: 'modern sculptures', isCorrect: false },
        ],
      },
      {
        text: 'According to the text, some giants:',
        choices: [
          { label: 'A', text: 'live in the ocean', isCorrect: false },
          { label: 'B', text: 'can be quite nice', isCorrect: true },
          { label: 'C', text: 'are invisible', isCorrect: false },
          { label: 'D', text: 'only appear at night', isCorrect: false },
        ],
      },
      {
        text: 'What is the best description, according to the author, of giants in Germanic and Scandinavian tales?',
        choices: [
          { label: 'A', text: 'They are funny', isCorrect: false },
          { label: 'B', text: 'They are helpful', isCorrect: false },
          { label: 'C', text: 'They are scary', isCorrect: true },
          { label: 'D', text: 'They are small', isCorrect: false },
        ],
      },
      {
        text: 'What have scientists found?',
        choices: [
          { label: 'A', text: 'A living giant', isCorrect: false },
          { label: 'B', text: 'Very large bones', isCorrect: true },
          { label: 'C', text: 'A giant\'s house', isCorrect: false },
          { label: 'D', text: 'Ancient books about giants', isCorrect: false },
        ],
      },
      {
        text: 'The author believes that:',
        choices: [
          { label: 'A', text: 'giants definitely existed', isCorrect: false },
          { label: 'B', text: 'all giant stories are completely false', isCorrect: false },
          { label: 'C', text: 'some of the stories may be true', isCorrect: true },
          { label: 'D', text: 'scientists should stop studying giants', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 16. NEW WRITING 3 ───
  {
    title: 'New Writing 3',
    passage: `New Writing 3 is the latest in a series of anthologies that aim to showcase the best new fiction and poetry in Britain today. The writer is giving her opinions about a new book, and those opinions are overwhelmingly positive.

Why would somebody read this text? Simple: to find out more details about a collection that brings together some of the most exciting voices in contemporary literature. The book features sixteen contributions from writers at various stages of their careers, from debut novelists to established literary figures.

What does the writer think of New Writing 3? She considers it very good — a rich and varied collection that rewards repeated reading. Each piece offers something different, from quiet, reflective prose to bold experimental writing, and the overall standard is impressively high.

One piece that stands out is Jane Harris's short story, a darkly comic tale set aboard a ship. Harris describes scenes of seasickness with such vivid, unflinching detail that the reader might feel quite sick themselves after reading it. It's powerful, uncomfortable writing — but it stays with you.

Which of the following describes New Writing 3? Perhaps this: "Great value: the best of new writing for only £6.99." At that price, there is no excuse not to add this collection to your bookshelf.`,
    questions: [
      {
        text: 'What is the writer doing in this text?',
        choices: [
          { label: 'A', text: 'Giving her opinions about a new book', isCorrect: true },
          { label: 'B', text: 'Comparing different types of poetry', isCorrect: false },
          { label: 'C', text: 'Explaining how to become a writer', isCorrect: false },
          { label: 'D', text: 'Describing her own writing process', isCorrect: false },
        ],
      },
      {
        text: 'Why would somebody read the text?',
        choices: [
          { label: 'A', text: 'To learn how to write fiction', isCorrect: false },
          { label: 'B', text: 'To find out more details about something', isCorrect: true },
          { label: 'C', text: 'To discover a new bookshop', isCorrect: false },
          { label: 'D', text: 'To read a complete short story', isCorrect: false },
        ],
      },
      {
        text: 'What does the writer think of New Writing 3?',
        choices: [
          { label: 'A', text: 'It\'s boring', isCorrect: false },
          { label: 'B', text: 'It\'s too expensive', isCorrect: false },
          { label: 'C', text: 'It\'s very good', isCorrect: true },
          { label: 'D', text: 'It needs improvement', isCorrect: false },
        ],
      },
      {
        text: 'How might you feel after reading Jane Harris\'s piece?',
        choices: [
          { label: 'A', text: 'Sick', isCorrect: true },
          { label: 'B', text: 'Happy', isCorrect: false },
          { label: 'C', text: 'Bored', isCorrect: false },
          { label: 'D', text: 'Confused', isCorrect: false },
        ],
      },
      {
        text: 'Which of the following describes New Writing 3?',
        choices: [
          { label: 'A', text: 'An expensive coffee-table book with photographs', isCorrect: false },
          { label: 'B', text: 'A textbook for creative writing students', isCorrect: false },
          { label: 'C', text: 'Great value: the best of new writing for only £6.99', isCorrect: true },
          { label: 'D', text: 'A children\'s book of fairy tales', isCorrect: false },
        ],
      },
    ],
  },

  // ─── 17. MAN CLAIMS (CAESAR BARBER) ───
  {
    title: 'Man Claims He Was Misled Over Nutritional Content of Meals',
    passage: `In July 2002, a fifty-six-year-old maintenance worker from New York made headlines around the world. Caesar Barber filed a lawsuit against four of America's largest fast-food chains — McDonald's, Burger King, Wendy's, and KFC — claiming that their food had made him seriously ill. What makes Barber famous is that he sued fast-food chains for more than forty years of eating their products without, he claimed, ever being properly informed about the nutritional content of the meals.

Barber, who weighed over 120 kilograms at the time of the lawsuit, said he didn't know what the content of fast food was. "I always believed it was good, healthy food," he told reporters. "Nobody ever told me that eating burgers and fries every day would make me sick."

Despite suffering his first heart attack in 1996, Barber carried on eating fast food. He would later suffer a second heart attack and be diagnosed with diabetes. His lawyers argued that the fast-food companies bore significant responsibility because they had failed to provide clear nutritional information.

The American media reacted to the lawsuit with a mixture of outrage and amusement. Most commentators ridiculed Barber. Talk-show hosts made fun of him, editorial cartoonists drew him with enormous hamburgers, and the media made fun of Caesar Barber relentlessly. "Who forces this man to eat at McDonald's every day?" one columnist asked. "Is there a gun to his head?"

Caesar Barber's lawyer, Samuel Hirsch, argued that the case was about corporate responsibility, not personal weakness. Caesar Barber is trying to force fast-food companies to be more transparent about their products, Hirsch said. "These companies spend billions on advertising but pennies on nutritional education."

The expression "hard on the heels" of Barber's lawsuit, other plaintiffs came forward with similar cases, sparking a national debate about obesity and corporate responsibility. Mr Turney-McGrivey, a public health expert, said the publicity surrounding Barber's case was actually a good thing. It is good because it raises awareness about the connection between fast food and obesity, he explained. Whether or not Barber won his case, the conversation itself was valuable.

In the end, the writer concludes that Mr Barber raised awareness about the problem of obesity in a way that no public health campaign had managed to achieve. His lawsuit may have been mocked, but it forced Americans to think more carefully about what they were eating — and that, many would argue, was exactly the point.`,
    questions: [
      {
        text: 'Why is Caesar Barber famous?',
        choices: [
          { label: 'A', text: 'Because he sued fast food chains for more than 40 years', isCorrect: true },
          { label: 'B', text: 'Because he invented a new type of burger', isCorrect: false },
          { label: 'C', text: 'Because he was a famous chef', isCorrect: false },
          { label: 'D', text: 'Because he opened his own restaurant', isCorrect: false },
        ],
      },
      {
        text: 'What does Caesar Barber say about fast food?',
        choices: [
          { label: 'A', text: 'He always knew it was unhealthy', isCorrect: false },
          { label: 'B', text: 'He didn\'t know what the content of fast food was', isCorrect: true },
          { label: 'C', text: 'He only ate it occasionally', isCorrect: false },
          { label: 'D', text: 'He preferred home-cooked meals', isCorrect: false },
        ],
      },
      {
        text: 'After the first heart attack, Caesar Barber:',
        choices: [
          { label: 'A', text: 'stopped eating fast food immediately', isCorrect: false },
          { label: 'B', text: 'started a healthy diet', isCorrect: false },
          { label: 'C', text: 'carried on eating fast food', isCorrect: true },
          { label: 'D', text: 'began cooking his own meals', isCorrect: false },
        ],
      },
      {
        text: 'How did the American media react to this lawsuit?',
        choices: [
          { label: 'A', text: 'They supported Barber completely', isCorrect: false },
          { label: 'B', text: 'They ignored the story', isCorrect: false },
          { label: 'C', text: 'The media made fun of Caesar Barber', isCorrect: true },
          { label: 'D', text: 'They called for new laws', isCorrect: false },
        ],
      },
      {
        text: 'Caesar Barber\'s lawyer argues that:',
        choices: [
          { label: 'A', text: 'Barber should receive millions of dollars', isCorrect: false },
          { label: 'B', text: 'Caesar Barber is trying to force fast food companies to be more transparent', isCorrect: true },
          { label: 'C', text: 'all fast food restaurants should be closed', isCorrect: false },
          { label: 'D', text: 'only healthy food should be sold', isCorrect: false },
        ],
      },
      {
        text: 'What is Mr Turney-McGrivey\'s opinion about the publicity surrounding Caesar Barber\'s case?',
        choices: [
          { label: 'A', text: 'It was harmful to public health efforts', isCorrect: false },
          { label: 'B', text: 'It was a waste of time', isCorrect: false },
          { label: 'C', text: 'It is good because it raises awareness about the connection between fast food and obesity', isCorrect: true },
          { label: 'D', text: 'It was unfair to the fast food companies', isCorrect: false },
        ],
      },
      {
        text: 'The writer concludes that Mr Barber:',
        choices: [
          { label: 'A', text: 'was foolish to file the lawsuit', isCorrect: false },
          { label: 'B', text: 'raised awareness about the problem of obesity', isCorrect: true },
          { label: 'C', text: 'should have eaten less fast food', isCorrect: false },
          { label: 'D', text: 'won his lawsuit against the companies', isCorrect: false },
        ],
      },
    ],
  },
];

// ────────── MAIN ──────────
async function main() {
  const section = await prisma.section.findFirst({
    where: { type: SectionType.READING_COMPREHENSION },
  });
  if (!section) { console.error('❌ No READING_COMPREHENSION section found'); return; }

  // Get current max order
  const last = await prisma.question.findFirst({
    where: { sectionId: section.id },
    orderBy: { order: 'desc' },
  });
  let order = (last?.order ?? 0);

  let addedPassages = 0;
  let addedQuestions = 0;

  for (const p of passages) {
    // Check if passage already exists (by first question text)
    const exists = await prisma.question.findFirst({
      where: {
        sectionId: section.id,
        text: p.questions[0].text,
      },
    });

    if (exists) {
      console.log(`⏭️  Skip "${p.title}" — already exists`);
      continue;
    }

    for (const q of p.questions) {
      order++;
      await prisma.question.create({
        data: {
          sectionId: section.id,
          text: q.text,
          passage: p.passage,
          order,
          difficulty: 'MEDIUM',
          choices: {
            create: q.choices.map((c, ci) => ({
              label: c.label,
              text: c.text,
              isCorrect: c.isCorrect,
              order: ci + 1,
            })),
          },
        },
      });
      addedQuestions++;
    }
    addedPassages++;
    console.log(`✅ Added "${p.title}" (${p.questions.length} questions)`);
  }

  console.log(`\n🎉 Done! Added ${addedPassages} passages (${addedQuestions} questions)`);

  // Summary
  const total = await prisma.question.count({
    where: { sectionId: section.id },
  });
  console.log(`📊 Total RC questions now: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
