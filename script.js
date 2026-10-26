Script 
const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const filtroCidade = document.getElementById('filtroCidade')
 
const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
 
let todasCidades = []
 
function carregarEstados() {
    fetch(URL_ESTADOS)
        .then(resposta => resposta.json())
        .then(estados => {
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>'
 
            estados.forEach(estado => {
                const option = document.createElement('option')
                option.value = estado.sigla
                option.textContent = estado.nome
                selectEstado.appendChild(option)
            })
        })
}
 
function preencherSelectCidades(cidades) {
    selectCidade.innerHTML = '<option value="">Selecione a cidade</option>'
 
    cidades.forEach(cidade => {
        const option = document.createElement('option')
        option.value = cidade.nome
        option.textContent = cidade.nome
        selectCidade.appendChild(option)
    })
}
 
selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value
 
    filtroCidade.value = ''
    filtroCidade.disabled = true
    qtdCidades.textContent = ''
 
    if (uf === '') {
        selectCidade.innerHTML = '<option value="">Escolha um estado primeiro</option>'
        selectCidade.disabled = true
        return
    }
 
    selectCidade.innerHTML = '<option value="">Carregando...</option>'
    selectCidade.disabled = true
 
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(resposta => resposta.json())
        .then(cidades => {
            todasCidades = cidades
            preencherSelectCidades(cidades)
            selectCidade.disabled = false
            filtroCidade.disabled = false
            qtdCidades.textContent = `O estado selecionado tem ${cidades.length} cidades.`
        })
})
 
filtroCidade.addEventListener('input', () => {
    const texto = filtroCidade.value.toLowerCase()
    const cidadesFiltradas = todasCidades.filter(cidade =>
        cidade.nome.toLowerCase().includes(texto)
    )
    preencherSelectCidades(cidadesFiltradas)
})
 
document.getElementById('formInscricao').addEventListener('submit', (evento) => {
    evento.preventDefault()
 
    const nome = document.getElementById('nome').value
    const uf = selectEstado.value
    const cidade = selectCidade.value
 
    document.getElementById('resumo').textContent =
        `${nome}, de ${cidade}/${uf}, inscrito com sucesso`
})
 
carregarEstados()
 
