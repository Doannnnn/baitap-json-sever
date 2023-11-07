const bodyCustomer = document.getElementById("tbCustomer");
const transferAmountInput = document.querySelector('#transferAmount');
const transactionAmountInput = document.querySelector('#total');
const loading = document.querySelector(".loading");

async function fetchAllCustomer() {
    const customers = await fetch("http://localhost:3300/customer");
    const customer = await customers.json();
    return customer;
}

const getAllCustomer = async () => {
    const customer = await fetchAllCustomer();
    console.log(customer);

    customer.forEach(item => {
        const str = renderCustomer(item);
        bodyCustomer.innerHTML += str;
    });
};

const renderCustomer = (obj) => {
    return `
        <tr id="tr_${obj.id}">
            <td>${obj.id}</td>
            <td>${obj.fullName}</td>
            <td>${obj.email}</td>
            <td>${obj.phone}</td>
            <td>${obj.address}</td>
            <td>${obj.balance}</td>
            <td>
                <button class="btn btn-outline-secondary" onclick="showModalUpdate(${obj.id})">
                    <i class="far fa-edit"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-success" data-toggle="modal" onclick="showModalDeposit(${obj.id})">
                    <i class="fas fa-plus"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-warning" data-toggle="modal" onclick="showModalWithdraw(${obj.id})">
                    <i class="fas fa-minus"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-primary" data-toggle="modal" onclick="showModalTransfer(${obj.id})">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-danger" onclick="disableRecord(${obj.id})">
                    <i class="fas fa-ban"></i>
                </button>
            </td>
        </tr>
        `;
};


document.addEventListener("DOMContentLoaded", function () {
    function showModal(modalId) {
        $(modalId).modal('show');
    }

    const createButton = document.querySelector(".btn-outline-light");
    createButton.addEventListener("click", function () {
        showModal('#createModal');
    });

});


document.addEventListener("DOMContentLoaded", function () {
    const createButton = document.getElementById('createButton');
    const bodyCustomer = document.getElementById("tbCustomer");

    createButton.addEventListener('click', async function () {
        const fullName = document.querySelector('#fullName').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;
        const address = document.querySelector('#address').value;

        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('error');
        });

        if (!fullName || !email || !phone || !address) {
            if (!fullName) {
                document.getElementById("fullNameError").textContent = "Full Name is required";
                document.getElementById("fullName").classList.add('error');
            } else {
                document.getElementById("fullNameError").textContent = "";
            }
            if (!email) {
                document.getElementById("emailError").textContent = "Email is required";
                document.getElementById("email").classList.add('error');
            } else {
                document.getElementById("emailError").textContent = "";
            }
            if (!phone) {
                document.getElementById("phoneError").textContent = "Phone is required";
                document.getElementById("phone").classList.add('error');
            } else {
                document.getElementById("phoneError").textContent = "";
            }
            if (!address) {
                document.getElementById("addressError").textContent = "Address is required";
                document.getElementById("address").classList.add('error');
            } else {
                document.getElementById("addressError").textContent = "";
            }
        } else {
            const balance = 0;
            const data = {
                fullName,
                email,
                phone,
                address,
                balance
            };

            loading.style.display = 'block';

            setTimeout(async function () {
                try {
                    const response = await fetch('http://localhost:3300/customer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                    if (response.ok) {
                        Swal.fire({
                            icon: "success",
                            title: "Thêm mới thành công",
                            showConfirmButton: false,
                            timer: 1500
                        });

                        const customerData = await response.json();
                        const str = renderCustomer(customerData);
                        bodyCustomer.innerHTML += str;

                        $(createModal).modal('hide');
                    } else {
                        webToast.Danger({
                            status: 'Title',
                            message: 'Alert Message'
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    loading.style.display = 'none';
                }
            }, 1500);
        }
    });
});


function showModalUpdate(customerId) {
    fetch(`http://localhost:3300/customer/${customerId}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#updateModal #customerId').value = data.id;
            document.querySelector('#updateModal #fullName').value = data.fullName;
            document.querySelector('#updateModal #email').value = data.email;
            document.querySelector('#updateModal #phone').value = data.phone;
            document.querySelector('#updateModal #address').value = data.address;

            $('#updateModal').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.getElementById('updateButton').addEventListener('click', async function () {
    const customerId = document.querySelector('#updateModal #customerId').value;
    const fullName = document.querySelector('#updateModal #fullName').value;
    const email = document.querySelector('#updateModal #email').value;
    const phone = document.querySelector('#updateModal #phone').value;
    const address = document.querySelector('#updateModal #address').value;

    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('error');
    });

    if (!fullName || !email || !phone || !address) {
        if (!fullName) {
            document.querySelector('#updateModal #fullNameError').textContent = "Full Name is required";
            document.querySelector('#updateModal #fullName').classList.add('error');
        } else {
            document.getElementById('#updateModal #fullNameError').textContent = "";
        }
        if (!email) {
            document.querySelector('#updateModal #emailError').textContent = "Email is required";
            document.querySelector('#updateModal #email').classList.add('error');
        } else {
            document.querySelector('#updateModal #emailError').textContent = "";
        }
        if (!phone) {
            document.querySelector('#updateModal #phoneError').textContent = "Phone is required";
            document.querySelector('#updateModal #phone').classList.add('error');
        } else {
            document.querySelector('#updateModal #phoneError').textContent = "";
        }
        if (!address) {
            document.querySelector('#updateModal #addressError').textContent = "Address is required";
            document.querySelector('#updateModal #address').classList.add('error');
        } else {
            document.querySelector('#updateModal #addressError').textContent = "";
        }
    } else {
        const data = {
            fullName,
            email,
            phone,
            address
        };

        loading.style.display = 'block';

        setTimeout(async function () {
            try {
                const response = await fetch(`http://localhost:3300/customer/${customerId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const updatedCustomer = await response.json();
                    const updateRow = document.getElementById('tr_' + customerId);
                    const str = renderCustomer(updatedCustomer);
                    updateRow.innerHTML = str;
                    $(updateModal).modal('hide');

                    Swal.fire({
                        icon: "success",
                        title: "Cập nhập thành công",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    // Xử lý lỗi nếu có
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                loading.style.display = 'none';
            }
        }, 1500);
    }

});



