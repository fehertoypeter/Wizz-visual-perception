const instruments = [
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "b2",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "c1",
  "c3",
  "c4",
  "c5",
  "c7",
  "c8",
  "d1",
  "d2",
  "d3",
  "d4",
  "d6",
  "d7",
  "e1",
  "e2",
  "e3",
  "e4",
  "e6",
  "e8",
  "f1",
  "f2",
  "f3",
  "f5",
  "f7",
  "f8",
];

const instructions = [
  "red instruments",
  "white instruments",
  "instruments with a square",
  "instruments with a circle",
  "red instruments with a square",
  "red instruments with a circle",
  "white instruments with a square",
  "white instruments with a circle",
];

let instrumentDetails = []; // To store instrument details
let mainInstruction = { color: null, shape: null }; // To store the main instruction's color and shape

document.getElementById("newGameBtn").addEventListener("click", startGame);

function startGame() {
  resetGame(); // Reset game to default stat
  // Call the function to start the countdown
  timerStart();
  // Show random instruction for 4 seconds
  const instructionText = document.getElementById("instruction");
  const randomInstruction =
    instructions[Math.floor(Math.random() * instructions.length)];

  instructionText.innerText = `Search for: ${randomInstruction}`;
  instructionText.style.display = "block";
  document.getElementById("imageContainer").style.display = "none";

  // Set the main instruction's color and shape
  if (randomInstruction.includes("red")) {
    mainInstruction.color = "red";
  } else if (randomInstruction.includes("white")) {
    mainInstruction.color = "white";
  } else {
    mainInstruction.color = null;
  }

  if (randomInstruction.includes("square")) {
    mainInstruction.shape = "square";
  } else if (randomInstruction.includes("circle")) {
    mainInstruction.shape = "circle";
  } else {
    mainInstruction.shape = null;
  }

  setTimeout(() => {
    instructionText.style.display = "none";
    loadRandomImages();
  }, 4000);
}

function resetGame() {
  // Reset all relevant fields and variables
  document.getElementById("instruction").innerText = "";
  document.getElementById("imageContainer").style.display = "none";
  if (document.getElementById("inputContainer")) {
    document.getElementById("inputContainer").remove(); // Remove previous input fields
  }
  instrumentDetails = [];
  mainInstruction = { color: null, shape: null }; // Reset main instruction
}

function loadRandomImages() {
  const row1 = document.getElementById("row1");
  const row2 = document.getElementById("row2");
  const row3 = document.getElementById("row3");

  row1.innerHTML = ""; // Clear previous content
  row2.innerHTML = "";
  row3.innerHTML = "";

  instrumentDetails = []; // Clear previous instrument details

  const selectedImages = getRandomImages(6); // Select 6 random images

  // First row: 3 images
  for (let i = 0; i < 3; i++) {
    createImageDiv(selectedImages[i], row1);
  }

  // Second row: 2 images
  for (let i = 3; i < 5; i++) {
    createImageDiv(selectedImages[i], row2);
  }

  // Third row: 1 image
  createImageDiv(selectedImages[5], row3);

  // Show images for 4 seconds
  document.getElementById("imageContainer").style.display = "block";

  setTimeout(() => {
    document.getElementById("imageContainer").style.display = "none";
    showFinalInputField();
  }, 4000);
}

function createImageDiv(image, row) {
  const imageDiv = document.createElement("div");
  imageDiv.classList.add("image-div");

  const randomCircleColor = Math.random() > 0.5 ? "red" : "white";
  const randomShapeType = Math.random() > 0.5 ? "circle" : "square";

  // Create the random background circle (below the image)
  const randomCircle = document.createElement("div");
  randomCircle.classList.add("random-circle");
  if (randomCircleColor === "white") {
    randomCircle.classList.add("white");
  }
  imageDiv.appendChild(randomCircle);

  // Create the image element
  const imgElement = document.createElement("img");
  imgElement.src = `./instruments/${image}.png`;
  imageDiv.appendChild(imgElement);

  // Create the random small shape (circle or square) above the image
  const smallShape = document.createElement("div");
  smallShape.classList.add("small-shape");
  if (randomShapeType === "circle") {
    smallShape.classList.add("circle");
  } else {
    smallShape.classList.add("square");
  }
  imageDiv.appendChild(smallShape);

  row.appendChild(imageDiv);

  // Store instrument details
  const imageNumber = image.match(/\d+/)[0]; // Extract number from filename
  instrumentDetails.push({
    color: randomCircleColor,
    shape: randomShapeType,
    imageNumber: imageNumber,
  });
}

