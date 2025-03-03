// Khởi tạo dữ liệu và biến
let selectedDate = "";

// Hàm tạo giao diện lịch
function renderCalendar() {
    const calendarContainer = document.getElementById("calendar-container");
    if (!calendarContainer) {
        console.error("❌ Không tìm thấy container của lịch. Kiểm tra lại HTML.");
        return;
    }

    calendarContainer.innerHTML = `
        <h2>Chọn ngày:</h2>
        <input type="date" id="date-picker" />
        <button id="check-date-btn">Kiểm tra ngày</button>
    `;

    const datePicker = document.getElementById("date-picker");
    const checkDateBtn = document.getElementById("check-date-btn");

    checkDateBtn.addEventListener("click", function () {
        if (!datePicker.value) {
            alert("Vui lòng chọn ngày trước khi tiếp tục.");
            return;
        }

        selectedDate = datePicker.value;
        console.log("📅 Ngày đã chọn:", selectedDate);
        checkDateInDatabase(selectedDate);
    });
}

// Kiểm tra ngày đã chọn trong database
async function checkDateInDatabase(date) {
    try {
        console.log("🔄 Đang kiểm tra ngày trong database:", date);

        // Chuyển đổi định dạng ngày nếu cần
        const formattedDate = date.split("-").join("/"); // Từ YYYY-MM-DD sang YYYY/MM/DD
        console.log("📅 Ngày định dạng lại:", formattedDate);

        const response = await fetch(`api/checkdate.php?date=${formattedDate}`);
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }

        const text = await response.text();
        console.log("📥 Phản hồi từ API:", text);

        const data = JSON.parse(text);

        if (data && data.length > 0) {
            alert(`✅ Tìm thấy dữ liệu cho ngày ${date}. Hiển thị danh sách.`);
            checklistData = data;

            // Hiển thị danh sách và ẩn lịch
            renderChecklist();
            document.getElementById("calendar-container").style.display = "none";
            document.getElementById("checklist-container").style.display = "block";
        } else {
            alert(`❌ Không có dữ liệu nào cho ngày ${date}. Vui lòng chọn ngày khác.`);
        }
    } catch (error) {
        console.error("❌ Lỗi kiểm tra ngày:", error);
        alert("Có lỗi xảy ra khi kiểm tra ngày. Vui lòng thử lại.");
    }
}
