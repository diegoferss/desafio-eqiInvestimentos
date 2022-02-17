// Dados e Manipulação dos dados da aplicação

const dadosDaAplicacao = {
  rendimento: '',
  aptInicial: '',
  prazo: '',
  ipca: '',
  taxaDeIndex: '',
  aptMensal: '',
  rentabilidade: '',
  cdi: ''
}

const preencherDadosComBancoDeDadosLocal = dadoIpcaCdi => {
  const ipca = document.getElementById("ipca")
  const cdi = document.getElementById("cdi")
  dadosDaAplicacao.cdi = dadoIpcaCdi[0].valor
  dadosDaAplicacao.ipca = dadoIpcaCdi[1].valor
  cdi.value = formatarParaPorcentagem(dadoIpcaCdi[0].valor)
  ipca.value = formatarParaPorcentagem(dadoIpcaCdi[1].valor)
}

const limparDados = () => {
  const inputs = document.getElementsByTagName("input")
  const buttons = document.getElementsByTagName("button")
  for(let i in inputs) {
    if(!inputs[i].disabled)
      inputs[i].value = ""
  }
  for(let i in buttons) {
    if(buttons[i].name != 'simular' && buttons[i].innerText) {
      buttons[i].style.backgroundColor = "transparent"
      if(buttons[i].name != 'limpar')
        botaoNaoSelecionado(buttons[i])
    }
  }
}

async function pegarDadosDoBancoDeDadosLocal() {
  const response = await fetch('http://localhost:3000/indicadores?nome=cdi&nome=ipca')
  const dadoIpcaCdi = await response.json()
  preencherDadosComBancoDeDadosLocal(dadoIpcaCdi)
}

pegarDadosDoBancoDeDadosLocal()

// Realizar alguma ação na tela

const testarSeOsDadosEstaoCompletos = () => {
  let control = false
  for(let i in dadosDaAplicacao) {
    if(dadosDaAplicacao[i] == '')
      control = true
  }
  return control
}

const simularInvestimento = () => {
  const control = testarSeOsDadosEstaoCompletos()
  if(control) {
    window.alert('Preencha todos os dados, por favor.') 
  }else {
    const tipoRendimento = dadosDaAplicacao.rendimento
    const tipoDeIndexacaoLocal = dadosDaAplicacao.taxaDeIndex
    const tipoIndexacao = tipoDeIndexacaoLocal == 'fixado' ? 'ipca' : tipoDeIndexacaoLocal
    fetch(`http://localhost:3000/simulacoes?tipoIndexacao=${tipoIndexacao}&tipoRendimento=${tipoRendimento}`)
      .then(res => res.json())
      .then(data => {
        adicionarCards(data[0])
        adicionarGrafico(data[0].graficoValores)
      })
    const elementoSimulacao = document.getElementsByClassName("principal__conteudo--resultado")[0]
    elementoSimulacao.style.opacity = "1"
  }
}

const criarNotificacao = (descricao, input, notificacao) => {
  descricao.style.color = 'red'
  notificacao.style.color = "red"
  input.style.borderColor = 'red'
}

const desativarNotificacao = (descricao, input, notificacao) => {
  descricao.style.color = 'black'
  notificacao.style.color = 'transparent'
  input.style.borderColor = 'black'
}

const verificarSePodeSimular = () => {
  const botaoSimulacao = document.getElementsByName('simular')[0]
  const control = testarSeOsDadosEstaoCompletos()
  if(control) {
    botaoSimulacao.style.backgroundColor = 'gray'
  }else {
    botaoSimulacao.style.backgroundColor = 'orange'
  }
}

// Criação dinamica de Gráficos e Cards usando js

const adicionarClasseParaLinhaDoGrafico = (divContainer, divComAporte, divSemAporte) => {
  divContainer.classList.add("principal__conteudo__grafico__container__celulas__celula")
  divComAporte.classList.add("principal__conteudo__grafico__container__celulas__celula__cAporte")
  divSemAporte.classList.add("principal__conteudo__grafico__container__celulas__celula__sAporte")
}

const adicionarFilhosParaCriarLinha = (divContainer, divComAporte, divSemAporte, pTempo) => {
  divContainer.appendChild(divComAporte)
  divContainer.appendChild(divSemAporte)
  divContainer.appendChild(pTempo)
}

const adicionarEstiloParaLinhaDoGrafico = (divContainer, divComAporte, divSemAporte, altComApt, altSemApt) => {
  adicionarClasseParaLinhaDoGrafico(divContainer, divComAporte, divSemAporte)
  divComAporte.style.height = `${altComApt}px`
  divSemAporte.style.height = `${altSemApt}px`
}