function showModalDeposit(customerId) {
    fetch(`http://localhost:3300/customer/${customerId}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#depositModal #customerId').value = data.id;
            document.querySelector('#depositModal #fullName').value = data.fullName;
            document.querySelector('#depositModal #balance').value = data.balance;

            $('#depositModal').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.getElementById('depositButton').addEventListener('click', async function () {
    const customerId = document.querySelector('#depositModal #customerId').value;
    const balance = parseFloat(document.querySelector('#depositModal #balance').value);
    const transactionAmount = parseFloat(document.querySelector('#depositModal #transactionAmount').value);

    if (isNaN(transactionAmount)) {
        document.getElementById('transactionAmountError').textContent = "Nhập số tiền";
        document.getElementById('transactionAmount').classList.add('error');
        return;
    } else if (transactionAmount >= 1000000000) {    
        document.getElementById('transactionAmountError').textContent = "Số tiền nạp không được vượt quá 1,000,000,000.";
        document.getElementById('transactionAmount').classList.add('error');
        return;
    } else if (transactionAmount <= 10) {    
        document.getElementById('transactionAmountError').textContent = "Số tiền nạp phải từ 10 trở lên.";
        document.getElementById('transactionAmount').classList.add('error');
        return;
    }

    const newBalance = balance + transactionAmount;

    const data = {
        balance: newBalance
    };

    loading.style.display = 'block';

    setTimeout(async function () {
        try {
            const response = await fetch(`http://localhost:3300/customer/${customerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Nạp tiền thành công",
                    showConfirmButton: false,
                    timer: 1500
                });

                const deposit = await response.json();
                const dataDeposit = {
                    fullName: deposit.fullName,
                    transactionAmount: transactionAmount,
                    date: new Date().toLocaleString()
                };

                historyDeposit(dataDeposit);

                const updateRow = document.getElementById('tr_' + customerId)
                const str = renderCustomer(deposit)
                updateRow.innerHTML = str
                $(depositModal).modal('hide');
            } else {

            }

        } catch (error) {
            console.error('Error:', error);
        } finally {
            loading.style.display = 'none';
        }
    }, 1500);
});

async function historyDeposit(dataDeposit) {
    try {
        const response = await fetch('http://localhost:3300/deposits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataDeposit)
        });
        if (!response.ok) {
            throw new Error('Failed to save deposit');
        }
    } catch (error) {
        console.error('Error saving deposit:', error);
    }
}


