/* Global Variables */
let imagePath = "images/";
let currentPose = "/rest.png";

/* Character Class */
class Character {
    constructor(name, strength, defence, sprite, hp, attacks, speed, playerType, turnBar = 0) {
        this.name = name;
        this.currentHp = hp;
        this.totalHp = hp;
        this.strength = strength;
        this.defence = defence;
        this.sprite = sprite;
        this.attacks = attacks;
        this.speed = speed;
        this.turnBar = turnBar;
        this.playerType = playerType;
        this.currentDamage = 0;
        this.isAttacking = false;
    }
}

/*Characters Available*/
const charList = [
    {
        name: "Mijumaru",
        strength: 30,
        defence: 10,
        sprite: "mijumaru",
        hp: 110,
        speed: 50,
        attacks: [{
                name: "1",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame3, 1, 3000, 100, 6);
                }
        },
            {
                name: "2",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame2, 1, 1000, 100, 0);
                }
        }]
    },
    {
        name: "Mushit",
        strength: 20,
        defence: 10,
        speed: 70,
        sprite: "mushit",
        hp: 100,
        attacks: [{
                name: "1",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame3, 1, 3000, 100, 3);
                }
        },
            {
                name: "2",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame1, 4, 250, 100, 0);
                }
        }, {
                name: "3",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame1, 2, 300, 100, 0);
                }
        }]
    }
];

const enemyList = [
    {
        name: "Inverse 1",
        strength: 7,
        defence: 10,
        sprite: "mijumaru",
        hp: 40,
        speed: 15,
        attacks: [{
                name: "1",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame1, 2, 300, 100, 0);
                }
        },
            {
                name: "2",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame1, 2, 300, 100, 0);
                }
        }]
    },
    {
        name: "Inverse 2",
        strength: 7,
        defence: 10,
        sprite: "mushit",
        hp: 50,
        speed: 15,
        attacks: [{
                name: "1",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame1, 2, 300, 100, 0);
                }
        },
            {
                name: "2",
                icon: "",
                damage: 10,
                trigger: function () {
                    launchMiniGame(minigame1, 2, 300, 100, 0);
                }
        }]
    }
];

/* Create Player Frames */
const createPlayerFrames = () => {
    const $playerFrame = $("<div>").addClass("col player-frame pl-5 row align-items-center");
    $(".battle-scene").append($playerFrame);
    const $enemyFrame = $("<div>").addClass("col enemy-frame offset-4 pr-5 row align-items-center");
    $(".battle-scene").append($enemyFrame);
}

/* Create Character */
let currentCharacters = [];
let currentEnemies = [];
const createCharacter = (number, listType) => {
    const newChar = new Character(listType[number].name, listType[number].strength, listType[number].defence, listType[number].sprite, listType[number].hp, listType[number].attacks, listType[number].speed, true);
    currentCharacters.push(newChar);
}

const createEnemy = (number) => {
    const newEnemy = new Character(enemyList[number].name, enemyList[number].strength, enemyList[number].defence, enemyList[number].sprite, enemyList[number].hp, enemyList[number].attacks, enemyList[number].speed, false);
    currentEnemies.push(newEnemy);
}

/* Create Sprite */
const createSprites = (number, frame, listType, characterType) => {
    const $playerContainer = $("<div>").addClass("char-container");
    const $playerSprite = $("<img>").attr("src", imagePath + listType[number].sprite + currentPose).addClass(`char-sprite char-${number} w-50 row row-odd`);
    if (characterType[number].playerType === true) {
        $playerContainer.addClass("player");
        $playerSprite.addClass("player");
        //Create BattleIcons
        createBattleIcons(number, $playerContainer, characterType); //Create PlayerSprite
    } else if (characterType[number].playerType === false) {
        $playerContainer.addClass("enemy");
        $playerSprite.addClass("enemy");
    }
    $($playerContainer).append($playerSprite);
    //Create HP Bars
    createHpBar(number, $playerContainer, characterType);
    //Create Turn Bars
    createTurnBar(number, $playerContainer, characterType);
    //Create Container
    $(frame).append($playerContainer);
    //Show Battle Icons if player is true
    if (characterType[number].playerType === true) {
        $(".char-container").eq(number).on("mouseenter", () => {
            $(".attack-list").eq(number).fadeIn(500).toggleClass("d-block");
        });
        $(".char-container").eq(number).on("mouseleave", () => {
            $(".attack-list").eq(number).fadeOut(500).toggleClass("d-block");
        });
    }
}

const createEnemySprites = (number, frame, listType) => {
    const $playerContainer = $("<div>").addClass("char-container");
    const $playerSprite = $("<img>").attr("src", imagePath + listType[number].sprite + currentPose).addClass(`char-sprite char-${number} w-50 row row-odd`).css("filter", `hue-rotate(${Math.floor(Math.random() * 180)}deg) grayscale(${Math.floor(Math.random() * 100)}%)`);
    $playerContainer.addClass("enemy");
    $playerSprite.addClass("enemy");
    $($playerContainer).append($playerSprite);

    //Create HP Bars
    createHpBar(number, $playerContainer, listType);
    createTurnBar(number, $playerContainer, listType);

    //Create Container
    $(frame).append($playerContainer);
    //Show Battle Icons if player is true
}

/* Create HP Bar */
const createHpBar = (number, frame, characterType) => {
    const $hpBarContainer = $("<div>").addClass("hp-bar-container w-75");
    $(frame).append($hpBarContainer);
    const $hpBar = $("<div>").addClass("hp-bar").text(`${characterType[number].currentHp}/${characterType[number].totalHp}`).css("width", `${characterType[number].currentHp/characterType[number].totalHp * 100}%`);
    if (characterType[number].playerType === true) {
        $hpBar.addClass("player");
        $hpBarContainer.addClass("player");
    } else if (characterType[number].playerType === false) {
        $hpBar.addClass("enemy");
        $hpBarContainer.addClass("enemy");
    }
    $hpBarContainer.append($hpBar);
}

/* Create Turn Bar */
const createTurnBar = (number, frame, characterType) => {
    const $turnBarContainer = $("<div>").addClass("turn-bar-container w-75");
    $(frame).append($turnBarContainer);
    const $turnBar = $("<div>").addClass("turn-bar").css("width", `${characterType[number].turnBar}%`);
    if (characterType[number].playerType === true) {
        $turnBarContainer.addClass("player");
        $turnBar.addClass("player");
    } else if (characterType[number].playerType === false) {
        $turnBarContainer.addClass("enemy");
        $turnBar.addClass("enemy");
    }
    $turnBarContainer.append($turnBar);
}

