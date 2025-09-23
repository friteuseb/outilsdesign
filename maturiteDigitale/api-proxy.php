<?php
/**
 * API Proxy pour l'audit de maturité digitale
 * Permet de contourner les restrictions CORS en faisant les appels API côté serveur
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Seulement accepter les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit();
}

// Lire les données JSON de la requête
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Données JSON invalides']);
    exit();
}

// Valider les paramètres requis
$requiredFields = ['provider', 'apiKey', 'prompt'];
foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Paramètre manquant: $field"]);
        exit();
    }
}

$provider = $input['provider'];
$apiKey = $input['apiKey'];
$prompt = $input['prompt'];

// Configuration des endpoints
$configs = [
    'anthropic' => [
        'url' => 'https://api.anthropic.com/v1/messages',
        'headers' => [
            'Content-Type: application/json',
            'x-api-key: ' . $apiKey,
            'anthropic-version: 2023-06-01'
        ],
        'body' => [
            'model' => 'claude-3-sonnet-20240229',
            'max_tokens' => 4000,
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ]
        ]
    ],
    'openai' => [
        'url' => 'https://api.openai.com/v1/chat/completions',
        'headers' => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey
        ],
        'body' => [
            'model' => 'gpt-4-turbo-preview',
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
            'max_tokens' => 4000
        ]
    ],
    'gemini' => [
        'url' => 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . $apiKey,
        'headers' => [
            'Content-Type: application/json'
        ],
        'body' => [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]
    ],
    'grok' => [
        'url' => 'https://api.x.ai/v1/chat/completions',
        'headers' => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey
        ],
        'body' => [
            'model' => 'grok-beta',
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ],
            'max_tokens' => 4000
        ]
    ]
];

if (!isset($configs[$provider])) {
    http_response_code(400);
    echo json_encode(['error' => 'Provider non supporté: ' . $provider]);
    exit();
}

$config = $configs[$provider];

// Initialiser cURL
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $config['url'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($config['body']),
    CURLOPT_HTTPHEADER => $config['headers'],
    CURLOPT_TIMEOUT => 60,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_USERAGENT => 'MaturiteDigitale-Proxy/1.0'
]);

// Exécuter la requête
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

// Gérer les erreurs cURL
if ($error) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur de connexion à l\'API',
        'details' => $error
    ]);
    exit();
}

// Transmettre le code de statut HTTP
http_response_code($httpCode);

if ($response === false) {
    echo json_encode(['error' => 'Aucune réponse de l\'API']);
    exit();
}

// Parser et formater la réponse selon le provider
$responseData = json_decode($response, true);

if (!$responseData) {
    echo json_encode([
        'error' => 'Réponse JSON invalide de l\'API',
        'raw_response' => $response
    ]);
    exit();
}

// Normaliser la réponse selon le provider
try {
    switch ($provider) {
        case 'anthropic':
            if (isset($responseData['content'][0]['text'])) {
                $text = $responseData['content'][0]['text'];
            } else {
                throw new Exception('Format de réponse Anthropic inattendu');
            }
            break;

        case 'openai':
            if (isset($responseData['choices'][0]['message']['content'])) {
                $text = $responseData['choices'][0]['message']['content'];
            } else {
                throw new Exception('Format de réponse OpenAI inattendu');
            }
            break;

        case 'gemini':
            if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
                $text = $responseData['candidates'][0]['content']['parts'][0]['text'];
            } else {
                throw new Exception('Format de réponse Gemini inattendu');
            }
            break;

        case 'grok':
            if (isset($responseData['choices'][0]['message']['content'])) {
                $text = $responseData['choices'][0]['message']['content'];
            } else {
                throw new Exception('Format de réponse Grok inattendu');
            }
            break;

        default:
            throw new Exception('Provider non géré: ' . $provider);
    }

    // Retourner la réponse normalisée
    echo json_encode([
        'success' => true,
        'provider' => $provider,
        'text' => $text,
        'raw_response' => $responseData
    ]);

} catch (Exception $e) {
    echo json_encode([
        'error' => 'Erreur de parsing: ' . $e->getMessage(),
        'raw_response' => $responseData
    ]);
}

// Log pour debug (optionnel - à retirer en production)
error_log("API Proxy - Provider: $provider, Status: $httpCode, Response length: " . strlen($response));
?>