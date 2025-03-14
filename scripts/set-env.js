const fs = require('fs');

// Récupérer le token depuis les variables d'environnement
const instagramToken = process.env.INSTAGRAM_TOKEN || 'development_token';

// Contenu du fichier d'environnement
const envFileContent = `
export const environment = {
  production: true,
  instagramToken: '${instagramToken}'
};
`;

// Écrire le fichier
fs.writeFileSync('./src/environments/environment.prod.ts', envFileContent);
console.log('Environment file generated');