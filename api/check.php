<?php
require 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $check = $_POST['check']; // 1 hoặc 0

    if (!isset($id) || !isset($check)) {
        echo json_encode(["error" => "Thiếu tham số"]);
        exit;
    }

    $sql = "UPDATE khuvuc SET CHECK_VS = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $check, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Cập nhật thành công"]);
    } else {
        echo json_encode(["error" => "Lỗi cập nhật"]);
    }

    $stmt->close();
    $conn->close();
}
?>
