import { MessageEmbed } from "discord.js";
import { rankLastGs } from "../gs";

const handleGsCommand = (msg, params) => {
  const mainArg = params[0].toLowerCase();

  if (mainArg == "rank") {
    if (params[1])
      rankLastGs(params[1])
        .then(result => {
          if (result) {
            let embed = new MessageEmbed()
              .setTitle("GS")
              .setDescription(result.title);
            result.ranks.map(rank => {
              embed.addField(
                `${rank.position} - ${rank.name}`,
                `Frags: ${rank.frags}\nPoints: ${rank.points}\nBrc: ${rank.bcrs}\nMorts: ${rank.deaths}`
              );
            });
            msg.reply(embed);
          } else {
            msg.reply("aucun résultat");
          }
        })
        .catch(e => msg.reply(e));
    else msg.reply("indiquez le nom du serveur (`!gs rank <nom du serveur>`)");
  }
};

export { handleGsCommand };
