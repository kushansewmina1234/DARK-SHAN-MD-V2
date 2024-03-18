const {
    Sparky
} = require("../index.js");
const X = require("../config.js");

Sparky(
    {
        on: "text",
        desc: "Runs server code",
        type: "user",
    },
    async ({
        sparky, msg
    }) => {
        let sudo = X.SUDO.split(",");
        for (any in sudo)
            if (msg.sender.includes(sudo[any]) || msg.key.fromMe) {


            if (msg.text.startsWith(">")) {
                try {
                    let evaled = await eval(`(async () => { ${msg.text.replace(">", "")} })()`);
                    if (typeof evaled !== "string") evaled = util.inspect(evaled);
                    await sparky.sendMessage(msg.chat, {
                        text: `${evaled}`
                    }, {
                        quoted: msg
                    });
                } catch (err) {
                    await sparky.sendMessage(msg.chat, {
                        text: `${util.format(err)}`
                    }, {
                        quoted: msg
                    });
                }
            }
        }
    });
