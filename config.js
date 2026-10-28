// config.eht-full-paper.js
// EHT (Zimbabwe) FULL PAPER — TEACHER-STYLE VIDEO. Portrait 1080x1920.
//
// Per question: 2 short segments  →  LEARN IT (teach the idea, with analogy)
//                                   →  WRITE IT (the exact answer, mark by mark)
// Plus an opening "exam technique" scene and a closing "interview formula" scene.
//
// Design rules (Mayer multimedia principles): narration carries the detail, screen shows
// only a short keyword + tiny hint; each card appears exactly when its sentence starts
// (audioSync), the card being spoken is highlighted and earlier ones dim; short segments;
// conversational tone; dark theme with mixed accent colours; Noto emoji as visuals.
//
// HOW IT'S BUILT: ONE inline HTML template (TEMPLATE) reused for every scene. All content
// arrives through `layer.data` → window.__APEX_DATA__ (ApexCasing convention). Emoji are
// fetched from Iconify (noto set, keyless) at config time and inlined as SVG.
//
// RENDER: all = ~15-20 min of video, heavy on CI. Use parts instead:
//   EHT_PART=1 → intro + Q1-7 | EHT_PART=2 → Q8-14 | EHT_PART=3 → Q15-20 + outro | (unset) = all
//   Run: EHT_PART=1 VIDEO_CONFIG=config.eht-full-paper.js node engine-ci.js
//
// VERIFY BEFORE POSTING (content written from general public-health knowledge):
//   Q2 (Act s.46 wording/list), Q10 (WASHM expansion), Q16 (match your ward/work-plan format),
//   Q19 (district structure), Q17 (how many points your marking scheme wants).

const TEAL = '#00e5a0', AMBER = '#ffcc33', BLUE = '#4dd0ff', PINK = '#ff7ac6', VIOLET = '#b08cff', ORANGE = '#ff9d4d';
const BEAT_COLORS = [TEAL, AMBER, BLUE, PINK, VIOLET, ORANGE];
const BGS = [['#050d14', '#0a2030'], ['#0d0a1a', '#1c1438'], ['#04120f', '#08241f'], ['#140f04', '#241a08'], ['#04101a', '#0a1f33']];

// ── CONTENT ───────────────────────────────────────────────────────────────
// beat = [spoken sentence, short heading, tiny hint, noto emoji name]
const INTRO = {
    tag: 'START HERE', title: 'How To Beat This Paper', hero: 'books', color: TEAL, beats: [
        ["Welcome, I'm your teacher for this paper. We're covering all twenty questions, and I'll teach you each topic, not just hand you answers.", 'All 20 questions', 'Learn first, then write', 'books'],
        ["For every question you'll get two parts. Learn it, so you really understand. Then write it, exactly how it goes on paper.", 'Learn it → Write it', 'Understand, then score', 'light-bulb'],
        ["Golden rule: one mark, one point. Five marks means five clear points, no more, no less.", '1 mark = 1 point', '5 marks → 5 points', 'bullseye'],
        ["To write fast, use a heading, then one short line. Number every point and underline your keywords.", 'Heading + short line', 'Number it, underline it', 'high-voltage'],
        ["And in an interview, same trick. Headline first, then three points, then one real example from the field.", 'Interview formula', 'Headline · 3 points · example', 'speaking-head'],
    ],
};

const OUTRO = {
    tag: 'FINAL TIPS', title: 'Exam And Interview Game Plan', hero: 'trophy', color: AMBER, beats: [
        ["That's the whole paper. Remember, understand first, then structure your answer.", 'Understand → structure', 'You need both', 'brain'],
        ["Split your time by marks. A big mark question deserves more minutes than a small one.", 'Time follows marks', 'Big marks, more minutes', 'stopwatch'],
        ["Start with what you know best, but always leave proper time for the twenty mark work plan.", 'Easy first', 'Save time for the 20', 'trophy'],
        ["In an interview, stay calm. Define it, list your points, then give an example.", 'Define · List · Example', 'Calm and structured', 'handshake'],
        ["Follow for more teaching videos. Good luck, you've got this.", "You've got this", 'Follow for more', 'bell'],
    ],
};

