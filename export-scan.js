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

            // Tính toán cột STATUS dựa trên CHECK_VS và định dạng lại dữ liệu theo thứ tự cột mong muốn
            const desiredOrder = ["id", "NAME", "TYPE", "STATUS", "TODAY", "CODE"];
            const formattedData = data.map(row => {
                // Tính cột STATUS
                const status = row.CHECK_VS == 1 ? "✅ ĐÃ HOÀN THÀNH" : "❌ CHƯA HOÀN THÀNH";
                // Tạo đối tượng mới với cấu trúc mong muốn (các cột khác có thể được lấy từ row nếu tồn tại)
                return {
                    id: row.id,
                    NAME: row.NAME,
                    TYPE: row.TYPE,
                    STATUS: status,
                    TODAY: row.TODAY,
                    CODE: row.CODE
                };
            });

            // Tạo một mảng 2D (AOA) với tiêu đề cố định theo thứ tự desiredOrder
            const headers = desiredOrder;
            const rows = formattedData.map(row =>
                headers.map(header => row[header] !== undefined ? row[header] : "")
            );

            // Tạo workbook và worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

            // (Tùy chọn) Căn lề trái cho các ô
            const range = XLSX.utils.decode_range(ws["!ref"]);
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const colLetter = XLSX.utils.encode_col(C);
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    const cellAddress = colLetter + XLSX.utils.encode_row(R);
                    if (ws[cellAddress] && ws[cellAddress].t) {
                        ws[cellAddress].s = { alignment: { horizontal: "left" } };
                    }
                }
            }

            // (Tùy chọn) Tính độ rộng tối đa cho mỗi cột
            ws["!cols"] = headers.map((header, i) => {
                const colWidth = Math.max(header.length, ...rows.map(r => r[i].toString().length)) + 2;
                return { wch: colWidth };
            });

            XLSX.utils.book_append_sheet(wb, ws, "Toàn Bộ Dữ Liệu");

            // Xuất file Excel với tên file cố định hoặc dựa trên thời gian hiện tại
            XLSX.writeFile(wb, `DanhSachToanBo.xlsx`);

            alert("✅ Xuất Excel thành công!");
        } catch (error) {
            console.error("❌ Lỗi khi tải dữ liệu:", error);
            alert("❌ Lỗi khi xuất dữ liệu, vui lòng thử lại.");
        }
    });
});
