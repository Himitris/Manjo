// scripts/set-env.js
const fs = require('fs');
const path = require('path');

// Assurez-vous que le dossier existe
const envDir = path.join(__dirname, '../src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Récupérer le token depuis les variables d'environnement
const instagramToken = process.env.INSTAGRAM_TOKEN || '';

// Contenu du fichier d'environnement
const envFileContent = `
export const environment = {
  production: true,
  instagramToken: '${instagramToken}'
};
`;

// Écrire les fichiers d'environnement
fs.writeFileSync(path.join(envDir, 'environment.ts'), envFileContent);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), envFileContent);

console.log('Environment files generated successfully');