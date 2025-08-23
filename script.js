// START POINT IS IN THE BOTTOM ⤵
// ********** SET OF FACTORY FUNCTIONS 🏭: CONTAIN THE GameBoard FUNCTIONS & ListUsers ********** //
function ControlFlowOfGame() {
    // ========= USER OBJECT =========
    const User = function (name, profilePicture) {
        this.id = Math.random().toString(36).substr(2, 9); // Generate a random ID
        this.name = name; // User's name
        this.ProfilePicture = profilePicture; // Image URL
        this.discordName = "@" + name.replace(/\s+/g, '').toLowerCase(); // Generate a @username
    }
    // ========= Interactions with game board =========
    function GameBoard () {
        // game board 
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        // ========= totals to know amount of X or O =========
        this.total_X_Positions=[];
        this.total_O_Positions=[];
        // set the symbol by row and column 
        this.setPosition = function (row, column, symbol) {
            if (this.board[row][column] !== null) {
                return;
            }
            this.board[row][column]= symbol;
        }
        // bot moves
        this.bots = (() => {
            const availableMoves = () => {
                console.log("Current Board State for Bot:", this.board);
                const possibleMoves = [];
                this.board.filter((rowValue, rowIndex) => {
                    console.log("==================",rowValue, rowIndex);
                    rowValue.forEach((colValue, colIndex) => {
                        const i = rowIndex * 3 + colIndex; // Calculate the index in a 1D array
                        console.log("Index: ", i, " | Value: ", colValue);
                        if(colValue === null) {
                            possibleMoves.push(i)
                        }
                    })

                })
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                return Object.freeze({possibleMoves, randomMove});
            }

            return {availableMoves}
        })()
        // check the winner
        this.checkWinner = () => {
            // set of cells
            const winningMoves = [
                    [0,1,2], [3,4,5], [6,7,8], // rows
                    [0,3,6], [1,4,7], [2,5,8], // columns
                    [0,4,8], [2,4,6]           // diagonals
                ];
            
            let result=null;
            
            winningMoves.forEach(cells => {
                const countX = [];
                const countO = [];
                cells.forEach(cell => {
                    if(this.total_X_Positions.includes(cell)) {
                        countX.push(cell)
                        if(countX.length === 3) {
                            console.log("X wins")
                            result= "X";
                        }
                    }
                    if(this.total_O_Positions.includes(cell)) {
                        countO.push(cell)
                        if(countO.length === 3) {
                            console.log("O wins")
                            result= "O";
                        }
                    }
                })
            });

            return result;
        }
        // check if there is an check available moves in game board
        this.checkAvailableMoves= ()=> {
            let count = 9;
            this.board.forEach((row) => {
                row.forEach((cell) => {
                    if (cell != null) {
                        count--;
                    }
                });
            });
            
            return count;
        }
        // check to player turn by the count of there moves
        this.checkWhichPlayersTurn = (movesOfPlayerOne, movesOfPlayerTwo) => {
            if(movesOfPlayerOne < movesOfPlayerTwo){
                return "X";
            } else if(movesOfPlayerOne > movesOfPlayerTwo){
                return "O";
            } else if(movesOfPlayerOne === movesOfPlayerTwo){
                return "X";
            }
        }
        // reset the game
        this.resetGame = () => {
            this.board = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];
            this.total_X_Positions=[];
            this.total_O_Positions=[];
        }
    }
    // ========= Interactions with player and user(list of user that display to chose one of them) =========
    function ListUsers () {
        this.users = [
            new User("Among Us", "./images/among-us-impostor.png"),
            new User("Super Sonic", "./images/sonic-super.png"),
            new User("Hollow Knight", "./images/hollow-knight.png"),
            new User("Freddy Fazbear", "./images/fnaf-freddy.png"),
            new User("Skull Trooper", "./images/fortnite-skull.png"),
            new User("Master Chief", "./images/halo-chief.png"),
            new User("Power Mario", "./images/mario-powered.png"),
            new User("Arthur Morgan", "./images/rdr2-arthur.png"),
            new User("Sonic", "./images/sonic-running.png"),
            new User("Sub-Zero", "./images/sub-zero-glowing.png"),
            new User("Mario", "./images/mario-serious.png"),
            new User("Geralt & Roach", "./images/witcher-roach.png"),
            new User("Dark Geralt", "./images/witcher-red-eyes.png")
        ];
        // create an object of User 
        const user = new User("", ""); // runs constructor
        // players structure
        this.playerOne = Object.assign({}, user, {
            model: "player",
            getSign() {
                return "X";
            },
            changeModel(model) {
                this.model = model;
            },            
            changeInfo(userInfo){
                this.id = userInfo.id;
                this.name = userInfo.name;
                this.ProfilePicture = userInfo.ProfilePicture;
                this.discordName = userInfo.discordName;
            },
            countMoves: 0,
        });
        this.playerTwo = Object.assign({}, user, {
            model: "bot",
            getSign() {
                return "O";
            },
            changeModel(model) {
                this.model = model;
            },
            changeInfo(userInfo){
                this.id = userInfo.id;
                this.name = userInfo.name;
                this.ProfilePicture = userInfo.ProfilePicture;
                this.discordName = userInfo.discordName;
            },
            countMoves: 0,
        });
        // adding new players to user list 
        this.addUser = function (user) {
            if (!(user instanceof User)) {
                console.error("Invalid user object:", user);
                return;
            }
            this.users.push(user);
        }
        // finding the user by search in HTML and then set it to player
        this.findAndSetPlayerInfo = function () {
            const playerOne = document.querySelector('.player-one');
            const playerTwo = document.querySelector('.player-two');
            const playerOneInfo = playerOne.querySelector('.main');
            const playerTwoInfo = playerTwo.querySelector('.main');
            const playerOneInfoDiscordName = playerOneInfo.querySelector("p").textContent;
            const playerTwoInfoDiscordName = playerTwoInfo.querySelector("p").textContent;

            const whichPlayer1 = this.users.find(user => user.discordName === playerOneInfoDiscordName);
            const whichPlayer2 = this.users.find(user => user.discordName === playerTwoInfoDiscordName);
            this.playerOne.changeInfo(whichPlayer1);
            this.playerTwo.changeInfo(whichPlayer2);
        }
    }

    return {
        gameBoard: new GameBoard(),
        listUsers: new ListUsers()
    }
}
// ********** SET OF FUNCTIONS: CONTAIN THE CONTRACT FUNCTION WITH HTML TO CHANGE AND SET THE UI ********** //
function UiFunctionalities() {
    // ========= Create a player profile element ==========
    playerProfile = function (name, username,srcImage, classToChangeStyleByPosition) {
        // ========== div element to hold the profile ==========
        const container = document.createElement('div');
        container.classList.add(classToChangeStyleByPosition);
        container.attributes.setNamedItem(document.createAttribute('data-character'));
        container.attributes.getNamedItem('data-character').value = name;
        // ========== image element ==========
        const profileImage = document.createElement('img');
        profileImage.src = srcImage;
        profileImage.alt = name;
        container.appendChild(profileImage);
        // ========== div element to contents==========
        const contentProfile = document.createElement('div');
        // ========== name element ==========
        const playerName = document.createElement('h4');
        playerName.textContent = name;
        contentProfile.appendChild(playerName);
        // ========== Username element ==========
        const playerUsername = document.createElement('p');
        playerUsername.textContent = username
        contentProfile.appendChild(playerUsername);
        // ========== Append the content to the container ==========
        container.appendChild(contentProfile);
        return container;
    }
    // ========= Toggle the player list visibility ==========
    togglePlayerList = (player) => {
        const list = document.getElementById(`player${player}-list`);
        list.classList.toggle('hidden');
    }
    // ========= Get display Player one and Player Two ==========
    displayMainPlayer = (playerData, whichPlayer) => {
        if (whichPlayer === "one") {
            // ========= Get display Player one ==========
            const playerOne = document.querySelector(".player-one")
            playerOne.appendChild(playerProfile(playerData.name, playerData.discordName, playerData.ProfilePicture, "main"));
            console.log("Player One Data:", playerProfile(playerData.name, playerData.discordName, playerData.ProfilePicture, "main"));
        }
        else if (whichPlayer === "two") {
            // ========= Get display Player Two ==========
            const playerTwo = document.querySelector(".player-two")
            playerTwo.appendChild(playerProfile(playerData.name, playerData.discordName, playerData.ProfilePicture, "main"));
        }    
    }
    // ========= Change the main player ==========
    changeMainPlayer = (parentId, user, whichModel) => {
        // console.log("Parent ID:", parentId);
        // console.log("is 1 or 2? ",parentId.includes("1") ? "one" : "two");
        function changePlayer(mainPlayerHTML, infoOfPlayerByHTML) {
            mainPlayerHTML.querySelector('img').src = infoOfPlayerByHTML.querySelector('img').src;
            mainPlayerHTML.querySelector('h4').textContent = infoOfPlayerByHTML.querySelector('h4').textContent;
            mainPlayerHTML.querySelector('p').textContent = infoOfPlayerByHTML.querySelector('p').textContent;
        }
        
        const ObjectOfUser = new ControlFlowOfGame().listUsers;

        // ========= Check if the parentId is 1 or 2 or 1 in bot ==========
        if (parentId.includes("1") && whichModel === "bot") {
            const playerOne = document.querySelector(".player-one");
            playerOne.childNodes.forEach(child => {
                // ========= check if the child is a div and has the class main ==========
                if (child.nodeName === "DIV" && child.classList.contains("main")) {
                    // ========= change the main player with the user data ==========
                    child.querySelector('img').src = user.ProfilePicture;
                    child.querySelector('h4').textContent = user.name;
                    child.querySelector('p').textContent = user.discordName
                }
            })
        } else if (parentId.includes("1") && whichModel === "friend") {
            const playerOne = document.querySelector(".player-one");
            playerOne.childNodes.forEach(child => {
                // ========= check if the child is a div and has the class main ==========
                if (child.nodeName === "DIV" && child.classList.contains("main")) {
                    // ========= change the main player with the user data but the data is not in JSON form it is HTML ==========
                    changePlayer(child, user);
                }
            })
        } else if (parentId.includes("2")) {
            const playerTwo = document.querySelector(".player-two");
            playerTwo.childNodes.forEach(child => {
                // ========= check if the child is a div and has the class main ==========
                if (child.nodeName === "DIV" && child.classList.contains("main")) {
                    // ========= change the main player with the user data but the data is not in JSON form it is HTML ==========
                    changePlayer(child, user);
                }
            })
        }
    }
    // ========= Get the player list container ==========
    displayUserList = (whichModel, userList) => {
        const containerOfPlayerOne = document.querySelector('.player-one');
        // ========== Create the player list container ==========
        const playerListContainer=document.createElement('div');
        playerListContainer.classList.add('player-list');
        playerListContainer.classList.add('hidden');
        userList.forEach(user => {
            const playerProfileInfo = playerProfile(user.name, user.discordName, user.ProfilePicture, "player");
            // ========= set Event Listener to send the parent id to the changeMainPlayer function to change the main player ==========
            playerProfileInfo.addEventListener('click', () => {
                const parent = playerProfileInfo.parentElement;
                if (parent) {
                    changeMainPlayer(parent.id, user, whichModel);
                } else {
                    console.warn('Parent element not found');
                }
            });
            playerListContainer.appendChild(playerProfileInfo);
        })
        // ========== button of changing the player character ==========
        const selectButton = document.createElement('button');
        selectButton.classList.add('select-btn');
        selectButton.textContent = 'Change Character';
        // ========== Append the player list container to the respective player container ==========
        if (whichModel === "bot") {
            playerListContainer.setAttribute('id', 'player1-list');
            
            // ========= add the player list container to player one ==========
            containerOfPlayerOne.appendChild(playerListContainer);
            // ========== add the button to change the character only to player one(because the bot player will randomly chosen) ==========
            selectButton.addEventListener('click', () => {
                togglePlayerList("1")
            });
            containerOfPlayerOne.appendChild(selectButton);
        } else if (whichModel === "friend") {
            const containerOfPlayerTwo = document.querySelector('.player-two');
            
            const playerListContainerCopyOne = playerListContainer.cloneNode(true);
            playerListContainerCopyOne.setAttribute('id', 'player1-list');
            const playerListContainerCopyTwo = playerListContainer.cloneNode(true);
            playerListContainerCopyTwo.setAttribute('id', 'player2-list');
            // ========= also as the same as above ==========
            containerOfPlayerOne.appendChild(playerListContainerCopyOne);
            containerOfPlayerTwo.appendChild(playerListContainerCopyTwo);
            // ========= set Event Listener to send the parent id to the changeMainPlayer function to change the main player ==========
            // Re-attach event listeners to cloned children, because we copied the player list container and in using coloneNode it doesn't copy the event listeners
            [playerListContainerCopyOne, playerListContainerCopyTwo].forEach(clone => {
                clone.querySelectorAll('.player').forEach(profile => {
                    profile.addEventListener('click', function () {
                        const parent = this.parentElement; // parent of the clicked profile
                        const parentId = parent?.id;
                        if (parentId) {
                            changeMainPlayer(parentId, profile, whichModel);
                        } else {
                            console.warn('Parent element not found');
                        }
                    });
                });
            });
            // ========= we make two copy of selectButton because if we use appendChild it mean moved to new place ==========
            // ========= button copy to player one with add event to player one ==========
            const selectButtonCopyOne = selectButton.cloneNode(true);
            selectButtonCopyOne.addEventListener('click', () => {
                togglePlayerList("1")
            });
            // ========= button copy to player two with add event to player two ==========
            containerOfPlayerOne.appendChild(selectButtonCopyOne);
            const selectButtonCopyTwo = selectButton.cloneNode(true);
            selectButtonCopyTwo.addEventListener('click', () => {
                togglePlayerList("2")
            });
            containerOfPlayerTwo.appendChild(selectButtonCopyTwo);
        }
    }
    // ========= set the player to the game board ==========
    setPlayerToGameBoard = (playerOne, playerTwo) => {
        const playerInfoX = document.querySelector(".player-info-x");
        const playerInfoO = document.querySelector(".player-info-o");
        playerInfoX.querySelector('img').src = playerOne.ProfilePicture;
        playerInfoX.querySelector('h4').textContent = playerOne.name;
        playerInfoX.querySelector('p').textContent = playerOne.discordName;

        playerInfoO.querySelector('img').src = playerTwo.ProfilePicture;;
        playerInfoO.querySelector('h4').textContent = playerTwo.name;
        playerInfoO.querySelector('p').textContent = playerTwo.discordName;
    }
    // =========     =========
    setMoveToGameBoard = (whichMove, position) => {
        const gameBoard = document.querySelector('.grid-container');
        const cell = gameBoard.children[position];
        if(cell.textContent!=='') return false
        cell.textContent = whichMove;
        cell.classList.add('animateMarker');
        return true;
    }
    // =========     =========
    setTheTurnPlayer = (whichPlayer) => {
        document.querySelector(`.player-info-x`).classList.remove('active');
        document.querySelector(`.player-info-o`).classList.remove('active');
        const playerInfo = document.querySelector(`.player-info-${whichPlayer.toLowerCase()}`);
        playerInfo.classList.add('active');
    }
    // =========     =========
    setTheWinner = (winner) => {
        // if(winner===null) return;
        const resultMessage = document.getElementById('result-message');
        const winnerName = document.getElementById('winner-name');
        if(winner==="reset") {
            resultMessage.style.display="none";
            winnerName.textContent = "";
            return
        };
        resultMessage.style.display="block";
        winnerName.textContent = winner.name;
    }
    // =========     =========
    resetGameBoard = () => {
        document.querySelectorAll('.grid-container .cell').forEach(item => {
            item.textContent = "";
        })
    }

    return {
        displayMainPlayer,
        displayUserList,
        setPlayerToGameBoard,
        setMoveToGameBoard,
        setTheTurnPlayer,
        setTheWinner,
        resetGameBoard
    }
}