const QS = [
    { n: 1, m: 5, e: 'scroll', t: 'Code Of Conduct (Trainee EHT)',
      learn: [
        ["Let's start with you. A trainee EHT isn't just a student. Every time you step into a community, you represent the Ministry.", "You're the face of health", 'People watch your behaviour', 'busts-in-silhouette'],
        ["A code of conduct is simply the set of rules telling you how to behave at work, so people can trust you.", 'Code of conduct', 'Rules for behaviour at work', 'scroll'],
        ["Trust is everything in this job. Lose it once, and communities stop listening to your health messages.", 'Trust is your tool', 'No trust, no cooperation', 'handshake'],
      ],
      write: [
        ["For five marks, give five points. One, honesty and integrity. Never take bribes, even when someone offers money to ignore a dirty premises.", 'Honesty & integrity', 'No bribes, no favours', 'balance-scale'],
        ["Two, confidentiality. Patient and household information stays within the health team.", 'Confidentiality', 'Keep client info private', 'locked'],
        ["Three, punctuality and reliability. Report on time and complete your assigned duties.", 'Punctual & reliable', 'On time, tasks done', 'alarm-clock'],
        ["Four, respect. Treat colleagues, supervisors and community members politely, whatever their status.", 'Respect for all', 'Colleagues & community', 'folded-hands'],
        ["Five, a professional appearance and discipline. Wear your uniform, stay clean, and follow lawful instructions.", 'Smart & disciplined', 'Uniform, hygiene, orders', 'necktie'],
      ] },
    { n: 2, m: 7, e: 'police-car-light', t: 'Notifiable Diseases',
      learn: [
        ["Picture a fire alarm. Notifiable diseases are public health's fire alarms. You don't deal with them quietly, you raise the alarm.", 'The fire alarm', "Raise it, don't hide it", 'police-car-light'],
        ["Legally, a notifiable disease is one the law says you must report to the health authority within a set time.", 'Notifiable disease', 'Must be reported by law', 'scroll'],
        ["Your question points to the Public Health Act, Chapter fifteen, colon seventeen, section forty six. Always quote the Act in your answer.", 'Quote the Act', 'PHA Cap 15:17, s.46', 'books'],
      ],
      write: [
        ["Start with the definition and the Act. A notifiable disease is one that must by law be reported to the health authority. That's two marks.", 'Definition + Act', 'Reported by law', 'memo'],
        ["Then name five examples, one mark each. Cholera.", 'Cholera', 'Watery diarrhoea outbreaks', 'droplet'],
        ["Anthrax.", 'Anthrax', 'From infected animals', 'cow'],
        ["Measles.", 'Measles', 'Rash, very contagious', 'thermometer'],
        ["Typhoid.", 'Typhoid', 'Dirty food and water', 'fork-and-knife'],
        ["And rabies. That's seven marks.", 'Rabies', 'Dog bites, deadly', 'dog-face'],
      ] },
    { n: 3, m: 5, e: 'school', t: 'Chickenpox At A Primary School',
      learn: [
        ["Chickenpox is caused by a virus called varicella zoster. It spreads through the air and by touching the blister fluid.", 'Varicella zoster virus', 'Air + contact', 'microbe'],
        ["Now imagine eight hundred children in one school. One child has it. Without action, half the school is itching within two weeks.", 'One case → outbreak', 'Schools spread fast', 'school'],
        ["So the golden rule is simple. Find early, separate, and educate.", 'Find · Separate · Educate', 'Your three moves', 'eyes'],
      ],
      write: [
        ["One, isolate the sick child at home until all blisters have crusted over, usually about five days after the rash starts.", 'Isolate cases', 'Until blisters crust', 'house'],
        ["Two, inform the head teacher and report to the district so surveillance can begin.", 'Notify & report', 'Head + district health', 'megaphone'],
        ["Three, screen the other pupils and check classrooms every day for new cases.", 'Daily screening', 'Spot new cases early', 'magnifying-glass-tilted-left'],
        ["Four, hygiene education. Handwashing with soap, covering coughs, and not sharing items.", 'Hygiene education', 'Soap, cough etiquette', 'soap'],
        ["Five, advise on care. Rest, fluids, short nails, and no aspirin for children. Refer severe cases to the clinic.", 'Care & refer', 'Fluids, nails short, clinic', 'adhesive-bandage'],
      ] },
    { n: 4, m: 5, e: 'lungs', t: 'TB Health Education At Household Level',
      learn: [
        ["Tuberculosis is a bacterial infection, mostly of the lungs. It spreads through the air when someone coughs.", 'TB spreads by air', 'Cough, sneeze, spit', 'lungs'],
        ["Homes are where TB spreads most, because families share small, closed rooms for hours.", 'Homes are hotspots', 'Shared air, crowded rooms', 'house'],
        ["Your job isn't to treat. It's to teach families to spot it, test early, and finish treatment.", 'You educate', 'Spot · test · finish', 'books'],
      ],
      write: [
        ["One, teach the signs. A cough for two weeks or more, night sweats, weight loss and fever.", 'Know the signs', 'Cough 2+ weeks', 'face-with-thermometer'],
        ["Two, urge anyone with signs to get tested at the clinic, and to take an H.I.V. test too.", 'Test early', 'Clinic + H.I.V. test', 'microscope'],
        ["Three, stress full treatment. Six months, every single dose, or the TB comes back stronger.", 'Finish treatment', '6 months, no gaps', 'pill'],
        ["Four, cough etiquette and ventilation. Open windows, cover coughs, and let the sunshine in.", 'Air & sunlight', 'Open windows, cover cough', 'window'],
        ["Five, screen household contacts, especially children, encourage good nutrition, and fight stigma.", 'Screen contacts', 'Eat well, no stigma', 'busts-in-silhouette'],
      ] },
    { n: 5, m: 5, e: 'bug', t: 'Prevent And Control Scabies',
      learn: [
        ["Scabies is caused by a tiny mite that burrows under the skin. The itching, worse at night, drives people mad.", 'Mite under the skin', 'Itchy, worse at night', 'bug'],
        ["It spreads through close skin contact and shared clothes or bedding, so crowded places suffer most.", 'Spreads by contact', 'Crowding makes it worse', 'handshake'],
        ["Key idea. Treat everyone close to the patient at the same time, or it just bounces back.", 'Treat everyone together', 'Or it returns', 'repeat-button'],
      ],
      write: [
        ["One, treat the case and all close contacts at the same time, using prescribed medicine such as permethrin cream.", 'Treat case + contacts', 'Same time, prescribed', 'pill'],
        ["Two, wash clothes and bedding in hot water, then dry them in the sun.", 'Wash hot, dry in sun', 'Kills the mites', 'sun'],
        ["Three, improve personal hygiene. Bathe regularly with soap and clean water.", 'Personal hygiene', 'Soap + clean water', 'shower'],
        ["Four, don't share clothes, towels or beds, and reduce overcrowding.", 'No sharing', 'Clothes, towels, beds', 'bed'],
        ["Five, educate the community and refer severe or infected sores.", 'Educate & refer', 'Early treatment', 'speaking-head'],
      ] },
    { n: 6, m: 5, e: 'eyes', t: 'Define Disease Surveillance',
      learn: [
        ["Think of a security camera that never sleeps. That's surveillance. Always watching, always recording.", 'The 24/7 camera', 'Always watching', 'eyes'],
        ["Formally, it's the ongoing, systematic collection, analysis and interpretation of health data, followed by action.", 'Definition', 'Collect · analyse · act', 'memo'],
        ["Why bother? Because spotting a small rise in cases early lets you stop a big outbreak.", 'Early warning', 'Small rise, act now', 'police-car-light'],
      ],
      write: [
        ["Define it first. The continuous, systematic collection, analysis and interpretation of health data, used for action. That's your definition marks.", 'Definition', 'Ongoing, systematic', 'memo'],
        ["Then show the cycle. Collect data from clinics every week.", 'Collect', 'Clinic reports', 'clipboard'],
        ["Analyse it, using tables and graphs to spot trends.", 'Analyse', 'Tables, graphs', 'bar-chart'],
        ["Interpret what the trends mean, and act. Investigate and control.", 'Interpret & act', 'Respond fast', 'high-voltage'],
      ] },
    { n: 7, m: 5, e: 'detective', t: 'Define Disease Investigation',
      learn: [
        ["If surveillance is the camera, investigation is the detective. It begins when something suspicious happens.", 'The detective', 'Called in on a signal', 'detective'],
        ["Disease investigation is the systematic process of finding the cause, source and spread of a disease, so you can control it.", 'Definition', 'Cause · source · spread', 'memo'],
        ["Unlike surveillance, it has a start and an end. You open the case, solve it, then close it.", 'Start to end', 'Case opened, closed', 'chequered-flag'],
      ],
      write: [
        ["Define it. The process of finding the cause, source and mode of spread of a disease, in order to control it.", 'Definition', 'Cause, source, spread', 'memo'],
        ["Step one, confirm the diagnosis, and confirm there's really an outbreak.", 'Confirm', 'Diagnosis + outbreak', 'test-tube'],
        ["Step two, find the cases and interview them. Who, where, when.", 'Find & interview', 'Who, where, when', 'busts-in-silhouette'],
        ["Step three, trace the source. Then apply control measures, and report.", 'Trace the source', 'Then control + report', 'round-pushpin'],
      ] },
    { n: 8, m: 6, e: 'mosquito', t: 'Parasites And Pests Of Public Health Importance',
      learn: [
        ["A parasite lives on or inside another living thing and feeds from it. Think of an uninvited guest eating your food.", 'Parasite', 'Lives on a host', 'microbe'],
        ["A pest is an animal that harms health, spoils food or carries disease. Mostly insects and rodents.", 'Pest', 'Harms health, spoils food', 'rat'],
        ["Public health importance means they make people sick, so they're your targets for control.", 'Why they matter', 'They carry disease', 'warning'],
      ],
      write: [
        ["Parasite one, Plasmodium, the malaria parasite.", 'Plasmodium', 'Malaria', 'microbe'],
        ["Parasite two, Schistosoma, which causes bilharzia.", 'Schistosoma', 'Bilharzia', 'snail'],
        ["Parasite three, Ascaris, the roundworm.", 'Ascaris', 'Roundworm', 'worm'],
        ["Pest one, the mosquito, which carries malaria.", 'Mosquito', 'Malaria vector', 'mosquito'],
        ["Pest two, the housefly, which spreads diarrhoeal diseases.", 'Housefly', 'Spreads diarrhoea', 'fly'],
        ["Pest three, rats, which spread plague and leptospirosis.", 'Rats', 'Plague, leptospirosis', 'rat'],
      ] },
    { n: 9, m: 5, e: 'chart-increasing', t: 'Monitor Disease Trends At A Health Facility',
      learn: [
        ["A disease trend is how the number of cases moves over time. Going up, going down, or staying flat.", 'Disease trend', 'Cases over time', 'chart-increasing'],
        ["At a clinic, the records already hold the story. Your job is to read it before the outbreak starts shouting.", 'Records tell the story', 'Read them early', 'books'],
        ["Think weather forecast. You watch the pattern so you can warn people before the storm.", 'Forecast the storm', 'Warn early', 'cloud-with-lightning'],
      ],
      write: [
        ["One, collect data from registers and weekly disease reports.", 'Collect data', 'Registers, weekly forms', 'clipboard'],
        ["Two, tally and compile it by disease, age, place and week.", 'Compile', 'Disease, age, place, week', 'spiral-notepad'],
        ["Three, analyse using graphs, and compare with previous weeks.", 'Analyse with graphs', 'Compare past weeks', 'bar-chart'],
        ["Four, interpret and act. Rising cases mean investigate, and report to the district.", 'Interpret & act', 'Rising? Investigate', 'high-voltage'],
        ["Five, give feedback to staff and keep the records safe.", 'Feedback & records', 'Share and file', 'file-folder'],
      ] },
    { n: 10, m: 5, e: 'droplet', t: 'WASHM',
      learn: [
        ["Here's the big idea. Most diarrhoeal disease comes from three gaps. Unsafe water, poor toilets, and unwashed hands.", 'Three gaps', 'Water · toilets · hands', 'droplet'],
        ["Fix those three, and cholera, typhoid and worms drop dramatically.", 'Fix 3, fewer diseases', 'Cholera, typhoid, worms', 'shield'],
        ["WASHM is the package that fixes them together, and keeps the services running.", 'WASHM is the package', 'Services that last', 'package'],
      ],
      write: [
        ["Write the full form first. Water, Sanitation and Hygiene Management. Then explain each part.", 'Full form first', 'WASHM in words', 'memo'],
        ["W is water. A safe water supply for drinking and cooking.", 'W: Water', 'Safe supply', 'potable-water'],
        ["S is sanitation. Toilets, and safe disposal of waste and wastewater.", 'S: Sanitation', 'Toilets, waste disposal', 'toilet'],
        ["H is hygiene. Especially handwashing with soap at critical times.", 'H: Hygiene', 'Handwashing with soap', 'soap'],
        ["M is management. Committees, repairs and community ownership keep services working.", 'M: Management', 'Committees, repairs', 'hammer-and-wrench'],
      ] },
    { n: 11, m: 5, e: 'potable-water', t: 'Monitor Water Supply Facilities In A Ward',
      learn: [
        ["A water supply facility is any source people drink from. A borehole, a protected well, a tap, or a piped scheme.", 'Water facilities', 'Borehole, well, tap', 'potable-water'],
        ["In a ward, many families depend on just a few water points. If one fails or gets contaminated, hundreds are at risk.", 'Few points, many users', 'One failure hits many', 'busts-in-silhouette'],
        ["Monitoring means checking them regularly, not only when someone complains.", 'Check regularly', 'Not just on complaints', 'calendar'],
      ],
      write: [
        ["One, list and map every water point in the ward, and record who uses it.", 'Map all water points', 'Register + users', 'world-map'],
        ["Two, inspect each one. Is it working? Is it clean, and protected from animals and latrines?", 'Inspect condition', 'Working, clean, protected', 'magnifying-glass-tilted-left'],
        ["Three, check the surroundings. Drainage, fencing, and a safe distance from toilets.", 'Check surroundings', 'Drainage, fence, distance', 'fence'],
        ["Four, work with water point committees to repair faults quickly.", 'Committees repair', 'Fix faults fast', 'hammer-and-wrench'],
        ["Five, keep records, and report problems to the district.", 'Record & report', 'Findings to district', 'memo'],
      ] },
    { n: 12, m: 5, e: 'test-tube', t: 'Monitor Water Quality In A Ward',
      learn: [
        ["Water can look perfectly clear and still carry germs, so you can't judge safety by eye.", 'Clear is not safe', 'Germs are invisible', 'eyes'],
        ["Water quality has three sides. Physical, chemical and bacteriological.", 'Three qualities', 'Physical · chemical · germs', 'test-tube'],
        ["The main germ test looks for E coli, which shows that faeces got into the water.", 'E coli test', 'Faeces means danger', 'microbe'],
      ],
      write: [
        ["One, do sanitary inspections of every source to find contamination risks.", 'Sanitary inspection', 'Find the risks', 'magnifying-glass-tilted-left'],
        ["Two, collect samples carefully in sterile bottles, label them, and send them to the lab.", 'Sample properly', 'Sterile, labelled', 'test-tube'],
        ["Three, test on site for chlorine and cloudiness, and compare results with the standards.", 'Test & compare', 'Chlorine, turbidity', 'straight-ruler'],
        ["Four, if it's unsafe, disinfect with chlorine, and educate households on boiling and safe storage.", 'Treat & educate', 'Chlorinate, boil, store', 'fire'],
        ["Five, record and report all results.", 'Record & report', 'Results on file', 'memo'],
      ] },
    { n: 13, m: 5, e: 'shower', t: 'Personal Hygiene',
      learn: [
        ["Personal hygiene is how you keep your own body clean, to stay healthy and avoid spreading germs.", 'Personal hygiene', 'Clean body, fewer germs', 'shower'],
        ["As an EHT, you're a role model. If you preach handwashing with dirty hands, nobody listens.", 'Be the example', 'Practise what you teach', 'star'],
        ["Every handwash is a small shield, protecting you and everyone you meet.", 'Handwash is a shield', 'Protects everyone', 'shield'],
      ],
      write: [
        ["One, handwashing with soap after using the toilet and before eating or preparing food.", 'Handwashing', 'After toilet, before food', 'soap'],
        ["Two, bathing regularly and keeping clothes clean.", 'Bath & clean clothes', 'Every day', 'shower'],
        ["Three, oral hygiene. Brush your teeth twice a day.", 'Oral hygiene', 'Brush twice daily', 'tooth'],
        ["Four, keep nails short and clean, and hair neat.", 'Nails & hair', 'Short and clean', 'scissors'],
        ["Five, cover coughs and sneezes, and keep any wounds covered.", 'Cough etiquette', 'Cover coughs, wounds', 'face-with-medical-mask'],
      ] },
    { n: 14, m: 5, e: 'hospital', t: 'Five Hygiene Enabling Facilities At A Health Centre',
      learn: [
        ["Hygiene enabling facilities are the physical things that make good hygiene possible. You can't wash hands without water and soap.", 'Enablers', 'No tools, no hygiene', 'hammer-and-wrench'],
        ["A health centre is where sick people gather, so a missing facility here spreads disease fast.", 'Clinics are high risk', 'Sick people gather', 'hospital'],
        ["Think of it as water in, waste out, hands clean.", 'Water in, waste out', 'Hands clean', 'droplet'],
      ],
      write: [
        ["One, a safe water supply.", 'Safe water supply', 'Tap or borehole', 'potable-water'],
        ["Two, toilets or latrines, separate for males and females, and accessible for disabled users.", 'Toilets', 'Separate, accessible', 'toilet'],
        ["Three, handwashing stations with soap, at toilets and care points.", 'Handwashing stations', 'Water + soap', 'soap'],
        ["Four, waste management. Bins, sharps boxes, a placenta pit and an incinerator.", 'Waste disposal', 'Bins, sharps, incinerator', 'wastebasket'],
        ["Five, a bathing area and a laundry area.", 'Bathing & laundry', 'Clean linen', 'shower'],
      ] },
    { n: 15, m: 5, e: 'magnifying-glass-tilted-left', t: 'Importance Of Premises Inspection',
      learn: [
        ["A premises is any building or land people use. Homes, shops, schools, restaurants, clinics.", 'Premises', 'Buildings and land', 'house'],
        ["Inspection means checking them against the law and health standards, before problems turn into outbreaks.", 'Inspect to prevent', 'Check before outbreak', 'magnifying-glass-tilted-left'],
        ["It's prevention. It's cheaper to fix a blocked drain than to treat a cholera outbreak.", 'Prevention is cheaper', 'Drain vs outbreak', 'money-bag'],
      ],
      write: [
        ["One, it prevents disease by finding hazards early.", 'Prevents disease', 'Hazards found early', 'shield'],
        ["Two, it ensures compliance with health laws and by-laws.", 'Ensures compliance', 'Laws and by-laws', 'balance-scale'],
        ["Three, it protects the public, especially customers and workers.", 'Protects the public', 'Customers, workers', 'busts-in-silhouette'],
        ["Four, it gives you a chance to educate owners and occupiers.", 'Educates owners', 'Advice on site', 'speaking-head'],
        ["Five, it provides records for licensing, enforcement and planning.", 'Records & enforcement', 'Licences, notices', 'memo'],
      ] },
    { n: 16, m: 20, e: 'calendar', t: 'Four-Week Work Plan',
      learn: [
        ["This is the big one. Twenty marks, so give it time. A work plan is a schedule of what you'll do, when, with what, and why.", 'Work plan', 'What · when · why', 'calendar'],
        ["The examiner wants a table, not an essay. Columns for week, activity, objective, resources and responsible person.", 'Use a table', 'Week · activity · aim', 'clipboard'],
        ["Plan around your ward's real problems. Water, sanitation, food, disease surveillance and health education.", 'Plan around real needs', 'Water, food, disease', 'compass'],
      ],
      write: [
        ["Draw the table first, with a title. Ward work plan, four weeks, and your name.", 'Draw the table', 'Title + columns', 'triangular-ruler'],
        ["Week one, orientation. Meet leaders, profile the ward, and map water points and premises.", 'Week 1: Profile', 'Meet leaders, map ward', 'world-map'],
        ["Week two, water and sanitation. Sample water, inspect latrines, and hold health talks.", 'Week 2: WASH', 'Water, toilets, talks', 'droplet'],
        ["Week three, food and premises. Inspect food outlets, schools and the abattoir, plus vector control.", 'Week 3: Premises', 'Food, schools, meat', 'fork-and-knife'],
        ["Week four, surveillance and reporting. Review disease data, follow up cases, and write the monthly report.", 'Week 4: Surveillance', 'Data, follow-up, report', 'bar-chart'],
        ["Tip. Fill every column, and use action verbs like inspect, sample and educate. Each completed week earns marks.", 'Fill every column', 'Action verbs win marks', 'high-voltage'],
      ] },
    { n: 17, m: 3, e: 'green-salad', t: 'Food Quality Monitoring And Foodborne Illnesses',
      learn: [
        ["Food can carry germs from farm to fork. Monitoring food quality means checking it's safe at every step.", 'Farm to fork', 'Check every step', 'green-salad'],
        ["Most food poisoning comes from dirty hands, unsafe water, and food kept at the wrong temperature.", 'Three causes', 'Hands, water, temperature', 'thermometer'],
        ["So you check three things. The people, the place, and the product.", 'People · Place · Product', 'Your 3 checks', 'magnifying-glass-tilted-left'],
      ],
      write: [
        ["Monitor by inspecting premises for cleanliness and proper storage.", 'Inspect premises', 'Clean, stored well', 'house'],
        ["Check food handlers. Medical certificates, clean uniforms, and handwashing.", 'Check food handlers', 'Medicals, hygiene', 'cook'],
        ["Take samples to the lab, and check labels and expiry dates.", 'Sample & check dates', 'Lab tests, expiry', 'test-tube'],
        ["Three foodborne illnesses. Cholera, typhoid, and salmonella food poisoning.", 'Cholera · Typhoid · Salmonella', 'Foodborne illnesses', 'microbe'],
      ] },
    { n: 18, m: 5, e: 'cut-of-meat', t: 'Importance Of Meat Inspection',
      learn: [
        ["Meat inspection means checking animals before slaughter and the carcass after, to make sure the meat is safe.", 'Meat inspection', 'Before and after slaughter', 'cut-of-meat'],
        ["Many animal diseases can jump to humans. We call them zoonoses. Think TB, anthrax and tapeworm cysts.", 'Zoonoses', 'Animal to human disease', 'cow'],
        ["You're the last safety gate between the abattoir and the dinner plate.", 'Last safety gate', 'Abattoir to plate', 'stop-sign'],
      ],
      write: [
        ["One, it detects diseased animals and condemns unfit meat.", 'Detects & condemns', 'Unfit meat removed', 'cross-mark'],
        ["Two, it prevents zoonoses like anthrax, bovine TB and measles tapeworm, also called cysticercosis.", 'Prevents zoonoses', 'Anthrax, TB, tapeworm', 'microbe'],
        ["Three, it protects consumers and ensures wholesome meat.", 'Protects consumers', 'Wholesome meat', 'shield'],
        ["Four, it enforces the law and hygiene standards at abattoirs.", 'Enforces standards', 'Abattoir hygiene', 'balance-scale'],
        ["Five, it protects the livestock industry and trade by keeping disease out of the supply.", 'Protects trade', 'Confidence in meat', 'money-bag'],
      ] },
    { n: 19, m: 5, e: 'busts-in-silhouette', t: 'Environmental Health Organogram (District Level)',
      learn: [
        ["An organogram is a chart showing who reports to whom. Boxes are positions, lines are reporting lines.", 'Organogram', 'Who reports to whom', 'busts-in-silhouette'],
        ["Always start at the top and work downward, one level at a time.", 'Top to bottom', 'One level at a time', 'down-arrow'],
        ["At district level, the District Medical Officer leads the health team, and environmental health sits under that umbrella.", 'DMO leads', 'EH team beneath', 'hospital'],
      ],
      write: [
        ["Top box. The District Medical Officer, head of the district health team.", 'District Medical Officer', 'Head of district', 'health-worker'],
        ["Below that, the District Environmental Health Officer, who manages all environmental health work.", 'District EHO', 'Manages EH services', 'clipboard'],
        ["Next, the Environmental Health Technicians, working at ward and facility level.", 'Environmental Health Technicians', 'Ward-level work', 'toolbox'],
        ["Then assistants and community health workers at the base, closest to households.", 'Assistants & community workers', 'Closest to households', 'busts-in-silhouette'],
        ["Draw neat boxes with arrows, label each one, and add a title.", 'Boxes + arrows + title', 'Neat and labelled', 'triangular-ruler'],
      ] },
    { n: 20, m: 2, e: 'direct-hit', t: 'Abbreviations: EHT And EHO',
      learn: [
        ["Quick one, but easy marks get lost here. Always write the full form, and spell it exactly.", 'Easy marks', 'Spell it exactly', 'direct-hit'],
        ["These two abbreviations name the roles you'll work with every day.", 'Know your roles', 'EHT works under EHO', 'handshake'],
      ],
      write: [
        ["E.H.T. stands for Environmental Health Technician.", 'EHT', 'Environmental Health Technician', 'toolbox'],
        ["E.H.O. stands for Environmental Health Officer.", 'EHO', 'Environmental Health Officer', 'necktie'],
      ] },
];

