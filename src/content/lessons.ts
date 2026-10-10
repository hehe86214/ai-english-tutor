// 教材：原創內容，依 CEFR 等級（A1 入門 → B2 中高級）編排
// 每一課 = 學習目標 + 單字 + 關鍵句型 + 範例對話 + 給 AI 老師的上課流程

export type Level = "A1" | "A2" | "B1" | "B2";

export const LEVELS: { id: Level; label: string; description: string }[] = [
  { id: "A1", label: "入門", description: "能用簡單句子介紹自己、回答基本問題" },
  { id: "A2", label: "初級", description: "能應付旅遊、購物等日常情境" },
  { id: "B1", label: "中級", description: "能在工作中溝通、表達意見與經驗" },
  { id: "B2", label: "中高級", description: "能針對議題討論、說明理由與比較" },
];

export type Vocab = {
  word: string;
  pos: string;
  meaning: string;
  example: string;
};

export type Phrase = {
  pattern: string;
  meaning: string;
  examples: string[];
};

export type DialogueLine = { speaker: "A" | "B"; text: string; zh: string };

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  titleEn: string;
  level: Level;
  minutes: number;
  goal: string;
  // 給 AI 老師的情境說明（英文）
  scene: string;
  vocabulary: Vocab[];
  phrases: Phrase[];
  dialogue: { roles: { A: string; B: string }; lines: DialogueLine[] };
  // 上課流程：AI 老師會照這個順序帶（英文）
  tasks: string[];
};

export type Course = {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  description: string;
};

export const COURSES: Course[] = [
  {
    id: "daily",
    title: "日常會話",
    titleEn: "Everyday English",
    emoji: "🌱",
    description: "從自我介紹開始，練好每天都用得到的基本對話。",
  },
  {
    id: "travel",
    title: "旅遊英文",
    titleEn: "Travel English",
    emoji: "✈️",
    description: "機場、飯店、問路，出國不再只會比手畫腳。",
  },
  {
    id: "dining",
    title: "餐廳與購物",
    titleEn: "Dining & Shopping",
    emoji: "🛍️",
    description: "點餐、訂位、退換貨，生活消費情境一次學會。",
  },
  {
    id: "business",
    title: "職場英文",
    titleEn: "Business English",
    emoji: "💼",
    description: "介紹工作、會議發言、請同事幫忙，專業又有禮貌。",
  },
  {
    id: "interview",
    title: "面試英文",
    titleEn: "Job Interview",
    emoji: "🎯",
    description: "準備外商面試最常被問的問題，說出有說服力的回答。",
  },
  {
    id: "discussion",
    title: "議題討論",
    titleEn: "Discussion",
    emoji: "💬",
    description: "針對生活議題表達立場、舉例說明，練習進階口說。",
  },
];

