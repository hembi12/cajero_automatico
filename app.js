var cuentas = [
    { nombre: "Mali", saldo: 200, password: "1234" },
    { nombre: "Gera", saldo: 290, password: "2345" },
    { nombre: "Maui", saldo: 67, password: "3456" }
];

var selectedAccount = null;
var transactionHistory = [];

window.onload = function() {
    var accountSelect = document.getElementById("account-select");
    cuentas.forEach(function(cuenta, index) {
        var option = document.createElement("option");
        option.value = index;
        option.text = cuenta.nombre;
        accountSelect.add(option);
    });
};

document.getElementById("login-btn").addEventListener("click", function() {
    var accountIndex = document.getElementById("account-select").value;
    var password = document.getElementById("password-input").value;
    var errorElement = document.getElementById("login-error");

    if (!accountIndex) {
        showError(errorElement, "Por favor selecciona una cuenta.");
        return;
    }

    selectedAccount = cuentas[accountIndex];

    if (password === selectedAccount.password) {
        transitionToMenu();
        document.getElementById("account-name").textContent = selectedAccount.nombre;
        clearError(errorElement);
    } else {
        showError(errorElement, "Contraseña incorrecta, intenta de nuevo.");
    }
});

document.getElementById("check-balance-btn").addEventListener("click", function() {
    showResult(`Tu saldo actual es: $${selectedAccount.saldo}`);
    addTransaction("Consulta de saldo", 0);
});

document.getElementById("deposit-btn").addEventListener("click", function() {
    showAction("Ingresar Monto", "deposit");
});

document.getElementById("withdraw-btn").addEventListener("click", function() {
    showAction("Retirar Monto", "withdraw");
});

document.getElementById("logout-btn").addEventListener("click", function() {
    selectedAccount = null;
    transitionToLogin();
});

document.getElementById("confirm-btn").addEventListener("click", function() {
    var amount = parseFloat(document.getElementById("amount-input").value);
    var errorElement = document.getElementById("action-error");

    if (!validateAmount(amount)) {
        showError(errorElement, "Por favor ingresa un monto válido.");
        return;
    }

    var actionType = document.getElementById("action-title").dataset.action;
    var confirmMessage = getConfirmMessage(actionType, amount);

    if (confirm(confirmMessage)) {
        processTransaction(actionType, amount);
    }
});

document.getElementById("back-btn").addEventListener("click", function() {
    transitionToMenu();
});

document.getElementById("history-btn").addEventListener("click", function() {
    showHistory();
});

document.getElementById("back-history-btn").addEventListener("click", function() {
    transitionToMenu();
});

document.getElementById("back-action-btn").addEventListener("click", function() {
    transitionToMenu();
});

function transitionToMenu() {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("menu-section").style.display = "block";
    document.getElementById("action-section").style.display = "none";
    document.getElementById("result-section").style.display = "none";
    document.getElementById("history-section").style.display = "none";
}

function transitionToLogin() {
    document.getElementById("menu-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("password-input").value = "";
}

function showAction(title, action) {
    document.getElementById("menu-section").style.display = "none";
    document.getElementById("action-section").style.display = "block";
    document.getElementById("action-title").textContent = title;
    document.getElementById("action-title").dataset.action = action;
    document.getElementById("amount-input").value = "";
    clearError(document.getElementById("action-error"));

    // Mostrar botón de regresar al menú en las acciones de depósito y retiro
    var backActionButton = document.getElementById("back-action-btn");
    if (!backActionButton) {
        backActionButton = document.createElement("button");
        backActionButton.id = "back-action-btn";
        backActionButton.innerHTML = '<i class="fas fa-arrow-left"></i> Regresar al Menú';
        document.getElementById("action-section").appendChild(backActionButton);
        backActionButton.addEventListener("click", transitionToMenu);
    } else {
        backActionButton.style.display = "block";
    }
}

function showResult(message) {
    document.getElementById("action-section").style.display = "none";
    document.getElementById("result-section").style.display = "block";
    document.getElementById("result-message").textContent = message;
}

function showError(element, message) {
    element.textContent = message;
    element.style.color = "red";
}

function clearError(element) {
    element.textContent = "";
}

function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function addTransaction(type, amount) {
    var date = new Date().toLocaleString();
    transactionHistory.push({ type: type, amount: amount, date: date });
}

function showHistory() {
    var historySection = document.getElementById("history-section");
    var historyList = document.getElementById("transaction-history");
    historyList.innerHTML = "";

    transactionHistory.forEach(function(transaction) {
        var listItem = document.createElement("li");
        listItem.textContent = `${transaction.date}: ${transaction.type} de $${transaction.amount}`;
        historyList.appendChild(listItem);
    });

    historySection.style.display = "block";
    document.getElementById("menu-section").style.display = "none";
}

function validateAmount(amount) {
    return !isNaN(amount) && amount > 0;
}

function getConfirmMessage(actionType, amount) {
    if (actionType === "deposit") {
        return `¿Estás seguro que deseas ingresar $${amount}?`;
    } else if (actionType === "withdraw") {
        return `¿Estás seguro que deseas retirar $${amount}?`;
    }
    return "";
}

function processTransaction(actionType, amount) {
    showLoader();
    setTimeout(() => {
        var errorElement = document.getElementById("action-error");
        if (actionType === "deposit") {
            if (selectedAccount.saldo + amount > 990) {
                showError(errorElement, "No puedes tener más de $990 en la cuenta.");
            } else {
                selectedAccount.saldo += amount;
                addTransaction("Depósito", amount);
                showResult(`Ingresaste $${amount}. Tu nuevo saldo es: $${selectedAccount.saldo}`);
            }
        } else if (actionType === "withdraw") {
            if (selectedAccount.saldo - amount < 10) {
                showError(errorElement, "No puedes tener menos de $10 en la cuenta.");
            } else {
                selectedAccount.saldo -= amount;
                addTransaction("Retiro", amount);
                showResult(`Retiraste $${amount}. Tu nuevo saldo es: $${selectedAccount.saldo}`);
            }
        }
        hideLoader();
    }, 1000);  // Simula un tiempo de espera
}