import { MessageEmbed } from "discord.js";

const helps = [
  {
    command: "!dflyff",
    description: "Affiche la liste des commandes",
  },
  {
    command: "!boite <Nom de la boite>",
    description: "Affiche le contenu de la boîte indiquée",
  },
  {
    command: "!gs rank <Nom du serveur>",
    description: "Affiche le classement de la dernière GS",
  },
];

const helpHandler = msg => {
  let embed = new MessageEmbed()
    .setTitle("dFlyff - Bot discord d'utilitaires Flyff")
    .setColor(0x007f00)
    .setDescription(
      "Basé en grande partie sur le site du [Croquignoleur](https://croquignoleur.fr/) (merci à Barlaf !)"
    );
  helps.map(help => {
    embed.addField(help.command, help.description);
  });
  msg.reply(embed);
};

export { helpHandler };
