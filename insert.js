document.addEventListener("DOMContentLoaded", function () {
    const nameSelect = document.getElementById("name-select");
    const customNameContainer = document.getElementById("custom-name-container");
    const customNameInput = document.getElementById("custom-name");
    const selectAllCheckbox = document.getElementById("select-all");
    const typeSelect = document.getElementById("type-select");
    const insertBtn = document.getElementById("insert-btn");

    // Xử lý hiển thị "CÔNG VIỆC KHÁC"
    typeSelect.addEventListener("change", function () {
        if ([...typeSelect.selectedOptions].some(option => option.value === "other")) {
            customNameContainer.style.display = "block";
        } else {
            customNameContainer.style.display = "none";
            customNameInput.value = "";
        }
    });

    // Cập nhật giá trị khi nhập "CÔNG VIỆC KHÁC"
    customNameInput.addEventListener("input", function () {
        const otherOption = [...typeSelect.options].find(option => option.value === "other");
        if (customNameInput.value.trim() !== "") {
            otherOption.value = customNameInput.value;
            otherOption.textContent = customNameInput.value;
        } else {
            otherOption.value = "other";
            otherOption.textContent = "CÔNG VIỆC KHÁC";
        }
    });

    // Xử lý "Chọn tất cả"
    selectAllCheckbox.addEventListener("change", function () {
        const allOptions = typeSelect.options;
        const isChecked = selectAllCheckbox.checked;
        for (let option of allOptions) {
            if (option.value !== "other") {
                option.selected = isChecked;
            }
        }
    });

    function alertsuccess(title, name) {
        Swal.fire({
            icon: "success",
            title: "THÊM THÀNH CÔNG " + title + " KHU VỰC " + name,
            draggable: true,
            showConfirmButton: false,
            timer: 1500
        });
    }

    function autoRefresh() {
        let timerInterval;
        Swal.fire({
            title: "Tự động tải lại trang",
            html: "Đang tự động tải lại trang.",
            timer: 1200,
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
                console.log("Đóng bởi timer");
            }
        });
    }

    // Hàm tính mốc thời gian theo định dạng "YYYY-MM-DD HH:00:00"
    function getThresholdTimestamp() {
        const now = new Date();
        const currentHour = now.getHours();
        let targetHour;
        if (currentHour < 13) {
            targetHour = 10;
        } else if (currentHour < 16) {
            targetHour = 13;
        } else {
            targetHour = 16;
        }
        const year = now.getFullYear();
        const month = ("0" + (now.getMonth() + 1)).slice(-2);
        const day = ("0" + now.getDate()).slice(-2);
        return `${year}-${month}-${day} ${("0" + targetHour).slice(-2)}:00:00`;
    }

    // Hàm lấy timestamp hiện tại theo định dạng "YYYY-MM-DD HH:MM:SS"
    function getCurrentTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = ("0" + (now.getMonth() + 1)).slice(-2);
        const day = ("0" + now.getDate()).slice(-2);
        const hour = ("0" + now.getHours()).slice(-2);
        const minute = ("0" + now.getMinutes()).slice(-2);
        const second = ("0" + now.getSeconds()).slice(-2);
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    // Hàm autoInsert sử dụng async/await:
    // Insert cho tất cả các nhóm NAME và TYPE nếu chưa có dữ liệu với mốc thời gian đó, đợi xong mới chuyển hướng.
    async function autoInsert() {
        const timestamp = getThresholdTimestamp();
        console.log("Thời gian mốc tính được (autoInsert):", timestamp);

        // Bước 1: Kiểm tra dữ liệu đã có cho mốc thời gian này chưa
        try {
            const response = await fetch("api/get_checklist.php?date=" + encodeURIComponent(timestamp));
            const data = await response.json();
            console.log("Kết quả kiểm tra autoInsert:", data);
            // Lọc các bản ghi có TODAY chính xác bằng timestamp
            const existing = Array.isArray(data) ? data.filter(item => item.TODAY === timestamp) : [];
            if (existing.length > 0) {
                console.log("Đã có dữ liệu cho mốc giờ", timestamp, ". Chuyển hướng sang scan.html...");
                window.location.href = "scan.html?datetime=" + encodeURIComponent(timestamp);
                return;
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra dữ liệu autoInsert:", error);
            return;
        }

        // Bước 2: Định nghĩa các nhóm NAME và TYPE tương ứng theo yêu cầu của bạn
        const groups = {
            "KHO CHÍNH": ["BÀN GHẾ", "SÀN NHÀ", "PCCC", "TƯỜNG", "THÙNG RÁC", "KV TẬP KẾT RÁC", "MÁY NƯỚC NÓNG"],
            "XUNG QUANH": ["BÀN GHẾ", "SÀN NHÀ", "PCCC", "TƯỜNG", "THÙNG RÁC", "KV TẬP KẾT RÁC", "MÁY NƯỚC NÓNG"],
            "VĂN PHÒNG": ["BÀN GHẾ", "SÀN NHÀ", "PCCC", "TƯỜNG", "THÙNG RÁC", "KV TẬP KẾT RÁC", "MÁY NƯỚC NÓNG"],
            "KHO ĐÔNG": ["BÀN GHẾ", "SÀN NHÀ", "PCCC", "TƯỜNG", "THÙNG RÁC", "KV TẬP KẾT RÁC", "MÁY NƯỚC NÓNG"],
            "WC": ["BỒN RỬA TAY", "SÀN NHÀ", "BỆ NGỒI WC", "THÙNG RÁC", "NƯỚC RỬA TAY", "MÙI GƯƠNG", "XỊT KHUẨN"],
            "DV VỆ SINH": [
                "LAU BÀN GHẾ",
                "LAU VĂN PHÒNG",
                "XỊT KHUẨN NHÀ VỆ SINH",
                "DỌN DẸP THÙNG CARTON",
                "LAU CỬA KÍNH",
                "QUÉT, LAU LINE KỆ",
                "MÁY NƯỚC NÓNG",
                "LAU TỦ ĐÔNG, MÁT",
                "LAU, XỊT KHUẨN PHÒNG NGHỈ",
                "LAU, XỊT KHUẨN PHÒNG HỌP",
                "LAU, XỊT KHUẨN BÀN GHẾ NHÀ ĂN",
                "VỆ SINH MÁY PHOTO"
            ],
            "DV BAO VE": [
                "KHẨU TRANG NHÂN VIÊN, NCC, NVC",
                "KÍNH CHẮN NCC, NVC",
                "XỊT KHUẨN NHÂN VIÊN, NCC, NVC",
                "KHAI BÁO Y TẾ NHÂN VIÊN RA VÀO",
                "KIỂM TRA NHÂN VIÊN, PHƯƠNG TIỆN RA KHO",
                "ĐIỀU TIẾT, SẮP XẾP XE GỌN GÀNG",
                "GHI PHIẾU GỬI XE CHO NHÂN VIÊN",
                "KHÔNG CHO NHÂN VIÊN, NCC HÚT THUỐC KHU VỰC KHO",
                "KIỂM TRA SEAL NIÊM PHONG XE",
                "KIỂM TRA SEAL NIÊM PHONG CÁC CỔNG RA VÀO KHO",
                "CHÂM CỒN CÁC VỊ TRÍ"
            ]
        };

        // Bước 3: Insert cho tất cả các nhóm
        const insertionPromises = [];
        for (const [groupName, tasks] of Object.entries(groups)) {
            for (const task of tasks) {
                const id = Math.floor(100000 + Math.random() * 900000);
                const code = `${groupName}-${task}`;
                console.log("Đang auto insert:", { id, name: groupName, task, today: timestamp, code });
                const p = fetch("api/insert.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        id,
                        name: groupName,
                        type: task,
                        today: timestamp,
                        code,
                        createdAt: getCurrentTimestamp(),
                        updatedAt: getCurrentTimestamp()
                    })
                })
                .then(r => r.json())
                .then(result => {
                    if (!result.success) {
                        console.error("Lỗi insert cho", groupName, task, result.error);
                    } else {
                        console.log("Insert thành công cho", groupName, task);
                    }
                    return result;
                })
                .catch(err => {
                    console.error("Lỗi fetch insert cho", groupName, task, err);
                    return err;
                });
                insertionPromises.push(p);
            }
        }

        // Bước 4: Đợi tất cả insert hoàn thành
        await Promise.all(insertionPromises);
        console.log("Tất cả insert đã hoàn thành. Chuyển hướng sang scan.html...");
        window.location.href = "scan.html?datetime=" + encodeURIComponent(timestamp);
    }

    // Gọi autoInsert() ngay khi DOM load
    autoInsert();

    // Xử lý nút "Thêm dữ liệu" (thủ công)
    insertBtn.addEventListener("click", function () {
        let selectedTypes = [...typeSelect.selectedOptions].map(option => option.value);
        if (selectedTypes.length === 0) {
            alert("❌ Vui lòng chọn ít nhất một công việc!");
            return;
        }
        let name = nameSelect.value;
        if (name === "other") {
            name = customNameInput.value.trim();
            if (!name) {
                alert("❌ Vui lòng nhập tên công việc khác!");
                return;
            }
        }
        const currentDateTime = getThresholdTimestamp();
        const nowTimestamp = getCurrentTimestamp();
        selectedTypes.forEach(type => {
            const id = Math.floor(100000 + Math.random() * 900000);
            const code = `${name}-${type}`;
            console.log("📝 Đang thêm dữ liệu (thủ công):", { id, name, type, today: currentDateTime, code, createdAt: nowTimestamp, updatedAt: nowTimestamp });
            fetch("api/insert.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    id,
                    name,
                    type,
                    today: currentDateTime,
                    code,
                    createdAt: nowTimestamp,
                    updatedAt: nowTimestamp
                })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error("❌ Lỗi khi thêm:", data.error);
                } else {
                    alertsuccess(type, name);
                    autoRefresh();
                }
            })
            .catch(error => {
                console.error("❌ Lỗi khi gửi request:", error);
            });
        });
    });
});
