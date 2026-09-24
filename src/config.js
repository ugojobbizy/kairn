// Liens globaux du site. Modifie ici pour mettre à jour partout.
export const BOOKING_URL = 'https://calendly.com/contact-kairnagency/30min';
export const CONTACT_EMAIL = 'contact@kairnagency.com';

// Numéro WhatsApp au format international, chiffres seulement (ex. 33612345678). Vide = onglet masqué.
export const WHATSAPP_NUMBER = '33781274179';
export const whatsappUrl = (text = 'Bonjour Kairn, je souhaite échanger sur mon projet.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