const criarLinhaDoGrafico = (mes, altComApt, altSemApt) => {
  const divContainer = document.createElement("div")
  const divComAporte = document.createElement("div")
  const divSemAporte = document.createElement("div")
  const pTempo = document.createTextNode(`${mes}`)
  adicionarEstiloParaLinhaDoGrafico(divContainer, divComAporte, divSemAporte, altComApt, altSemApt)
  adicionarFilhosParaCriarLinha(divContainer, divComAporte, divSemAporte, pTempo)
  return divContainer
}

const adicionarGrafico = comAporteSemAporte => {
  const divPrincipal = document.getElementsByClassName("principal__conteudo__grafico__container__grafico")[0]
  divPrincipal.innerHTML = ""
  const quantidadeDeMeses = Object.keys(comAporteSemAporte.comAporte).length 
  let somaDosValoresComAporte = 0
  for(let i in comAporteSemAporte.comAporte) {
    somaDosValoresComAporte+=comAporteSemAporte.comAporte[i]
  }
  const mediaDosValoresComAporte = somaDosValoresComAporte / quantidadeDeMeses
  let pegarApenasOsDoisPrimeirosNumeros = false
  if(mediaDosValoresComAporte > 100)
    pegarApenasOsDoisPrimeirosNumeros = true

  let alturaComAporte = 0
  let alturaSemAporte = 0
  let mes = 0
  for(let i = 0; i < quantidadeDeMeses; i++) {
    if(pegarApenasOsDoisPrimeirosNumeros) {
      alturaComAporte = comAporteSemAporte.comAporte[i].toString().substring(0, 3) / 1.3
      alturaSemAporte = comAporteSemAporte.semAporte[i].toString().substring(0, 3) / 3
    }
    else { 
      alturaComAporte = comAporteSemAporte.comAporte[i]
      alturaSemAporte = comAporteSemAporte.semAporte[i]
    }
    mes = i + 1
    divPrincipal.appendChild(criarLinhaDoGrafico(mes, alturaComAporte, alturaSemAporte))
  }
}


const adicionarEstiloAoCard = (divContainer, pDescricao, pValor) => {
  divContainer.classList.add("principal__conteudo__valores__container__card")
  pDescricao.classList.add("principal__conteudo__valores__container__card__tipo")
  pValor.classList.add("principal__conteudo__valores__container__card__valor")
}

