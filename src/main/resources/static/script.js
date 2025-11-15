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
                const item = document.createElement("li");
                item.textContent = `${c.nome} (${c.cor}) - ${c.poder}/${c.resistencia}`;
                lista.appendChild(item);
            });
        });
}

document.getElementById("cartaForm").addEventListener("submit", function (event) {
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
        });
});
