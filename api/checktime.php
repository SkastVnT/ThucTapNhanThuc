<?php
// File: api/checktime.php
require_once 'connect.php'; // Kết nối database

// Lấy tham số date (YYYY-MM-DD) và hour (0-23) từ client
$date = $_GET['date'] ?? '';
$hour = $_GET['hour'] ?? '';

// Truy vấn kiểm tra xem đã có dữ liệu cho ngày/giờ này chưa
// Ở đây, mình giả sử cột TODAY là DATETIME, nên dùng DATE(TODAY) và HOUR(TODAY).
// Ngoài ra, ta loại trừ "CÔNG VIỆC KHÁC" nếu muốn kiểm tra riêng.
$sql = "SELECT COUNT(*) AS count
        FROM khuvuc
        WHERE DATE(TODAY) = '$date'
          AND HOUR(TODAY) = '$hour'
          AND type != 'CÔNG VIỆC KHÁC'";

$result = mysqli_query($conn, $sql);
if ($result) {
    $row = mysqli_fetch_assoc($result);
    $exists = ($row['count'] > 0);
    echo json_encode(['exists' => $exists]);
} else {
    // Nếu có lỗi truy vấn, trả về luôn để tiện debug
    echo json_encode(['exists' => false, 'error' => mysqli_error($conn)]);
}
