/**
 * Binding $ và $$ cho querySelector và querySelectorAll để tiện sử dụng
 * Author: TxBach (13/10/2022)
 * Done
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Khởi tạo biến toàn cục
 * Author: TxBach (13/10/2022)
 * Done
 */
let rightClick = $(".right__click");
let numberChecked = $(".content-above__left-number");
let count = 0;
let isCheck = false;
let mode = "Add";
let isMinSidebar = false;
let id = 0;
let employee = [];
let unit = [];
let pageNumber = 1;
let pageSize = 10;
let totalRecord = null;
let filter = null;

/**
 * Xử lý sự kiện khi window load
 * Author: TxBach (13/10/2022)
 * Done
 */
window.onload = () => {
    loadData();
};

/**
 * Load data
 * Author: TxBach (22/10/2022)
 * Done
 */
let loadData = () => {
    initEvents();
    getData();
    getUnit();
};

/**
 * Khởi tạo và chạy một số hàm và sự kiện
 * Author: TxBach (13/10/2022)
 * Done
 */
let initEvents = () => {
    let checkNumber = /[0-9]/g;
    let checkAllNumber = /^\d+$/;
    let checkPhone = /^\d{10}$/;
    let checkEMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let code = $(
        ".popup__content-first-block .textfield-code .textfield__input"
    );
    let name = $(
        ".popup__content-first-block .textfield-name .textfield__input"
    );
    let dr = $(".dropdown-unit .dropdown__wrap");
    let dob = $(".textfield-dob .textfield__input");
    let date = $(".textfield-date .textfield__input");
    let userId = $(".textfield-id .textfield__input");
    let phoneNum = $(
        ".textfield-second-block .textfield:first-child .textfield__input"
    );
    let phone = $(
        ".textfield-second-block .textfield:nth-child(2) .textfield__input"
    );
    let email = $(
        ".textfield-second-block .textfield:nth-child(3) .textfield__input"
    );
    try {
        $(".wrap-loading").style.display = "block";
        setTimeout(() => {
            $(".wrap-loading").style.display = "none";
            // randomData();
            handleClickSidebar();
            clickARow();
            clickEdit();
            hideFunctionTable();
            clickFunctionTable();
            dblClickRow();
            clickDeleteFromTable();
            // For whole app
            document.addEventListener("keydown", listenShortcuts);
            document.addEventListener("contextmenu", contextMenu);
            document.addEventListener("click", hideContextMenu);
            // Main
            $(".content-above__right .main__content-wrap .icon-refresh").addEventListener("click", reloadData);
            $(".icon-min-sidebar").addEventListener("click", collapseSidebar);
            $(".toolbar__add").addEventListener("click", addNewStaff);
            $(".overlay").addEventListener("click", closePopup);
            $(".icon-cancel").parentNode.addEventListener("click", closePopup);
            $(".popup__btn-cancel").addEventListener("click", closePopup);
            $(".popup__checkbox-group:nth-child(3) input").addEventListener("blur", refocus);
            $('.main__content-table thead input[type="checkbox"]').addEventListener("click", checkAllRows);
            $(".content-above__left-cancel").addEventListener("click", uncheckedAllRows);
            $(".btn-delete").addEventListener("click", deleteAllRows);
            $(".popup__btn-save").addEventListener("click", saveOrEdit);
            $(".noti__remind .noti__remind-action-icon").addEventListener("click", closeRemind);
            clickDropdown($(".dropdown-pagination"));
            clickDropdown($(".dropdown-unit"));
            // Validate
            code.addEventListener("blur", () => checkCode(code.value));
            name.addEventListener("blur", () => checkName(name.value, checkNumber));
            dr.addEventListener("blur", () => checkUnit(dr.querySelector(".dropdown__title").innerText));
            dob.addEventListener("blur", () => checkDOB(dob.value));
            date.addEventListener("blur", () => checkDateGiving(date.value));
            userId.addEventListener("blur", () => checkId(userId.value, checkAllNumber));
            phoneNum.addEventListener("blur", () => checkPhoneNum(phoneNum.value, checkPhone));
            phone.addEventListener("blur", () => checkTelephone(phone.value, checkAllNumber));
            email.addEventListener("blur", () => checkMail(email.value, checkEMail));
        }, 1000);
    } catch (err) {
        console.log(err);
    }
};

/**
 * Done
 */
$('.content-above__right .textfield__input').addEventListener('change', () => 
    {
        filter = $('.content-above__right .textfield__input').value; 
        loadData();
    });

/**
 * Random dữ liệu trong table
 * Author: TxBach (13/10/2022)
 * Done
 */
let randomData = () => {
    for (let i = 0; i < 10; i++) {
        let day = Math.floor(Math.random() * 30 + 1);
        let month = Math.floor(Math.random() * 12 + 1);
        $(".main__content-table tbody").innerHTML += `
            <tr>
                <td><input type="checkbox" /></td>
                <td>${i < 9 ? `NV00${i + 1}` : `NV0${i + 1}`}</td>
                <td>Nhân viên ${String.fromCharCode(i + 65)}</td>
                <td>${Math.floor(Math.random() * 2) == 0 ? "Nữ" : "Nam"}</td>
                <td>
                    ${day < 10 ? `0${day}` : day}/${
            month < 10 ? `0${month}` : month
        }/${Math.floor(Math.random() * 3 + 2000)}
                </td>
                <td>001${Math.floor(Math.random() * 100000000 + 200000000)}</td>
                <td>${
                    Math.floor(Math.random() * 2) == 0 ? "Trưởng" : "Phó"
                } nhóm</td>
                <td>Phòng chiến lược</td>
                <td>10${Math.floor(
                    Math.random() * 1000000000 + 6000000000
                )}</td>
                <td>VPBank</td>
                <td>Hoàng Mai</td>
                <td>
                    <div
                        class="main__content-table-wrap row"
                    >
                        <span>Sửa</span>
                        <div
                            class="main__content-label row"
                        >
                            <div
                                class="icon-blue-down"
                            ></div>
                        </div>
                        <ul
                            class="main__content-function-hidden unselect"
                        >
                            <li>Xóa</li>
                        </ul>
                        <div class="overlay-func"></div>
                    </div>
                </td>
            </tr>
        `;
    }
};

/**
 * Reset data trong hệ thống
 * Author: TxBach (22/10/2022)
 * Done
 */
let resetDataSystem = () => {
    employee = [];
    unit = [];
    id = 0;
    $(".main__content-table tbody").innerHTML = "";
    $(".content-above__left").style.visibility = "hidden";
    $('.main__content-table thead input[type="checkbox"]').checked = false;
};

