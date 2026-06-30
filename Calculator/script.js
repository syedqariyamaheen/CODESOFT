// Get display elements
const display = document.getElementById('display');
const history = document.getElementById('history');

let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let historyText = '';

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
    if (display.value === 'Error') {
        resetCalculator();
    }
    
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (value === '.' && currentInput.includes('.')) return;
    if (value === '-' && currentInput === '') {
        currentInput = '-';
        updateDisplay();
        return;
    }
    
    if (currentInput.length >= 15) return;
    
    currentInput += value;
    updateDisplay();
}

function handleOperator(value) {
    
    if (display.value === 'Error') {
        resetCalculator();
    }
    
    
    if (value === '-' && currentInput === '' && previousInput === '') {
        currentInput = '-';
        updateDisplay();
        return;
    }
    

    if (currentInput === '-' || currentInput === '') {
        currentInput = '0';
    }
    
    const current = parseFloat(currentInput);
    
    
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
   
    if (display.value === 'Error') {
        resetCalculator();
        return;
    }
    
    if (operator === null || shouldResetDisplay) return;
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
   
    if (isNaN(prev) || isNaN(current)) {
        showError();
        return;
    }
    
   
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
            result = (prev * current) / 100;
            break;
        default: 
            showError();
            return;
    }
    
  
    if (!isFinite(result)) {
        showError();
        return;
    }
    
  
    result = parseFloat(result.toFixed(10));
    
  
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

updateDisplay();