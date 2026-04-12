/**
 * updateRC_passages.ts — Upgrade 19 original RC passages to richer, more authentic CEPT-level texts
 * Run:  npx tsx prisma/updateRC_passages.ts
 * 
 * Matches by first question text → updates passage for all questions sharing it.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface PassageUpdate {
  firstQuestionMatch: string; // match Q1 text to find the right group
  newPassage: string;
}

const updates: PassageUpdate[] = [

  // ─── 1. A FAMILY CAR ───
  {
    firstQuestionMatch: 'The French woman was selling the car because',
    newPassage: `The Brookes family bought their car — a pale blue Citroën DS — from a French woman named Madame Lefèvre in the summer of 1998. She had owned the car for nearly twenty years but had always found the seats too hard for long journeys, and by the late nineties she had decided it was time to replace it with something more modern.

For the Brookes family, the car was a dream come true. They had always wanted a classic car, and the Citroën DS, with its elegant curves and smooth hydraulic suspension, was exactly what they had been looking for. What did the family enjoy doing most in their car? Without hesitation, they would tell you: travelling to other countries. Every summer, they would pack the boot with suitcases, cross the Channel by ferry, and spend weeks exploring the back roads of France, Italy, and Spain.

Remarkably, in all the years the Brookes family have owned the car, it has never had a new engine. The original engine, now over forty years old, still runs beautifully, thanks to regular servicing and the careful attention of the family's local mechanic.

Now, however, it is Alex Brookes — the eldest son, who inherited the car from his parents — who is thinking about selling it. "It's a wonderful car," he says, "and it still goes very well. The engine's smooth, the bodywork is solid, and it turns heads everywhere you go. But the truth is, I just don't use it any more. I live in central London now, and I cycle to work. The car sits in my garage month after month, and that's no life for a car like this."`,
  },

  // ─── 2. SCHOOLS OF THE AIR ───
  {
    firstQuestionMatch: 'Where does Jack live?',
    newPassage: `Jack Wilson is eleven years old, and he lives on a cattle station in the Australian outback, 20 kilometres from the nearest village. The station is vast — over 500 square kilometres of dusty red earth, scattered trees, and open sky. The closest neighbour is another cattle family, the Hendrys, whose homestead is forty minutes away by dirt road.

For children like Jack, who live in some of the most remote parts of Australia, attending a normal school is simply not possible. The distances are too great, and there are no school buses or public transport in the outback. This is where the Schools of the Air come in. Founded in the 1950s, they are the answer to an Australian problem: how to educate children who live hundreds or even thousands of kilometres from the nearest town.

Every morning after breakfast, Jack walks to a small room at the back of the homestead that serves as his classroom. He sits down at a desk, switches on the computer, and joins his class on the internet. His teacher, Mrs Patterson, appears on the screen from a studio in Alice Springs, and twenty-three other students — scattered across an area the size of France — log on from their own remote stations.

Lessons follow the same pattern as a regular school. During the Maths class, the format is surprisingly interactive. The pupils listen to their classmates as they take turns answering questions or explaining their methods, and Mrs Patterson provides feedback just as she would in a face-to-face lesson.

As well as online lessons, Jack receives things to watch and read — educational DVDs, printed worksheets, and reading materials that arrive by post every few weeks. These supplement his internet lessons and ensure he keeps up with the national curriculum.`,
  },

  // ─── 3. SINGING TOGETHER ───
  {
    firstQuestionMatch: 'What is the writer trying to do in this article?',
    newPassage: `What is the writer trying to do in this article? She is describing a teacher's ideas about the importance of singing — and those ideas belong to a remarkable woman named Ruth Bray.

Ruth used to be a shy person who would never dream of standing up in front of other people. But everything changed when a friend persuaded her to attend a community singing class one Tuesday evening. "I went along expecting to hate it," Ruth admits. "But by the end of the first session, I was smiling so much my face ached." She enjoyed the experience so much that it inspired her to start her own class.

Today, Ruth runs weekly singing workshops in a village hall in Somerset. Her classes are open to everyone, regardless of age or ability. You don't need to be able to read music. You don't need a beautiful voice. You just need to be willing to open your mouth and try. The article makes clear what the reader can find out: how singing is something anyone can do.

How does Ruth think singing with other people can help you? Her answer is simple but powerful: you can get to know other people. "When you sing together," she explains, "barriers come down. People who might never speak to each other in ordinary life find themselves standing side by side, sharing the same melody. Friendships form naturally."

Ruth's classes typically begin with breathing exercises, followed by simple warm-up songs before moving on to well-known pop songs and folk tunes that the group can enjoy together. Nobody is judged, nobody is criticised, and everybody leaves feeling better than when they arrived.

Which is the best advertisement for Ruth's singing classes? She laughs when asked. "SONGS FOR ALL!" she says. "Can you sing? Try our 'Singing for Everyone' class every week and find out! Make new friends."`,
  },

  // ─── 4. BODY SHOP ───
  {
    firstQuestionMatch: "What is the writer's main purpose in writing this text?",
    newPassage: `Anita Roddick opened the first Body Shop in Brighton, England, in 1976. It was a tiny shop with green-painted walls and hand-written labels on the bottles. From the very beginning, her main purpose in writing about it was clear: to introduce her ideas to the reader — ideas about business, ethics, and the environment that were revolutionary at the time.

What would someone learn from this text? Above all, they would learn what the writer's book is about. Roddick published her autobiography, Body and Soul, in 1991, and it became an international bestseller. In it, she describes how she built The Body Shop from a single store into a global empire with over two thousand outlets in fifty-four countries, all while refusing to compromise on her principles.

Roddick feels passionately about the business she runs. "The Body Shop is not like any other company," she writes. "We don't sell promises in a bottle. We don't test our products on animals. We don't exploit the communities we buy our ingredients from. We are different because we believe that business can be a force for good."

What kind of workers does the writer like to employ? Roddick is characteristically direct on this point. She wants workers who have the same attitudes as she does — people who care about the environment, who believe in fair trade, and who are not motivated solely by profit. "I don't want employees who just want a pay cheque," she says. "I want activists."

What kind of person does the writer seem to be? She seems to be someone with strong opinions — a woman who believes deeply in social justice and environmental protection, and who is not afraid to challenge the conventional wisdom of the business world. Whether you agree with her or not, there is no doubting her sincerity.`,
  },

  // ─── 5. JACQUES COUSTEAU ───
  {
    firstQuestionMatch: 'What is the writer trying to do in this text?',
    newPassage: `The writer is trying to introduce readers to the remarkable life and achievements of Jacques-Yves Cousteau, the French naval officer, explorer, filmmaker, and marine conservation pioneer who brought the wonders of the underwater world into millions of living rooms around the globe.

Born in Saint-André-de-Cubzac, France, in 1910, Cousteau was a curious and adventurous child. However, as a child, Cousteau had delicate health. He suffered from chronic stomach problems and anaemia, and his parents were often worried about his fragile constitution. Despite this, young Jacques was drawn to water from an early age, teaching himself to swim as a boy and developing a lifelong love of the sea.

In his twenties, Cousteau joined the French Navy and seemed destined for a career as a pilot. But fate intervened. In a car accident in 1936, he broke both his arms — his extremities were so badly damaged that doctors initially feared he would never regain full use of them. During his long recovery, Cousteau began swimming in the Mediterranean as a form of therapy, and it was during these swims that he first experienced the magic of the underwater world.

Determined to stay underwater for longer, Cousteau developed underwater breathing equipment — the "Aqua-Lung" — together with the engineer Émile Gagnan in 1943. His motivation was clear: to extend his underwater investigations beyond the few minutes that conventional equipment allowed.

During World War II, while still developing his diving technology, Cousteau collaborated with underground resistance fighters in France. He used his naval skills and connections to gather intelligence for the Allies, an experience that would later inform his determination and resourcefulness as an explorer.

After the war, Cousteau turned his attention to filmmaking and ocean exploration. His ship, the Calypso, became one of the most famous research vessels in history, and his television series, The Undersea World of Jacques Cousteau, captivated audiences worldwide.`,
  },

  // ─── 6. WINTER DRIVING ───
  {
    firstQuestionMatch: 'What is the writer trying to do in this text?',
    newPassage: `Every winter, roads become more dangerous because of ice, snow, and reduced visibility. The writer is trying to advise people about safe driving in winter — offering practical tips that could prevent accidents and save lives.

Why would somebody read this text? The answer is simple: to learn about better driving. Whether you are an experienced motorist or a newly qualified driver, the challenges of winter roads demand respect. Even a short journey to the shops can become hazardous when temperatures drop below freezing.

The writer's central message is that drivers should expect problems in winter. "Don't assume the roads will be fine just because they were clear yesterday," the text warns. "Conditions can change overnight. Black ice — invisible and deadly — can form on roads that look perfectly dry." Drivers are advised to check weather forecasts before setting out, to allow extra time for journeys, and to keep an emergency kit in the car including a torch, blanket, warm clothes, and a fully charged mobile phone.

One of the most memorable pieces of advice in the text concerns the way drivers should handle their vehicles in icy conditions. Why does the writer talk about a cup of coffee? It is to explain the importance of smooth movements. "Imagine you have a cup of hot coffee on the dashboard," the text suggests. "Every time you brake, steer, or accelerate, do it so gently that not a single drop spills. That's how smooth your driving should be on ice." This vivid image captures perfectly the need for gentle, gradual inputs when road surfaces are slippery.

Which traffic sign shows the main idea of the text? The answer is clear: "DRIVE CAREFULLY! ICE ON ROAD AHEAD." That single sign sums up everything the writer is trying to communicate — awareness, caution, and the willingness to adjust your driving to suit the conditions.`,
  },

  // ─── 7. HOMAGE TO KEFALONIA ───
  {
    firstQuestionMatch: 'When the writer mentioned she was going to Kefalonia, other people were',
    newPassage: `When I told people I was going to the Greek island of Kefalonia, several of them looked at me with raised eyebrows. "Kefalonia?" they said. "Why on earth would you go there?" Friends who had visited other Greek islands — Santorini, Mykonos, Crete — were discouraging. "There's nothing there," one told me. "It's quiet, remote, and the beaches aren't as good as people say."

How wrong they were. From the moment I stepped off the ferry at the port of Sami, I knew I had found somewhere special. The town itself is small and unpretentious — a crescent of pastel-coloured houses curving around a calm harbour. In the evenings, the narrow streets come alive. Children play football between the tables of waterfront tavernas while their grandparents sit on balconies above, calling down to friends. Teenagers stroll arm in arm past elderly men playing backgammon outside the kafenio. The streets in the town of Sami are full of a mix of the entire population — young and old, locals and visitors all mingling together.

The highlight of my trip was the Melissani cave, a breathtaking underground lake just outside Sami. Visitors descend a staircase into the cool darkness and are rowed across turquoise water in small wooden boats. What does the writer recommend about the Melissani cave? I would strongly advise seeing the cave at a particular time for the best view — around midday, when sunlight streams through the collapsed roof and illuminates the water with an almost supernatural blue-green glow. The effect is unforgettable.

What does the writer say about influences from abroad in Kefalonia? The island bears the traces of centuries of Venetian rule. There are ruins of buildings from a different age and culture — crumbling fortresses, elegant archways, and stone churches with distinctly Italian bell towers that stand as reminders of a time when Kefalonia was part of the Republic of Venice.

In 2001, the film Captain Corelli's Mandolin was shot on the island, bringing Kefalonia to international attention. What did the director of the film say about Kefalonia? He was characteristically enthusiastic: "The inhabitants of the island are very special," he said. "Their warmth, their generosity, their love of life — these qualities are what make Kefalonia the perfect setting for this story."`,
  },

  // ─── 8. LETTER TO NEWPORT EVENING NEWS ───
  {
    firstQuestionMatch: 'What is the writer trying to do in the letter?',
    newPassage: `Dear Editor,

I am writing to thank the kind people of Newport who helped me during what turned out to be a very difficult day last Tuesday. My purpose in writing this letter is simple: to show my thanks for the extraordinary kindness I received from complete strangers.

I had driven into the city centre to do some shopping when my car broke down on Bridge Street. I was blocking traffic, my hazard lights were flashing, and I couldn't get the engine to start again. To make matters worse, it started raining heavily. I sat in my car feeling completely helpless.

Within minutes, three people had stopped to help. A young man in overalls pushed my car off the road and into a side street. An older woman brought me a cup of tea from the café next door and stayed with me until the breakdown service arrived. A third person — a teenager on a bicycle — offered to lend me his mobile phone to make a call.

What will the reader learn from the letter? I hope they will learn that there are some kind people in Newport — people who are willing to go out of their way to help a stranger in distress.

How did the writer feel after her experience? I was surprised that nothing was stolen. My handbag was on the passenger seat, clearly visible, while I stood outside the car talking to the breakdown service. Yet not one person touched it or showed the slightest interest in it. In a world where we are constantly warned about crime, this felt remarkable.

And the tears? Why did the writer cry? Not because of the car, or the rain, or the inconvenience. I cried because I was anxious — overwhelmed by the stress of the day and the relief of being helped at my lowest moment.

What would be a good headline for this letter? I suggest: "Woman's bad day has a happy ending."

Yours faithfully,
Margaret Thompson`,
  },

  // ─── 9. LAURENCE STEPHEN LOWRY ───
  {
    firstQuestionMatch: 'What did Lowry do after work?',
    newPassage: `Laurence Stephen Lowry was born in Stretford, Manchester, in 1887, the only child of Robert and Elizabeth Lowry. From the age of sixteen, he worked as a clerk for a property company in Manchester, collecting rents from tenants across the city — a job he held for over forty years.

What did Lowry do after work? Every evening, he would return home to his small house in Pendlebury, set up his easel, and paint. He studied art at evening classes at the Manchester School of Art and later at the Salford School of Art, spending over twenty years as a part-time student. His teacher, the French Impressionist Adolphe Valette, taught him the fundamentals of composition and colour, but Lowry's distinctive style — the famous "matchstick figures" set against industrial landscapes — was entirely his own.

Lowry's family had mixed feelings about his creative pursuits. His mother, a proud and ambitious woman, initially considered art a waste of time. But she came to appreciate her son's talent, and in later years, his family liked his paintings — particularly his scenes of working-class life in the industrial north.

For many years, Lowry worked in complete obscurity. Then, in 1938, everything changed when a London art dealer named Alexander Reid saw Lowry's paintings and was immediately impressed. Lowry became famous because an important man liked his paintings. Reid arranged Lowry's first London exhibition in 1939, and from that moment, the art world began to take notice.

When Lowry stopped working in the office at the age of sixty-five, he devoted himself entirely to painting. Commissions and sales flooded in. When Lowry stopped working in the office, he became rich — or at least comfortably wealthy, though he continued to live modestly in the same small house in Mottram-in-Longdendale until his death in 1976.

Today, Lowry's work is loved in his own country. A major gallery in Salford — The Lowry — was opened in 2000 to house the largest collection of his paintings, and his images of mills, chimneys, and hurrying figures have become iconic symbols of northern England.`,
  },

  // ─── 10. DON'T CALL ME ───
  {
    firstQuestionMatch: "What is the writer's aim in the article?",
    newPassage: `I've had it with mobile phones. Everywhere you go, people are glued to their screens. On the bus. In restaurants. Even at funerals. The writer's aim is clear: to express his dislike of mobile phones and to argue that they are doing far more harm than good.

What is the writer's main complaint? It goes beyond personal inconvenience. Mobile phones are anti-social. They create invisible walls between people. Have you noticed how a group of friends can sit together in a café without exchanging a single word, each one scrolling through their individual feeds? We are more connected than ever, yet lonelier than ever. The device that was supposed to bring us together has, in many ways, pushed us apart.

How does the writer feel about using mobile phones in public places? The answer is: annoyed. Deeply, thoroughly annoyed. "Last week," the writer recalls, "I was at the cinema. At the cinema! And the man next to me spent half the film checking his messages. The glow from his screen kept distracting me. When I politely asked him to put it away, he looked at me as if I were mad."

The writer is equally concerned about mobile phones in schools. What does the writer think about phones in schools? He believes there are interruptions to lessons because of mobile phones. "Teachers tell me that phones vibrate, beep, and buzz throughout the day," the writer says. "Some students can't resist checking notifications under their desks. The result is a classroom full of half-distracted minds."

The writer concedes that mobile phones have their uses — for emergencies, for navigation, for keeping in touch with elderly relatives. But the constant, compulsive checking, the addiction to social media, the erosion of face-to-face conversation — these, the writer insists, are too high a price to pay.`,
  },

  // ─── 11. LITTLE CHEFS ───
  {
    firstQuestionMatch: 'What is the writer trying to do in this text?',
    newPassage: `Philippe Durand runs cooking classes for children aged 8 to 14 at his restaurant in London. Every Saturday morning, a group of young would-be chefs gathers in his professional kitchen, puts on miniature aprons, and learns to chop, stir, and sauté under Philippe's watchful guidance. The writer is trying to describe how some children spend their spare time — and the results are impressive.

What can the reader learn from the text? The article explains why the classes are so successful. Philippe's approach is simple: he treats his young students with the same respect he would give to adult trainees. They use real knives (under supervision), work with fresh ingredients, and cook real dishes — not simplified children's versions.

One of Philippe's students is twelve-year-old Fiora, who has been attending the classes for six months. Why did Fiora join the course? Her mother explains: "Fiora wasn't interested in cooking at all. She wanted to spend all her time on the computer. I signed her up because I wanted her to develop an interest in something practical — something away from screens." Now, Fiora is one of Philippe's most enthusiastic students.

What does Philippe say about his young students? He is characteristically optimistic. "These children are learning skills that will last a lifetime," he says. "They will be confident about cooking in the future. When they leave home and go to university, they won't have to live on takeaways. They'll know how to make a proper meal."

What would one of Philippe's students say about the course? One eleven-year-old boy captures the typical experience perfectly: "I was on a waiting list for ages, but now I'm on the course. Last week I cut up some onions — it was hard! My eyes were streaming. But then I made this amazing soup from scratch, and my whole family had it for dinner. It was the best feeling."`,
  },

  // ─── 12. NOTTING HILL CARNIVAL ───
  {
    firstQuestionMatch: "What is the writer's main aim in writing the text?",
    newPassage: `The Notting Hill Carnival is one of the largest street festivals in Europe. It transforms the streets of west London into a dazzling celebration of Caribbean culture, music, dance, and food. The writer's main aim is to understand and describe the Notting Hill Carnival — to explain what makes this annual event so special.

The carnival has its roots in the Caribbean community that settled in the Notting Hill area of London in the 1950s and 1960s. According to the passage, Notting Hill Carnival is held annually in August, over the Bank Holiday weekend. What began as a small indoor event organised by the Trinidadian journalist Claudia Jones in 1959 has grown into a massive celebration attracting over one million visitors each year.

During the Notting Hill Carnival, the atmosphere is electric. Music and colour fill the streets of London as enormous sound systems blast calypso, soca, reggae, and dancehall from every corner. Steel drum bands play on mobile stages, and DJs compete to create the most exciting sets. The air is thick with the scent of jerk chicken, curry goat, and fried plantain from the food stalls that line every street.

The writer claims that the visual spectacle is equally breathtaking. Dancers in the carnival wear special clothes — elaborate, hand-crafted costumes adorned with feathers, sequins, and brilliantly coloured fabrics. These costumes, which can take months to make, are rooted in the masquerade traditions of Trinidad and represent themes of freedom, joy, and cultural pride.

Although the carnival is a celebration of the traditions of black British and Caribbean communities, its appeal extends far beyond any single group. Everyone seems to participate in it. Families of every background line the streets to watch the parade, children dance alongside costumed performers, and the festival has become, over the decades, a beloved part of London's cultural identity.`,
  },

  // ─── 13. A HOTEL UNDER THE SEA ───
  {
    firstQuestionMatch: 'What is the writer doing in this text?',
    newPassage: `Architects have designed a luxury hotel that will be built beneath the surface of the Indian Ocean, off the coast of an East African island. The writer is giving information about an underwater hotel that promises to redefine the concept of luxury travel.

The plans reveal a spectacular structure. A disc-shaped building, anchored to the seabed at a depth of twelve metres, will contain twenty guest rooms, a restaurant, a spa, and an underwater lounge. What do we learn about the hotel? It will only have a small number of rooms — just twenty in total — ensuring an exclusive, intimate experience for every guest.

What can guests do in the hotel? Each room will feature floor-to-ceiling windows offering panoramic views of the surrounding reef. Guests will be able to watch the ocean life near the hotel — tropical fish, sea turtles, rays, and even the occasional dolphin — from the comfort of their bed. "Imagine falling asleep watching a sea turtle glide past your window," says the lead architect. "That's what we're creating."

The designers are particularly proud of the hotel's environmental credentials. What is the best thing about the hotel, according to the designers? They are emphatic: it won't cause any damage to the environment. The structure has been designed to function as an artificial reef, attracting marine life rather than displacing it. Solar panels on the surface platform will provide renewable energy, waste water will be recycled, and the construction materials have been chosen to minimise harm to the surrounding ecosystem.

What might a guest in this hotel say? One early investor summed it up perfectly: "It's great to stay in such a beautiful hotel that is also good for the planet. Usually, luxury and sustainability don't go together. This hotel proves they can."`,
  },

  // ─── 14. MICHAEL FENTON ───
  {
    firstQuestionMatch: 'What is the author trying to do in the text?',
    newPassage: `Michael Fenton believes you don't need a gym to stay fit. In fact, he believes that one of the best workouts you can get is right there in your own home — and you don't even need any special equipment. The author is trying to talk about keeping fit at home, and Fenton's approach is both practical and surprisingly effective.

Why would somebody read this text? Not to learn complicated exercise theory, but rather to learn how to save time — specifically, how to combine exercise with daily household tasks. Fenton's "Home Exercise Programme" is built around the idea that ordinary chores can become a full-body workout if approached with the right mindset.

What does the writer think about this exercise programme? The verdict is clear: you can exercise while doing the housework. Vacuuming becomes a chance to work the arms and shoulders. Mopping the floor involves deep lunges that strengthen the thighs and glutes. Carrying laundry baskets up and down the stairs is essentially a weighted cardio workout. Even washing windows, with its reaching and stretching movements, becomes an upper-body exercise.

Fenton's programme includes a structured thirty-minute routine that covers all the major muscle groups. He recommends starting with five minutes of brisk walking or jogging on the spot to warm up, then moving through a sequence of household tasks that have been carefully designed to target different parts of the body. Each "exercise" lasts three to four minutes, with a brief rest in between.

How might you feel after Michael Fenton's exercise programme? Most people report feeling tired but pleased — physically drained from the workout but satisfied with both the exercise and the fact that the house is now cleaner than when they started.`,
  },

  // ─── 15. LETTER TO TEENAGE MAGAZINE ───
  {
    firstQuestionMatch: 'What is the writer complaining about in the letter?',
    newPassage: `Dear Editor,

I am writing about a problem that makes me furious every time I take the train to school. The writer is complaining about a specific issue: adults can be thoughtless on trains.

Every morning, I catch the 7:45 from Didcot to Reading. The train is always packed — and this is the first thing I want readers to discover: there are too few seats on trains. Most mornings, I have to stand in the aisle for the entire journey, squashed between commuters with newspapers and briefcases.

But it's not just the overcrowding that bothers me. What really makes me angry is the behaviour of some of the adults. What is the writer's opinion about some passengers? Put simply: they behave badly. They push past younger passengers to get to empty seats. They put their bags on the seat next to them so nobody can sit down. They talk loudly on their phones about boring office meetings while everyone else tries to read or sleep.

Last Thursday, something happened that was the final straw. I was standing near the door when the train lurched suddenly. A man with a heavy rucksack stumbled into me, and the metal buckle on his bag hit my leg so hard that I had a bruise for days. Why couldn't the writer leave the train easily? Because somebody had hurt her, and her leg was so painful that she could barely walk to the door when her stop came.

I know adults often complain about the behaviour of teenagers. But from what I've seen, it's the adults who need to learn some manners.

What would be a good headline for Charlotte's letter? I suggest: "Where have all the nice people gone?"

Charlotte Baker, aged 15
Didcot, Oxfordshire`,
  },

  // ─── 16. THE PRICE OF A PERFECT HOLIDAY? ───
  {
    firstQuestionMatch: 'The purpose of the text is to:',
    newPassage: `Cruise ships are often seen as the ultimate holiday experience — floating cities offering unlimited food, world-class entertainment, and the chance to visit multiple destinations without unpacking your suitcase. But beneath the glamour lies a darker reality. The purpose of the text is to explain some of the problems that cruise ships cause for the environment and for the communities they visit.

The environmental impact of cruise ships is staggering. One reason cruise ships cause a lot of air pollution is because they use types of fuel that are not permitted on land. Most large cruise ships burn heavy fuel oil — a thick, tar-like substance that is a by-product of the petroleum refining process. This fuel contains up to 3,500 times more sulphur than the diesel used in cars and lorries. The result is that a single large cruise ship can produce as much particulate pollution as a million cars.

The waste problem is equally alarming. What do we learn about the waste products on cruise ships? An enormous amount of the waste water isn't recycled. A typical cruise ship generates over one million litres of grey water (from showers, sinks, and kitchens) per week, and while some modern vessels have advanced treatment systems, many older ships simply dump untreated or partially treated waste water directly into the sea.

Cruise ships also create economic problems for the ports they visit. Why are cruise ship passengers not popular in some cities? The main reason is that they don't spend money on meals. Passengers eat breakfast, lunch, and dinner on board the ship, so when they disembark for a few hours in a port city, they are unlikely to visit local restaurants. They browse souvenir shops and take photographs, but the economic benefit to the local community is far less than that of tourists who stay in hotels and eat in restaurants.

Which best describes large cruise ships? Perhaps the most honest assessment is this: they seem to offer ideal relaxing holidays, but they aren't environmentally friendly. Until the industry addresses its pollution, waste, and community impact, the environmental cost of a "perfect" cruise holiday remains unacceptably high.`,
  },

  // ─── 17. AINSLEY HARRIOTT ───
  {
    firstQuestionMatch: "What is the writer's main purpose in writing the text?",
    newPassage: `Ainsley Harriott is one of the most recognisable TV cooks in Britain. But Ainsley is far more than just a man who makes omelettes on camera. He is an entertainer — a natural performer whose boundless energy, infectious laugh, and gift for comedy have made him a household name. The writer's main purpose in writing the text is to describe how Ainsley lives — his daily routines, his passions, and the things that matter most to him.

What would a reader learn about Ainsley from the text? Above all, that he enjoys spending time with his family. Despite his busy schedule of television recordings, book promotions, and live cooking shows, Ainsley always makes time for his children. "Family comes first," he says simply. "Everything else is just work."

Born in Paddington, London, in 1957, Ainsley trained as a chef at Westminster Kingsway College before working his way up through some of London's top restaurant kitchens. His breakthrough came as the presenter of BBC's Ready Steady Cook, a programme that showcased not just his cooking skills but also his remarkable ability to make audiences laugh.

What does he say about his working life? Ainsley reveals that he gets his best ideas at certain times — specifically, in the early morning, when the house is still quiet. "I'm a morning person," he says. "I wake up around five, make myself a cup of tea, and sit in the kitchen thinking about recipes. That's when the creativity flows. By the time the rest of the family wakes up, I've usually planned the whole week's cooking."

Which of the following is the best description of the writer? He is the TV cook who loves making people laugh, watching football, and having a happy family life. Off screen, Ainsley is a devoted father, a keen footballer, and a man who measures success not in ratings or book sales, but in the smiles of the people around him.`,
  },

  // ─── 18. ACTIVITY CENTRE ───
  {
    firstQuestionMatch: 'What is the writer trying to do in this text?',
    newPassage: `Last weekend, I went to an activity centre in the countryside with a group of friends and workmates. The writer is trying to say how she spent some free time — and what a weekend it turned out to be.

The centre is set in beautiful countryside, surrounded by rolling hills and ancient woodland. We arrived on Friday evening and were shown to our rooms — basic but comfortable bunk-bedded dormitories in a converted farmhouse. What can the reader learn from the text? Above all, what sort of activities you can experience at the Centre — and the range is extraordinary.

Over two days, we tried rock climbing, abseiling, kayaking, mountain biking, and archery. The rock climbing was the biggest challenge for most of us — clinging to a cold, damp cliff face with nothing but a rope between you and a fifteen-metre drop is not for the faint-hearted. But with the help of experienced instructors who talked us through every handhold, even the most nervous members of the group made it to the top.

How do you think the writer might describe her weekend? Interesting. "Interesting" barely begins to cover it, but it captures the spirit of the experience — constantly discovering new things about ourselves and each other.

What do we learn about the group? Some of them already knew each other from work, but others — myself included — were meeting for the first time. By the end of the weekend, those initial awkward introductions had been forgotten, and genuine friendships had formed.

Which of the following advertisements describes the Activity Centre? The most accurate would be this: "Set in beautiful countryside. Accommodation provided. Work with a group — we show you a range of outdoor activities that you didn't realise you could do!"`,
  },

  // ─── 19. SIX MONTHS AGO ───
  {
    firstQuestionMatch: 'When the first day of the job arrived, the writer was surprised:',
    newPassage: `Six months ago I started working at a nursery school. When the first day of the job arrived, I couldn't believe it. I was surprised that the day had come round so quickly. It felt like only yesterday that I had applied for the position, gone through the interview, and received the letter offering me the job. Suddenly, here I was, standing outside the nursery gate at eight o'clock on a Monday morning, my heart pounding.

When the writer arrived to start her job, she quickly realised something uncomfortable. She realised she should have done more preparation. She had read the nursery's brochure, of course, and had a general idea of the daily routine. But she hadn't anticipated the sheer chaos of thirty four-year-olds arriving all at once — some crying, some laughing, some clinging to their parents' legs, and at least three running in circles around the cloakroom.

According to the writer, the parents' behaviour was one of the most surprising aspects of the morning. The parents were, for the most part, glad to leave their children. Some barely paused to hang up their child's coat before heading for the door. Others practically sprinted to the car park. It was clear that for many of them, the nursery represented a precious few hours of peace and quiet.

The writer's worst moment came on the third day, when a little girl called Sophie fell off the climbing frame and screamed so loudly that the writer was certain she had broken something. The writer's worst moment was hard to put into words — the panic, the guilt, the fear that she had failed to keep a child safe. (Sophie, it turned out, was absolutely fine.)

The experience taught the writer something important about perspective. According to the writer, adults sometimes forget that children have worries too. A lost teddy bear, a broken crayon, a friend who doesn't want to play — these might seem trivial to a grown-up, but to a four-year-old, they are the end of the world.`,
  },
];

// ────────── MAIN ──────────
async function main() {
  const section = await prisma.section.findFirst({
    where: { type: 'READING_COMPREHENSION' as any },
  });
  if (!section) { console.error('❌ No RC section found'); return; }

  let updated = 0;
  let skipped = 0;

  for (const u of updates) {
    // Find matching question by text
    const matchQ = await prisma.question.findFirst({
      where: {
        sectionId: section.id,
        text: { contains: u.firstQuestionMatch },
      },
    });

    if (!matchQ) {
      console.log(`⚠️  No match for: "${u.firstQuestionMatch.substring(0, 50)}..."`);
      skipped++;
      continue;
    }

    // Find all questions sharing the same passage
    const oldPassage = matchQ.passage || '';
    const siblings = await prisma.question.findMany({
      where: {
        sectionId: section.id,
        passage: oldPassage,
      },
    });

    // Update all siblings with new passage
    for (const sib of siblings) {
      await prisma.question.update({
        where: { id: sib.id },
        data: { passage: u.newPassage },
      });
    }

    updated++;
    console.log(`✅ Updated "${u.firstQuestionMatch.substring(0, 50)}..." (${siblings.length} questions)`);
  }

  console.log(`\n🎉 Done! Updated ${updated} passages, skipped ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
