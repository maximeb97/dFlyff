import fetch from "node-fetch";

const BASE_URL = "https://croquignoleur.fr/";

const getBoxList = async (query = "") => {
  const content = await fetch(
    "https://croquignoleur.fr/index?page=flyff-boite"
  );

  const html = await content.text();

  const regexBox = new RegExp("<option value='(.*?)'>", "gm");

  let match = regexBox.exec(html);

  let results = [];

  while (match != null) {
    if (match[1].toLowerCase().includes(query.toLowerCase())) {
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
    "<div class='ligne_objet_boite'>.*?<img src='(.*?)'.*?<div class='name'>(.*?)</div>.*?<div class='description'>(.*?)</div>",
    "gm"
  );

  let match = regexBox.exec(html);

  let results = [];

  while (match != null) {
    results.push({
      img: BASE_URL + match[1],
      title: match[2],
      description: match[3],
    });
    match = regexBox.exec(html);
  }

  return results;
};

export { getBoxContent, getBoxList, getBoxLink };