function showModalWithdraw(customerId) {
    fetch(`http://localhost:3300/customer/${customerId}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#withdrawModal #customerId').value = data.id;
            document.querySelector('#withdrawModal #fullName').value = data.fullName;
            document.querySelector('#withdrawModal #balance').value = data.balance;

            $('#withdrawModal').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.getElementById('withdrawButton').addEventListener('click', async function () {
    const customerId = document.querySelector('#withdrawModal #customerId').value;
    const balance = parseFloat(document.querySelector('#withdrawModal #balance').value);
    const transactionAmount = parseFloat(document.querySelector('#withdrawModal #transactionAmount').value);

    if (isNaN(transactionAmount)) {
        document.querySelector('#withdrawModal #transactionAmountError').textContent = "Nhập số tiền";
        document.querySelector('#withdrawModal #transactionAmount').classList.add('error');
        return;
    } else if (transactionAmount <= 10) {
        document.querySelector('#withdrawModal #transactionAmountError').textContent = "Số tiền rút phải từ 10 trở lên.";
        document.querySelector('#withdrawModal #transactionAmount').classList.add('error');
        return;
    }else if (transactionAmount >= 1000000000) {
        document.querySelector('#withdrawModal #transactionAmountError').textContent = "Số tiền rút không được vượt quá 1,000,000,000.";
        document.querySelector('#withdrawModal #transactionAmount').classList.add('error');
        return;
    } else if (transactionAmount > balance) {
        document.querySelector('#withdrawModal #transactionAmountError').textContent = "Số dư hiện tại không đủ.";
        document.querySelector('#withdrawModal #transactionAmount').classList.add('error');
        return;
    }

    const newBalance = balance - transactionAmount;

    const data = {
        balance: newBalance
    };

    loading.style.display = 'block';

    setTimeout(async function () {
        try {
            const response = await fetch(`http://localhost:3300/customer/${customerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Rút tiền thành công",
                    showConfirmButton: false,
                    timer: 1500
                });

                const withdraw = await response.json();
                const dataWithdraw = {
                    fullName: withdraw.fullName,
                    transactionAmount: transactionAmount,
                    date: new Date().toLocaleString()
                };

                historyWithdraw(dataWithdraw)

                const updateRow = document.getElementById('tr_' + customerId)
                const str = renderCustomer(withdraw)
                updateRow.innerHTML = str
                $(withdrawModal).modal('hide');
            } else {

            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            loading.style.display = 'none';
        }
    }, 1500);
});


async function historyWithdraw(dataWithdraw) {
    try {
        const response = await fetch('http://localhost:3300/withdraws', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataWithdraw)
        });
        if (!response.ok) {
            throw new Error('Failed to save deposit');
        }
    } catch (error) {
        console.error('Error saving deposit:', error);
    }
}


