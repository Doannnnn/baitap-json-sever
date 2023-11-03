document.addEventListener("DOMContentLoaded", function () {
    const bodyCustomer = document.getElementById("tbCustomer");

    async function fetchAllCustomer() {
        const customers = await fetch("http://localhost:3300/customer");
        const customer = await customers.json();
        return customer;
    }

    const getAllCustomer = async () => {
        const customer = await fetchAllCustomer();
        console.log(customer);

        customer.forEach(item => {
            const str = renderPerson(item);
            bodyCustomer.innerHTML += str;
        });
    };

    const renderPerson = (obj) => {
        return `
        <tr>
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
                <button class="btn btn-outline-success" data-toggle="modal" data-target="#depositModal">
                    <i class="fas fa-plus"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-warning" data-toggle="modal" data-target="#withdrawModal">
                    <i class="fas fa-minus"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-primary" data-toggle="modal" data-target="#transferModal">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-danger">
                    <i class="fas fa-ban"></i>
                </button>
            </td>
        </tr>
        `;
    };

    getAllCustomer();
});


document.addEventListener("DOMContentLoaded", function () {
    function showModal(modalId) {
        $(modalId).modal('show');
    }

    const depositButton = document.querySelector(".btn.btn-outline-success");
    depositButton.addEventListener("click", function () {
        showModal('#depositModal');
    });

    const withdrawButton = document.querySelector(".btn.btn-outline-warning");
    withdrawButton.addEventListener("click", function () {
        showModal('#withdrawModal');
    });

    const transferButton = document.querySelector(".btn.btn-outline-primary");
    transferButton.addEventListener("click", function () {
        showModal('#transferModal');
    });

    const createButton = document.querySelector(".btn-outline-light");
    createButton.addEventListener("click", function () {
        showModal('#createModal');
    });

    // const updateButton = document.querySelector(".btn-outline-secondary");
    // createButton.addEventListener("click", function () {
    //     showModal('#updateModal');
    // });
});


document.addEventListener("DOMContentLoaded", function() {
    // Lấy tham chiếu đến nút "Create"
    const createButton = document.querySelector('#createButton');

    createButton.addEventListener('click', function() {
        const fullName = document.querySelector('#fullName').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;
        const address = document.querySelector('#address').value;
        const balance = 0;

        const data = {
            fullName,
            email,
            phone,
            address,
            balance
        };

        fetch('http://localhost:3300/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // Xử lý kết quả từ server
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
            document.querySelector('#updateModal #balance').value = data.balance;

            $('#updateModal').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });    
}


document.querySelector('#updateModal button[type="submit"]').addEventListener('click', function() {

    const customerId = document.querySelector('#updateModal #customerId').value;
    const fullName = document.querySelector('#updateModal #fullName').value;
    const email = document.querySelector('#updateModal #email').value;
    const phone = document.querySelector('#updateModal #phone').value;
    const address = document.querySelector('#updateModal #address').value;
    const balance = document.querySelector('#updateModal #balance').value;


    const data = {
        fullName,
        email,
        phone,
        address,
        balance
    };

    fetch(`http://localhost:3300/customer/${customerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Xử lý kết quả từ máy chủ
        console.log('Update successful:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});




