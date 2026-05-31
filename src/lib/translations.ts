// Translations for the chat onboarding flow.
// Languages: English, Hindi (Devanagari), Hinglish (Roman-script Hindi),
// Tamil, Telugu, Marathi, Bengali, Gujarati.
//
// Numbers (₹50L, ₹1 Cr, etc.) are kept universal — they're understood in all
// scripts and don't need translation.

export type Language = "en" | "hi" | "hng" | "ta" | "te" | "mr" | "bn" | "gu";

export const LANGUAGES: Array<{ code: Language; nativeName: string; englishName: string }> = [
  { code: "en", nativeName: "English", englishName: "English" },
  { code: "hi", nativeName: "हिंदी", englishName: "Hindi" },
  { code: "hng", nativeName: "Hinglish", englishName: "Hindi (Roman script)" },
  { code: "ta", nativeName: "தமிழ்", englishName: "Tamil" },
  { code: "te", nativeName: "తెలుగు", englishName: "Telugu" },
  { code: "mr", nativeName: "मराठी", englishName: "Marathi" },
  { code: "bn", nativeName: "বাংলা", englishName: "Bengali" },
  { code: "gu", nativeName: "ગુજરાતી", englishName: "Gujarati" },
];

export interface Strings {
  // Picker screen
  pickLanguageTitle: string;
  pickLanguageSubtitle: string;

  // Step intros + questions
  greetingForName: string;
  nameInputPlaceholder: string;
  ageQuestion: (firstName: string) => string;
  ageSuffix: string;
  genderQuestion: string;
  maritalQuestion: string;
  spouseAgeQuestion: string;
  spouseAgeSuffix: string;
  cityQuestion: string;
  corpusQuestion: string;
  otherIncomeQuestion: string;
  desiredIncomeQuestion: string;
  riskQuestion: string;
  healthInsuranceQuestion: string;
  healthCoverQuestion: string;
  liabilitiesQuestion: string;
  epsQuestion: string;
  npsQuestion: string;
  answerNoEPS: string;
  answerNoNPS: string;

  // Funds breakdown
  fundsQuestion: string;
  fundsTotalLabel: string;
  fundPF: string;              fundPFHint: string;
  fundGovScheme: string;       fundGovSchemeHint: string;
  fundLeaveEncashment: string; fundLeaveEncashmentHint: string;
  fundGratuity: string;        fundGratuityHint: string;
  fundNPS: string;             fundNPSHint: string;
  fundSavings: string;         fundSavingsHint: string;

  // Choice option labels
  optMale: string;
  optFemale: string;
  optOther: string;
  optMarried: string;
  optWidowed: string;
  optSingle: string;
  optDivorced: string;
  optCityMetro: string;
  optCityMetroDesc: string;
  optCityTier2: string;
  optCityTier2Desc: string;
  optCityTier3: string;
  optCityTier3Desc: string;
  optRiskConservative: string;
  optRiskConservativeDesc: string;
  optRiskModerate: string;
  optRiskModerateDesc: string;
  optRiskBalanced: string;
  optRiskBalancedDesc: string;
  optHealthYes: string;
  optHealthNo: string;

  // Money / year presets
  presetNone: string;
  yearThisYear: string;
  yearIn2: string;
  yearIn5: string;
  yearIn10: string;
  yearIn15: string;
  amountLabel: string;
  whenLabel: string;
  enterDifferentAmount: string;
  enterAmountPlaceholder: string;
  amountTip: string;

  // Liability category labels
  liabilityWedding: string;
  liabilityEducation: string;
  liabilityTravel: string;
  liabilityRenovation: string;
  liabilityMedical: string;
  liabilityVehicle: string;

  // Buttons
  continueBtn: string;
  skipBtn: string;
  backBtn: string;
  doneBtnEmpty: string;
  doneBtnWithCount: (n: number, plural: boolean) => string;
  liabilityDoneSkip: string;
  liabilityDoneWithCount: (n: number, plural: boolean) => string;

  // Progress + loading
  buildingPlan: (firstName: string) => string;
  justAMoment: string;
  loadingFallback: string;

  // Answer summaries
  answerNoOtherIncome: string;
  answerNoLiabilities: string;
  answerNameSkipped: string;
  answerHealthYes: string;
  answerHealthNo: string;

  // Footer / tip text
  langTipSuffix: string;
}

const en: Strings = {
  pickLanguageTitle: "Namaste! 🙏",
  pickLanguageSubtitle: "Which language is most comfortable for you?\nWe'll continue the whole conversation in that language.",

  greetingForName: "I'm your Retire 360 guide. In a few easy taps, we'll build your retirement plan together.\n\nWhat should I call you?",
  nameInputPlaceholder: "Type your name…",
  ageQuestion: (n) => `${n ? `Lovely to meet you, ${n}! ` : "Lovely! "}How old are you?`,
  ageSuffix: "years old",
  genderQuestion: "And your gender?",
  maritalQuestion: "What is your marital status?",
  spouseAgeQuestion: "How old is your spouse?",
  spouseAgeSuffix: "years",
  cityQuestion: "Where do you live? This helps me estimate your cost of living.",
  corpusQuestion: "Now the important one 💰\n\nHow much money have you saved for retirement in total? (PF + gratuity + any lump sum)",
  otherIncomeQuestion: "Do you get any other money every month — like a pension or house rent?",
  desiredIncomeQuestion: "How much would you like to receive every month to live comfortably?",
  riskQuestion: "How do you feel about your money? Pick what sounds most like you 👇",
  healthInsuranceQuestion: "Do you have health insurance?",
  healthCoverQuestion: "Roughly how much is your health cover (sum insured)?",
  liabilitiesQuestion: "Last one — and this matters a LOT 🎯\n\nAre there any big expenses coming up in retirement? Daughter's wedding, grandkids' education, a foreign trip, home renovation, a medical buffer?\n\nWe'll ring-fence these separately so they NEVER touch your monthly income. Tap each one that applies, pick the amount and when you'll need it. (Skip what doesn't apply.)",

  epsQuestion: "Do you have an EPS pension from your old employer? Roughly how much per month?\n(EPS pension comes from the EPF system — usually ₹3,000–₹10,000/mo for most retirees.)",
  npsQuestion: "Do you have NPS (National Pension System)? Roughly how much is in it?\n(40% goes into a mandatory annuity; the rest stays in your growth bucket. Tap None if you don't have NPS.)",
  answerNoEPS: "No EPS",
  answerNoNPS: "No NPS",
  fundsQuestion: "Now the most important question 💰\n\nLet's build the full picture of where your retirement money is coming from. Tell me roughly how much you have in each of these. This is the basis for your ENTIRE plan, so take a moment.\n\n(Tap a preset chip, or \"Enter a different amount\" to type exactly. Leave it at zero if you don't have that source.)",
  fundsTotalLabel: "Your total corpus",
  fundPF: "PF / EPF / CPF / GPF", fundPFHint: "Provident Fund — your employer-side retirement savings",
  fundGovScheme: "Other govt scheme (CSSS, VRS payout, etc.)", fundGovSchemeHint: "Any other lump sum from a govt or PSU scheme",
  fundLeaveEncashment: "Leave Encashment", fundLeaveEncashmentHint: "Cash from your unused leave at retirement",
  fundGratuity: "Gratuity", fundGratuityHint: "The one-time gratuity from your last employer",
  fundNPS: "NPS (National Pension System)", fundNPSHint: "40% becomes mandatory annuity, rest stays liquid",
  fundSavings: "Existing savings / FDs / mutual funds", fundSavingsHint: "Anything you've already saved on your own — bank, MF, FD",
  optMale: "Male", optFemale: "Female", optOther: "Other",
  optMarried: "Married", optWidowed: "Widowed", optSingle: "Single", optDivorced: "Divorced",
  optCityMetro: "Big city / Metro", optCityMetroDesc: "Mumbai, Delhi, Bengaluru, Chennai…",
  optCityTier2: "Smaller city", optCityTier2Desc: "Pune, Jaipur, Lucknow, Kochi…",
  optCityTier3: "Town / village", optCityTier3Desc: "Smaller towns",
  optRiskConservative: "Safety first", optRiskConservativeDesc: "Keep my money safe, even if I earn a little less. No surprises.",
  optRiskModerate: "A balanced mix", optRiskModerateDesc: "Small ups-and-downs are okay for better returns over time.",
  optRiskBalanced: "Comfortable with growth", optRiskBalancedDesc: "I'm okay with market swings — I want good long-term growth.",
  optHealthYes: "Yes, I do", optHealthNo: "No, not yet",

  presetNone: "No, none",
  yearThisYear: "This year", yearIn2: "In 2 years", yearIn5: "In 5 years", yearIn10: "In 10 years", yearIn15: "In 15 years",
  amountLabel: "How much?", whenLabel: "When?",
  enterDifferentAmount: "✏️ Enter a different amount",
  enterAmountPlaceholder: "Type the amount",
  amountTip: "Tip: you can type like \"50 lakh\" or \"1.5 cr\".",

  liabilityWedding: "Daughter's / Son's wedding",
  liabilityEducation: "Grandchildren's education",
  liabilityTravel: "Foreign trip / world tour",
  liabilityRenovation: "Home renovation",
  liabilityMedical: "Big medical buffer",
  liabilityVehicle: "New car / vehicle",

  continueBtn: "Continue →", skipBtn: "Skip", backBtn: "Back",
  doneBtnEmpty: "Done — see my plan →",
  doneBtnWithCount: (n) => `Done (${n} chosen) →`,
  liabilityDoneSkip: "Skip — see my plan →",
  liabilityDoneWithCount: (n, plural) => `Done — ${n} liabilit${plural ? "ies" : "y"} added · See my plan →`,

  buildingPlan: (n) => (n ? `Building your plan, ${n}…` : "Building your plan…"),
  justAMoment: "Just a moment 🙂",
  loadingFallback: "Loading…",

  answerNoOtherIncome: "No other income",
  answerNoLiabilities: "No big expenses coming up 🙂",
  answerNameSkipped: "Let's keep it simple 🙂",
  answerHealthYes: "Yes, I have insurance",
  answerHealthNo: "No insurance yet",

  langTipSuffix: "",
};