// ── HTML TEMPLATE (one board, all content from window.__APEX_DATA__) ───────
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:transparent;font-family:Arial,Helvetica,sans-serif;color:#fff}
#top{position:absolute;top:140px;left:60px;right:60px;text-align:center}
.chips{display:flex;gap:14px;justify-content:center;margin-bottom:20px;flex-wrap:wrap}
.chip{padding:10px 26px;border-radius:999px;font-weight:900;letter-spacing:3px;font-size:27px;border:3px solid var(--c);color:var(--c);background:rgba(255,255,255,.05)}
#hero{width:170px;height:170px;margin:0 auto 12px}#hero svg{width:100%;height:100%}
#title{font-size:60px;font-weight:900;line-height:1.1}
#list{position:absolute;left:60px;right:60px;top:575px;height:840px;display:flex;flex-direction:column;gap:16px}
.beat{display:flex;align-items:center;gap:26px;padding:18px 28px;border-radius:30px;background:rgba(255,255,255,.07);border-left:12px solid var(--c);opacity:0;transform:translateY(40px) scale(.97);transition:opacity .45s ease,transform .5s cubic-bezier(.2,.9,.3,1.15),background .3s}
.beat.on{opacity:.5;transform:none}
.beat.cur{opacity:1;background:rgba(255,255,255,.14);box-shadow:0 0 50px -14px var(--c)}
.em{width:100px;height:100px;flex:none}.em svg{width:100%;height:100%}
.num{width:100px;height:100px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:52px;font-weight:900;background:var(--c);color:#06121c}
.h{font-size:46px;font-weight:900;color:var(--c);line-height:1.1}.d{font-size:30px;color:#cfdce6;margin-top:6px}
.dense .beat{padding:12px 24px;gap:22px}.dense .em,.dense .num{width:82px;height:82px}.dense .h{font-size:40px}.dense .d{font-size:27px}
#cap{position:absolute;left:60px;right:60px;top:1470px;text-align:center;font-weight:900;font-size:58px;line-height:1.25;text-shadow:0 4px 14px rgba(0,0,0,.95)}
#cap .cur{color:${AMBER}}
`;

function runtime() {
    var D = window.__APEX_DATA__ || { beats: [] };
    var $ = function (id) { return document.getElementById(id); };
    document.documentElement.style.setProperty('--c', D.color || '#00e5a0');
    var chips = [];
    if (D.q) chips.push([D.q, D.color]);
    if (D.marks) chips.push([D.marks, '#ffcc33']);
    if (D.mode) chips.push([D.mode, D.mode === 'LEARN IT' ? '#00e5a0' : '#ffcc33']);
    if (D.tag) chips.push([D.tag, D.color]);
    $('chips').innerHTML = chips.map(function (c) { return '<span class="chip" style="--c:' + c[1] + '">' + c[0] + '</span>'; }).join('');
    $('hero').innerHTML = D.hero || '';
    $('title').textContent = D.title || '';
    if (D.dense) $('list').className = 'dense';
    var beatEls = D.beats.map(function (b, i) {
        var el = document.createElement('div'); el.className = 'beat'; el.style.setProperty('--c', b.c);
        el.innerHTML = (b.svg ? '<div class="em">' + b.svg + '</div>' : '<div class="num">' + (i + 1) + '</div>') +
            '<div><div class="h">' + b.h + '</div><div class="d">' + b.d + '</div></div>';
        $('list').appendChild(el); return el;
    });
    function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
    var inited = false, words = [], cap = $('cap'), lastIdx = -2;
    function init() {
        var A = window.__APEX_AUDIO__ || {}, ws = A.words || [], dur = A.duration || 10;
        words = ws.map(function (w) { return { raw: String(w.word), s: w.start }; });
        beatEls.forEach(function (el, i) {
            var b = D.beats[i], t;
            if (words.length) {
                var idx = Math.min(words.length - 1, Math.round(b.wi * words.length / Math.max(1, D.nTok)));
                t = words[idx].s;
            } else { t = (i / Math.max(1, beatEls.length)) * dur * 0.85; }
            el.__t = t;
        });
        inited = true;
    }
    window.addEventListener('apexframe', function (e) {
        if (!inited) init();
        var t = e.detail.t || 0, last = -1;
        beatEls.forEach(function (el, i) { if (t >= el.__t - 0.05) { el.classList.add('on'); last = i; } else { el.classList.remove('on'); } });
        beatEls.forEach(function (el, i) { if (i === last) el.classList.add('cur'); else el.classList.remove('cur'); });
        if (!words.length || t < words[0].s - 0.05) { if (lastIdx !== -1) { cap.innerHTML = ''; lastIdx = -1; } return; }
        var idx = 0;
        for (var k = 0; k < words.length; k++) { if (words[k].s <= t) idx = k; else break; }
        if (idx === lastIdx) return;
        lastIdx = idx;
        var start = Math.floor(idx / 4) * 4, h = '';
        for (var j = start; j < Math.min(start + 4, words.length); j++) h += '<span class="' + (j === idx ? 'cur' : '') + '">' + words[j].raw + '</span> ';
        cap.innerHTML = h;
    });
    document.body.setAttribute('data-ready', '1');
}

const TEMPLATE = `<style>${CSS}</style>
<div id="top"><div class="chips" id="chips"></div><div id="hero"></div><div id="title"></div></div>
<div id="list"></div><div id="cap"></div>
<script>(${runtime.toString()})();</script>`;

// ── Emoji (Iconify noto set, keyless). Failure → card falls back to a number badge ──
const SVG = {};
async function loadEmoji(names) {
    const list = [...names];
    for (let i = 0; i < list.length; i += 12) {
        await Promise.all(list.slice(i, i + 12).map(async (n) => {
            try {
                const r = await fetch(`https://api.iconify.design/noto/${n}.svg`, { signal: AbortSignal.timeout(15000) });
                const t = r.ok ? await r.text() : '';
                SVG[n] = t.includes('<svg') ? t : '';
            } catch (_) { SVG[n] = ''; }
            if (!SVG[n]) console.log(`[EHT] emoji missing: ${n}`);
        }));
    }
}

