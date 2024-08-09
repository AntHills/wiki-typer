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
  //let typePage;

  console.log(page);

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
    console.log(dotIndex);
    if (dotIndex === -1) {
      break;
    }
    parsedText = text.substring(0, dotIndex);
    dotIndex = text.indexOf(".", dotIndex + 1);
  }

  //Clear new line characters
  parsedText = parsedText.trim();

  //Check for citation characters

  //Check for non english characters

  return parsedText;
}

export async function getTypeText() {
  await getRandomWiki();

  await getWikiPageText(wikiPage);
}
