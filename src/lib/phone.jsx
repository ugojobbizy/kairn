import React, { useState } from 'react';

// Téléphone d'Ugo caché derrière un clic (Ugo, 18/11/2026 : « J'ai pas envie que mon numéro soit écrit en clair.
// J'aimerais qu'ils doivent d'abord cliquer pour le voir. »). Le numéro est assemblé au clic : il n'apparaît
// ni dans le HTML servi ni d'un seul tenant dans le code (les robots qui ramassent les numéros ne le lisent pas).
const PARTS = ['07', '81', '27', '41', '79'];
export const phoneText = () => PARTS.join(' ');
export const phoneHref = () => `tel:+33${PARTS.join('').slice(1)}`;

// label : texte du bouton avant le clic. Après le clic : le numéro, cliquable pour appeler.
export function PhoneReveal({ label = 'Afficher le numéro', className = 'phone-reveal', icon = null, onReveal }) {
  const [shown, setShown] = useState(false);
  if (shown) {
    return <a href={phoneHref()} className={`${className} is-shown`}>{icon}{phoneText()}</a>;
  }
  return (
    <button type="button" className={className} onClick={() => { setShown(true); onReveal?.(); }}>
      {icon}{label}
    </button>
  );
}

// Bouton qui appelle directement (barre mobile) : le numéro n'est pas affiché, l'appel part au clic.
export function CallButton({ className, children = 'Appeler' }) {
  return (
    <button type="button" className={className} aria-label="Appeler Kairn" onClick={() => { window.location.href = phoneHref(); }}>
      {children}
    </button>
  );
}
