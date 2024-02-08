// default variables before the user plays the game
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// DOM variables
const button1 = document.querySelector('#button-one');
const button2 = document.querySelector("#button-two");
const button3 = document.querySelector("#button-three");
const text = document.querySelector("#main-game-text");
const xpText = document.querySelector("#experience-points-text");
const healthText = document.querySelector("#health-text");
const goldText = document.querySelector("#gold-text");
const monsterStats = document.querySelector("#monster-stats");
const monsterName = document.querySelector("#monster-name");
const monsterHealthText = document.querySelector("#monster-health");

// weapons array
const weapons = [
  { name: 'stick', power: 5 },
  { name: ' dagger', power: 30 },
  { name: ' claw hammer', power: 50 },
  { name: ' sword', power: 100 }
];

// monsters array
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60
  },
  {
    name: "dragon",
    level: 20,
    health: 300
  }
]

// locations array
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goToStore, goToCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goToTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goToTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goToTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goToTown, goToTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "game over",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You died. Game over..."
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goToTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goToStore;
button2.onclick = goToCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goToTown() {
  update(locations[0]);
  text.style.backgroundColor = "#E2CAA8";
}

function goToStore() {
  update(locations[1]);
  text.style.backgroundColor = "#3A5268";
  text.style.color = "#FFFFFF";
}

function goToCave() {
  update(locations[2]);
}

function buyHealth() {

  if (gold >= 10) {
    // if the user buys health - they will lose gold
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
    text.innerText = `Your health is now at ${health}`;
    text.style.backgroundColor = "#007F5F";
  } else {
    // if the user doesn't have enough gold to buy health 
    text.innerText = "You do not have enough gold to buy health.";
    text.style.backgroundColor = "#F2274C";
  }

}

// buying a weapon
function buyWeapon() {

  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      // if the user buys a weapon - they have to pay in gold
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = `You now have a ${newWeapon}.`;
      inventory.push(newWeapon);
      text.innerText += ` In your inventory you have: ${inventory} `;
      text.style.backgroundColor = "#007F5F";
    } else {
      // if the user doesn't have enough money then they cannot buy the weapon
      text.innerText = "You do not have enough gold to buy a weapon.";
      text.style.backgroundColor = "#F2274C";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }

}

// selling a weapon
function sellWeapon() {

  if (inventory.length > 1) {
    // if the user sells their weapon, they will receive gold and what is in their inventory
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = `You sold a ${currentWeapon}.`;
    text.innerText += ` In your inventory you have: ${inventory} `;
  } else {
    // you cannot sell your only weapon
    text.innerText = "Don't sell your only weapon!";
  }

}

// slime monster
function fightSlime() {
  fighting = 0;
  fightMonster();
}

// beast monster
function fightBeast() {
  fighting = 1;
  fightMonster();
}

// dragon monster
function fightDragon() {
  fighting = 2;
  fightMonster();
}

// fighting the monster
function fightMonster() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

// user and monster attack
function attack() {
  text.innerText = `The ${monsters[fighting].name} attacks.`;
  text.innerText += ` You attack it with your ${weapons[currentWeapon].name}.`;
  health -= getMonsterAttackValue(monsters[fighting].level);
  
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }

  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  
  if (health <= 0) {
    gameOver();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }

  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += ` Your  ${inventory.pop()} breaks.`;
    currentWeapon--;
  }

}

// damage done to user
function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

// dodge
function dodge() {
  text.innerText = `You dodge the attack from the ${monsters[fighting].name}`;
}

// defeating a monster
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

// game over
function gameOver() {
  update(locations[5]);
  text.style.backgroundColor = "#A30000";
  text.style.color = "#FFFFFF"
}

// the dragon has been slayed and you win the game
function winGame() {
  update(locations[6]);
}

// game restart
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goToTown();
  text.style.backgroundColor = "#E2CAA8";
  text.style.color = "#2A2A2A";
}

// fun minigame
function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

// functionality of the minigame
function pick(guess) {
  const numbers = [];

  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }

  text.innerText = `You picked ${guess}. Here are the random numbers:\n`;

  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }

  if (numbers.includes(guess)) {
    // if the user guesses correctly they will win 20 gold
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    // if the user guesses incorrectly - they will lose 10 health
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      gameOver();
    }
  }

}