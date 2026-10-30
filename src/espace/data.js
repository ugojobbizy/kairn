import { createContext, useContext } from 'react';

// Données de l'espace client partagées par ses écrans (espace.jsx, crm.jsx) : leads, commandes, litiges, suivi et journal.
export const Data = createContext(null);
export const useData = () => useContext(Data);
