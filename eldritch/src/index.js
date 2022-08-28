'use strict'
import ancients from './assets/Ancients/index.js';
import ancientsData from './data/ancients.js';
import './style.css';
import cardFaceSrc from './assets/mythicCardBackground.png';
import greensImport from './data/mythicCards/green/index';
import brownsImport from './data/mythicCards/brown/index';
import bluesImport from './data/mythicCards/blue/index';


const ancientsList = document.querySelector('.ancients-list');
const diffBtns = document.querySelector('.diff-btns');
const shuffleDeck = document.querySelector('.shuffle-deck');
const mainTag = document.querySelector('.main');
const gameTag = document.querySelector('.game');
const subHeading = document.querySelector('.main__sub-heading');

shuffleArr(brownsImport);
shuffleArr(greensImport);
shuffleArr(bluesImport);


const deckConfig = {
    boss: '',
    difficulty: '',
};

function showAncients() {
    for (let key in ancients) {
        const ancientImg = new Image();
        ancientImg.classList.add('ancient');
        ancientImg.src = ancients[key];
        ancientImg.dataset.boss = key;
        ancientsList.appendChild(ancientImg);
    };
    let selectedAncient;
    ancientsList.onclick = (e) => {
        let img = e.target.closest('img');
        if (!img) return;
        if (!ancientsList.contains(img)) return;
        // if (selectedAncient) selectedAncient.style.outline = 'unset';
        selectedAncient = img;
        document.querySelector('.ancients-list').style.display = 'none';
        // selectedAncient.style.outline = '2px solid red';
        // const allBosses = document.querySelectorAll('.ancient');
        // allBosses.forEach(elem => elem.classList.add('hidden'));
        // selectedAncient.classList.add('visible');
        gameTag.insertBefore(selectedAncient, diffBtns);
        subHeading.textContent = 'Выберите сложность игры';

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

        diffBtns.classList.add('visible');
    }
}
showAncients();

//set difficulty
diffBtns.onclick = (e) => {
    let target = e.target;
    if (target.tagName !== 'BUTTON') return;
    deckConfig.difficulty = target.dataset.diff;
    shuffleDeck.classList.add('visible')
}

shuffleDeck.onclick = () => {
    const greensArr = [];
    const brownsArr = [];
    const bluesArr = [];

    createColorDecks(brownsArr, bluesArr, greensArr);

    const firstPhaseDeck = createFirstPhaseDec(brownsArr, bluesArr, greensArr);
    const secondPhaseDeck = createSecondPhaseDec(brownsArr, bluesArr, greensArr);
    const thirdPhaseDeck = createThirdPhaseDec(brownsArr, bluesArr, greensArr);

    showPhaseDecks(firstPhaseDeck, secondPhaseDeck, thirdPhaseDeck);

    showCardFace();

    showCardImg(firstPhaseDeck, secondPhaseDeck, thirdPhaseDeck);
}


function showCardImg(firstPhaseDeck, secondPhaseDeck, thirdPhaseDeck) {
    const firstPhaseArr = firstPhaseDeck.greenCards.concat(firstPhaseDeck.brownCards, firstPhaseDeck.blueCards).flat();
    const secondPhaseArr = secondPhaseDeck.greenCards.concat(secondPhaseDeck.brownCards, secondPhaseDeck.blueCards).flat();
    const thirdPhaseArr = thirdPhaseDeck.greenCards.concat(thirdPhaseDeck.brownCards, thirdPhaseDeck.blueCards).flat();
    shuffleArr(firstPhaseArr);
    shuffleArr(secondPhaseArr);
    shuffleArr(thirdPhaseArr);

    const allPhasesArr = firstPhaseArr.concat(secondPhaseArr, thirdPhaseArr);

    document.querySelector('.card-face').onclick = () => {
        if (!allPhasesArr.length) return;
        if (document.querySelector('.showing-card')) document.querySelector('.showing-card').remove();
        const showingImg = new Image();
        let shiftedCard = allPhasesArr.shift()
        showingImg.src = shiftedCard.cardFace;
        showingImg.classList.add('showing-card');
        mainTag.appendChild(showingImg);

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



function showCardFace() {
    if (document.querySelector('.card-face')) document.querySelector('.card-face').remove();
    if (document.querySelector('.showing-card')) document.querySelector('.showing-card').remove();
    const cardFace = new Image();
    cardFace.src = cardFaceSrc;
    cardFace.classList.add('card-face');
    mainTag.appendChild(cardFace);
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

        mainTag.appendChild(deckConfigDiv);
        deckConfigDiv.appendChild(stageName);
        deckConfigDiv.appendChild(stage);
        stage.appendChild(green);
        stage.appendChild(brown);
        stage.appendChild(blue);
    }
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