const hi: Strings = {
  pickLanguageTitle: "नमस्ते! 🙏",
  pickLanguageSubtitle: "आपको कौन सी भाषा सबसे आरामदायक लगती है?\nहम पूरी बातचीत उसी भाषा में करेंगे।",

  greetingForName: "मैं आपका Retire 360 गाइड हूँ। कुछ आसान टैप में, हम मिलकर आपकी रिटायरमेंट योजना बनाएंगे।\n\nमैं आपको क्या कहकर बुलाऊं?",
  nameInputPlaceholder: "अपना नाम लिखें…",
  ageQuestion: (n) => `${n ? `आपसे मिलकर खुशी हुई, ${n}! ` : "बहुत अच्छा! "}आपकी उम्र क्या है?`,
  ageSuffix: "साल",
  genderQuestion: "और आपका लिंग?",
  maritalQuestion: "आपकी वैवाहिक स्थिति क्या है?",
  spouseAgeQuestion: "आपके जीवनसाथी की उम्र कितनी है?",
  spouseAgeSuffix: "साल",
  cityQuestion: "आप कहाँ रहते हैं? इससे मुझे आपके खर्च का अंदाज़ा लगाने में मदद मिलेगी।",
  corpusQuestion: "अब सबसे ज़रूरी सवाल 💰\n\nरिटायरमेंट के लिए आपने कुल कितने पैसे बचाए हैं? (PF + ग्रेच्युटी + कोई एकमुश्त राशि)",
  otherIncomeQuestion: "क्या आपको हर महीने और कोई पैसा मिलता है — जैसे पेंशन या मकान का किराया?",
  desiredIncomeQuestion: "आराम से जीने के लिए आप हर महीने कितना पैसा चाहते हैं?",
  riskQuestion: "आप अपने पैसे के बारे में कैसा महसूस करते हैं? जो आपके सबसे करीब लगे, उसे चुनें 👇",
  healthInsuranceQuestion: "क्या आपके पास हेल्थ इंश्योरेंस है?",
  healthCoverQuestion: "लगभग कितना हेल्थ कवर है (सम इंश्योर्ड)?",
  liabilitiesQuestion: "अंतिम सवाल — और यह बहुत ज़रूरी है 🎯\n\nक्या रिटायरमेंट में कोई बड़े खर्चे आने वाले हैं? बेटी की शादी, पोते-पोतियों की पढ़ाई, विदेश यात्रा, घर की मरम्मत, मेडिकल बफर?\n\nइन्हें हम अलग से सुरक्षित रखेंगे ताकि आपकी मासिक आय पर इनका असर न पड़े। जो लागू हो उसे टैप करें, राशि और कब चाहिए वो चुनें। (जो लागू न हो उसे छोड़ दें।)",

  epsQuestion: "क्या आपको पुरानी नौकरी से EPS पेंशन मिलती है? लगभग कितनी प्रति महीना?\n(EPS पेंशन EPF से मिलती है — ज़्यादातर रिटायर लोगों को ₹3,000–₹10,000/मा होती है।)",
  npsQuestion: "क्या आपके पास NPS (नेशनल पेंशन सिस्टम) है? लगभग कितना है उसमें?\n(40% अनिवार्य एन्युइटी में जाता है; बाकी ग्रोथ में रहता है। NPS नहीं है तो 'नहीं' टैप करें।)",
  answerNoEPS: "कोई EPS नहीं",
  answerNoNPS: "कोई NPS नहीं",
  fundsQuestion: "अब सबसे ज़रूरी सवाल 💰\n\nआपका रिटायरमेंट का पैसा कहाँ-कहाँ से आ रहा है, इसकी पूरी तस्वीर बनाते हैं। हर एक में लगभग कितना है, बताइए। यही आपकी पूरी प्लानिंग का आधार है, तो आराम से बताइए।\n\n(कोई प्रीसेट चुनें, या \"अलग राशि डालें\" टैप करें। जो स्रोत नहीं है उसे शून्य ही छोड़ दें।)",
  fundsTotalLabel: "आपका कुल कॉर्पस",
  fundPF: "PF / EPF / CPF / GPF", fundPFHint: "प्रॉविडेंट फंड — कंपनी की तरफ से रिटायरमेंट सेविंग",
  fundGovScheme: "अन्य सरकारी स्कीम (CSSS, VRS आदि)", fundGovSchemeHint: "किसी सरकारी या PSU स्कीम से कोई एकमुश्त राशि",
  fundLeaveEncashment: "लीव एनकैशमेंट", fundLeaveEncashmentHint: "अनुपयोगी छुट्टियों का पैसा रिटायरमेंट पर",
  fundGratuity: "ग्रेच्युटी", fundGratuityHint: "आखिरी नौकरी से एक बार मिली ग्रेच्युटी",
  fundNPS: "NPS (नेशनल पेंशन सिस्टम)", fundNPSHint: "40% अनिवार्य एन्युइटी, बाकी लिक्विड रहता है",
  fundSavings: "मौजूदा बचत / FD / म्यूचुअल फंड", fundSavingsHint: "अपनी पहले से जोड़ी हुई बचत — बैंक, MF, FD",
  optMale: "पुरुष", optFemale: "महिला", optOther: "अन्य",
  optMarried: "विवाहित", optWidowed: "विधवा/विधुर", optSingle: "अविवाहित", optDivorced: "तलाकशुदा",
  optCityMetro: "बड़ा शहर / मेट्रो", optCityMetroDesc: "मुंबई, दिल्ली, बेंगलुरु, चेन्नई…",
  optCityTier2: "छोटा शहर", optCityTier2Desc: "पुणे, जयपुर, लखनऊ, कोच्चि…",
  optCityTier3: "कस्बा / गाँव", optCityTier3Desc: "छोटे कस्बे",
  optRiskConservative: "सुरक्षा सबसे पहले", optRiskConservativeDesc: "मेरा पैसा सुरक्षित रहे, भले ही थोड़ा कम कमाऊं। कोई आश्चर्य नहीं।",
  optRiskModerate: "संतुलित मिश्रण", optRiskModerateDesc: "लंबे समय में बेहतर रिटर्न के लिए छोटे उतार-चढ़ाव ठीक हैं।",
  optRiskBalanced: "विकास के साथ सहज", optRiskBalancedDesc: "मार्केट के उतार-चढ़ाव ठीक हैं — मुझे अच्छी लंबी अवधि की वृद्धि चाहिए।",
  optHealthYes: "हाँ, है", optHealthNo: "नहीं, अभी नहीं",

  presetNone: "नहीं, कुछ नहीं",
  yearThisYear: "इस साल", yearIn2: "2 साल में", yearIn5: "5 साल में", yearIn10: "10 साल में", yearIn15: "15 साल में",
  amountLabel: "कितना?", whenLabel: "कब?",
  enterDifferentAmount: "✏️ अलग राशि डालें",
  enterAmountPlaceholder: "राशि लिखें",
  amountTip: "टिप: आप \"50 लाख\" या \"1.5 करोड़\" भी लिख सकते हैं।",

  liabilityWedding: "बेटी/बेटे की शादी",
  liabilityEducation: "पोते-पोतियों की पढ़ाई",
  liabilityTravel: "विदेश यात्रा / वर्ल्ड टूर",
  liabilityRenovation: "घर की मरम्मत",
  liabilityMedical: "बड़ा मेडिकल बफर",
  liabilityVehicle: "नई कार / गाड़ी",

  continueBtn: "आगे →", skipBtn: "छोड़ें", backBtn: "पीछे",
  doneBtnEmpty: "हो गया — मेरा प्लान दिखाओ →",
  doneBtnWithCount: (n) => `हो गया (${n} चुने गए) →`,
  liabilityDoneSkip: "छोड़ें — मेरा प्लान दिखाओ →",
  liabilityDoneWithCount: (n) => `हो गया — ${n} खर्च जोड़े · मेरा प्लान दिखाओ →`,

  buildingPlan: (n) => (n ? `${n} जी, आपका प्लान बना रहे हैं…` : "आपका प्लान बना रहे हैं…"),
  justAMoment: "एक पल रुकें 🙂",
  loadingFallback: "लोड हो रहा है…",

  answerNoOtherIncome: "और कोई आय नहीं",
  answerNoLiabilities: "कोई बड़े खर्चे नहीं आ रहे 🙂",
  answerNameSkipped: "ठीक है 🙂",
  answerHealthYes: "हाँ, मेरे पास इंश्योरेंस है",
  answerHealthNo: "अभी इंश्योरेंस नहीं",

  langTipSuffix: "",
};