export const LESSONS: Lesson[] = [
  // ───────── 日常會話 ─────────
  {
    id: "daily-introductions",
    courseId: "daily",
    title: "自我介紹",
    titleEn: "Introducing Yourself",
    level: "A1",
    minutes: 15,
    goal: "能說出自己的名字、來自哪裡、做什麼工作，並反問對方。",
    scene: "The student is meeting a new classmate for the first time at an English class.",
    vocabulary: [
      { word: "introduce", pos: "v.", meaning: "介紹", example: "Let me introduce myself." },
      { word: "from", pos: "prep.", meaning: "來自", example: "I'm from Taipei." },
      { word: "live", pos: "v.", meaning: "居住", example: "I live in Taichung." },
      { word: "job", pos: "n.", meaning: "工作", example: "What's your job?" },
      { word: "student", pos: "n.", meaning: "學生", example: "I'm a university student." },
      { word: "nice", pos: "adj.", meaning: "很好的、愉快的", example: "Nice to meet you." },
    ],
    phrases: [
      {
        pattern: "My name is ___. / I'm ___.",
        meaning: "我的名字是 ___。",
        examples: ["My name is Kevin.", "I'm Amy. Nice to meet you."],
      },
      {
        pattern: "I'm from ___, and I live in ___.",
        meaning: "我來自 ___，住在 ___。",
        examples: ["I'm from Tainan, and I live in Taipei now.", "I'm from Japan, and I live in Osaka."],
      },
      {
        pattern: "What about you?",
        meaning: "那你呢？（把問題丟回給對方）",
        examples: ["I work in a bank. What about you?", "I like coffee. What about you?"],
      },
    ],
    dialogue: {
      roles: { A: "Emma", B: "Leo" },
      lines: [
        { speaker: "A", text: "Hi! I'm Emma. Is this your first class?", zh: "嗨！我是 Emma。這是你第一次上課嗎？" },
        { speaker: "B", text: "Yes, it is. My name is Leo. Nice to meet you.", zh: "對，是的。我叫 Leo，很高興認識你。" },
        { speaker: "A", text: "Nice to meet you too. Where are you from?", zh: "我也很高興認識你。你是哪裡人？" },
        { speaker: "B", text: "I'm from Kaohsiung, but I live in Taipei now. What about you?", zh: "我來自高雄，不過現在住在台北。那你呢？" },
        { speaker: "A", text: "I'm from Canada. I'm an engineer. What do you do?", zh: "我來自加拿大，是一名工程師。你是做什麼的？" },
        { speaker: "B", text: "I'm a designer. I make websites.", zh: "我是設計師，我做網站。" },
      ],
    },
    tasks: [
      "Greet the student warmly and ask their name.",
      "Ask where they are from and where they live now; encourage the pattern \"I'm from ___, and I live in ___.\"",
      "Ask about their job or school, then invite them to ask you back with \"What about you?\"",
      "Finish with a short role-play: the student introduces themselves in 3-4 sentences.",
    ],
  },
  {
    id: "daily-hobbies",
    courseId: "daily",
    title: "談論興趣",
    titleEn: "Talking About Hobbies",
    level: "A1",
    minutes: 15,
    goal: "能說出自己的興趣、多久做一次，並說明喜歡的原因。",
    scene: "The student and the teacher are chatting about free time and hobbies.",
    vocabulary: [
      { word: "hobby", pos: "n.", meaning: "興趣、嗜好", example: "My hobby is cooking." },
      { word: "free time", pos: "n.", meaning: "空閒時間", example: "What do you do in your free time?" },
      { word: "usually", pos: "adv.", meaning: "通常", example: "I usually read at night." },
      { word: "weekend", pos: "n.", meaning: "週末", example: "I go hiking on weekends." },
      { word: "relaxing", pos: "adj.", meaning: "令人放鬆的", example: "Yoga is very relaxing." },
      { word: "enjoy", pos: "v.", meaning: "享受、喜歡", example: "I enjoy watching movies." },
    ],
    phrases: [
      {
        pattern: "In my free time, I like to ___.",
        meaning: "空閒的時候，我喜歡 ___。",
        examples: ["In my free time, I like to play basketball.", "In my free time, I like to watch dramas."],
      },
      {
        pattern: "I ___ about ___ times a week.",
        meaning: "我一週大約 ___ 幾次。",
        examples: ["I go swimming about two times a week.", "I cook about three times a week."],
      },
      {
        pattern: "I like it because ___.",
        meaning: "我喜歡它是因為 ___。",
        examples: ["I like it because it's relaxing.", "I like it because I can meet new people."],
      },
    ],
    dialogue: {
      roles: { A: "Mia", B: "Sam" },
      lines: [
        { speaker: "A", text: "What do you do in your free time, Sam?", zh: "Sam，你空閒時都做什麼？" },
        { speaker: "B", text: "I like to play the guitar. I practice almost every day.", zh: "我喜歡彈吉他，幾乎每天都練習。" },
        { speaker: "A", text: "Wow, every day? Why do you like it?", zh: "哇，每天？你為什麼喜歡？" },
        { speaker: "B", text: "I like it because it helps me relax after work. What about you?", zh: "因為下班後能讓我放鬆。那你呢？" },
        { speaker: "A", text: "I enjoy hiking. I usually go on weekends.", zh: "我喜歡爬山，通常週末去。" },
        { speaker: "B", text: "That sounds fun. Maybe we can go together sometime.", zh: "聽起來很好玩，也許哪天可以一起去。" },
      ],
    },
    tasks: [
      "Ask what the student does in their free time.",
      "Ask how often they do it; encourage \"about ___ times a week\".",
      "Ask why they like it; encourage \"I like it because ___\".",
      "Share your own hobby and ask the student one follow-up question to answer in full sentences.",
    ],
  },
  {
    id: "daily-routine",
    courseId: "daily",
    title: "描述一天的生活",
    titleEn: "Describing Your Daily Routine",
    level: "A1",
    minutes: 15,
    goal: "能用現在簡單式和時間詞，依序描述自己的一天。",
    scene: "The teacher asks the student about a typical weekday.",
    vocabulary: [
      { word: "wake up", pos: "phr.", meaning: "醒來", example: "I wake up at seven." },
      { word: "commute", pos: "v.", meaning: "通勤", example: "I commute by MRT." },
      { word: "have lunch", pos: "phr.", meaning: "吃午餐", example: "I have lunch with my coworkers." },
      { word: "get home", pos: "phr.", meaning: "到家", example: "I get home around six." },
      { word: "then", pos: "adv.", meaning: "然後", example: "Then I take a shower." },
      { word: "before", pos: "prep.", meaning: "在……之前", example: "I read before bed." },
    ],
    phrases: [
      {
        pattern: "I usually ___ at ___ (time).",
        meaning: "我通常在 ___ 點 ___。",
        examples: ["I usually wake up at 7 a.m.", "I usually have dinner at 7:30."],
      },
      {
        pattern: "After that, I ___.",
        meaning: "在那之後，我 ___。（串連順序）",
        examples: ["After that, I take the bus to work.", "After that, I check my email."],
      },
      {
        pattern: "It takes me ___ to get to ___.",
        meaning: "我到 ___ 要花 ___ 時間。",
        examples: ["It takes me 30 minutes to get to work.", "It takes me ten minutes to get to school."],
      },
    ],
    dialogue: {
      roles: { A: "Teacher", B: "Student" },
      lines: [
        { speaker: "A", text: "What time do you usually wake up?", zh: "你通常幾點起床？" },
        { speaker: "B", text: "I usually wake up at seven. Then I have breakfast.", zh: "我通常七點起床，然後吃早餐。" },
        { speaker: "A", text: "How do you get to work?", zh: "你怎麼去上班？" },
        { speaker: "B", text: "I take the MRT. It takes me about 40 minutes.", zh: "我搭捷運，大約要 40 分鐘。" },
        { speaker: "A", text: "What do you do after work?", zh: "下班後你做什麼？" },
        { speaker: "B", text: "I get home around six. After that, I cook dinner and watch TV.", zh: "我大概六點到家，之後煮晚餐、看電視。" },
      ],
    },
    tasks: [
      "Ask what time the student wakes up and what they do first.",
      "Ask how they get to work or school and how long it takes.",
      "Ask about their evening; encourage linking words like \"then\" and \"after that\".",
      "Ask the student to describe their whole day in order, in 4-5 sentences.",
    ],
  },

  // ───────── 旅遊英文 ─────────
  {
    id: "travel-airport",
    courseId: "travel",
    title: "機場報到",
    titleEn: "Checking In at the Airport",
    level: "A2",
    minutes: 20,
    goal: "能完成報到手續：出示證件、托運行李、選擇座位。",
    scene: "The teacher plays an airline check-in agent; the student is a passenger flying to Tokyo.",
    vocabulary: [
      { word: "passport", pos: "n.", meaning: "護照", example: "May I see your passport?" },
      { word: "check in", pos: "phr.", meaning: "辦理報到", example: "I'd like to check in, please." },
      { word: "luggage", pos: "n.", meaning: "行李", example: "How many pieces of luggage do you have?" },
      { word: "carry-on", pos: "n.", meaning: "隨身行李", example: "This is my carry-on." },
      { word: "aisle seat", pos: "n.", meaning: "靠走道座位", example: "Could I have an aisle seat?" },
      { word: "boarding pass", pos: "n.", meaning: "登機證", example: "Here is your boarding pass." },
      { word: "gate", pos: "n.", meaning: "登機門", example: "Your flight leaves from Gate 12." },
    ],
    phrases: [
      {
        pattern: "I'd like to ___, please.",
        meaning: "我想要 ___。（有禮貌地提出需求）",
        examples: ["I'd like to check in, please.", "I'd like to check this bag, please."],
      },
      {
        pattern: "Could I have a(n) ___ seat?",
        meaning: "可以給我 ___ 座位嗎？",
        examples: ["Could I have a window seat?", "Could I have an aisle seat near the front?"],
      },
      {
        pattern: "What time does ___ start?",
        meaning: "___ 幾點開始？",
        examples: ["What time does boarding start?", "What time does the flight leave?"],
      },
    ],
    dialogue: {
      roles: { A: "Agent", B: "Passenger" },
      lines: [
        { speaker: "A", text: "Good morning. Where are you flying today?", zh: "早安，您今天要飛往哪裡？" },
        { speaker: "B", text: "To Tokyo. I'd like to check in, please.", zh: "東京。我想辦理報到。" },
        { speaker: "A", text: "May I see your passport? Are you checking any bags?", zh: "可以看一下您的護照嗎？有要托運行李嗎？" },
        { speaker: "B", text: "Yes, just this one. And this is my carry-on.", zh: "有，只有這一件。這是我的隨身行李。" },
        { speaker: "A", text: "Would you like a window or an aisle seat?", zh: "您想要靠窗還是靠走道的座位？" },
        { speaker: "B", text: "Could I have an aisle seat, please?", zh: "可以給我靠走道的位子嗎？" },
        { speaker: "A", text: "Sure. Here's your boarding pass. Boarding starts at 9:20 at Gate 12.", zh: "沒問題。這是您的登機證，9:20 在 12 號登機門開始登機。" },
        { speaker: "B", text: "Great, thank you!", zh: "太好了，謝謝！" },
      ],
    },
    tasks: [
      "Role-play: greet the passenger and ask for their destination and passport.",
      "Ask about checked bags and carry-on luggage.",
      "Ask about seat preference; encourage \"Could I have a(n) ___ seat?\".",
      "Give the boarding time and gate, then let the student ask one more question (e.g. about boarding time or baggage weight).",
    ],
  },
  {
    id: "travel-hotel",
    courseId: "travel",
    title: "飯店入住",
    titleEn: "Checking In at a Hotel",
    level: "A2",
    minutes: 20,
    goal: "能辦理入住、確認訂房內容，並詢問飯店設施。",
    scene: "The teacher plays a hotel front desk clerk; the student has a reservation.",
    vocabulary: [
      { word: "reservation", pos: "n.", meaning: "預約、訂房", example: "I have a reservation under Lin." },
      { word: "front desk", pos: "n.", meaning: "櫃檯", example: "Please call the front desk." },
      { word: "breakfast", pos: "n.", meaning: "早餐", example: "Is breakfast included?" },
      { word: "Wi-Fi password", pos: "n.", meaning: "Wi-Fi 密碼", example: "What's the Wi-Fi password?" },
      { word: "check out", pos: "phr.", meaning: "退房", example: "What time is check-out?" },
      { word: "key card", pos: "n.", meaning: "房卡", example: "Here is your key card." },
    ],
    phrases: [
      {
        pattern: "I have a reservation under the name ___.",
        meaning: "我用 ___ 的名字訂了房。",
        examples: ["I have a reservation under the name Chen.", "I have a reservation under the name David Wu."],
      },
      {
        pattern: "Is ___ included?",
        meaning: "有包含 ___ 嗎？",
        examples: ["Is breakfast included?", "Is parking included in the price?"],
      },
      {
        pattern: "Could you tell me where ___ is?",
        meaning: "可以告訴我 ___ 在哪裡嗎？",
        examples: ["Could you tell me where the gym is?", "Could you tell me where the elevator is?"],
      },
    ],
    dialogue: {
      roles: { A: "Clerk", B: "Guest" },
      lines: [
        { speaker: "A", text: "Good evening. Welcome to the Harbor Hotel. Checking in?", zh: "晚安，歡迎光臨港灣飯店。要入住嗎？" },
        { speaker: "B", text: "Yes. I have a reservation under the name Lin.", zh: "對，我用 Lin 的名字訂了房。" },
        { speaker: "A", text: "Let me see... Two nights, a double room. Is that right?", zh: "我看一下……兩晚、一間雙人房，對嗎？" },
        { speaker: "B", text: "That's right. Is breakfast included?", zh: "對。有含早餐嗎？" },
        { speaker: "A", text: "Yes, it's served from 7 to 10 on the second floor.", zh: "有的，早上 7 點到 10 點在二樓供應。" },
        { speaker: "B", text: "Great. And what time is check-out?", zh: "太好了。那退房時間是幾點？" },
        { speaker: "A", text: "Check-out is at 11 a.m. Here's your key card. Enjoy your stay!", zh: "退房是早上 11 點。這是您的房卡，祝您住得愉快！" },
      ],
    },
    tasks: [
      "Role-play: welcome the guest and ask for the reservation name.",
      "Confirm the booking details (nights, room type) and let the student confirm or correct them.",
      "Let the student ask about breakfast, Wi-Fi, or facilities using \"Is ___ included?\" / \"Could you tell me where ___ is?\".",
      "Add a small problem (e.g. the room isn't ready yet) and let the student respond politely.",
    ],
  },
  {
    id: "travel-directions",
    courseId: "travel",
    title: "問路與指路",
    titleEn: "Asking for Directions",
    level: "A2",
    minutes: 20,
    goal: "能禮貌地問路，聽懂並複述簡單的路線說明。",
    scene: "The student is a tourist in London asking a local (the teacher) how to get to a museum.",
    vocabulary: [
      { word: "excuse me", pos: "phr.", meaning: "不好意思（引起注意）", example: "Excuse me, can you help me?" },
      { word: "go straight", pos: "phr.", meaning: "直走", example: "Go straight for two blocks." },
      { word: "turn left / right", pos: "phr.", meaning: "左轉／右轉", example: "Turn left at the bank." },
      { word: "block", pos: "n.", meaning: "街區", example: "It's three blocks away." },
      { word: "across from", pos: "prep.", meaning: "在……對面", example: "It's across from the park." },
      { word: "far", pos: "adj.", meaning: "遠的", example: "Is it far from here?" },
    ],
    phrases: [
      {
        pattern: "Excuse me, how do I get to ___?",
        meaning: "不好意思，請問 ___ 怎麼去？",
        examples: ["Excuse me, how do I get to the train station?", "Excuse me, how do I get to the British Museum?"],
      },
      {
        pattern: "Is it within walking distance?",
        meaning: "走路到得了嗎？",
        examples: ["Is the museum within walking distance?", "Is it within walking distance, or should I take a bus?"],
      },
      {
        pattern: "So I ___, and then ___?",
        meaning: "所以我先 ___，然後 ___ 對嗎？（複述確認）",
        examples: ["So I go straight, and then turn right at the bank?", "So I take the bus, and then walk two blocks?"],
      },
    ],
    dialogue: {
      roles: { A: "Tourist", B: "Local" },
      lines: [
        { speaker: "A", text: "Excuse me, how do I get to the National Gallery?", zh: "不好意思，請問國家美術館怎麼去？" },
        { speaker: "B", text: "Go straight down this street for two blocks, then turn left.", zh: "沿著這條街直走兩個路口，然後左轉。" },
        { speaker: "A", text: "Is it within walking distance?", zh: "走路到得了嗎？" },
        { speaker: "B", text: "Yes, it's about ten minutes on foot. It's across from a big square.", zh: "可以，走路大約十分鐘，就在一個大廣場對面。" },
        { speaker: "A", text: "So I go straight for two blocks, and then turn left?", zh: "所以我直走兩個路口，然後左轉對嗎？" },
        { speaker: "B", text: "Exactly. You can't miss it.", zh: "沒錯，你一定找得到。" },
        { speaker: "A", text: "Thank you so much!", zh: "非常感謝！" },
      ],
    },
    tasks: [
      "Role-play: the student stops you and asks how to get to a place.",
      "Give simple directions (go straight, turn left/right, across from).",
      "Encourage the student to repeat the directions back to confirm (\"So I ___, and then ___?\").",
      "Switch roles: you are the tourist and the student gives you directions to a place near their home.",
    ],
  },

  // ───────── 餐廳與購物 ─────────
  {
    id: "dining-restaurant",
    courseId: "dining",
    title: "餐廳點餐",
    titleEn: "Ordering at a Restaurant",
    level: "A2",
    minutes: 20,
    goal: "能點餐、詢問餐點內容、提出特殊需求並結帳。",
    scene: "The teacher plays a server at an Italian restaurant; the student is a customer.",
    vocabulary: [
      { word: "menu", pos: "n.", meaning: "菜單", example: "Could I see the menu, please?" },
      { word: "recommend", pos: "v.", meaning: "推薦", example: "What do you recommend?" },
      { word: "allergic", pos: "adj.", meaning: "過敏的", example: "I'm allergic to nuts." },
      { word: "side dish", pos: "n.", meaning: "配菜", example: "It comes with a side dish." },
      { word: "the bill", pos: "n.", meaning: "帳單", example: "Could we have the bill, please?" },
      { word: "to go", pos: "phr.", meaning: "外帶", example: "Can I get this to go?" },
    ],
    phrases: [
      {
        pattern: "I'll have ___, please.",
        meaning: "我要 ___。（點餐最常用）",
        examples: ["I'll have the seafood pasta, please.", "I'll have a glass of orange juice, please."],
      },
      {
        pattern: "Does it come with ___?",
        meaning: "這有附 ___ 嗎？",
        examples: ["Does it come with salad?", "Does it come with a drink?"],
      },
      {
        pattern: "Could I have it without ___?",
        meaning: "可以不要加 ___ 嗎？",
        examples: ["Could I have it without onions?", "Could I have it without cheese, please?"],
      },
    ],
    dialogue: {
      roles: { A: "Server", B: "Customer" },
      lines: [
        { speaker: "A", text: "Hi, are you ready to order?", zh: "您好，可以點餐了嗎？" },
        { speaker: "B", text: "Almost. What do you recommend?", zh: "差不多了。你推薦什麼？" },
        { speaker: "A", text: "Our mushroom risotto is very popular.", zh: "我們的蘑菇燉飯很受歡迎。" },
        { speaker: "B", text: "Does it come with salad?", zh: "有附沙拉嗎？" },
        { speaker: "A", text: "Yes, a small green salad.", zh: "有，一份小的生菜沙拉。" },
        { speaker: "B", text: "Great, I'll have that. Could I have it without cheese? I'm allergic to dairy.", zh: "好，我要這個。可以不要加起司嗎？我對乳製品過敏。" },
        { speaker: "A", text: "No problem. Anything to drink?", zh: "沒問題。要喝點什麼嗎？" },
        { speaker: "B", text: "Just water, thanks.", zh: "水就好，謝謝。" },
      ],
    },
    tasks: [
      "Role-play: greet the customer and offer the menu; mention one or two dishes.",
      "Let the student ask for a recommendation and what the dish comes with.",
      "Let the student order with \"I'll have ___\" and make one special request (\"without ___\").",
      "Finish with drinks and asking for the bill.",
    ],
  },
  {
    id: "dining-shopping",
    courseId: "dining",
    title: "購物與退換貨",
    titleEn: "Shopping and Returns",
    level: "A2",
    minutes: 20,
    goal: "能詢問尺寸、價格與試穿，並說明退換貨的原因。",
    scene: "The teacher plays a clothing store clerk; the student wants to buy a jacket and later return a shirt.",
    vocabulary: [
      { word: "size", pos: "n.", meaning: "尺寸", example: "Do you have this in a medium size?" },
      { word: "try on", pos: "phr.", meaning: "試穿", example: "Can I try this on?" },
      { word: "fitting room", pos: "n.", meaning: "試衣間", example: "The fitting room is over there." },
      { word: "on sale", pos: "phr.", meaning: "特價中", example: "These shoes are on sale." },
      { word: "receipt", pos: "n.", meaning: "收據", example: "Do you have the receipt?" },
      { word: "refund", pos: "n.", meaning: "退款", example: "I'd like a refund, please." },
      { word: "exchange", pos: "v.", meaning: "換貨", example: "Can I exchange it for a larger size?" },
    ],
    phrases: [
      {
        pattern: "Do you have this in ___?",
        meaning: "這個有 ___（尺寸／顏色）嗎？",
        examples: ["Do you have this in black?", "Do you have this in a smaller size?"],
      },
      {
        pattern: "It's a little too ___.",
        meaning: "它有點太 ___ 了。",
        examples: ["It's a little too tight.", "It's a little too long for me."],
      },
      {
        pattern: "I'd like to return / exchange this because ___.",
        meaning: "我想退／換這個，因為 ___。",
        examples: ["I'd like to return this because it doesn't fit.", "I'd like to exchange this because there's a hole in it."],
      },
    ],
    dialogue: {
      roles: { A: "Clerk", B: "Customer" },
      lines: [
        { speaker: "A", text: "Hi, can I help you find anything?", zh: "您好，需要幫您找什麼嗎？" },
        { speaker: "B", text: "Yes. Do you have this jacket in a medium?", zh: "對，這件外套有 M 號嗎？" },
        { speaker: "A", text: "Let me check... Here you go. The fitting room is on the left.", zh: "我看一下……給您。試衣間在左邊。" },
        { speaker: "B", text: "Thanks. Hmm, it's a little too tight. Do you have a large?", zh: "謝謝。嗯，有點太緊了，有 L 號嗎？" },
        { speaker: "A", text: "Sure. And it's on sale today — 20% off.", zh: "有的。而且今天特價，打八折。" },
        { speaker: "B", text: "Perfect, I'll take it. Also, I'd like to return this shirt. It doesn't fit.", zh: "太好了，我要了。另外，我想退這件襯衫，它不合身。" },
        { speaker: "A", text: "Do you have the receipt?", zh: "您有收據嗎？" },
        { speaker: "B", text: "Yes, here it is.", zh: "有，在這裡。" },
      ],
    },
    tasks: [
      "Role-play: offer help; let the student ask for a size or color with \"Do you have this in ___?\".",
      "Let the student try it on and describe a problem (\"It's a little too ___\").",
      "Mention a sale and let the student decide to buy.",
      "Second situation: the student returns or exchanges an item and explains why.",
    ],
  },
  {
    id: "dining-reservation",
    courseId: "dining",
    title: "電話訂位",
    titleEn: "Making a Reservation by Phone",
    level: "A2",
    minutes: 15,
    goal: "能在電話中說明日期、時間、人數，並確認訂位內容。",
    scene: "The student calls a restaurant to book a table for a birthday dinner; the teacher answers the phone.",
    vocabulary: [
      { word: "book a table", pos: "phr.", meaning: "訂位", example: "I'd like to book a table." },
      { word: "party of ___", pos: "phr.", meaning: "一行 ___ 人", example: "A party of four." },
      { word: "available", pos: "adj.", meaning: "有空位的", example: "Is 7 p.m. available?" },
      { word: "fully booked", pos: "phr.", meaning: "訂滿了", example: "Sorry, we're fully booked." },
      { word: "confirm", pos: "v.", meaning: "確認", example: "Let me confirm your booking." },
      { word: "occasion", pos: "n.", meaning: "場合", example: "Is it a special occasion?" },
    ],
    phrases: [
      {
        pattern: "I'd like to book a table for ___ on ___.",
        meaning: "我想訂 ___ 位，在 ___（日期）。",
        examples: ["I'd like to book a table for four on Friday.", "I'd like to book a table for two this Saturday night."],
      },
      {
        pattern: "Do you have anything around ___?",
        meaning: "大約 ___ 點有位子嗎？",
        examples: ["Do you have anything around 7?", "Do you have anything a bit later, around 8:30?"],
      },
      {
        pattern: "Just to confirm, ___.",
        meaning: "跟您確認一下，___。",
        examples: ["Just to confirm, that's four people at 7 p.m. on Friday.", "Just to confirm, the booking is under Wang."],
      },
    ],
    dialogue: {
      roles: { A: "Restaurant", B: "Caller" },
      lines: [
        { speaker: "A", text: "Good afternoon, Bella Cucina. How can I help you?", zh: "午安，Bella Cucina 您好，有什麼可以為您服務的？" },
        { speaker: "B", text: "Hi, I'd like to book a table for four on Friday night.", zh: "您好，我想訂週五晚上四位。" },
        { speaker: "A", text: "What time would you like?", zh: "您想訂幾點？" },
        { speaker: "B", text: "Do you have anything around seven?", zh: "大約七點有位子嗎？" },
        { speaker: "A", text: "Seven is fully booked, but 7:30 is available.", zh: "七點已經訂滿了，不過七點半有位子。" },
        { speaker: "B", text: "7:30 is fine. It's my friend's birthday.", zh: "七點半可以。是我朋友的生日。" },
        { speaker: "A", text: "Lovely. Can I have your name and phone number?", zh: "真好。可以給我您的名字和電話嗎？" },
        { speaker: "B", text: "It's Wang, 0912-345-678. Just to confirm, four people at 7:30 on Friday?", zh: "我姓王，0912-345-678。跟您確認，週五七點半四位對嗎？" },
      ],
    },
    tasks: [
      "Role-play: answer the phone; the student asks to book a table.",
      "Ask for the date, time and number of people.",
      "Say the requested time is fully booked and offer another time; let the student negotiate.",
      "Ask for name and phone number, and have the student confirm the booking with \"Just to confirm, ___\".",
    ],
  },

  // ───────── 職場英文 ─────────
  {
    id: "business-your-job",
    courseId: "business",
    title: "介紹你的工作",
    titleEn: "Talking About Your Job",
    level: "B1",
    minutes: 20,
    goal: "能清楚說明自己的職位、負責內容，以及工作中的挑戰。",
    scene: "The student meets a new colleague from the overseas office at a company event.",
    vocabulary: [
      { word: "be in charge of", pos: "phr.", meaning: "負責", example: "I'm in charge of online marketing." },
      { word: "department", pos: "n.", meaning: "部門", example: "I work in the finance department." },
      { word: "client", pos: "n.", meaning: "客戶", example: "I meet clients every week." },
      { word: "deadline", pos: "n.", meaning: "截止期限", example: "We have a tight deadline." },
      { word: "challenging", pos: "adj.", meaning: "有挑戰性的", example: "My job is challenging but fun." },
      { word: "responsible for", pos: "phr.", meaning: "對……負責", example: "I'm responsible for the budget." },
    ],
    phrases: [
      {
        pattern: "I work as a ___ at ___.",
        meaning: "我在 ___ 擔任 ___。",
        examples: ["I work as a product manager at a tech startup.", "I work as an accountant at a trading company."],
      },
      {
        pattern: "I'm mainly responsible for ___.",
        meaning: "我主要負責 ___。",
        examples: ["I'm mainly responsible for customer support.", "I'm mainly responsible for planning new features."],
      },
      {
        pattern: "The most challenging part is ___.",
        meaning: "最有挑戰的部分是 ___。",
        examples: ["The most challenging part is meeting tight deadlines.", "The most challenging part is working with teams in different time zones."],
      },
    ],
    dialogue: {
      roles: { A: "Rachel", B: "Ken" },
      lines: [
        { speaker: "A", text: "So, Ken, what do you do here?", zh: "Ken，你在這裡負責什麼？" },
        { speaker: "B", text: "I work as a marketing specialist. I'm mainly responsible for our social media.", zh: "我是行銷專員，主要負責我們的社群媒體。" },
        { speaker: "A", text: "That sounds interesting. What does a typical day look like?", zh: "聽起來很有趣。你一般的一天是怎麼過的？" },
        { speaker: "B", text: "I usually plan posts in the morning and check the results in the afternoon.", zh: "我通常早上規劃貼文，下午看成效數據。" },
        { speaker: "A", text: "What's the most challenging part?", zh: "最有挑戰的是什麼？" },
        { speaker: "B", text: "The most challenging part is keeping up with trends. They change so fast!", zh: "最有挑戰的是跟上趨勢，變化實在太快了！" },
      ],
    },
    tasks: [
      "Ask the student's job title and company/department.",
      "Ask what they are mainly responsible for; encourage \"I'm mainly responsible for ___\".",
      "Ask what a typical workday looks like.",
      "Ask about the most challenging and most rewarding parts of the job, and ask one follow-up question.",
    ],
  },
  {
    id: "business-meetings",
    courseId: "business",
    title: "會議中表達意見",
    titleEn: "Sharing Opinions in Meetings",
    level: "B1",
    minutes: 20,
    goal: "能在會議中提出意見、禮貌地表示不同意，並提出建議。",
    scene: "A team meeting about whether to launch a new product next month or delay it. The teacher leads the meeting.",
    vocabulary: [
      { word: "suggest", pos: "v.", meaning: "建議", example: "I suggest we wait one more week." },
      { word: "point", pos: "n.", meaning: "論點", example: "That's a good point." },
      { word: "concern", pos: "n.", meaning: "顧慮", example: "My main concern is the budget." },
      { word: "agree / disagree", pos: "v.", meaning: "同意／不同意", example: "I partly agree with you." },
      { word: "launch", pos: "v.", meaning: "推出、上市", example: "We plan to launch it in May." },
      { word: "priority", pos: "n.", meaning: "優先事項", example: "Quality should be our priority." },
    ],
    phrases: [
      {
        pattern: "In my opinion, ___.",
        meaning: "我認為 ___。",
        examples: ["In my opinion, we need more user testing.", "In my opinion, the price is a little too high."],
      },
      {
        pattern: "I see your point, but ___.",
        meaning: "我懂你的意思，但是 ___。（禮貌地不同意）",
        examples: ["I see your point, but the timeline is very tight.", "I see your point, but our customers may not like it."],
      },
      {
        pattern: "What if we ___?",
        meaning: "如果我們 ___ 呢？（提出替代方案）",
        examples: ["What if we launch a beta version first?", "What if we ask the design team for help?"],
      },
    ],
    dialogue: {
      roles: { A: "Manager", B: "Team member" },
      lines: [
        { speaker: "A", text: "So, should we launch the app next month? What do you think?", zh: "那麼，我們下個月要推出 App 嗎？你怎麼看？" },
        { speaker: "B", text: "In my opinion, we need more time for testing.", zh: "我認為我們需要更多時間測試。" },
        { speaker: "A", text: "I see your point, but our competitors are launching soon.", zh: "我懂你的意思，但競爭對手很快就要推出了。" },
        { speaker: "B", text: "That's true. What if we launch a beta version first?", zh: "沒錯。那如果我們先推出測試版呢？" },
        { speaker: "A", text: "Interesting idea. What would that look like?", zh: "有意思的想法，具體會怎麼做？" },
        { speaker: "B", text: "We could invite 500 users, collect feedback for two weeks, and then do the full launch.", zh: "我們可以邀請 500 位使用者，蒐集兩週回饋，再正式推出。" },
      ],
    },
    tasks: [
      "Set up the meeting topic and ask the student for their opinion.",
      "Push back on their opinion; encourage a polite disagreement (\"I see your point, but ___\").",
      "Ask the student to suggest an alternative using \"What if we ___?\".",
      "Ask them to summarize the decision and next steps in 2-3 sentences.",
    ],
  },
  {
    id: "business-requests",
    courseId: "business",
    title: "請同事幫忙",
    titleEn: "Making Requests at Work",
    level: "B1",
    minutes: 15,
    goal: "能用有禮貌的方式請求協助、說明期限，並回應對方的請求。",
    scene: "The student needs a coworker (the teacher) to review a report before a deadline.",
    vocabulary: [
      { word: "favor", pos: "n.", meaning: "幫忙", example: "Could you do me a favor?" },
      { word: "review", pos: "v.", meaning: "審閱、檢查", example: "Could you review my slides?" },
      { word: "by (time)", pos: "prep.", meaning: "在……之前", example: "I need it by Friday." },
      { word: "urgent", pos: "adj.", meaning: "緊急的", example: "It's not urgent." },
      { word: "appreciate", pos: "v.", meaning: "感激", example: "I really appreciate your help." },
      { word: "swamped", pos: "adj.", meaning: "忙翻了", example: "I'm swamped this week." },
    ],
    phrases: [
      {
        pattern: "Would you mind ___ing?",
        meaning: "你介意幫我 ___ 嗎？（很有禮貌）",
        examples: ["Would you mind checking my report?", "Would you mind sending me the file?"],
      },
      {
        pattern: "Is there any chance you could ___ by ___?",
        meaning: "你有沒有可能在 ___ 前 ___？",
        examples: ["Is there any chance you could finish it by Thursday?", "Is there any chance you could reply by noon?"],
      },
      {
        pattern: "I'd love to help, but ___.",
        meaning: "我很想幫忙，但是 ___。（委婉拒絕）",
        examples: ["I'd love to help, but I'm swamped today.", "I'd love to help, but I have a meeting until 5."],
      },
    ],
    dialogue: {
      roles: { A: "Amy", B: "Jason" },
      lines: [
        { speaker: "A", text: "Hi Jason, do you have a minute?", zh: "嗨 Jason，你有空一下嗎？" },
        { speaker: "B", text: "Sure, what's up?", zh: "當然，怎麼了？" },
        { speaker: "A", text: "Would you mind reviewing my sales report? I want to make sure the numbers are right.", zh: "你介意幫我看一下業績報告嗎？我想確定數字沒錯。" },
        { speaker: "B", text: "No problem. When do you need it?", zh: "沒問題，你什麼時候要？" },
        { speaker: "A", text: "Is there any chance you could look at it by Thursday?", zh: "你有沒有可能在週四前看完？" },
        { speaker: "B", text: "Thursday is tough. I'm swamped this week. How about Friday morning?", zh: "週四有點難，我這週忙翻了。週五早上可以嗎？" },
        { speaker: "A", text: "Friday morning works. I really appreciate it!", zh: "週五早上可以，真的很感謝你！" },
      ],
    },
    tasks: [
      "Role-play: the student asks you for help with a task.",
      "Ask when they need it; let the student give a deadline politely.",
      "Say you're busy and offer another time; let the student negotiate.",
      "Switch roles: you ask the student for a favor, and the student politely declines with \"I'd love to help, but ___\".",
    ],
  },

  // ───────── 面試英文 ─────────
  {
    id: "interview-about-you",
    courseId: "interview",
    title: "介紹你自己",
    titleEn: "Tell Me About Yourself",
    level: "B1",
    minutes: 20,
    goal: "能用「現在→過去→未來」的架構，在一分鐘內介紹自己的背景。",
    scene: "A job interview for a position the student wants. The teacher is the interviewer.",
    vocabulary: [
      { word: "background", pos: "n.", meaning: "背景、經歷", example: "I have a background in finance." },
      { word: "experience", pos: "n.", meaning: "經驗", example: "I have five years of experience." },
      { word: "currently", pos: "adv.", meaning: "目前", example: "I'm currently working at a bank." },
      { word: "skill", pos: "n.", meaning: "技能", example: "My key skill is data analysis." },
      { word: "achieve", pos: "v.", meaning: "達成", example: "We achieved our sales goal." },
      { word: "position", pos: "n.", meaning: "職位", example: "I'm applying for the sales position." },
    ],
    phrases: [
      {
        pattern: "I'm currently a ___ at ___, where I ___.",
        meaning: "我目前在 ___ 擔任 ___，負責 ___。（現在）",
        examples: ["I'm currently a project manager at ABC Tech, where I lead a team of five.", "I'm currently a teacher at a cram school, where I teach English."],
      },
      {
        pattern: "Before that, I worked as ___ for ___ years.",
        meaning: "在那之前，我當了 ___ 年的 ___。（過去）",
        examples: ["Before that, I worked as a sales representative for three years.", "Before that, I worked as an intern at a design studio."],
      },
      {
        pattern: "I'm excited about this position because ___.",
        meaning: "我對這個職位很期待，因為 ___。（未來）",
        examples: ["I'm excited about this position because I want to work on global projects.", "I'm excited about this position because it matches my skills."],
      },
    ],
    dialogue: {
      roles: { A: "Interviewer", B: "Candidate" },
      lines: [
        { speaker: "A", text: "Thanks for coming in. Can you tell me a little about yourself?", zh: "謝謝你今天過來。可以簡單介紹一下你自己嗎？" },
        { speaker: "B", text: "Sure. I'm currently a data analyst at a retail company, where I build sales reports.", zh: "好的。我目前在一家零售公司當資料分析師，負責製作銷售報表。" },
        { speaker: "B", text: "Before that, I worked in customer service for two years, so I understand customers well.", zh: "在那之前，我做了兩年客服，所以我很了解顧客。" },
        { speaker: "A", text: "Interesting. What's one thing you're proud of?", zh: "很有意思。有什麼是你引以為傲的嗎？" },
        { speaker: "B", text: "Last year, my report helped the team reduce costs by 15%.", zh: "去年我的報告幫團隊降低了 15% 的成本。" },
        { speaker: "B", text: "I'm excited about this position because I want to use data to help more teams make decisions.", zh: "我很期待這個職位，因為我想用數據幫助更多團隊做決策。" },
      ],
    },
    tasks: [
      "Ask what job the student wants to practice for, then start the interview.",
      "Ask \"Tell me about yourself\" and guide them to structure it as present → past → future.",
      "Ask about one achievement they are proud of, with a number or result if possible.",
      "Ask why they want this position, then give the student a chance to give the full 1-minute answer again, improved.",
    ],
  },
  {
    id: "interview-strengths",
    courseId: "interview",
    title: "優點與缺點",
    titleEn: "Strengths and Weaknesses",
    level: "B1",
    minutes: 20,
    goal: "能用具體例子說明優點，並誠實又正面地談自己的缺點。",
    scene: "A job interview. The teacher asks the classic strengths-and-weaknesses questions.",
    vocabulary: [
      { word: "strength", pos: "n.", meaning: "優點、強項", example: "My biggest strength is communication." },
      { word: "weakness", pos: "n.", meaning: "缺點、弱點", example: "One weakness is public speaking." },
      { word: "detail-oriented", pos: "adj.", meaning: "注重細節的", example: "I'm very detail-oriented." },
      { word: "improve", pos: "v.", meaning: "改善", example: "I'm working to improve it." },
      { word: "for example", pos: "phr.", meaning: "例如", example: "For example, I lead weekly meetings." },
      { word: "feedback", pos: "n.", meaning: "回饋", example: "I ask my manager for feedback." },
    ],
    phrases: [
      {
        pattern: "My biggest strength is ___. For example, ___.",
        meaning: "我最大的優點是 ___。例如 ___。",
        examples: ["My biggest strength is problem-solving. For example, I fixed a major bug before a product launch.", "My biggest strength is teamwork. For example, I helped two teams work together on a project."],
      },
      {
        pattern: "One area I'm working on is ___.",
        meaning: "我正在努力改進的是 ___。（談缺點的好說法）",
        examples: ["One area I'm working on is public speaking.", "One area I'm working on is saying no to extra tasks."],
      },
      {
        pattern: "To improve, I've started ___.",
        meaning: "為了改善，我開始 ___。",
        examples: ["To improve, I've started joining a speaking club.", "To improve, I've started using a task app to plan my week."],
      },
    ],
    dialogue: {
      roles: { A: "Interviewer", B: "Candidate" },
      lines: [
        { speaker: "A", text: "What would you say is your biggest strength?", zh: "你覺得你最大的優點是什麼？" },
        { speaker: "B", text: "My biggest strength is that I'm very organized. For example, I created a system that cut our planning time in half.", zh: "我最大的優點是很有條理。例如，我建立了一套系統，讓規劃時間減少一半。" },
        { speaker: "A", text: "Great. And what about a weakness?", zh: "很好。那缺點呢？" },
        { speaker: "B", text: "One area I'm working on is public speaking. I used to get nervous in big meetings.", zh: "我正在改進的是公開演說，以前在大型會議上會緊張。" },
        { speaker: "B", text: "To improve, I've started presenting in our weekly team meeting.", zh: "為了改善，我開始在每週團隊會議上做報告。" },
        { speaker: "A", text: "That's a good approach.", zh: "這是個好方法。" },
      ],
    },
    tasks: [
      "Ask the student about their biggest strength.",
      "Ask for a specific example that proves it (situation, action, result).",
      "Ask about a weakness; encourage \"One area I'm working on is ___\" plus what they do to improve.",
      "Give brief interviewer-style feedback on how convincing the answers were, then ask a tougher follow-up.",
    ],
  },
  {
    id: "interview-questions",
    courseId: "interview",
    title: "反問面試官",
    titleEn: "Asking the Interviewer Questions",
    level: "B1",
    minutes: 15,
    goal: "面試尾聲能提出好問題，展現對職位的興趣，並得體地結束面試。",
    scene: "The end of a job interview. The teacher asks \"Do you have any questions for us?\"",
    vocabulary: [
      { word: "team culture", pos: "n.", meaning: "團隊文化", example: "How would you describe the team culture?" },
      { word: "growth", pos: "n.", meaning: "成長", example: "Are there opportunities for growth?" },
      { word: "expectation", pos: "n.", meaning: "期待", example: "What are your expectations for this role?" },
      { word: "next step", pos: "n.", meaning: "下一步", example: "What are the next steps?" },
      { word: "onboarding", pos: "n.", meaning: "新人到職培訓", example: "What does onboarding look like?" },
      { word: "look forward to", pos: "phr.", meaning: "期待", example: "I look forward to hearing from you." },
    ],
    phrases: [
      {
        pattern: "Could you tell me more about ___?",
        meaning: "可以多跟我說一些關於 ___ 的事嗎？",
        examples: ["Could you tell me more about the team I'd be working with?", "Could you tell me more about a typical day in this role?"],
      },
      {
        pattern: "What does success look like in this role?",
        meaning: "在這個職位上，怎樣算是做得好？",
        examples: ["What does success look like in the first six months?", "What does success look like for this team?"],
      },
      {
        pattern: "Thank you for your time. I look forward to ___.",
        meaning: "謝謝您的時間，我很期待 ___。（得體結尾）",
        examples: ["Thank you for your time. I look forward to hearing from you.", "Thank you for your time. I look forward to the next step."],
      },
    ],
    dialogue: {
      roles: { A: "Interviewer", B: "Candidate" },
      lines: [
        { speaker: "A", text: "That's all from me. Do you have any questions for us?", zh: "我這邊問完了。你有任何問題想問我們嗎？" },
        { speaker: "B", text: "Yes, thank you. Could you tell me more about the team I'd be working with?", zh: "有，謝謝。可以多介紹一下我會合作的團隊嗎？" },
        { speaker: "A", text: "Sure. It's a team of eight, with designers and engineers.", zh: "當然，團隊有八個人，有設計師也有工程師。" },
        { speaker: "B", text: "And what does success look like in the first six months?", zh: "那在前六個月，怎樣算是做得好呢？" },
        { speaker: "A", text: "We'd like you to lead one small project by yourself.", zh: "我們希望你能獨立帶一個小專案。" },
        { speaker: "B", text: "That sounds exciting. What are the next steps in the process?", zh: "聽起來很令人期待。接下來的流程是什麼？" },
        { speaker: "A", text: "We'll contact you within a week.", zh: "我們會在一週內聯絡你。" },
        { speaker: "B", text: "Thank you for your time. I look forward to hearing from you.", zh: "謝謝您的時間，期待您的消息。" },
      ],
    },
    tasks: [
      "Tell the student the interview is ending and ask if they have any questions.",
      "Answer their questions briefly and naturally; encourage at least two thoughtful questions.",
      "If a question is too general, ask the student to make it more specific.",
      "Let the student close the interview politely with \"Thank you for your time. I look forward to ___\".",
    ],
  },

  // ───────── 議題討論 ─────────
  {
    id: "discussion-technology",
    courseId: "discussion",
    title: "科技與生活",
    titleEn: "Technology in Daily Life",
    level: "B2",
    minutes: 25,
    goal: "能討論科技的優缺點，表達立場並用個人經驗支持論點。",
    scene: "A discussion class about how smartphones and AI change our daily lives.",
    vocabulary: [
      { word: "convenient", pos: "adj.", meaning: "方便的", example: "Online banking is very convenient." },
      { word: "addicted to", pos: "phr.", meaning: "對……上癮", example: "Many people are addicted to their phones." },
      { word: "privacy", pos: "n.", meaning: "隱私", example: "Apps collect a lot of data, which affects our privacy." },
      { word: "rely on", pos: "phr.", meaning: "依賴", example: "We rely on maps apps to get around." },
      { word: "on the other hand", pos: "phr.", meaning: "另一方面", example: "On the other hand, it can be distracting." },
      { word: "drawback", pos: "n.", meaning: "缺點", example: "The main drawback is the cost." },
    ],
    phrases: [
      {
        pattern: "One major advantage of ___ is that ___.",
        meaning: "___ 的一大好處是 ___。",
        examples: ["One major advantage of smartphones is that we can work anywhere.", "One major advantage of AI tools is that they save time."],
      },
      {
        pattern: "On the other hand, ___.",
        meaning: "另一方面，___。（提出反面觀點）",
        examples: ["On the other hand, it's harder to focus.", "On the other hand, people spend less time talking face to face."],
      },
      {
        pattern: "From my own experience, ___.",
        meaning: "以我自己的經驗來說，___。",
        examples: ["From my own experience, turning off notifications helps a lot.", "From my own experience, AI helps me write emails faster."],
      },
    ],
    dialogue: {
      roles: { A: "Teacher", B: "Student" },
      lines: [
        { speaker: "A", text: "Do you think smartphones make our lives better or worse?", zh: "你覺得智慧型手機讓我們的生活變好還是變糟？" },
        { speaker: "B", text: "Mostly better. One major advantage is that we can find information instantly.", zh: "大多是變好。一大好處是我們能立刻找到資訊。" },
        { speaker: "A", text: "Are there any drawbacks?", zh: "有什麼缺點嗎？" },
        { speaker: "B", text: "On the other hand, many people are addicted to social media and can't focus.", zh: "另一方面，很多人沉迷社群媒體，沒辦法專心。" },
        { speaker: "A", text: "How do you deal with that yourself?", zh: "你自己怎麼處理這個問題？" },
        { speaker: "B", text: "From my own experience, putting my phone in another room while studying really helps.", zh: "以我自己的經驗，讀書時把手機放在另一個房間真的很有用。" },
      ],
    },
    tasks: [
      "Ask the student whether technology (smartphones, AI) makes life better or worse, and why.",
      "Ask for one advantage and one drawback, encouraging \"One major advantage ___\" and \"On the other hand ___\".",
      "Ask for a personal example (\"From my own experience ___\").",
      "Play devil's advocate with an opposing view and ask the student to respond with reasons.",
    ],
  },
  {
    id: "discussion-work-life",
    courseId: "discussion",
    title: "工作與生活平衡",
    titleEn: "Work-Life Balance",
    level: "B2",
    minutes: 25,
    goal: "能比較不同的工作方式（遠端、加班文化），並提出具體的建議。",
    scene: "A discussion class about remote work, overtime, and how to keep a healthy work-life balance.",
    vocabulary: [
      { word: "remote work", pos: "n.", meaning: "遠端工作", example: "Remote work saves commuting time." },
      { word: "overtime", pos: "n.", meaning: "加班", example: "I worked overtime three days this week." },
      { word: "burnout", pos: "n.", meaning: "倦怠、過勞", example: "Too much stress can lead to burnout." },
      { word: "flexible", pos: "adj.", meaning: "彈性的", example: "We have flexible working hours." },
      { word: "productive", pos: "adj.", meaning: "有生產力的", example: "I'm more productive in the morning." },
      { word: "boundary", pos: "n.", meaning: "界線", example: "It's important to set boundaries." },
    ],
    phrases: [
      {
        pattern: "Compared to ___, ___ is much more ___.",
        meaning: "跟 ___ 比起來，___ 更 ___。",
        examples: ["Compared to office work, remote work is much more flexible.", "Compared to ten years ago, people are much more aware of burnout."],
      },
      {
        pattern: "The problem with ___ is that ___.",
        meaning: "___ 的問題在於 ___。",
        examples: ["The problem with working from home is that it's hard to switch off.", "The problem with long hours is that people become less productive."],
      },
      {
        pattern: "I think companies should ___.",
        meaning: "我認為公司應該 ___。（提出建議）",
        examples: ["I think companies should offer more flexible hours.", "I think companies should stop sending messages after work."],
      },
    ],
    dialogue: {
      roles: { A: "Teacher", B: "Student" },
      lines: [
        { speaker: "A", text: "Would you rather work from home or in an office?", zh: "你比較想在家工作還是進辦公室？" },
        { speaker: "B", text: "Compared to the office, working from home is much more flexible, so I prefer it.", zh: "跟辦公室比起來，在家工作彈性大得多，所以我比較喜歡。" },
        { speaker: "A", text: "Are there any downsides?", zh: "有什麼缺點嗎？" },
        { speaker: "B", text: "The problem with it is that it's hard to stop working. I sometimes answer emails at 11 p.m.", zh: "問題是很難停下來。我有時候晚上十一點還在回信。" },
        { speaker: "A", text: "So what can people or companies do about that?", zh: "那個人或公司可以怎麼做？" },
        { speaker: "B", text: "I think companies should set clear rules, like no messages after 7 p.m.", zh: "我認為公司應該訂清楚的規則，例如晚上七點後不傳訊息。" },
      ],
    },
    tasks: [
      "Ask whether the student prefers remote work or the office, and why.",
      "Ask them to compare the two using \"Compared to ___, ___ is much more ___\".",
      "Discuss overtime culture and burnout in their country or company.",
      "Ask for two concrete suggestions for companies or individuals, then challenge one of them.",
    ],
  },
  {
    id: "discussion-environment",
    courseId: "discussion",
    title: "環保與日常選擇",
    titleEn: "The Environment and Everyday Choices",
    level: "B2",
    minutes: 25,
    goal: "能討論個人與政府在環保上的責任，提出看法並回應反對意見。",
    scene: "A discussion class about plastic waste, recycling, and whose responsibility the environment is.",
    vocabulary: [
      { word: "single-use", pos: "adj.", meaning: "一次性的", example: "Single-use plastic bags are banned in some stores." },
      { word: "reduce", pos: "v.", meaning: "減少", example: "We should reduce food waste." },
      { word: "responsibility", pos: "n.", meaning: "責任", example: "It's everyone's responsibility." },
      { word: "policy", pos: "n.", meaning: "政策", example: "The government introduced a new recycling policy." },
      { word: "make a difference", pos: "phr.", meaning: "帶來改變", example: "Small actions can make a difference." },
      { word: "sustainable", pos: "adj.", meaning: "永續的", example: "We need more sustainable products." },
    ],
    phrases: [
      {
        pattern: "I strongly believe that ___.",
        meaning: "我非常相信 ___。（表達強烈立場）",
        examples: ["I strongly believe that small actions can make a difference.", "I strongly believe that the government should do more."],
      },
      {
        pattern: "That may be true, but ___.",
        meaning: "那也許沒錯，但是 ___。（回應反對意見）",
        examples: ["That may be true, but individuals still have a role to play.", "That may be true, but the cost is too high for small businesses."],
      },
      {
        pattern: "For instance, ___.",
        meaning: "舉例來說，___。",
        examples: ["For instance, I always bring my own cup to coffee shops.", "For instance, Taiwan's recycling system is very effective."],
      },
    ],
    dialogue: {
      roles: { A: "Teacher", B: "Student" },
      lines: [
        { speaker: "A", text: "Who should be responsible for protecting the environment — individuals or governments?", zh: "保護環境應該是誰的責任？個人還是政府？" },
        { speaker: "B", text: "I strongly believe it's both, but governments can make a bigger difference.", zh: "我非常相信兩者都有責任，但政府能帶來更大的改變。" },
        { speaker: "A", text: "Why do you think so?", zh: "為什麼這麼認為？" },
        { speaker: "B", text: "Because policies change everyone's behavior. For instance, the plastic bag fee reduced plastic use a lot.", zh: "因為政策能改變所有人的行為。例如塑膠袋收費讓塑膠使用量大幅減少。" },
        { speaker: "A", text: "Some people say one person's actions don't matter.", zh: "有人說一個人的行動沒什麼影響。" },
        { speaker: "B", text: "That may be true for one person, but millions of small actions add up.", zh: "對一個人來說也許是，但上百萬個小行動加起來就很可觀。" },
      ],
    },
    tasks: [
      "Ask who is more responsible for the environment: individuals or governments.",
      "Ask the student to support their view with an example (\"For instance ___\").",
      "Present an opposing opinion and have them respond with \"That may be true, but ___\".",
      "Ask what they personally do (or could do) to be more sustainable, and ask a follow-up.",
    ],
  },
];

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id);
}

export function getCourse(id: string) {
  return COURSES.find((c) => c.id === id);
}

export function getCourseLessons(courseId: string) {
  return LESSONS.filter((l) => l.courseId === courseId);
}
