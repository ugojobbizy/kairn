// Rendu côté serveur, utilisé seulement à la compilation (scripts/seo-prerender.mjs) :
// produit le HTML réel d'une page pour que Google lise son texte et ses liens sans exécuter le JavaScript.
// Au chargement, le navigateur remplace ce HTML par l'application (src/main.jsx).
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Writable } from 'node:stream';
import { Shell } from './App.jsx';

export function render(url) {
  return new Promise((resolve, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _enc, cb) { html += chunk; cb(); },
      final(cb) { resolve(html); cb(); },
    });
    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url}><Shell /></StaticRouter>,
      {
        onAllReady() { pipe(sink); }, // attend les pages chargées à la demande (lazy)
        onShellError: reject,
        onError(err) { reject(err); },
      },
    );
  });
}
