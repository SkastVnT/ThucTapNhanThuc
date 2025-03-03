let checklistData = [];
let html5QrCode;

// Fetch checklist data từ API
async function fetchChecklistData(selectedDate) {
    try {
        // Gọi API với tham số 'date' (đã encode để an toàn)
        const response = await fetch(`api/fetchdata.php?date=${encodeURIComponent(selectedDate)}`);
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            console.error("❌ Dữ liệu không phải là mảng!", data);
            return;
        }
        console.log("✅ Dữ liệu nhận được từ API:", data);
        checklistData = data;
        renderChecklist();
    } catch (error) {
        console.error("❌ Lỗi tải dữ liệu:", error);
    }
}


// 📝 **Hiển thị danh sách công việc**
function renderChecklist() {
    console.log("📝 Bắt đầu render checklist...", checklistData);
    if (!Array.isArray(checklistData)) {
        console.error("❌ Dữ liệu không phải là mảng!", checklistData);
        return;
    }
    const container = document.getElementById("checklist-container");
    container.innerHTML = ""; // Xóa nội dung cũ

    // Lấy giá trị filter từ dropdown
    const filterSelect = document.getElementById("filter-name");
    const filterValue = filterSelect ? filterSelect.value : "all";

    // Định nghĩa màu sắc
    const bgColor = "#2a9df4";
    const hdColor = "#003366";
    const textColor = "#ffffff";

    // Nhóm công việc theo NAME
    const groupedTasks = {};
    checklistData.forEach(item => {
        if (!groupedTasks[item.NAME]) {
            groupedTasks[item.NAME] = [];
        }
        groupedTasks[item.NAME].push(item);
    });

    // Duyệt qua từng nhóm NAME để hiển thị
    Object.keys(groupedTasks).forEach(name => {
        if (filterValue !== "all" && name !== filterValue) {
            return;
        }
        // Thêm tiêu đề nhóm
        const sectionTitle = document.createElement("h3");
        sectionTitle.textContent = "CÁC CÔNG VIỆC CỦA " + name;
        sectionTitle.className = "task-section-title";
        sectionTitle.style.backgroundColor = hdColor;
        sectionTitle.style.color = textColor;
        sectionTitle.style.padding = "10px";
        sectionTitle.style.borderRadius = "5px";
        container.appendChild(sectionTitle);

        // Tạo khung chứa nhóm
        const taskWrapper = document.createElement("div");
        taskWrapper.className = "task-wrapper";
        taskWrapper.style.backgroundColor = bgColor;
        taskWrapper.style.color = textColor;
        taskWrapper.style.padding = "10px";
        taskWrapper.style.borderRadius = "5px";
        taskWrapper.style.marginBottom = "10px";

        groupedTasks[name].forEach(item => {
            const section = document.createElement("div");
            section.className = "checklist-item";

            // Tạo checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = item.CHECK_VS == 1;
            checkbox.dataset.id = item.id;
            checkbox.addEventListener("change", function () {
                updateCheckStatus(this.dataset.id, this.checked ? "1" : "0");
            });

            // Tạo label hiển thị thông tin
            const label = document.createElement("label");
            let message = `(Ngày: ${item.TODAY}) `;

            if (item.CHECK_VS == 1) {
                message += `(Đã kiểm tra vào: ${item.updatedAt}) ✅ ĐÃ HOÀN THÀNH`;
            } else {
                message += `(Đã tạo bảng checklist vào: ${item.createdAt}) ❌ CHƯA HOÀN THÀNH`;
            }

            label.textContent = `${item.TYPE} ${message}`;
            label.style.color = textColor;

            section.appendChild(checkbox);
            section.appendChild(label);
            taskWrapper.appendChild(section);
        });

        container.appendChild(taskWrapper);
    });
}

// Cập nhật trạng thái checkbox vào database
function updateCheckStatus(id, status) {
    console.log(`🔄 Cập nhật CHECK_VS cho ID ${id}: ${status}`);

    // Lấy thời gian hiện tại theo múi giờ UTC+07:00 (Bangkok, Hanoi, Jakarta)
    let now = new Date();
    let utc7Offset = 7 * 60 * 60 * 1000; // Offset tính bằng mili giây
    let localTime = new Date(now.getTime() + utc7Offset);
    let updatedAt = localTime.toISOString().slice(0, 19).replace("T", " ");

    fetch('api/check.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 
            id: id, 
            check: status,
            updatedAt: updatedAt  // Gửi thời gian đúng múi giờ
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Server phản hồi:", data);
        if (data.success) {
            let index = checklistData.findIndex(item => item.id == id);
            if (index !== -1) {
                checklistData[index].CHECK_VS = Number(status);
                checklistData[index].updatedAt = updatedAt; // Cập nhật updatedAt trên giao diện
                renderChecklist();
            }
        }
    })
    .catch(error => {
        console.error("❌ Lỗi cập nhật:", error);
    });
}



function alertsuccess(title,name){
    Swal.fire({
        icon: "success",
        title:"THÊM THÀNH CÔNG" + " " + title + " " + "KHU VỰC" + " " + name,
        draggable:true,
        showConfirmButton: false,
        timer: 1500
      });
}

function alertQRsuccess(title,name){
    Swal.fire({
        icon: "success",
        title:"Quét QR thành công!!",
        draggable:true,
        showConfirmButton: false,
        timer: 1000
      });
}