// ── Scene factory ─────────────────────────────────────────────────────────
function makeScene(spec, bgIdx, transition) {
    const narration = spec.beats.map((b) => b[0]).join(' ');
    let wi = 0;
    const beats = spec.beats.map((b, i) => {
        const o = { wi, h: b[1], d: b[2], svg: SVG[b[3]] || '', c: BEAT_COLORS[i % BEAT_COLORS.length] };
        wi += b[0].split(/\s+/).filter(Boolean).length;
        return o;
    });
    const data = {
        q: spec.q || '', marks: spec.marks || '', mode: spec.mode || '', tag: spec.tag || '',
        color: spec.color, title: spec.title, hero: SVG[spec.hero] || '', beats, nTok: wi, dense: beats.length >= 5,
    };
    const [a, b] = BGS[bgIdx % BGS.length];
    return {
        transition,
        tts: { text: narration, voice: 'am_adam', pauseAfter: 0.5 },
        captions: false,
        layers: [
            { type: 'gradient', gradientType: 'linear', colors: [a, b], angle: 160 },
            {
                type: 'html-record', html: TEMPLATE, data, audioSync: true, cursor: false, fps: 24,
                viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                waitFor: '[data-ready="1"]',
            },
        ],
    };
}

const PARTS = { '1': [1, 7], '2': [8, 14], '3': [15, 20] };