/* Create Battle Icons */
const createBattleIcons = (number, frame, characterType) => {
    const $attackList = $("<ul>").addClass("attack-list");
    for (let i = 0; i < characterType[number].attacks.length; i++) {
        const $icon = $("<li>").addClass("attack-icon m-2");
        $($attackList).append($icon);
    }
    $(frame).append($attackList);
}

const createPlayer = () => {
    for (let i = 0; i < charList.length; i++) {
        createCharacter(i, charList);
    }
}

/* Initiate Characters */
const initiateBattle = () => {
    for (let i = 0; i < charList.length; i++) {
        createSprites(i, ".player-frame", charList, currentCharacters);
    }
    let randomEnemyNumber = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < randomEnemyNumber; i++) {
        let pickEnemy = Math.floor(Math.random() * enemyList.length);
        createEnemy(pickEnemy, enemyList);
    }
    for (let i = 0; i < currentEnemies.length; i++) {
        createEnemySprites(i, ".enemy-frame", currentEnemies);

    }
}

/* Mini Game Attacks */
let globalTimer;
let globalInterval;
let hitCount = 0;
let bonusDamage = 0;
let currentPlayerTarget = 0;
let currentSelectedAttack = 0;
let miniGamePlaying = false;
let bonusScore = 0;
//Minigame3
const minigame3 = (minigame, hitMax, timer, timerLimit, intervals) => {
    //Interval Counter
    let intervalCounter = 0;
    let buttonHoldInterval;
    //Randomise Timer
    let randomisedTimer = (timer * 0.8) + (Math.floor(Math.random() * (timer - (timer * 0.7)))) - (Math.floor(Math.random() * (timer - (timer * 0.7))));
    //Split up and create interval segments for game
    let intervalSegmentStartArray = [];
    let intervalSegmentEndArray = [];
    for (let i = 0; i < intervals; i++) {
        let intervalLength = randomisedTimer / intervals;
        let intervalSegmentStart = Math.floor(intervalLength * i) + Math.floor(Math.random() * (intervalLength * 0.2));
        let intervalSegmentEnd = Math.floor(intervalSegmentStart + (intervalLength * 0.3) + Math.floor(Math.random() * (intervalLength * 0.7)));
        if (i % 2 === 0) {
            intervalSegmentStartArray.push(intervalSegmentStart);
            intervalSegmentEndArray.push(intervalSegmentEnd);
        }
    }
    let randomisedAreaStart = (randomisedTimer * 0.2) + (Math.random() * (randomisedTimer * 0.5));
    let randomisedAreaEnd = randomisedAreaStart + (Math.random() * (randomisedTimer - randomisedAreaStart));
    //Generate Game Overlay
    const $overlay = $("<div>").addClass("overlay-minigame");
    $(".game-area").append($overlay);
    //Create countdown timer
    globalTimer = randomisedTimer;
    const $countdown = $("<h1>").addClass("countdown").html(globalTimer).css("color", "white");
    $overlay.append($countdown);
    //Countdown globaltimer
    globalInterval = setInterval(() => {
        globalTimer--;
        $countdown.html(globalTimer);
        if (globalTimer <= 0) {
            clearInterval(buttonHoldInterval);
            //inputCounter checker
            for (let i = 0; i < intervalSegmentStartArray.length; i++) {
                let intervalLowest = (intervalSegmentEndArray[i] - intervalSegmentStartArray[i]) * 0.80;
                let intervalHighest = (intervalSegmentEndArray[i] - intervalSegmentStartArray[i]) * 1.20;
                if (intervalCounter > intervalLowest && intervalCounter < intervalHighest) {
                    intervalCounter = 0;
                    bonusDamageCalc(2.5);

                } else if (intervalCounter > 0 && intervalCounter < intervalHighest) {
                    intervalCounter = 0;
                }
            }
            continueOrResetMiniGame(minigame, hitMax, timer, timerLimit, $overlay);
        } else {
            $newButton.css({
                "animation": "button-growing-animation 3s linear 0s infinite",
                "border": "1vw solid white"
            });
        }
        for (let i = 0; i < intervalSegmentStartArray.length; i++) {
            let incrementFactor = (100 / (intervalSegmentEndArray[i] - intervalSegmentStartArray[i])).toFixed(4);
            let decrementFactor = (100 / (intervalSegmentStartArray[i] - intervalSegmentEndArray[i - 1])).toFixed(4);
            if (globalTimer >= intervalSegmentStartArray[i] && globalTimer <= intervalSegmentEndArray[i]) {
                $newButton.css({
                    "animation": "button-growing-animation 0.5s linear 0s infinite",
                    "border": "10px solid green"
                });
                /* $(".mini-game-button-fill-green").css("height", `+=${incrementFactor}%`);*/
                if ($(".mini-game-button-fill-green").height() < "100") {
                    $(".mini-game-button-fill-green").css({
                        "height": `+=${incrementFactor}%`,
                        "background": "green"
                    });
                } else if ($(".mini-game-button-fill-green").height() > "100") {
                    $(".mini-game-button-fill-green").css("height", "100%");
                }
            } else if (globalTimer < intervalSegmentStartArray[i] && globalTimer > intervalSegmentEndArray[i - 1] && $(".mini-game-button-fill-green").height() > "0") {
                $(".mini-game-button-fill-green").css({
                    "height": `-=${decrementFactor}%`,
                    "background": "gold"
                });
            }
        }

    }, 1);
    //Create Button
    const $newButton = $("<button>").addClass("button mini-game-button").html("<h1 class=mini-game-button-name>A</h1><div class=mini-game-button-fill-yellow></div><div class=mini-game-button-fill-green></div>").css({
        "height": `${timerLimit/10}vw`,
        "width": `${timerLimit/10}vw`,
        "animation": "button-growing-animation 3s linear 0s infinite"
    });
    $overlay.append($newButton);
    $overlay.mousedown(() => {
        for (let i = 0; i < intervalSegmentStartArray.length; i++) {
            let intervalTimeMin = Math.floor(intervalSegmentStartArray[i] * 0.95);
            let intervalTimeMax = Math.floor(intervalSegmentEndArray[i] * 1.05);
            /*            console.log(`Time Max${i}: ${intervalTimeMax}`);
                        console.log(`Time Min${i}: ${intervalTimeMin}`);*/
            if (globalTimer >= intervalTimeMin && globalTimer <= intervalTimeMax) {
                buttonHoldInterval = setInterval(() => {
                    intervalCounter++;
                }, 1);

            }
        }
    })
    $overlay.mouseup(() => {
        clearInterval(buttonHoldInterval);
        //inputCounter checker
        for (let i = 0; i < intervalSegmentStartArray.length; i++) {
            let intervalLowest = (intervalSegmentEndArray[i] - intervalSegmentStartArray[i]) * 0.80;
            let intervalHighest = (intervalSegmentEndArray[i] - intervalSegmentStartArray[i]) * 1.20;
            if (intervalCounter > intervalLowest && intervalCounter < intervalHighest) {
                intervalCounter = 0;
                bonusDamageCalc(2.5);
                console.log("Success");
            } else if (intervalCounter > 0 && intervalCounter < intervalHighest) {
                intervalCounter = 0;
                console.log("Fail");
            }
        }
    })
}
//Minigame2
const minigame2 = (minigame, hitMax, timer, timerLimit) => {
    //Randomise Timer
    let randomisedTimer = (timer * 0.8) + (Math.floor(Math.random() * (timer - (timer * 0.7)))) - (Math.floor(Math.random() * (timer - (timer * 0.7))));
    //Generate Game Overlay
    const $overlay = $("<div>").addClass("overlay-minigame");
    $(".game-area").append($overlay);
    //Create countdown timer
    let globalTimer = randomisedTimer;
    const $countdown = $("<h1>").addClass("countdown").html(globalTimer).css("color", "white");
    $overlay.append($countdown);
    //Countdown globaltimer
    globalInterval = setInterval(() => {
        globalTimer--;
        $countdown.html(globalTimer);
        if (globalTimer <= 0) {
            continueOrResetMiniGame(minigame, hitMax, timer, timerLimit, $overlay);
        }
    }, 1);
    //Create Button
    const $newButton = $("<button>").addClass("button mini-game-button").html("<h1>A</h1>").css({
        "height": `${timerLimit/10}vw`,
        "width": `${timerLimit/10}vw`,
        "animation": "button-growing-animation 1s linear 0s infinite"
    });
    $overlay.append($newButton);
    //Button click for action
    $overlay.on("click", () => {
        bonusDamageCalc(0.1);
        console.log(bonusDamage);
    });
    $overlay.mousedown(() => {
        $newButton.css({
            background: "green",
            border: "20px solid white"
        });
    });
    $overlay.mouseup(() => {
        $newButton.css({
            background: "none",
            border: "5px solid white"
        });
    });
}
//Minigame 1
const minigame1 = (minigame, hitMax, timer, timerLimit) => {
    //Randomise Timer
    let randomisedTimer = (timer * 0.8) + (Math.floor(Math.random() * (timer - (timer * 0.7)))) - (Math.floor(Math.random() * (timer - (timer * 0.7))));
    //Generate Game Overlay
    const $overlay = $("<div>").addClass("overlay-minigame");
    $(".game-area").append($overlay);
    //Create Circle
    const $newCircle = $("<div>").addClass("mini-game-circle").css({
        "height": `${randomisedTimer/10}vw`,
        "width": `${randomisedTimer/10}vw`
    });
    $overlay.append($newCircle);
    //Create countdown timer
    let globalTimer = randomisedTimer;
    const $countdown = $("<h1>").addClass("countdown").html(globalTimer).css("color", "white");
    $overlay.append($countdown);
    //Countdown globaltimer
    globalInterval = setInterval(() => {
        globalTimer--;
        $(".mini-game-circle").css({
            "height": `${globalTimer/10}vw`,
            "width": `${globalTimer/10}vw`
        }, 1)
        $countdown.html(globalTimer);
        //If miss
        if (globalTimer <= 0) {
            bonusDamageCalc(-0.5);
            changeCircleColour("red", $newCircle, $newButton);
            continueOrResetMiniGame(minigame, hitMax, timer, timerLimit, $overlay);
        }
    }, 1);
    //Create Button
    const $newButton = $("<button>").addClass("button mini-game-button").html("<h1>A</h1>").css({
        "height": `${timerLimit/10}vw`,
        "width": `${timerLimit/10}vw`
    });
    $overlay.append($newButton);
    //Button to Check Score
    $overlay.on("click", () => {
        let maxTimerLimit = timerLimit + 20;
        let minTimerLimit = timerLimit - 20;
        //Correct Scenario
        if (globalTimer <= maxTimerLimit && globalTimer >= minTimerLimit) {
            bonusDamageCalc(2);
            $overlay.unbind();
            changeCircleColour("green", $newCircle, $newButton);
            continueOrResetMiniGame(minigame, hitMax, timer, timerLimit, $overlay);
            //Partially Correct Scenario
        } else if ((globalTimer <= maxTimerLimit + 20 && globalTimer > maxTimerLimit) || (globalTimer < minTimerLimit && globalTimer >= minTimerLimit - 20)) {
            //Add bonus Damage
            bonusDamageCalc(0.5);
            changeCircleColour("yellow", $newCircle, $newButton);
            continueOrResetMiniGame(minigame, hitMax, timer, timerLimit, $overlay);
            //Wrong Scenario
        } else {
            //Add bonus damage
            bonusDamageCalc(0);
            changeCircleColour("red", $newCircle, $newButton);
            continueOrResetMiniGame(minigame, hitMax, timer, timerLimit, $overlay);
        }
    });
}
//Clear current minigame and check if continue
const continueOrResetMiniGame = (minigame, hitMax, timer, timerLimit, overlay) => {
    clearInterval(globalInterval);
    overlay.unbind();
    //Check if minigame is over
    hitCount++;
    if (hitCount < hitMax) {
        resetMinigame(minigame, hitMax, timer, timerLimit, overlay);
    } else {
        endMiniGame(overlay);
    }
}
//bonusDamage add
const bonusDamageCalc = (damage) => {
    bonusDamage += damage;
    bonusScore += damage * 100;
}