const criarCard = valor => {
  const divContainer = document.createElement("div")
  const pDescricao = document.createElement("p")
  const pValor = document.createElement("p")
  pDescricao.innerText = valor.nome
  pValor.innerText =  (valor.valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  if(valor.cor) {
    pValor.style.color = valor.cor
    pValor.style.fontWeight = '650'
  }
  adicionarEstiloAoCard(divContainer, pDescricao, pValor)
  divContainer.appendChild(pDescricao)
  divContainer.appendChild(pValor)
  return divContainer
}

const adicionarCards = cards => {
  const divPrincipal = document.getElementsByClassName("principal__conteudo__item__container")[0]
  divPrincipal.innerHTML = ""
  const nomesComValores = {
    valorFinalBruto: { nome: 'Valor Final Bruto', valor: cards.valorFinalBruto },
    aliquotaIR: { nome: 'Aliquota do IR', valor: cards.aliquotaIR },
    valorPagoIR: { nome: 'Valor Pago em IR', valor: cards.valorPagoIR },
    valorFinalLiquido: { nome: 'Valor Final Liquido', valor: cards.valorFinalLiquido, cor: 'rgb(0, 149, 0)' },
    valorTotalInvestido: { nome: 'Valor Total Investido', valor: cards.valorTotalInvestido },
    ganhoLiquido: { nome: 'Ganho Liquido', valor: cards.ganhoLiquido, cor: 'rgb(0, 149, 0)' }
  }
  for(let i in nomesComValores) {
    divPrincipal.appendChild(criarCard(nomesComValores[i]))
  }
}

// Validar dados do formulário

const checarFormatacaoParaDinheiro = valor => {
  if(valor.length == 0)
    return { notificacao: false }
  const posicaoDaVirgula = valor.indexOf(',')
  const posicaoDoUltimoPonto = valor.lastIndexOf('.')
  let pontoDepoisDaVirgula = posicaoDaVirgula >= posicaoDoUltimoPonto
  valor = valor.replace(/[._]/g,'');
  const quantidadeDeVirgulas = valor.split('').filter(a => a == ',').length
  if(quantidadeDeVirgulas == 0)
    pontoDepoisDaVirgula = true
  if(quantidadeDeVirgulas <= 1 && pontoDepoisDaVirgula) {
    valor = valor.replace(',','.')
    if(!isNaN(valor)) {
      return { notificacao: false, valor }
    }else {
      return { notificacao: true }
    }
  }else {
    return { notificacao: true }
  }
} 

const validarMeses = id => {
  const containerInput = document.getElementsByClassName('principal__conteudo__container__inputs__input')[id]
  const { elementoDescricao, elementoInput, elementoNotificacao } = buscarElementos(containerInput)
  const value = elementoInput.value
  dadosDaAplicacao.prazo = ''
  verificarSePodeSimular()
  if(isNaN(value)) {
    criarNotificacao(elementoDescricao, elementoInput, elementoNotificacao)
  }else {
    desativarNotificacao(elementoDescricao, elementoInput, elementoNotificacao)
    dadosDaAplicacao.prazo = value
    verificarSePodeSimular()
  }
}

const validarRentabilidade = (id, target) => {
  const containerInput = document.getElementsByClassName('principal__conteudo__container__inputs__input')[id]
  const { elementoDescricao, elementoInput, elementoNotificacao } = buscarElementos(containerInput)
  dadosDaAplicacao.rentabilidade = ''
  verificarSePodeSimular()
  const value = elementoInput.value
  if(isNaN(value)) {
    criarNotificacao(elementoDescricao, elementoInput, elementoNotificacao)
  }else {
    desativarNotificacao(elementoDescricao, elementoInput, elementoNotificacao)
    dadosDaAplicacao.rentabilidade = value
    formatarParaUmValor(value, formatarParaPorcentagem, elementoInput, target)
    verificarSePodeSimular()
  }
}

const validarInputDoTipoMonetario = (id, target = "", tipoAporte) => {
  const containerInput = document.getElementsByClassName('principal__conteudo__container__inputs__input')[id]
  const { elementoDescricao, elementoInput, elementoNotificacao } = buscarElementos(containerInput)
  dadosDaAplicacao[tipoAporte] = ''
  verificarSePodeSimular()
  const value = elementoInput.value
  const valorFormatadoComNotificacao = checarFormatacaoParaDinheiro(value)
  if(valorFormatadoComNotificacao.notificacao) {
    criarNotificacao(elementoDescricao, elementoInput, elementoNotificacao)
  }else {
    desativarNotificacao(elementoDescricao, elementoInput, elementoNotificacao)
    dadosDaAplicacao[tipoAporte] = value
    formatarParaUmValor(value, formatarParaDinheiro, elementoInput, target)
    verificarSePodeSimular()
  }
}

const botaoNaoSelecionado = elemento => {
  elemento.style.backgroundColor = "transparent"
  elemento.classList.remove('principal__conteudo__container__inputs__button__botao--clicado')
}

const botaoSelecionado = (id, name, valores) => {
  const elementoInput = document.getElementsByName(name)
  elementoInput.forEach((element, index) => {
    if(index != id) {
      botaoNaoSelecionado(element)
    }
  })
  const elementoAtual = elementoInput[id]
  if(elementoAtual.style.backgroundColor == "orange") {
    botaoNaoSelecionado(elementoAtual)
    dadosDaAplicacao[name] = ''
  }
  else { 
    dadosDaAplicacao[name] = valores[id] 
    elementoAtual.style.backgroundColor = "orange" 
    elementoAtual.classList.add('principal__conteudo__container__inputs__button__botao--clicado')
  }
  verificarSePodeSimular()
}

// Pegar valores para demonstrar ao usuário para possíveis modificações

const pegarPrimeiroNome = valor => valor.split(' ')[0]

const pegarValor = (id) => {
  const elementoInput = document.getElementsByTagName("input")[id]
  const value = elementoInput.value
  if(value.includes("R$")) {
    elementoInput.value = value.replace("R$ ", "")
  }
}

const pegarRentabilidade = (id) => {
  const elementoInput = document.getElementsByTagName("input")[id]
  const value = elementoInput.value
  if(value.includes("%")) {
    elementoInput.value = value.replace("%", "")
  }
}

const buscarElementos = divContainer => {
  return {
    elementoDescricao: divContainer.children[0],
    elementoInput: divContainer.children[1],
    elementoNotificacao: divContainer.children[2]
  }
}

// Formação de valores

const formatarParaUmValor = (valor, formatar, elemento, target) => {
  if(target == 'resultado' && valor.length > 0) {
    elemento.value = formatar(valor)
  }
}

const formatarParaDinheiro = valor => `R$ ${valor}`

const formatarParaPorcentagem = valor => `${valor}%`

// Funções testadas com testes unitários usando jest

module.exports =  {
  checarFormatacaoParaDinheiro, 
  pegarPrimeiroNome, 
  formatarParaDinheiro,
  formatarParaPorcentagem 
}