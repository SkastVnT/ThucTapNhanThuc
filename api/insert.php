<?php
require 'connect.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'] ?? null;
    $name = $_POST['name'] ?? null;
    $type = $_POST['type'] ?? null;
    $today = $_POST['today'] ?? null;
    $code = $_POST['code'] ?? null;
    $createdAt = $_POST['createdAt'] ?? null;
    $updatedAt = $_POST['updatedAt'] ?? null;

    if (!$id || !$name || !$type || !$today || !$code || !$createdAt || !$updatedAt) {
        echo json_encode(["error" => "Thiếu tham số"]);
        exit;
    }

    $sql = "INSERT INTO khuvuc (id, NAME, TYPE, CHECK_VS, TODAY, CODE, createdAt, updatedAt) VALUES (?, ?, ?, 0, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit;
    }
    // 1 integer và 6 string: "issssss"
    $stmt->bind_param("issssss", $id, $name, $type, $today, $code, $createdAt, $updatedAt);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Lỗi khi thêm dữ liệu: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>
