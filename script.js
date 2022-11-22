
const displayController = (function() {
    const createAddToDom = (selector, type, typeSel, typeSelName, typeMessage ) => {
        const typ = document.createElement(type);
        typ.setAttribute(typeSel, typeSelName);
        typ.innerHTML = typeMessage;
        document.querySelector(selector).appendChild(typ);
    }

    const addToDom = (selector, message) => {
        document.querySelector(selector).innerHTML = message;
    }

    const getDom = (selector) => {
        return document.querySelector(selector).innerHTML;
    }

    const changeId = (selector, selName) => {
        document.querySelector(selector).id = selName;
    }

    return {addToDom, changeId, getDom, createAddToDom};
})();

 
const gameBoard = (function() {
    var num = 0;
    var againstAi = false;

    var player1;
    var player2;
    var player;

    var _aWinner = false;
    const board = ["", "", "", "", "", "", "", "", ""];

    const play = () => {
        const slot = document.querySelectorAll("#board > div");
        _aiPlay();
        
        for (let i = 0; i < slot.length; i++) {
            slot[i].addEventListener('click', function (e) {
                
                if (!_aWinner || _aTie()) {
                    _turn();
                    _run("#node-up", player, e);
                    if (_notIllegalMove("#node-up")) {
                        num++;
                        if (!_aWinner && againstAi) {
                            if (!_aTie()) {
                                _aiPlay();   
                            }
                        }
                    }
                }
            });
        }
    }

    const loadPlayers = (p1, p2) => {
        player1 = p1;
        player2 = p2;
        _checkPlayers();
    }

    const _reset = () => {
        _aWinner = false;
        const slot = document.querySelectorAll("#board > div");
        
        for (let i = 0; i < slot.length; i++){
            slot[i].innerHTML = ".";
            if (slot[i].id == "win") {
                displayController.changeId("#"+slot[i].id, "a"+i);   
            }
            board[i] = "";
        }
        if (!player.isAi) {
            _aiPlay();   
        }
    }

    const _turn = () => {
        if (num % 2 == 0) {
            player = player1;
        } else {
            player = player2;
        }
    }

    const _aiPlay = () => {
        _turn();
        if (player.isAi) {
            _run("#node-up", player, null);
            num++;
        }
    }

    const _checkPlayers = () => {
        if (player1.isAi || player2.isAi) {
            againstAi = true
        }
    }
    
    const _aTie = () => {
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "") {
                return false;
            }
        }
        return true;
    }


    const _slotIsFree = (position) => {
        if (board[position] == "X" || board[position] == "O") {
            return false;
        }
        return true;
    }

    const _addToBoard = (position, val) => {
        board[position] = val;
    }

    const _idToInt = (idValue) => {
        let split = idValue.split("");
        let intValue = parseInt(split[1]);
        return intValue;
    }

    const _aWin = () => {
        if (board[0] != "" && board[1] == board[0] && board[2] == board[0]) {
            return [0, 1, 2];
        }else if (board[3] != "" && board[4] == board[3] && board[5] == board[3]) {
            return [3, 4, 5];
        }else if (board[6] != "" && board[7] == board[6] && board[8] == board[6]) {
            return [6, 7, 8];
        }else if (board[6] != "" && board[3] == board[0] && board[6] == board[0]) {
            return [0, 3, 6];
        }else if (board[1] != "" && board[4] == board[1] && board[7] == board[1]) {
            return [1, 4, 7];
        }else if (board[2] != "" && board[5] == board[2] && board[8] == board[2]) {
            return [2, 5, 8];
        }else if (board[0] != "" && board[4] == board[0] && board[8] == board[0]) {
            return [0, 4, 8];
        }else if (board[2] != "" && board[4] == board[2] && board[6] == board[2]) {
            return [2, 4, 6];
        }else {
            return 0;
        }
    } 

    const _changeDisplayIfAWinner = () => {
        const win = _aWin();
        if (win != 0) {
            for (let i = 0; i < win.length; i++) {
                fig = win[i];
                displayController.changeId("#a"+fig, "win"); 
            }
            _aWinner = true;
        }
    }

    const _run = (messagerId, player, e) => {
        let intValue;
        if (e == null) {
            intValue = player.move(board);
        } else {
            intValue = _idToInt(e.target.id);
        }
        
        if (!_aWinner && _slotIsFree(intValue)) {
            _addToBoard(intValue, player.getPlayerSymbol());
            displayController.addToDom("#a"+intValue, player.getPlayerSymbol());
            _changeDisplayIfAWinner();
            displayController.addToDom(messagerId, "");
        } else {
            displayController.addToDom(messagerId, "ILLEGAL");
        }
        
        if (_aWinner || _aTie()) {
            let message;
            if (_aWinner) {
                message = player.getPlayerSymbol() + " Wins!!";
            } else {
                message = "its a Tie!!";
            }
            displayController.addToDom(messagerId, message);
            displayController.createAddToDom(messagerId, "button", "id", "replay", "rematch");
            document.querySelector("#replay").addEventListener('click', _reset);
        }
        
    }

    const _notIllegalMove = (messageId) => {
        if (displayController.getDom(messageId) == "ILLEGAL") {
            return false;
        }
        return true;
    }
    return {play, loadPlayers};
})();


