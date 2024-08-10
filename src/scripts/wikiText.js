import * as cheerio from "cheerio";

export let wikiText = "";
export let wikiPage;
let url = "https://en.wikipedia.org/w/api.php";

export function getRandomWiki() {
  let randomTitle;

  const params = {
    action: "query",
    format: "json",
    list: "random",
    rnnamespace: 0,
  };

  url = url + "?origin=*";
  Object.keys(params).forEach((key) => {
    url += "&" + key + "=" + params[key];
  });

  const promise = fetch(url)
    .then((response) => {
      return response.json();
    })
    .then(function (response) {
      randomTitle = response.query.random[0].title;
      wikiPage = randomTitle;
    })
    .catch(function (error) {
      console.log(error);
    });

  return promise;
}

export function getWikiPageText(page) {
  const params = {
    action: "parse",
    format: "json",
    prop: "text",
    page: page,
  };

  url = url + "?origin=*";
  Object.keys(params).forEach((key) => {
    url += "&" + key + "=" + params[key];
  });

  const promise = fetch(url)
    .then((response) => {
      return response.json();
    })
    .then(function (response) {
      let typePageHTML = response.parse.text["*"];
      wikiText = parseWikiText(typePageHTML, 200);
    })
    .catch(function (error) {
      console.log(error);
    });

  return promise;
}

function parseWikiText(pageHTML, minLength) {
  let parsedText = "";
  let text = "";
  const classesToExclude = [
    "infobox",
    "navigation-not-searchable",
    "infobox-image",
    "infobox-caption",
    "infobox-data",
    "cite-bracket",
  ];

  const htmlParser = cheerio.load(pageHTML);

  htmlParser("p")
    .not(`.${classesToExclude.join(".")}`)
    .each((index, element) => {
      text += htmlParser(element).text() + "";
    });

  let dotIndex = text.indexOf(".");

  while (parsedText.length < minLength) {
    if (dotIndex === -1) {
      break;
    }
    parsedText = text.substring(0, dotIndex);
    dotIndex = text.indexOf(".", dotIndex + 1);
  }

  //Clear new line characters
  parsedText = parsedText.trim();

  //Clear weird spaces
  parsedText = parsedText.replace(/\s+/g, " ");

  //Check for citation characters
  parsedText = parsedText.replace(/\[.*?\]/g, "");

  //Check for accented characters
  const accentMap = {
    á: "a",
    Á: "A",
    à: "a",
    À: "A",
    â: "a",
    Â: "A",
    ã: "a",
    Ã: "A",
    ä: "a",
    Ä: "A",
    å: "a",
    Å: "A",
    æ: "ae",
    Æ: "AE",
    é: "e",
    É: "E",
    è: "e",
    È: "E",
    ê: "e",
    Ê: "E",
    ë: "e",
    Ë: "E",
    í: "i",
    Í: "I",
    ì: "i",
    Ì: "I",
    î: "i",
    Î: "I",
    ï: "i",
    Ï: "I",
    ó: "o",
    Ó: "O",
    ò: "o",
    Ò: "O",
    ô: "o",
    Ô: "O",
    õ: "o",
    Õ: "O",
    ö: "o",
    Ö: "O",
    ú: "u",
    Ú: "U",
    ù: "u",
    Ù: "U",
    û: "u",
    Û: "U",
    ü: "u",
    Ü: "U",
    ñ: "n",
    õ: "o",
    ø: "o",
    Ø: "O",
    ý: "y",
    Ý: "Y",
    ÿ: "y",
    Ÿ: "Y",
  };
  parsedText = parsedText.replace(
    /[^\u0000-\u007F]/g,
    (char) => accentMap[char] || char
  );

  //Check for non english characters
  parsedText = parsedText.replace(/[^\x00-\x7F]/g, "");

  return parsedText;
}

export async function getTypeText() {
  await getRandomWiki();

  await getWikiPageText(wikiPage);
}
