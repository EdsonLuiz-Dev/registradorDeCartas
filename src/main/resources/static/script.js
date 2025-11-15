const API_URL = "http://localhost:8080/cartas";

// Load all cards on page load
document.addEventListener("DOMContentLoaded", carregarCartas);

function carregarCartas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(cartas => {
            const lista = document.getElementById("listaCartas");
            lista.innerHTML = ""; // Limpa a lista antes de adicionar os itens

            cartas.forEach(c => {
                const item = document.createElement("li");
                item.textContent = `${c.nome} (${c.cor}) - ${c.poder}/${c.resistencia}`;
                
                // Adiciona o botão de editar
                const botaoEditar = document.createElement("button");
                botaoEditar.textContent = "Editar";
                botaoEditar.onclick = () => editarCarta(c); // Chama a função de edição

                // Adiciona o botão "Editar" à lista
                item.appendChild(botaoEditar);
                lista.appendChild(item);
            });
        });
}

// Função para preencher o formulário com os dados da carta selecionada para edição
function editarCarta(carta) {
    // Preenche os campos com os dados da carta
    document.getElementById("id").value = carta.id; // Preenche o ID da carta
    document.getElementById("nome").value = carta.nome;
    document.getElementById("cmc").value = carta.cmc;
    document.getElementById("cor").value = carta.cor;
    document.getElementById("tipo").value = carta.tipo;
    document.getElementById("texto").value = carta.texto;
    document.getElementById("poder").value = carta.poder;
    document.getElementById("resistencia").value = carta.resistencia;
    
    // Muda o texto do botão para "Editar Carta" (como está editando)
    const botao = document.querySelector('form button');
    botao.textContent = "Editar Carta";
}

// Evento para enviar o formulário (Cadastrar ou Editar)
document.getElementById("cartaForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Cria um objeto com os dados do formulário
    const carta = {
        nome: document.getElementById("nome").value,
        cmc: document.getElementById("cmc").value,
        cor: document.getElementById("cor").value,
        tipo: document.getElementById("tipo").value,
        texto: document.getElementById("texto").value,
        poder: parseInt(document.getElementById("poder").value),
        resistencia: parseInt(document.getElementById("resistencia").value)
    };

    const id = document.getElementById("id").value; // Pega o ID da carta (se estiver editando)

    if (id) {
        // Se o ID estiver preenchido, significa que estamos editando a carta
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carta)
        })
        .then(response => response.json())
        .then(() => {
            alert("Carta atualizada!");
            carregarCartas(); // Recarregar a lista de cartas
            document.getElementById("cartaForm").reset(); // Limpar o formulário
            document.querySelector('form button').textContent = "Cadastrar Carta"; // Voltar ao estado original do botão
        })
        .catch(error => alert("Erro ao editar a carta: " + error));
    } else {
        // Se o ID não estiver preenchido, significa que estamos criando uma nova carta
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(carta)
        })
        .then(() => {
            alert("Carta registrada!");
            carregarCartas(); // Recarregar a lista de cartas
            document.getElementById("cartaForm").reset(); // Limpar o formulário
        })
        .catch(error => alert("Erro ao cadastrar a carta: " + error));
    }
});
