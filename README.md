# 🛍️ Catálogo Digital — Cliente

Vitrine pública da Sempre-Viva, em Gravatá, Pernambuco. A cliente consulta peças, preços, tamanhos e cores e envia a sacola pelo WhatsApp. Este repositório é só o front-end: ele não guarda o catálogo, ele consome a API.

---

## 📌 Objetivo

> Separar a vitrine da loja da API, com uma arquitetura que cresce por feature e um único lugar responsável por falar com o back-end.

O projeto teve como objetivos principais:

* Exibir o catálogo público em Angular e Ionic
* Consumir categorias, peças, banners e carrinhos pela API
* Manter o visual em SCSS, com os tokens de cor e tipografia isolados
* Organizar telas por feature, sem misturar layout, estado e HTTP

---

## 🧠 O que foi aplicado neste projeto

* Arquitetura por **features** (`home`, `catalog`, `product`, `bag`)
* Camada **`core/api`** como único ponto que chama a API
* Serviços de domínio em **`core/services`**, que usam essa camada
* Componentes reutilizáveis em **`shared`** e casca da loja em **`layout`**
* Estilização em **SCSS**, com tokens em `src/styles/abstracts`

---

## 🛠️ Tecnologias Utilizadas

* **Angular 21** — aplicação
* **Ionic 9** — componentes de interface
* **TypeScript** — tipagem
* **SCSS** — estilos e tokens visuais
* **RxJS** — fluxo dos dados vindos da API

Angular 22 não foi usado porque o Angular CLI 22 exige Node.js 22.22.3 ou mais recente.

---

## 🗂️ Organização

| Pasta | Responsabilidade |
|---|---|
| `frontend/src/app/core/api` | Chamadas HTTP para a API |
| `frontend/src/app/core/services` | Regras da vitrine, sacola e SEO |
| `frontend/src/app/core/models` | Tipos do catálogo |
| `frontend/src/app/features` | Telas, uma pasta por fluxo |
| `frontend/src/app/layout` | Cabeçalho e rodapé |
| `frontend/src/app/shared` | Peças usadas em mais de uma tela |
| `frontend/src/styles/abstracts` | Tokens e mixins SCSS |

---

## ⚙️ Funcionalidades

* 🏠 Página inicial com banners e peças em destaque
* 👗 Listagem por segmento e categoria
* 🔎 Busca e filtros de preço e disponibilidade
* 👕 Detalhe da peça, com tamanhos e cores
* 🛍️ Sacola local e envio pelo WhatsApp com o código `SV-` gerado pela API

---

## 🖥️ Como rodar o projeto localmente

### Pré-requisitos

* Node.js 22.12 ou superior (esta máquina usa 22.15)
* A API do repositório `catalogo-digital-admin` rodando em `http://localhost:3002`

### Front-end

1. Clone o repositório:

```bash
git clone https://github.com/wemersonmatheuss/catalogo-digital-client.git
```

2. Instale e suba a vitrine:

```bash
npm install
npm run dev
```

A vitrine fica em `http://localhost:4200`.

O endereço da API está em `frontend/src/environments/environment.ts`, no campo `apiUrl`. O WhatsApp usa o campo `whatsapp.phone`, só com dígitos (DDI + DDD + número).

### Rotas

| Rota | Tela |
|---|---|
| `/` | Início |
| `/produtos` | Todas as peças |
| `/produtos/feminino` | Segmento feminino |
| `/produtos/feminino/blusa` | Categoria |
| `/produto/blusa-de-linho-demonstracao` | Detalhe |
| `/sacola` | Sacola |

---

## 👨‍💻 Autor

Wemerson Matheus  
[github.com/wemersonmatheuss](https://github.com/wemersonmatheuss)
