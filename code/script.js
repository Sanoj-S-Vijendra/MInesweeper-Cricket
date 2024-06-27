//calling elements having different ids as a variable in js file
const gridSizeOptions = document.getElementById('gridSizeOptions');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const gridContainer = document.getElementById('grid');
const scoreValue = document.getElementById('scoreValue');
const scoreDiv = document.getElementById('score');
const leaderboardContainer = document.getElementById('leaderboard');
const float = document.getElementById('float');
const fieldersCount = 11;

//initialising required variables
let gridSize = 6; // Default grid size
let successfulMoves = 0;
let lives = 0;
let wickets = 0;
let fielderLocations = [];
let score = 0;
let gameOver = false;
let gameStarted = false;
let playerName = '';
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

//function is responsible for toggling the visibility of an instructions div and updating the text of the corresponding button. 
function toggleInstructions() {
    const instructionsDiv = document.getElementById('instructions');
    const insbtn = document.getElementById('instructionsButton')
    //checks the current value of display of instructionDiv
    if (instructionsDiv.style.display === 'none') {
        //if nstructionsDiv.style.display = 'none'
        insbtn.innerHTML = "Hide"; //This updates the text displayed on the button to indicate that clicking it will hide the instructions.
        instructionsDiv.style.display = 'block'; //This makes the instructions div visible by changing its display style to block-level.
    } else {
        //if above condition is false
        insbtn.innerHTML = "Instructions" //This updates the text displayed on the button to indicate that clicking it will show the instructions.
        instructionsDiv.style.display = 'none'; //This hides the instructions div by changing its display style to none, effectively removing it from the visible layout.
    }
}

//function is responsible for setting the grid size and adjusting the game elements accordingly. The function takes a parameter 'size' which represents the desired grid size.
function setGridSize(size) {
    gridSize = size;  //determines the number of rows and columns in the grid
    gridSizeOptions.style.display = 'none'; //This hides the grid size options from the user interface.
    startButton.style.display = 'block'; //This makes the start button visible to the user.

    // Set the number of lives based on grid size
    if (size <= 6) {
        lives = size - 2;
    } else {
        lives = 5;
    }
}

//The createGrid() function is responsible for dynamically creating a grid of blocks based on a selected grid size.
function createGrid() {
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; //sets the number of columns in the grid container using a CSS grid template. The gridSize variable determines the number of columns, and the 1fr value ensures that each column occupies an equal fraction of the available space.
    //intializing for loop
    for (let i = 0; i < gridSize * gridSize; i++) {
        const block = document.createElement('div'); //a new div element is created
        block.classList.add('block'); //The block element is assigned the CSS class "block" using 
        block.dataset.index = i;
        block.addEventListener('click', blockClick); //An event listener is added to the block element using block.addEventListener('click', blockClick). This means that when the block is clicked, the blockClick function (which is not shown here) will be executed.
        gridContainer.appendChild(block); //he block element is appended to the gridContainer, which is presumably a container element in the HTML where the grid of blocks will be displayed.
    }
}

//function is responsible for randomly generating the locations of fielders in the game
function generateFielders() {
    fielderLocations = []; //initializes an empty array fielderLocations which will store the indices of the fielder positions.
    let fielderCount = 0;
    //determines the number of fielders based on the grid size
    if (gridSize <= 6) {
        fielderCount = gridSize;
    } else if (gridSize === 7) {
        fielderCount = gridSize + 2;
    } else {
        fielderCount = 11;
    }
    //enters a loop that iterates fielderCount times to generate the fielder positions.
    for (let i = 0; i < fielderCount; i++) {
        let randomIndex = Math.floor(Math.random() * gridSize * gridSize); // a random index is generated using Math.random() and multiplied by gridSize * gridSize to ensure it falls within the range of the grid size.
        //checks if the generated randomIndex is already present in the fielderLocations array using fielderLocations.includes(randomIndex). This ensures that the same index is not selected multiple times.
        while (fielderLocations.includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * gridSize * gridSize); //If the randomIndex is already present in fielderLocations, a new random index is generated until a unique index is found.
        }
        fielderLocations.push(randomIndex); //Once a unique index is obtained, it is added to the fielderLocations array using fielderLocations.push(randomIndex).
    }
}

