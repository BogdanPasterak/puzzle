import ShapesConfigurations from "./shapes.js";

// --- ZMIENNE ROZMIAROWE W JEDNYM MIEJSCU ---
const numRows = 8;        // Liczba wierszy planszy
const numCols = 7;       // Liczba kolumn planszy
const cellSize = 100;      // Rozmiar pojedynczej komórki w pikselach (np. 40px na 40px)
const tablica = new Array(numRows);
// ---------------------------------------------

const boardContainer = document.getElementById('board-container');

// kolory obiektow
const colorsRGBA = [
    'rgba(255, 99, 71, 0.7)',  // Tomato (czerwony)
    'rgba(255, 165, 0, 0.7)',  // Orange (pomarańczowy)
    'rgba(255, 255, 0, 0.7)',  // Yellow (żółty)
    'rgba(124, 252, 0, 0.7)',  // Lawn Green (jasny zielony)
    'rgba(0, 128, 0, 0.7)',   // Green (zielony)
    'rgba(0, 191, 255, 0.7)',  // Deep Sky Blue (błękitny)
    'rgba(0, 0, 255, 0.7)',   // Blue (niebieski)
    'rgba(128, 0, 128, 0.7)',  // Purple (fioletowy)
    'rgba(255, 0, 255, 0.7)',  // Magenta (purpurowy/różowy)
    'rgba(255, 105, 180, 0.7)' // Hot Pink (gorący róż)
];
// texty na polach
const opis = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun","" , "Jul", "Aug", "Sep", "Oct", "Nov", "Dec","" ,
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16",
    "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31",
    "2025" ,"2026" ,"2027" ,"2028"
];
// bierzacy dzien
const nazwyShapes = ["l","i","n","N","R","P","L","Z","T","C"]


// Ustawienie rozmiarów siatki dla #board-container za pomocą JavaScript
boardContainer.style.gridTemplateColumns = `repeat(${numCols}, ${cellSize}px)`;
boardContainer.style.gridTemplateRows = `repeat(${numRows + 1}, ${cellSize}px)`;
boardContainer.style.width = `${numCols * cellSize}px`;
boardContainer.style.height = `${(numRows + 1) * cellSize}px`;


// 1. Generowanie WSZYSTKICH komórek planszy najpierw
function generatePlansza() {
    let i = 0;

    for (let r = 0; r < numRows; r++) {
        tablica[r] = new Array(numCols).fill(0);
        for (let c = 0; c < numCols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Ustawienie rozmiaru komórki
            cell.style.width = cell.style.height = `${cellSize}px`;
            cell.id = `${i}`;
            cell.textContent = opis[i]; 

            // miesiac, dzien, rok, dzien tygodnia
            if ( i === 6 || i === 13) cell.classList.add("empty");
            else if (i < 13) cell.classList.add("month");
            else if (i < 21) cell.classList.add("wday");
            else if (i < 52) cell.classList.add("day");
            else cell.classList.add("year");
            // pierwszy styczen 2025 - Sroda
            if (i === 0 || i === 21 || i === 52 ) cell.classList.add("today");
            if (i === 17) cell.classList.add("week");
            i++;
            boardContainer.appendChild(cell);
        }
    }
}

// 2. Obsluga ustawiania dnia na planszy

function getDayOfWeek(year, month, day) {
    const date = new Date(year, month, day);

    return { 
        "year": date.getFullYear(),
        "month" : date.getMonth(),
        "day" : date.getDate(),
        "week" : date.getDay()};
}

function today() {
    const thisDate = document.querySelectorAll('.today')

    return {
        "month" : (parseInt(thisDate[0].id) - ((parseInt(thisDate[0].id) > 5) ? 1: 0)),
        "day" : (parseInt(thisDate[1].id) - 20),
        "year" : (parseInt(thisDate[2].textContent))
    }
}

function sprawdzDate() {
    let thisDate = today();
    let realDate = getDayOfWeek(thisDate.year, thisDate.month, thisDate.day);
    // jesli poza, zmienia dzien i miesiac

    while (thisDate.day !== realDate.day) {
        setDay(--thisDate.day )
        thisDate = today();
        realDate = getDayOfWeek(thisDate.year, thisDate.month, thisDate.day);
    }
    setWeek(realDate.week); 
}

