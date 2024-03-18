'use strict';
const X = require("./config.js")
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore, getContentType, generateForwardMessageContent, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys');
const { Sequelize, DataTypes } = require('sequelize');
const { list, uninstall } = require('./lib/database/commands');
const { getFilter } = require('./lib/database/filter');
const { parseJson } = require('./lib/utils');
const { database } = require('./lib/database.js');
const Greetings = require('./lib/database/greetings');
const axios = require('axios');
const pino = require('pino');
const fs = require("fs");
const fx = require("fs-extra");
require('http')
 .createServer(async (req, res) => {})
 .listen(process.env?.PORT || 8080, () => true);

const Users = database.define('Users', {
    name: {
        primaryKey: true,
        unique: false,
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

//////////////////////////////////////// 
////////  🇵 🇱 🇺 🇬 🇮 🇳 🇸 ////////
////////////////////////////////////////
const commands = [];
function Sparky(commandInfo, func) {
  commandInfo.function = func;
  if (commandInfo.pattern) {
    commandInfo.pattern =
      new RegExp(`${X.PREFIX}( ?${commandInfo.pattern})`, "is") || false;
  }
  commandInfo.dontAddCommandList = commandInfo.dontAddCommandList || false;
  commandInfo.fromMe = commandInfo.fromMe || false;
  commandInfo.type = commandInfo.type || "misc";

  commands.push(commandInfo);
  return commandInfo;
}
/////////////////////////////////////////




/*
async function freshsession() {
  if (fx.existsSync('./lib/auth_info_baileys')) {
    fx.emptyDirSync(__dirname + '/lib/auth_info_baileys');
};
  console.log("OLD SESSION CLOSED")
}
freshsession();
//
*/
//sessionid----------------------------
async function MakeSession() {
    try {
        console.log("WRITING SESSION...");
        const {
          data
        } = await axios(`https://paste.c-net.org/${X.SESSION_ID.split(':')[1]}`);
        await fs.writeFileSync("./lib/auth_info_baileys/creds.json", JSON.stringify(data));
        console.log("SESSION CREATED SUCCESSFULLY✅");
      } catch (err) {
        console.log(err);
      }
}
MakeSession();
//------------------------------

async function Connect() {
    try {
        let store = makeInMemoryStore({
            logger: pino().child({ level: 'silent', stream: 'store' })
        });
        
        let { version, isLatest } = await fetchLatestBaileysVersion();
        let { state, saveCreds } = await useMultiFileAuthState('./lib/auth_info_baileys');
        let sparky = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            markOnlineOnConnect: false,
            browser: ['Leon', 'Chrome', '1.0.0'],
            auth: state,
            version: version
        });
        store.bind(sparky.ev);

        sparky.ev.on('connection.update', async (update) => {
            const { connection } = update;
            if (connection === 'close') {
                console.log('[ ! ] Connection Closed: Reconnecting...');
                await Connect();
            } else if (connection === 'open') {
                console.log('[ + ] Connected!');
                let start = `Bot Connected...`
/////////////////////////////////////////
              fs.readdirSync(__dirname + "/plugins").forEach((plugin) => {
              if (plugin.endsWith(".js")) {
              require(__dirname + "/plugins/" + plugin);
              }});
              console.log("Plugins Loaded🤟")
/////////////////////////////////////////
                let num = X.SUDO.split(",")[0]
                    sparky.sendMessage(num + "@s.whatsapp.net", {text : start})
            }
        });

      /*  let extCommands = await list();
        extCommands.forEach(async (cmd) => {
         if (!fs.existsSync('./plugins/' + cmd.name + '.js')) {
          try {
           let content = await parseJson(cmd.url);
           fs.writeFileSync('./plugins/' + cmd.name + '.js', content);
           require('./plugins/' + cmd.name);
          } catch (e) {
           console.log('[ ! ] ' + cmd.name + ' command crashed.');
           console.error(e);
           try {
            fs.unlinkSync('./plugins/' + cmd.name + '.js');
           } catch {}
           await uninstall(cmd.name);
           console.log('[ + ] ' + cmd.name + ' command has been removed!');
          }
         }
        });
        if (extCommands.length > 0) {
         console.log('[ + ] Loaded external commands.');
        }
*/
        sparky.ev.on('group-participants.update', async (info) => {
           if (info.action == 'add') {
            let wtext = await Greetings.getMessage('welcome', info.id);
            if (wtext !== false) await sparky.sendMessage(info.id, { text: wtext });
           } else if (info.action == 'remove') {
            let gtext = await Greetings.getMessage('goodbye', info.id);
            if (gtext !== false) await sparky.sendMessage(info.id, { text: gtext });
           }
        });
 
        sparky.ev.on('messages.upsert', async (msg) => {
        // try {
            msg = msg.messages[0];
            if (!msg.message) return;
            msg = await require('./message')(msg, sparky, store);
            if (msg.chat === 'status@broadcast') return;
/////////////////////////////////////////
            try {
             let user = await Users.findAll({ where: { id: msg.isPrivate ? msg.chat : msg.sender } });
             if (user.length < 1) {
              await Users.create({ name: msg.pushName, id: msg.isPrivate ? msg.chat : msg.sender });
             } else {
              await Users[0]?.update({ name: msg.pushName });
             }
            } catch {}
/////////////////////////////////////////
           
            let filters = await getFilter(msg.chat);
            filters.forEach(async (filter) => {
              let regex = new RegExp(filter.match, 'i');
              if (regex.test(msg.text) &&
                  filter.chat == msg.chat &&
                  !msg.fromBot) await msg.reply({ text: filter.response });
            });
           
/////////////////////////////////////////
/*
            let admins = (X.SUDO?.includes(',') ? X.SUDO?.split(',').map(admin => admin.trim() + '@s.whatsapp.net') : [X.SUDO?.trim() + '@s.whatsapp.net']) || true;
            if (X.MODE == 'private' && !msg.fromMe && !admins.includes(msg.sender)) return;
            allCommands().forEach(async (command) => {
              let prefix = X.PREFIX || '.';
              let text = (msg.text.split(command.command)[1])?.trim();
              if (msg.text.startsWith(prefix + command.command)) return command.func(sparky, msg, text);
            });
         } catch (e) {
            console.log(e);
         }*/
/////////////////////////////////////////
///🇵 🇱 🇺 🇬 🇮 🇳 🇸  🇫 🇺 🇳 🇨 ///
/////////////////////////////////////////
    
           commands.map(async (Sparky) => {
           //if (clash.fromMe && !X.SUDO.split(",").includes(msg.sender.split("@")[0] || msg.key.fromMe )) {
          // return;
          // }
           let comman = msg.text;
            let text;
           switch (true) {
           case Sparky.pattern && Sparky.pattern.test(comman):
             text = msg.text.replace(new RegExp(Sparky.pattern, "i"), "").trim();
                 Sparky.function({sparky, msg, text});
           break;
           case comman && Sparky.on === "text":
             text = msg.text
               Sparky.function({sparky, msg, text});
           break;
           case Sparky.on === "image" || Sparky.on === "photo":
           if (msg.mtype === "imageMessage") {
               Sparky.function({sparky, msg});
           }
           break;
           case Sparky.on === "sticker":
           if (msg.mtype === "stickerMessage") {
               Sparky.function({sparky, msg});
           }
           break;
           case Sparky.on === "video":
           if (msg.mtype === "videoMessage") {
             Sparky.function({sparky, msg});
           }
           break;
           default:
           break;
           }
           });
           
           
/////////////////////////////////////////
        });

        sparky.ev.on('contacts.upsert', async (contact) => store.bind(contact));
        sparky.ev.on('creds.update', saveCreds);
    } catch (e) {
        console.log(e);
    }
}
/*
function allCommands() {
 let commands = [];
fs.readdirSync('./pluginsdsss').forEach(file => {
  if (file.endsWith('.js')) {
   let command = require('./plugins/' + file);
   commands.push({ command: command.command, info: command.info, func: command.func });
  }
 });
 return commands;
}
*/
setTimeout( () => {
    Connect()
    }, 3000)


module.exports = {
 Users,
 Connect,
 Sparky,
 commands
};
