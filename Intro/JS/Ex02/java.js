var board;
var playerO = 'O';
var playerX = 'X';
var currentPlayer = playerO;
var gameOver = false;

window.onload = function() {
    setGame();
    updateCurrentPlayer();
}

function reset(){

    for(let r = 0; r < 3; r++) {
        for(let c = 0; c < 3; c++){
            document.getElementById("board").removeChild(document.getElementById(r.toString() + ',' + c.toString()));
        }
    }
    
    gameOver = false;
    currentPlayer = playerO;
    winner = ' ';
    setGame();
    updateCurrentPlayer();
}

function setGame() {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ]

    for(let r = 0; r < 3; r++) {
        for(let c = 0; c < 3; c++){
            //<div id="r,c"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "," + c.toString();
            tile.classList.add("tile");

            tile.addEventListener("click", setTile);
            document.getElementById("board").append(tile);
        }
    }
}

function setTile(){
    if(gameOver)
        return;

    let coords = this.id.split(",");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if(board[r][c] != ' ')
        return;

    board[r][c] = currentPlayer;
    this.innerText = currentPlayer;

    if(currentPlayer == playerO)
        currentPlayer = playerX;
    else
        currentPlayer = playerO;

        
    checkWinner();
    if(gameOver != true)
        updateCurrentPlayer();
}

function checkWinner(){
    //horizontal check
    for(let r = 0; r < 3; r++) {
        if(board[r][0] == board[r][1] && board[r][1] == board[r][2] && board[r][0] != ' '){
            for(let i = 0; i < 3; i++)
            {
                let tile = document.getElementById(r.toString() + ',' + i.toString());
                tile.classList.add("winner");
            }
            gameOver = true;
            return;
        }  
    }

    //vertical check
    for(let c = 0; c < 3; c++) {
        if(board[0][c] == board[1][c] && board[1][c] == board[2][c] && board[0][c] != ' ')
        {
            for(let i = 0; i < 3; i++)
            {
                let tile = document.getElementById(i.toString() + ',' + c.toString());
                tile.classList.add("winner");
            }
            gameOver = true;
            return;
        }
    }

    //diagonal check
    if(board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[1][1] != ' ')
    {
        for(let i = 0; i < 3; i++)
            {
                let tile = document.getElementById(i.toString() + ',' + i.toString());
                tile.classList.add("winner");
            }
        gameOver = true;
        return;
    }

    if(board[2][0] == board[1][1] && board[1][1] == board[0][2] && board[1][1] != ' ')
    {
        //2,0
        let tile = document.getElementById("2,0");
        tile.classList.add("winner");

        //1,1
        tile = document.getElementById("1,1");
        tile.classList.add("winner");
        
        //0,2
        tile = document.getElementById("0,2");
        tile.classList.add("winner");

        gameOver = true;
        return;
    }

}

function updateCurrentPlayer(){
    tile = document.getElementById("currentPlayer");
    tile.innerText = "player: " + currentPlayer;
}