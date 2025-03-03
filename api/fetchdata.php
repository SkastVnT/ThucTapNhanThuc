<?php
// Đảm bảo header trả về JSON
header('Content-Type: application/json; charset=utf-8');

require 'connect.php';

header('Content-Type: application/json');
header("Cache-Control: no-cache, must-revalidate"); // Tránh cache dữ liệu

$date = $_GET['date'] ?? '';

if (!$date) {
    echo json_encode(["error" => "Thiếu tham số ngày"]);
    exit;
}

$sql = "SELECT id, NAME, TYPE, CODE, CHECK_VS, TODAY, createdAt, updatedAt FROM khuvuc WHERE TODAY = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $row['CHECK_VS'] = (int) $row['CHECK_VS']; // Ép kiểu CHECK_VS về số
    $data[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($data);
?>
