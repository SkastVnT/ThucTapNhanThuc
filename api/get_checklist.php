<?php
header('Content-Type: application/json');

// Bật hiển thị lỗi cho quá trình phát triển (tắt đi trong production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'connect.php'; // Đảm bảo file connect.php khởi tạo $conn

// Thay đổi tên bảng từ "checklist" sang "khuvuc" nếu đó là bảng dữ liệu của bạn
$sql = "SELECT * FROM khuvuc";

$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode([
        'success' => false,
        'error' => mysqli_error($conn)
    ]);
    exit;
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>
