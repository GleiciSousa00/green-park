# Projeto de Upload de Arquivos

Este projeto é uma aplicação Node.js que permite o upload de arquivos CSV e PDF e processa esses arquivos para extrair informações relevantes. A aplicação utiliza o framework Express para criar rotas HTTP e o pacote Multer para lidar com o upload de arquivos.

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

```npm install```

## Uso

Para iniciar a aplicação, execute o seguinte comando:

```npm start```


Isso iniciará o servidor na porta 3000. Você pode acessar a aplicação em `http://localhost:3000`.

A aplicação possui as seguintes rotas:

- `GET /`: Retorna uma mensagem de boas-vindas.
- `POST /import-boletos-csv`: Faz o upload de um arquivo CSV contendo informações de boletos e processa o arquivo para extrair as informações e salvar.
- `POST /import-boletos-pdf`: Faz o upload de um arquivo PDF contendo informações de boletos e processa o arquivo para extrair as informações relevantes e gerar um relatório.
- `GET /boletos`: Retorna uma lista de boletos processados.

Para fazer o upload de um arquivo, envie uma requisição POST para a rota correspondente com um campo de formulário `file` contendo o arquivo a ser enviado.