function autoRefresh() {
    let timerInterval;
    Swal.fire({
    title: "Tự động tải lại trang",
    html: "Đang tự động tải lại trang.",
    timer: 500,
    timerProgressBar: true,
    didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
        timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
    },
    willClose: () => {
        clearInterval(timerInterval);
        location.reload();
    }
    }).then((result) => {
        
    if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
    }
    });
}

// Xử lý quét QR thành công
function onScanSuccess(decodedText) {
    alert("📷 Mã QR quét được: " + decodedText);
    const code = decodedText.trim();

    console.log("🔍 Đang tìm kiếm trong checklist với CODE:", code);

    let foundItem = checklistData.find(item => item.CODE === code);

    if (foundItem) {
        if (Number(foundItem.CHECK_VS) === 0) { // ✅ Sửa lỗi so sánh kiểu dữ liệu
            console.log("✅ Mục tìm thấy:", foundItem);

            fetch('api/check.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ id: foundItem.id, check: 1 }) // ✅ Cập nhật trạng thái CHECK_VS = 1
            })
            .then(response => response.json()) // ✅ Đọc phản hồi JSON
            .then(data => {
                if (data.success) {
                    foundItem.CHECK_VS = 1; // ✅ Cập nhật giá trị trên client
                    alertQRsuccess();
                    fetchChecklistData(); // ✅ Tải lại dữ liệu sau khi cập nhật
                    
                    autoRefresh();
                } else {
                    alert("❌ Lỗi: " + data.error);
                }
            })
            .catch(error => {
                console.error("❌ Lỗi cập nhật:", error);
            });

        } else {
            alert("✅ Mục này đã được kiểm tra trước đó.");
        }
    } else {
        alert("❌ Không tìm thấy mục trong checklist. Hãy kiểm tra lại dữ liệu!");
        console.warn("🔴 Dữ liệu hiện tại:", checklistData);
    }

    stopQRCodeScanner(); // Tắt camera ngay sau khi quét
}


// Xử lý lỗi quét QR
function onScanFailure(error) {
    console.warn(`QR scan error: ${error}`);
}

// Bắt đầu quét QR
async function startQRCodeScanner() {
    try {
        const hasPermission = await Html5Qrcode.getCameras();
        if (hasPermission && hasPermission.length > 0) {
            if (!html5QrCode) {
                html5QrCode = new Html5Qrcode("reader");
            }

            html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                onScanSuccess,
                onScanFailure
            );

            document.getElementById("scan-btn").style.display = "none"; 
            document.getElementById("rescan-btn").style.display = "none"; // Ẩn nút "Quét lại"
        } else {
            // alert("Không tìm thấy camera. Vui lòng kiểm tra thiết bị.");
        }
    } catch (error) {
        if (error.name === "NotAllowedError") {
            alert("Bạn cần cấp quyền truy cập camera để quét mã QR.");
        } else {
            // alert("Lỗi khi khởi động camera: " + error.message);
        }
    }
}

// Dừng camera sau khi quét
function stopQRCodeScanner() {
    if (html5QrCode) {
        html5QrCode.stop()
            .then(() => {
                console.log("📷 Camera đã dừng lại.");
                document.getElementById("scan-btn").style.display = "none"; // Ẩn nút ban đầu
                document.getElementById("rescan-btn").style.display = "block"; // Hiện nút "Quét lại"
            })
            .catch(error => {
                console.error("❌ Lỗi khi dừng camera:", error);
            });
    }
}

// Xử lý sự kiện khi DOM đã tải
document.addEventListener("DOMContentLoaded", function () {
    const filterSelect = document.getElementById("filter-name");
    if (filterSelect) {
        filterSelect.addEventListener("change", function () {
            renderChecklist();
        });
    }
    const urlParams = new URLSearchParams(window.location.search);
    // Nếu URL chứa 'date' thì sử dụng nó, nếu không thì thử lấy 'datetime'
    let selectedDate = urlParams.get('date') || urlParams.get('datetime');
    
    if (!selectedDate) {
        console.error("❌ Không tìm thấy tham số 'date' hoặc 'datetime' trên URL.");
        return;
    }
    
    console.log("Đang tải dữ liệu cho ngày:", selectedDate);
    fetchChecklistData(selectedDate);

    let scanButton = document.getElementById("scan-btn");
    let rescanButton = document.getElementById("rescan-btn");

    if (!scanButton || !rescanButton) {
        console.error("❌ Lỗi: Không tìm thấy nút quét hoặc quét lại. Kiểm tra lại HTML.");
        return;
    }

    scanButton.addEventListener("click", function () {
        console.log("▶️ Bắt đầu quét QR!");
        scanButton.style.display = "none"; // Ẩn nút ban đầu
        rescanButton.style.display = "none"; // Ẩn nút "Quét lại"
        startQRCodeScanner();
    });

    rescanButton.addEventListener("click", function () {
        console.log("🔄 Quét lại mã QR!");
        rescanButton.style.display = "none"; // Ẩn nút "Quét lại"
        startQRCodeScanner();
    });
});

// 🏷️ Dừng camera sau khi quét thành công
function stopQRCodeScanner() {
    if (html5QrCode) {
        html5QrCode.stop()
            .then(() => {
                console.log("📷 Camera đã dừng lại.");
                document.getElementById("scan-btn").style.display = "none"; // Ẩn nút quét ban đầu
                document.getElementById("rescan-btn").style.display = "block"; // Hiện nút "Quét lại"
            })
            .catch(error => {
                console.error("❌ Lỗi khi dừng camera:", error);
            });
    }
}





// // Gọi hàm để tải dữ liệu
// fetchChecklistData();
// startQRCodeScanner();
