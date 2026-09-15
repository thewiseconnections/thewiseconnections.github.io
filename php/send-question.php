<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $subject = htmlspecialchars($input['subject'] ?? '');
    $email = htmlspecialchars($input['email'] ?? '');
    $message = htmlspecialchars($input['message'] ?? '');
    
    if (!$subject || !$email || !$message) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    $to = 'thewiseconnections@gmail.com';
    $emailSubject = "WISE Contact: " . $subject;
    $emailBody = "From: $email\n\nSubject: $subject\n\nMessage:\n$message";
    $headers = "From: $email\r\n";
    
    if (mail($to, $emailSubject, $emailBody, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Question sent successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error sending question. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