// popraw dzien tygodnia
function setWeek(nr) {

    document.querySelector(".week").classList.remove("week");
    (document.querySelectorAll('div.wday'))[nr].classList.add("week");
}

// popraw dzien
function setDay(nr) {
    const days = document.querySelectorAll(".day")

    days[today().day - 1].classList.remove("today");
    days[--nr].classList.add("today");
}

// popraw dzien
function setMonth(nr) {
    const months = document.querySelectorAll(".month")

    months[today().month].classList.remove("today");
    months[nr].classList.add("today");
}

// popraw dzien
function setYear(nr) {
    const years = document.querySelectorAll('div.year');

    (years[today().year - 2025]).classList.remove("today");
    years[nr - 2025].classList.add("today");
}

// aktywne pola
function dodajEventyDoPul() {
    document.addEventListener('DOMContentLoaded', () => {
        const months = document.querySelectorAll('div.month');
        const day = document.querySelectorAll('div.day');
        const year = document.querySelectorAll('div.year');

        months.forEach(div => {
            div.addEventListener('click', (event) => {
                setMonth(parseInt(event.target.id) - ((parseInt(event.target.id) > 5) ? 1 : 0));
                sprawdzDate();
            });
        });
        day.forEach(div => {
            div.addEventListener('click', (event) => {
                setDay(parseInt(event.target.id) - 20);
                sprawdzDate();
            });
        });

        year.forEach(div => {
            div.addEventListener('click', (event) => {
                setYear(parseInt(event.target.textContent))
                sprawdzDate();
            });
        });
    });
    document.querySelector("button").addEventListener('click', (e) => {
        // console.log("poszlo");
        setShapeOnBoard();
    })
}


// 3. Testowanie Ukladu

function zmazShape(nazwa) {
    boardContainer.querySelectorAll(`.${nazwa}`).forEach(klocek =>
        klocek.classList.remove(nazwa)
    );
}

// rysowanie figury
function rysujShape(obiekt, pole) {
    
    ShapesConfigurations[obiekt.index][obiekt.konfig].forEach(kostka => 
        document.getElementById((pole + kostka[1] + kostka[0] * 7)).classList.add(obiekt.nazwa)
    );
}

// testuj pole
function testujPole(nr) {
    const color = window.getComputedStyle(document.getElementById(nr)).backgroundColor;

    if (color === "rgb(255, 255, 255)") return true;
    return false;
}

// Testowanie obiektu w konfiguracji, na pozycji, oparte o tablice
function testujObiekt(obiekt, pole) {

    let c = pole % 7;
    let r = (pole - c) / 7;
    let kostka, x, y;

    const kostki = ShapesConfigurations[obiekt.index][obiekt.konfig];
    if (kostki == undefined) return false;
    let ok = true;

    for (let i = 0; i < kostki.length; i++) {
        kostka = kostki[i];
        x = c + kostka[1];
        y = r + kostka[0];
        // poza obrazem lub nie biale pole
        if ( x < 0 || y < 0 || x > 6 || y > 7 || ! testujPole(x + y * 7)) {
            ok = false;
            break;
        }
    }
    return ok;
}

function includes(lista, uklad) {
    let jest = false;

    for (const e of lista) 
        if (e.pole === uklad.pole && e.index === uklad.index && e.konfig === uklad.konfig) jest = true;

    return jest;
}

function wyczysc(lista, pole) {

    for (let i = lista.length - 1; i >= 0 ; i--) {
        const e = lista[i];
        if (e.pole >= pole)
            lista.pop(); 
        else
            break;                      
    } 
}

function cofnijRuch(ustawione, obiekty) {
    let back = ustawione.shift();

    // usun klocki
    boardContainer.querySelectorAll(`.${back.nazwa}`).forEach(klocek =>
        klocek.classList.remove(back.nazwa)
    );
    // next konfig
    back.konfig = (back.konfig + 1) % ShapesConfigurations[back.index].length;
    //przechowaj pozycje - 1
    const pole = back.pole - 1;
    // wymaz element i przenies do obiektow
    back.pole = undefined;
    obiekty.push(back);
    // zwruc pozycje
    return pole;
}

