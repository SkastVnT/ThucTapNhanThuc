document.addEventListener("DOMContentLoaded", function () {
    const selectElements = document.querySelectorAll("select");

    selectElements.forEach(select => {
        select.classList.add("custom-select");

        select.addEventListener("focus", function () {
            this.classList.add("focused");
        });

        select.addEventListener("blur", function () {
            this.classList.remove("focused");
        });

        select.addEventListener("mouseover", function () {
            this.classList.add("hover");
        });

        select.addEventListener("mouseleave", function () {
            this.classList.remove("hover");
        });
    });

    const selectAllCheckbox = document.getElementById("select-all");
    const nameSelect = document.getElementById("name-select");

    if (selectAllCheckbox && nameSelect) {
        selectAllCheckbox.addEventListener("change", function () {
            for (let option of nameSelect.options) {
                if (option.value !== "other") {
                    option.selected = selectAllCheckbox.checked;
                }
            }
        });
    }
});