const player = (symbol) => {
    const isAi = false;
    const getPlayerSymbol = () => symbol;
    return {getPlayerSymbol, isAi};
};


const computer = (symbol) => {
    const isAi = true;
    const getPlayerSymbol = () => symbol;

    const _randNum = (arr) => {
        const a = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == "") {
                a.push(i);
            }
        }
        let rand = Math.floor(Math.random() * a.length);
        return a[rand];
    }

    const _givesTie = (arr) => {
        for (let i = 0; i < board.length; i++) {
            if (arr[i] == "") {
                return false;
            }
        }
        return true;
    }

    const _givesWin = (arr, sym) => {
        if (arr[0] == sym && arr[1] == arr[0] && arr[2] == arr[0]) {
            return true;
        }else if (arr[3] == sym && arr[4] == arr[3] && arr[5] == arr[3]) {
            return true;
        }else if (arr[6] == sym && arr[7] == arr[6] && arr[8] == arr[6]) {
            return true;
        }else if (arr[6] == sym && arr[3] == arr[0] && arr[6] == arr[0]) {
            return true;
        }else if (arr[1] == sym && arr[4] == arr[1] && arr[7] == arr[1]) {
            return true;
        }else if (arr[2] == sym && arr[5] == arr[2] && arr[8] == arr[2]) {
            return true;
        }else if (arr[0] == sym && arr[4] == arr[0] && arr[8] == arr[0]) {
            return true;
        }else if (arr[2] == sym && arr[4] == arr[2] && arr[6] == arr[2]) {
            return true;
        }else {
            return false;
        }
    }

    const _posibbleMoves = (arr) => {
        const moves = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == "") {
                moves.push(i);
            }
        }
        return moves;
    }

    const move = (arr) => {
        const  result = [];
        const moves = _posibbleMoves(arr);
        var score = 1;
        var bestMove = null;

        if (bestMove == null) {
            for (let i = 0; i < moves.length; i++) {
                var position = moves[i];
                arr[position] = getPlayerSymbol();
                
                if (_givesWin(arr, getPlayerSymbol())) {
                    result.push([1, position]);
                }else if (_giveslose(arr)) {
                    arr[position] = "";
                    continue;
                }else if (_givesTie(arr)){
                    result.push([0, position]);
                }else{
                    move(arr);
                }
                arr[position] = "";
            }
    
            for (let i = 0; i < result.length; i++) {
                var el = result[i]; 
                if (el[0] == 1) {
                    return el[1];
                } 
                if (el[0] < score) {
                    score = el[0];
                    bestMove = el[1];
                }
            }
        }
        if (bestMove == null) {
            return _randNum(arr);
        }
            
        return bestMove;
    }

    const _giveslose = (arr) => {
        var oppSym;

        if (getPlayerSymbol() == "X") {
            oppSym = "O";
        } else {
            oppSym = "X";
        }

        const moves = _posibbleMoves(arr);

        for (let i = 0; i < moves.length; i++) {
            var position = moves[i];
            arr[position] = oppSym;
            
            if (_givesWin(arr, oppSym)) {
                arr[position] = "";
                return true;
            }
            arr[position] = "";
        }
        return false;
    }

    return {getPlayerSymbol, isAi, move, _randNum};
};


const form = document.getElementById("form");
form.addEventListener("submit", createPlayer);

function createPlayer(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    let p1Symb = formProps.symbol;
    let p2Symb;

    if (p1Symb == "X") {
        p2Symb = "O";
    } else {
        p2Symb = "X";
    }

    var p1 = player(p1Symb);
    var p2;

    if (formProps.ai == "ai") {
        p2 = computer(p2Symb);
    }else{ p2 = player(p2Symb); }

    gameBoard.loadPlayers(p1, p2);
    gameBoard.play();

    const removeForm = document.querySelectorAll(".form");
    removeForm[0].remove();
}
