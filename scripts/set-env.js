// scripts/set-env.js
const fs = require('fs');
const path = require('path');

// Assurez-vous que le dossier existe
const envDir = path.join(__dirname, '../src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Récupérer les variables depuis les variables d'environnement
const instagramToken = process.env.INSTAGRAM_TOKEN || '';
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY || '';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const firebaseApiKey = process.env.FIREBASE_API_KEY || '';
const firebaseAuthDomain = process.env.FIREBASE_AUTH_DOMAIN || '';
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || '';
const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET || '';
const firebaseMessagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID || '';
const firebaseAppId = process.env.FIREBASE_APP_ID || '';

// Contenu du fichier d'environnement
const envFileContent = `
export const environment = {
  production: true,
  instagramToken: '${instagramToken}',
  stripePublicKey: '${stripePublicKey}',
  stripeSecretKey: '${stripeSecretKey}',
  firebase: {
    apiKey: '${firebaseApiKey}',
    authDomain: '${firebaseAuthDomain}',
    projectId: '${firebaseProjectId}',
    storageBucket: '${firebaseStorageBucket}',
    messagingSenderId: '${firebaseMessagingSenderId}',
    appId: '${firebaseAppId}'
  }
};
`;

// Écrire les fichiers d'environnement
fs.writeFileSync(path.join(envDir, 'environment.ts'), envFileContent);
fs.writeFileSync(path.join(envDir, 'environment.development.ts'), envFileContent.replace('production: true', 'production: false'));

console.log('Environment files generated successfully');