async function getAllCustomersExcept(customerId) {
    try {
        const response = await fetch(`http://localhost:3300/customer`);
        if (!response.ok) {
            throw new Error('Failed to fetch customers data');
        }
        const data = await response.json();
        const filteredCustomers = data.filter(customer => customer.id !== customerId);

        return filteredCustomers;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}


async function showModalTransfer(customerId) {
    try {
        const response = await fetch(`http://localhost:3300/customer/${customerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch customer data');
        }

        const data = await response.json();

        document.querySelector('#transferModal #senderId').value = data.id;
        document.querySelector('#transferModal #senderFullName').value = data.fullName;
        document.querySelector('#transferModal #senderEmail').value = data.email;
        document.querySelector('#transferModal #senderBalance').value = data.balance;

        const recipientNameSelect = document.querySelector('#transferModal #recipientId');
        recipientNameSelect.innerHTML = ""; // Xóa tất cả các tùy chọn trước

        const recipientList = await getAllCustomersExcept(customerId);
        recipientList.forEach(recipient => {
            const option = document.createElement('option');
            option.value = recipient.id;
            option.textContent = `${"(" + recipient.id + ")"} - ${recipient.fullName}`;
            option.setAttribute('data-balance', recipient.balance);
            option.setAttribute('data-fullName', recipient.fullName);
            recipientNameSelect.appendChild(option);
        });

        $('#transferModal').modal('show');
    } catch (error) {
        console.error('Error:', error);
    }
}


document.getElementById('transferButton').addEventListener('click', async function () {
    const senderId = document.querySelector('#transferModal #senderId').value;
    const recipientId = document.querySelector('#transferModal #recipientId').value;
    const transferAmount = parseFloat(document.querySelector('#transferModal #transferAmount').value);
    const transactionAmount = parseFloat(document.querySelector('#transferModal #total').value);

    if (isNaN(transferAmount)) {
        document.getElementById('transferAmountError').textContent = "Nhập số tiền";
        document.getElementById('transferAmount').classList.add('error');
        return;
    } else if (transferAmount <= 10) {
        document.getElementById('transferAmountError').textContent = "Số tiền Chuyển phải từ 10 trở lên.";
        document.getElementById('transferAmount').classList.add('error');
        return;
    }else if (transferAmount >= 1000000000) {
        document.getElementById('transferAmountError').textContent = "Số tiền Chuyển không được vượt quá 1,000,000,000.";
        document.getElementById('transferAmount').classList.add('error');
        return;
    } else if (transferAmount > balance) {
        document.getElementById('transferAmountError').textContent = "Số dư hiện tại không đủ.";
        document.getElementById('transferAmount').classList.add('error');
        return;
    }


    loading.style.display = 'block';

    setTimeout(async () => {
        try {
            const promises = [
                subtractBalance(senderId, transactionAmount),
                addBalance(recipientId, transferAmount)
            ];

            await Promise.all(promises);

            loading.style.display = 'none';

            Swal.fire({
                icon: "success",
                title: "Chuyển tiền thành công",
                showConfirmButton: false,
                timer: 1500
            });

            $('#transferModal').modal('hide');

            const senderName = document.querySelector('#transferModal #senderFullName').value;
            const response = await fetch(`http://localhost:3300/customer/${recipientId}`);
            const recipientData = await response.json();
            const recipientName = recipientData.fullName;
            const fees = 0.10;
            const feesAmount = transferAmount * fees;
            const data = {
                senderName,
                recipientName,
                transferAmount,
                fees,
                feesAmount,
                transactionAmount,
                date: new Date().toLocaleString()
            };

            historyTransfer(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }, 1500);
});


async function subtractBalance(senderId, transactionAmount) {
    try {
        const senderResponse = await fetch(`http://localhost:3300/customer/${senderId}`);
        if (!senderResponse.ok) {
            throw new Error('Failed to fetch sender data');
        }

        const senderData = await senderResponse.json();
        const senderBalance = parseFloat(senderData.balance);

        if (senderBalance < transactionAmount) {
            console.log('Số dư không đủ để thực hiện giao dịch');
            return;
        }

        const newSenderBalance = senderBalance - transactionAmount;

        const data = {
            balance: newSenderBalance
        };

        const response = await fetch(`http://localhost:3300/customer/${senderId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to update sender');
        }

        const withdrawSender = await response.json();
        const updateRow = document.getElementById('tr_' + senderId)
        const str = renderCustomer(withdrawSender)
        updateRow.innerHTML = str

    } catch (error) {
        console.error('Error:', error);
    }
}


async function addBalance(recipientId, amount) {
    try {
        const recipientResponse = await fetch(`http://localhost:3300/customer/${recipientId}`);
        if (!recipientResponse.ok) {
            throw new Error('Failed to fetch recipient data');
        }

        const recipientData = await recipientResponse.json();
        const recipientBalance = parseFloat(recipientData.balance);

        const newRecipientBalance = recipientBalance + amount;

        const data = {
            balance: newRecipientBalance
        };

        const response = await fetch(`http://localhost:3300/customer/${recipientId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to update recipient');
        }

        const depositRecipient = await response.json();
        const updateRow = document.getElementById('tr_' + recipientId)
        const str = renderCustomer(depositRecipient)
        updateRow.innerHTML = str

    } catch (error) {
        console.error('Error:', error);
    }
}


function historyTransfer(data) {
    fetch('http://localhost:3300/transfers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create the object');
            }
            return response.json();
        })
        .then(newObject => {

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


transferAmountInput.addEventListener('input', function () {

    const transferAmount = parseFloat(transferAmountInput.value);

    if (!isNaN(transferAmount)) {
        const tax = 0.10 * transferAmount;

        const transactionAmount = transferAmount + tax;

        transactionAmountInput.value = transactionAmount.toFixed(2);
    } else {
        transactionAmountInput.value = '0';
    }
});


$('#createModal').on('hidden.bs.modal', function (e) {
    const inputFields = document.querySelectorAll('#createModal input[type="text"], #createModal input[type="email"], #createModal input[type="tel"]');
    inputFields.forEach(input => {
        input.value = '';
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        errorElement.textContent = '';
    });
});

$('#updateModal').on('hidden.bs.modal', function (e) {
    const inputFields = document.querySelectorAll('#updateModal input[type="text"], #updateModal input[type="email"], #updateModal input[type="tel"]');
    inputFields.forEach(input => {
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        errorElement.textContent = '';
    });
});

$('#depositModal').on('hidden.bs.modal', function (e) {
    const inputFields = document.querySelectorAll('#depositModal input[type="number"]');
    inputFields.forEach(input => {
        input.value = '';
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
});

$('#withdrawModal').on('hidden.bs.modal', function (e) {
    const inputFields = document.querySelectorAll('#withdrawModal input[type="number"]');
    inputFields.forEach(input => {
        input.value = '';
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
});

$('#transferModal').on('hidden.bs.modal', function (e) {
    const inputFields = document.querySelectorAll('#transferModal input[type="number"]');
    inputFields.forEach(input => {
        input.value = '';
        input.classList.remove('error');
        const errorElement = input.nextElementSibling;
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
});


const modalIds = ['createModal', 'updateModal', 'depositModal', 'withdrawModal', 'transferModal'];
modalIds.forEach(modalId => {
    const modal = document.getElementById(modalId);

    if (modal) {
        modal.addEventListener('input', function (e) {
            if (e.target.classList.contains('form-control')) {
                e.target.classList.remove('error');
                const errorElement = e.target.nextElementSibling;
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });
    }
});


getAllCustomer();











