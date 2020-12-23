import { MessageEmbed } from "discord.js";
import { XmlEntities } from "html-entities";
import { getBoxContent, getBoxList, getBoxLink } from "../croquignoleur";
import ClientRequests from "../client-requests";

const entities = new XmlEntities();

const handleBoxSearch = (msg, boxName) => {
  let id = msg.author.id;
  getBoxList(boxName).then(boxes => {
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
      ClientRequests.setRequest(id, boxes);
      msg.reply(embed);
    } else {
      msg.reply("aucune boite trouvée, vérifiez le nom");
    }
  });
};

const handlePendingBoxRequest = msg => {
  let id = msg.author.id;
  if (id && ClientRequests.getRequest(id)) {
    let n = parseInt(msg.content);
    if (n) {
      n = n - 1;
      getBoxContent(ClientRequests.getRequest(id)[n])
        .then(items => {
          let link = getBoxLink(ClientRequests.getRequest(id)[n]);
          msg.reply("tu peux aussi voir le contenu ici: " + link);
          items.map(item => {
            let embedItem = new MessageEmbed()
              .setTitle(ClientRequests.getRequest(id)[n])
              .setColor(0x4fff4f)
              .setImage(item.img)
              .addField(item.title, item.description);
            msg.reply(embedItem);
          });
          ClientRequests.deleteRequest(id);
        })
        .catch(e => {
          console.log(e);
          ClientRequests.deleteRequest(id);
        });
    } else {
      msg.reply("demande annulée");
      ClientRequests.deleteRequest(id);
    }
  }
};

export { handleBoxSearch, handlePendingBoxRequest };
