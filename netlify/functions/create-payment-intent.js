// netlify/functions/create-payment-intent.js

exports.handler = async function (event, context) {

    // Vérifier que la clé secrète est définie
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        console.error('STRIPE_SECRET_KEY n\'est pas définie');
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Configuration Stripe manquante - STRIPE_SECRET_KEY n\'est pas définie'
            })
        };
    }

    // Initialiser Stripe avec la clé secrète
    const stripe = require('stripe')(stripeSecretKey);
    // Autorisations CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Si c'est une requête OPTIONS (pré-vol CORS), retourner juste les entêtes
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    try {
        // Vérifier la méthode HTTP
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method Not Allowed' })
            };
        }

        // Récupérer les données de la requête
        const data = JSON.parse(event.body);
        const { amount, currency, description, metadata } = data;

        // Valider les données
        if (!amount || !currency) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Données invalides. Le montant et la devise sont requis.'
                })
            };
        }

        // Créer l'intention de paiement
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // En centimes (par exemple, 1000 pour 10,00 €)
            currency,
            description: description || 'Réservation Manjocarn',
            metadata: metadata || {},
        });

        // Retourner le client_secret
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                id: paymentIntent.id
            })
        };

    } catch (error) {
        console.error('Erreur lors de la création du PaymentIntent:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Erreur lors de la création du paiement',
                message: error.message
            })
        };
    }
};