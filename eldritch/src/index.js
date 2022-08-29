'use strict'
import ancients from './assets/Ancients/index.js';
import ancientsData from './data/ancients.js';
import './style.css';
import './assets/mythicCardBackground.png';
import greensImport from './data/mythicCards/green/index';
import brownsImport from './data/mythicCards/brown/index';
import bluesImport from './data/mythicCards/blue/index';


const ancientsList = document.querySelector('.ancients-list');
const diffBtns = document.querySelector('.diff-btns');
const shuffleDeck = document.querySelector('.shuffle-deck');
const firstView = document.querySelector('.first-view');
const secondView = document.querySelector('.second-view');
const thirdView = document.querySelector('.third-view');
const subHeading = document.querySelector('.sub-heading');
const newGameBtn = document.querySelector('.new-game-btn');

shuffleArr(brownsImport);
shuffleArr(greensImport);
shuffleArr(bluesImport);

const deckConfig = {
    boss: '',
    difficulty: '',
};

function showAncients() {
    for (let key in ancients) {
        const ancientWrapper = document.createElement('div');
        ancientWrapper.classList.add('ancient-wrapper');
        const ancientImg = new Image();
        ancientImg.classList.add('ancient');
        ancientImg.src = ancients[key];
        ancientImg.dataset.boss = key;
        ancientsList.appendChild(ancientWrapper);
        ancientWrapper.appendChild(ancientImg);
    };

    let selectedAncient;
    ancientsList.onclick = (e) => {
        const div = e.target.closest('div');
        if (!div) return;
        if (!ancientsList.contains(div)) return;
        const img = div.firstElementChild;
        selectedAncient = img;

        firstView.classList.toggle('hidden');
        secondView.classList.toggle('hidden');
        newGameBtn.classList.remove('hidden');
        secondView.insertBefore(selectedAncient, diffBtns);
        selectedAncient.classList.remove('ancient');
        selectedAncient.classList.add('choosen-ancient');
        subHeading.textContent = 'Какой путь тебе по силам?';

        deckConfig.boss = img.dataset.boss;
        deckConfig.greens = ancientsData[img.dataset.boss].firstStage.greenCards +
            ancientsData[img.dataset.boss].secondStage.greenCards +
            ancientsData[img.dataset.boss].thirdStage.greenCards;
        deckConfig.blues = ancientsData[img.dataset.boss].firstStage.blueCards +
            ancientsData[img.dataset.boss].secondStage.blueCards +
            ancientsData[img.dataset.boss].thirdStage.blueCards;
        deckConfig.browns = ancientsData[img.dataset.boss].firstStage.brownCards +
            ancientsData[img.dataset.boss].secondStage.brownCards +
            ancientsData[img.dataset.boss].thirdStage.brownCards;
        deckConfig.firstStage = ancientsData[img.dataset.boss].firstStage;
        deckConfig.secondStage = ancientsData[img.dataset.boss].secondStage;
        deckConfig.thirdStage = ancientsData[img.dataset.boss].thirdStage;
        window.scrollTo(0, 0);
    }
}
showAncients();


//main func

diffBtns.onclick = (e) => {
    window.scrollTo(0, 0);
    let target = e.target;
    if (target.tagName !== 'BUTTON') return;
    deckConfig.difficulty = target.dataset.diff;

    secondView.classList.add('hidden');
    thirdView.classList.toggle('hidden');
    subHeading.textContent = `Сражение против ${deckConfig.boss[0].toUpperCase()}${deckConfig.boss.slice(1)}`;

    const greensArr = [];
    const brownsArr = [];
    const bluesArr = [];

    createColorDecks(brownsArr, bluesArr, greensArr);

    const firstPhaseDeck = createFirstPhaseDec(brownsArr, bluesArr, greensArr);
    const secondPhaseDeck = createSecondPhaseDec(brownsArr, bluesArr, greensArr);
    const thirdPhaseDeck = createThirdPhaseDec(brownsArr, bluesArr, greensArr);

    showPhaseDecks(firstPhaseDeck, secondPhaseDeck, thirdPhaseDeck);

    showCardImg(firstPhaseDeck, secondPhaseDeck, thirdPhaseDeck);
}

newGameBtn.onclick = () => {
    window.scrollTo(0, 0);
    location.reload();
    return false;
}




// logic ends

