document.addEventListener("DOMContentLoaded", function() {
    const API_URL = "http://localhost:8080/cartas";
    const form = document.getElementById("cartaForm");
    const submitBtn = form.querySelector("button[type='submit']");

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remover Carta";
    removeBtn.style.display = "none";
    removeBtn.style.marginLeft = "10px";
    form.appendChild(removeBtn);

    carregarCartas();

    function carregarCartas() {
        fetch(API_URL)
            .then(res => res.json())
            .then(cartas => renderLista(cartas))
            .catch(err => console.error("Erro ao carregar cartas:", err));
    }

    function renderLista(cartas) {
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

        form.id.value = carta.id;
        form.nome.value = carta.nome;
        form.cmc.value = carta.cmc;
        form.cor.value = carta.cor;
        form.tipo.value = carta.tipo;
        form.texto.value = carta.texto;
        form.poder.value = carta.poder;
        form.resistencia.value = carta.resistencia;

        submitBtn.textContent = "Editar Carta";
        removeBtn.style.display = "inline-block";
    }

    function limparFormulario() {
        form.reset();
        form.id.value = "";
        document.getElementById("card-container").innerHTML = "";
        submitBtn.textContent = "Cadastrar Carta";
        removeBtn.style.display = "none";
    }

    function editarCarta(id) {
        const cartaAtualizada = {
            nome: form.nome.value,
            cmc: form.cmc.value,
            cor: form.cor.value,
            tipo: form.tipo.value,
            texto: form.texto.value,
            poder: parseInt(form.poder.value),
            resistencia: parseInt(form.resistencia.value)
        };

        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartaAtualizada)
        })
        .then(() => {
            alert("Carta atualizada com sucesso!");
            limparFormulario();
            carregarCartas();
        })
        .catch(err => console.error("Erro ao editar carta:", err));
    }

    removeBtn.addEventListener("click", function() {
        const id = form.id.value;
        if (!id) return;

        if (confirm("Tem certeza que deseja remover esta carta?")) {
            fetch(`${API_URL}/${id}`, { method: "DELETE" })
                .then(() => {
                    alert("Carta removida com sucesso!");
                    limparFormulario();
                    carregarCartas();
                })
                .catch(err => console.error("Erro ao remover carta:", err));
        }
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const id = form.id.value;

        if (id) {
            editarCarta(id);
        } else {
            const novaCarta = {
                nome: form.nome.value,
                cmc: form.cmc.value,
                cor: form.cor.value,
                tipo: form.tipo.value,
                texto: form.texto.value,
                poder: parseInt(form.poder.value),
                resistencia: parseInt(form.resistencia.value)
            };

            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaCarta)
            })
            .then(() => {
                alert("Carta registrada!");
                limparFormulario();
                carregarCartas();
            })
            .catch(err => console.error("Erro ao cadastrar carta:", err));
        }
    });

    document.getElementById("buscarNome").addEventListener("input", function() {
        const nomeBusca = this.value.toLowerCase().trim();

        if (!nomeBusca) {
            carregarCartas();
            return;
        }

        fetch(`${API_URL}/buscar?nome=${nomeBusca}`)
            .then(res => res.json())
            .then(cartas => renderLista(cartas))
            .catch(err => console.error("Erro ao buscar cartas:", err));
    });

    document.addEventListener("click", function(e) {
        const container = document.getElementById("card-container");
        const lista = document.getElementById("listaCartas");
        if (!container.contains(e.target) && !lista.contains(e.target) && !form.contains(e.target)) {
            limparFormulario();
        }
    });
});
