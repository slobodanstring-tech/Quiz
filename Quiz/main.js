const topBar = document.querySelector(".top-bar")
const topBarH1 = document.querySelector(".top-bar h1")

// box
const categoryBox = document.querySelector(".category-box")
const homeBox = document.querySelector(".home-box") 
const quizBox = document.querySelector(".quiz-box")
const resultBox = document.querySelector(".result-box")

// 
const qustionNumber = document.querySelector(".qustion-number")
const qustionText = document.querySelector(".qustion-text")
const optionContainer = document.querySelector(".option-container")
const answerIndicatorContainer = document.querySelector(".answer-indicator")
const radioBtnCategory = document.getElementsByName("category")
const infoI = document.querySelector(".info > i")
const logo = document.querySelector(".logo")

// btn
const btnSledece = document.querySelector(".btn-sledece")
const btn = document.querySelector(".btn-pocetak")
const btnNext = document.querySelector(".next")
const btnAgain = document.querySelector(".try-again")
const btnHome = document.querySelector(".go-home")

// 
let turn = document.querySelector(".turn")
let time = document.querySelector(".time")

// evenListener
btnSledece.addEventListener("click",btnStart)
btn.addEventListener("click",startQuiz)
btnNext.addEventListener("click",next)
btnAgain.addEventListener("click",tryAgainQuiz)
btnHome.addEventListener("click",goToHome)
logo.addEventListener("click",goToHomeLogo)
turn.addEventListener("mouseover",showTimer)
turn.addEventListener("mouseout",offTimer)

let category = "";
let qustionCounter = 0;
// Izabrano pitanje random, iz arraya sa pitanjima neke kategorije
let randomQuestion;
// Objekat sa pitanjem i odgovorima iz izanrane kategorije
let availableQustions = [];
// Na koliko pitanja smo pokusali da odgovorimo
let attempt = 0;
let correctAnswer = 0;
// koliko pitanja u datoj kategoriji hocemo da pitamo korisnika
let numb = 10;
let mainScore = 0;
let m = 2;
let s = 59;
// Postavljas  koliko imas puta da odgovoras od 30 puta 
let turns = 30;
turn.innerHTML =`${turns}/30`
turn.insertAdjacentElement('beforeend', time);

// Pokrecem timer 
timer()

// Ako je usniman neki rezultat od pre u local storagu da se prikaze, a ako localStorage object ne postoji ( user nije igrao ovaj quiz pre), onda nista da se ne desi
if(!localStorage.ukupniRezultat){
    console.log("Novi igrac");
}else{
    let previousScore = parseInt(localStorage.getItem("ukupniRezultat"))  
    mainScore += previousScore
    infoI.innerHTML =" " + mainScore
}


// *** dugme btnStart ->Izaberes kategorije i kliknes na dugme da kviz krene 
function btnStart(){
    // dodeljujemo kategoriju koju smo izabrali , u category variablu
    createCategory()
    // Postavljamo koliko imamo puta da odgovaramo na pitanja
    turn.innerHTML = `${turns}/30`
    turn.insertAdjacentElement('beforeend', time);
    // Prolazi kroz sve objekte sa pitanjima koja postoje u bazi i pravi novi Array sa objektima samo iz odabrane kategorije
    setAvailableQustions();
    // Prikazuje se box sa obavestenjem koliko imamo pitanja u izabranoj kategoriji i krijemo box sa kategorijama i pokazujemo box sa obavestenjema o kategoriji i broju pitanja u toj kategoriji
    // Ime kategorije
    homeBox.querySelector("h3 > span").innerHTML = ` ${category}` 
    // koliko ima pitanja u kategoriji
    homeBox.querySelector(".total-qustion").innerHTML = numb 
    homeBox.classList.remove("hide")
    categoryBox.classList.add("hide")
};