//End Minigame
const endMiniGame = (overlay) => {
    hitCount = 0;
    miniGameOn = false;
    setTimeout(() => {
        overlay.remove();
        choosingAttack = false;
        damageCalcPlayer();
    }, 1000);
}
//Enemy Dealing Damage
const enemyDealDamage = (enemyType, playerType, enemyQueue, playerQueue) => {
    attackSound();
    let attackingEnemy = enemyType[enemyQueue[0]];
    let selectedPlayerNumber = Math.floor(Math.random() * playerType.length);
    let selectedPlayer = playerType[selectedPlayerNumber];
    let selectedAttack = attackingEnemy.attacks[Math.floor(Math.random() * attackingEnemy.attacks.length)];
    if (selectedPlayer.currentHp > 0) {
        damageCalc(attackingEnemy, selectedPlayer, selectedAttack, "player", selectedPlayerNumber);
        if (selectedPlayer.currentHp <= 0) {
            selectedPlayer.currentHp = 0;
            updateHpBars(currentCharacters, "player");
            updateHpBars(currentEnemies, "enemy");
            killPlayer(playerType, selectedPlayerNumber);
        }
    } else if (selectedPlayer.currentHp <= 0) {
        selectedPlayer.currentHp = 0;
        updateHpBars(currentCharacters, "player");
        updateHpBars(currentEnemies, "enemy");
        killPlayer(playerType, selectedPlayerNumber);
    }
    updateHpBars(currentCharacters, "player");
    updateHpBars(currentEnemies, "enemy");
    attackingEnemy.turnBar = 0;
    enemyQueue.shift();
}
//Lose Condition
const checkLoseCondition = (playerType) => {
    if (playerType.length === 0) {
        const $overlay = $("<div>").addClass("overlay-text");
        $(".game-area").append($overlay);
        const $loseText = $("<h1>");
        const $endGameButton = $("<a>").addClass("end-game-button");
        if (playerType === currentCharacters) {
            loseSound();
            $loseText.addClass("lose-text").text("You Lose");
            $endGameButton.text("Restart Game").on("click", () => {
                setTimeout(restartGame, 1000);
                setTimeout(closeOverWorld, 1000);
                createTransition();
            });
        } else if (playerType === currentEnemies) {
            victorySound();
            $loseText.addClass("win-text").text("You Win!");
            $endGameButton.text("Continue").on("click", () => {
                setTimeout(endGame, 1000);
                setTimeout(resumeOverWorld, 1000);
                createTransition();
            });
        }
        const $winLoseContainer = $("<div>").addClass("win-lose-container").appendTo($overlay);
        const $scoreCounter = $("<h3>").addClass("bonus-score").text(`Bonus: ${bonusScore}`);
        $winLoseContainer.append($loseText);
        $winLoseContainer.append($scoreCounter);
        $winLoseContainer.append($endGameButton);
        playerScore += bonusScore;
        bonusScore = 0;
        $(".score-number").html(`Score: ` + (Math.floor(playerScore)));

    }
}