const hng: Strings = {
  pickLanguageTitle: "Namaste! 🙏",
  pickLanguageSubtitle: "Aapko kaun si bhasha sabse comfortable lagti hai?\nHum poori baatcheet usi bhasha mein karenge.",

  greetingForName: "Main aapka Retire 360 guide hun. Kuch aasaan taps mein, hum milkar aapki retirement plan banayenge.\n\nMain aapko kya kehkar bulaun?",
  nameInputPlaceholder: "Apna naam likhein…",
  ageQuestion: (n) => `${n ? `Aapse milkar khushi hui, ${n}! ` : "Bahut accha! "}Aapki umar kya hai?`,
  ageSuffix: "saal",
  genderQuestion: "Aur aapka gender?",
  maritalQuestion: "Aapki marital status kya hai?",
  spouseAgeQuestion: "Aapke jeevansaathi ki umar kitni hai?",
  spouseAgeSuffix: "saal",
  cityQuestion: "Aap kahan rehte hain? Isse mujhe aapke kharche ka andaaza lagane mein madad milegi.",
  corpusQuestion: "Ab sabse zaroori sawaal 💰\n\nRetirement ke liye aapne kul kitne paise bachaye hain? (PF + gratuity + koi ekmusht raashi)",
  otherIncomeQuestion: "Kya aapko har mahine aur koi paisa milta hai — jaise pension ya makaan ka kiraya?",
  desiredIncomeQuestion: "Aaram se jeene ke liye aap har mahine kitna paisa chahte hain?",
  riskQuestion: "Aap apne paise ke baare mein kaisa mehsoos karte hain? Jo aapke sabse kareeb lage, use chunein 👇",
  healthInsuranceQuestion: "Kya aapke paas health insurance hai?",
  healthCoverQuestion: "Lagbhag kitna health cover hai (sum insured)?",
  liabilitiesQuestion: "Aakhri sawaal — aur yeh bahut zaroori hai 🎯\n\nKya retirement mein koi bade kharche aane wale hain? Beti ki shaadi, pote-potiyon ki padhai, foreign trip, ghar ki marammat, medical buffer?\n\nInhe hum alag se safe rakhenge taki aapki monthly income par inka asar na pade. Jo apply ho use tap karein, raashi aur kab chahiye woh chunein. (Jo apply na ho use chhod dein.)",

  epsQuestion: "Kya aapko purani naukri se EPS pension milti hai? Lagbhag kitni per month?\n(EPS pension EPF se milti hai — zyaadatar retirees ko ₹3,000–₹10,000/mo hoti hai.)",
  npsQuestion: "Kya aapke paas NPS (National Pension System) hai? Lagbhag kitna hai usme?\n(40% mandatory annuity mein jaata hai; baaki growth mein rehta hai.)",
  answerNoEPS: "Koi EPS nahi",
  answerNoNPS: "Koi NPS nahi",
  fundsQuestion: "Ab sabse zaroori sawaal 💰\n\nAapka retirement ka paisa kahan-kahan se aa raha hai, iski poori tasveer banate hain. Har ek mein lagbhag kitna hai, bataiye. Yahi aapki poori planning ka aadhar hai, to aaraam se bataiye.\n\n(Koi preset chunein, ya \"Alag raashi daalein\" tap karein. Jo source nahi hai use zero hi chhod dein.)",
  fundsTotalLabel: "Aapka kul corpus",
  fundPF: "PF / EPF / CPF / GPF", fundPFHint: "Provident Fund — company ki taraf se retirement saving",
  fundGovScheme: "Anya govt scheme (CSSS, VRS etc.)", fundGovSchemeHint: "Kisi govt ya PSU scheme se koi ekmusht raashi",
  fundLeaveEncashment: "Leave Encashment", fundLeaveEncashmentHint: "Anupyogi chhuttiyon ka paisa retirement par",
  fundGratuity: "Gratuity", fundGratuityHint: "Aakhri naukri se ek baar mili gratuity",
  fundNPS: "NPS (National Pension System)", fundNPSHint: "40% mandatory annuity, baaki liquid rehta hai",
  fundSavings: "Maujooda savings / FD / mutual funds", fundSavingsHint: "Apni pehle se jodi hui savings — bank, MF, FD",
  optMale: "Purush", optFemale: "Mahila", optOther: "Anya",
  optMarried: "Vivaahit", optWidowed: "Vidhwa/Vidhur", optSingle: "Avivaahit", optDivorced: "Talaakshuda",
  optCityMetro: "Bada sheher / Metro", optCityMetroDesc: "Mumbai, Delhi, Bengaluru, Chennai…",
  optCityTier2: "Chhota sheher", optCityTier2Desc: "Pune, Jaipur, Lucknow, Kochi…",
  optCityTier3: "Kasba / gaon", optCityTier3Desc: "Chhote kasbe",
  optRiskConservative: "Safety pehle", optRiskConservativeDesc: "Mera paisa safe rahe, bhale hi thoda kam kamaun. Koi surprise nahi.",
  optRiskModerate: "Balanced mix", optRiskModerateDesc: "Lambe samay mein behtar returns ke liye chhote ups-and-downs theek hain.",
  optRiskBalanced: "Growth ke saath comfortable", optRiskBalancedDesc: "Market ki ups-downs theek hain — mujhe acchi long-term growth chahiye.",
  optHealthYes: "Haan, hai", optHealthNo: "Nahi, abhi nahi",

  presetNone: "Nahi, kuch nahi",
  yearThisYear: "Is saal", yearIn2: "2 saal mein", yearIn5: "5 saal mein", yearIn10: "10 saal mein", yearIn15: "15 saal mein",
  amountLabel: "Kitna?", whenLabel: "Kab?",
  enterDifferentAmount: "✏️ Alag raashi daalein",
  enterAmountPlaceholder: "Raashi likhein",
  amountTip: "Tip: aap \"50 lakh\" ya \"1.5 cr\" bhi likh sakte hain.",

  liabilityWedding: "Beti/Bete ki shaadi",
  liabilityEducation: "Pote-potiyon ki padhai",
  liabilityTravel: "Foreign trip / world tour",
  liabilityRenovation: "Ghar ki marammat",
  liabilityMedical: "Bada medical buffer",
  liabilityVehicle: "Nayi car / gaadi",

  continueBtn: "Aage →", skipBtn: "Skip", backBtn: "Peeche",
  doneBtnEmpty: "Ho gaya — mera plan dikhao →",
  doneBtnWithCount: (n) => `Ho gaya (${n} chune) →`,
  liabilityDoneSkip: "Skip — mera plan dikhao →",
  liabilityDoneWithCount: (n) => `Ho gaya — ${n} kharche jode · Mera plan dikhao →`,

  buildingPlan: (n) => (n ? `${n} ji, aapka plan bana rahe hain…` : "Aapka plan bana rahe hain…"),
  justAMoment: "Ek pal rukein 🙂",
  loadingFallback: "Load ho raha hai…",

  answerNoOtherIncome: "Aur koi income nahi",
  answerNoLiabilities: "Koi bade kharche nahi aa rahe 🙂",
  answerNameSkipped: "Theek hai 🙂",
  answerHealthYes: "Haan, mere paas insurance hai",
  answerHealthNo: "Abhi insurance nahi",

  langTipSuffix: "",
};

