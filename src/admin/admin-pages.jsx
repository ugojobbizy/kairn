import React from 'react';
import { AuthProvider, AuthGuard } from './auth-context.jsx';
import AdminLogin from './login.jsx';
import AdminCRM from './crm.jsx';

// Espace admin chargé à la demande, avec son contexte d'authentification :
// le reste du site n'embarque ni Supabase Auth ni le CRM.
export function AdminLoginPage() {
  return <AuthProvider><AdminLogin /></AuthProvider>;
}

export function AdminCRMPage() {
  return <AuthProvider><AuthGuard><AdminCRM /></AuthGuard></AuthProvider>;
}
