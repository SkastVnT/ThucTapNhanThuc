document.addEventListener("DOMContentLoaded", function () {
    const deleteSelect = document.getElementById("delete-select");
    const deleteBtn = document.getElementById("delete-btn");

    // Hàm tải danh sách dữ liệu dựa trên tham số "date" trên URL
    async function loadChecklistData() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            // Lấy "datetime" hoặc "date", sau đó dùng làm giá trị của "date"
            const selectedDate = urlParams.get("datetime") || urlParams.get("date");
            if (!selectedDate) {
                console.error("Không tìm thấy tham số 'date' hoặc 'datetime' trên URL.");
                return;
            }
            console.log("🔄 Đang tải danh sách dữ liệu cho date:", selectedDate);
            const response = await fetch(`api/fetchdata.php?date=${encodeURIComponent(selectedDate)}`);
            if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
            const result = await response.json();
            let data = [];
            // Nếu API trả về trực tiếp mảng dữ liệu
            if (Array.isArray(result)) {
                data = result;
            } else if (result.data && Array.isArray(result.data)) {
                // Nếu API trả về đối tượng chứa thuộc tính "data"
                data = result.data;
            } else {
                console.error("Dữ liệu trả về không phải là mảng:", result);
                return;
            }
            // Cập nhật thẻ select với danh sách dữ liệu
            deleteSelect.innerHTML = '<option value="">-- Chọn mục để xóa --</option>';
            data.forEach(item => {
                const status = item.CHECK_VS == 1 ? "✅ ĐÃ HOÀN THÀNH" : "❌ CHƯA HOÀN THÀNH";
                const option = document.createElement("option");
                option.value = item.id;
                option.textContent = `${item.id} - ${item.NAME} - ${item.TYPE} (${status})`;
                deleteSelect.appendChild(option);
            });
            console.log("✅ Dữ liệu đã tải:", data);
        } catch (error) {
            console.error("❌ Lỗi khi tải danh sách dữ liệu:", error);
        }
    }

    // Kích hoạt nút xóa khi một mục được chọn
    deleteSelect.addEventListener("change", function () {
        deleteBtn.disabled = !deleteSelect.value;
    });

    // Xử lý xóa mục được chọn
    deleteBtn.addEventListener("click", function () {
        if (!deleteSelect.value) return;
        const idToDelete = deleteSelect.value;
        if (!confirm(`⚠ Bạn có chắc chắn muốn xóa mục ID ${idToDelete}?`)) return;
        console.log("🗑️ Đang xóa ID:", idToDelete);
        fetch("api/delete.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ id: idToDelete })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("✅ Xóa thành công!");
                loadChecklistData(); // Cập nhật lại danh sách sau khi xóa
            } else {
                alert("❌ Lỗi: " + data.error);
            }
        })
        .catch(error => {
            console.error("❌ Lỗi khi xóa:", error);
        });
    });

    // Tải danh sách khi trang load
    loadChecklistData();
});