const ta: Strings = {
  pickLanguageTitle: "வணக்கம்! 🙏",
  pickLanguageSubtitle: "உங்களுக்கு எந்த மொழி வசதியாக இருக்கும்?\nநாங்கள் முழு உரையாடலையும் அந்த மொழியில் தொடர்வோம்.",

  greetingForName: "நான் உங்கள் Retire 360 வழிகாட்டி. சில எளிய டாப்களில், நாங்கள் ஒன்றாக உங்கள் ஓய்வூதியத் திட்டத்தை உருவாக்குவோம்.\n\nநான் உங்களை என்ன பெயரில் அழைக்கட்டும்?",
  nameInputPlaceholder: "உங்கள் பெயரை தட்டச்சு செய்யவும்…",
  ageQuestion: (n) => `${n ? `உங்களை சந்தித்ததில் மகிழ்ச்சி, ${n}! ` : "மிக்க மகிழ்ச்சி! "}உங்கள் வயது என்ன?`,
  ageSuffix: "வயது",
  genderQuestion: "மற்றும் உங்கள் பாலினம்?",
  maritalQuestion: "உங்கள் திருமண நிலை என்ன?",
  spouseAgeQuestion: "உங்கள் வாழ்க்கைத் துணையின் வயது என்ன?",
  spouseAgeSuffix: "வயது",
  cityQuestion: "நீங்கள் எங்கு வசிக்கிறீர்கள்? இது உங்கள் வாழ்க்கைச் செலவை மதிப்பிட உதவும்.",
  corpusQuestion: "இப்போது முக்கியமான கேள்வி 💰\n\nஓய்வூதியத்திற்காக நீங்கள் மொத்தம் எவ்வளவு பணம் சேமித்துள்ளீர்கள்? (PF + க்ராட்யூட்டி + எந்த ஒரு தொகை)",
  otherIncomeQuestion: "ஒவ்வொரு மாதமும் உங்களுக்கு வேறு ஏதாவது பணம் வருகிறதா — ஓய்வூதியம் அல்லது வீட்டு வாடகை போல?",
  desiredIncomeQuestion: "வசதியாக வாழ ஒவ்வொரு மாதமும் எவ்வளவு பணம் வேண்டும்?",
  riskQuestion: "உங்கள் பணத்தைப் பற்றி எப்படி உணர்கிறீர்கள்? உங்களுக்கு பொருந்துவதைத் தேர்வு செய்க 👇",
  healthInsuranceQuestion: "உங்களுக்கு மருத்துவ காப்பீடு உள்ளதா?",
  healthCoverQuestion: "சுமார் எவ்வளவு மருத்துவ காப்பீடு (sum insured)?",
  liabilitiesQuestion: "கடைசி கேள்வி — இது மிகவும் முக்கியம் 🎯\n\nஓய்வூதியத்தில் ஏதாவது பெரிய செலவுகள் வரப்போகிறதா? மகள் திருமணம், பேரக்குழந்தைகளின் கல்வி, வெளிநாட்டுப் பயணம், வீட்டு புதுப்பித்தல், மருத்துவ பஃபர்?\n\nஇவற்றை தனியாக பாதுகாப்போம், உங்கள் மாத வருமானத்தைப் பாதிக்காமல். பொருந்துவதைத் தட்டவும், தொகை மற்றும் எப்போது தேவை என்பதைத் தேர்வு செய்யவும். (பொருந்தாதவற்றை விட்டுவிடவும்.)",

  epsQuestion: "உங்கள் பழைய வேலையிலிருந்து EPS ஓய்வூதியம் கிடைக்கிறதா? மாதம் சுமார் எவ்வளவு?\n(EPS ஓய்வூதியம் EPF முறையிலிருந்து கிடைக்கிறது — பெரும்பாலும் ₹3,000–₹10,000/மா.)",
  npsQuestion: "உங்களுக்கு NPS (தேசிய ஓய்வூதியத் திட்டம்) உள்ளதா? சுமார் எவ்வளவு உள்ளது?\n(40% கட்டாய ஆண்டுக் கொடுப்பனவில் செல்கிறது; மற்றவை வளர்ச்சியில் இருக்கும்.)",
  answerNoEPS: "EPS இல்லை",
  answerNoNPS: "NPS இல்லை",
  fundsQuestion: "இப்போது மிக முக்கியமான கேள்வி 💰\n\nஉங்கள் ஓய்வூதியப் பணம் எங்கிருந்து வருகிறது என்பதன் முழுச் சித்திரத்தை உருவாக்குவோம். ஒவ்வொன்றிலும் சுமார் எவ்வளவு உள்ளது என்று சொல்லுங்கள். இதுவே உங்கள் முழு திட்டத்தின் அடிப்படை.\n\n(ஒரு முன்னமைப்பைத் தட்டவும் அல்லது \"வேறு தொகையை உள்ளிடவும்\" தட்டவும். இல்லாத ஆதாரத்தை பூஜ்யமாக விட்டுவிடுங்கள்.)",
  fundsTotalLabel: "உங்கள் மொத்த கார்பஸ்",
  fundPF: "PF / EPF / CPF / GPF", fundPFHint: "ப்ராவிடண்ட் ஃபண்ட் — நிறுவன ஓய்வூதிய சேமிப்பு",
  fundGovScheme: "மற்ற அரசு திட்டம் (CSSS, VRS போன்றவை)", fundGovSchemeHint: "ஏதேனும் அரசு/PSU திட்டத்திலிருந்து ஒரே ஒரு தொகை",
  fundLeaveEncashment: "லீவ் என்காஷ்மென்ட்", fundLeaveEncashmentHint: "பயன்படுத்தாத விடுப்புக்கான பணம்",
  fundGratuity: "க்ராட்யூட்டி", fundGratuityHint: "கடைசி வேலையிலிருந்து ஒரு முறை கிடைக்கும் தொகை",
  fundNPS: "NPS (தேசிய ஓய்வூதியத் திட்டம்)", fundNPSHint: "40% கட்டாய ஆண்டுக் கொடுப்பனவு, மற்றவை திரவ நிலையில்",
  fundSavings: "தற்போதைய சேமிப்பு / FD / மியூச்சுவல் ஃபண்ட்", fundSavingsHint: "நீங்கள் ஏற்கனவே சேமித்தவை — வங்கி, MF, FD",
  optMale: "ஆண்", optFemale: "பெண்", optOther: "மற்றவை",
  optMarried: "திருமணமானவர்", optWidowed: "விதவை", optSingle: "திருமணமாகாதவர்", optDivorced: "விவாகரத்து",
  optCityMetro: "பெரு நகரம் / மெட்ரோ", optCityMetroDesc: "மும்பை, டெல்லி, பெங்களூரு, சென்னை…",
  optCityTier2: "சிறு நகரம்", optCityTier2Desc: "புனே, ஜெய்ப்பூர், லக்னோ, கொச்சி…",
  optCityTier3: "ஊர் / கிராமம்", optCityTier3Desc: "சிறிய ஊர்கள்",
  optRiskConservative: "பாதுகாப்பு முதலில்", optRiskConservativeDesc: "என் பணம் பாதுகாப்பாக இருக்கட்டும், கொஞ்சம் குறைவாக சம்பாதித்தாலும். ஆச்சர்யம் வேண்டாம்.",
  optRiskModerate: "சமநிலையான கலவை", optRiskModerateDesc: "நீண்ட காலத்தில் சிறந்த வருமானத்திற்காக சிறிய மாற்றங்கள் சரி.",
  optRiskBalanced: "வளர்ச்சியுடன் வசதி", optRiskBalancedDesc: "சந்தை மாற்றங்கள் சரி — எனக்கு நீண்ட கால வளர்ச்சி வேண்டும்.",
  optHealthYes: "ஆம், உள்ளது", optHealthNo: "இல்லை, இன்னும் இல்லை",

  presetNone: "இல்லை, ஒன்றும் இல்லை",
  yearThisYear: "இந்த ஆண்டு", yearIn2: "2 ஆண்டுகளில்", yearIn5: "5 ஆண்டுகளில்", yearIn10: "10 ஆண்டுகளில்", yearIn15: "15 ஆண்டுகளில்",
  amountLabel: "எவ்வளவு?", whenLabel: "எப்போது?",
  enterDifferentAmount: "✏️ வேறு தொகையை உள்ளிடவும்",
  enterAmountPlaceholder: "தொகையை தட்டச்சு செய்க",
  amountTip: "உதவி: நீங்கள் \"50 லட்சம்\" அல்லது \"1.5 கோடி\" எனவும் தட்டச்சு செய்யலாம்.",

  liabilityWedding: "மகள்/மகன் திருமணம்",
  liabilityEducation: "பேரக்குழந்தைகளின் கல்வி",
  liabilityTravel: "வெளிநாட்டுப் பயணம் / உலகச் சுற்றுலா",
  liabilityRenovation: "வீட்டு புதுப்பித்தல்",
  liabilityMedical: "பெரிய மருத்துவ பஃபர்",
  liabilityVehicle: "புதிய கார் / வாகனம்",

  continueBtn: "தொடரவும் →", skipBtn: "தவிர்", backBtn: "பின்னால்",
  doneBtnEmpty: "முடிந்தது — என் திட்டத்தைக் காட்டு →",
  doneBtnWithCount: (n) => `முடிந்தது (${n} தேர்ந்தெடுத்தது) →`,
  liabilityDoneSkip: "தவிர் — என் திட்டத்தைக் காட்டு →",
  liabilityDoneWithCount: (n) => `முடிந்தது — ${n} செலவுகள் சேர்க்கப்பட்டன · என் திட்டத்தைக் காட்டு →`,

  buildingPlan: (n) => (n ? `${n}, உங்கள் திட்டத்தை உருவாக்குகிறோம்…` : "உங்கள் திட்டத்தை உருவாக்குகிறோம்…"),
  justAMoment: "ஒரு நிமிடம் காத்திருங்கள் 🙂",
  loadingFallback: "ஏற்றுகிறது…",

  answerNoOtherIncome: "வேறு வருமானம் இல்லை",
  answerNoLiabilities: "பெரிய செலவுகள் ஏதும் இல்லை 🙂",
  answerNameSkipped: "சரி 🙂",
  answerHealthYes: "ஆம், எனக்கு காப்பீடு உள்ளது",
  answerHealthNo: "இன்னும் காப்பீடு இல்லை",

  langTipSuffix: "",
};