// ********** FUNCTION USE TO KNOW IF THE PLAYER WANT PLAY WITH BOT OR WITH ANOTHER PLAYER ********** //
function selectModel(whichModel="bot") {
    const userList = new ControlFlowOfGame().listUsers;
    const uiFunctionalities = new UiFunctionalities();

    const choicePlayerOneID = userList.users[Math.floor(Math.random() * userList.users.length)].id;
    const choicePlayerTwoID = userList.users[Math.floor(Math.random() * userList.users.length)].id;
    const choicePlayerOne = userList.users.find(user => user.id === choicePlayerOneID);
    const choicePlayerTwo = userList.users.find(user => user.id === choicePlayerTwoID);
    // console.log("choicePlayerOne",choicePlayerOne);
    // console.log("choicePlayerTwo",choicePlayerTwo);
    userList.playerOne.changeInfo(choicePlayerOne); // set the info to player one
    uiFunctionalities.displayMainPlayer(userList.playerOne, "one");
    userList.playerTwo.changeInfo(choicePlayerTwo); // set the info to player two
    uiFunctionalities.displayMainPlayer(userList.playerTwo, "two");

    if (whichModel === "bot") {
        console.log("Selected User One:", userList.playerOne);
        console.log("Selected User One:", userList.users);
        uiFunctionalities.displayUserList(whichModel, userList.users);
    }
    else if (whichModel === "friend"){
        uiFunctionalities.displayUserList(whichModel, userList.users);
    }
    // console.log("Selected User One:", userList.playerOne);
    // console.log("Selected User Two:", userList.playerTwo);
    switchToNextSteps("listOfUsers");
}