//Kill Players
const killPlayer = (playerType, selectedPlayerNumber) => {
    //Remove player's sprite
    $(".char-container.player").eq(selectedPlayerNumber).fadeOut(500, () => {
        $(".char-container.player").eq(selectedPlayerNumber).remove();
    });
    //Delete Player from player queue and current players
    if (playerQueue.indexOf(selectedPlayerNumber) > -1) {
        playerQueue.splice(playerQueue.indexOf(selectedPlayerNumber));
    }
    playerType.splice(selectedPlayerNumber, 1);
    //Check if no more players
    checkLoseCondition(playerType);
}

//Damage Formulation
const damageCalc = (attackingEnemy, selectedPlayer, selectedAttack, playerOrEnemy, selectedPlayerNumber) => {
    let strengthFactor = (Math.random() * attackingEnemy.strength) / 10;
    let strengthFactorRounded = strengthFactor.toFixed(1);
    let strengthModifier = 1 + Number(strengthFactorRounded);
    let totalDamage = Math.floor(selectedAttack.damage * strengthModifier);
    selectedPlayer.currentHp -= totalDamage;
    damageText(totalDamage, playerOrEnemy, selectedPlayerNumber);
    currentEnemies[enemyQueue[0]].isAttacking = true
    if (currentEnemies[enemyQueue[0]].isAttacking === true) {
        $(`.char-sprite.enemy`).eq(enemyQueue[0]).css({
            animation: "enemy-attack-animation 0.3s ease-in 0s 1"
        });
        currentEnemies[enemyQueue[0]].isAttacking = false;
    }
    $(`.char-container.player`).eq(selectedPlayerNumber).effect("shake");
}

//Damage text
const damageText = (totalDamage, playerOrEnemy, selectedPlayerNumber) => {
    const $damageText = $("<p>").addClass("damage-text").text(totalDamage);
    $(`.char-container.${playerOrEnemy}`).eq(selectedPlayerNumber).prepend($damageText);
    setTimeout(() => {
        $damageText.fadeOut(300, () => {
            $damageText.remove();
        })
    }, 300);
}
//Update HP Bars
const updateHpBars = (characterType, playerOrEnemy) => {
    for (let i = 0; i < characterType.length; i++) {
        $(`.hp-bar.${playerOrEnemy}`).eq(i).text(`${characterType[i].currentHp}/${characterType[i].totalHp}`).css("width", `${characterType[i].currentHp/characterType[i].totalHp * 100}%`);
    }
}

//Mini-game Correct/Wrong/Partially Correct UI Colour
const changeCircleColour = (color, object1, object2) => {
    object1.css("border", `10px solid ${color}`);
    object2.css("border-color", `${color}`);
}
//Reset Mini-game
const resetMinigame = (minigame, hitMax, timer, timerLimit, overlay) => {
    overlay.fadeOut(1000, () => {
        overlay.empty();
    });
    setTimeout(() => {
        minigame(minigame, hitMax, timer, timerLimit);
    }, 1000);
}

/* Update Turn Bar */
let playerQueue = [];
let enemyQueue = [];
let choosingAttack = false;
const chargeTurnBar = (characterType, queueType, playerType) => {
    for (let i = 0; i < characterType.length; i++) {
        if (characterType[i].turnBar < 100) {
            characterType[i].turnBar += characterType[i].speed / 10;
            $(`.turn-bar.${playerType}`).eq(i).css("width", `${characterType[i].turnBar}%`);
        } else {
            characterType[i].turnBar = 100;
            $(`.turn-bar.${playerType}`).eq(i).css("width", `${characterType[i].turnBar}%`);
            if (queueType.includes(i) === false) {
                queueType.push(i);
            }
        }
    }
}

