// var board;
// var selectedNumbers;
// var allNumbersSelected;
// var numberCount;
// var selectedAmmount;

// var display;
// var currentNumber;
// var lastNumber;
// var opration;

//new
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



// function reset(){
//     for(let i = 0; i < 25; i++) {
//         document.getElementById("board").removeChild(document.getElementById(i));
//     }
//     delete selectedNumbers;
//     delete board;

//     showMessage("All number selections were reseted.")
// }

// function setUp() {

//     let numbers = document.querySelectorAll(".number");
//     numbers.forEach(num => {
//         num.addEventListener("click", typeNumber);
//     });

//     let operators = document.querySelectorAll(".operator");
//     operators.forEach(ope => {
//         ope.addEventListener("click", useOperator);
//     });

//     let specials = document.querySelectorAll(".special");
//     specials.forEach(special => {
//         special.addEventListener("click", specialFunctions);
//     });
//     //document.querySelectorAll(".number").addEventListener("click", typeNumber);
//     //document.querySelectorAll(".operator").addEventListener("click", useOperator);
//     //document.querySelectorAll(".special").addEventListener("click", specialFunctions);

//     currentNumber = 0;
//     lastNumber = operation = ' ';

//     display = document.getElementById("display");
//     display.innerText = '0';
// }


// function typeNumber(){
//     if(operation == ' ')
//     {
//         if(currentNumber == 0){
//             currentNumber = parseInt(this.id);
//         }
//         else
//         {
//             currentNumber = parseInt(currentNumber.toString() + this.id);
//         }
//     }
//     else
//     {
//         lastNumber = currentNumber;

//         currentNumber = parseInt(this.id);
//     }

//     display.innerText = currentNumber.toString();
// }

// function useOperator(){
    
//     if(operation == ' ')
//         operation = this.id;
    
//     else
//     {
//         if(this.id == operation)
//         {
//             calculate(this.id);
//             display.innerText = currentNumber.toString();
//             lastNumber = ' ';
//         }
//         else
//         {
//             if(operation == '*' || operation == '/')
//             {
//                 calculate(operation);
//                 display.innerText = currentNumber.toString();
//                 operation = this.id;
//                 lastNumber = ' ';
//             }
//             else
//             {
//                 if(this.id == '*' || this.id == '/')
//                 {
//                     calculate(operation);
//                 }
//                 else
//                 {
//                     calculate(operation);
//                     display.innerText = currentNumber.toString();
//                     operation = this.id;
//                     lastNumber = ' ';
//                 }
//             }
//         }
//     }
        
// }

// function specialFunctions(){
//     switch(this.id){
//         case "AC":
//             currentNumber = 0;
//             lastNumber = operation = ' ';
//             break;

//         case "=":
//             if(lastNumber == ' ')
//                 return;

//             calculate(operation);
//             lastNumber = ' ';
//             operation = ' ';
//             break;
//     }

//     display.innerText = currentNumber.toString();
// }

// function calculate(ope){
//     switch(ope){
//         case '*':
//             currentNumber = lastNumber * currentNumber
//             break;
//         case '/':
//             currentNumber = lastNumber / currentNumber
//             break;
//         case '+':
//             currentNumber = lastNumber + currentNumber
//             break;
//         case '-':
//             currentNumber = lastNumber - currentNumber
//             break;
//         default:
//             break;
//     }
// }