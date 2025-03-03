document.addEventListener("DOMContentLoaded", function () {
    const exportAllBtn = document.getElementById("export-all-btn");

    exportAllBtn.addEventListener("click", async function () {
        console.log("📄 Đang tải toàn bộ dữ liệu để xuất Excel...");
        try {
            // Gọi API export.php để lấy toàn bộ dữ liệu
            const response = await fetch("api/export.php");
            if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                alert("❌ Không có dữ liệu để xuất.");
                return;
            }
            console.log("✅ Dữ liệu nhận được:", data);

            // Chuyển đổi dữ liệu: thêm createdAt & updatedAt
            const formattedData = data.map(row => ({
                id: row.id,
                NAME: row.NAME,
                TYPE: row.TYPE,
                STATUS: row.CHECK_VS == 1 ? "✅ ĐÃ HOÀN THÀNH" : "❌ CHƯA HOÀN THÀNH",
                TODAY: row.TODAY,
                CODE: row.CODE,
                createdAt: formatDate(row.createdAt), // Định dạng ngày
                updatedAt: formatDate(row.updatedAt)  // Định dạng ngày
            }));

            // Xác định thứ tự cột cố định
            const headers = ["id", "NAME", "TYPE", "STATUS", "TODAY", "CODE", "createdAt", "updatedAt"];

            // Tạo mảng 2D (AOA) cho SheetJS
            const rows = formattedData.map(row =>
                headers.map(header => row[header] !== undefined ? row[header] : "")
            );

            // Tạo workbook và worksheet bằng SheetJS
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

            // (Tùy chọn) Tính độ rộng tối đa cho mỗi cột
            ws["!cols"] = headers.map((header, i) => {
                const colWidth = Math.max(header.length, ...rows.map(r => r[i]?.toString().length || 0)) + 2;
                return { wch: colWidth };
            });

            XLSX.utils.book_append_sheet(wb, ws, "Toàn Bộ Dữ Liệu");

            // Xuất file Excel với tên "DanhSachToanBo.xlsx"
            XLSX.writeFile(wb, `DanhSachToanBo.xlsx`);

            alert("✅ Xuất Excel thành công!");
        } catch (error) {
            console.error("❌ Lỗi khi tải dữ liệu:", error);
            alert("❌ Lỗi khi xuất dữ liệu, vui lòng thử lại.");
        }
    });

    // Hàm định dạng ngày (YYYY-MM-DD HH:mm:ss)
    function formatDate(dateString) {
        if (!dateString) return ""; // Tránh lỗi nếu dữ liệu không có giá trị
        let d = new Date(dateString);
        let year = d.getFullYear();
        let month = String(d.getMonth() + 1).padStart(2, '0');
        let day = String(d.getDate()).padStart(2, '0');
        let hours = String(d.getHours()).padStart(2, '0');
        let minutes = String(d.getMinutes()).padStart(2, '0');
        let seconds = String(d.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
});
