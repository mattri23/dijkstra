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
    nodo = document.querySelector('#nodo').value;
    collegato = document.querySelector('#collegato').value;
    peso = parseInt(document.querySelector('#peso').value);
    if (!grafo[nodo]) {
        grafo[nodo] = {};
    }
    grafo[nodo][collegato] = peso;
    if (!grafo[collegato]) {
        grafo[collegato] = {};
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
function runDijkstra() {
    let nodoPartenza = document.querySelector("#StartingNode").value;
    let nodoArrivo = document.querySelector("#EndNode").value;

    // Verifica se il nodo di partenza e il nodo di arrivo esistono
    if (!grafo[nodoPartenza] || !grafo[nodoArrivo]) {
        alert('Il nodo di partenza o il nodo di arrivo non esistono nel grafo.');
        return;
    }

    let { distanze, precedenti } = Dijkstra(grafo, nodoPartenza);

    let percorso = [];
    let nodoCorrente = nodoArrivo;
    do {
        percorso.unshift(nodoCorrente);
        nodoCorrente = precedenti[nodoCorrente] !== undefined ? precedenti[nodoCorrente] : 0;
    } while (nodoCorrente !== nodoPartenza);
    percorso.unshift(nodoPartenza);

    let outputDiv = document.querySelector('#output');
    let percorsoElement = document.createElement('p');
    percorsoElement.textContent = `Il percorso piu' breve da  ${nodoPartenza}  a  ${nodoArrivo}  e':  ${percorso.join(' -> ')} con un peso totale di  ${distanze[nodoArrivo]}`;
    outputDiv.appendChild(percorsoElement);
}

function nodoDistanzaMinima(distanze, visitati) {
    return Object.keys(distanze).reduce((minNodo, nodo) => (!visitati[nodo] && distanze[nodo] < distanze[minNodo] ? nodo : minNodo));
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