/* Check Player Turn */
const checkPlayerTurn = () => {
    const currentPlayer = playerQueue[0];
    //Display buttons of active player
    if (choosingAttack === false) {
        $(".attack-list").eq(currentPlayer).fadeIn(500).addClass("d-block");
        $(".char-container").eq(currentPlayer).css("animation", "glowing-animation 1s linear 0s infinite, growing-animation 1s linear 0s infinite");
    }
    $(".char-container").eq(currentPlayer).unbind();
    //Active buttons of active player
    for (let i = 0; i < $(".attack-list").eq(currentPlayer).children().length; i++) {
        const $attackButton = $(".attack-list").eq(currentPlayer).children().eq(i);
        $attackButton.css({
            "background": "green",
            "cursor": "pointer"
        });
        $attackButton.unbind();
        $attackButton.on("click", (event) => {
            if (choosingAttack === false) {
                //Get selected attack
                selectedAttack = $($(`.attack-list:eq(${playerQueue[0]}) > .attack-icon`)).index($(event.currentTarget));
                console.log(selectedAttack);
                //Disable intervals
                choosingAttack = true;
                //Select Target
                selectTarget(i, currentPlayer);
                //Off Attack Buttons
                $(".attack-list").eq(currentPlayer).children().unbind();
                $(".attack-list").eq(currentPlayer).children().css({
                    "background": "red",
                    "cursor": "default"
                });
                $(".attack-list").eq(currentPlayer).fadeOut(500).removeClass("d-block");
            }

        });
        $attackButton.on("mouseenter", (event) => {
            $(event.currentTarget).css("transform", "scale(1.2,1.2)");
        });
        $attackButton.on("mouseleave", (event) => {
            $(event.currentTarget).css("transform", "scale(1,1)");
        });
    }
}
//Reset Pre select state
const resetPlayerAttack = () => {
    /*
        $(".char-sprite.player").eq(playerQueue[0]).css("animation", "rest - animation 3s linear 0s infinite");*/
    bonusDamage = 0;
    currentPlayerTarget = 0;
    currentSelectedAttack = 0;
    playerQueue.shift();
}
//Kill Enemies
const killEnemies = (playerType, selectedPlayerNumber) => {
    //Remove player's sprite
    $(".char-container.enemy").eq(selectedPlayerNumber).fadeOut(500, () => {
        $(".char-container.enemy").eq(selectedPlayerNumber).remove();
    });
    //Delete Player from player queue and current players
    if (enemyQueue.indexOf(selectedPlayerNumber) > -1) {
        enemyQueue.splice(enemyQueue.indexOf(selectedPlayerNumber));
    }
    playerType.splice(selectedPlayerNumber, 1);
    //Check if no more players
    checkLoseCondition(playerType);
}
//Calculate Damage
const damageCalcPlayer = () => {
    attackSound();
    //Calculate Damage
    let strengthFactor = (Math.random() * currentCharacters[playerQueue[0]].strength) / 10;
    let strengthFactorRounded = strengthFactor.toFixed(1);
    let strengthModifier = 1 + (bonusDamage / 10) + Number(strengthFactorRounded);
    let totalDamage = Math.floor(currentCharacters[playerQueue[0]].attacks[currentSelectedAttack].damage * strengthModifier);
    if (currentEnemies[currentPlayerTarget].currentHp > 0) {
        currentEnemies[currentPlayerTarget].currentHp -= totalDamage;
        if (currentEnemies[currentPlayerTarget].currentHp <= 0) {
            currentEnemies[currentPlayerTarget].currentHp = 0;
            updateHpBars(currentCharacters, "player");
            updateHpBars(currentEnemies, "enemy");
            killEnemies(currentEnemies, currentPlayerTarget);
        }
    } else if (currentEnemies[currentPlayerTarget].currentHp <= 0) {
        currentEnemies[currentPlayerTarget].currentHp = 0;
        updateHpBars(currentCharacters, "player");
        updateHpBars(currentEnemies, "enemy");
        killEnemies(currentEnemies, currentPlayerTarget);
    }
    updateHpBars(currentCharacters, "player");
    updateHpBars(currentEnemies, "enemy");
    $(`.char-container.enemy`).eq(currentPlayerTarget).effect("shake");
    damageText(totalDamage, "enemy", currentPlayerTarget);
    currentCharacters[playerQueue[0]].isAttacking = true;
    if (currentCharacters[playerQueue[0]].isAttacking === true) {
        $(`.char-sprite.player`).eq(playerQueue[0]).css({
            animation: "attack-player-animation 0.3s ease-in 0s 1"
        });
        currentCharacters[playerQueue[0]].isAttacking = false;
    }
    resetPlayerAttack();
}
//Launch minigame
let miniGameOn = false;
const launchMiniGame = (minigame, hitMax, timer, timerLimit, interval) => {
    sirenSound();
    miniGameOn = true;
    if (miniGameOn === true) {
        minigame(minigame, hitMax, timer, timerLimit, interval);
    }
}

// Select Target
const selectTarget = (i, currentPlayer) => {
    //Select Target
    for (let i = 0; i < currentEnemies.length; i++) {
        $(".char-sprite.enemy").eq(i).css({
            "animation": "enemy-glowing-animation 1s linear 0s infinite",
            "cursor": "pointer"
        });
        $(".char-sprite.enemy").eq(i).on("mouseenter", () => {
            $(".char-sprite.enemy").eq(i).css("transform", "scale(1.2,1.2)");
        });
        $(".char-sprite.enemy").eq(i).on("mouseleave", () => {
            $(".char-sprite.enemy").eq(i).css("transform", "scale(1,1)");
        });
        $(".char-sprite.enemy").eq(i).on("click", (event) => {
            let clickedPosition = $($(".char-sprite.enemy")).index($(event.currentTarget));
            //reset animations
            $(".char-sprite.enemy").unbind();
            $(".char-sprite.enemy").css({
                "animation": "none",
                "transform": "scale(1,1) scaleX(-1)",
                "cursor": "default"
            });
            //Launch Attack
            launchAttack();
            currentPlayerTarget = clickedPosition;
        });
    }
}

