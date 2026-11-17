// Liens globaux du site. Modifie ici pour mettre à jour partout.
export const BOOKING_URL = 'https://calendly.com/contact-kairnagency/30min';
export const CONTACT_EMAIL = 'contact@kairnagency.com';
// Téléphone d'Ugo, affiché partout sur le site (accord d'Ugo du 17/11/2026 : « tu peux mettre mon numéro partout »).
export const CONTACT_PHONE = '07 81 27 41 79';
export const CONTACT_PHONE_TEL = 'tel:+33781274179';

// Numéro WhatsApp au format international, chiffres seulement (ex. 33612345678). Vide = onglet masqué.
export const WHATSAPP_NUMBER = '33781274179';
export const whatsappUrl = (text = 'Bonjour, je souhaite échanger sur un projet.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