const te: Strings = {
  pickLanguageTitle: "నమస్తే! 🙏",
  pickLanguageSubtitle: "మీకు ఏ భాష చాలా సౌకర్యవంతంగా ఉంటుంది?\nమేము మొత్తం సంభాషణను అదే భాషలో కొనసాగిస్తాము.",

  greetingForName: "నేను మీ Retire 360 గైడ్. కొన్ని సులభమైన ట్యాప్‌లలో, మనం కలిసి మీ రిటైర్‌మెంట్ ప్లాన్‌ను తయారు చేస్తాము.\n\nమీని ఏం పిలవాలి?",
  nameInputPlaceholder: "మీ పేరు టైప్ చేయండి…",
  ageQuestion: (n) => `${n ? `మిమ్మల్ని కలవడం సంతోషం, ${n}! ` : "చాలా బాగుంది! "}మీ వయసు ఎంత?`,
  ageSuffix: "ఏళ్ళు",
  genderQuestion: "మరియు మీ లింగం?",
  maritalQuestion: "మీ వైవాహిక స్థితి ఏమిటి?",
  spouseAgeQuestion: "మీ జీవిత భాగస్వామి వయసు ఎంత?",
  spouseAgeSuffix: "ఏళ్ళు",
  cityQuestion: "మీరు ఎక్కడ నివసిస్తారు? ఇది మీ జీవన వ్యయాన్ని అంచనా వేయడానికి సహాయపడుతుంది.",
  corpusQuestion: "ఇప్పుడు ముఖ్యమైన ప్రశ్న 💰\n\nరిటైర్‌మెంట్ కోసం మీరు మొత్తం ఎంత డబ్బు పొదుపు చేశారు? (PF + గ్రాట్యుటీ + ఏదైనా ఏకమొత్త మొత్తం)",
  otherIncomeQuestion: "ప్రతి నెలా మీకు మరే డబ్బు వస్తుందా — పెన్షన్ లేదా ఇంటి అద్దె వంటివి?",
  desiredIncomeQuestion: "సుఖంగా జీవించడానికి మీరు ప్రతి నెలా ఎంత డబ్బు కావాలి?",
  riskQuestion: "మీ డబ్బు గురించి మీకు ఎలా అనిపిస్తుంది? మీకు దగ్గరగా ఉన్నదాన్ని ఎంచుకోండి 👇",
  healthInsuranceQuestion: "మీకు హెల్త్ ఇన్సూరెన్స్ ఉందా?",
  healthCoverQuestion: "సుమారు ఎంత హెల్త్ కవర్ (sum insured)?",
  liabilitiesQuestion: "చివరి ప్రశ్న — ఇది చాలా ముఖ్యమైనది 🎯\n\nరిటైర్‌మెంట్‌లో ఏవైనా పెద్ద ఖర్చులు రాబోతున్నాయా? కూతురు పెళ్లి, మనమల చదువు, విదేశీ ప్రయాణం, ఇంటి మరమ్మత్తు, మెడికల్ బఫర్?\n\nమేము వీటిని విడిగా రక్షిస్తాము, మీ నెలవారీ ఆదాయంపై వీటి ప్రభావం పడకుండా. వర్తించేదాన్ని ట్యాప్ చేయండి, మొత్తం మరియు ఎప్పుడు అవసరమో ఎంచుకోండి. (వర్తించనిదాన్ని వదిలేయండి.)",

  epsQuestion: "మీకు పాత ఉద్యోగం నుండి EPS పెన్షన్ వస్తుందా? నెలకు సుమారు ఎంత?\n(EPS పెన్షన్ EPF సిస్టమ్ నుండి వస్తుంది — చాలామందికి ₹3,000–₹10,000/నె.)",
  npsQuestion: "మీకు NPS (నేషనల్ పెన్షన్ సిస్టమ్) ఉందా? అందులో సుమారు ఎంత ఉంది?\n(40% తప్పనిసరి యాన్యుటీలోకి వెళుతుంది; మిగతాది గ్రోత్‌లో ఉంటుంది.)",
  answerNoEPS: "EPS లేదు",
  answerNoNPS: "NPS లేదు",
  fundsQuestion: "ఇప్పుడు అత్యంత ముఖ్యమైన ప్రశ్న 💰\n\nమీ రిటైర్‌మెంట్ డబ్బు ఎక్కడ నుండి వస్తుందో పూర్తి చిత్రాన్ని తయారు చేద్దాం. ప్రతిదానిలో సుమారు ఎంత ఉంది, చెప్పండి. ఇదే మీ మొత్తం ప్లాన్‌కు ఆధారం.\n\n(ప్రీసెట్ ట్యాప్ చేయండి లేదా \"వేరే మొత్తం ఎంటర్ చేయండి\" ట్యాప్ చేయండి. లేని మూలాన్ని సున్నాగా వదిలేయండి.)",
  fundsTotalLabel: "మీ మొత్తం కార్పస్",
  fundPF: "PF / EPF / CPF / GPF", fundPFHint: "ప్రావిడెంట్ ఫండ్ — యజమాని వైపు రిటైర్‌మెంట్ సేవింగ్",
  fundGovScheme: "ఇతర ప్రభుత్వ స్కీమ్ (CSSS, VRS మొదలైనవి)", fundGovSchemeHint: "ప్రభుత్వ/PSU స్కీమ్ నుండి ఏదైనా ఏకమొత్త మొత్తం",
  fundLeaveEncashment: "లీవ్ ఎన్క్యాష్‌మెంట్", fundLeaveEncashmentHint: "ఉపయోగించని సెలవులకు ఇచ్చే నగదు",
  fundGratuity: "గ్రాట్యుటీ", fundGratuityHint: "చివరి ఉద్యోగం నుండి ఒక్కసారి వచ్చే మొత్తం",
  fundNPS: "NPS (నేషనల్ పెన్షన్ సిస్టమ్)", fundNPSHint: "40% తప్పనిసరి యాన్యుటీ, మిగతాది ద్రవంగా ఉంటుంది",
  fundSavings: "ప్రస్తుత సేవింగ్స్ / FD / మ్యూచువల్ ఫండ్స్", fundSavingsHint: "మీరు ఇప్పటికే పొదుపు చేసినవి — బ్యాంక్, MF, FD",
  optMale: "పురుషుడు", optFemale: "మహిళ", optOther: "ఇతర",
  optMarried: "వివాహితుడు/తురాలు", optWidowed: "విధవ/విధురుడు", optSingle: "అవివాహితుడు/తురాలు", optDivorced: "విడాకులు తీసుకున్న",
  optCityMetro: "పెద్ద నగరం / మెట్రో", optCityMetroDesc: "ముంబై, ఢిల్లీ, బెంగళూరు, చెన్నై…",
  optCityTier2: "చిన్న నగరం", optCityTier2Desc: "పూణె, జైపూర్, లక్నో, కొచ్చి…",
  optCityTier3: "పట్టణం / గ్రామం", optCityTier3Desc: "చిన్న పట్టణాలు",
  optRiskConservative: "మొదట భద్రత", optRiskConservativeDesc: "నా డబ్బు సురక్షితంగా ఉండాలి, కొంచెం తక్కువ సంపాదించినా. ఆశ్చర్యాలు వద్దు.",
  optRiskModerate: "సమతుల్య మిశ్రమం", optRiskModerateDesc: "దీర్ఘకాలంలో మంచి రాబడి కోసం చిన్న హెచ్చు తగ్గులు సరే.",
  optRiskBalanced: "వృద్ధితో సౌకర్యం", optRiskBalancedDesc: "మార్కెట్ హెచ్చు తగ్గులు సరే — నాకు దీర్ఘకాలిక మంచి వృద్ధి కావాలి.",
  optHealthYes: "అవును, ఉంది", optHealthNo: "లేదు, ఇంకా లేదు",

  presetNone: "లేదు, ఏమీ లేదు",
  yearThisYear: "ఈ సంవత్సరం", yearIn2: "2 సంవత్సరాలలో", yearIn5: "5 సంవత్సరాలలో", yearIn10: "10 సంవత్సరాలలో", yearIn15: "15 సంవత్సరాలలో",
  amountLabel: "ఎంత?", whenLabel: "ఎప్పుడు?",
  enterDifferentAmount: "✏️ వేరే మొత్తాన్ని ఎంటర్ చేయండి",
  enterAmountPlaceholder: "మొత్తాన్ని టైప్ చేయండి",
  amountTip: "చిట్కా: మీరు \"50 లక్షలు\" లేదా \"1.5 కోట్లు\" అని కూడా టైప్ చేయవచ్చు.",

  liabilityWedding: "కూతురు/కొడుకు పెళ్లి",
  liabilityEducation: "మనమల చదువు",
  liabilityTravel: "విదేశీ ప్రయాణం / వరల్డ్ టూర్",
  liabilityRenovation: "ఇంటి మరమ్మత్తు",
  liabilityMedical: "పెద్ద మెడికల్ బఫర్",
  liabilityVehicle: "కొత్త కారు / వాహనం",

  continueBtn: "కొనసాగించండి →", skipBtn: "దాటవేయండి", backBtn: "వెనుకకు",
  doneBtnEmpty: "పూర్తి — నా ప్లాన్ చూపించు →",
  doneBtnWithCount: (n) => `పూర్తి (${n} ఎంచుకున్నారు) →`,
  liabilityDoneSkip: "దాటవేయండి — నా ప్లాన్ చూపించు →",
  liabilityDoneWithCount: (n) => `పూర్తి — ${n} ఖర్చులు జోడించబడ్డాయి · నా ప్లాన్ చూపించు →`,

  buildingPlan: (n) => (n ? `${n} గారు, మీ ప్లాన్‌ను తయారు చేస్తున్నాము…` : "మీ ప్లాన్‌ను తయారు చేస్తున్నాము…"),
  justAMoment: "ఒక క్షణం 🙂",
  loadingFallback: "లోడ్ అవుతోంది…",

  answerNoOtherIncome: "మరే ఆదాయం లేదు",
  answerNoLiabilities: "పెద్ద ఖర్చులు ఏమీ లేవు 🙂",
  answerNameSkipped: "సరే 🙂",
  answerHealthYes: "అవును, నాకు ఇన్సూరెన్స్ ఉంది",
  answerHealthNo: "ఇంకా ఇన్సూరెన్స్ లేదు",

  langTipSuffix: "",
};