// *** dugme START QUIZ -> 
function startQuiz(){
// krije home box
    homeBox.classList.add("hide")
// prikazuje quiz box
    quizBox.classList.remove("hide")
// Prikazujemo u boxu koje je po redu pitanje i od koliko pitanja
// Biramo random pitanje iz dostupnih pitanja iz neke kategorije
// Izbacujemo to pitanje iz array-a dostupnih pitanja da ne bi pitali isto pitanje
// Prikazujemo text tog pitanja u njegov box
// Prikazujemo ponudjene odgovore i kazemo da kad se klikne na neki odgovor dodeljuje mu se event na click da pokrene funkciju getResult(this)
    newQuestion();
// Prikazuje krugove koji predstavljaju pitanja koja su dostupna iz izabrane kategorije
    answerIndicator()
}

function createCategory(){
    for (let i = 0; i < radioBtnCategory.length; i++) {
        if(radioBtnCategory[i].checked){
            category = radioBtnCategory[i].value
        }
    }
}

function setAvailableQustions(){
    for (let i = 0; i < quiz.length; i++) {
        if(category === quiz[i].category){
            availableQustions.push(quiz[i])
        }
    }
}


function newQuestion(){
    qustionNumber.innerHTML = "Question " + (qustionCounter + 1) + " of " + numb;
// Ako je zadnje pitanje da se promeni i da u dugmetu ne pise sledece pitanje nego Kraj 
    if(qustionCounter + 1 === numb){
        btnNext.innerHTML = "Kraj"
    }else{
        btnNext.innerHTML = "Sledece"
    }
    if(turns !== 0){
        turns --
        turn.innerHTML = `${turns}/30`
        turn.insertAdjacentElement('beforeend', time);
    }
    
// Pitanja
    randomQuestion = availableQustions[Math.floor(Math.random() * numb)]
    qustionText.innerHTML = randomQuestion.q
    // brisemo to pitanje
    const qusetionIndex = availableQustions.indexOf(randomQuestion)
    availableQustions.splice(qusetionIndex,1)   
//odgovori
    optionContainer.innerHTML = ""
    let animationDelay = 0.15;
    for (let i = 0; i < randomQuestion.option.length; i++) {
        const option = document.createElement("div") 
        option.className = "option" 
        option.id = i
        option.innerHTML = randomQuestion.option[i] 
        optionContainer.appendChild(option)
        // dodaje se div-u sa odgovorom, event da bude klikabilan i kad se na njega klikne da pozove funkciju i da posalje njoj sebe ( tj div na koji smo kliknuli)
        option.setAttribute("onclick","getResult(this)") 
        // Svaki put ce sledeci div sa odgovorom da se pojavi za o.15s kasnije
        option.style.animationDelay = animationDelay + "s"; 
        animationDelay = animationDelay + 0.15;  
    } 
    qustionCounter++
}

function answerIndicator(){
    answerIndicatorContainer.innerHTML = ""
    const totalQustion = numb
    for (let i = 0; i < totalQustion; i++) {
        const indicator = document.createElement("div")        
        answerIndicatorContainer.appendChild(indicator)
    }
}

// ***  ODGOVOR Funkcija koja se pokrece ako kliknes na neki odgovor
// ako ID tog elementa se slaze sa brojem koji pise u answer propertiju objekta kome pripada taj element
// ako se poklapaju dodaje mu se klasa da je tacan i pozeleni , a ako ne onda pocrveni
// i pokrece se funkcija koja  updateAnswerIndicator() koja oboji indikator u zeleno ili crveno
function getResult(element){
    const id = parseInt(element.id)
    if(id === randomQuestion.answer){
        element.classList.add("correct");
        updateAnswerIndicator("correct");
        correctAnswer++
    }else{
        element.classList.add("wrong")
        updateAnswerIndicator("wrong")
    }
    // ako kliknemo i bude pogresno, on nam pozeleni tacan odgovor da znamo sta je bio tacan odgovor
    const optionLen = optionContainer.children.length
    for (let i = 0; i < optionLen; i++) {
    if(parseInt(optionContainer.children[i].id) === randomQuestion.answer)
    optionContainer.children[i].classList.add("correct")
    }
    attempt++
    // Nakon sto odgovorimo oduzimamo svim odgovorima klikabilnost
    unclickableOptions()
}

