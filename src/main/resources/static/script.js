const API_URL = "http://localhost:8080/cartas";

// Load all cards on page load
document.addEventListener("DOMContentLoaded", carregarCartas);

function carregarCartas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(cartas => {
            const lista = document.getElementById("listaCartas");
            lista.innerHTML = "";

            cartas.forEach(c => {
                // Create a button instead of li
                const btn = document.createElement("button");
                btn.textContent = `${c.nome} (${c.cor}) - ${c.poder}/${c.resistencia}`;
                btn.classList.add("card-button");

                // Add click event to show card details
                btn.addEventListener("click", () => mostrarCarta(c));

                lista.appendChild(btn);
            });
        })
        .catch(err => console.error("Erro ao carregar cartas:", err));
}

// Function to show card info in card-container
function mostrarCarta(carta) {
    const container = document.getElementById("card-container");
    container.innerHTML = `
        <div class="card">
            <h3>${carta.nome}</h3>
            <p><strong>CMC:</strong> ${carta.cmc}</p>
            <p><strong>Cor:</strong> ${carta.cor}</p>
            <p><strong>Tipo:</strong> ${carta.tipo}</p>
            <p><strong>Texto:</strong> ${carta.texto}</p>
            <p><strong>Poder/Resistência:</strong> ${carta.poder}/${carta.resistencia}</p>
        </div>
    `;
}

// Handle form submission
document.getElementById("cartaForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const novaCarta = {
        nome: document.getElementById("nome").value,
        cmc: document.getElementById("cmc").value,
        cor: document.getElementById("cor").value,
        tipo: document.getElementById("tipo").value,
        texto: document.getElementById("texto").value,
        poder: parseInt(document.getElementById("poder").value),
        resistencia: parseInt(document.getElementById("resistencia").value)
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCarta)
    })
    .then(() => {
        alert("Carta registrada!");
        this.reset();
        carregarCartas();
    })
    .catch(err => console.error("Erro ao cadastrar carta:", err));
});