// Funkcja obsadza figury na planszy
function setShapeOnBoard() {
    // metoda silowa, proba osadzenia kazdego ksztaltu w kazdej konfiguracji na kolejnych miejscach
    // tablica obiektow do osadzenia, numer ob, konfiguracja, nazwa
    let obiekty = Array(nazwyShapes.length);
    let ustawione = Array(0);
    let taKonf = true;
    let cont = 0;
    let lista = Array(0);
    let uklad = {};
    let back = {};
    let alicznik = 0;
    let wynik = true;

    for (let i = 0; i < nazwyShapes.length; i++) 
        obiekty[i] = { "index" : i, "konfig" : 0, "nazwa" : nazwyShapes[i] };
    // petla przechodzaca kolejne puste pola
    let pole = 0;
    // debugger;

    do {    // pentla pustych pul
        if (testujPole(pole)) {
            cont = 0; taKonf = true;   // licznik obiektow do ustawienia
            do {    // pentla nieurzytych klockow
                while (! testujObiekt(obiekty[0], pole)) {  // pentla konfiguracji
                    obiekty[0].konfig ++;
                    if (obiekty[0].konfig >= ShapesConfigurations[obiekty[0].index].length) {
                        taKonf = false; break; }
                }
                if (taKonf) {   // jesli pasuje to czy juz byla
                    uklad = {"pole" : pole, "index" : obiekty[0].index, "konfig" : obiekty[0].konfig};
                    if ( includes( lista, uklad ) ) cont = 20;
                    else lista.push(uklad);
                    rysujShape(obiekty[0], pole);
                    alicznik++;
                    // if (alicznik % 100 === 0 && alicznik > 1) console.log(alicznik);
                    // if (alicznik === 552) debugger;
                    back = obiekty.shift();
                    back.pole = pole;
                    ustawione.unshift(back);
                    break;  // narysowana, wyjdz z petli klockow !
                } else {    // nie pasuje, przestawienie figur( zerowana konfig i na koniec)
                    cont++;
                    taKonf = true;
                    obiekty[0].konfig = 0;
                    obiekty.push(obiekty.shift());
                }
            } while (cont < obiekty.length);

            if (obiekty.length === 0) 
                // { console.log("Koniec, jest uklad", alicznik); break;}
                { wynik = true; break;}

            if (cont >= obiekty.length) {   // cofnac, nie znaleziono zadnego ukladu
                if ( ustawione.length < 1 ) // nie ma co wycofac, wynik albo nie ma
                    // { console.log("Koniec, nie ma kombinacji", alicznik); wynik = false; break;}
                    { wynik = false; break;}
                pole = cofnijRuch(ustawione, obiekty)
                // cofnij kolejny
                if (cont === 20) {                    
                    // posciagac z listy te pola
                    wyczysc(lista, pole +1);
                    if ( ustawione.length < 1 ) // nie ma co wycofac, wynik albo nie ma
                        // { console.log("Koniec, nie ma kombinacji", alicznik); wynik = false; break;}
                        { wynik = false; break;}
                    pole = cofnijRuch(ustawione, obiekty)
                }
            }
        }   
        pole ++; 
        // if (obiekty.length < 2 && testujPole(pole)) debugger;
    } while (pole < 54 || obiekty.length === 0);

    return wynik;
    // console.log("Pole - ", pole, ".  Pozostalo klockow - ", obiekty.length, obiekty[0]);
}

function pentla() {
    let dzien;
    let dzienText;
    let i = 0, j = 0;

    for (let d = 1; d < 366; d++) {
        dzien = new Date( 2025, 0, d)
        // console.log(dzien);
        setDay(dzien.getDate());
        setMonth(dzien.getMonth());
        setYear(dzien.getFullYear());
        sprawdzDate();
        dzienText = dzien.getDate() + "/" + (dzien.getMonth() + 1) + "/" + dzien.getFullYear();

        if (setShapeOnBoard())
            // console.log(dzienText, " Jest");
            i++;
        else
            // console.log(dzienText, " Nie ma");
            j++;
        nazwyShapes.forEach(nazwa => zmazShape(nazwa) );

        if ( d % 10 == 0 ) console.log("Jest", i, ".   Nie ma", j);

    }
    console.log(dzien, "  Jest", i, ".   Nie ma", j);
    
}

// Wyświetl pierwszą konfigurację przy starcie
generatePlansza();

dodajEventyDoPul();

// pentla();



// --- KONIEC KODU DO OBSŁUGI OBIEKTU L ---