
// Tab Switching
function switchTab(tabIndex) {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === tabIndex);
    contents[i].classList.toggle('active', i === tabIndex);
  });
}

// ========== ASD Test ==========
const questions = [
  "Does your child look at you when you call his/her name?",
  "How easy is it for you to get eye contact with your child?",
  "Does your child point to indicate that s/he wants something?",
  "Does your child point to share interest with you?",
  "Does your child pretend?",
  "Does your child follow where you’re looking?",
  "If you or someone else in the family is visibly upset, does your child show signs of wanting to comfort them?",
  "Would you describe your child’s first words as:",
  "Does your child use simple gestures?",
  "Does your child stare at nothing with no apparent purpose?"
];
const options = [
  "Always", "Usually", "Sometimes", "Rarely", "Never"
];
let currentQuestion = 0;
let responses = [];
let startTime = null;
let totalTime = 0;

function showQuestion(index) {
  const container = document.getElementById("asd-question-container");
  container.innerHTML = `<p>${questions[index]}</p>`;
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.className = "option-btn";
    btn.onclick = () => {
      const responseTime = (Date.now() - startTime) / 1000;
      totalTime += responseTime;
      responses[index] = option;
      currentQuestion++;
      if (currentQuestion < questions.length) {
        showQuestion(currentQuestion);
        startTime = Date.now();
      } else {
        document.getElementById("submitBtn").style.display = "block";
        document.getElementById("asd-question-container").innerHTML = "";
      }
    };
    container.appendChild(btn);
  });
  document.getElementById("prevBtn").style.display = index > 0 ? "inline-block" : "none";
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
    startTime = Date.now();
  }
}

function calculateScore() {
  let score = responses.reduce((acc, val) => {
    const map = {
      "Always": 1,
      "Usually": 2,
      "Sometimes": 3,
      "Rarely": 4,
      "Never": 5
    };
    return acc + (map[val] || 0);
  }, 0);
  let resultText = score >= 30 ? "High ASD tendency." : "Low ASD tendency.";
  document.getElementById("result").innerText = `Score: ${score} - ${resultText}`;
  document.getElementById("result").style.display = "block";
  const avg = (totalTime / responses.length).toFixed(2);
  document.getElementById("average-time").innerText = `Average Response Time: ${avg} seconds/question`;
  document.getElementById("retryBtn").style.display = "inline-block";
  document.getElementById("submitBtn").style.display = "none";
}

function retryTest() {
  currentQuestion = 0;
  responses = [];
  totalTime = 0;
  document.getElementById("result").style.display = "none";
  document.getElementById("retryBtn").style.display = "none";
  document.getElementById("submitBtn").style.display = "none";
  document.getElementById("average-time").innerText = "";
  showQuestion(currentQuestion);
  startTime = Date.now();
}
showQuestion(currentQuestion);
startTime = Date.now();

// ========== Color Plate Test ==========
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorNumbers = ["12", "8", "6", "29", "45", "NA", "26", "NA", "2", "NA"];
let plateIndex = 0;
let plateResponses = [];
let plateTotalTime = 0;
let plateStart = Date.now();

function generatePlate(number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const bgColor = ['#FFD700', '#ADFF2F', '#00CED1', '#FF69B4', '#8A2BE2'][Math.floor(Math.random() * 5)];
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(200, 200, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.font = "bold 100px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, 200, 200);
}
generatePlate(colorNumbers[plateIndex]);

function nextPlate() {
  const answer = document.getElementById('userAnswer').value.trim();
  const responseTime = (Date.now() - plateStart) / 1000;
  plateResponses.push(answer);
  plateTotalTime += responseTime;
  plateStart = Date.now();
  document.getElementById('userAnswer').value = '';
  plateIndex++;
  if (plateIndex < colorNumbers.length) {
    generatePlate(colorNumbers[plateIndex]);
  } else {
    const correct = plateResponses.filter((v, i) => v.toLowerCase() === colorNumbers[i].toLowerCase()).length;
    document.getElementById('feedback').innerText = `You got ${correct} out of ${colorNumbers.length} correct!`;
    const avg = (plateTotalTime / colorNumbers.length).toFixed(2);
    document.getElementById("average-time-plate").innerText = `Average Response Time: ${avg} seconds/plate`;
  }
}

// ========== Color Box Test ==========
const colors = ["Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White"];
let boxIndex = 0;
let score = 0;
let boxStart = Date.now();
let boxTotalTime = 0;

function showBox() {
  if (boxIndex >= colors.length) {
    document.getElementById('resultBox').innerText = "Test completed!";
    document.getElementById('restartBtn').style.display = "inline-block";
    const avg = (boxTotalTime / colors.length).toFixed(2);
    document.getElementById("average-time-box").innerText = `Average Response Time: ${avg} seconds/box`;
    return;
  }
  const colorName = colors[boxIndex];
  document.getElementById('colorBox').style.backgroundColor = colorName;
  const shuffled = [...colors].sort(() => 0.5 - Math.random()).slice(0, 4);
  if (!shuffled.includes(colorName)) shuffled[0] = colorName;
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  shuffled.sort(() => 0.5 - Math.random()).forEach(color => {
    const btn = document.createElement("button");
    btn.innerText = color;
    btn.className = "option-btn";
    btn.onclick = () => {
      const responseTime = (Date.now() - boxStart) / 1000;
      boxTotalTime += responseTime;
      if (color === colorName) score++;
      document.getElementById('score').innerText = `Score: ${score} / ${colors.length}`;
      boxIndex++;
      boxStart = Date.now();
      showBox();
    };
    container.appendChild(btn);
  });
}
showBox();

function restartTest() {
  boxIndex = 0;
  score = 0;
  boxTotalTime = 0;
  document.getElementById("score").innerText = `Score: 0 / ${colors.length}`;
  document.getElementById("resultBox").innerText = "";
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("average-time-box").innerText = "";
  showBox();
}