const mr: Strings = {
  pickLanguageTitle: "नमस्ते! 🙏",
  pickLanguageSubtitle: "तुम्हाला कोणती भाषा सर्वात सोयीस्कर वाटते?\nआम्ही संपूर्ण संभाषण त्याच भाषेत चालू ठेवू.",

  greetingForName: "मी तुमचा Retire 360 मार्गदर्शक आहे. काही सोप्या टॅप्समध्ये, आम्ही तुमची निवृत्ती योजना तयार करू.\n\nमी तुम्हाला काय म्हणून बोलावू?",
  nameInputPlaceholder: "तुमचे नाव लिहा…",
  ageQuestion: (n) => `${n ? `तुम्हाला भेटून आनंद झाला, ${n}! ` : "खूप छान! "}तुमचे वय किती आहे?`,
  ageSuffix: "वर्षे",
  genderQuestion: "आणि तुमचे लिंग?",
  maritalQuestion: "तुमची वैवाहिक स्थिती काय आहे?",
  spouseAgeQuestion: "तुमच्या जोडीदाराचे वय किती आहे?",
  spouseAgeSuffix: "वर्षे",
  cityQuestion: "तुम्ही कुठे राहता? यामुळे तुमच्या जीवनमानाच्या खर्चाचा अंदाज लावायला मदत होईल.",
  corpusQuestion: "आता महत्त्वाचा प्रश्न 💰\n\nनिवृत्तीसाठी तुम्ही एकूण किती पैसे साठवले आहेत? (PF + ग्रॅच्युइटी + कोणतीही एकरकमी रक्कम)",
  otherIncomeQuestion: "तुम्हाला दर महिन्याला आणखी काही पैसे मिळतात का — पेन्शन किंवा घराचे भाडे यासारखे?",
  desiredIncomeQuestion: "आरामात जगण्यासाठी तुम्हाला दर महिन्याला किती पैसे हवे आहेत?",
  riskQuestion: "तुम्हाला तुमच्या पैशांबद्दल कसे वाटते? तुमच्या जवळचे जे वाटेल ते निवडा 👇",
  healthInsuranceQuestion: "तुमच्याकडे आरोग्य विमा आहे का?",
  healthCoverQuestion: "साधारण किती आरोग्य कव्हर आहे (sum insured)?",
  liabilitiesQuestion: "शेवटचा प्रश्न — आणि हा खूप महत्त्वाचा आहे 🎯\n\nनिवृत्तीत काही मोठे खर्च येणार आहेत का? मुलीचे लग्न, नातवंडांचे शिक्षण, परदेश प्रवास, घर दुरुस्ती, मेडिकल बफर?\n\nआम्ही हे वेगळे सुरक्षित ठेवू जेणेकरून तुमच्या मासिक उत्पन्नावर त्यांचा परिणाम होणार नाही. लागू असेल त्यावर टॅप करा, रक्कम आणि कधी हवे ते निवडा. (लागू नसेल ते सोडून द्या.)",

  epsQuestion: "तुम्हाला जुन्या नोकरीतून EPS पेन्शन मिळते का? दर महिना साधारण किती?\n(EPS पेन्शन EPF प्रणालीतून मिळते — बहुतांश निवृत्तांना ₹3,000–₹10,000/मा.)",
  npsQuestion: "तुमच्याकडे NPS (राष्ट्रीय पेन्शन प्रणाली) आहे का? त्यात साधारण किती आहे?\n(40% सक्तीच्या वार्षिकीत जाते; उरलेले वाढीत राहते.)",
  answerNoEPS: "EPS नाही",
  answerNoNPS: "NPS नाही",
  fundsQuestion: "आता सर्वात महत्त्वाचा प्रश्न 💰\n\nतुमचा निवृत्तीचा पैसा कुठून येतो याचे संपूर्ण चित्र तयार करूया. प्रत्येकात साधारण किती आहे ते सांगा. हाच तुमच्या संपूर्ण योजनेचा आधार आहे.\n\n(प्रीसेट टॅप करा किंवा \"वेगळी रक्कम टाका\" टॅप करा. जे स्रोत नाहीत ते शून्यावर ठेवा.)",
  fundsTotalLabel: "तुमचा एकूण कॉर्पस",
  fundPF: "PF / EPF / CPF / GPF", fundPFHint: "प्रॉव्हिडंट फंड — कंपनीकडून निवृत्ती बचत",
  fundGovScheme: "इतर सरकारी योजना (CSSS, VRS इ.)", fundGovSchemeHint: "कोणत्याही सरकारी/PSU योजनेतून एकरकमी रक्कम",
  fundLeaveEncashment: "लीव्ह एन्कॅशमेंट", fundLeaveEncashmentHint: "न वापरलेल्या सुट्ट्यांचा पैसा",
  fundGratuity: "ग्रॅच्युइटी", fundGratuityHint: "शेवटच्या नोकरीतून एकदा मिळणारी रक्कम",
  fundNPS: "NPS (राष्ट्रीय पेन्शन प्रणाली)", fundNPSHint: "40% सक्तीची वार्षिकी, उरलेले द्रव राहते",
  fundSavings: "विद्यमान बचत / FD / म्युच्युअल फंड", fundSavingsHint: "तुम्ही आधीच जमवलेली बचत — बँक, MF, FD",
  optMale: "पुरुष", optFemale: "स्त्री", optOther: "इतर",
  optMarried: "विवाहित", optWidowed: "विधवा/विधुर", optSingle: "अविवाहित", optDivorced: "घटस्फोटित",
  optCityMetro: "मोठे शहर / मेट्रो", optCityMetroDesc: "मुंबई, दिल्ली, बेंगळुरू, चेन्नई…",
  optCityTier2: "लहान शहर", optCityTier2Desc: "पुणे, जयपूर, लखनौ, कोची…",
  optCityTier3: "गाव / कस्बा", optCityTier3Desc: "लहान गावे",
  optRiskConservative: "आधी सुरक्षा", optRiskConservativeDesc: "माझे पैसे सुरक्षित रहावेत, थोडे कमी मिळाले तरी चालेल. आश्चर्य नको.",
  optRiskModerate: "संतुलित मिश्रण", optRiskModerateDesc: "दीर्घकाळात चांगल्या परताव्यासाठी छोटे चढ-उतार ठीक आहेत.",
  optRiskBalanced: "वाढीसह आरामदायक", optRiskBalancedDesc: "बाजारातील चढ-उतार ठीक — मला चांगली दीर्घकालीन वाढ हवी आहे.",
  optHealthYes: "होय, आहे", optHealthNo: "नाही, अजून नाही",

  presetNone: "नाही, काही नाही",
  yearThisYear: "या वर्षी", yearIn2: "2 वर्षांत", yearIn5: "5 वर्षांत", yearIn10: "10 वर्षांत", yearIn15: "15 वर्षांत",
  amountLabel: "किती?", whenLabel: "कधी?",
  enterDifferentAmount: "✏️ वेगळी रक्कम टाका",
  enterAmountPlaceholder: "रक्कम लिहा",
  amountTip: "टीप: तुम्ही \"50 लाख\" किंवा \"1.5 कोटी\" असेही लिहू शकता.",

  liabilityWedding: "मुलगी/मुलाचे लग्न",
  liabilityEducation: "नातवंडांचे शिक्षण",
  liabilityTravel: "परदेश प्रवास / जागतिक दौरा",
  liabilityRenovation: "घर दुरुस्ती",
  liabilityMedical: "मोठा मेडिकल बफर",
  liabilityVehicle: "नवीन कार / वाहन",

  continueBtn: "पुढे →", skipBtn: "वगळा", backBtn: "मागे",
  doneBtnEmpty: "झाले — माझी योजना दाखवा →",
  doneBtnWithCount: (n) => `झाले (${n} निवडले) →`,
  liabilityDoneSkip: "वगळा — माझी योजना दाखवा →",
  liabilityDoneWithCount: (n) => `झाले — ${n} खर्च जोडले · माझी योजना दाखवा →`,

  buildingPlan: (n) => (n ? `${n}, तुमची योजना तयार करत आहोत…` : "तुमची योजना तयार करत आहोत…"),
  justAMoment: "एक क्षण थांबा 🙂",
  loadingFallback: "लोड होत आहे…",

  answerNoOtherIncome: "इतर उत्पन्न नाही",
  answerNoLiabilities: "मोठे खर्च नाहीत 🙂",
  answerNameSkipped: "ठीक आहे 🙂",
  answerHealthYes: "होय, माझ्याकडे विमा आहे",
  answerHealthNo: "अजून विमा नाही",

  langTipSuffix: "",
};