// Launch Attack
const launchAttack = () => {
    currentCharacters[playerQueue[0]].attacks[selectedAttack].trigger();
    //Reset Turn Attack
    currentCharacters[playerQueue[0]].turnBar = 0;
    $(".turn-bar").eq(playerQueue[0]).css("width", `${currentCharacters[playerQueue[0]].turnBar}`);
}

let updateRestingAnimations;
let checkPlayerTurnInterval;
let chargeTurnBarEnemyInterval;
let chargeTurnBarPlayerInterval;

const createTransition = () => {
    const $transition = $("<div>").addClass("overlay-transition");
    $(".game-area").append(($transition).hide().fadeIn(1000));

    setTimeout(() => {
        $transition.fadeOut(1000, () => {
            $transition.remove();
        })
    }, 1000);

}

const endGame = () => {
    clearInterval(updateRestingAnimations);
    clearInterval(checkPlayerTurnInterval);
    clearInterval(chargeTurnBarPlayerInterval);
    clearInterval(chargeTurnBarEnemyInterval);
    playerQueue = [];
    enemyQueue = [];
    currentEnemies = [];
    globalTimer = 0;
    clearInterval(globalInterval);
    hitCount = 0;
    bonusDamage = 0;
    currentPlayerTarget = 0;
    currentSelectedAttack = 0;
    miniGamePlaying = false;
    collideTrue = false;
    $(".player-frame").remove();
    $(".enemy-frame").remove();
    $(".overlay-text").remove();
    healPlayer();
    overworldSound();
}

const restartGame = () => {
    $(".battle-scene").empty();
    $(".player-field").remove();
    $(".hp-container-all").remove();
    clearInterval(updateRestingAnimations);
    clearInterval(checkPlayerTurnInterval);
    clearInterval(chargeTurnBarPlayerInterval);
    clearInterval(chargeTurnBarEnemyInterval);
    playerQueue = [];
    enemyQueue = [];
    currentEnemies = [];
    globalTimer = 0;
    clearInterval(globalInterval);
    hitCount = 0;
    bonusDamage = 0;
    currentPlayerTarget = 0;
    currentSelectedAttack = 0;
    miniGamePlaying = false;
    collideTrue = false;
    scoreLevel = 1;
    playerScore = 0;
    scoreCounter = 0;
    $(".score-number").html(`Score: ` + (Math.floor(playerScore) + ` | Level: ${scoreLevel}`));
    $(".player-frame").remove();
    $(".enemy-frame").remove();
    $(".overlay-text").remove();
    $(".intro-screen").fadeIn(1000, () => {
        $(".intro-screen").show();
    });
    overworldSound();
}

const startGame = () => {
    battleSound();
    createPlayerFrames();
    initiateBattle();
    chargeTurnBarPlayerInterval = setInterval(() => {
        if (currentEnemies.length > 0 && currentCharacters.length > 0 && choosingAttack === false) {
            chargeTurnBar(currentCharacters, playerQueue, "player");
        }
    }, 100);
    chargeTurnBarEnemyInterval = setInterval(() => {
        if (currentEnemies.length > 0 && currentCharacters.length > 0 && choosingAttack === false) {
            chargeTurnBar(currentEnemies, enemyQueue, "enemy");
        }
    }, 100);
    checkPlayerTurnInterval = setInterval(checkPlayerTurn, 1000 && choosingAttack === false);
    let checkEnemyTurnInterval = setInterval(() => {
        if (enemyQueue.length > 0 && currentCharacters.length > 0 && choosingAttack === false) {
            enemyDealDamage(currentEnemies, currentCharacters, enemyQueue, playerQueue);
        }
    }, 1000);
    updateRestingAnimations = setInterval(() => {
        for (let i = 0; i < currentEnemies.length; i++) {
            if (currentEnemies[i].isAttacking === false) {
                $(`.char-sprite.enemy`).css({
                    animation: "enemy-rest-animation 3s linear 0s infinite"
                });
            }
        }
        for (let i = 0; i < currentCharacters.length; i++) {
            if (currentCharacters[i].isAttacking === false) {
                $(`.char-sprite.player`).css({
                    animation: "rest-animation 3s linear 0s infinite"
                });
            }
        }
    }, 3000);
}

