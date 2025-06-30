import JavaScriptObfuscator from "javascript-obfuscator";
import fs from "fs";
import path from "path";
import config from "../config.cjs";

const obfuscate = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body?.startsWith(prefix) ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";

    if (!["obfuscate", "obf", "jsobf"].includes(cmd)) return;

    let q = m.body.slice(prefix.length + cmd.length).trim();
    let code = q;

    // 📎 Si aucun texte, vérifier si un fichier est cité
    if (!code && m.quoted?.mimetype?.includes("javascript")) {
      const buffer = await m.quoted.download();
      code = buffer.toString();
    }

    if (!code) {
      return await Matrix.sendMessage(m.from, {
        text: `⚠️ Envoie du code JavaScript à obfusquer ou réponds à un fichier .js\n\nEx : \`${prefix}obfuscate console.log("Salut !")\``
      }, { quoted: m });
    }

    const result = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      stringArray: true,
      stringArrayEncoding: ["base64"],
      stringArrayThreshold: 0.75,
      selfDefending: true,
      disableConsoleOutput: true,
    });

    const obfuscatedCode = "// 🔒 Obfusqué par SPIRITY-XMD\n\n" + result.getObfuscatedCode();

    // ⚠️ Si trop long pour WhatsApp → fichier
    if (obfuscatedCode.length > 3000) {
      const filename = `obfuscated-${Date.now()}.js`;
      const filepath = path.join("./temp/", filename);

      fs.writeFileSync(filepath, obfuscatedCode);

      await Matrix.sendMessage(m.from, {
        document: fs.readFileSync(filepath),
        fileName: filename,
        mimetype: "text/javascript"
      }, { quoted: m });

      fs.unlinkSync(filepath);
    } else {
      await Matrix.sendMessage(m.from, {
        text: `🧠 *Code Obfusqué :*\n\`\`\`js\n${obfuscatedCode}\n\`\`\``,
      }, { quoted: m });
    }

  } catch (err) {
    console.error("❌ Obfuscation error:", err);
    await Matrix.sendMessage(m.from, {
      text: `❌ Une erreur est survenue : ${err.message || "inconnue"}`,
    }, { quoted: m });
  }
};

export default obfuscate;
