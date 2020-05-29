# Pré-requisitos

Este projeto está equipado com docker-compose, para utilizar instale-o.

Após clonar o projeto renomeie o arquivo **src/.env.example** para **src/.env** e adicione as suas credenciais de login.

# Execução

Feito isso o projeto estará pronto para rodar com `docker-compose down; docker-compose up --build --remove-orphans` na raiz do repositório clonado.

Dando tudo certo, o projeto estará rodando com com os outputs padrão do docker-compose e no fim da execução ele mostrará os objetos das legendas e quantas  foram encontradas.
