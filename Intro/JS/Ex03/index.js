var board;
var selectedNumbers;
var allNumbersSelected;
var numberCount;
var selectedAmmount;

window.onload = function() {
    setGame();
}

function reset(){
    for(let i = 0; i < 25; i++) {
        document.getElementById("board").removeChild(document.getElementById(i));
    }
    delete selectedNumbers;
    delete board;

    setGame();
    showMessage("All number selections were reseted.")
}

function setGame() {
    board = new Array(25);
    selectedNumbers = new Array();

    allNumbersSelected = false;
    numberCount = 0;

    selectedAmmount = document.getElementById("selectedAmmount");
    updateSelectedAmmount();

    for(let i = 0; i < 25; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.classList.add("tile");

        tile.addEventListener("click", selectNumber);
        document.getElementById("board").append(tile);

        tile.innerText = (i+1).toString();
    }
}

function selectNumber(){
    if(this.classList.contains("selected"))
        return;
    if(numberCount >= 15)
        return;
        
    this.classList.add("selected");
    selectedNumbers.push(this.id); 
    numberCount++;

    if(numberCount >= 15)
        allNumbersSelected = true;

    updateSelectedAmmount();
}

function selectRandom(){
    if (allNumbersSelected)
        return;

    showMessage((15-numberCount).toString() + " random numbers were selected.")
    for(let i = numberCount; i < 15; i++)
    {
        let rand;
            
        do{
            rand = (Math.floor(Math.random() * 25)).toString();                
        } while(selectedNumbers.includes(rand))

        document.getElementById(rand).classList.add("selected");
        selectedNumbers.push(rand);
        numberCount++;
    }

    if(numberCount >= 15)
        allNumbersSelected = true;

    updateSelectedAmmount();
}

function updateSelectedAmmount(){
    if(numberCount == 0)
        selectedAmmount.innerText = "No Numbers Selected";
    else if(numberCount == 1)
        selectedAmmount.innerText = "1 Number Selected";
    else
        selectedAmmount.innerText = numberCount.toString() + " Numbers Selected";
}

function showMessage(_message){
    let message = document.getElementById("message");
    
    message.innerText = _message;
    
    message.style.visibility = "visible";

    setTimeout("hideMessage()", 3000);
}

function hideMessage(){
    document.getElementById("message").style.visibility = "hidden";
}