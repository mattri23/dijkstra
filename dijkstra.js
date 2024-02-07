let nodo;
let collegato;
let peso;
let grafo = {};

// Aggiunta di tutti gli eventi
document.addEventListener('DOMContentLoaded', (event) => {
    // Bottone per aggiungere un nodo
    let buttonAddNode = document.querySelector('#addNode');
    buttonAddNode.addEventListener('click', function() {
        addNode();
    });

    // Bottone per eseguire l'algoritmo di Dijkstra
    let buttonRunDijkstra = document.querySelector('#buttonRunDijkstra');
    buttonRunDijkstra.addEventListener('click', function() {
        runDijkstra();
    });

    // Bottone per mostrare il grafo
    let buttonShowGraph = document.querySelector('#buttonShowGraph');
    buttonShowGraph.addEventListener('click', function() {
        showGraph();
    });
});

function addNode() {
    let selectStart = document.querySelector("#StartingNode");
    nodo = document.querySelector('#nodo').value;
    collegato = document.querySelector('#collegato').value;
    peso = parseInt(document.querySelector('#peso').value);




    if (!grafo[nodo]) {
        grafo[nodo] = {};
        let option = document.createElement("option") ;
        option.textContent = nodo;
        document.querySelector("#StartingNode").append(option);
        document.querySelector("#EndNode").append(option.cloneNode(true));
    }
    grafo[nodo][collegato] = peso;
    if (!grafo[collegato]) {
        grafo[collegato] = {};
        let option = document.createElement("option");
        option.textContent = collegato;
        document.querySelector("#StartingNode").append(option);
        document.querySelector("#EndNode").append(option.cloneNode(true));
    }
    grafo[collegato][nodo] = peso;
    document.querySelector('#nodo').value = '';
    document.querySelector('#collegato').value = '';
    document.querySelector('#peso').value = '';
}



function showGraph() {
    let contenitore = document.querySelector('#grafo');
    if (contenitore) { // Verifica che l'elemento esista
        for (let nodo in grafo) {
            let elemento = document.createElement('p');
            //stampa del nodo

            contenitore.appendChild(elemento);
        }
    } else {
        console.error("L'elemento con l'ID 'grafo' non esiste nel documento HTML.");
    }
}

function stampaRisultato(percorso, distanza) {
    let outputDiv = document.querySelector('#output');
    let percorsoElement = document.createElement('p');
    percorsoElement.textContent = `Il percorso piu' breve e': ${percorso.join(' -> ')} con un peso totale di ${distanza}`;
    outputDiv.appendChild(percorsoElement);
}

async function runDijkstra() {
    let nodoPartenza = document.querySelector("#StartingNode").value;
    let nodoArrivo = document.querySelector("#EndNode").value;
    console.log(nodoPartenza, nodoArrivo);

// await serve per aspettare che la funzione Dijkstra finisca di funzionare prima di proseguire
    let { distanze, precedenti } = await Dijkstra(grafo, nodoPartenza);

    let percorso = [];
    let nodoCorrente = nodoArrivo;
    do {
        percorso.unshift(nodoCorrente);
        //prima di accederci controlla se esiste con hasOwnProperty
        nodoCorrente = precedenti.hasOwnProperty(nodoCorrente) ? precedenti[nodoCorrente] : 0;
    } while (nodoCorrente !== nodoPartenza);
    percorso.unshift(nodoPartenza);

    stampaRisultato(percorso, distanze[nodoArrivo]);
}

async function Dijkstra(grafo, nodoPartenza) {
    let distanze = {};
    let visitati = {};
    let precedenti = {};
    let corrente = nodoPartenza;

    for (let nodo in grafo) {
        distanze[nodo] = Infinity;
        visitati[nodo] = false;
    }
    distanze[nodoPartenza] = 0;
    visitati[nodoPartenza] = true;
    console.log(distanze, visitati)
    do {
        let tempCorrente = null;
        let tempDistanza = Infinity;
        for (let collegamento in grafo[corrente]) {
            console.log(collegamento, tempCorrente, tempDistanza);
            if (!visitati[collegamento] && grafo[collegamento][corrente] < tempDistanza) {
                tempCorrente = collegamento;
                tempDistanza = grafo[collegamento][corrente];
                precedenti[collegamento] = corrente;
                console.log(collegamento, tempCorrente, tempDistanza);
                console.log(visitati);
            }
        }
        corrente = tempCorrente;
        visitati[corrente] = true;
        console.log(corrente);
    } while (corrente != null);


    return { distanze, precedenti };
}

function mostraDistanze(distanze) {
    let contenitore = document.getElementById('grafo');
    if (contenitore) { // Verifica che l'elemento esista
        for (let nodo in distanze) {
            let elemento = document.createElement('p');
            elemento.textContent = `Distanza dall'inizio a ${nodo}: ${distanze[nodo]}`;
            contenitore.appendChild(elemento);
        }
    } else {
        console.error("L'elemento con l'ID 'grafo' non esiste nel documento HTML.");
    }
}

function mostraGrafo(grafo) {
    let contenitore = document.getElementById('grafo');
    if (contenitore) { // Verifica che l'elemento esista
        for (let nodo in grafo) {
            let elemento = document.createElement('p');
            elemento.textContent = `Nodo ${nodo}: ${Object.entries(grafo[nodo]).map(([vicino, distanza]) => `${vicino} (${distanza})`).join(', ')}`;
            contenitore.appendChild(elemento);
        }
    } else {
        console.error("L'elemento con l'ID 'grafo' non esiste nel documento HTML.");
    }
}
