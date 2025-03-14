// netlify/functions/instagram.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // Autorisations CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET'
  };

  // Si c'est une requête OPTIONS (pré-vol CORS), retourner juste les entêtes
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }
  
  try {
    // Récupérer le token depuis les variables d'environnement
    const token = process.env.INSTAGRAM_TOKEN;
    if (!token) {
      throw new Error('Token Instagram non configuré');
    }
    
    // Récupérer le paramètre limit de la requête ou utiliser une valeur par défaut
    const limit = event.queryStringParameters?.limit || 12;
    
    // Champs à récupérer
    const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
    
    // Appel à l'API Instagram
    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}&limit=${limit}`
    );
    
    // Retourner les données à l'application
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Erreur Instagram API:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erreur lors de la récupération des données Instagram',
        message: error.message
      })
    };
  }
};