function showCardImg(firstPhaseDeck, secondPhaseDeck, thirdPhaseDeck) {
    const firstPhaseArr = firstPhaseDeck.greenCards.concat(firstPhaseDeck.brownCards, firstPhaseDeck.blueCards).flat();
    const secondPhaseArr = secondPhaseDeck.greenCards.concat(secondPhaseDeck.brownCards, secondPhaseDeck.blueCards).flat();
    const thirdPhaseArr = thirdPhaseDeck.greenCards.concat(thirdPhaseDeck.brownCards, thirdPhaseDeck.blueCards).flat();
    shuffleArr(firstPhaseArr);
    shuffleArr(secondPhaseArr);
    shuffleArr(thirdPhaseArr);

    const allPhasesArr = firstPhaseArr.concat(secondPhaseArr, thirdPhaseArr);

    const showingImg = new Image();
    showingImg.classList.add('showing-card');
    thirdView.appendChild(showingImg);

    document.querySelector('.next-card-btn').onclick = () => {
        if (!allPhasesArr.length) return;

        let shiftedCard = allPhasesArr.shift();
        showingImg.onload = function(){};
        showingImg.src = shiftedCard.cardFace;

        if (shiftedCard.color === 'green') {
            if (document.querySelector('.green-1').textContent > 0) document.querySelector('.green-1').textContent -= 1;
            else if (document.querySelector('.green-2').textContent > 0) document.querySelector('.green-2').textContent -= 1;
            else if (document.querySelector('.green-3').textContent > 0) document.querySelector('.green-3').textContent -= 1;
        }
        if (shiftedCard.color === 'brown') {
            if (document.querySelector('.brown-1').textContent > 0) document.querySelector('.brown-1').textContent -= 1;
            else if (document.querySelector('.brown-2').textContent > 0) document.querySelector('.brown-2').textContent -= 1;
            else if (document.querySelector('.brown-3').textContent > 0) document.querySelector('.brown-3').textContent -= 1;
        }
        if (shiftedCard.color === 'blue') {
            if (document.querySelector('.blue-1').textContent > 0) document.querySelector('.blue-1').textContent -= 1;
            else if (document.querySelector('.blue-2').textContent > 0) document.querySelector('.blue-2').textContent -= 1;
            else if (document.querySelector('.blue-3').textContent > 0) document.querySelector('.blue-3').textContent -= 1;
        }
    }
}


function showPhaseDecks(firstPhaseDeck, secondPhaseDeck, thirdPhaseDeck) {
    if (document.querySelector('.deck-config')) document.querySelector('.deck-config').remove();
    const deckConfigDiv = document.createElement('div');
    deckConfigDiv.classList.add('deck-config');

    for (let i = 1; i < 4; i++) {
        let stageNum;
        let stageNameText;
        switch (i) {
            case 1:
                stageNum = 'first';
                stageNameText = 'Первая фаза';
                break;
            case 2:
                stageNum = 'second';
                stageNameText = 'Вторая фаза';
                break;
            case 3:
                stageNum = 'third';
                stageNameText = 'Третья фаза';
                break;
        }

        const stage = document.createElement('div');
        stage.classList.add('deck-config__stage', 'stage-' + i);

        const stageName = document.createElement('div');
        stageName.classList.add('stage__name');
        stageName.textContent = stageNameText;
        const green = document.createElement('div');
        green.classList.add('stage__item', 'stage__green', 'green-' + i);


        const brown = document.createElement('div');
        brown.classList.add('stage__item', 'stage__brown', 'brown-' + i);

        const blue = document.createElement('div');
        blue.classList.add('stage__item', 'stage__blue', 'blue-' + i);

        switch (i) {
            case 1:
                green.textContent = firstPhaseDeck.greenCards.length;
                brown.textContent = firstPhaseDeck.brownCards.length;
                blue.textContent = firstPhaseDeck.blueCards.length;
                break;
            case 2:
                green.textContent = secondPhaseDeck.greenCards.length;
                brown.textContent = secondPhaseDeck.brownCards.length;
                blue.textContent = secondPhaseDeck.blueCards.length;
                break;
            case 3:
                green.textContent = thirdPhaseDeck.greenCards.length;
                brown.textContent = thirdPhaseDeck.brownCards.length;
                blue.textContent = thirdPhaseDeck.blueCards.length;
                break;
        }

        thirdView.appendChild(deckConfigDiv);
        deckConfigDiv.appendChild(stage);
        deckConfigDiv.appendChild(stageName);
        stage.appendChild(green);
        stage.appendChild(brown);
        stage.appendChild(blue);
    }
    const nextCardBtn = document.createElement('button');
    nextCardBtn.classList.add('next-card-btn', 'main-btn');
    nextCardBtn.textContent = 'Играть карту';
    deckConfigDiv.appendChild(nextCardBtn);
}




