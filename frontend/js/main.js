// global variables
let GAME = new Game();
let interval = null; // used to update time

// resets the game state
function play() {
  // data comes from the ./data.js file
  let data_copy = JSON.parse(JSON.stringify(data));
  GAME = new Game(data_copy);
  GAME.start();
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
  if (parseInt(GAME.time / 60) >= 1)
    time.innerHTML = `${parseInt(GAME.time / 60)}m ${GAME.time % 60}s`
  else
    time.innerHTML = `${GAME.time % 60}s`
}

function renderTopBar() {
  setTime();
  const tradesElement = document.getElementById('trades');
  const valueElement = document.getElementById('value');
  tradesElement.innerHTML = `${GAME.trades} trades`
  valueElement.innerHTML = `£${GAME.currentItem.price} / £100.00`
}

// render all the items
function renderAllItems() {
  const currentElement = document.getElementById('current');
  const offerElements = document.getElementById('offers');
  renderItem(currentElement, GAME.currentItem);
  Array.from(offerElements.children).map((el, i) => renderItem(el, GAME.currentOffers[i]))
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
  }, 1000);
}

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
