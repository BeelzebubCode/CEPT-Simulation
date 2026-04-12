/**
 * updateListening1.ts — Upgrade part 1 of Listening transcripts to richer CEPT-level texts.
 * Run: npx tsx prisma/updateListening1.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  {
    qMatch: "At the beginning of a radio play, you hear a girl leaving a message for her friend. Where is the speaker?",
    speech: "Girl: Hi Sarah, it's Lucy. Look, I'm so sorry, I don't think I'm going to make it to your place on time. I left home early enough, and if I had taken the train I'd be there by now, but I decided to drive instead. It was a mistake—there's been a huge accident on the ring road, and I'm just sitting here completely stuck in my car staring at the brake lights ahead of me. I'll let you know when the traffic moves."
  },
  {
    qMatch: "At the moment, the shopping centre sells:",
    speech: "Announcer: Welcome to Riverside Shopping Centre! We know many of you are looking forward to our new electronics and furniture store opening next month on the ground floor. But for now, our focus is entirely on fashion. This week we have amazing offers across all our current departments, and all clothes are now thirty percent off. Don't miss out on grabbing some fantastic coats and dresses at bargain prices!"
  },
  {
    qMatch: "For his most recent television program, John:",
    speech: "Interviewer: John, you've made incredible documentaries. Your film about rivers was a masterpiece, and your trip to Africa won an award. What did you do for your latest project?\nJohn: Well, I wanted to do something completely different from studying animals in a zoo or trekking across dry land. So, for my most recent television program, I actually spent an entire year going completely out of my comfort zone—I went to the Pacific Ocean. Living on boats and studying deep-sea marine life for twelve months was the greatest challenge of my career."
  },
  {
    qMatch: "Frank finds ships quickly because he:",
    speech: "Interviewer: Frank, you've been diving for shipwrecks for over twenty years now. Some people think it's because you read old books or ask local fishermen for tips.\nFrank: People do assume that! And yes, having many years of experience helps you recognize what to look for. But the real secret to my speed these days isn't the history books or local legends. It's the fact that I use the latest equipment. With modern sonar technology and deep-water GPS, I can scan the seabed and pinpoint a wreck in a fraction of the time it used to take."
  },
  {
    qMatch: "From Edinburgh, the campsite is:",
    speech: "Man: Are you still planning to go to that campsite in the Scottish Highlands?\nWoman: Yes! It looks fantastic. Initially, I thought it was quite far, maybe 80 miles away, but it turns out I misread the map.\nMan: So how far is it from Edinburgh?\nWoman: It's actually exactly 40 miles north of Edinburgh. Much closer than I thought. If we leave early, it shouldn't take us more than an hour to drive there, depending on the traffic of course."
  },
  {
    qMatch: "How is the station's gym different from other city gyms?",
    speech: "Man: I'm thinking of joining the new Station Fitness gym. Have you been?\nWoman: I have. It's a bit smaller than the massive City Leisure Centre, and no, it doesn't have a swimming pool, unfortunately.\nMan: So why are so many people going there?\nWoman: Because of the price. While other city gyms charge fifty or sixty pounds, Station Fitness is not so expensive. Their monthly membership is just twenty pounds, which is a bargain considering they have all the same weights and running machines."
  },
  {
    qMatch: "How much does Philip pay for the photography?",
    speech: "Woman: Did you finally sign up for that evening photography course, Philip? I heard it was somewhere around £100.\nPhilip: I did, but it wasn't that much actually. The advanced class is £120, and there's a basic weekend workshop for £50. But the ten-week course I chose is exactly £75. And the best part is that the £75 includes all the printed materials and lab time, so there are no hidden costs."
  },
  {
    qMatch: "Jamie agrees to move into the new flat on:",
    speech: "Landlord: Hi Jamie, the previous tenants are moving out on Friday, so the cleaners will be in on Saturday morning. Would you be able to move your things in on Monday?\nJamie: Monday is difficult because I have work all day. I can't really do Saturday either, as I'm helping my parents with something. How about Sunday afternoon?\nLandlord: Sunday works perfectly. I'll have the keys ready for you by then.\nJamie: Great, see you on Sunday!"
  },
  {
    qMatch: "On her first flight alone, Jane didn't:",
    speech: "Jane: My instructor had planned the whole route for me. I felt surprisingly confident when I took off, and I managed to follow the route perfectly for the first thirty minutes. But then, I was supposed to use a large white house on a hill as my main landmark to turn south. From the air, everything looked different and I just couldn't recognize the white house I was looking for. I eventually managed to land safely using my instruments, but it was a bit stressful."
  },
  {
    qMatch: "On the news you hear a story about a cat. Where was the cat found?",
    speech: "Newsreader: And finally today, a remarkable rescue story. Local residents had been searching gardens, rooftops, and even inside the local convenience shop for a missing ginger cat named Barnaby. But Barnaby wasn't in the neighborhood at all. Railway workers discovered him hiding underneath a seat inside a train carriage. The adventurous cat had apparently sneaked aboard and travelled over two hundred miles before being returned to his relieved owners."
  },
  {
    qMatch: "On weekdays, a visit to the park costs:",
    speech: "Park Guide: We're open every day of the week, but please note our admission prices vary. On weekends, because we have extra attractions running, it's $15 per adult. However, on weekdays, when it's much quieter, admission is just $12. We also have a special discount rate of $8 for seniors, and of course, children under five can go entirely for free regardless of the day."
  },
  {
    qMatch: "Peter failed the test because he:",
    speech: "Woman: Did Peter finally pass his driving test?\nMan: No, he failed again! It's such a pity because he wasn't too nervous this time, and he didn't drive too fast either, which was his problem last time.\nWoman: Did he drive the wrong way down a one-way street?\nMan: No, worse than that. The examiner said he had a perfect drive right until the end, but then he just didn't stop at the traffic lights when they turned red. Automatic fail, unfortunately."
  },
  {
    qMatch: "Roger thinks the best time to go to the campsite is:",
    speech: "Roger: People always tell you to go camping in summer to get the best weather. Personally, I find summer too crowded, and winter is simply too cold to sleep outdoors. Even spring can be a bit rainy and unpredictable. For me, autumn is the perfect time. The leaves are changing colour, the air is crisp but manageable, and you basically have the whole campsite to yourself."
  },
  {
    qMatch: "Sarah earns enough money from her painting for:",
    speech: "Interviewer: Sarah, you've been a professional artist for a year now. Are you making a comfortable living from your work?\nSarah: Well, to be honest, I certainly couldn't afford to rent a private studio or take a holiday abroad! I still work part-time in a café to pay my rent and food bills. But I do sell a few paintings each month. It's not a fortune, but it does pay for my artist's materials—the canvases, paints, and brushes—which means my hobby pays for itself, at least."
  },
  {
    qMatch: "The A-Z of Photography will not interest experienced photographers because:",
    speech: "Reviewer: If you're picking up a camera for the very first time, 'The A-Z of Photography' is a fantastic purchase. It's full of excellent pictures, and it's certainly not too expensive. It's also fully up to date with the latest digital cameras. However, experienced photographers should save their money—the information is unsuitable for them because it only covers basic settings and gives no technical depth at all."
  },
  {
    qMatch: "The first old ship which Frank found was:",
    speech: "Interviewer: Frank, over the years you've discovered many wrecks in deep water, some filled with treasure, some incredibly ancient. But what about your very first discovery?\nFrank: My very first wreck wasn't romantic at all! It wasn't full of gold, and it certainly wasn't in deep water. In fact, the local fishermen had known it was there for years. I literally just waded out from the beach, dived down, and there it was. It was so easy to find, it almost felt like cheating!"
  },
  {
    qMatch: "The magazine is different to a local newspaper because of:",
    speech: "Editor: We're often asked if our new magazine is just another version of the local newspaper. Well, they actually cost the same price, and we publish weekly just like the paper. But the difference isn't the size or how often it comes out—it's what it contains. Unlike the newspaper which focuses on short local news and traffic updates, our magazine features long, in-depth cultural articles, interviews with artists, and creative writing."
  },
  {
    qMatch: "The presenter likes Cooking for One because:",
    speech: "Presenter: There are dozens of cookery books with beautiful photos and budget-friendly, cheap recipes out there. I used to hate them all, quite frankly. I dreaded entering the kitchen. But when I read 'Cooking for One', something shifted. It wasn't that the recipes were simple—in fact some are quite complex—but the author writes with such passion that she completely changed my mindset. I actually enjoy spending time in the kitchen now. I like cooking, and that's entirely thanks to this book."
  },
  {
    qMatch: "What do the man and woman agree about?",
    speech: "Man: You know, I was reading this article about those new wind farms they want to build near the coast. I was worried they might become dangerous for the environment in the long term, especially the local bird populations.\nWoman: Really? Actually, I read a scientific report just yesterday that said the evidence suggests birds are extremely unlikely to be affected by the turbines. They tend to just fly around them.\nMan: Yes, I suppose I saw that too later down the article. It does seem the birds will be absolutely fine."
  },
  {
    qMatch: "What does Frank say about the ship called The Seabird?",
    speech: "Interviewer: Frank, what's the story behind 'The Seabird' that you found last week?\nFrank: Many people assume because of its name that it was a passenger ship, but it was actually a merchant vessel carrying coal. It wasn't very large compared to modern ships. What makes it sad is the history. Records show she went down during a terrible storm in the winter of 1842. The winds were just too strong, and unfortunately, she sank before anyone could reach her."
  },
  {
    qMatch: "What does the woman think is wrong with Holidays in Europe?",
    speech: "Man: Have you finished reading that 'Holidays in Europe' guidebook? Is it worth buying?\nWoman: Well, it's not too expensive, which is a bonus, and contrary to what some reviews say, the photography is absolutely stunning. It covers a lot of ground, but honestly, the maps are not very good. They're printed so small that you can hardly read the street names without a magnifying glass. That's my main criticism—you'd still get lost using it."
  },
  {
    qMatch: "What happened to Jane on her test flight?",
    speech: "Jane: My test flight was an absolute nightmare! I didn't get lost, and I had plenty of fuel, so that wasn't the issue. But I was flying quite low over this hilly area, keeping an eye on the landing strip in the distance. Suddenly, I realized there was a huge radio communications tower right in my path! I pulled up the nose just in time. I almost hit it! My heart was racing the rest of the way down."
  },
  {
    qMatch: "What has Roger been working on recently at a zoo?",
    speech: "Woman: Hey Roger, are you guys building a new enclosure at the zoo this month?\nRoger: No, the new enclosures are mostly finished. We were planning to start a new breeding program for the penguins, but instead, I've spending all my time on the local wildlife. I've been conducting a large survey of native species around the zoo's extended grounds. We're tracking which local birds and insects are thriving and which need more support."
  },
  {
    qMatch: "What has the man just bought?",
    speech: "Man: Hey, come out to the driveway and look at this! I just picked it up from the dealer this morning.\nWoman: Wow, it's so shiny! Did you finally buy that new bicycle you were talking about?\nMan: No, something much better. I decided taking the bus was taking too long. It's a second-hand car, but it runs perfectly and fits exactly what I need for my commute."
  },
  {
    qMatch: "What should people do at the moment?",
    speech: "Radio Presenter: We interrupt our regular broadcast for an urgent emergency announcement. There has been a significant chemical spill at the industrial park on the edge of town. While there is no immediate need to evacuate your homes or stay strictly indoors, police have set up roadblocks and authorities are strongly advising all residents to keep away from the area entirely until the emergency services have cleared the hazard."
  },
  {
    qMatch: "What time do the photography classes begin?",
    speech: "Receptionist: If you're interested in the evening photography classes, they run every Tuesday. The building opens at 6:00 p.m., but registration and the setup of the darkroom doesn't begin until 6:30. You need to make sure you're registered and in your seat because the instructor starts his lecture promptly at 6:45 p.m.. By 7:00, you'll already be doing practical work!"
  },
  {
    qMatch: "What type of information is the radio reporter giving?",
    speech: "Radio Reporter: ...and that wraps up our sports results for the afternoon. Before we move on to our local traffic report, let's look at what's happening outside. We've got cloudy skies rolling in throughout the morning, with heavy rain expected to move in from the west by late afternoon. Temperatures will hover around twelve degrees, so definitely grab a coat if you're heading out."
  },
  {
    qMatch: "When she was at primary school, Sarah:",
    speech: "Mother: Sarah was always incredibly creative. People ask if she used to paint watercolours or make clay models as a child, but actually, she found paints too messy when she was very young. Instead, even at primary school, she would sit quietly for hours and just draw scenes in pencil. She'd sketch the playground, the classroom, everything. Her teachers told me back then she had a real gift for it."
  },
  {
    qMatch: "Where does the band perform most regularly?",
    speech: "Guitarist: We love playing live. Over the summer we played at a few big outdoor festivals, and occasionally we'll do a Saturday night set in a local pub. But our most consistent gig—the one we do every single Friday night—is actually on a boat. We set up our equipment on the top deck of the river cruise ship and entertain the guests for three solid hours while they sail down the river."
  },
  {
    qMatch: "Why did Steve and his band leave their recording company?",
    speech: "Interviewer: Steve, your band was with a major record label for three years before you suddenly went independent. Did they refuse to give you a pay rise?\nSteve: It wasn't about the money at all. We actually had a very generous contract. No, the problem was artistic integrity. The label kept trying to change our sound and tell us what to wear. It just wanted more control of the band's music than we were comfortable giving up, so we walked away."
  },
  {
    qMatch: "Why was Bob chosen to join the band?",
    speech: "Manager: When Dave left the band, everyone assumed we'd be looking for a new guitarist because Dave was such a talent on the guitar. But actually, Peter decided he wanted to switch to playing lead guitar, which left the microphone empty. So we held auditions because we were looking for a singer. Bob turned up, didn't play an instrument at all, but his vocals were absolutely incredible. He was exactly what we needed."
  },
  {
    qMatch: "You hear a man talking on the phone about buying a house. What is the purpose of his call?",
    speech: "Man: Hello, yes, I'm calling about the property listed on Park Avenue. No, I'm not looking to arrange a viewing just yet, and I'm certainly not making an offer. I just need to obtain some more information before I decide if it's right for me. For instance, could you tell me which council tax band the house is in, and whether the garden is south-facing?"
  },
  {
    qMatch: "You hear a man talking to people at the beginning of a course. What is his main point?",
    speech: "Instructor: Good morning, everyone, and welcome to 'Effective Public Speaking'. I know some of you are anxious about the schedule, and we'll cover the rules and the coursework later. But right now, I want to focus on why you're here. We are going to talk about the immense benefits of the course. By the time we finish, you will see a massive boost in your confidence and your ability to stand up and capture an audience's attention."
  },
  {
    qMatch: "You hear a scientist talking about a slimming diet. What does she say about the diet?",
    speech: "Scientist: There are many diets advertised on social media right now. Some are completely useless, while others are actually quite dangerous because they restrict essential vitamins. However, the intermittent fasting method we've been researching is different. It's not magic, but our peer-reviewed study over six months confirms that it can have useful results. Participants showed measurable, safe weight loss when they followed the timing guidelines."
  },
  {
    qMatch: "You hear a teenage girl talking about her hobby. What is she talking about?",
    speech: "Girl: I've been doing it every single evening for nearly two years now. At first, my fingers would get so sore, and I couldn't stretch them to reach the right positions on the strings. It was frustrating! But I kept practising, and now I can easily play several songs without looking at the sheet music. I'm hoping to join the school orchestra next term."
  },
  {
    qMatch: "You hear two people talking. How does the woman feel?",
    speech: "Man: So, did you hear back from the hospital about your tests?\nWoman: Yes, I just got the phone call a minute ago. I've been so worried for the past two weeks, imagining the absolute worst. But they said everything is completely fine! My levels are all normal.\nMan: Wow, that's amazing news. You must be thrilled.\nWoman: Honestly? I'm just relieved. It feels like a massive weight has been lifted off my shoulders."
  },
  {
    qMatch: "You overhear a man talking about competitions. What did his favorite prize allow him to do?",
    speech: "Man: I'm a bit obsessed with entering online competitions. I've won concert tickets, a smart TV, and last year I even won enough cash to put towards a new car! But out of everything I've won, the absolute best was two years ago. I won a prize that allowed my wife and me to stay in a luxurious place for a weekend. It was a five-star spa hotel in the countryside—pure bliss."
  },
  {
    qMatch: "You overhear a woman talking about some news. How does she feel about the news?",
    speech: "Woman: You're not going to believe what just happened! Initially, when my boss called me into the office, I was completely worried—I thought I was in trouble or that the project had been cancelled. But instead, she told me that they've selected me for the Senior Manager position starting next month! I am absolutely delighted! I've worked so hard for this for three years!"
  },
  {
    qMatch: "You overhear two people talking in a restaurant. Where has the woman just come from?",
    speech: "Man: Hey, over here! I've already ordered some water. Have you come straight from the office?\nWoman: Phew, sorry I'm a bit sweaty. No, I finished work an hour ago. I was going to head to the gym, but I realised I had nothing for breakfast tomorrow, so I had to pop into the supermarket on the way here to grab some milk and bread. The queues were awful!"
  },
  {
    qMatch: "You overhear two people talking on a bus tour of a city. What do they agree about?",
    speech: "Man: Look at those old gothic buildings, they are absolutely stunning, aren't they?\nWoman: They are nice, but honestly, I can't even focus on the architecture with all these crowds! I'm glad we're on the bus to get away from them.\nMan: You're completely right. I had no idea the pavements would be this packed. It's incredibly busy everywhere you look. I wouldn't want to be walking through that."
  },
  {
    qMatch: "You turn on the radio and hear a man speaking. What are you listening to?",
    speech: "Presenter: ...and that's the end of our interview with the local mayor. Now, are you tired of the cold, grey weather? Do you dream of white sandy beaches and crystal-clear oceans? Dream Destinations is offering exactly that! For the next 24 hours, book your tropical getaway with us and get an unbeatable fifty percent off all inclusive packages. Call us now or visit our website to secure your perfect holiday!"
  },
  {
    qMatch: "You turn on the radio and hear part of a music program. What do you learn about the four people mentioned?",
    speech: "DJ: That was the incredible new track from 'The Night Owls'. What's fascinating about this quartet isn't that they're all from the same small town—in fact, they grew up on the same street! And despite their polished sound, they are not highly experienced veterans. They actually only picked up their instruments and formed a group six months ago. Yet, their debut album is already breaking records."
  },
  {
    qMatch: "In his songs, Steve writes about his:",
    speech: "Steve: People often assume that as a touring musician, my songwriting is filled with stories of my travels or tales of my wild youth in my hometown. But honestly, I'm a bit of a homebody now. Almost every song on this new album is about my children. Watching them grow, their little quirks, the funny things they say before bed—they are my entire inspiration right now."
  },
  {
    qMatch: "Steve enjoys recording with his band because:",
    speech: "Steve: I could easily record solo albums in my own comfortable home studio, where I write all the songs myself anyway. But I always choose to go to a professional studio and record with my band. Why? Because the dynamic we have is magical. It's like being in a family in there. Everyone supports each other, cheers each other on, and that supportive atmosphere brings out the best in my vocals."
  },
  {
    qMatch: "Two friends are talking. What's the man's new phone number?",
    speech: "Woman: Hey, I tried calling you yesterday but an automated voice said the number wasn't recognized. Did you change it?\nMan: Oh, right! Yes, I got a new contract last week, so it's changed. My new number is 07, 2844, 798.\nWoman: Let me just write that down... 07, 2844... wait, was it 789?\nMan: Almost, the last bit is seven nine eight.\nWoman: Got it. 07, 2844, 798."
  },
  {
    qMatch: "What does the woman like about the clothes he designs?",
    speech: "Woman: I visited your boutique in the city centre yesterday. I have to say, I'm a huge fan of your clothing line.\nMan: Thank you! We try to make sure everything is very comfortable to wear every day.\nWoman: Truthfully, they are a little pricey for me, but what really captured my attention is just how original they are. You use cuts and patterns I've simply never seen anywhere else in the market."
  },
  {
    qMatch: "What is the woman giving advice about?",
    speech: "Woman: Look, I completely understand the urge to hold onto things just in case you need them one day, or to save money by not buying things twice. But trust me, your flat is getting so messy. The best thing you can do for your mental health is dedicate a weekend to throwing things away. If you haven't worn it or used it in a year, get rid of it. You'll feel so much better."
  },
  {
    qMatch: "What time is the party on Saturday?",
    speech: "Man: Are you still coming to Mark's barbecue this Saturday? He's moved the time around a bit.\nWoman: Oh really? I thought the invitation said it started at 1:30 in the afternoon.\nMan: That was the original plan, but he needs more time to prepare the food. He text me earlier to say it's been pushed back an hour, so it now starts at 2:30. Don't turn up early or he'll put you to work!"
  },
  {
    qMatch: "Which day is Jimmy's guitar lesson?",
    speech: "Mother: Jimmy has such a busy schedule it's hard to keep track. He usually plays football on Tuesdays, and he used to go to swimming club on Wednesdays until the club closed down. But the absolute highlight of his week is Thursday, because that's when Mr Hendricks comes to the house for his guitar lesson. He practises every day to get ready for it."
  }
];

async function main() {
  console.log(`Starting update for ${updates.length} items...`);
  let count = 0;
  for (const u of updates) {
    // Find question(s) that match this text
    const qs = await prisma.question.findMany({
      where: {
        text: { contains: u.qMatch }
      }
    });

    if (qs.length === 0) {
      console.log(`❌ Not found: "${u.qMatch.substring(0, 40)}..."`);
      continue;
    }

    for (const q of qs) {
      await prisma.question.update({
        where: { id: q.id },
        data: { speechText: u.speech }
      });
      count++;
    }
    console.log(`✅ Updated: "${u.qMatch.substring(0, 40)}..."`);
  }
  console.log(`\n🎉 Done! Updated ${count} question scripts.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
