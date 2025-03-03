<?php
$servername = "localhost";  // Thay thế với tên máy chủ của bạn
$username = "root";         // Thay thế với tên người dùng của bạn
$password = "";             // Thay thế với mật khẩu của bạn
$dbname = "checklist";      // Tên cơ sở dữ liệu

// Tạo kết nối
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>