// ********** FUNCTION TO CHANGE THE UI TO NEXT STEPS ********** //
function switchToNextSteps(displayWhat='choiceOfGameMode') {
    const playWith = document.querySelector('.play-with');
    const playerDisplay = document.querySelector('.player-display');  
    const gameBoardStyle = document.getElementById('game-board');
    playWith.style.display = 'none';
    playerDisplay.style.display = 'none';
    gameBoardStyle.style.display = 'none';
    // switch the ui except startGame because there is some other thing in there
    switch(displayWhat) {
        case 'choiceOfGameMode':
            playWith.style.display = 'block';
            break;
        case 'listOfUsers':
            playerDisplay.style.display = 'block';
            break;
        case 'startGame':
            // check if the HTML is there or not because I add the list of user when there is two player 
            const isPlayerTwoPlayer = Array.from(document.querySelectorAll('.player-two')) .some(el =>
                el.classList.contains('player-list') ||
                el.classList.contains('select-btn') ||
                el.querySelector('.player-list') ||
                el.querySelector('.select-btn')
            );
            const modelOfPlayerTwo = isPlayerTwoPlayer ? "friend" : "bot" ;
            // 
            const game = new ControlFlowOfGame();
            const gameUsers = game.listUsers;
            gameUsers.findAndSetPlayerInfo(); // Find and set the player info from the HTML
            const uiFunctionalities = new UiFunctionalities();
            uiFunctionalities.setPlayerToGameBoard(gameUsers.playerOne, gameUsers.playerTwo); // Set the player to the game board
            gameUsers.playerTwo.changeModel(modelOfPlayerTwo); // the isPlayerTwoBotOrPlayer return true or false so we check if it was true then it mean the user list is there and it mean they will play with friend
            const gameBoard = game.gameBoard; // select contractor functions of GameBoard()
            // loop to all the cells to add to them some events
            document.querySelectorAll('.grid-container .cell').forEach(item => {
                // based on the move counts we know which player should play and return 'X' || 'O' char
                let whichPlayerIsFirst = gameBoard.checkWhichPlayersTurn(gameUsers.playerOne.countMoves, gameUsers.playerTwo.countMoves);
                console.log("whichPlayerIsFirst: ",whichPlayerIsFirst)
                // by default set the turn of player
                uiFunctionalities.setTheTurnPlayer(whichPlayerIsFirst);
                // add event listener to cells of game board in this place because we have all necessary information
                item.addEventListener('click', function() {
                    someTransactions(item)
                    //
                    if(modelOfPlayerTwo=== "bot"){
                        console.log("Bot is playing now");
                        setTimeout(() => {
                            const items = document.querySelectorAll('.grid-container .cell')
                            const randomItem = items[gameBoard.bots.availableMoves().randomMove];
                            someTransactions(randomItem);
                        }, 500);
                    }
                });
            });
            // 
            function someTransactions(item){
                // set the move & to which player & the position & increase the moves of each player
                function setOfChanges(item,rowValue,colValue=0, whichPlayerIsFirst) {
                    // get the index of cell
                    const position = item.getAttribute('data-index');
                    // set the value to board by row(rowValue) and column(position-colValue) and the value is whichPlayerIsFirst("X" || "O")
                    gameBoard.setPosition(rowValue, position-colValue,whichPlayerIsFirst);
                    // increase the value of moves by whichPlayerIsFirst
                    whichPlayerIsFirst == "X" ? gameBoard.total_X_Positions.push(Number(position)) : gameBoard.total_O_Positions.push(Number(position));
                    const checkIsAdded=uiFunctionalities.setMoveToGameBoard(whichPlayerIsFirst, position);
                    if (!checkIsAdded) return;
                }
                // 
                if(document.getElementById("winner-name").textContent !== undefined && document.getElementById("winner-name").textContent !=="") {
                    return
                }
                // update the player turn
                whichPlayerIsFirst = gameBoard.checkWhichPlayersTurn(gameUsers.playerOne.countMoves, gameUsers.playerTwo.countMoves);
                if(gameBoard.checkAvailableMoves()==0) {
                    uiFunctionalities.setTheWinner(gameBoard.checkWinner());
                    return;
                }
                // check to know the position of the move & the player & also the value
                if(item.getAttribute('data-index')>=0 && item.getAttribute('data-index')<3){
                    setOfChanges(item, 0, 0, whichPlayerIsFirst);
                    
                }else if(item.getAttribute('data-index')>=3 && item.getAttribute('data-index')<6){
                    setOfChanges(item, 1, 3, whichPlayerIsFirst);

                }else if(item.getAttribute('data-index')>=6 && item.getAttribute('data-index')<9){
                    setOfChanges(item, 2, 6, whichPlayerIsFirst);
                }
                // user to change the UI to show which player is should play
                uiFunctionalities.setTheTurnPlayer(whichPlayerIsFirst== "X" ? "O" : "X");
                // increase the move count of players based on the turn they have
                if (whichPlayerIsFirst == "X") {
                    gameUsers.playerOne.countMoves++;
                } else if (whichPlayerIsFirst == "O") {
                    gameUsers.playerTwo.countMoves++;
                }
                // check if there is a winner
                const winnerValue=gameBoard.checkWinner();
                // check if there is any winner
                if(winnerValue === "X" || winnerValue === "O"){
                    let winnerPlayer=null;
                    //check if the value is X then the winner name is player one if not it is player two
                    if(winnerValue === "X"){ 
                        winnerPlayer = gameUsers.playerOne;
                        uiFunctionalities.setTheTurnPlayer("X")
                    } else if(winnerValue === "O"){
                        winnerPlayer = gameUsers.playerTwo;
                        uiFunctionalities.setTheTurnPlayer("O")
                    }
                    // set the winner player to HTML
                    uiFunctionalities.setTheWinner(winnerPlayer);  
                    gameUsers.playerOne.countMoves=0;
                    gameUsers.playerTwo.countMoves=0;
                }
            }
            // event listener to reset the information
            document.getElementById("reset-button").addEventListener('click', () => {
                // reset the board value
                gameBoard.resetGame();
                // reset the HTML
                uiFunctionalities.resetGameBoard();
                // reset the player that win
                uiFunctionalities.setTheWinner("reset");
                // reset the turn player
                uiFunctionalities.setTheTurnPlayer("X");
                console.log("gameBoard.bots.availableMoves(): ", gameBoard.bots.availableMoves())
            })
            // make the HTML display
            gameBoardStyle.style.display = 'block';
            break;   
    }
}

// 1️⃣START POINT: USE TO HIDDEN SOME PART IN THE FIRST PAGE, MAKE THE STARTED POINT BE IN FIRST STEP
switchToNextSteps();