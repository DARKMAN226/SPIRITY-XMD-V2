import fs from "fs";
import fetch from "node-fetch";
import config from "../config.cjs";

const DB_PATH = "./spirity.json";

// Charger config de persistance
function loadData() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ global: false }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH));
}

// Sauvegarder config
function saveData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const spirityChat = async (m, Matrix) => {
  const prefix = config.PREFIX || ".";
  const body = m.body || "";
  const cmd = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";

  // Charger config
  const db = loadData();

  // Commande activation/désactivation (uniquement en DM)
  if (cmd === "spirity-chat") {
    if (m.isGroup) {
      return Matrix.sendMessage(
        m.from,
        { text: "❌ La commande `.spirity-chat` fonctionne uniquement en messages privés (DM)." },
        { quoted: m }
      );
    }
    const arg = body.slice(prefix.length + cmd.length).trim().toLowerCase();
    if (!["on", "off"].includes(arg)) {
      return Matrix.sendMessage(
        m.from,
        { text: "⚙️ Usage :\n.spirity-chat on\n.spirity-chat off" },
        { quoted: m }
      );
    }
    db.global = arg === "on";
    saveData(db);
    return Matrix.sendMessage(
      m.from,
      { text: `✅ Spirity-Chat est maintenant ${arg === "on" ? "activé" : "désactivé"} en message privé.` },
      { quoted: m }
    );
  }

  // Si activé globalement en DM seulement
  if (
    db.global &&
    !m.isGroup &&
    !body.startsWith(prefix) &&
    !m.key.fromMe
  ) {
    // Détection questions d’identité
    const identityTriggers = [
      "qui es-tu", "qui tu es", "t'es qui", "c'est quoi ton nom",
      "t ki", "t ki toi", "who are you", "what is your name", "who r u"
    ];
    if (identityTriggers.some(q => body.toLowerCase().includes(q))) {
      return Matrix.sendMessage(
        m.from,
        { text: "👁️ Je suis *Spirity-XMD*, exorcisé par 🧙‍♂️ *DARK-DEV* pour servir les ténèbres… et parfois, l'humain. 😈" },
        { quoted: m }
      );
    }

    // Appel à l’API Gemini
    try {
      const res = await fetch("https://api.s0ra.chat/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.GEMINI_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: body }],
        }),
      });

      const data = await res.json();
      const replyText = data?.choices?.[0]?.message?.content || "🤖 Je suis là.";

      return Matrix.sendMessage(m.from, { text: replyText }, { quoted: m });
    } catch (e) {
      console.error("Erreur Spirity-Chat IA :", e);
      return Matrix.sendMessage(m.from, { text: "❌ Erreur IA. Merci de réessayer plus tard." }, { quoted: m });
    }
  }
};

export default spirityChat;