function getRandomImages(count) {
  const shuffled = instruments.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function showFinalInputField() {
  // Create a container for the input field
  const inputContainer = document.createElement("div");
  inputContainer.id = "inputContainer";

  const label = document.createElement("label");

  inputContainer.appendChild(label);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Answer";
  input.id = "finalInput";

  inputContainer.appendChild(input);

  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.id = "submitButton"; // Set the ID of the button
  inputContainer.appendChild(submitButton);

  // Append the input container to the div with id 'container'
  document.getElementById("guessContainer").appendChild(inputContainer);

  submitButton.addEventListener("click", () => {
    const userAnswer = input.value;
    validateAnswer(userAnswer);
  });
}

function validateAnswer(userAnswer) {
  let correctAnswer = "";
  let correctCount = 0;

  instrumentDetails.forEach((instrument) => {
    if (
      (mainInstruction.color === null ||
        mainInstruction.color === instrument.color) &&
      (mainInstruction.shape === null ||
        mainInstruction.shape === instrument.shape)
    ) {
      correctAnswer += instrument.imageNumber;
      correctCount++; // Increment count for each correct instrument
    } else {
      correctAnswer += "0"; // For non-matching instruments
    }
  });

  const input = document.getElementById("finalInput");

  if (userAnswer === correctAnswer) {
    input.style.backgroundColor = "#CDDA32"; // Green background on correct answer
  } else {
    // Show the correct answer and count of correctly matched instruments
    const errorMessage = document.createElement("div");
    errorMessage.innerText = `Correct answer: ${correctAnswer}.`;
    errorMessage.style.color = "red";
    inputContainer.insertBefore(errorMessage, input);

    input.style.backgroundColor = "lightcoral"; // Red background on wrong answer
  }

  console.log(instrumentDetails);
  console.log(mainInstruction);
}

function timerStart() {
  const wrapper = document.querySelector(".wrapper");

  // Megjelenítjük a timert
  wrapper.style.display = "block";

  // Elindítjuk az animációt
  const spinner = wrapper.querySelector(".spinner");
  const filler = wrapper.querySelector(".filler");
  const mask = wrapper.querySelector(".mask");

  // Reseteljük az animációs állapotokat
  spinner.style.animationPlayState = "running";
  filler.style.animationPlayState = "running";
  mask.style.animationPlayState = "running";

  // 8 másodperc múlva eltüntetjük a timert és megállítjuk az animációkat
  setTimeout(() => {
    wrapper.style.display = "none"; // Eltüntetjük a timert
    spinner.style.animationPlayState = "paused"; // Megállítjuk az animációt
    filler.style.animationPlayState = "paused"; // Megállítjuk az animációt
    mask.style.animationPlayState = "paused"; // Megállítjuk az animációt
  }, 8000); // 8000 ms = 8 másodperc
}

// Információs ikon esemény kezelése
document.getElementById("info-icon").addEventListener("click", () => {
  const rulesContainer = document.getElementById("rules-container");
  // Ellenőrizzük, hogy a szabálykönyv látható-e
  if (rulesContainer.style.display === "none") {
    rulesContainer.style.display = "block"; // Megjelenítjük
  } else {
    rulesContainer.style.display = "none"; // Elrejtjük
  }
});

// Bezáró gomb esemény kezelése
document.getElementById("close-rules").addEventListener("click", () => {
  document.getElementById("rules-container").style.display = "none"; // Bezárjuk a szabálykönyvet
});
