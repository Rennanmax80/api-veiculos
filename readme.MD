## API de cadastro de veículos

### Partes da API

- Cadstro de veículos (CRUD)

### Tecnologias

- Node + TypeScript
- Express
- Cors
- SQLite

### Como iniciar a aplicação

Para executar a aplicação na sua máquina é preciso que você já tenha instalado de forma local o Node + npm.

1. Após ter clonado o repositório, execute no terminal:

```console
npm install
```

2. Após concluir a instalação, execute no terminal:

```console
npm run dev
```

4. Abra no navegador: http://localhost:3000

#### Cadastro de veículos:

Foram cadastradas as rotas abaixo:
- veiculosController.listar
- veiculosController.buscarPorId
- veiculosController.criar
- veiculosController.atualizar
- veiculosController.atualizarParcial
- veiculosController.deletar

- veiculosController.contarNaoVendidos
- veiculosController.distribuicaoPorDecada
- veiculosController.distribuicaoPorMarca
- veiculosController.cadastradosUltimaSemana

#### Rotas protegidas
Estamos utilizando o CORS no endpoint 
