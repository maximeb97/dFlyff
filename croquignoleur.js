import fetch from "node-fetch";

const BASE_URL = "https://croquignoleur.fr/";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const getBoxList = async (query = "") => {
  const content = await fetch(
    "https://croquignoleur.fr/index?page=flyff-boite",
    {
      agent: httpsAgent,
    }
  );

  const html = await content.text();

  const regexBox = new RegExp("<option value='(.*?)'>", "gm");

  let match = regexBox.exec(html);

  let results = [];

  while (match != null) {
    if (match[1].toLowerCase().includes(query.toLowerCase())) {
      match[1] = match[1].replace(/&#39;/g, "'");
      results.push(match[1]);
    }
    match = regexBox.exec(html);
  }

  return results;
};

const getBoxLink = name => {
  const slugifiedName = encodeURI(name);

  return `https://croquignoleur.fr/index?page=flyff-boite&boite=${slugifiedName}`;
};

const getBoxContent = async name => {
  const content = await fetch(getBoxLink(name));

  const html = await content.text();

  const regexBox = new RegExp(
    "<div class='ligne_objet_boite'>.*?<img src='(.*?)'.*?<div class='name'>(.*?)</div>.*?<div class='description'>(.*?)</div>.*?<div class='obtention'>(<em>(.*?)</em>|<b>(.*?)%</b>.*?)*?</div>",
    "gm"
  );
  let match = regexBox.exec(html);
  let results = [];

  while (match != null) {
    let title = match[2];
    let link = null;

    const regexLink = new RegExp("<a href='(.*?)'>(.*?)</a>", "gm");

    let matchLink = regexLink.exec(title);

    if (matchLink) {
      link = encodeURI(BASE_URL + matchLink[1]);
      title = matchLink[2];
    }

    results.push({
      img: BASE_URL + match[1],
      title: title,
      description: match[3] == "0" ? "*Aucune description*" : match[3],
      link: link,
      probability: match[6] ? parseFloat(match[6]) : null,
    });
    match = regexBox.exec(html);
  }

  return results;
};

export { getBoxContent, getBoxList, getBoxLink };
