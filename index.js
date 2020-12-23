require("dotenv").config();

const { Client, MessageEmbed } = require("discord.js");

import { XmlEntities } from "html-entities";
import { getBoxContent, getBoxList, getBoxLink } from "./croquignoleur";
import { getArguments } from "./arguments";

let requests = {};

const entities = new XmlEntities();

setInterval(() => {
  // TODO: Clean requests
}, 10000);

const client = new Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  // Boite
  if (msg.content.startsWith("!boite")) {
    let args = getArguments("!boite ", msg.content);
    if (args.length >= 1) {
      getBoxList(args[0]).then(boxes => {
        if (boxes.length > 0) {
          let embed = new MessageEmbed()
            .setTitle("Choisissez une boite:")
            .setColor(0xf0f0f0)
            .setDescription(
              "Entrez le numéro de la boite que vous voulez inspecter"
            );
          boxes.map((box, index) => {
            box = entities.decode(box);
            let i = parseInt(index) + 1;
            embed.addField("`" + i + "`: " + box, box, true);
          });
          requests[msg.author.id] = boxes;
          msg.reply(embed);
        } else {
          msg.reply("aucune boite trouvée, vérifiez le nom");
        }
      });
    } else {
      msg.reply("!boite <Nom de la boite>");
    }
  } else {
    let id = msg.author.id;
    if (id && requests[id]) {
      let n = parseInt(msg.content);
      if (n) {
        n = n - 1;
        getBoxContent(requests[id][n])
          .then(items => {
            let link = getBoxLink(requests[id][n]);
            msg.reply("tu peux aussi voir le contenu ici: " + link);
            items.map(item => {
              let embedItem = new MessageEmbed()
                .setTitle(requests[id][n])
                .setColor(0x4fff4f)
                .setImage(item.img)
                .addField(item.title, item.description);
              msg.reply(embedItem);
            });
            delete requests[id];
          })
          .catch(e => {
            console.log(e);
            delete requests[id];
          });
      } else {
        msg.reply("demande annulée");
        delete requests[id];
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);
