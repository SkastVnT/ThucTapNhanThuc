document.addEventListener("DOMContentLoaded", function () {
    renderInsertCalendar();
});

function renderInsertCalendar() {
    const container = document.getElementById("calendar-container-insert");
    container.innerHTML = `
        <h3>📆 Chọn ngày để thêm dữ liệu:</h3>
        <input type="date" id="date-picker-insert" />
        <button id="confirm-date-insert" disabled>Xác nhận ngày</button>
    `;

    const datePicker = document.getElementById("date-picker-insert");
    const confirmButton = document.getElementById("confirm-date-insert");

    datePicker.addEventListener("change", function () {
        selectedInsertDate = datePicker.value;
        confirmButton.disabled = !selectedInsertDate; // Chỉ bật nút nếu đã chọn ngày
    });

    confirmButton.addEventListener("click", function () {
        console.log("📅 Ngày đã chọn để thêm dữ liệu:", selectedInsertDate);
        window.dispatchEvent(new CustomEvent("insertDateSelected", { detail: selectedInsertDate }));
    });
}
