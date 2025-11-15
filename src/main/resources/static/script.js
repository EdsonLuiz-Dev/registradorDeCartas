const API_URL = "http://localhost:8080/cartas";

document.addEventListener("DOMContentLoaded", carregarCartas);

function carregarCartas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(cartas => {
            const lista = document.getElementById("listaCartas");
            lista.innerHTML = "";

            cartas.forEach(c => {
                const btn = document.createElement("button");
                btn.textContent = `${c.nome} (${c.cor}) - ${c.poder}/${c.resistencia}`;
                btn.classList.add("card-button");

                btn.addEventListener("click", () => mostrarCarta(c));

                lista.appendChild(btn);
            });
        })
        .catch(err => console.error("Erro ao carregar cartas:", err));
}

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

    document.getElementById("id").value = carta.id;
    document.getElementById("nome").value = carta.nome;
    document.getElementById("cmc").value = carta.cmc;
    document.getElementById("cor").value = carta.cor;
    document.getElementById("tipo").value = carta.tipo;
    document.getElementById("texto").value = carta.texto;
    document.getElementById("poder").value = carta.poder;
    document.getElementById("resistencia").value = carta.resistencia;

    const btn = document.querySelector("button[type='submit']");
    btn.textContent = "Editar Carta";
    btn.onclick = (event) => {
        event.preventDefault();
        editarCarta(carta.id, container);
    };
}

function editarCarta(id, container) {
    const cartaAtualizada = {
        nome: document.getElementById("nome").value,
        cmc: document.getElementById("cmc").value,
        cor: document.getElementById("cor").value,
        tipo: document.getElementById("tipo").value,
        texto: document.getElementById("texto").value,
        poder: parseInt(document.getElementById("poder").value),
        resistencia: parseInt(document.getElementById("resistencia").value)
    };

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartaAtualizada)
    })
    .then(() => {
        alert("Carta atualizada com sucesso!");
        mostrarCarta(cartaAtualizada);
        document.getElementById("cartaForm").reset();
        carregarCartas();
    })
    .catch(err => console.error("Erro ao editar carta:", err));
}

document.getElementById("buscarNome").addEventListener("input", buscarCartaPorNome);

function buscarCartaPorNome() {
    const nomeBusca = document.getElementById("buscarNome").value.toLowerCase().trim();
    
    if (!nomeBusca) {
        carregarCartas();
        return;
    }

    fetch(`${API_URL}/buscar?nome=${nomeBusca}`)
        .then(res => res.json())
        .then(cartas => {
            const lista = document.getElementById("listaCartas");
            lista.innerHTML = "";

            if (cartas.length > 0) {
                cartas.forEach(c => {
                    const btn = document.createElement("button");
                    btn.textContent = `${c.nome} (${c.cor}) - ${c.poder}/${c.resistencia}`;
                    btn.classList.add("card-button");

                    btn.addEventListener("click", () => mostrarCarta(c));

                    lista.appendChild(btn);
                });
            } else {
                lista.innerHTML = "<p>Nenhuma carta encontrada.</p>";
            }
        })
        .catch(err => console.error("Erro ao buscar cartas:", err));
}

document.getElementById("cartaForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;
    if (id) {
        editarCarta(id);
    } else {
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
    }
});