// boji indikator u zeleno ili crveno
function updateAnswerIndicator(markType){
    answerIndicatorContainer.children[qustionCounter - 1].classList.add(markType)
}

// nakon sto se kliknulo na neki odgovor svim pitanjima se dodeljuje klasa i preko css-a se oduzima klikabilnost svim odgovorima
function unclickableOptions(){
    const optionLen = optionContainer.children.length
    for (let i = 0; i < optionLen; i++) {
        optionContainer.children[i].classList.add("already-answer")
    }
}



// *** dugme NEXT prikazuje box sa rezultatima
//ili poziva sledece pitanje
function next(){
    if(qustionCounter === numb){
        quizOver()
    }else{
        newQuestion()
    }
};
// Prikazuje  box sa rezultatima
function quizOver(){
        quizBox.classList.add("hide")
        resultBox.classList.remove("hide")
        quizResult()
    }

// Prikazuje rezultate
    function quizResult(){
        const score = correctAnswer * 10
        mainScore += score
        topBar.querySelector(".info > i").innerHTML = ` ${mainScore}`
        resultBox.querySelector("h2").innerHTML = `Osvojili smo ${score} poena`
        resultBox.querySelector(".total-qustion").innerHTML = numb;
        resultBox.querySelector(".total-attemp").innerHTML = numb - attempt;
        resultBox.querySelector(".total-corect").innerHTML = correctAnswer;
        resultBox.querySelector(".total-wrong").innerHTML = attempt - correctAnswer;
        const percentage = (correctAnswer/numb) * 100; 
        // ogranicavamo da budu dve decimale
        resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
        resultBox.querySelector(".total-score").innerHTML = correctAnswer + "/" + numb;
        // Usnimavamo rezultat u localStorage objektu
        localStorage.setItem("ukupniRezultat",mainScore);
        }

        // Dugme da ponovimo opet quiz
    function tryAgainQuiz(){
            resultBox.classList.add("hide")
            quizBox.classList.remove("hide")
        // vraca brojac pitanja,broj tacnih odgovora i promasenih odgovora na 0
            resetQuiz()
        // Izvalcimo opet iz svih pitanja ona koja ce da se postavljaju u zavisnosti od kategorije
            setAvailableQustions();
        // 
            startQuiz()
        }

        function resetQuiz(){
            qustionCounter = 0;
            correctAnswer = 0;
            attempt = 0;
        }

        function goToHome(){
                resultBox.classList.add("hide")
                categoryBox.classList.remove("hide")
                resetQuiz()
            }
        function goToHomeLogo(){
            resultBox.classList.add("hide")
            homeBox.classList.add("hide")
            quizBox.classList.add("hide")
            categoryBox.classList.remove("hide")
                resetQuiz()
        }

function timer(){
    s--
    // Ako je doslo vreme do 0 povecaj za jedan pokusaj
    if((m === 0 && s === 0) && turns !== 30){
        turns ++;
        turn.innerHTML = `${turns}/30`
        turn.insertAdjacentElement('beforeend', time);
    }
    // Ako je vreme doslo do 0, opet nek krene od 3min
    if(m === 0 && s === 0){
        m = 3
    }
    // Ako dodje do 0 sekunde oduzmi jedan minut i postavin sekunde na 59
    if(s === 0){
        m --
        s = 59
    }
    // Ako je manje od 10 sekunde dodaj jos jednu 0 ispred 
    if(s < 10){
        s = `0${s}`
    }
    //Pop up sa obavestenjem da nemamo vise pokusaja ako nemamo, a ako imamo ne prikazuje ga
    if(turns == 0){
        quizBox.querySelector(".no-energy").style.display = "block" 
        showTimer()
        // Pokaze pop up a sakrije kontejner sa odgovorima da ne vire ispod pop upa ( nista bitno)
        optionContainer.style.display = "none"
    }
    if(turns !== 0){
        quizBox.querySelector(".no-energy").style.display = "none"
        optionContainer.style.display = "block"
    }
    time.innerHTML = `0${m} : ${s}`
setTimeout(timer,1000)
}

function showTimer() {
    time.style.display = "block";
}

function offTimer() {
    time.style.display = "none";
}



