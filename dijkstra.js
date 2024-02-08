


/** Autore: Aspesi Mattia.
 *  Progetto: Dijkstra Algorithm**/



// inizializzazione delle variabili
let nodo;
let collegato;
let peso;
let grafo = {};




// Aggiunta di tutti gli eventi
document.addEventListener('DOMContentLoaded', (event) => {

    // Bottone per aggiungere un nodo
    let buttonAddNode = document.querySelector('#addNode');
    createGraphVisualization();
    buttonAddNode.addEventListener('click', function() {
        addNode();
        createGraphVisualization();
    });

    // Bottone per eseguire l'algoritmo di Dijkstra
    let buttonRunDijkstra = document.querySelector('#buttonRunDijkstra');
    buttonRunDijkstra.addEventListener('click', function() {
        runDijkstra();
    });

});




// Funzione per aggiungere un nodo al grafo
function addNode() {
    let selectStart = document.querySelector("#StartingNode");
    nodo = document.querySelector('#nodo').value.toUpperCase();
    collegato = document.querySelector('#collegato').value.toUpperCase();
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



// Funzione per stampare il risultato dell'algoritmo di Dijkstra
// ovvero il percorso piu' breve e la distanza totale
function stampaRisultato(percorso, distanza) {
    let outputDiv = document.querySelector('#output');

    while (outputDiv.firstChild) {
        outputDiv.removeChild(outputDiv.firstChild);
    }

    let percorsoElement = document.createElement('p');
    percorsoElement.textContent = `Il percorso piu' breve e': ${percorso.join(' -> ')} con un peso totale di ${distanza}`;
    outputDiv.appendChild(percorsoElement);
}



// Funzione per la chiamata dell'algoritmo di Dijkstra

async function runDijkstra() {
    let nodoPartenza = document.querySelector("#StartingNode").value;
    let nodoArrivo = document.querySelector("#EndNode").value;
    console.log(nodoPartenza, nodoArrivo);

    if (nodoPartenza === nodoArrivo) {
        return;
    }

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







// Funzione per eseguire l'algoritmo di Dijkstra
// Restituisce un oggetto con le distanze e i nodi precedenti

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

    do {
        let tempCorrente = null;
        let tempDistanza = Infinity;
        for (let collegamento in grafo[corrente]) {
            let distanzaPotenziale = distanze[corrente] + grafo[corrente][collegamento];
            if (!visitati[collegamento] && distanzaPotenziale < distanze[collegamento]) {
                distanze[collegamento] = distanzaPotenziale;
                precedenti[collegamento] = corrente;
                if (distanzaPotenziale < tempDistanza) {
                    tempCorrente = collegamento;
                    tempDistanza = distanzaPotenziale;
                }
            }
        }
        corrente = tempCorrente;
        if (corrente != null) {
            visitati[corrente] = true;
        }
    } while (corrente != null);

    return { distanze, precedenti };
}






// Funzione per creare la visualizzazione del grafo
// Utilizza la libreria D3.js per creare un grafo forza-diretta


function createGraphVisualization() {

    // Seleziona l'elemento SVG esistente e rimuovi tutti i suoi figli
    let svgContainer = d3.select("#grafo");
    svgContainer.selectAll("*").remove();

    // Crea un nuovo elemento SVG
    let svg;

    svg = d3.select("#grafo")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400);

    let nodes = Object.keys(grafo).map((nodo) => ({ id: nodo }));
    let links = [];
    for (let nodo in grafo) {
        for (let collegato in grafo[nodo]) {
            links.push({
                source: nodo,
                target: collegato,
                peso: grafo[nodo][collegato]
            });
        }
    }

    let simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d) => d.id))
        .force("charge", d3.forceManyBody().strength(-1000)) // Aumenta la forza di carica
        .force("center", d3.forceCenter(600 / 2, 400 / 2)) // Centra il grafo nello spazio SVG
        .force("box", forceBoundedBox().bounds([[0, 0], [600, 400]])); // Contiene i nodi all'interno dello spazio SVG


    let link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .style("stroke", "#575761");

    let node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 20)
        .style("fill", "#FEE715")
        .style("stroke", "#171A21") // Colore del contorno
        .style("stroke-width", 1.5);

    let nodeLabel = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .text((d) => d.id)
        .style("text-anchor", "middle")
        .style("fill", "#171A21")
        .style("font-family", "Arial")
        .style("font-size", 12);

    let linkLabel = svg.append("g")
        .selectAll("text")
        .data(links)
        .enter().append("text")
        .text((d) => d.peso)
        .style("fill", "#171A21")
        .style("font-family", "Arial")
        .style("font-size", 12);

    simulation.on("tick", () => {
        link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

        node
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y);

        nodeLabel
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y + 5); // Posiziona l'etichetta un po' sopra il nodo


        linkLabel
            .attr("x", (d) => (d.source.x + d.target.x) / 2)
            .attr("y", (d) => (d.source.y + d.target.y) / 2 - 5) // Sottrai un offset alla posizione y
            .attr("transform", function(d) {
                let angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180 / Math.PI;
                let midPoint = [(d.source.x + d.target.x) / 2, (d.source.y + d.target.y) / 2];
                return `translate(${midPoint[0]}, ${midPoint[1]}) rotate(${angle}) translate(-${midPoint[0]}, -${midPoint[1]})`;
            });
    });






    //funzioni per spostare i nodi

    let drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        simulation.start();
        d.fx = d.x;
        d.fy = d.y;
        simulation.stop();
    }

    function dragged(d) {
        // Aggiorna solo il punto di inizio del collegamento per il nodo trascinato
        links.forEach((link) => {
            if (link.source.id === d.id) {
                link.source.x = d3.event.x;
                link.source.y = d3.event.y;
            }
        });

        // Aggiorna la posizione del nodo trascinato
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
        }
    }

// Applica la funzione di trascinamento ai nodi
    node.call(drag);

// Applica la funzione di trascinamento ai nodi
    node.call(drag);





    // Funzione per contenere i nodi all'interno del box

    function forceBoundedBox() {
        let nodes, sizes
        let bounds = [[0, 0], [600, 400]] // Default bounds

        function force() {
            let node, size
            let xi, x0, x1, yi, y0, y1
            for (let i = 0, n = nodes.length; i < n; ++i) {
                node = nodes[i]
                size = sizes[i]
                xi = node.x || 0
                x0 = bounds[0][0] + size[0] / 2
                x1 = bounds[1][0] - size[0] / 2
                yi = node.y || 0
                y0 = bounds[0][1] + size[1] / 2
                y1 = bounds[1][1] - size[1] / 2
                if (xi < x0 || xi > x1) {
                    node.vx -= xi - Math.max(x0, Math.min(x1, xi))
                }
                if (yi < y0 || yi > y1) {
                    node.vy -= yi - Math.max(y0, Math.min(y1, yi))
                }
            }
        }

        force.initialize = function(_) {
            sizes = (nodes = _).map((d) => [d.r * 2, d.r * 2])
        }

        force.bounds = function(_) {
            return arguments.length ? ((bounds = _), force) : bounds
        }

        return force
    }

}