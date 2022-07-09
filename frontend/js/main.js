// global variables
let GAME = new Game();
let interval = null; // used to update time

// resets the game state
function play() {
  // data comes from the ./data.js file
  let data_copy = JSON.parse(JSON.stringify(data));
  GAME = new Game(data_copy);
  GAME.start();
  setTime()
  renderTopBar();
  renderAllItems();
  interval = setInterval(setTime, 1000);
}

function quit() {
  GAME.inProgress = false;
  clearInterval(interval);
}

// updates the value of time and the element value
function setTime() {
  if (!GAME.inProgress) {
    return;
  }
  ++GAME.time;
  var time = document.getElementById('time');
  time.innerHTML = renderTime(GAME.time);
}

// render the topBar
function renderTopBar() {
  const tradesElement = document.getElementById('trades');
  const valueElement = document.getElementById('value');
  tradesElement.innerHTML = `${GAME.trades} trades`
  valueElement.innerHTML = `£${GAME.currentItem.price} / £100`
}

// render all the items
function renderAllItems() {
  const currentElement = document.getElementById('current');
  const offerElements = document.getElementById('offers');
  renderItem(currentElement, GAME.currentItem);
  Array.from(offerElements.children).map((el, i) => renderItem(el, GAME.currentOffers[i]))
  highlightOffers();
}

// render the contents of an item
function renderItem(element, itemData) {
  const imgDiv = element.querySelector('#item-image');
  imgDiv.style.backgroundImage = `url('${itemData.imageUri}')`
  imgDiv.classList.remove('value-more');
  imgDiv.classList.remove('value-same');
  imgDiv.classList.remove('value-less');
  const nameDiv = element.querySelector('#item-name');
  nameDiv.innerHTML = `<i>${itemData.name}</i>`
  const valueDiv = element.querySelector('#item-value');
  if (valueDiv)
    valueDiv.innerHTML = `<i>£${itemData.price}</i>`
}

// select trade offer
function selectOffer(index) {
  // block selection if currently in progress (timer)
  if (GAME.selectingOffer)
    return;
  // pause game
  GAME.selectingOffer = true;
  GAME.inProgress = false;
  highlightOffers();
  setTimeout(() => {
    // select item, re-render and resume game
    GAME.selectItem(index);
    renderAllItems();
    renderTopBar();
    GAME.selectingOffer = false;
    GAME.inProgress = true;
    // if the player has passed £100 then show winning page
    if (GAME.currentItem.price >= 100) {
      quit();
      renderWin();
    }
  }, 500);
}

// highlight the offers based on their value relative to current item
function highlightOffers() {
  const offerElements = document.getElementById('offers');
  const currentValue = GAME.currentItem.price;
  Array.from(offerElements.children).map((offer, index) => {
    const imgDiv = offer.querySelector('#item-image');
    const offerValue = GAME.currentOffers[index].price;
    if (currentValue > offerValue)
      imgDiv.classList.add('value-less');
    else if (currentValue < offerValue)
      imgDiv.classList.add('value-more');
    else
      imgDiv.classList.add('value-same');
  });
}

// render the winner screen which allows user to input their name and see scoreboard
function renderWin() {
  show('winner', 'play');
  // update values with the game scores
  const tradesElement = document.getElementById('results-trades');
  const timeElement = document.getElementById('results-time');
  const valueElement = document.getElementById('results-value');
  tradesElement.innerHTML = GAME.trades;
  timeElement.innerHTML = renderTime(GAME.time);
  valueElement.innerHTML = `£${GAME.currentItem.price}`;
}

// reset the winner page
function resetWinnerPage() {
  const confirmationElement = document.getElementById('confirmation');
  const submissionElement = document.getElementById('submission');
  confirmationElement.style.display = 'none';
  submissionElement.style.display = 'block';
}

// valid the input for the player name input
function checkInput() {
  var input = document.getElementById('player-name');
  var button = document.getElementById('submit-score');
  var checkbox = document.getElementById('global');
  if (input.value.length >= 2) {
    button.classList.remove('disabled')
    checkbox.disabled = false;
  } else {
    button.classList.add('disabled')
    checkbox.disabled = true;
  }
  return input.value.length >= 2;
}

// submit score to local storage and, if checked, the score server
function submitScore() {
  if (!checkInput())
    return;
  var input = document.getElementById('player-name');
  var checkbox = document.getElementById('global');
  // save score to local storage
  var scores = JSON.parse(localStorage.getItem("scores") || "[]")
  scores.push({
    name: input.value,
    moves: GAME.moves,
    time: GAME.time,
    value: GAME.currentItem.price
  });
  localStorage.setItem('scores', JSON.stringify(scores));
  // update to tell user it has been added
  const confirmationElement = document.getElementById('confirmation');
  const submissionElement = document.getElementById('submission');
  confirmationElement.style.display = 'block';
  submissionElement.style.display = 'none';
  input.disabled;
  checkbox.disabled;
  input.value = '';
}