//function is called to initiate the game and set up the initial game state
function startGame() {
    gameStarted = true; //sets the gameStarted variable to true, indicating that the game has started.
    gameOver = false; //sets the gameOver variable to false, indicating that the game is not over.
    score = 0; //initializes the score variable to 0, representing the player's initial score.
    scoreDiv.style.display = 'block'; //displays the score div element on the screen. This element is responsible for showing the player's score during the game.
    gridContainer.innerHTML = ''; //clears the contents of the gridContainer element. This ensures that any previous grid elements are removed before creating a new grid.
    createGrid(); //calls the createGrid()
    generateFielders(); //calls the generateFielders()
    leaderboardContainer.style.display = 'block'; //displays the leaderboard container on the screen. This container holds the leaderboard information.
    gridContainer.style.display = 'grid'; // Display the grid after starting the game
    startButton.style.display = 'none'; // Hide the start button after starting the game
    resetButton.style.display = 'block'; // Show the reset button after starting the game
    float.style.display = 'none'; //hides the float element
    successfulMoves = 0; //initializes the successfulMoves variable to 0, representing the number of successful moves made by the player.
    revealButton.style.display = 'none'; //hides the reveal button. The purpose and behavior of this button are not clear from the provided code snippet.
    loadLeaderboard(); //calls the loadLeaderboard() function to load the leaderboard data and display it on the screen.
}

function blockClick(event) {
    //This condition checks if the gameOver flag is true. If the game is already over, the function returns early and does not execute the remaining code.
    if (gameOver) {
        return;
    } 
    successfulMoves++; //Increments the successfulMoves variable by 1, representing the number of successful moves made by the player.
    //Checks if the number of successful moves is a multiple of 5. If it is, the reveal button is displayed by setting its display property to 'block'.
    if (successfulMoves%5 === 0) {
        revealButton.style.display = 'block';
    }
    const block = event.target; //Retrieves the clicked block element from the event object.
    const blockIndex = parseInt(block.dataset.index); //Retrieves the index of the clicked block from its data-index attribute and converts it to an integer.
    //Checks if the clicked block index is included in the fielderLocations array, indicating that it contains a fielder.
    if (fielderLocations.includes(blockIndex)) {
        //If there are remaining lives (lives > 0), the block's background image is set to 'out.png' to indicate that a wicket has fallen, and the wicketfall function is called.
        if (lives > 0) {
        block.style.backgroundImage = 'url(out.png)';
        wicketfall();   
        }
        //If there are no remaining lives (lives === 0), the game is set to over (gameOver = true), the block's background image is set to 'out.png', the displayGameOver function is called to handle the game over scenario, and the updateLeaderboard function is called to update the leaderboard.
        if (lives === 0 ){
        gameOver = true;
        block.style.backgroundImage = 'url(out.png)';
        displayGameOver();
        updateLeaderboard();
        }
    }
    //If the clicked block does not contain a fielder:
    else {
        let scoreV = 0;
        //The score value (scoreV) is determined based on the grid size. A random number is generated, and based on probability ranges, a score value is assigned.
        if (gridSize <= 7) {
            const prob = Math.random();

            if (prob <= 2 / gridSize) {
                scoreV = 1;
            } else if (prob <= (2 / gridSize) + (1 / gridSize)) {
                scoreV = 2;
            } else if (prob <= (2 / gridSize) + (1 / gridSize) + (5 / (3 * gridSize))) {
                scoreV = 4;
            } else {
                scoreV = 6;
            }
        } else {
            const prob = Math.random();

            if (prob <= 0.2) {
                scoreV = 1;
            } else if (prob <= 0.2 + 0.1) {
                scoreV = 2;
            } else if (prob <= 0.2 + 0.1 + 0.05) {
                scoreV = 3;
            } else if (prob <= 0.2 + 0.1 + 0.05 + 0.35) {
                scoreV = 4;
            } else {
                scoreV = 6;
            }
        }

        score = score + scoreV; //The score variable is updated by adding the scoreV.
        scoreValue.textContent = score + "/" + wickets; //The scoreValue element's text content is updated to display the updated score and wickets.
        block.textContent = scoreV; //The clicked block's text content is set to the scoreV, displaying the score on the block.
        block.style.backgroundColor = '#DB005B'; //The clicked block's background color is set to #DB005B.
        block.removeEventListener('click', blockClick); //The click event listener is removed from the block, preventing further clicks on the same block.
        block.style.transform = 'rotateY(360deg)'; //The clicked block is rotated 360 degrees using the transform property.
    }
}

//function reveals a randomly chosen fielder tile for a short duration
function revealFielder() {
    const fielderIndex = fielderLocations[Math.floor(Math.random() * fielderLocations.length)]; //Generates a random index from the fielderLocations array using Math.random() and Math.floor(). This index corresponds to a randomly chosen fielder block.
    const fielderBlock = document.querySelector(`[data-index="${fielderIndex}"]`); // Selects the fielder block element based on the randomly chosen index using a CSS attribute selector.
    fielderBlock.style.backgroundImage = 'url(fielder.png)'; //Sets the background image of the fielder block to 'fielder.png', revealing the fielder.
    //Sets a timeout function to execute after 1000 milliseconds (1 second).
    setTimeout(function () {
        fielderBlock.style.backgroundImage = 'none'; //Removes the background image from the fielder block, hiding the fielder.
        fielderBlock.style.backgroundColor = '#E8AA42'; //Sets the background color of the fielder block to #E8AA42, restoring its original appearance.
    }, 1000);

    revealButton.style.display = 'none'; //Hides the reveal button after it has been clicked.
}

