<?php
require 'connect.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'] ?? null;

    if (!$id) {
        echo json_encode(["error" => "Thiếu ID để xóa"]);
        exit;
    }

    $sql = "DELETE FROM khuvuc WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Lỗi khi xóa dữ liệu"]);
    }

    $stmt->close();
    $conn->close();
}
?>