const bn: Strings = {
  pickLanguageTitle: "নমস্কার! 🙏",
  pickLanguageSubtitle: "আপনার কোন ভাষা সবচেয়ে আরামদায়ক?\nআমরা পুরো কথোপকথন সেই ভাষাতেই চালিয়ে যাব।",

  greetingForName: "আমি আপনার Retire 360 গাইড। কয়েকটি সহজ ট্যাপে, আমরা একসাথে আপনার অবসর পরিকল্পনা তৈরি করব।\n\nআপনাকে কী নামে ডাকব?",
  nameInputPlaceholder: "আপনার নাম টাইপ করুন…",
  ageQuestion: (n) => `${n ? `আপনার সাথে দেখা হয়ে আনন্দিত, ${n}! ` : "চমৎকার! "}আপনার বয়স কত?`,
  ageSuffix: "বছর",
  genderQuestion: "এবং আপনার লিঙ্গ?",
  maritalQuestion: "আপনার বৈবাহিক অবস্থা কী?",
  spouseAgeQuestion: "আপনার সঙ্গীর বয়স কত?",
  spouseAgeSuffix: "বছর",
  cityQuestion: "আপনি কোথায় থাকেন? এটি আমাকে আপনার জীবনযাত্রার খরচ অনুমান করতে সাহায্য করবে।",
  corpusQuestion: "এবার গুরুত্বপূর্ণ প্রশ্ন 💰\n\nঅবসরের জন্য আপনি মোট কত টাকা সঞ্চয় করেছেন? (PF + গ্র্যাচুইটি + যেকোনো এককালীন পরিমাণ)",
  otherIncomeQuestion: "প্রতি মাসে আপনি কি অন্য কোনো টাকা পান — যেমন পেনশন বা বাড়ির ভাড়া?",
  desiredIncomeQuestion: "আরামে বাঁচতে আপনি প্রতি মাসে কত টাকা চান?",
  riskQuestion: "আপনার টাকা সম্পর্কে আপনি কেমন অনুভব করেন? যা আপনার কাছাকাছি মনে হয় তা নির্বাচন করুন 👇",
  healthInsuranceQuestion: "আপনার কি স্বাস্থ্য বীমা আছে?",
  healthCoverQuestion: "আনুমানিক কত স্বাস্থ্য কভার (sum insured)?",
  liabilitiesQuestion: "শেষ প্রশ্ন — এবং এটি খুব গুরুত্বপূর্ণ 🎯\n\nঅবসরে কি কোনো বড় খরচ আসতে চলেছে? মেয়ের বিয়ে, নাতি-নাতনির পড়াশোনা, বিদেশ ভ্রমণ, বাড়ি সংস্কার, মেডিকেল বাফার?\n\nআমরা এগুলিকে আলাদাভাবে সুরক্ষিত রাখব যাতে আপনার মাসিক আয়ের উপর প্রভাব না পড়ে। যা প্রযোজ্য সেটি ট্যাপ করুন, পরিমাণ এবং কখন প্রয়োজন তা নির্বাচন করুন। (যা প্রযোজ্য নয় সেটি বাদ দিন।)",

  epsQuestion: "আপনি কি পুরনো চাকরি থেকে EPS পেনশন পান? প্রতি মাসে আনুমানিক কত?\n(EPS পেনশন EPF সিস্টেম থেকে আসে — বেশিরভাগ অবসরপ্রাপ্তদের ₹3,000–₹10,000/মাস।)",
  npsQuestion: "আপনার কি NPS (জাতীয় পেনশন সিস্টেম) আছে? এতে আনুমানিক কত আছে?\n(40% বাধ্যতামূলক অ্যানুইটিতে যায়; বাকিটা বৃদ্ধিতে থাকে।)",
  answerNoEPS: "EPS নেই",
  answerNoNPS: "NPS নেই",
  fundsQuestion: "এখন সবচেয়ে গুরুত্বপূর্ণ প্রশ্ন 💰\n\nআপনার অবসরের টাকা কোথা থেকে আসছে তার পুরো ছবি তৈরি করি। প্রতিটিতে আনুমানিক কত আছে বলুন। এটাই আপনার পুরো পরিকল্পনার ভিত্তি।\n\n(একটি প্রিসেট ট্যাপ করুন বা \"অন্য পরিমাণ লিখুন\" ট্যাপ করুন। যে উৎস নেই তা শূন্যে রাখুন।)",
  fundsTotalLabel: "আপনার মোট কর্পাস",
  fundPF: "PF / EPF / CPF / GPF", fundPFHint: "প্রভিডেন্ট ফান্ড — কোম্পানির পক্ষ থেকে অবসর সঞ্চয়",
  fundGovScheme: "অন্য সরকারি স্কিম (CSSS, VRS ইত্যাদি)", fundGovSchemeHint: "যেকোনো সরকারি/PSU স্কিম থেকে এককালীন",
  fundLeaveEncashment: "লীভ এনক্যাশমেন্ট", fundLeaveEncashmentHint: "অব্যবহৃত ছুটির টাকা অবসরে",
  fundGratuity: "গ্র্যাচুইটি", fundGratuityHint: "শেষ চাকরি থেকে একবার পাওয়া অর্থ",
  fundNPS: "NPS (জাতীয় পেনশন সিস্টেম)", fundNPSHint: "40% বাধ্যতামূলক অ্যানুইটি, বাকিটা তরল থাকে",
  fundSavings: "বর্তমান সঞ্চয় / FD / মিউচুয়াল ফান্ড", fundSavingsHint: "আপনার ইতিমধ্যে জমানো সঞ্চয় — ব্যাংক, MF, FD",
  optMale: "পুরুষ", optFemale: "মহিলা", optOther: "অন্যান্য",
  optMarried: "বিবাহিত", optWidowed: "বিধবা/বিপত্নীক", optSingle: "অবিবাহিত", optDivorced: "তালাকপ্রাপ্ত",
  optCityMetro: "বড় শহর / মেট্রো", optCityMetroDesc: "মুম্বাই, দিল্লি, বেঙ্গালুরু, চেন্নাই…",
  optCityTier2: "ছোট শহর", optCityTier2Desc: "পুনে, জয়পুর, লখনৌ, কোচি…",
  optCityTier3: "শহর / গ্রাম", optCityTier3Desc: "ছোট শহর",
  optRiskConservative: "প্রথমে নিরাপত্তা", optRiskConservativeDesc: "আমার টাকা নিরাপদ থাকুক, একটু কম আয় হলেও। কোনো বিস্ময় নয়।",
  optRiskModerate: "ভারসাম্যপূর্ণ মিশ্রণ", optRiskModerateDesc: "দীর্ঘমেয়াদে ভালো রিটার্নের জন্য ছোট ওঠানামা ঠিক আছে।",
  optRiskBalanced: "বৃদ্ধির সাথে স্বাচ্ছন্দ্য", optRiskBalancedDesc: "বাজারের ওঠানামা ঠিক — আমি ভালো দীর্ঘমেয়াদী বৃদ্ধি চাই।",
  optHealthYes: "হ্যাঁ, আছে", optHealthNo: "না, এখনো নেই",

  presetNone: "না, কিছু নেই",
  yearThisYear: "এই বছর", yearIn2: "2 বছরে", yearIn5: "5 বছরে", yearIn10: "10 বছরে", yearIn15: "15 বছরে",
  amountLabel: "কত?", whenLabel: "কখন?",
  enterDifferentAmount: "✏️ অন্য পরিমাণ লিখুন",
  enterAmountPlaceholder: "পরিমাণ টাইপ করুন",
  amountTip: "টিপ: আপনি \"50 লক্ষ\" বা \"1.5 কোটি\" এভাবেও লিখতে পারেন।",

  liabilityWedding: "মেয়ে/ছেলের বিয়ে",
  liabilityEducation: "নাতি-নাতনির পড়াশোনা",
  liabilityTravel: "বিদেশ ভ্রমণ / বিশ্ব ভ্রমণ",
  liabilityRenovation: "বাড়ি সংস্কার",
  liabilityMedical: "বড় মেডিকেল বাফার",
  liabilityVehicle: "নতুন গাড়ি / যানবাহন",

  continueBtn: "চালিয়ে যান →", skipBtn: "বাদ দিন", backBtn: "পিছনে",
  doneBtnEmpty: "হয়ে গেছে — আমার পরিকল্পনা দেখান →",
  doneBtnWithCount: (n) => `হয়ে গেছে (${n} নির্বাচিত) →`,
  liabilityDoneSkip: "বাদ দিন — আমার পরিকল্পনা দেখান →",
  liabilityDoneWithCount: (n) => `হয়ে গেছে — ${n} খরচ যোগ হয়েছে · আমার পরিকল্পনা দেখান →`,

  buildingPlan: (n) => (n ? `${n}, আপনার পরিকল্পনা তৈরি হচ্ছে…` : "আপনার পরিকল্পনা তৈরি হচ্ছে…"),
  justAMoment: "এক মুহূর্ত 🙂",
  loadingFallback: "লোড হচ্ছে…",

  answerNoOtherIncome: "অন্য কোনো আয় নেই",
  answerNoLiabilities: "কোনো বড় খরচ নেই 🙂",
  answerNameSkipped: "ঠিক আছে 🙂",
  answerHealthYes: "হ্যাঁ, আমার বীমা আছে",
  answerHealthNo: "এখনো বীমা নেই",

  langTipSuffix: "",
};

