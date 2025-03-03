<?php
require 'db.php'; // Kết nối database

$data = json_decode(file_get_contents("php://input"), true);
$code = $data['code'] ?? '';
$check = $data['check'] ?? '';

if (!$code || !$check) {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ", "received" => $data]);
    exit;
}

// Kiểm tra giá trị trước khi cập nhật
error_log("Cập nhật checkbox: Code = $code, Status = $check");

$sql = "UPDATE checklist SET check_status = ? WHERE code = ?";
$stmt = $pdo->prepare($sql);
$success = $stmt->execute([$check, $code]);

if (!$success) {
    error_log("Lỗi SQL: " . json_encode($stmt->errorInfo()));
}

echo json_encode(["success" => $success]);
?>
