let selectedDate = "";

// Fetch ngày từ API
async function fetchDates() {
    try {
        console.log("🔄 Đang tải dữ liệu từ API...");
        const response = await fetch("api/checkdate.php");

        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Dữ liệu ngày từ API:", data);
        return data.map(date => date.replace(/\//g, "-")); // Chuẩn hóa định dạng
    } catch (error) {
        console.error("❌ Lỗi tải dữ liệu ngày:", error);
        document.getElementById("calendar-container").innerHTML = "<p style='color: red;'>Không thể tải dữ liệu. Vui lòng thử lại!</p>";
        return [];
    }
}

// Tạo lịch và kiểm tra ngày hợp lệ
async function renderCalendar() {
    const validDates = await fetchDates();

    if (!Array.isArray(validDates) || validDates.length === 0) {
        console.error("❌ Không có ngày hợp lệ trong API.");
        document.getElementById("calendar-container").innerHTML = "<p style='color: red;'>Không có ngày hợp lệ để chọn.</p>";
        return;
    }

    const container = document.getElementById("calendar-container");
    container.innerHTML = `
        <h3>🗓️ Chọn ngày:</h3>
        <input type="date" id="date-picker" />
        <button id="confirm-date" disabled>Xác nhận</button>
    `;

    const datePicker = document.getElementById("date-picker");
    const confirmButton = document.getElementById("confirm-date");
    const message = document.createElement("p");
    message.style.color = "red";
    message.style.marginTop = "8px";
    datePicker.parentNode.appendChild(message);

    datePicker.addEventListener("change", function () {
        selectedDate = datePicker.value;
        console.log("📅 Ngày được chọn:", selectedDate);

        if (validDates.includes(selectedDate)) {
            confirmButton.disabled = false;
            confirmButton.textContent = "✅ Ngày hợp lệ! Nhấn để tiếp tục.";
            message.textContent = "";
        } else {
            confirmButton.disabled = true;
            confirmButton.textContent = "❌ Ngày không hợp lệ.";
            message.textContent = "Ngày bạn chọn không nằm trong danh sách ngày hợp lệ.";
        }
    });

    confirmButton.addEventListener("click", function () {
        if (selectedDate) {
            console.log("🔗 Điều hướng đến trang quét QR với ngày:", selectedDate);
            window.location.href = `scan.html?date=${selectedDate}`;
        }
    });
}

// Chạy khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
    renderCalendar();
});
