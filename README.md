# Desafio front-end da EQI Investimentos

## Participante

- Diego F. S. Souza

## Resumo

Esse README representa as propriedades funcionais da aplicação front-end do desafio da EQI Investimentos, que tem por foco proporcionar um método rápido e fácil de simular investimentos para usuários que tem interesse na área, mas não tem muito conhecimento.

## Requisitos funcionais

- **RF1.** O sistema deve permitir que um usuário possa escolher um tipo de rendimento e taxa de indexação;
- **RF2.** O sistema deve permitir que um usuário possa colocar o seu aporte inicial, aporte mensal, o prazo do investimento e a rentabilidade;
- **RF3.** O sistema deve permitir que um usuário possa limpar os campos para efetuar uma nova simulação;
- **RF4.** O sistema deve permitir que um usuário possa simular o investimento desde que todos os dados estejam preenchidos;
- **RF5.** O sistema deve ser capaz de renderizar os valores que o usuário irá obter com o investimento;
- **RF6.** O sistema deve ser capaz de renderizar um gráfico que demonstre as vantagens de investir com um aporte.

## Ferramentas utilizadas

- **Jest:** Utilizei essa ferramenta para a realização de testes unitários que verificam se a validação de dados está ocorrendo de acordo com o esperado.
- **Extensão live server do vscode:** Utilizei essa ferramenta para ter um servidor web, possibilitando assim uma atualização em tempo real no front-end caso eu alterasse alguma coisa no código, agilizando assim o meu trabalho.

## Como executar a aplicação

Faça o clone/download deste repositório

- **Executando a api-fake:** Entre no diretório ```desafio-api-fake-main``` e execute o comando ```npm install``` e ```npx json-server db.json```.
- **Executando a aplicação front-end:** Após executar a ```api-fake```, entre no diretório ```front-end``` e abra o arquivo ```index.html``` em um navegador ou abra utilizando a extensão ```live server``` do ```vscode```.
- **Executando os testes unitários:** Entre no diretório ```front-end``` e execute o comando ```npm install```. Após isso, no terminal execute o comando ```npm t```.
