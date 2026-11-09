// IndexNow (Bing, Yandex, Seznam, Naver…) : prévient les moteurs que des adresses ont changé, sans compte.
// La clé est publique par conception : le fichier public/<clé>.txt prouve que le site en est propriétaire.
// Usage : node scripts/indexnow.mjs            (toutes les adresses du sitemap de production)
//         node scripts/indexnow.mjs /leads /blog/x   (seulement ces adresses)
const KEY = '37917a73fd04d501e22bdd091e4d6e96';
const HOST = 'www.kairnagency.com';
const args = process.argv.slice(2);
let urls;
if (args.length) urls = args.map((p) => `https://${HOST}${p.startsWith('/') ? p : `/${p}`}`);
else {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow : ${urls.length} adresses envoyées, réponse ${res.status}`);