/**
 * API: GET Lấy dữ liệu nhân viên từ api về
 * Author: TxBach (20/10/2022)
 * Done
 */
let getData = () => {
    resetDataSystem();
    // Gọi api
    fetch(`http://localhost:60825/api/v1/Employees/filter?${filter ? `keyword=${filter}` : ''}&limit=${pageSize}&offset=${pageNumber}`, {
        method: "GET",
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then((res) => res.json())
        .then((res) => {
            for (const temp of res._Data) {
                let day, month, year, day1, month1, year1 = "";
                let date = temp.dateOfBirth;
                let date1 = temp.identityDate;
                if (date) {
                    let dob = new Date(date);
                    day = dob.getDate() > 9 ? dob.getDate() : `0${dob.getDate()}`;
                    month = dob.getMonth() + 1 > 9 ? dob.getMonth() + 1 : `0${dob.getMonth() + 1}`;
                    year = dob.getFullYear();
                }
                if (date1) {
                    let idenDate = new Date(date1);
                    day1 = idenDate.getDate() > 9 ? idenDate.getDate() : `0${idenDate.getDate()}`;
                    month1 = idenDate.getMonth() + 1 > 9 ? idenDate.getMonth() + 1 : `0${idenDate.getMonth() + 1}`;
                    year1 = idenDate.getFullYear();
                }
                employee.push({
                    Id: id,
                    EmployeeId: temp.employeeID,
                    EmployeeCode: temp.employeeCode,
                    EmployeeName: temp.employeeName,
                    DepartmentName: temp.departmentName,
                    EmployeePosition: temp.positionName,
                    DateOfBirth: date !== null ? `${day}/${month}/${year}` : "",
                    Gender: temp.gender,
                    IdentityNumber: temp.identityNumber,
                    IdentityDate:
                        date1 !== null ? `${day1}/${month1}/${year1}` : "",
                    IdentityPlace: temp.identityPlace,
                    Address: temp.address,
                    PhoneNumber: temp.phoneNumber,
                    TelephoneNumber: temp.telephoneNumber,
                    Email: temp.email,
                    BankAccountNumber: temp.bankAccountNumber,
                    BankName: temp.bankName,
                    BankBranchName: temp.bankBranchName,
                });
                id++;
            }
            fillData();
            totalRecord = res._TotalCount;
            $(".pagination__left-total").innerText = totalRecord;
            updatePage(totalRecord);
            let right = $(".pagination__right-control-next");
            if (Math.ceil(totalRecord / pageSize) == pageNumber) {
                right.children[0].classList.add("icon-arrow-right-disabled");
                right.children[0].classList.remove("icon-arrow-right");
            } else {
                if (right.children[0].classList.contains("icon-arrow-right-disabled")) {
                    right.children[0].classList.add("icon-arrow-right");
                    right.children[0].classList.remove("icon-arrow-right-disabled");
                }
            }
        })
        .catch((res) => {
            openRemind("failed", res);
            console.log(res);
        });
};

/**
 * API: GET Lấy dữ liệu đơn vị
 * Author: TxBach (22/10/2022)
 * Done
 */
let getUnit = () => {
    $(".dropdown-unit .options__wrap").innerHTML = `
        <li class="option active">
            <span>Đơn vị</span>
            <i
                class="fa-solid fa-check"
            ></i>
        </li>
    `;
    // Gọi api
    fetch("http://localhost:60825/api/v1/Department", { method: "GET" })
        .then((res) => res.json())
        .then((res) => {
            for (const temp of res) {
                unit.push({
                    DepartmentName: temp.departmentName,
                    DepartmentId: temp.departmentID,
                });
            }
            fillUnit();
        })
        .catch((res) => {
            openRemind("failed", res);
            console.log(res);
        });
    // Kiểm tra kết quả trả về => đưa ra thông báo
};

/**
 * API: POST Xử lý sự kiện click button "Cất và thêm"
 * Author: TxBach (19/10/2022)
 * Done
 */
let saveOrEdit = () => {
    // Validate
    let isValid = validate();

    if (isValid) {
        // Thu thập dữ liệu
        let tempEmployee = {
            ...isValid,
        };

        if (mode === "Add") {
            // Gọi api
            fetch("http://localhost:60825/api/v1/Employees", {
                method: "POST",
                body: JSON.stringify(tempEmployee),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    if (res.devMsg) {
                        openRemind("failed", res.userMsg);
                    }
                    else {
                        openRemind("success", "Thêm mới thành công");
                        closePopup();
                        loadData();
                    }
                })
                .catch((res) => {
                    openRemind("failed", res.userMsg);
                });
        } else if (mode === "Edit") {
            let entityId = null;

            employee.forEach((item) => {
                if (item.EmployeeCode === tempEmployee.employeeCode) {
                    entityId = item.EmployeeId;
                }
            });

            // Gọi api
            fetch(`http://localhost:60825/api/v1/Employees/${entityId}`, {
                method: "PUT",
                body: JSON.stringify(tempEmployee),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.status !== 200) {
                        openRemind("failed", "Sửa thất bại");
                    }
                    if (!res.status) {
                        openRemind("success", "Sửa thành công");
                        closePopup();
                        loadData();
                    }
                })
                .catch((res) => {
                    if (res.status !== 200) {
                        openRemind("failed", res.userMsg);
                    }
                });
        }
    }
};

/**
 * API: DELETE xóa nhân viên
 * Author: TxBach (22/10/2022)
 * Done
 */
let deleteEmployee = (entityId) => {
    console.log(entityId);
    // Gọi api
    fetch(`http://localhost:60825/api/v1/Employees/${entityId}`, {
        method: "DELETE",
    })
        .then((res) => {
            if (res.status !== 200) {
                openRemind("failed", res.statusText);
            } else {
                openRemind("success", "Xóa thành công nhân viên.");
                if ($(".content-above__left").style.visibility !== "hidden") {
                    let temp = parseInt(
                        $(".content-above__left-number").innerText
                    );
                    temp -= 1;
                    numberChecked.innerText = temp + "";
                }
                loadData();
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

/**
 * Xử lý khi nhập vào ô input search
 * Author: TxBach (23/10/2022)
 * Done
 */
let hanldeSearch = () => {
    searchEmployee($('.content-above__right .textfield__input').value);
}

/**
 * Open remind
 * Author: TxBach (22/10/2022)
 * Done
 */
let openRemind = (type, msg) => {
    if (type === "success") {
        $(".noti__remind-status").className = "noti__remind-status success";
        $(".noti__remind-text").innerText = "Thành công!";
        $(".noti__remind-icon").innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
        `;
    }
    if (type === "failed") {
        $(".noti__remind-status").className = "noti__remind-status failed";
        $(".noti__remind-text").innerText = "Lỗi!";
        $(".noti__remind-icon").innerHTML = `
            <i class="fa-solid fa-circle-xmark"></i>
        `;
    }
    if (type === "warning") {
        $(".noti__remind-status").className = "noti__remind-status warning";
        $(".noti__remind-text").innerText = "Cảnh báo!";
        $(".noti__remind-icon").innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
        `;
    }
    if (type === "info") {
        $(".noti__remind-status").className = "noti__remind-status info";
        $(".noti__remind-text").innerText = "Thông tin!";
        $(".noti__remind-icon").innerHTML = `
            <i class="fa-solid fa-circle-info"></i>
        `;
    }
    $(".noti__remind .noti__remind-msg span:nth-child(2)").innerText = msg;
    $(".noti__remind").style.display = "inline-block";
    setTimeout(() => {
        closeRemind();
    }, 2000);
};

/**
 * Close remind
 * Author: TxBach (22/10/2022)
 * Done
 */
let closeRemind = () => {
    $(".noti__remind").style.display = "none";
};

/**
 * Update pageSize and pageNumber
 * Author: TxBach (22/10/2022)
 * Done
 */
let updatePage = (totalRecord) => {
    $(".pagination__right-num").innerText = `${pageSize * (pageNumber - 1) + 1} - ${pageSize * pageNumber > totalRecord ? totalRecord : pageSize * pageNumber}`;
};

/**
 * Fill unit to popup
 * Author: TxBach (22/10/2022)
 * Done
 */
let fillUnit = () => {
    unit.forEach((item) => {
        $(".dropdown-unit .options__wrap").innerHTML += `
            <li class="option">
                <span>${item.DepartmentName}</span>
            </li>
        `;
    });
};

/**
 * GET: Lấy lại dữ liệu
 * Author: TxBach (21/10/2022)
 * Done
 */
let reloadData = () => {
    resetDataSystem();
    filter = null;
    loadData();
};

/**
 * Fill dữ liệu lên table
 * Author: TxBach (20/10/2022)
 * Done
 */
let fillData = () => {
    for (let i = 0; i < employee.length; i++) {
        $(".main__content-table tbody").innerHTML += `
            <tr>
                <td><input type="checkbox" /></td>
                <td>${employee[i].EmployeeCode || ""}</td>
                <td>${employee[i].EmployeeName || ""}</td>
                <td>${
                    employee[i].Gender == 0 ? "Nữ"
                    : employee[i].Gender == 1 ? "Nam"
                    : employee[i].Gender == 2 ? "Khác" : "" || ""
                }</td>
                <td>${employee[i].DateOfBirth || ""}</td>
                <td>${employee[i].IdentityNumber || ""}</td>
                <td>${employee[i].EmployeePosition || ""}</td>
                <td>${employee[i].DepartmentName || ""}</td>
                <td>${employee[i].BankAccountNumber || ""}</td>
                <td>${employee[i].BankName || ""}</td>
                <td>${employee[i].BankBranchName || ""}</td>
                <td>
                    <div
                        class="main__content-table-wrap row"
                    >
                        <span>Sửa</span>
                        <div
                            class="main__content-label row"
                        >
                            <div
                                class="icon-blue-down"
                            ></div>
                        </div>
                        <ul
                            class="main__content-function-hidden unselect"
                        >
                            <li>Xóa</li>
                        </ul>
                        <div class="overlay-func"></div>
                    </div>
                </td>
            </tr>
        `;
    }
};

/**
 * Xử lý sự kiện phím tắt
 * Author: TxBach (13/10/2022)
 * Done
 */
let listenShortcuts = (e) => {
    // Insert - thêm
    if (e.keyCode === 45) {
        mode = "Add";
        openPopup();
    }
    // Enter - xem
    if (e.keyCode === 13) {
    }
    // F2 - sửa
    if (e.keyCode === 113) {
    }
    // Delete - xóa
    if (e.keyCode === 46) {
        if (count !== 0) {
        }
    }
    // Ctrl + F8 - Lưu
    if (e.keyCode === 17 && e.keyCode === 119) {
    }
    // Ctrl + F9 - Hủy
    if (e.ctrlKey && e.keyCode === 120) {
        if ($(".noti__action-delete").style.display === "block") {
            let overlay = $(".noti__action-delete + .overlay");
            stateNoti($(".noti__action-delete"), overlay, "none");
        }
        if (($(".wrap-popup").style.display = "block")) closePopup();
    }
    // Esc - đóng popup
    if (e.keyCode === 27) {
        closePopup();
    }
    // Ctrl + F3 - Hủy
    if (e.keyCode === 17 && e.keyCode === 114) {
    }
    // Insert hoặc Ctrl + Insert - Thêm dòng trên ds
    if (e.keyCode === 17 && e.keyCode === 46) {
    }
    // Delete hoặc Ctrl + Delete - Xóa dòng trên ds
    if (e.keyCode === 17 && e.keyCode === 46) {
    }
};

/**
 * Xử lý sự kiện click vào 1 item trong sidebar thì active
 * Author: TxBach (13/10/2022)
 * Done
 */
let handleClickSidebar = () => {
    let sidebars = $$(".sidebar__item");
    sidebars.forEach((item) => {
        item.addEventListener("click", () => {
            sidebars.forEach((i) => {
                if (i.classList.contains("active")) {
                    i.classList.remove("active");
                }
            });
            item.classList.add("active");
        });
    });
};

/**
 * API: GET lấy mã nhân viên mới
 * Author: TxBach (23/10/2022)
 * Done
 */
let getNewEmployeeCode = () => {
    // Gọi api
    fetch("http://localhost:60825/api/v1/Employees/NewEmployeeCode", { 
        method: "GET",
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then((res) => res.json())
        .then((res) => {
            $(".textfield-code .textfield__input").value = res;
        })
        .catch((res) => {
            openRemind("failed", 'Có lỗi trong việc tạo mới nhân viên.');
            console.log(res);
        });
}

/**
 * Mở popup
 * Author: TxBach (13/10/2022)
 * Done
 */
let openPopup = (msg = "Thêm mới nhân viên | AMIS Kế toán - MISA") => {
    resetPopup();
    if (mode === "Edit") {
        $(".textfield-code .textfield__input").disabled = true;
        $(".wrap-popup .popup__header-left h1:first-child").innerText =
            "Sửa nhân viên";
        $(".wrap-popup .popup__btn-save").innerText = "Cất và sửa";
    } else if (mode === "Add") {
        getNewEmployeeCode();
        $(".textfield-code .textfield__input").disabled = false;
        $(".wrap-popup .popup__header-left h1:first-child").innerText =
            "Thông tin nhân viên";
        $(".wrap-popup .popup__btn-save").innerText = "Cất và thêm";
    }
    document.title = msg;
    $(".wrap-popup").style.display = "block";
    $(".overlay").style.display = "block";
    $(".textfield-code .textfield__input").focus();
};

/**
 * Đóng popup
 * Author: TxBach (13/10/2022)
 * Done
 */
let closePopup = () => {
    document.title = "AMIS Kế toán - MISA";
    $(".wrap-popup").style.display = "none";
    $(".overlay").style.display = "none";
};

/**
 * Xử lý sự kiện click vào button "Thêm mới nhân viên" => Mở popup
 * Author: TxBach (13/10/2022)
 * Done
 */
let addNewStaff = () => {
    mode = "Add";
    openPopup();
};

/**
 * Reset input trong popup
 * Author: TxBach (21/10/2022)
 * Done
 */
let resetInput = (ips) => {
    ips.forEach((ip) => {
        ip.value = "";
    });
};

/**
 * Reset checkbox trong popup
 * Author: TxBach (21/10/2022)
 * Done
 */
let resetChecked = (ips) => {
    ips.forEach((ip) => {
        ip.checked = false;
    });
};

/**
 * Reset dữ liệu trong popup khi đóng
 * Author: TxBach (13/10/2022)
 * Done
 */
let resetPopup = () => {
    $$(".popup .textfield").forEach((item) => {
        if (item.classList.contains("error")) {
            item.classList.remove("error");
        }
    });
    if ($(".popup .dropdown-unit").classList.contains("error")) {
        $(".popup .dropdown-unit").classList.remove("error");
        $(".popup .dropdown").style.borderColor = "#e6e6e6";
    }
    resetInput($$('.popup input[type="text"]'));
    resetChecked($$('.popup input[type="checkbox"]'));
    resetChecked($$('.popup input[type="radio"]'));
    resetInput($$('.popup input[type="date"]'));
    $('input[type="radio"]:first-child').checked = true;
    let dr = $(".dropdown-unit");
    dr.querySelector(".dropdown__title").innerText = "Đơn vị";
    dr.querySelector(".dropdown__title").style.color = "#9e9e9e";
    dr.querySelector(".options").style.display = "none";
    dr.querySelector(".dropdown__desc").style.display = "none";
    dr.querySelectorAll(".option").forEach((item) => {
        if (item.classList.contains("active")) {
            item.classList.remove("active");
            item.removeChild(dr.querySelector(".fa-solid.fa-check"));
        }
    });
    let opt1 = dr.querySelector(".option:first-child");
    let child = document.createElement("i");
    child.className = "fa-solid fa-check";
    opt1.appendChild(child);
    opt1.classList.add("active");
};

/**
 * Xử lý sự kiện tab ra ngoài popup => refocus lại vào input đầu trong popup
 * Author: TxBach (13/10/2022)
 * Done
 */
let refocus = () => {
    $(".textfield-code .textfield__input").focus();
};

/**
 * Xử lý sự kiện click phải chuột - context menu
 * Author: TxBach (13/10/2022)
 * Done
 */
let contextMenu = (e) => {
    e.preventDefault();
    rightClick.style.top = `${e.clientY}px`;
    rightClick.style.left = `${e.clientX}px`;
    rightClick.style.transition = "rightClick 0.18s ease-in";
    rightClick.style.display = "block";
};

/**
 * Ẩn context menu
 * Author: TxBach (13/10/2022)
 * Done
 */
let hideContextMenu = () => {
    rightClick.style.display = "none";
};

/**
 * Set thuộc tính cho sidebar khi co và giãn
 * Author: TxBach (21/10/2022)
 * Done
 */
let stateSidebar = (type = false) => {
    let sidebars = $$(".sidebar__item");
    let sideBarItems = $$(".sidebar__item-text");
    let headerLeft = $(".header__left");
    let headerRightWrap = $(".header__right-wrap");
    sideBarItems.forEach((sideBarItem) => {
        sideBarItem.style.display = type ? "none" : "block";
    });
    sidebars.forEach((i) => {
        i.style.padding = type ? "10px 12px 10px 17px" : "10px 12px";
        type ? (i.title = i.querySelector('[class|="icon"]').getAttribute("val")) : i.setAttribute("title", "");
    });
    headerLeft.style.display = type ? "none" : "flex";
    $(".header__right-start").style.paddingLeft = type ? "0" : "16px";
    headerRightWrap.style.backgroundColor = type ? "var(--teal-700)" : "white";
    headerRightWrap.style.width = type ? "73px" : "16px";
    headerRightWrap.querySelector(".tooltip").innerHTML = type
        ? "Phóng to menu"
        : "Thu gọn menu";
    headerRightWrap.querySelector(".tooltip").style.left = type
        ? "18px"
        : "-10px";
    type
        ? (headerRightWrap.querySelector(".tooltip").style.width = "130px")
        : (headerRightWrap.querySelector(".tooltip").style.minWidth = "110px");
    $(".header__right-icon").classList.remove(
        type ? "icon-min-sidebar" : "icon-bars"
    );
    $(".header__right-icon").classList.add(
        type ? "icon-bars" : "icon-min-sidebar"
    );
    document.documentElement.style.setProperty(
        "--sidebar-width",
        type ? "73px" : "200px"
    );
};

/**
 * Xử lý sự kiện click "Thu gọn menu" => Thu gọn sidebar
 * Author: TxBach (13/10/2022)
 * Done
 */
let collapseSidebar = () => {
    isMinSidebar = !isMinSidebar;
    if (isMinSidebar) {
        stateSidebar(true);
    } else {
        stateSidebar();
    }
};

/**
 * Thay đổi màu background của các hàng trong table
 * Author: TxBach (13/10/2022)
 * Done
 */
let changeBg = (items, color) => {
    items.forEach((item) => {
        item.style.backgroundColor = color;
    });
};

/**
 * Xử lý sự kiện double click vào 1 hàng trong table
 * Author: TxBach (20/10/2022)
 * Done
 */
let dblClickRow = () => {
    $$("tbody tr").forEach((item) => {
        item.addEventListener("dblclick", () => {
            openPopEdit(item);
        });
    });
};

/**
 * Xử lý sự kiện check tất cả các checkbox trong table
 * Author: TxBach (13/10/2022)
 * Done
 */
let checkAllRows = () => {
    let cBoxs = $$('tbody input[type="checkbox"]');
    if (
        $('.main__content-table thead input[type="checkbox"]').checked === true
    ) {
        isCheck = true;
    } else {
        isCheck = false;
    }
    cBoxs.forEach((cbox) => {
        cbox.checked = isCheck;
        if (isCheck) {
            count = cBoxs.length;
            changeBg(
                $$(".main__content-table tbody td:nth-child(1)"),
                "var(--teal-50)"
            );
            changeBg(
                $$(".main__content-table tbody td:nth-child(2)"),
                "var(--teal-50)"
            );
            changeBg(
                $$(".main__content-table tbody td:nth-child(3)"),
                "var(--teal-50)"
            );
            changeBg(
                $$(".main__content-table tbody td:last-child"),
                "var(--teal-50)"
            );
            cbox.parentNode.parentNode.classList.add("tr-active");
            cbox.addEventListener("click", () => {
                if (count < $$('tbody input[type="checkbox"]').length) {
                    $(
                        '.main__content-table thead input[type="checkbox"]'
                    ).checked = false;
                }
            });
        } else {
            count = 0;
            changeBg($$(".main__content-table tbody td:nth-child(1)"), "white");
            changeBg($$(".main__content-table tbody td:nth-child(2)"), "white");
            changeBg($$(".main__content-table tbody td:nth-child(3)"), "white");
            changeBg($$(".main__content-table tbody td:last-child"), "white");
            cbox.parentNode.parentNode.classList.remove("tr-active");
        }
    });
    if (count) $(".content-above__left").style.visibility = "unset";
    else $(".content-above__left").style.visibility = "hidden";
    numberChecked.innerText = count;
};

/**
 * Xử lý sự kiện unchecked tất cả các checkbox trong table
 * Author: TxBach (13/10/2022)
 * Done
 */
let uncheckedAllRows = () => {
    let cBoxs = $$('tbody input[type="checkbox"]');
    isCheck = false;
    count = 0;
    cBoxs.forEach((cbox) => {
        cbox.checked = isCheck;
        cbox.parentNode.parentNode.classList.remove("tr-active");
    });
    changeBg($$(".main__content-table tbody td:nth-child(1)"), "white");
    changeBg($$(".main__content-table tbody td:nth-child(2)"), "white");
    changeBg($$(".main__content-table tbody td:nth-child(3)"), "white");
    changeBg($$(".main__content-table tbody td:last-child"), "white");
    $('thead input[type="checkbox"]').checked = isCheck;
    $(".content-above__left").style.visibility = "hidden";
    numberChecked.innerText = count;
};

/**
 * Xử lý sự kiện click 1 hàng trong table
 * Author: TxBach (13/10/2022)
 * Done
 */
let clickARow = () => {
    $$('tbody input[type="checkbox"]').forEach((ip) => {
        ip.addEventListener("click", () => {
            let tr = ip.parentNode.parentNode;
            if (ip.checked == true) {
                count++;
                tr.classList.add("tr-active");
                tr.querySelector("td:nth-child(1)").style.backgroundColor =
                    "var(--teal-50)";
                tr.querySelector("td:nth-child(2)").style.backgroundColor =
                    "var(--teal-50)";
                tr.querySelector("td:nth-child(3)").style.backgroundColor =
                    "var(--teal-50)";
                tr.querySelector("td:last-child").style.backgroundColor =
                    "var(--teal-50)";
                if (count == $$('tbody input[type="checkbox"]').length) {
                    $(
                        '.main__content-table thead input[type="checkbox"]'
                    ).checked = true;
                }
            } else {
                count--;
                tr.querySelector("td:nth-child(1)").style.backgroundColor =
                    "white";
                tr.querySelector("td:nth-child(2)").style.backgroundColor =
                    "white";
                tr.querySelector("td:nth-child(3)").style.backgroundColor =
                    "white";
                tr.querySelector("td:last-child").style.backgroundColor =
                    "white";
                tr.classList.remove("tr-active");
            }
            if (count) $(".content-above__left").style.visibility = "unset";
            else $(".content-above__left").style.visibility = "hidden";
            numberChecked.innerText = count;
        });
    });
};

/**
 * Xử lý sự kiện click "Xóa" trong cột "Chức năng" của table
 * Author: TxBach (20/10/2022)
 * Done
 */
let clickDeleteFromTable = () => {
    $$(".main__content-function-hidden").forEach((item) => {
        item.addEventListener("click", () => {
            let parent = item.parentNode.parentNode;
            let over = parent.querySelector(".overlay-func");
            over.style.display = "none";
            item.style.display = "none";
            let noti = $(".noti__action-delete");
            let overlay = $(".noti__action-delete + .overlay");
            $(
                ".noti__action-delete .noti__action-header-title"
            ).innerText = `Xóa nhân viên`;
            $(
                ".noti__action-delete .noti__action-content"
            ).innerText = `Nhân viên bạn đang chọn sẽ bị xóa?`;
            stateNoti(noti, overlay, "block");
            overlay.addEventListener("click", () => {
                stateNoti(noti, overlay, "none");
            });
            noti.querySelector(".noti__action-header-close").addEventListener(
                "click",
                () => {
                    stateNoti(noti, overlay, "none");
                }
            );
            noti.querySelector(".btn:first-child").addEventListener(
                "click",
                () => {
                    stateNoti(noti, overlay, "none");
                }
            );
            noti.querySelector(".btn:last-child").addEventListener(
                "click",
                () => {
                    stateNoti(noti, overlay, "none");
                    deleteEmployee(
                        employee.find(
                            (elem) =>
                                elem.EmployeeCode ===
                                parent.parentNode.querySelector(
                                    "td:nth-child(2)"
                                ).innerText
                        ).EmployeeId
                    );
                }
            );
        });
    });
};

/**
 * Xử lý sự kiện khi click dấu mũi tên trong cột "Chức năng" trong table
 * Author: TxBach (13/10/2022)
 * Done
 */
let clickFunctionTable = () => {
    let contentLabel = $$(".main__content-label");
    contentLabel.forEach((label) => {
        label.addEventListener("click", () => {
            let contentWrap = label.parentNode;
            let subFunc = contentWrap.querySelector(
                ".main__content-function-hidden"
            );
            contentWrap.querySelector(".overlay-func").style.display = "block";
            $$(".main__content-function-hidden").forEach((item) => {
                if (item != subFunc) {
                    item.style.display = "none";
                }
            });
            if (subFunc.style.display == "block") {
                subFunc.style.display = "none";
            } else {
                subFunc.style.display = "block";
            }
            let curr = label.parentNode.parentNode.parentNode;
            curr.querySelector("td:last-child").style.zIndex = "1";
            $$(".main__content-table tbody tr").forEach((item) => {
                if (item != curr) {
                    item.querySelector("td:first-child").style.zIndex = "0";
                    item.querySelector("td:nth-child(2)").style.zIndex = "0";
                    item.querySelector("td:nth-child(3)").style.zIndex = "0";
                    item.querySelector("td:last-child").style.zIndex = "0";
                }
            });
        });
    });
};

/**
 * Xử lý sự kiện ẩn sublist trong cột "Chức năng" của table
 * Author: TxBach (13/10/2022)
 * Done
 */
let hideFunctionTable = () => {
    $$(".overlay-func").forEach((item) => {
        item.addEventListener("click", () => {
            item.style.display = "none";
            $$(".main__content-function-hidden").forEach((item) => {
                item.style.display = "none";
            });
        });
    });
};

/**
 * Xử lý sự kiện mở popup để Sửa thông tin nhân viên
 * Author: TxBach (19/10/2022)
 * Done
 */
let openPopEdit = (par) => {
    let temp = null;
    mode = "Edit";
    openPopup("Sửa nhân viên | AMIS Kế toán - MISA");
    let id = ($(".textfield-code .textfield__input").value =
        par.querySelector("td:nth-child(2)").innerText);
    for (let i = 0; i < employee.length; i++) {
        if (employee[i].EmployeeCode === id) {
            temp = employee[i];
            break;
        }
    }
    $(".textfield-name .textfield__input").value = temp.EmployeeName;
    $(".textfield-title .textfield__input").value = temp.EmployeePosition;
    let d = temp.DateOfBirth.split("/");
    let date = d[2] + "-" + d[1] + "-" + d[0];
    $(".textfield-dob .textfield__input").value = temp.DateOfBirth ? date : "";
    if (temp.Gender === 0) {
        $("#textfield__checkbox-female").checked = true;
    } else if (temp.Gender === 2) {
        $("#textfield__checkbox-other").checked = true;
    }
    $(".textfield-id .textfield__input").value = temp.IdentityNumber;
    d = temp.IdentityDate.split("/");
    date = d[2] + "-" + d[1] + "-" + d[0];
    $(".textfield-date .textfield__input").value = temp.IdentityDate
        ? date
        : "";
    $(".textfield-location .textfield__input").value = temp.IdentityPlace;
    $(".textfield-first-block .textfield__input").value = temp.Address;
    $(
        ".textfield-second-block .textfield:first-child .textfield__input"
    ).value = temp.PhoneNumber;
    $(
        ".textfield-second-block .textfield:nth-child(2) .textfield__input"
    ).value = temp.TelephoneNumber;
    $(
        ".textfield-second-block .textfield:nth-child(3) .textfield__input"
    ).value = temp.Email;
    $(
        ".textfield-third-block .textfield:nth-child(1) .textfield__input"
    ).value = temp.BankAccountNumber;
    $(
        ".textfield-third-block .textfield:nth-child(2) .textfield__input"
    ).value = temp.BankName;
    $(
        ".textfield-third-block .textfield:nth-child(3) .textfield__input"
    ).value = temp.BankBranchName;
    // Xử lý dropdown
    $$(".popup__content-first-block #dropdown .option").forEach((opt) => {
        if (opt.querySelector("span").innerText == temp.DepartmentName) {
            $("#dropdown.dropdown-unit .dropdown__title").innerText =
                temp.DepartmentName;
            $$(".popup__content-first-block #dropdown .option").forEach(
                (item) => {
                    if (item.classList.contains("active")) {
                        item.classList.remove("active");
                        item.removeChild(
                            item.querySelector(".fa-solid.fa-check")
                        );
                    }
                }
            );
            let child = document.createElement("i");
            child.className = "fa-solid fa-check";
            opt.appendChild(child);
            opt.classList.add("active");
            $("#dropdown .dropdown__title").style.color = "#212121";
        }
    });
};

/**
 * Xử lý sự kiện click "Sửa" => Mở popup
 * Author: TxBach (13/10/2022)
 * Done
 */
let clickEdit = () => {
    $$(".main__content-table-wrap span:first-child").forEach((item) => {
        item.addEventListener("click", () => {
            openPopEdit(item.parentNode.parentNode.parentNode);
        });
    });
};

/**
 * Xử lý sự kiện click "Xóa" hết trên toolbar
 * Author: TxBach (13/10/2022)
 * Done
 */
let deleteAllRows = () => {
    let noti = $(".noti__action-delete");
    let overlay = $(".noti__action-delete + .overlay");
    $(".noti__action-delete .noti__action-header-title").innerText = `Xóa ${count} nhân viên`;
    $(".noti__action-delete .noti__action-content").innerText = `Các viên bạn đang chọn sẽ bị xóa?`;
    stateNoti(noti, overlay, "block");
    overlay.addEventListener("click", () => {
        stateNoti(noti, overlay, "none");
    });
    noti.querySelector(".noti__action-header-close").addEventListener("click", 
        () => {
            stateNoti(noti, overlay, "none");
        }
    );
    noti.querySelector(".btn:first-child").addEventListener("click", () => {
        stateNoti(noti, overlay, "none");
    });
    noti.querySelector(".btn:last-child").addEventListener("click", () => {
        if (count == $$('tbody input[type="checkbox"]').length) {
            $('.main__content-table thead input[type="checkbox"]').checked = false;
        }
        let c = $$('tbody input[type="checkbox"]').length;
        $$('.main__content-table tbody input[type="checkbox"]').forEach(
            (item) => {
                if (item.checked) {
                    $(".main__content-table tbody").removeChild(
                        item.parentNode.parentNode
                    );
                }
            }
        );
        c -= count;
        $(".content-above__left").style.visibility = "hidden";
        numberChecked.innerText = count = 0;
        stateNoti(noti, overlay, "none");
    });
};

/**
 * Đóng popup thông báo
 * Author: TxBach (20/10/2022)
 * Done
 */
let stateNoti = (noti, overlay, type) => {
    noti.style.display = type;
    overlay.style.display = type;
};

/**
 * Xử lý sự kiện chọn value của dropdown hoặc combobox
 * Author: TxBach (13/10/2022)
 * Desc: isInput = false => dropdown = true
 * Done
 */
let chooseVal = (elem, isInput = false) => {
    let valu = isInput
        ? elem.querySelector(".combobox__input")
        : elem.querySelector(".dropdown__title");
    let opts = elem.querySelectorAll(".option");
    opts.forEach((opt) => {
        opt.addEventListener("click", () => {
            let selectedOption = opt.innerText;
            if (isInput) {
                valu.value = "";
                valu.placeholder = selectedOption;
                elem.querySelectorAll(".option").forEach((item) => {
                    if (item.classList.contains("active")) {
                        item.classList.remove("active");
                        item.removeChild(
                            elem.querySelector(".fa-solid.fa-check")
                        );
                    }
                });
            } else {
                valu.innerText = selectedOption;
                elem.querySelectorAll(".option").forEach((item) => {
                    if (item.classList.contains("active")) {
                        item.classList.remove("active");
                        item.removeChild(
                            elem.querySelector(".fa-solid.fa-check")
                        );
                    }
                });
                let child = document.createElement("i");
                child.className = "fa-solid fa-check";
                opt.appendChild(child);
            }
            opt.classList.add("active");
            valu.style.color = "#212121";
            if (
                pageSize != selectedOption &&
                elem.classList.contains("dropdown-pagination")
            ) {
                if (pageNumber !== 1) {
                    pageNumber = 1;
                    let left = $(".pagination__right-control-prev");
                    left.querySelector(".icon-arrow-left").classList.add(
                        "icon-arrow-left-disabled"
                    );
                    left.querySelector(".icon-arrow-left").classList.remove(
                        "icon-arrow-left"
                    );
                }
                pageSize = selectedOption;
                loadData();
            }
        });
    });
};

/**
 * Xử lý sự kiện click dropdown
 * Author: TxBach (13/10/2022)
 * Done
 */
let clickDropdown = (dr) => {
    let isClickDropdown = false;
    dr.addEventListener("click", () => {
        isClickDropdown = !isClickDropdown;
        dr.querySelector(".dropdown__wrap").classList.toggle("active");
        if (isClickDropdown) {
            dr.querySelector(".dropdown").style.borderColor =
                "var(--primary-color)";
            dr.querySelector(".options").style.display = "block";
            dr.querySelector(".dropdown__desc").style.display = "none";
            chooseVal(dr);
        } else {
            dr.querySelector(".dropdown").style.borderColor = "#e6e6e6";
            dr.querySelector(".options").style.display = "none";
        }
    });
    dr.querySelector(".options .overlay-op").addEventListener("click", () => {
        dr.querySelector(".dropdown").style.borderColor = "#e6e6e6";
        dr.querySelector(".options").style.display = "none";
        if (dr.classList.contains("error")) {
            dr.querySelector(".dropdown__desc").style.display = "block";
        }
    });
};

/**
 * Set error cho text field
 * Author: TxBach (20/10/2022)
 * Done
 */
let setTextfield = (tf, msg) => {
    tf.classList.add("error");
    tf.querySelector(".textfield__desc").innerHTML = msg;
    tf.querySelector(".textfield__desc").title = msg;
};

/**
 * Unset error cho text field
 * Author: TxBach (20/10/2022)
 * Done
 */
let unsetTextfield = (tf) => {
    tf.classList.remove("error");
    tf.querySelector(".textfield__desc").display = "none";
};

/**
 * Validate mã nhân viên
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkCode = (code) => {
    if (!code) {
        let tf = $(".popup__content-first-block .textfield-code");
        setTextfield(tf, "Không được để trống trường này");
        $(".popup__content-first-block .textfield-code .textfield__input").focus();
        return false;
    } else {
        let tf = $(".popup__content-first-block .textfield-code");
        unsetTextfield(tf);
    }
};



/**
 * Validate tên nhân viên
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkName = (name, checkNumber) => {
    if (!name) {
        let tf = $(".popup__content-first-block .textfield-name");
        setTextfield(tf, "Không được để trống trường này");
        $(
            ".popup__content-first-block .textfield-name .textfield__input"
        ).focus();
        return false;
    } else {
        let tf = $(".popup__content-first-block .textfield-name");
        unsetTextfield(tf);
    }
    if (name.match(checkNumber)) {
        let tf = $(".popup__content-first-block .textfield-name");
        setTextfield(tf, "Tên không được chứa số");
        $(
            ".popup__content-first-block .textfield-name .textfield__input"
        ).focus();
        return false;
    } else {
        let tf = $(".popup__content-first-block .textfield-name");
        unsetTextfield(tf);
    }
};

/**
 * Validate đơn vị của nhân viên
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkUnit = (dr) => {
    if (dr === "Đơn vị") {
        $(".dropdown-unit .dropdown").style.borderColor = "#E61D1D";
        $(".dropdown-unit").classList.add("error");
        $(".dropdown-unit .dropdown__desc").innerText =
            "Không được để trống trường này";
        $(".dropdown-unit .dropdown__desc").style.display = "block";
        $(".dropdown-unit .dropdown__desc").title =
            "Không được để trống trường này";
        $(".dropdown-unit").focus();
        return false;
    } else {
        $(".dropdown-unit").classList.remove("error");
        $(".dropdown-unit .dropdown__desc").style.display = "none";
    }
};

/**
 * Validate ngày sinh
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkDOB = (dob) => {
    let today = new Date();
    let dateOB = new Date(dob);
    if (dateOB > today) {
        let tf = $(".textfield-dob");
        setTextfield(tf, "Ngày sinh không được quá ngày hôm nay");
        $(".textfield-dob .textfield__input").focus();
        return false;
    } else {
        let tf = $(".textfield-dob");
        unsetTextfield(tf);
    }
    if (today.getFullYear() - dateOB.getFullYear() < 16) {
        let tf = $(".textfield-dob");
        setTextfield(tf, "Tuổi không hợp lệ");
        $(".textfield-dob .textfield__input").focus();
        return false;
    } else {
        let tf = $(".textfield-dob");
        unsetTextfield(tf);
    }
};

/**
 * Validate ngày cấp CMND
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkDateGiving = (date) => {
    let today = new Date();
    let dateGiving = new Date(date);
    if (dateGiving > today) {
        let tf = $(".textfield-date");
        setTextfield(tf, "Ngày cấp không được quá ngày hôm nay");
        $(".textfield-date .textfield__input").focus();
        return false;
    } else {
        let tf = $(".textfield-date");
        unsetTextfield(tf);
    }
};

/**
 * Validate CMND
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkId = (userId, checkAllNumber) => {
    if (userId && !userId.match(checkAllNumber)) {
        let tf = $(".textfield-id");
        setTextfield(tf, "CMND chỉ chứa số");
        $(".textfield-id .textfield__input").focus();
        return false;
    } else {
        let tf = $(".textfield-id");
        unsetTextfield(tf);
    }
    if (userId && userId.length !== 9 && userId.length !== 12) {
        let tf = $(".textfield-id");
        setTextfield(tf, "CMND phải có 9 hoặc 12 ký tự");
        $(".textfield-id .textfield__input").focus();
        return false;
    } else {
        let tf = $(".textfield-id");
        unsetTextfield(tf);
    }
};

/**
 * Validate số điện thoại
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkPhoneNum = (phoneNum, checkPhone) => {
    if (phoneNum && !phoneNum.match(checkPhone)) {
        let tf = $(".textfield-second-block .textfield:first-child");
        setTextfield(tf, "Số điện thoại không hợp lệ");
        $(
            ".textfield-second-block .textfield:first-child .textfield__input"
        ).focus();
        return false;
    } else {
        let tf = $(".textfield-second-block .textfield:first-child");
        unsetTextfield(tf);
    }
};

/**
 * Validate số điện thoại cố định
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkTelephone = (phone, checkAllNumber) => {
    if (phone && !phone.match(checkAllNumber)) {
        let tf = $(".textfield-second-block .textfield:nth-child(2)");
        setTextfield(tf, "Số điện thoại cố định không hợp lệ");
        $(
            ".textfield-second-block .textfield:nth-child(2) .textfield__input"
        ).focus();
        return false;
    } else {
        let tf = $(".textfield-second-block .textfield:nth-child(2)");
        unsetTextfield(tf);
    }
};

/**
 * Validate email
 * Author: TxBach (21/10/2022)
 * Done
 */
let checkMail = (email, checkEMail) => {
    if (email && !email.match(checkEMail)) {
        let tf = $(".textfield-second-block .textfield:nth-child(3)");
        setTextfield(tf, "Email không đúng định dạng");
        $(
            ".textfield-second-block .textfield:nth-child(3) .textfield__input"
        ).focus();
        return false;
    } else {
        let tf = $(".textfield-second-block .textfield:nth-child(3)");
        unsetTextfield(tf);
    }
};

/**
 * Validate dữ liệu
 * Author: TxBach (19/10/2022)
 * Done
 */
let validate = () => {
    let checkNumber = /[0-9]/g;
    let checkAllNumber = /^\d+$/;
    let checkPhone = /^\d{10}$/;
    let checkEMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let code = $(
        ".popup__content-first-block .textfield-code .textfield__input"
    ).value;
    let name = $(
        ".popup__content-first-block .textfield-name .textfield__input"
    ).value;
    let dr = $(".dropdown-unit .dropdown__title").innerText;
    let dob = $(".textfield-dob .textfield__input").value;
    let date = $(".textfield-date .textfield__input").value;
    let userId = $(".textfield-id .textfield__input").value;
    let phoneNum = $(
        ".textfield-second-block .textfield:first-child .textfield__input"
    ).value;
    let phone = $(
        ".textfield-second-block .textfield:nth-child(2) .textfield__input"
    ).value;
    let email = $(
        ".textfield-second-block .textfield:nth-child(3) .textfield__input"
    ).value;
    // Mã
    if (checkCode(code) === false) return false;
    // Tên
    if (checkName(name, checkNumber) === false) return false;
    // Đơn vị
    if (checkUnit(dr) === false) return false;

    // Ngày tháng
    // Ngày sinh
    if (checkDOB(dob) === false) return false;
    // Ngày cấp
    if (checkDateGiving(date) === false) return false;

    // Các thông tin đúng định dạng
    // CMND
    if (checkId(userId, checkAllNumber) === false) return false;
    // Phone number
    if (checkPhoneNum(phoneNum, checkPhone) === false) return false;
    // Điện thoại cố định
    if (checkTelephone(phone, checkAllNumber) === false) return false;
    // Email
    if (checkMail(email, checkEMail) === false) return false;

    return {
        employeeCode: code,
        employeeName: name,
        gender: $("#textfield__checkbox-male").checked
            ? 1
            : $("#textfield__checkbox-female").checked
            ? 0
            : 2,
        dateOfBirth: dob ? new Date(dob) : null,
        phoneNumber: phoneNum,
        email: email,
        address: $(".textfield-first-block .textfield__input").value,
        identityNumber: userId,
        identityDate: date ? new Date(date) : null,
        identityPlace: $(".textfield-location .textfield__input").value,
        telephoneNumber: phone,
        bankAccountNumber: $(
            ".textfield-third-block .textfield:first-child .textfield__input"
        ).value,
        bankName: $(
            ".textfield-third-block .textfield:nth-child(2) .textfield__input"
        ).value,
        bankBranchName: $(
            ".textfield-third-block .textfield:nth-child(3) .textfield__input"
        ).value,
        departmentName: dr,
        departmentId: getUnitId(dr),
        employeePosition: $(".textfield-title .textfield__input").value,
    };
};

/**
 * Lấy departmentId
 * Author: TxBach (23/10/2022)
 * Done
 */
let getUnitId = (dr) => {
    let result = null;
    unit.forEach((item) => {
        if (item.DepartmentName === dr) {
            result = item.DepartmentId;
        }
    });
    return result;
};

/**
 * Xử lý sự kiện click trang
 * Author: TxBach (22/10/2022)
 * Done
 */
let pageControl = (isNext) => { 
    let right = $(".pagination__right-control-next");
    let left = $(".pagination__right-control-prev");
    if (isNext && Math.ceil(totalRecord / pageSize) > pageNumber) {
        pageNumber++;
        if (Math.ceil(totalRecord / pageSize) == pageNumber) {
            right
                .querySelector(".icon-arrow-right")
                .classList.add("icon-arrow-right-disabled");
            right
                .querySelector(".icon-arrow-right")
                .classList.remove("icon-arrow-right");
        }
        if (left.children[0].classList.contains("icon-arrow-left-disabled")) {
            left.children[0].classList.add("icon-arrow-left");
            left.children[0].classList.remove("icon-arrow-left-disabled");
        }
        loadData();
    }
    if (!isNext && pageNumber > 1) {
        pageNumber--;
        if (pageNumber == 1) {
            left.querySelector(".icon-arrow-left").classList.add(
                "icon-arrow-left-disabled"
            );
            left.querySelector(".icon-arrow-left").classList.remove(
                "icon-arrow-left"
            );
        }
        if (right.children[0].classList.contains("icon-arrow-right-disabled")) {
            right.children[0].classList.add("icon-arrow-right");
            right.children[0].classList.remove("icon-arrow-right-disabled");
        }
        loadData();
    }
};

$(".pagination__right-control-next").addEventListener("click", () =>
    pageControl(true)
);
$(".pagination__right-control-prev").addEventListener("click", () =>
    pageControl(false)
);
