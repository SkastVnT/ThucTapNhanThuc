<?php
// Đảm bảo định dạng JSON trong response
header('Content-Type: application/json; charset=utf-8');

try {
    // Kết nối cơ sở dữ liệu
    include('connect.php');

    // Truy vấn dữ liệu DISTINCT TODAY
    $query = "SELECT DISTINCT TODAY FROM khuvuc";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception("Lỗi chuẩn bị truy vấn: " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    // Kiểm tra kết quả
    if ($result->num_rows > 0) {
        $dates = [];
        while ($row = $result->fetch_assoc()) {
            $dates[] = $row['TODAY'];
        }
        // Trả về JSON
        echo json_encode($dates);
    } else {
        // Không có dữ liệu nào trong bảng
        echo json_encode([
            'error' => true,
            'message' => 'Không có dữ liệu ngày hợp lệ trong cơ sở dữ liệu.'
        ]);
    }
} catch (Exception $e) {
    // Trả về lỗi dưới dạng JSON
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
} finally {
    // Đóng kết nối
    $conn->close();
}
?>
