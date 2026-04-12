/**
 * updateListening2.ts — Upgrade part 2 of Listening transcripts to richer CEPT-level texts.
 * Run: npx tsx prisma/updateListening2.ts
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  {
    qMatch: "Who gave the man the CD for his birthday?",
    speech: "Man: Look at all these birthday presents I got! I didn't expect so much.\nWoman: Wow, this jazz CD looks fantastic. Did your grandfather get you that one? I know he loves jazz.\nMan: Actually, I thought he might, but he sent me money instead. And my mother gave me some clothes. It was actually my sister who remembered I wanted this CD. I was really surprised she managed to find it!"
  },
  {
    qMatch: "Where is the girl's purse?",
    speech: "Girl: Mum, have you seen my little blue purse anywhere? I need to catch the bus in ten minutes.\nMum: Have you checked on the chair in the kitchen? You sometimes leave it there.\nGirl: I just looked, and it's not on the kitchen chair. And I've thoroughly searched on the bed too. Wait... oh, silly me. It's right here on the desk, hidden underneath my geography textbooks. I must have left it here last night."
  },
  {
    qMatch: "Where will the couple meet?",
    speech: "Man: Are we still meeting up later this afternoon?\nWoman: Yes! Should we just meet at home and walk into town together?\nMan: Well, I have to pick up a few things first. How about meeting down by the river?\nWoman: Actually, it's going to rain later, so standing by the river isn't a great idea. How about we just meet at the shop on the corner? That way we can stay dry.\nMan: Good idea. I'll see you at the shop at three."
  },
  {
    qMatch: "Which kind of T-shirt did the boy choose?",
    speech: "Mum: Look at these T-shirts. Do you want this blue checked one? We saw someone wearing one yesterday and it looked very smart.\nBoy: Hmm, checked patterns aren't really my style. I think I prefer the other ones.\nMum: What about this completely plain one? It's very simple and goes with everything.\nBoy: No, the plain one is a bit boring. I'm definitely taking the striped one instead. The bold stripes look much cooler."
  },
  {
    qMatch: "Where is Angela now?",
    speech: "Man: Has Angela come back yet? She said she was going out earlier this morning.\nWoman: No, she's not back. Initially she was going to head to the shops to buy some groceries, but she called a while ago and said she changed her mind.\nMan: Did she have to go back to school to finish a project?\nWoman: No, she went straight to the gym instead. She's doing an extra workout class and said she'd be there for another hour."
  },
  {
    qMatch: "What has the girl forgotten to bring?",
    speech: "Girl: Oh no, I can't believe I've done this again!\nMan: Let me guess, you've forgotten your gym bag entirely?\nGirl: No, I've got my bag right here on my shoulder. But when I was packing it this morning, I took everything out to check. I remembered to pack my towel this time, but I've left my swimming costume sitting right in the middle of my bed! \nMan: Oh dear, well we can't go back for it now, we'll miss the session."
  },
  {
    qMatch: "How will the man book tickets for the show?",
    speech: "Woman: The new play opens this weekend. Are you going to queue at the box office tomorrow morning to get the tickets?\nMan: I was going to, but my friend told me the queues are usually hours long. \nWoman: You could try calling them and booking by phone?\nMan: Their phone line is always engaged. Honestly, it's much easier to just do it online. I've got the website open now, I'll book them electronically right away."
  },
  {
    qMatch: "Which job does Max do in the program?",
    speech: "Woman: Who's the guy over there pointing at everything? Is he the director?\nMan: No, the director is the woman sitting in the chair with the clipboard. And that guy standing next to her is the main presenter. \nWoman: So who's the guy holding the camera?\nMan: That's Max. He's the head cameraman on the show. The director loves working with him because he's incredibly skilled at filming all the tough action shots."
  },
  {
    qMatch: "How did the man travel?",
    speech: "Woman: How was your journey from London? Did you end up coming by car?\nMan: I considered driving, but the traffic on the motorway is always awful on a Friday. And the bus takes far too long with all the stops it makes.\nWoman: So did you fly?\nMan: No, I went by train in the end. It was a brilliant decision—I had a window seat and just watched the amazing scenery roll by the whole way."
  },
  {
    qMatch: "What job does Mary's brother do?",
    speech: "Man: You said your brother works in the local hospital, right? Is he a doctor like your father?\nMary: A lot of people assume that, but no. He actually started off training as a science teacher, but decided a classroom wasn't for him.\nMan: So what does he do at the hospital?\nMary: He's a nurse. He's incredibly passionate about patient care and says he wouldn't change his job for anything."
  },
  {
    qMatch: "What will Ben do this evening?",
    speech: "Mum: Ben, what are your plans for this evening? Are you finally going to read that book for your English class, or practice your musical instrument?\nBen: I know I need to read the book, but I'll save that for the weekend when I have more time. And I did my piano practice yesterday.\nMum: So what will you be doing instead?\nBen: I'm going to spend the evening painting. I want to finish that landscape picture I started last week."
  },
  {
    qMatch: "How did the woman travel to Scotland?",
    speech: "Man: I heard you went to Edinburgh last weekend. Did you drive all the way up there?\nWoman: No way! Going by car from London takes about eight hours on a good day. It's exhausting.\nMan: Did you join those friends who cycled up for charity?\nWoman: I'm definitely not fit enough to go by bicycle! No, I found a cheap ticket and went by plane. The flight only took an hour, and it was so much more relaxing."
  },
  {
    qMatch: "What was the weather like when the holiday began?",
    speech: "Woman: How was your holiday in Cornwall? I heard the weather has been terrible lately.\nMan: It ended up quite rainy by the time we left, and Wednesday was incredibly cloudy and grey. But when our holiday began on Monday, it couldn't have been better. We arrived at the resort, stepped out of the car, and it was completely sunny. Not a single cloud in the bright blue sky. Sadly, it didn't last."
  },
  {
    qMatch: "What type of T-shirt does the woman want?",
    speech: "Assistant: Can I help you find anything today, madam?\nWoman: Yes, I'm looking for a new T-shirt for a summer party.\nAssistant: Certainly. We have lots of plain white ones here, or we have these dark ones in navy and black which are very popular.\nWoman: Actually, I'm hoping to find a bright-coloured one. Something really vibrant, like a strong red or sunny orange to stand out.\nAssistant: Ah, follow me. We have some brilliant red ones right over here."
  },
  {
    qMatch: "Where is the computer now?",
    speech: "Man: Have you seen my USB drive? I thought I left it next to the computer in the office.\nWoman: Well, we turned the office into a guest room, remember? And the computer isn't in the bedroom anymore either because you said it kept you awake.\nMan: Ah right... so where did we put it?\nWoman: We moved it into the living room. It's sitting on the small desk in the corner. Much better having it there where everyone can use it."
  },
  {
    qMatch: "Which is the aunt's postcard?",
    speech: "Boy: Mum, the postman brought three postcards today! This one has a picture of a crowded city centre with tall buildings.\nMum: That'll be from your uncle. He's on a business trip in New York.\nBoy: And what about this one showing a busy sandy beach?\nMum: That's from your grandparents in Spain. Let me guess, the last one shows snow-capped peaks and pine trees?\nBoy: Yes! A huge mountain.\nMum: That's the mountain postcard from Aunt Mary. She's hiking in the Alps."
  },
  {
    qMatch: "Which sweater does the customer choose?",
    speech: "Assistant: Have you decided which sweater you'd like to buy?\nCustomer: It's a tough choice. The red one is very striking, but I already have so many red clothes in my wardrobe.\nAssistant: The green one looks lovely on you, and it's on sale.\nCustomer: It is nice, but I think I'm going to take the blue one. It's slightly more expensive, but blue is absolutely my favourite colour and it matches my winter coat perfectly."
  },
  {
    qMatch: "What is the woman going to eat?",
    speech: "Man: The food here always smells so good. Are you going to order the tomato soup to start?\nWoman: I don't really fancy soup today. \nMan: What about their famous chicken salad? You usually get that when it's warm outside.\nWoman: True, but it's gotten a bit chilly this afternoon. I really want a hot, filling dish today. I think I'm going to have the pasta instead. Did you see the waiter carrying that huge bowl of spaghetti? It looked delicious."
  },
  {
    qMatch: "How will Nick get to the airport?",
    speech: "Woman: Nick, your flight is at 8 AM. How are you getting to the airport? Are you taking your car?\nNick: No, leaving the car in the airport parking lot for ten days costs a fortune. \nWoman: Well, why not book a taxi then?\nNick: A taxi is also incredibly expensive all the way from my house. I'm just going to walk to the station and catch the early airport bus instead. It's much cheaper and goes directly to the terminal."
  },
  {
    qMatch: "What is the man's job now?",
    speech: "Woman: Hi Mark, I haven't seen you for ages! Are you still working as a teacher at the local secondary school?\nMan: Hi Sarah! No, I left teaching last year. It was rewarding, but I needed a change of pace.\nWoman: Oh, really? Did you retrain as a doctor like you used to talk about?\nMan: No, medical school is too long! I actually pursued my passion for writing, and I'm now working full-time as a journalist for the local newspaper."
  },
  {
    qMatch: "What was the girl given for her birthday?",
    speech: "Man: Happy birthday! Have you received many nice presents?\nGirl: Yes, loads! My aunt bought me a really interesting historical book, which I can't wait to read. And my friends got together and bought me a beautiful silver necklace.\nMan: Wow, lucky you. Did your parents give you anything special?\nGirl: Yes, they gave me the best present of all. I've needed one for ages for school. It's a brand new watch with a silver strap and a dark blue face!"
  },
  {
    qMatch: "What time does the film begin?",
    speech: "Man: What time should we meet at the cinema tonight?\nWoman: Well, the tickets say the doors open at 7:00, but they're just going to show twenty minutes of adverts and trailers first.\nMan: Okay, I have my gym class, so I'd prefer not to sit through the trailers. When does the main feature actually begin?\nWoman: The film itself starts properly at 7:15. If we arrive at ten past seven, we'll have time to find our seats."
  },
  {
    qMatch: "What's the weather like now?",
    speech: "Man: Do you fancy going for a walk in the park?\nWoman: I'm not sure. It was lovely and sunny this morning, but look out of the window now. Those clouds look incredibly dark and menacing.\nMan: Oh, you're right. And there isn't a single patch of blue sky left. Oh, look at the puddles—it's actually raining now. Forget the walk, I'm staying inside. It's definitely not snowy yet, but it's too wet to go out."
  },
  {
    qMatch: "Which man is the English teacher?",
    speech: "Woman: I need to speak to the English teacher about my assignment, but there are so many men in the staff room. Is he the short man drinking coffee near the door?\nMan: No, that's the sports coach. \nWoman: What about the man in the smart grey suit sitting at the desk?\nMan: No, that's the headmaster. The English teacher is over by the window. He's the very tall man with glasses and a thick beard."
  },
  {
    qMatch: "What does the woman plan to do in the mountains?",
    speech: "Man: Have you packed for your trip to the mountains this weekend? Are you taking your skis?\nWoman: Oh, there actually hasn't been enough snow for skiing this year. The slopes are mostly green.\nMan: Are you planning on doing any rock climbing then?\nWoman: No, that's too exhausting for me! I'm just planning on doing some relaxed sightseeing. There are some beautiful old castles and picturesque villages in the valleys, and I'm going to spend the whole weekend exploring them."
  },
  {
    qMatch: "Where did Minnie and Richard first meet?",
    speech: "Woman: How did you and Minnie first meet, Richard? Was it at the office where you both work?\nRichard: We actually didn't work together back then. And we didn't go to the same school either, since she grew up in a different town.\nWoman: Oh, so how did your paths cross?\nRichard: It was at a party. It was my best friend's 25th birthday, and Minnie was invited because she knew my friend's cousin. We got talking by the food table and the rest is history."
  },
  {
    qMatch: "Where is the new cafe?",
    speech: "Man: Have you heard about that new cafe selling Italian pastries? I tried looking for it in the main shopping centre but couldn't find it.\nWoman: Oh, it's not in the shopping centre. That's a different coffee shop entirely.\nMan: Is it near the train station then?\nWoman: No, it's further into town. It's right next to the public library. You can't miss it—it's got big green awnings and lots of tables out on the pavement."
  },
  {
    qMatch: "What did John do when he last visited friends?",
    speech: "Woman: Did you stay in and have dinner when you visited your friends last weekend, John?\nJohn: Actually, we originally planned to cook dinner at their house, but nobody had done the grocery shopping.\nWoman: So did you just order pizza and play board games instead?\nJohn: We've done that so many times before! No, we decided to get out of the house and went to the cinema instead. There was a fantastic new action film playing."
  },
  {
    qMatch: "Which girl is Sarah?",
    speech: "Man: I need to give this file to Sarah, but there are so many people in the office today. Which one is she? Is she the short girl with blonde hair over by the printer?\nWoman: No, that's Emily. \nMan: What about the girl with glasses sitting down and reading a book?\nWoman: No, Sarah isn't wearing glasses today. Look over by the window—she's the tall girl with really long dark hair, wearing a striped top."
  },
  {
    qMatch: "How does the man go to work?",
    speech: "Woman: I saw you arriving at work this morning. Did you sell your car? I haven't seen it in the car park for weeks.\nMan: No, I still have the car, but petrol is getting so expensive, and honestly, sitting in traffic every morning was stressing me out. Also, the bus is too unreliable.\nWoman: So you're exercising instead?\nMan: Exactly. I travel by bicycle now. It takes roughly the same time, but it keeps me fit and wakes me up nicely."
  },
  {
    qMatch: "What color is Mary's coat?",
    speech: "Man: Look at how crowded this restaurant is! Is Mary already here to meet us?\nWoman: Yes, she texted me to say she's waiting near the entrance.\nMan: Okay... is she the one wearing that bright blue coat over by the stairs?\nWoman: No, Mary doesn't own a blue coat. And she's certainly not the one in the dark green jacket either. Oh, there she is—she's standing right by the main door, wearing a brilliant red coat. You can't miss her."
  },
  {
    qMatch: "What is the man's favorite sport?",
    speech: "Woman: You look incredibly fit. Do you spend a lot of time doing sports?\nMan: I try to stay active, yes. I go swimming quite frequently because it's great for fitness, and occasionally on a Sunday afternoon I'll play a casual game of tennis if the weather is nice.\nWoman: But what's your absolute favourite?\nMan: Oh, definitely football. Nothing compares to the thrill of a proper football match. I play in a local league every Saturday, and it's the highlight of my week."
  },
  {
    qMatch: "What time does the film finish?",
    speech: "Man: What time should I ask my dad to pick us up from the cinema?\nWoman: Let's figure it out. The adverts start at quarter to seven, but the actual film doesn't start until a bit after that, around 7:15.\nMan: And it's quite a long movie, right? About two hours?\nWoman: Yes, exactly two hours. So it won't finish at 8:45, and it will definitely stretch past 9:00. It should end right around 9:15. Tell your dad 9:15."
  },
  {
    qMetadata: "play today",
    qMatch: "What will Tim and his dad play today?",
    speech: "Tim: Dad, the sun has finally come out! Can we grab the ball and play football today?\nDad: Ah, I'm sorry Tim. It rained so heavily last night that the garden is still completely flooded. We'd ruin the grass.\nTim: Aww. Well, what about some table tennis in the garage?\nDad: The table is still folded away behind all those boxes. Let's stay in the warm living room and play a board game. I'll set up the chess board. Are you ready to lose?"
  },
  {
    qMetadata: "What will they do today",
    qMatch: "What will they do today?",
    speech: "Woman: We have the whole afternoon free. Shall we go down to the beach and get some sun?\nMan: Have you looked at the sky recently? It's turning incredibly dark. I think there's a thunderstorm rolling in. We should definitely stay away from the beach.\nWoman: Oh, that's a shame. Should we just stay at home and watch television?\nMan: That's a bit boring. Since we want to go out, why don't we go to the cinema instead? At least we'll stay dry."
  },
  {
    qMetadata: "When will the shop open",
    qMatch: "When will the shop open again?",
    speech: "Automated Message: Thank you for calling the community electronics shop. Please listen carefully as our opening hours have changed. We are completely closed this Saturday and Sunday for essential electrical refurbishment works. We had hoped to be open again by Wednesday, but the work is progressing much faster than expected. Therefore, we are pleased to announce we will reopen our doors to customers first thing on Monday morning."
  },
  {
    qMetadata: "Where will the man leave car",
    qMatch: "Where will the man leave his car tonight?",
    speech: "Woman: Are you parking your car on the street outside the house tonight, or in the public car park around the corner?\nMan: Neither. Have you heard the weather forecast? They are predicting a severe frost tonight, and possibly even some snow.\nWoman: Oh, won't you have to scrape the ice off the windscreen tomorrow morning then?\nMan: Not if I'm smart! I spent an hour clearing out the boxes earlier, so I'm parking the car securely inside the garage tonight."
  },
  {
    qMetadata: "Platform woman train leaves from",
    qMatch: "Which platform does the woman's train leave from?",
    speech: "Woman: Excuse me, could you help me? The electronic departure board is broken and I'm desperately trying to find the express train to London.\nMan: Sure. The local stopping service is departing from platform one, and the northern express is at platform two right now.\nWoman: Oh no, so where is the London train?\nMan: Don't panic, it's just pulling in over at platform three. If you hurry across the bridge, you'll catch it with minutes to spare."
  },
  {
    qMetadata: "What size woman buy",
    qMatch: "What size does the woman buy?",
    speech: "Woman: This dress is absolutely gorgeous, but I can only find a small on the rack. Do you happen to have any more in the stockroom? I usually take a medium.\nAssistant: Let me check for you... I'm so sorry, we've completely sold out of the medium size in that style. And the small will definitely be too tight.\nWoman: Have you got any other sizes at all?\nAssistant: We have one large left.\nWoman: Hmm, the large might be a bit loose, but I love the colour so much I'll take it anyway."
  },
  {
    qMetadata: "Time concert start",
    qMatch: "What time does the concert start?",
    speech: "Man: Are you ready to head to the concert yet? We don't want to be late and miss the start.\nWoman: Relax, we have plenty of time. The tickets say the venue doors open at 7:00, but there's a support act playing first at roughly a quarter past.\nMan: Oh, I see. So when does the main band actually start playing?\nWoman: They don't take to the stage until exactly 7:30. So if we leave now, we'll arrive perfectly on time for the main event."
  },
  {
    qMetadata: "Where Marianna talking",
    qMatch: "Where is Marianna talking to Jack?",
    speech: "Jack: Look at the size of the queue for the tills here. And the noise is unbearable! Someone just dropped a pile of plates in the kitchen.\nMarianna: I know, you can barely hear yourself think with all these families eating and shouting.\nJack: It's certainly not as quiet as a library or a peaceful park. \nMarianna: True. Should we ask for the bill now? Once we finish eating, we can leave this restaurant and take a quiet walk instead."
  },
  {
    qMetadata: "What happened to girl",
    qMatch: "What happened to the girl this afternoon?",
    speech: "Girl: You will never guess the dreadful afternoon I've just had!\nBoy: Did you lose your school bag again? Or miss the bus home?\nGirl: No, worse than that! I decided to cycle to the shops. I was going quite fast down the hill, and I completely failed to see a massive rock sitting in the middle of the cycle path. I hit the rock, flew over the handlebars, and fell straight off my bicycle onto the concrete!"
  },
  {
    qMetadata: "yoga position",
    qMatch: "Which yoga position has the man found beneficial?",
    speech: "Woman: You look a lot more flexible these days. Has the yoga been helping your bad back?\nMan: Enormously. At first, I struggled with the warrior pose because my legs weren't strong enough. And the downward dog position actually hurt my shoulders.\nWoman: So what works for you?\nMan: The absolute best one for spinal alignment is the tree pose. Standing on one leg and stretching upwards has completely relieved my lower back pain."
  },
  {
    qMetadata: "Where will they sit",
    qMatch: "Where will they sit?",
    speech: "Man: Should we grab that empty table inside near the window? Or there are a couple of stools at the bar if you prefer.\nWoman: It's far too nice an afternoon to be stuck indoors. The sun is shining and there's a gentle breeze.\nMan: That's true. The indoor areas are quite stuffy anyway.\nWoman: Look, there's a table free outside on the grass near the flowerbeds. Let's sit out there in the garden instead."
  },
  {
    qMetadata: "Where is new cafe bookshop",
    qMatch: "Where is the new café?",
    speech: "Woman: Did you see there's a fantastic new café that opened in town yesterday? They sell authentic Italian coffee.\nMan: Oh, is it the one they were building opposite the bank?\nWoman: No, that turned out to be a clothing store. And it's not the one tucked away behind the cinema either.\nMan: Where is it then?\nWoman: It's prominently located on the high street. You know the large bookshop on the corner? It's right next to the bookshop. They've put tables outside on the pavement."
  }
];

async function main() {
  console.log(`Starting update for part 2: ${updates.length} items...`);
  let count = 0;
  for (const u of updates) {
    const qs = await prisma.question.findMany({
      where: { text: { contains: u.qMatch } }
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
