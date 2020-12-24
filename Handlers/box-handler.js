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

const rarityColors = [
  {
    min: 0.0,
    max: 0.2,
    color: 0xff8900, // Rare
  },
  {
    min: 0.2,
    max: 0.4,
    color: 0xf6ff00,
  },
  {
    min: 0.4,
    max: 0.8,
    color: 0xe770ff,
  },
  {
    min: 0.8,
    max: 1.99,
    color: 0xff99e9,
  },
  {
    min: 1.99,
    max: 4.0,
    color: 0x00daff,
  },
  {
    min: 4.0,
    max: 9.99,
    color: 0xa5f1ff,
  },
  {
    min: 9.99,
    max: 19.99,
    color: 0x8aff91,
  },
  {
    min: 19.99,
    max: 100,
    color: 0xf0f0f0,
  },
];

const getColorFromProbability = probability => {
  if (!probability) {
    return rarityColors[rarityColors.length - 1].color;
  }
  const color = rarityColors.filter(rarity => {
    return probability <= rarity.max && probability >= rarity.min;
  });
  if (color.length > 0) {
    return color[0].color;
  }
  return 0xffffff;
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
              .setColor(getColorFromProbability(item.probability))
              .setImage(item.img);
            let title =
              item.title +
              (item.probability ? ` - (~${item.probability}%)` : "");
            if (item.link) {
              embedItem.addField(
                title,
                `${item.description} [Voir le contenu de cette boîte](${item.link})`
              );
            } else {
              embedItem.addField(title, item.description);
            }
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
