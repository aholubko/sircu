<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверяем наличие всех обязательных полей
if (!isset($data['firstName']) || !isset($data['lastName']) || 
    !isset($data['email']) || !isset($data['phone']) || 
    !isset($data['message'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Tous les champs sont requis.'
    ]);
    exit;
}

// Получаем данные формы
$firstName = htmlspecialchars($data['firstName']);
$lastName = htmlspecialchars($data['lastName']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars($data['phone']);
$message = htmlspecialchars($data['message']);

// Проверяем валидность email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email invalide.'
    ]);
    exit;
}

// Email получателя
$to = 'info@cec-groupe.com';

// Тема письма
$subject = "Nouvelle demande de contact - " . $firstName . " " . $lastName;

// Тело письма
$emailMessage = "Nouvelle demande de contact reçue depuis le site web CEC Groupe\n\n";
$emailMessage .= "Informations du client:\n";
$emailMessage .= "- Nom complet: " . $firstName . " " . $lastName . "\n";
$emailMessage .= "- Email: " . $email . "\n";
$emailMessage .= "- Téléphone: " . $phone . "\n\n";
$emailMessage .= "Message:\n" . $message . "\n\n";
$emailMessage .= "---\n";
$emailMessage .= "Cet email a été envoyé automatiquement depuis le formulaire de contact du site web CEC Groupe.\n";

// Заголовки письма
$headers = "From: CEC Groupe Website <noreply@cec-groupe.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Отправляем email
$success = mail($to, $subject, $emailMessage, $headers);

if ($success) {
    echo json_encode([
        'success' => true,
        'message' => 'Votre demande a été envoyée avec succès. Nous vous répondrons sous 24h.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer plus tard ou nous contacter directement à info@cec-groupe.com'
    ]);
}
?>

