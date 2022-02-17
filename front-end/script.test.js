const { it, expect } = require('@jest/globals')
const { describe } = require('yargs')

const { checarFormatacaoParaDinheiro, pegarPrimeiroNome,
        formatarParaDinheiro, formatarParaPorcentagem } = require('./script')

it('verificar se o nome Diego não é um valor monetário', () => {
  expect(checarFormatacaoParaDinheiro('Diego')).toStrictEqual({notificacao: true})
})

it('verificar se o valor 200,50 é um valor monetário', () => {
  expect(checarFormatacaoParaDinheiro('200,50')).toStrictEqual({notificacao: false, valor: '200.50'})
})

it('verificar se o valor 200,50.32 não é um valor monetário', () => {
  expect(checarFormatacaoParaDinheiro('200,50.32')).toStrictEqual({notificacao: true})
})

it('Pegar a palavra Teste da frase Teste para EQI Investimentos', () => {
  expect(pegarPrimeiroNome('Teste para EQI Investimentos')).toBe('Teste')
})

it('Pegar o valor 200,50 e passar para o formato monetário', () => {
  expect(formatarParaDinheiro('200,50')).toBe('R$ 200,50')
})

it('Pegar o valor 200 e passar para o formato de porcentagem', () => {
  expect(formatarParaPorcentagem('200')).toBe('200%')
})