function createColorDecks(brownsArr, bluesArr, greensArr) {
    switch (deckConfig.difficulty) {
        case 'veasy':
            createDeckColorVeasy(brownsImport, brownsArr, 'browns');
            createDeckColorVeasy(bluesImport, bluesArr, 'blues');
            createDeckColorVeasy(greensImport, greensArr, 'greens');
            break;
        case 'easy':
            createDeckColorEasy(brownsImport, brownsArr, 'browns');
            createDeckColorEasy(bluesImport, bluesArr, 'blues');
            createDeckColorEasy(greensImport, greensArr, 'greens');
            break;
        case 'normal':
            createDeckColorNormal(brownsImport, brownsArr, 'browns');
            createDeckColorNormal(bluesImport, bluesArr, 'blues');
            createDeckColorNormal(greensImport, greensArr, 'greens');
            break;
        case 'hard':
            createDeckColorHard(brownsImport, brownsArr, 'browns');
            createDeckColorHard(bluesImport, bluesArr, 'blues');
            createDeckColorHard(greensImport, greensArr, 'greens');
            break;
        case 'vhard':
            createDeckColorVhard(brownsImport, brownsArr, 'browns');
            createDeckColorVhard(bluesImport, bluesArr, 'blues');
            createDeckColorVhard(greensImport, greensArr, 'greens');
            break;
    };

    shuffleArr(greensArr);
    shuffleArr(brownsArr);
    shuffleArr(bluesArr);
}

function createFirstPhaseDec(brownsArr, bluesArr, greensArr) {
    const firstPhaseDeck = {
        greenCards: [],
        blueCards: [],
        brownCards: [],
    };
    for (let i = 0; i < deckConfig.firstStage.brownCards; i++) {
        firstPhaseDeck.brownCards.push(brownsArr.shift());
    }
    for (let i = 0; i < deckConfig.firstStage.blueCards; i++) {
        firstPhaseDeck.blueCards.push(bluesArr.shift());
    }
    for (let i = 0; i < deckConfig.firstStage.greenCards; i++) {
        firstPhaseDeck.greenCards.push(greensArr.shift());
    }
    return firstPhaseDeck;
}

function createSecondPhaseDec(brownsArr, bluesArr, greensArr) {
    const secondPhaseDeck = {
        greenCards: [],
        blueCards: [],
        brownCards: [],
    };
    for (let i = 0; i < deckConfig.secondStage.brownCards; i++) {
        secondPhaseDeck.brownCards.push(brownsArr.shift());
    }
    for (let i = 0; i < deckConfig.secondStage.blueCards; i++) {
        secondPhaseDeck.blueCards.push(bluesArr.shift());
    }
    for (let i = 0; i < deckConfig.secondStage.greenCards; i++) {
        secondPhaseDeck.greenCards.push(greensArr.shift());
    }
    return secondPhaseDeck;
}

function createThirdPhaseDec(brownsArr, bluesArr, greensArr) {
    const thirdPhaseDeck = {
        greenCards: [],
        blueCards: [],
        brownCards: [],
    };
    for (let i = 0; i < deckConfig.thirdStage.brownCards; i++) {
        thirdPhaseDeck.brownCards.push(brownsArr.shift());
    }
    for (let i = 0; i < deckConfig.thirdStage.blueCards; i++) {
        thirdPhaseDeck.blueCards.push(bluesArr.shift());
    }
    for (let i = 0; i < deckConfig.thirdStage.greenCards; i++) {
        thirdPhaseDeck.greenCards.push(greensArr.shift());
    }
    return thirdPhaseDeck;
}


function createDeckColorVeasy(importedArr, targetArr, color) {
    for (let k = 0; k < importedArr.length; k++) {
        if (targetArr.length < deckConfig[color] && importedArr[k].difficulty === 'easy') {
            targetArr.push(importedArr[k]);
        };
    };
    for (let j = 0; j < importedArr.length; j++) {
        if (targetArr.length < deckConfig[color] && importedArr[j].difficulty === 'normal') {
            targetArr.push(importedArr[j]);
        };
    };
}

function createDeckColorEasy(importedArr, targetArr, color) {
    for (let k = 0; k < importedArr.length; k++) {
        if (targetArr.length < deckConfig[color] && !(importedArr[k].difficulty === 'hard')) {
            targetArr.push(importedArr[k]);
        };
    };
}
function createDeckColorNormal(importedArr, targetArr, color) {
    for (let k = 0; k < importedArr.length; k++) {
        if (targetArr.length < deckConfig[color])
            targetArr.push(importedArr[k]);
    };
}
function createDeckColorHard(importedArr, targetArr, color) {
    for (let k = 0; k < importedArr.length; k++) {
        if (targetArr.length < deckConfig[color] && !(importedArr[k].difficulty === 'easy')) {
            targetArr.push(importedArr[k]);
        };
    };
}
function createDeckColorVhard(importedArr, targetArr, color) {
    for (let k = 0; k < importedArr.length; k++) {
        if (targetArr.length < deckConfig[color] && importedArr[k].difficulty === 'hard') {
            targetArr.push(importedArr[k]);
        };
    };
    for (let j = 0; j < importedArr.length; j++) {
        if (targetArr.length < deckConfig[color] && importedArr[j].difficulty === 'normal') {
            targetArr.push(importedArr[j]);
        };
    };
}

function shuffleArr(array) {
    let currentInd = array.length, randomInd;
    while (currentInd != 0) {
        randomInd = Math.trunc(Math.random() * currentInd);
        currentInd--;
        [array[currentInd], array[randomInd]] = [
            array[randomInd], array[currentInd]];
    }
    return array;
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }