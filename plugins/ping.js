import config from "../config.cjs";

const ping = async (m, Matrix) => {
  try {
    const prefix = config.Prefix || config.PREFIX || ".";
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ["ping", "speed", "p"];

    if (validCommands.includes(cmd)) {
      const start = new Date().getTime();

      const reactionEmojis = ["🔥", "💖", "🚀", "💨", "🎯", "🎉", "🌟", "💥", "🕐", "🔹"];
      const textEmojis = ["💎", "🏆", "⚡", "🎖", "🎶", "🌠", "🌀", "🔱", "🚀", "✩"];

      const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
      let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

      while (textEmoji === reactionEmoji) {
        textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
      }

      await m.React(textEmoji);

      const end = new Date().getTime();
      const responseTime = (end - start) / 1000;

      const message = `◈━━━━━━━━━━━━━━━━◈
│❒ SPIRITY-XMD speed - ${responseTime.toFixed(1)}s! ${reactionEmoji}
◈━━━━━━━━━━━━━━━━◈`;

      await Matrix.sendMessage(m.from, {
        text: message,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            showAdAttribution: true, // Marks as an ad
            title: `SPIRITY-XMD Speed`,
            body: `Checking your connection speed with SPIRITY-XMD!`,
            sourceUrl: "https://github.com/DARKMAN226/SPIRITY-XMD-V2",
            mediaType: 1,
            renderLargerThumbnail: true,
            mediaUrl: "https://files.catbox.moe/fta4xd.jpg",
            thumbnailUrl: "https://files.catbox.moe/fta4xd.jpg",
          },
        },
      }, { quoted: m });
    }
  } catch (error) {
    console.error(`❌ Ping error: ${error.message}`);
    await Matrix.sendMessage(m.from, {
      text: `◈━━━━━━━━━━━━━━━━◈
│❒ *SPIRITY-XMD* hit a snag! Error: ${error.message || "Failed to check speed"} 🍷
◈━━━━━━━━━━━━━━━━◈`,
    }, { quoted: m });
  }
};

export default ping;
