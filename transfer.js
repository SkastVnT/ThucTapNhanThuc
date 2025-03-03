// transfer.js
async function waitForDataAndTransfer() {
    // Nếu flag disableAutoTransfer được đặt, tạm thời không chuyển hướng.
    if (sessionStorage.getItem("disableAutoTransfer") === "true") {
        console.log("Auto transfer bị tạm tắt do flag.");
        return;
    }
    
    const pollInterval = 2000; // Kiểm tra mỗi 2 giây
    while (true) {
        try {
            const response = await fetch("api/get_checklist.php");
            const data = await response.json();
            console.log("Phản hồi từ API get_checklist:", data);

            if (Array.isArray(data) && data.length > 0) {
                // Nếu dữ liệu đã có, tính mốc giờ theo quy tắc:
                const now = new Date();
                const currentHour = now.getHours();
                let thresholdHour;
                if (currentHour < 13) {
                    thresholdHour = 10;
                } else if (currentHour < 16) {
                    thresholdHour = 13;
                } else {
                    thresholdHour = 16;
                }
                const year = now.getFullYear();
                const month = ("0" + (now.getMonth() + 1)).slice(-2);
                const day = ("0" + now.getDate()).slice(-2);
                const thresholdDatetime = `${year}-${month}-${day} ${("0" + thresholdHour).slice(-2)}:00:00`;
                
                console.log("Dữ liệu tồn tại. Chuyển hướng đến scan.html với datetime =", thresholdDatetime);
                window.location.href = "scan.html?datetime=" + encodeURIComponent(thresholdDatetime);
                return; // Thoát vòng lặp khi chuyển hướng
            } else {
                console.log("Chưa có dữ liệu, chờ thêm...");
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra dữ liệu:", error);
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await waitForDataAndTransfer();
});
