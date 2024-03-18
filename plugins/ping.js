const { Sparky } = require("../index.js");
const translate = require('translate-google-api');
  Sparky(
  {
    pattern: "ping",
    desc: "To check ping",
    type: "user",
  },
  async ({sparky , msg}) => {
    const start = new Date().getTime()
    let pong = await sparky.sendMessage(msg.chat , { text : "_*ᴄʜᴇᴄᴋɪɴɢ ᴘɪɴɢ...*_" }, { quoted : msg })
      const end = new Date().getTime();

    return await sparky.sendMessage(msg.chat , { text : `_*Rᴇꜱᴘᴏɴꜱᴇ ɪɴ*_ _*${end - start}*_ _*ᴍꜱ*_` , edit : pong.key } , { quoted : msg })
  }
);
  Sparky(
  {
    pattern: "tr",
    desc: "To check ping",
    type: "user",
  },
  async ({sparky , msg, text}) => {
if (msg.text.split(' ')[0].includes('trim')) return;
    if (!msg.replied || !msg.replied.text) return await msg.reply({ text: '*Please reply to any text!*' });
    if (!text) return await msg.reply({ text: '*Please enter the language in which you want to translate the text to along with replying to text.*' });
    let result = await translate(msg.replied.text, { tld: 'com', to: text });
    return await msg.reply({ text: result[0] });
  }
);