/* Overworld */
//Create icon
let playerMoving = false;
const createOverWorldPlayer = () => {
    const $overWorld = $("<div>").addClass("player-field w-100");
    $(".battle-scene").append($overWorld);
    const $newPlayer = $("<img>").attr("src", `${imagePath}walking/front-right.png`).addClass("overworld-player").css({
        "width": `10vw`,
        "height": `10vw`,
        "position": "absolute",
        "animation": "rest-animation 3s linear 0s infinite",
        "transform-origin": "bottom",
        "z-index": "100",
        "margin": "auto 0"
    });
    var mapTop = $overWorld.offset().top;
    var mapLeft = $overWorld.offset().left;
    var charWidth = $newPlayer.outerWidth();
    var charHeight = $newPlayer.outerHeight();
    $overWorld.append($newPlayer);


    $overWorld.mousedown((event) => {
        const oldPositionX = $newPlayer.offset().left;
        const oldPositionY = $newPlayer.offset().top;
        const currentPositionX = event.pageX - mapLeft - (charWidth / 2);
        const currentPositionY = event.pageY - mapTop - (charHeight / 2);
        console.log(currentPositionX + currentPositionY);
        const positionXNormalise = Math.round(currentPositionX / 40) * 40;
        const positionYNormalise = Math.round(currentPositionY / 40) * 40;
        const distanceX = Math.pow((positionXNormalise - currentPositionX), 2);
        const distanceY = Math.pow((positionYNormalise - currentPositionY), 2);
        const timeMove = Math.sqrt(distanceX + distanceY) * 100;
        if (oldPositionX > positionXNormalise && oldPositionY < positionYNormalise) {
            $newPlayer.attr("src", `${imagePath}walking/front-left.png`)
        } else if (oldPositionX > positionXNormalise && oldPositionY > positionYNormalise) {
            $newPlayer.attr("src", `${imagePath}walking/back-left.png`)
        } else if (oldPositionX < positionXNormalise && oldPositionY > positionYNormalise) {
            $newPlayer.attr("src", `${imagePath}walking/back-right.png`)
        } else if (oldPositionX < positionXNormalise && oldPositionY < positionYNormalise) {
            $newPlayer.attr("src", `${imagePath}walking/front-right.png`)
        }
        if (playerMoving === false) {
            playerMoving = true;
            setTimeout(() => {
                playerMoving = false
            }, timeMove);
            const $targetCircle = $("<div>").addClass("click-target").css({
                "width": "8vw",
                "height": "8vw",
                "border": "5px solid white",
                "border-radius": "50%",
                "position": "absolute",
                left: positionXNormalise,
                top: positionYNormalise,
                "animation": "target-circle-animation 0.5s linear 0s 1",
                "opacity": 0
            })
            setTimeout(() => {
                $targetCircle.remove();
                $newPlayer.css("animation", "rest-animation 3s linear 0s infinite");
            }, timeMove)
            $overWorld.append($targetCircle);


            console.log(`X: ${currentPositionX} | Y: ${currentPositionY}`);
            $newPlayer.css("animation", "walking-animation 1s linear 0s infinite").animate({
                left: positionXNormalise,
                top: positionYNormalise
            }, timeMove);
        }
        console.log(timeMove);
    })
    $overWorld.mouseup((event) => {

    })
}
const collisionObjects = [];
const createMultipleEnemies = (number) => {
    for (let i = 0; i < number; i++) {
        createEnemies();
    }
}
const createEnemies = () => {
    const $overworld = $(".player-field");
    const maxPositionY = Math.floor(Math.random() * $overworld.height());
    const maxPositionX = Math.floor(Math.random() * $overworld.width());
    const $collisionObject = $("<img>").attr("src", `${imagePath}walking/enemy.png`).addClass("collision-object").css({
        "width": "0vw",
        "height": "0vw",
        "position": "absolute",
        "top": maxPositionY,
        "left": maxPositionX,
        "animation": "walking-animation 2s linear 0s infinite",
        "transform-origin": "bottom"
    }).animate({
        width: "2vw",
        height: "2vw"
    }, 500).appendTo($overworld);
    const collisionX = $collisionObject.offset().left;
    const collisionY = $collisionObject.offset().top;
    const position = {
        positionY: $collisionObject.offset().top,
        positionX: $collisionObject.offset().left
    }
}
const spawnRandomEnemy = (number) => {
    const rollDice = Math.floor(Math.random() * 100);
    console.log(rollDice);
    if (rollDice < 10 && $(".collision-object").length < number && scoreCounter <= 1000) {
        spawn();
        createEnemies();
    } else if ($(".collision-object").length === 0) {
        spawn();
        createEnemies();
    } else if (scoreCounter > 1000 && $(".collision-object").length < number) {
        spawn();
        createEnemies();
    }
}

let hatchEnemyInterval;
const hatchEnemy = () => {
    const $unhatched = $(".collision-object:not(.hatched):first");
    $unhatched.addClass("hatched").animate({
        width: "5vw",
        height: "5vw"
    }).css({
        filter: "saturate(100)",
        animation: "enemy-overworld-animation 1s linear 0s infinite"
    });
}
const moveObject = () => {
    for (let i = 0; i < $(".collision-object.hatched").length; i++) {
        const $collisionObject = $(".collision-object.hatched").eq(i);
        const $overworld = $(".player-field");
        const positionNewY = Math.floor(Math.random() * $overworld.height());
        const positionNewX = Math.floor(Math.random() * $overworld.width());
        $collisionObject.animate({
            left: positionNewX,
            top: positionNewY
        }, 3000);
    }

}

/* Collision Detection */
function getPositions(box) {
    var $box = $(box);
    var pos = $box.position();
    var width = $box.width();
    var height = $box.height();
    return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
}

function comparePositions(p1, p2) {
    var x1 = p1[0] < p2[0] ? p1 : p2;
    var x2 = p1[0] < p2[0] ? p2 : p1;
    return x1[1] > x2[0] || x1[0] === x2[0] ? true : false;
}

let collideTrue = false;
/*const checkAllCollisions = () => {
    for (let i = 0; i < enemyQueue.length; i++) {
        checkCollisions(i);
    }
}*/

const checkCollisions = () => {
    for (let i = 0; i < $(".collision-object.hatched").length; i++) {
        const collide = $(".collision-object.hatched").eq(i);
        const pos = getPositions(collide);
        const $player = $(".overworld-player");

        const pos2 = getPositions($(".overworld-player"));
        const horizontalMatch = comparePositions(pos[0], pos2[0]);
        const verticalMatch = comparePositions(pos[1], pos2[1]);
        const match = horizontalMatch && verticalMatch;
        if (match) {
            if (collideTrue === false) {
                collideTrue = true
                console.log("Collide!");
                encounter();
                collide.css("filter", "grayscale(100%)");
                collide.animate({
                    width: 0,
                    height: 0
                }, 500).fadeOut(500, () => {
                    collide.remove();
                });
                scoreCounter = 0;
                playerScore -= 0.2 * playerScore;
                createTransition();
                setTimeout(closeOverWorld, 1000);
                setTimeout(startGame, 1000);
            }
        }
    }
}

/*const removeCollision = () => {
    const $collisionObject = $(".collision-object.hatched:first");
    $collisionObject.animate({
        width: 0,
        height: 0
    }, 500).fadeOut(500, () => {
        $collisionObject.remove();
    });
}*/

/* Score */
let playerScore = 0;
let scoreCounter = 0;
let scoreLevel = 1;
const updateScoreLevel = () => {
    if (scoreCounter >= 100 && scoreCounter < 250) {
        scoreLevel = 2;
    } else if (scoreCounter >= 250 && scoreCounter < 500) {
        scoreLevel = 3;
    } else if (scoreCounter >= 500 && scoreCounter < 1000) {
        scoreLevel = 4;
    } else if (scoreCounter >= 1000) {
        scoreLevel = 5;
    } else {
        scoreLevel = 1;
    }
}

const createScore = () => {
    const $score = $("<h1>").addClass("score-number").text(`Score: ` + (Math.floor(playerScore) + ` | Level: ${scoreLevel}`)).appendTo($("body"));
}

