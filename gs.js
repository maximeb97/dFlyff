import fetch from "node-fetch";

const servers = [
  {
    name: "Genèse",
    id: 1,
  },
  {
    name: "Illustre",
    id: 2,
  },
  {
    name: "Mahtolle",
    id: 4,
  },
  {
    name: "Azranoct",
    id: 5,
  },
];

const BASE_URL = "http://summonerdz.com/gs/";

const getServerFromName = serverName => {
  return servers.find(s =>
    s.name.toLowerCase().includes(serverName.toLowerCase())
  );
};

const parseGuild = guild => {
  const tableRegex = new RegExp("<td>([^]*?)</td>", "gm");
  const tableStructure = [
    "position",
    "name",
    "frags",
    "points",
    "bcrs",
    "deaths",
  ];

  let match = tableRegex.exec(guild);
  let result = {};
  let i = 0;

  while (match != null) {
    if (i == 1) {
      const guildNameRegex = new RegExp("<a.*>(.*)</a>", "gm");

      let matchGuildName = guildNameRegex.exec(match[1]);
      if (matchGuildName[1]) {
        result[tableStructure[i]] = matchGuildName[1];
      } else {
        result[tableStructure[i]] = match[1];
      }
    } else {
      result[tableStructure[i]] = match[1];
    }
    match = tableRegex.exec(guild);
    i++;
  }

  return result;
};

const parseRank = table => {
  const tableRegex = new RegExp('<tr class="itemdiv">([^]*?)</tr>', "gm");

  let match = tableRegex.exec(table);
  let results = [];

  while (match != null) {
    results.push(parseGuild(match[1]));
    match = tableRegex.exec(table);
  }
  return results;
};

const rankLastGs = async serverName => {
  let server = getServerFromName(serverName);
  if (!server) throw "le serveur demandé n'existe pas";

  const content = await fetch(BASE_URL + `?s=${server.id}&d=gs`);

  const html = await content.text();

  const regexLastGs = new RegExp(
    '<h3>(.*?)</h3>[^]*?<div class="guild">([^]*?)</div>',
    "gm"
  );

  let match = regexLastGs.exec(html);

  if (match) {
    let title = match[1];
    let ranks = parseRank(match[2]);
    return {
      title,
      ranks,
    };
  }
  return undefined;
};

export { rankLastGs };
