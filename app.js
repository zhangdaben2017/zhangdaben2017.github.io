function* generatePoker() {
  const points = ['杰克儿总','路珊珊','齐瀚','卢昭炜','肖文扬','杨哲','刘欢','张鑫',
  '赵文慧','崔晶','李梅红','王新宁','郑春磊','张文文','张硕','杨梦迪','孙晓旭',
  '刘灿','赵传','刘震'];

  // yield* points.map(p => ['同联', p]);
  yield* points.map(p => ['♥️', p]);
}

const cards = generatePoker();

class PickedCards {
  constructor(key, storage = localStorage) {
    this.key = key;
    this.storage = storage;
    this.cards = JSON.parse(storage.getItem(key)) || [];
    this.cardSet = new Set(this.cards.map(card => card.join('')));
  }

  add(card) {
    this.cards.push(card);
    this.cardSet.add(card.join(''));
    this.storage.setItem(this.key, JSON.stringify(this.cards));
  }

  has(card) {
    return this.cardSet.has(card.join(''));
  }

  clear() {
    this.storage.clear();
  }
}

const pickedCards = new PickedCards('pickedCards');

function* shuffle(cards, pickedCards) {
  cards = [...cards];
  cards = cards.filter(card => !pickedCards.has(card));

  let len = cards.length;

  while(len) {
    const i = Math.floor(Math.random() * len);
    pickedCards.add(cards[i]);
    yield cards[i];
    [cards[i], cards[len - 1]] = [cards[len - 1], cards[i]];
    len--;
  }
}

const shuffled = shuffle(cards, pickedCards);
const cardList = document.getElementById('cardList');
const pickBtn = document.getElementById('pickBtn');
const clearBtn = document.getElementById('clearBtn');

function showCard(card) {
  const [suit, point] = card;
  const cardEl = document.createElement('span');

  cardEl.innerHTML = point;

  setTimeout(() => {
    cardEl.className = suit;
  }, 100);

  cardList.appendChild(cardEl);
}

[...pickedCards.cards].forEach((card) => {
  showCard(card);
});

pickBtn.addEventListener('click', (evt) => {
  const card = shuffled.next();
  if(!card.done) {
    showCard(card.value);
  }
});

clearBtn.addEventListener('click', (evt) => {
  pickedCards.clear();
  window.top.location.reload();
});
