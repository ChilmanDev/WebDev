class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    appendNumber(number){
        if(number === ',' && this.currentOperand.includes(',')) 
            return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation){
        if(this.currentOperand === '')
            return;

        if(this.previousOperand !== '')
            this.compute();
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    chooseSpecialOpeation(operation){
        let computationResult;
        const sp_current = parseFloat(this.currentOperand);

        if(operation === '%')
        {
            computationResult = sp_current / 100;
        }
        else if(operation === '+/-')
        {
            computationResult = sp_current * -1;
        }

        this.currentOperand = computationResult;

        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    }

    compute(){
        let computationResult;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if(isNaN(prev) || isNaN(current))
            return;

        switch(this.operation){
            case '+':
                computationResult = prev + current;
                break;
            case '-':
                computationResult = prev - current;
                break;
            case 'x':
                computationResult = prev * current;
                break;
            case '÷':
                computationResult = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computationResult;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number){
        const stringNumber = number.toString();
        const intDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
 
        let integerDisplay;

        if(isNaN(intDigits))
        {
            integerDisplay = '';
        }
        else
        {
            integerDisplay = intDigits.toLocaleString('en', {maximumFractionDigits: 0})
        }

        if(decimalDigits != null)
        {
            return `${integerDisplay}.${decimalDigits}`;
        }
        else
        {
            return integerDisplay;
        }
    }

    updateDisplay(){
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);

        if(this.operation != null)
        {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        }
        else
        {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const allClearButton = document.querySelector('[data-ac]');
const specialOperationButtons = document.querySelectorAll('[data-special-operation]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', () => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', () => {
    calculator.clear()
    calculator.updateDisplay()
})

specialOperationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseSpecialOpeation(button.innerText)
    })
})