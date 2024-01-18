// Hent referanser til HTML-elementene
const sloganButton = document.getElementById("sloganButton");
const slogan = document.getElementById("slogan");
const increaseYearButton = document.getElementById("increaseYear");
const year = document.getElementById("year");
const showGoofyWordsButton = document.getElementById("showGoofyWords");
const goofyWords = document.getElementById("goofyWords");

// Lytt til klikk på knappen for å vise/skjule slagordet
sloganButton.addEventListener("click", () => {
  if (slogan.style.visibility === "hidden") {
    slogan.style.visibility = "visible";
  } else {
    slogan.style.visibility = "hidden";
  }
});

// Lytt til klikk på knappen for å øke årstallet
increaseYearButton.addEventListener("click", () => {
  const currentYear = parseInt(year.textContent);
  year.textContent = currentYear + 1;
});

// Tilfeldige "goofye" ord
const goofyWordList = ["Flippflopp", "Bøllete", "Tullball", "Tøffelhelt", "Tøyseballe"];

// Funksjon for å vise tilfeldige "goofye" ord
function showRandomGoofyWords() {
  const randomGoofyWords = [];

  while (randomGoofyWords.length < 3) {
    const randomIndex = Math.floor(Math.random() * goofyWordList.length);
    const goofyWord = goofyWordList[randomIndex];
    
    if (!randomGoofyWords.includes(goofyWord)) {
      randomGoofyWords.push(goofyWord);
    }
  }

  // Vis de tilfeldige "goofye" ordene som en liste
  goofyWords.innerHTML = '';
  const ul = document.createElement("ul");
  randomGoofyWords.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    ul.appendChild(li);
  });
  goofyWords.appendChild(ul);
}

// Lytt til klikk på knappen for å vise tilfeldige "goofye" ord
showGoofyWordsButton.addEventListener("click", showRandomGoofyWords);

// Kall funksjonen for å vise tilfeldige "goofye" ord når nettsiden lastes
showRandomGoofyWords();


