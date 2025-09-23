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
            'model' => 'claude-3-5-sonnet-20241022',
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
            'model' => 'gpt-4o',
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

// Vérifier les erreurs HTTP avant de parser
if ($httpCode >= 400) {
    $responseData = json_decode($response, true);

    // Gérer les erreurs spécifiques des APIs
    $errorMessage = "Erreur HTTP $httpCode";
    if ($responseData && isset($responseData['error'])) {
        if (is_array($responseData['error'])) {
            $errorMessage .= ": " . ($responseData['error']['message'] ?? $responseData['error']['type'] ?? 'Erreur inconnue');
        } else {
            $errorMessage .= ": " . $responseData['error'];
        }
    }

    echo json_encode([
        'error' => $errorMessage,
        'provider' => $provider,
        'http_code' => $httpCode,
        'raw_response' => $responseData
    ]);
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
            // Essayer plusieurs formats possibles pour Anthropic
            if (isset($responseData['content'][0]['text'])) {
                $text = $responseData['content'][0]['text'];
            } elseif (isset($responseData['content']) && is_array($responseData['content']) && !empty($responseData['content'])) {
                // Parfois le format peut varier
                $content = $responseData['content'][0];
                if (is_string($content)) {
                    $text = $content;
                } elseif (isset($content['text'])) {
                    $text = $content['text'];
                } else {
                    throw new Exception('Structure content Anthropic non reconnue: ' . json_encode($content));
                }
            } elseif (isset($responseData['completion'])) {
                // Ancien format API d'Anthropic
                $text = $responseData['completion'];
            } elseif (isset($responseData['text'])) {
                // Format direct
                $text = $responseData['text'];
            } else {
                throw new Exception('Aucun texte trouvé dans la réponse Anthropic. Structure: ' . json_encode(array_keys($responseData)));
            }
            break;

        case 'openai':
            if (isset($responseData['choices'][0]['message']['content'])) {
                $text = $responseData['choices'][0]['message']['content'];
            } elseif (isset($responseData['choices'][0]['text'])) {
                // Format completion API
                $text = $responseData['choices'][0]['text'];
            } else {
                throw new Exception('Format de réponse OpenAI inattendu. Structure: ' . json_encode(array_keys($responseData)));
            }
            break;

        case 'gemini':
            if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
                $text = $responseData['candidates'][0]['content']['parts'][0]['text'];
            } elseif (isset($responseData['text'])) {
                $text = $responseData['text'];
            } else {
                throw new Exception('Format de réponse Gemini inattendu. Structure: ' . json_encode(array_keys($responseData)));
            }
            break;

        case 'grok':
            if (isset($responseData['choices'][0]['message']['content'])) {
                $text = $responseData['choices'][0]['message']['content'];
            } elseif (isset($responseData['choices'][0]['text'])) {
                $text = $responseData['choices'][0]['text'];
            } else {
                throw new Exception('Format de réponse Grok inattendu. Structure: ' . json_encode(array_keys($responseData)));
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
        'http_code' => $httpCode,
        'debug_info' => [
            'response_keys' => array_keys($responseData),
            'content_type' => isset($responseData['content']) ? gettype($responseData['content']) : 'not_set'
        ]
    ]);

} catch (Exception $e) {
    // En cas d'erreur, retourner plus d'informations de debug
    echo json_encode([
        'error' => 'Erreur de parsing: ' . $e->getMessage(),
        'provider' => $provider,
        'http_code' => $httpCode,
        'raw_response' => $responseData,
        'debug_info' => [
            'response_keys' => array_keys($responseData),
            'first_key_content' => isset($responseData[array_keys($responseData)[0]]) ?
                (is_array($responseData[array_keys($responseData)[0]]) ? 'array' : substr(json_encode($responseData[array_keys($responseData)[0]]), 0, 100)) : 'none'
        ]
    ]);
}

// Log pour debug (optionnel - à retirer en production)
error_log("API Proxy - Provider: $provider, Status: $httpCode, Response length: " . strlen($response));
?>