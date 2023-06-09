const rootURL = "https://holopin.io";
const blogURL = "https://blog.holopin.io";
const holoBytesPath = "/holobyte/collect";
const ul = document.getElementById("holobytes");
const list = document.createDocumentFragment();
const holoBytesLinks = {};

const getHoloBytesLinks = (doc = document, path = holoBytesPath) => {
  const hbLinks = {};
  let holobytesLinks = doc.getElementsByTagName("a");
  for (let counter = 0; counter < holobytesLinks.length; counter++) {
    const _url = new URL(holobytesLinks[counter].href, rootURL);
    if (holobytesLinks[counter].href.includes(path)) {
      hbLinks[_url.pathname] = holobytesLinks[counter];
      hbLinks[_url.pathname].style.background = "red";
    }
  }
  return hbLinks;
};

const getDocumentObject = async (url) => {
  return await fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (html) {
      let parser = new DOMParser();
      return parser.parseFromString(html, "text/html");
    })
    .catch(function (err) {
      console.log("Failed to fetch document: ", err);
    });
};

const main = async () => {
  let doc = await getDocumentObject(blogURL);
  let home = getHoloBytesLinks(doc);

  for (const [_url, element] of Object.entries(home)) {
    holoBytesLinks[_url] = element;
  }

  const posts = getHoloBytesLinks(doc, "/posts/");

  for (const postURL of Object.keys(posts)) {
    let doc = await getDocumentObject(`${blogURL}${postURL}`);
    let postLinks = getHoloBytesLinks(doc);
    for (const [_url, element] of Object.entries(postLinks)) {
      holoBytesLinks[_url] = element;
    }
  }

  console.log(`HoloBytes hunted: ${Object.keys(holoBytesLinks).length}`);
  for (const [_url, element] of Object.entries(holoBytesLinks)) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    let _uri = `${rootURL}${_url}`;
    a.href = _uri;
    a.innerText = element.innerText;
    a.target = "_blank";
    a.referrerPolicy = "no-referrer";
    li.appendChild(a);
    list.appendChild(li);
    console.log(_uri);
  }

  ul.appendChild(list);
};

main();
