// Get display elements
const display = document.getElementById('display');
const history = document.getElementById('history');

let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let historyText = '';

// Add event listeners to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        
        if (button.classList.contains('number')) {
            handleNumber(value);
        } else if (button.classList.contains('operator')) {
            handleOperator(value);
        } else if (button.classList.contains('equals')) {
            handleEquals();
        } else if (value === 'clear') {
            handleClear();
        } else if (value === 'delete') {
            handleDelete();
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        e.preventDefault();
        handleNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
        e.preventDefault();
        handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        handleClear();
    } else if (key === 'Backspace') {
        e.preventDefault();
        handleDelete();
    }
});

function handleNumber(value) {
    // Check if display shows Error
    if (display.value === 'Error') {
        resetCalculator();
    }
    
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent multiple decimal points
    if (value === '.' && currentInput.includes('.')) return;
    
    // Allow negative sign at start
    if (value === '-' && currentInput === '') {
        currentInput = '-';
        updateDisplay();
        return;
    }
    
    // Limit input length
    if (currentInput.length >= 15) return;
    
    currentInput += value;
    updateDisplay();
}

function handleOperator(value) {
    // Check if display shows Error
    if (display.value === 'Error') {
        resetCalculator();
    }
    
    // Handle negative numbers properly
    if (value === '-' && currentInput === '' && previousInput === '') {
        currentInput = '-';
        updateDisplay();
        return;
    }
    
    // If current input is just '-' treat it as 0
    if (currentInput === '-' || currentInput === '') {
        currentInput = '0';
    }
    
    const current = parseFloat(currentInput);
    
    // If there's already an operator, calculate first
    if (operator && !shouldResetDisplay) {
        const prev = parseFloat(previousInput);
        if (!isNaN(prev) && !isNaN(current)) {
            handleEquals();
            previousInput = currentInput;
            operator = value;
            shouldResetDisplay = true;
            historyText = `${previousInput} ${getOperatorSymbol(value)} `;
            updateHistory();
            return;
        }
    }
    
    previousInput = currentInput;
    operator = value;
    shouldResetDisplay = true;
    historyText = `${previousInput} ${getOperatorSymbol(value)} `;
    updateHistory();
}

function handleEquals() {
    // Check if display shows Error
    if (display.value === 'Error') {
        resetCalculator();
        return;
    }
    
    if (operator === null || shouldResetDisplay) return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    // Check for invalid numbers
    if (isNaN(prev) || isNaN(current)) {
        showError();
        return;
    }
    
    // Check for empty inputs
    if (previousInput === '' || currentInput === '') {
        showError();
        return;
    }
    
    let result;
    const operation = operator;
    
    switch (operator) {
        case '+': 
            result = prev + current; 
            break;
        case '-': 
            result = prev - current; 
            break;
        case '*': 
            result = prev * current; 
            break;
        case '/': 
            if (current === 0) {
                showError();
                return;
            }
            result = prev / current; 
            break;
        case '%': 
            // Handle percentage correctly
            // If user types "100 % 9", it means "100% of 9" = 9
            // But if user types "100 % 9", it could also mean modulo
            // We'll implement it as: A % B = (A * B) / 100
            // This is the standard calculator behavior
            result = (prev * current) / 100;
            break;
        default: 
            showError();
            return;
    }
    
    // Check if result is valid number
    if (!isFinite(result)) {
        showError();
        return;
    }
    
    // Round to avoid floating point issues
    result = parseFloat(result.toFixed(10));
    
    // Update history with result
    historyText = `${previousInput} ${getOperatorSymbol(operation)} ${currentInput} =`;
    updateHistory();
    
    currentInput = String(result);
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function handleClear() {
    resetCalculator();
    historyText = '';
    updateHistory();
    updateDisplay();
}

function handleDelete() {
    if (display.value === 'Error') {
        resetCalculator();
        updateDisplay();
        return;
    }
    if (shouldResetDisplay) return;
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function resetCalculator() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    display.value = '0';
    display.classList.remove('error');
}

function showError() {
    display.value = 'Error';
    display.classList.add('error');
    historyText = '';
    updateHistory();
    setTimeout(() => {
        if (display.value === 'Error') {
            resetCalculator();
            updateDisplay();
        }
    }, 2000);
}

function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%'
    };
    return symbols[op] || op;
}

function updateDisplay() {
    display.value = currentInput || '0';
    if (display.value !== 'Error') {
        display.classList.remove('error');
    }
}

function updateHistory() {
    history.textContent = historyText;
}

// Initialize
updateDisplay();