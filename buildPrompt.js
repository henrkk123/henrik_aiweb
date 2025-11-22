// Builds the system prompt + message array for the LLM.
// Ändere die Firmendaten direkt in backend/config/business.config.json,
// oder passe die Defaults hier an (defaultBusinessProfile / defaultAiStyle).

const defaultBusinessProfile = {
  business_name: "Dein Unternehmen",
  description: "Kurzbeschreibung deines Unternehmens.",
  opening_hours: "Mo-Fr 9-18 Uhr",
  location: "Beispielstraße 1, 12345 Musterstadt",
  products: ["Produkt A", "Produkt B"],
  faq: []
};

const defaultAiStyle = {
  language: "de",
  tone: "freundlich, kompetent, einladend",
  max_sentences: 3,
  invite_action: "Schlage vor, vorbeizukommen oder kurz anzurufen.",
  behavior_rules: [
    "Erfinde keine Fakten oder Preise.",
    "Wenn du etwas nicht weißt, verweise auf Telefon oder E-Mail."
  ],
  allowed_topics: ["Produkte", "Öffnungszeiten", "Adresse"],
  disallowed_topics: ["Rechtliche Fragen", "Medizinische Fragen"]
};

function formatList(value) {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function formatFAQ(faq) {
  if (!faq || !faq.length) return "Keine FAQ hinterlegt.";
  return faq
    .map((item) => `- ${item.question}: ${item.answer}`)
    .join("\n");
}

function buildPrompt(businessConfig = {}, aiConfig = {}, userMessage, history = []) {
  const profile = { ...defaultBusinessProfile, ...businessConfig };
  const ai = { ...defaultAiStyle, ...aiConfig };
  const maxSentences = ai.max_sentences || 3;

  const systemPrompt = [
    `Du bist ein menschlich wirkender, schneller AI-Chatbot für ${profile.business_name}.`,
    `Kurzbeschreibung: ${profile.description}`,
    `Öffnungszeiten: ${profile.opening_hours}`,
    `Standort: ${profile.location}`,
    `Produkte/Services: ${formatList(profile.products)}`,
    `FAQ:\n${formatFAQ(profile.faq)}`,
    `Sprache: ${ai.language}. Ton: ${ai.tone}.`,
    `Regeln: ${formatList(ai.behavior_rules)}`,
    `Erlaubte Themen: ${formatList(ai.allowed_topics)}`,
    `Verbotene Themen: ${formatList(ai.disallowed_topics)}`,
    `Antworten: kurz, knackig (max. ${maxSentences} Sätze), herzlich und natürlich.`,
    `Wenn unsicher: ${ai.invite_action}`
  ].join("\n");

  const messages = [
    { role: "system", content: systemPrompt },
    ...(Array.isArray(history) ? history : []),
    { role: "user", content: userMessage }
  ];

  return messages;
}

module.exports = { buildPrompt };
