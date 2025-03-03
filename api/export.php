<?php
require 'connect.php';
header('Content-Type: application/json');

// Lấy ngày hiện tại (đến cuối ngày)
$currentDateTime = date('Y-m-d 23:59:59');

// Tính ngày 2 tháng trước
$twoMonthsAgo = date('Y-m-d', strtotime('-2 months', strtotime($currentDateTime)));

$sql = "SELECT id, NAME, TYPE, CHECK_VS, TODAY, createdAt, updatedAt
        FROM khuvuc
        WHERE TODAY BETWEEN ? AND ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $twoMonthsAgo, $currentDateTime);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $row['STATUS'] = $row['CHECK_VS'] == 1
        ? "✅ ĐÃ HOÀN THÀNH"
        : "❌ CHƯA HOÀN THÀNH";
    unset($row['CHECK_VS']);
    $data[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($data);
