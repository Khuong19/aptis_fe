import { QuestionSet, Comment } from '@/app/types/question-bank';

export const mockUser = {
  id: "user1",
  name: "Current Teacher",
};

export const mockQuestionSets: QuestionSet[] = [
  {
    id: 'qs-ai-1',
    title: 'Technology in Education',
    part: 2,
    level: 'B1',
    type: 'reading',
    authorId: 'user1',
    authorName: 'Current Teacher',
    isPublic: false,
    createdAt: '2025-06-20T10:00:00Z',
    updatedAt: '2025-06-20T10:00:00Z',
    source: 'ai-generated',
    passageText: JSON.stringify([
      { id: 's1', text: 'Technology has transformed education in numerous ways.', isExample: true },
      { id: 's2', text: 'Digital tools have become essential in modern classrooms.', isExample: false },
      { id: 's3', text: 'Students now have access to vast resources beyond traditional textbooks.', isExample: false },
      { id: 's4', text: 'Teachers can personalize learning experiences and track progress more effectively.', isExample: false },
      { id: 's5', text: 'Interactive whiteboards and online platforms are increasingly common.', isExample: false },
      { id: 's6', text: 'However, the digital divide remains a challenge for education.', isExample: false },
      { id: 's7', text: 'Not all students have equal access to technology at home.', isExample: false },
    ]),
    questions: [
      {
        id: 'q-ai-1-1',
        text: 'What is the main benefit of technology in education mentioned in the text?',
        options: {
          A: 'Reduced costs',
          B: 'Personalized learning',
          C: 'Faster internet',
          D: 'More homework'
        },
        answer: 'B',
        user_id: 'user1',
        createdBy: 'Current Teacher'
      }
    ],
  },
  {
    id: 'qs-excel-1',
    title: 'Environmental Conservation',
    part: 3,
    level: 'B2',
    type: 'reading',
    authorId: 'user1',
    authorName: 'Current Teacher',
    isPublic: true,
    createdAt: '2025-06-15T14:30:00Z',
    updatedAt: '2025-06-15T14:30:00Z',
    source: 'manual',
    passages: [
      {
        id: 'p-env-A',
        person: 'A',
        text: "As a marine biologist, I focus on ocean conservation. The biggest threats to marine ecosystems are plastic pollution, overfishing, and climate change. Our research shows that establishing protected marine areas allows fish populations to recover and ecosystems to regenerate. We need international cooperation to address these challenges effectively."
      },
      {
        id: 'p-env-B',
        person: 'B',
        text: "I believe individual actions matter most in environmental conservation. By reducing our consumption, reusing items, and recycling properly, we can significantly decrease our environmental footprint. Small changes like using reusable bags, avoiding single-use plastics, and conserving water add up when millions of people adopt them."
      },
      {
        id: 'p-env-C',
        person: 'C',
        text: "As an environmental policy expert, I know that effective regulations are essential for conservation. Governments must establish and enforce standards for emissions, waste management, and resource extraction. Economic incentives like carbon taxes and subsidies for renewable energy can drive market-based solutions to environmental problems."
      },
      {
        id: 'p-env-D',
        person: 'D',
        text: "My work in forest conservation has shown that local communities must be involved in preservation efforts. Indigenous peoples often have sustainable practices developed over generations. When we empower these communities to manage their traditional lands, we see better conservation outcomes than with top-down approaches."
      }
    ],
    questions: [
      {
        id: 'q-excel-1-1',
        text: 'focuses on ocean conservation and marine ecosystems?',
        options: {
          A: 'Person A',
          B: 'Person B',
          C: 'Person C',
          D: 'Person D'
        },
        answer: 'A',
        correctPerson: 'A'
      },
      {
        id: 'q-excel-1-2',
        text: 'believes individual actions and small changes are most important?',
        options: {
          A: 'Person A',
          B: 'Person B',
          C: 'Person C',
          D: 'Person D'
        },
        answer: 'B',
        correctPerson: 'B'
      },
      {
        id: 'q-excel-1-3',
        text: 'emphasizes the importance of government regulations and policies?',
        options: {
          A: 'Person A',
          B: 'Person B',
          C: 'Person C',
          D: 'Person D'
        },
        answer: 'C',
        correctPerson: 'C'
      },
      {
        id: 'q-excel-1-4',
        text: 'works with indigenous communities on conservation efforts?',
        options: {
          A: 'Person A',
          B: 'Person B',
          C: 'Person C',
          D: 'Person D'
        },
        answer: 'D',
        correctPerson: 'D'
      },
      {
        id: 'q-excel-1-5',
        text: 'mentions the need for international cooperation?',
        options: {
          A: 'Person A',
          B: 'Person B',
          C: 'Person C',
          D: 'Person D'
        },
        answer: 'A',
        correctPerson: 'A'
      }
    ]
  },
  {
    id: 'qs-manual-1',
    title: 'Healthy Lifestyle Choices',
    part: 1,
    level: 'A2',
    type: 'reading',
    authorId: 'user1',
    authorName: 'Current Teacher',
    isPublic: false,
    createdAt: '2025-06-10T09:15:00Z',
    updatedAt: '2025-06-10T09:15:00Z',
    source: 'manual',
    passageText: 'Making healthy lifestyle choices is important for physical and mental [1]. Regular exercise, balanced [2], adequate sleep, and stress management all [3] to overall health. Small changes in daily [4] can lead to significant [5] in quality of life.',
    questions: [
      {
        id: 'q-manual-1-1',
        text: 'Gap 1',
        options: {
          A: 'wellbeing',
          B: 'condition',
          C: 'state',
          D: 'health'
        },
        answer: 'A'
      },
      {
        id: 'q-manual-1-2',
        text: 'Gap 2',
        options: {
          A: 'nutrition',
          B: 'diet',
          C: 'food',
          D: 'meals'
        },
        answer: 'A'
      },
      {
        id: 'q-manual-1-3',
        text: 'Gap 3',
        options: {
          A: 'contribute',
          B: 'add',
          C: 'affect',
          D: 'relate'
        },
        answer: 'A'
      },
      {
        id: 'q-manual-1-4',
        text: 'Gap 4',
        options: {
          A: 'habits',
          B: 'routines',
          C: 'activities',
          D: 'practices'
        },
        answer: 'A'
      },
      {
        id: 'q-manual-1-5',
        text: 'Gap 5',
        options: {
          A: 'improvements',
          B: 'changes',
          C: 'benefits',
          D: 'advances'
        },
        answer: 'A'
      }
    ]
  },
  {
    id: 'qs-4',
    title: 'The History of Coffee',
    part: 4,
    type: 'reading',
    level: 'B2',
    paragraphs: [
      { id: 'p1', text: 'Coffee was first discovered in Ethiopia around the 9th century. According to legend, a goat herder named Kaldi noticed his goats became energetic after eating certain berries. He shared his findings with local monks, who made a drink from these berries to help them stay awake during prayers.', correctHeadingId: 'h1' },
      { id: 'p2', text: 'By the 15th century, coffee cultivation had spread to Yemen and other parts of the Middle East. Coffee houses, known as qahveh khaneh, became important social hubs where people gathered to drink coffee, engage in conversation, listen to music, and play games.', correctHeadingId: 'h2' },
      { id: 'p3', text: 'European travelers to the Middle East brought coffee back to their home countries in the 17th century. Initially met with suspicion and labeled as a "bitter invention of Satan," coffee eventually gained popularity across Europe, with coffee houses opening in major cities like Venice, London, and Paris.', correctHeadingId: 'h3' },
      { id: 'p4', text: 'Coffee plantations were established in the Americas in the 18th century. The climate in countries like Brazil, Colombia, and Jamaica proved ideal for coffee cultivation. Today, these regions are among the world\'s largest coffee producers, with Brazil alone accounting for about one-third of global coffee production.', correctHeadingId: 'h4' },
      { id: 'p5', text: 'Modern coffee culture has evolved significantly, with specialty coffee shops emphasizing bean origin, roasting techniques, and brewing methods. Consumers now appreciate coffee as a complex beverage with various flavor profiles, similar to wine. This "third wave" of coffee has transformed it from a commodity to an artisanal product.', correctHeadingId: 'h5' },
    ],
    headings: [
      { id: 'h1', text: 'Ancient Origins and Discovery' },
      { id: 'h2', text: 'Spread Throughout the Middle East' },
      { id: 'h3', text: 'Introduction to Europe' },
      { id: 'h4', text: 'Cultivation in the Americas' },
      { id: 'h5', text: 'The Rise of Specialty Coffee' },
      { id: 'h6', text: 'Environmental Impacts of Production' }, // Distractor heading
      { id: 'h7', text: 'Health Benefits and Risks' }, // Distractor heading
    ],
    questions: [],
    authorId: 'user-2',
    authorName: 'Jane Doe',
    isPublic: true,
    createdAt: '2023-11-15T10:00:00Z',
    updatedAt: '2023-11-15T10:00:00Z',
  },
  {
    id: "qs1",
    title: "Office Memo: Clean Desk Policy",
    part: 1,
    source: 'official',
    type: "reading",
    level: "B1",
    passageText: "Dear Team,\n\nThis memo is to [q1-1] you about a new company-wide clean desk policy, which will be [q1-2] immediately. To [q1-3] a clean and professional working environment, we ask that all employees clear their desks of personal items at the end of each day. All work-related [q1-4] should be stored in the designated cabinets. Your [q1-5] is greatly appreciated as we implement this new standard. Thank you.",
    questions: [
      { id: "q1-1", text: "Gap 1", options: { A: "inform", B: "notify", C: "advise", D: "tell" }, answer: "A" },
      { id: "q1-2", text: "Gap 2", options: { A: "effective", B: "efficient", C: "official", D: "active" }, answer: "A" },
      { id: "q1-3", text: "Gap 3", options: { A: "ensure", B: "insure", C: "assure", D: "secure" }, answer: "A" },
      { id: "q1-4", text: "Gap 4", options: { A: "materials", B: "belongings", C: "possessions", D: "items" }, answer: "A" },
      { id: "q1-5", text: "Gap 5", options: { A: "cooperation", B: "compliance", C: "agreement", D: "support" }, answer: "A" },
    ],
    authorId: "user1",
    authorName: "Current Teacher",
    isPublic: false,
    createdAt: "2023-10-15T14:30:00",
    updatedAt: "2023-10-15T14:30:00",
  },
  {
    id: "qs2",
    title: "The History of Coffee",
    part: 2,
    type: "reading",
    level: "B1",
    passageText: JSON.stringify([
      { id: 's1', text: 'The history of coffee dates back to the 15th century.', isExample: true, order: 0 },
      { id: 's2', text: 'It was first discovered in the highlands of Ethiopia.', isExample: false, order: 1 },
      { id: 's3', text: 'From there, it spread to the Middle East, becoming popular in places like Persia, Egypt, and Turkey.', isExample: false, order: 2 },
      { id: 's4', text: 'By the 17th century, coffee had made its way to Europe, quickly becoming a favored beverage.', isExample: false, order: 3 },
      { id: 's5', text: 'Coffee houses in England became popular centers for social and business activities.', isExample: false, order: 4 },
      { id: 's6', text: 'Today, it is one of the most popular drinks worldwide.', isExample: false, order: 5 },
    ]),
    questions: [{
      id: "q2-1",
      text: "Put the sentences in the correct order",
      options: {
        A: "1,2,3,4,5",
        B: "2,3,1,5,4",
        C: "5,4,3,2,1",
        D: "1,3,2,4,5"
      },
      answer: "A"
    }],
    authorId: "user1",
    authorName: "Current Teacher",
    isPublic: true,
    createdAt: "2023-10-10T09:45:00",
    updatedAt: "2023-10-12T11:20:00",
  },
  {
    id: "qs3",
    title: "Opinions on Technology",
    part: 3,
    source: 'official',
    type: "reading",
    passages: [
      {
        id: 'pA',
        person: 'A',
        text: "I can't imagine my life without the latest gadgets. From smart homes that anticipate my needs to AI assistants that organize my schedule, technology makes everything seamless. I'm always the first in line for a new phone release. Some people call it an obsession, but I see it as embracing the future. It's thrilling to see how innovation is solving real-world problems."
      },
      {
        id: 'pB',
        person: 'B',
        text: "People are far too reliant on technology these days. We've forgotten how to have a face-to-face conversation or read a map. I make a conscious effort to disconnect. I don't own a smartphone, and I prefer reading physical books. There's a certain peace in not being constantly bombarded with notifications and digital noise. We're losing essential skills."
      },
      {
        id: 'pC',
        person: 'C',
        text: "Technology is a tool, nothing more, nothing less. It has its pros and cons. I use a computer for work and a smartphone to stay in touch with family, but I'm not interested in having the newest model. I'll upgrade when my current device breaks down. It's about balance. Using tech where it's genuinely useful, but not letting it take over your life."
      },
      {
        id: 'pD',
        person: 'D',
        text: "For me, technology is a canvas. I'm a digital artist and a coder, so I see it as a medium for creativity and expression. I love experimenting with new software and building small applications just for fun. It's not just about consumption; it's about creation. The power to build something entirely new with just a few lines of code is incredible."
      }
    ],
    questions: [
      { 
        id: "q3-1", 
        text: "believes technology should be used for practical purposes only?", 
        options: {
          A: "Person A",
          B: "Person B",
          C: "Person C",
          D: "Person D"
        },
        answer: "C",
        correctPerson: 'C' 
      },
      { 
        id: "q3-2", 
        text: "sees technology as a way to express creativity?", 
        options: {
          A: "Person A",
          B: "Person B",
          C: "Person C",
          D: "Person D"
        },
        answer: "D",
        correctPerson: 'D' 
      },
      { 
        id: "q3-3", 
        text: "is worried about the negative effects of technology on society?", 
        options: {
          A: "Person A",
          B: "Person B",
          C: "Person C",
          D: "Person D"
        },
        answer: "B",
        correctPerson: 'B' 
      },
      { 
        id: "q3-4", 
        text: "is excited about new technological advancements?", 
        options: {
          A: "Person A",
          B: "Person B",
          C: "Person C",
          D: "Person D"
        },
        answer: "A",
        correctPerson: 'A' 
      },
      { 
        id: "q3-5", 
        text: "avoids using modern gadgets?", 
        options: {
          A: "Person A",
          B: "Person B",
          C: "Person C",
          D: "Person D"
        },
        answer: "B",
        correctPerson: 'B' 
      },
      { 
        id: "q3-6", 
        text: "enjoys building things with technology?", 
        options: {
          A: "Person A",
          B: "Person B",
          C: "Person C",
          D: "Person D"
        },
        answer: "D",
        correctPerson: 'D' 
      },
      { 
        id: "q3-7", 
        text: "thinks technology simplifies daily life?", 
        options: {
          A: "Person A",
          B: "Person B",
          C: "Person C",
          D: "Person D"
        },
        answer: "A",
        correctPerson: 'A' 
      }
    ],
    authorId: "user2",
    authorName: "Jane Smith",
    isPublic: true,
    createdAt: "2023-09-28T16:20:00",
    updatedAt: "2023-09-29T10:15:00",
  },
  {
    id: "qs4",
    title: "Sustainable Urban Planning",
    part: 4,
    source: 'official',
    type: "reading",
    level: "B2",
    paragraphs: [
      { 
        id: 'p1', 
        text: 'Urban planners today face the challenge of creating cities that can accommodate growing populations while minimizing environmental impact. This requires careful consideration of land use, transportation systems, energy consumption, and waste management.', 
        correctHeadingId: 'h1',
        isExample: true 
      },
      { 
        id: 'p2', 
        text: 'Public transportation networks reduce traffic congestion and air pollution by decreasing the number of private vehicles on the road. Efficient systems include buses, trams, subways, and bike-sharing programs that are accessible, affordable, and interconnected.', 
        correctHeadingId: 'h2' 
      },
      { 
        id: 'p3', 
        text: 'Green spaces such as parks, community gardens, and urban forests provide numerous benefits to city dwellers. They improve air quality, reduce urban heat island effects, support biodiversity, manage stormwater runoff, and offer recreational opportunities that enhance physical and mental health.', 
        correctHeadingId: 'h3' 
      },
      { 
        id: 'p4', 
        text: 'Buildings account for a significant portion of urban energy consumption and greenhouse gas emissions. Energy-efficient designs incorporate proper insulation, passive heating and cooling strategies, smart energy management systems, and renewable energy sources like solar panels or geothermal systems.', 
        correctHeadingId: 'h4' 
      },
      { 
        id: 'p5', 
        text: 'Mixed-use developments combine residential, commercial, and recreational spaces within walkable distances. This approach reduces commuting needs, creates vibrant neighborhoods, supports local businesses, and fosters community connections while making more efficient use of land and infrastructure.', 
        correctHeadingId: 'h5' 
      },
    ],
    headings: [
      { id: 'h1', text: 'The Challenge of Modern Urban Planning' },
      { id: 'h2', text: 'Efficient Public Transportation Systems' },
      { id: 'h3', text: 'The Importance of Urban Green Spaces' },
      { id: 'h4', text: 'Energy-Efficient Building Design' },
      { id: 'h5', text: 'Benefits of Mixed-Use Development' },
      { id: 'h6', text: 'Water Conservation Strategies' }, // Distractor heading
    ],
    questions: [],
    authorId: "user3",
    authorName: "Mark Johnson",
    isPublic: true,
    createdAt: "2023-10-03T11:45:00",
    updatedAt: "2023-10-05T09:30:00",
  },
  {
    id: "qs5",
    title: "Company Email: Upcoming Training",
    part: 1,
    type: "reading",
    level: "B1",
    passageText: "Dear Team,\n\nI would like to [1] you about our upcoming training session on effective communication. This session will [2] on developing essential skills for workplace interactions. The training is [3] for all team members, regardless of your current role.\n\nPlease [4] your attendance by Friday. This will help us [5] that we have adequate materials for everyone.\n\nBest regards,\nHR Department",
    questions: [
      { 
        id: "q5-1", 
        text: "Gap 1", 
        options: {
          A: "remind",
          B: "repeat",
          C: "relate",
          D: "recall"
        },
        answer: "A"
      },
      { 
        id: "q5-2", 
        text: "Gap 2", 
        options: {
          A: "focus",
          B: "feature",
          C: "fasten",
          D: "function"
        },
        answer: "A"
      },
      { 
        id: "q5-3", 
        text: "Gap 3", 
        options: {
          A: "essential",
          B: "extra",
          C: "easy",
          D: "effective"
        },
        answer: "A"
      },
      { 
        id: "q5-4", 
        text: "Gap 4", 
        options: {
          A: "confirm",
          B: "commit",
          C: "contact",
          D: "complete"
        },
        answer: "A"
      },
      { 
        id: "q5-5", 
        text: "Gap 5", 
        options: {
          A: "ensure",
          B: "enable",
          C: "enact",
          D: "establish"
        },
        answer: "A"
      },
    ],
    authorId: "user1",
    authorName: "Current Teacher",
    isPublic: true,
    createdAt: "2023-11-01T10:00:00",
    updatedAt: "2023-11-01T10:00:00",
  },
  {
    id: "qs6",
    title: "The Process of Photosynthesis",
    part: 2,
    source: 'official',
    type: "reading",
    level: "B1",
    passageText: JSON.stringify([
      { id: 's1', text: 'Photosynthesis is the process plants use to convert light energy into chemical energy.', isExample: true },
      { id: 's2', text: 'First, the plant absorbs sunlight through chlorophyll in its leaves.', isExample: false },
      { id: 's3', text: 'Simultaneously, it takes in carbon dioxide from the air and water from the soil.', isExample: false },
      { id: 's4', text: 'The light energy then drives a chemical reaction that converts these ingredients into glucose, a type of sugar.', isExample: false },
      { id: 's5', text: 'This glucose provides the energy the plant needs to grow and function.', isExample: false },
      { id: 's6', text: 'As a byproduct of this process, the plant releases oxygen into the atmosphere.', isExample: false },
    ]),
    questions: [],
    authorId: "user2",
    authorName: "Jane Smith",
    isPublic: true,
    createdAt: "2023-11-05T15:00:00",
    updatedAt: "2023-11-05T15:00:00",
  },
  {
    id: "qs7",
    title: "Four Friends Discuss Their Dream Job",
    part: 3,
    type: "reading",
    passages: [
      {
        id: 'pA',
        person: 'A',
        text: "I've always wanted to be a doctor. The idea of helping people and making a real difference in their lives is what drives me. It's a long road, with years of study and training, but I think the challenge would be incredibly rewarding. I'm fascinated by human biology and the complexities of medicine."
      },
      {
        id: 'pB',
        person: 'B',
        text: "My dream is to be a travel writer. I want to explore the world, experience different cultures, and share my adventures with others. I'm not looking for a huge salary; I just want a life filled with new experiences. The freedom of being on the road and the creativity of writing would be perfect for me."
      },
      {
        id: 'pC',
        person: 'C',
        text: "I'm very analytical and love numbers, so becoming a financial analyst seems like a natural fit. I enjoy tracking market trends and making strategic investments. The idea of managing a large portfolio and helping a company grow its assets is really appealing. It's a high-pressure environment, but I thrive on that."
      },
      {
        id: 'pD',
        person: 'D',
        text: "I'd love to own a small, independent bookstore. I'm passionate about literature and creating a cozy, welcoming space for the community. It wouldn't be about making a fortune, but about fostering a love of reading and connecting with people who share that passion. It would be a quiet, fulfilling life."
      }
    ],
    questions: [
      { id: "q7-1", text: "wants a job that involves a lot of travel?", options: [], correctPerson: 'B' },
      { id: "q7-2", text: "is motivated by helping others?", options: [], correctPerson: 'A' },
      { id: "q7-3", text: "wants a quiet and community-focused career?", options: [], correctPerson: 'D' },
      { id: "q7-4", text: "is interested in a high-stakes, analytical role?", options: [], correctPerson: 'C' },
      { id: "q7-5", text: "values experience over money?", options: [], correctPerson: 'B' },
      { id: "q7-6", text: "is passionate about science and the human body?", options: [], correctPerson: 'A' },
      { id: "q7-7", text: "wants to be their own boss?", options: [], correctPerson: 'D' }
    ],
    authorId: "user3",
    authorName: "Mark Johnson",
    isPublic: false,
    createdAt: "2023-11-10T12:00:00",
    updatedAt: "2023-11-10T12:00:00",
  }
];

export const mockComments: Comment[] = [
  {
    id: "comment1",
    questionSetId: "qs3",
    authorId: "user1",
    authorName: "Current Teacher",
    text: "Great set of questions! Really challenges critical thinking.",
    createdAt: "2025-05-21T14:30:00Z"
  },
  {
    id: "comment2",
    questionSetId: "qs3",
    authorId: "user3",
    authorName: "Another User",
    text: "Could use more context for some questions.",
    createdAt: "2025-05-22T09:15:00Z"
  }
];