const gu: Strings = {
  pickLanguageTitle: "નમસ્તે! 🙏",
  pickLanguageSubtitle: "તમને કઈ ભાષા સૌથી આરામદાયક લાગે છે?\nઅમે આખી વાતચીત તે જ ભાષામાં ચાલુ રાખીશું.",

  greetingForName: "હું તમારો Retire 360 માર્ગદર્શક છું. થોડા સરળ ટૅપ્સમાં, અમે સાથે મળીને તમારી નિવૃત્તિ યોજના બનાવીશું.\n\nહું તમને શું કહીને બોલાવું?",
  nameInputPlaceholder: "તમારું નામ ટાઇપ કરો…",
  ageQuestion: (n) => `${n ? `તમને મળીને આનંદ થયો, ${n}! ` : "ખૂબ સરસ! "}તમારી ઉંમર શું છે?`,
  ageSuffix: "વર્ષ",
  genderQuestion: "અને તમારી જાતિ?",
  maritalQuestion: "તમારી વૈવાહિક સ્થિતિ શું છે?",
  spouseAgeQuestion: "તમારા જીવનસાથીની ઉંમર કેટલી છે?",
  spouseAgeSuffix: "વર્ષ",
  cityQuestion: "તમે ક્યાં રહો છો? આ તમારા જીવનનિર્વાહના ખર્ચનો અંદાજ લગાવવામાં મદદ કરશે.",
  corpusQuestion: "હવે મહત્વનો પ્રશ્ન 💰\n\nનિવૃત્તિ માટે તમે કુલ કેટલા પૈસા બચાવ્યા છે? (PF + ગ્રેચ્યુઇટી + કોઈપણ એકસામટી રકમ)",
  otherIncomeQuestion: "દર મહિને તમને બીજા કોઈ પૈસા મળે છે — જેમ કે પેન્શન અથવા ઘરનું ભાડું?",
  desiredIncomeQuestion: "આરામથી જીવવા માટે તમે દર મહિને કેટલા પૈસા ઇચ્છો છો?",
  riskQuestion: "તમારા પૈસા વિશે તમને કેવું લાગે છે? તમારી નજીકનું જે લાગે તે પસંદ કરો 👇",
  healthInsuranceQuestion: "શું તમારી પાસે હેલ્થ ઇન્શ્યોરન્સ છે?",
  healthCoverQuestion: "આશરે કેટલું હેલ્થ કવર (sum insured)?",
  liabilitiesQuestion: "છેલ્લો પ્રશ્ન — અને આ ખૂબ મહત્વનો છે 🎯\n\nનિવૃત્તિમાં કોઈ મોટા ખર્ચ આવવાના છે? દીકરીના લગ્ન, પૌત્ર-પૌત્રીનું શિક્ષણ, વિદેશ પ્રવાસ, ઘરની મરામત, મેડિકલ બફર?\n\nઅમે આને અલગથી સુરક્ષિત રાખીશું જેથી તમારી માસિક આવક પર અસર ન પડે. જે લાગુ પડે તેને ટૅપ કરો, રકમ અને ક્યારે જરૂર છે તે પસંદ કરો. (જે લાગુ ન પડે તેને છોડી દો.)",

  epsQuestion: "શું તમને જૂની નોકરીમાંથી EPS પેન્શન મળે છે? દર મહિને આશરે કેટલું?\n(EPS પેન્શન EPF સિસ્ટમમાંથી મળે છે — મોટાભાગના નિવૃત્તોને ₹3,000–₹10,000/મહિ.)",
  npsQuestion: "શું તમારી પાસે NPS (નેશનલ પેન્શન સિસ્ટમ) છે? તેમાં આશરે કેટલું છે?\n(40% ફરજિયાત એન્યુઇટીમાં જાય છે; બાકીનું વૃદ્ધિમાં રહે છે.)",
  answerNoEPS: "EPS નથી",
  answerNoNPS: "NPS નથી",
  fundsQuestion: "હવે સૌથી મહત્વનો પ્રશ્ન 💰\n\nતમારા નિવૃત્તિના પૈસા ક્યાંથી આવી રહ્યા છે તેનું સંપૂર્ણ ચિત્ર બનાવીએ. દરેકમાં આશરે કેટલું છે તે જણાવો. આ જ તમારી સંપૂર્ણ યોજનાનો આધાર છે.\n\n(પ્રીસેટ ટૅપ કરો અથવા \"અલગ રકમ દાખલ કરો\" ટૅપ કરો. જે સ્રોત નથી તેને શૂન્ય રાખો.)",
  fundsTotalLabel: "તમારો કુલ કોર્પસ",
  fundPF: "PF / EPF / CPF / GPF", fundPFHint: "પ્રોવિડન્ટ ફંડ — કંપની તરફથી નિવૃત્તિ બચત",
  fundGovScheme: "અન્ય સરકારી યોજના (CSSS, VRS વગેરે)", fundGovSchemeHint: "કોઈપણ સરકારી/PSU યોજનામાંથી એકસામટી રકમ",
  fundLeaveEncashment: "લીવ એન્કેશમેન્ટ", fundLeaveEncashmentHint: "બિનઉપયોગી રજાઓના પૈસા",
  fundGratuity: "ગ્રેચ્યુઇટી", fundGratuityHint: "છેલ્લી નોકરીમાંથી એક વખત મળતી રકમ",
  fundNPS: "NPS (નેશનલ પેન્શન સિસ્ટમ)", fundNPSHint: "40% ફરજિયાત એન્યુઇટી, બાકીનું પ્રવાહી રહે છે",
  fundSavings: "હાલની બચત / FD / મ્યુચ્યુઅલ ફંડ", fundSavingsHint: "તમે પહેલેથી જમા કરેલી બચત — બેંક, MF, FD",
  optMale: "પુરુષ", optFemale: "સ્ત્રી", optOther: "અન્ય",
  optMarried: "પરિણીત", optWidowed: "વિધવા/વિધુર", optSingle: "અપરિણીત", optDivorced: "છૂટાછેડા",
  optCityMetro: "મોટું શહેર / મેટ્રો", optCityMetroDesc: "મુંબઈ, દિલ્હી, બેંગલુરુ, ચેન્નાઈ…",
  optCityTier2: "નાનું શહેર", optCityTier2Desc: "પુણે, જયપુર, લખનઉ, કોચી…",
  optCityTier3: "ગામ / કસબો", optCityTier3Desc: "નાના ગામો",
  optRiskConservative: "પહેલા સુરક્ષા", optRiskConservativeDesc: "મારા પૈસા સુરક્ષિત રહે, થોડું ઓછું મળે તો પણ ઠીક. કોઈ આશ્ચર્ય નહીં.",
  optRiskModerate: "સંતુલિત મિશ્રણ", optRiskModerateDesc: "લાંબા ગાળે વધુ સારા વળતર માટે નાના ઉતાર-ચઢાવ ઠીક છે.",
  optRiskBalanced: "વૃદ્ધિ સાથે આરામદાયક", optRiskBalancedDesc: "બજારના ઉતાર-ચઢાવ ઠીક — મને સારી લાંબા ગાળાની વૃદ્ધિ જોઈએ.",
  optHealthYes: "હા, છે", optHealthNo: "ના, હજુ નથી",

  presetNone: "ના, કંઈ નહીં",
  yearThisYear: "આ વર્ષે", yearIn2: "2 વર્ષમાં", yearIn5: "5 વર્ષમાં", yearIn10: "10 વર્ષમાં", yearIn15: "15 વર્ષમાં",
  amountLabel: "કેટલું?", whenLabel: "ક્યારે?",
  enterDifferentAmount: "✏️ અલગ રકમ દાખલ કરો",
  enterAmountPlaceholder: "રકમ ટાઇપ કરો",
  amountTip: "ટિપ: તમે \"50 લાખ\" અથવા \"1.5 કરોડ\" એમ પણ લખી શકો છો.",

  liabilityWedding: "દીકરી/દીકરાના લગ્ન",
  liabilityEducation: "પૌત્ર-પૌત્રીનું શિક્ષણ",
  liabilityTravel: "વિદેશ પ્રવાસ / વર્લ્ડ ટૂર",
  liabilityRenovation: "ઘરની મરામત",
  liabilityMedical: "મોટું મેડિકલ બફર",
  liabilityVehicle: "નવી કાર / વાહન",

  continueBtn: "આગળ →", skipBtn: "છોડો", backBtn: "પાછળ",
  doneBtnEmpty: "પૂર્ણ — મારી યોજના બતાવો →",
  doneBtnWithCount: (n) => `પૂર્ણ (${n} પસંદ કરેલા) →`,
  liabilityDoneSkip: "છોડો — મારી યોજના બતાવો →",
  liabilityDoneWithCount: (n) => `પૂર્ણ — ${n} ખર્ચ ઉમેરાયા · મારી યોજના બતાવો →`,

  buildingPlan: (n) => (n ? `${n}, તમારી યોજના બનાવી રહ્યા છીએ…` : "તમારી યોજના બનાવી રહ્યા છીએ…"),
  justAMoment: "એક પળ 🙂",
  loadingFallback: "લોડ થઈ રહ્યું છે…",

  answerNoOtherIncome: "બીજી કોઈ આવક નહીં",
  answerNoLiabilities: "કોઈ મોટા ખર્ચ નથી 🙂",
  answerNameSkipped: "ઠીક છે 🙂",
  answerHealthYes: "હા, મારી પાસે વીમો છે",
  answerHealthNo: "હજુ વીમો નથી",

  langTipSuffix: "",
};

const ALL: Record<Language, Strings> = { en, hi, hng, ta, te, mr, bn, gu };

export function t(lang: Language): Strings {
  return ALL[lang] ?? en;
}

// Map language code to a hint the AI advisor will use for replies.
export function languageNameForAI(lang: Language): string {
  return ({
    en: "English",
    hi: "Hindi (Devanagari script)",
    hng: "Hinglish (Roman-script Hindi)",
    ta: "Tamil",
    te: "Telugu",
    mr: "Marathi",
    bn: "Bengali",
    gu: "Gujarati",
  })[lang];
}