//function is called when a fielder tile is clicked, indicating that a wicket has fallen
function wicketfall() {
    wickets++; // Increments the wicket count by 1, tracking the number of wickets that have fallen.
    lives--; //Decrements the number of remaining lives by 1. Lives represent the number of remaining chances the player has before the game is over.
    successfulMoves = 0; //Resets the successfulMoves variable to 0. successfulMoves keeps track of the number of consecutive successful moves made by the player without losing a wicket.
    scoreValue.textContent = score + "/" + wickets; //Updates the text content of the scoreValue element to display the current score and wicket count.
    revealButton.style.display = 'none';
    alert(`Out!. You lost a wicket at ${score}. Current Score: ${score}/${wickets}`); //Displays an alert dialog box indicating that a wicket has been lost. The alert message includes the score at which the wicket fell and the current score and wicket count.
}

//function is called when the player clicks reset button
function resetGame() {
    successfulMoves = 0; // Resets the successfulMoves variable to 0. This variable keeps track of the number of consecutive successful moves made by the player without losing a wicket.
    revealButton.style.display = 'none'; //Hides the revealButton element. This button allows the player to reveal a fielder block.
    location.reload(); // Reload the page to reset the game and go back to the homepage
}

//function is called when the game is over, meaning the player has lost all their wickets.
function displayGameOver() {
    revealButton.style.display = 'none';
    alert(`All Out! Your final score is ${score}.`); //Displays an alert box with a message informing the player that the game is over and showing their final score.
    //Checks if the player has scored any runs (score > 0). If they have, it calls the promptPlayerName function. This function prompts the player to enter their name for the leaderboard if they have scored any runs.
    if (score > 0) {
      promptPlayerName();
    }
    displayLeaderboard(); //Calls the displayLeaderboard function. This function displays the leaderboard, showing the current high scores achieved by players.
}

//function is responsible for prompting the player to enter their name after the game is over and their score is greater than zero.
function promptPlayerName() {
    playerName = prompt('Enter your name:'); //Displays a prompt dialog box with a message asking the player to enter their name. The entered name is stored in the playerName variable.
    // Checks if the playerName variable is not empty (the player entered a name).
    if (playerName) {
      addToLeaderboard(); //This function adds the player's name and score to the leaderboard. It typically updates the leaderboard data structure or sends the player's name and score to a server for storage.
      displayLeaderboard(); //This function displays the updated leaderboard, including the newly added player's name and score.
    }
  }

// function is responsible for loading the leaderboard data from the browser's local storage and updating the leaderboard display
function loadLeaderboard() {
    const storedLeaderboard = localStorage.getItem('leaderboard'); //Retrieves the leaderboard data from the browser's local storage using the key 'leaderboard'. The data is stored as a string.
    //Checks if there is any stored leaderboard data in the local storage.
    if (storedLeaderboard) {
      leaderboard = JSON.parse(storedLeaderboard); //parses the string data back into a JavaScript object using JSON.parse(). The parsed leaderboard data is stored in the leaderboard variable.
      updateLeaderboard(); //Calls the updateLeaderboard function to update the leaderboard display based on the loaded data.
    }
  }

// function is responsible for adding the current player's data to the leaderboard and storing it in the browser's local storage
function addToLeaderboard() {
    // Creates a new JavaScript object playerData that represents the current player's data.
    const playerData = {
      name: playerName,
      score: score,
    };
    leaderboard.push(playerData); //Adds the playerData object to the leaderboard array. This appends the player's data to the end of the array.
    leaderboard.sort((a, b) => b.score - a.score); // Sort leaderboard in descending order by score
    //Checks if the leaderboard has more than 10 entries.
    if (leaderboard.length > 10) {
      leaderboard.pop(); // Keep only the top 10 scores
    }
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard)); // Store leaderboard data in local storage
  }

//function is responsible for rendering the leaderboard on the webpage
function displayLeaderboard() {
    leaderboardContainer.innerHTML = '<h2>Leaderboard</h2>'; //ets the content of the leaderboardContainer element to include an <h2> heading with the text "Leaderboard". This clears any existing content in the container.
    //Checks if length of array is 0.
    if (leaderboard.length === 0) {
      leaderboardContainer.innerHTML += '<p>No scores yet.</p>'; //appends a <p> paragraph element to the leaderboardContainer with the text "No scores yet.". 
    } else {
        //iterates over each player object in the leaderboard using the forEach method
        leaderboard.forEach((player, index) => {
        leaderboardContainer.innerHTML += `<p>${index + 1}. ${player.name}: ${player.score}</p>`; //appends a <p> paragraph element to the leaderboardContainer with the player's rank, name, and score. 
      });
    }
  }