const countUpScore = () => {
    scoreCounter += 0.1;
    if (scoreCounter > 100) {
        playerScore += 0.2;
    } else if (scoreCounter > 250) {
        playerScore += 0.5;
    } else if (scoreCounter > 500) {
        playerScore += 0.75;
    } else if (scoreCounter > 1000) {
        playerScore += 1;
    } else {
        playerScore += 0.1;
    }
    $(".score-number").html(`Score: ` + (Math.floor(playerScore) + ` | Level: ${scoreLevel}`));
}
let moveObjectInterval;
let checkCollisionsInterval;
let spawnEnemyInterval;
let countUpScoreInterval;
let removalCollisionInterval;

const resumeOverWorld = () => {
    $(".player-field").show();
    $(".health-container-all").show();
    for (let i = 0; i < currentCharacters.length; i++) {
        $(".ui-hp-bar").eq(i).css("width", `${currentCharacters[i].currentHp/currentCharacters[i].totalHp * 100}%`).text(`${currentCharacters[i].currentHp}/${currentCharacters[i].totalHp}`);
    }
    moveObjectInterval = setInterval(moveObject, 3000);
    checkCollisionsInterval = setInterval(() => {
        checkCollisions(0);
    }, 100);
    spawnEnemyInterval = setInterval(() => {
        spawnRandomEnemy(3);
    }, 1000);
    countUpScoreInterval = setInterval(() => {
        updateScoreLevel();
        countUpScore();
    }, 1);
    hatchEnemyInterval = setInterval(() => {
        hatchEnemy();
    }, 6000);
    /*
        removalCollisionInterval = setInterval(removeCollision, 30000);
    */
    overworldSound();
}

const startOverWorld = () => {
    createOverWorldPlayer();
    createEnemies();
    createHealthUI();
    moveObjectInterval = setInterval(moveObject, 3000);
    checkCollisionsInterval = setInterval(() => {
        checkCollisions(0);
    }, 100);
    spawnEnemyInterval = setInterval(() => {
        spawnRandomEnemy(3);
    }, 1000);
    createScore();
    countUpScoreInterval = setInterval(() => {
        updateScoreLevel();
        countUpScore();
    }, 1);
    /*
        removalCollisionInterval = setInterval(removeCollision, 15000);
    */
    hatchEnemyInterval = setInterval(() => {
        hatchEnemy();
    }, 6000);
    overworldSound();
}

const closeOverWorld = () => {
    $(".player-field").hide();
    $(".health-container-all").hide();
    clearInterval(moveObjectInterval);
    clearInterval(checkCollisionsInterval);
    clearInterval(spawnEnemyInterval);
    clearInterval(countUpScoreInterval);
    clearInterval(removalCollisionInterval);
    clearInterval(hatchEnemyInterval);
}
/* End Game Score */
const addEndGameScore = () => {
    playerScore += 500;
}

const healPlayer = () => {
    for (let i = 0; i < currentCharacters.length; i++) {
        currentCharacters[i].currentHp += currentCharacters[i].totalHp * 0.2;
        currentCharacters[i].strength++;
        if (currentCharacters[i].currentHp > currentCharacters[i].totalHp) {
            currentCharacters[i].currentHp = currentCharacters[i].totalHp;
        }
    }
}

/* Bottom UI */
const createHealthUI = () => {
    const $battleScene = $(".game-area")
    const $healthContainerAll = $("<div>").addClass("health-container-all row").appendTo($($battleScene));
    for (let i = 0; i < currentCharacters.length; i++) {
        const $characterContainer = $("<div>").addClass(`col health-container player text-left`).appendTo($healthContainerAll);
        const $imageContainer = $("<div>").addClass("ui-health-image w-25").appendTo($characterContainer);
        const $imageCircle = $("<img>").addClass("health-container-image").attr("src", imagePath + currentCharacters[i].sprite + currentPose).css({
            background: "rgb(255, 191, 0)",
            "border-radius": "50%"
        }).appendTo($imageContainer);
        const $textContainer = $("<div>").addClass("ui-health-text w-75").appendTo($characterContainer);
        const $name = $("<h5>").addClass("ui-health-name").text(currentCharacters[i].name).css("color", "white").appendTo($textContainer);
        const $hpBarContainer = $("<div>").addClass("ui-hp-bar-container w-50 player").appendTo($textContainer);
        const $hpBar = $("<div>").addClass("ui-hp-bar player").text(`${currentCharacters[i].currentHp}/${currentCharacters[i].totalHp}`).css("width", `${currentCharacters[i].currentHp/currentCharacters[i].totalHp * 100}%`).appendTo($hpBarContainer);

    }
}

/* Start Game */
$(".play-button").on("click", () => {
    createPlayer();
    startOverWorld();
    $(".intro-screen").fadeOut(1000, () => {
        $(".intro-screen").hide();
    });
    playSound();
})

/* Audio */
let audioEffects = document.getElementById("enemy-effects");
let bgSound = document.getElementById("bg-sound");

const playSound = () => {
    bgSound.play();
}

const battleSound = () => {
    $(".bg-sound").attr("src", "../sound/battle-theme.mp3");
    $(".bg-sound").currentTime = 0;
}

const overworldSound = () => {
    $(".bg-sound").attr("src", "../sound/opening-theme.mp3");
    $(".bg-sound").currentTime = 0;
}

const sirenSound = () => {
    $(".enemy-effects").attr("src", "../sound/siren.mp3");
    audioEffects.currentTime = 0;
    audioEffects.play();
}

const attackSound = () => {
    $(".enemy-effects").attr("src", "../sound/smack.mp3");
    audioEffects.currentTime = 0;
    audioEffects.play();
}

const victorySound = () => {
    $(".bg-sound").attr("src", "../sound/victory.mp3");
    $(".bg-sound").currentTime = 0;
}

const loseSound = () => {
    $(".bg-sound").attr("src", "../sound/lose.mp3");
    $(".bg-sound").currentTime = 0;
}

const encounter = () => {
    $(".bg-sound").attr("src", "../sound/encounter.mp3");
    $(".bg-sound").currentTime = 0;
}

const spawn = () => {
    $(".enemy-effects").attr("src", "../sound/spawn.mp3");
    audioEffects.currentTime = 0;
    audioEffects.play();
}

const hatch = () => {
    $(".enemy-effects").attr("src", "../sound/hatch.mp3");
    audioEffects.currentTime = 0;
    audioEffects.play();
}
/* Document Ready */
$(() => {})
