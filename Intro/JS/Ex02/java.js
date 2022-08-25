window.addEventListener('DOMContentLoaded', () => {
    const myTable = document.getElementById('myTable');
});

var currentPLayer = 'X';

var array = new Array(3);

let

function initialize(){
    for(var i = 0; i < 3; i++)
    {
        array[i] = new Array(3);
    }

    for(var i = 0; i < 3; i++)
    {
        for(var j = 0; j < 3; j++)
        {
            array[i][j] = 'y';
        }
    }
    for(var i = 0; i < 3; i++)
    {
        for(var j = 0; j < 3; j++)
        {
            myTable.rows[i].cells[j].innerHTML = array[i][j];
        }
    }
}