module.exports = async () => {
    const part = String(process.env.EHT_PART || 'all').toLowerCase();
    const range = PARTS[part];
    const qs = QS.filter((q) => !range || (q.n >= range[0] && q.n <= range[1]));
    const withIntro = part === 'all' || part === '1';
    const withOutro = part === 'all' || part === '3';

    const names = new Set();
    const grab = (spec) => { names.add(spec.hero || spec.e); spec.beats && spec.beats.forEach((b) => names.add(b[3])); };
    if (withIntro) grab(INTRO);
    if (withOutro) grab(OUTRO);
    qs.forEach((q) => { names.add(q.e); q.learn.concat(q.write).forEach((b) => names.add(b[3])); });
    names.delete(undefined);
    await loadEmoji(names);

    const scenes = [];
    if (withIntro) scenes.push(makeScene({ ...INTRO, mode: '', q: '' }, 0, 'fade'));
    qs.forEach((q, i) => {
        const base = { q: `Q${q.n}`, marks: `${q.m} MARKS`, title: q.t, hero: q.e };
        scenes.push(makeScene({ ...base, mode: 'LEARN IT', color: TEAL, beats: q.learn }, q.n, 'slide-left'));
        scenes.push(makeScene({ ...base, mode: 'WRITE IT', color: AMBER, beats: q.write }, q.n + 1, 'fade'));
    });
    if (withOutro) scenes.push(makeScene({ ...OUTRO }, 1, 'zoom-in'));

    const words = scenes.reduce((n, s) => n + s.tts.text.split(/\s+/).length, 0);
    console.log(`[EHT] part=${part} scenes=${scenes.length} words=${words} (~${(words / 165).toFixed(1)} min of narration)`);

    return {
        output: {
            title: `eht-full-paper-${part}`, format: 'portrait', fps: 24, crf: 24, preset: 'fast',
            postProcess: { grain: true, grainStrength: 0.015, vignette: true, vignetteStrength: 0.35 },
        },
        defaults: { voice: 'am_adam', transition: 'fade', transitionDuration: 0.3 },
        scenes,
    };
};
