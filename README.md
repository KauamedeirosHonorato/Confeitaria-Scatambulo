# Scatambulo Confeitaria - Site Vitrine e Menu Interativo

Este é o repositório do site para a Scatambulo Confeitaria, um projeto web estático que funciona como uma página "link na bio" e um menu digital interativo. O sistema permite que os clientes visualizem os produtos, montem um carrinho de compras e finalizem o pedido diretamente pelo WhatsApp.

## 📜 Descrição

O projeto foi desenvolvido para oferecer uma presença online elegante e funcional para a confeitaria. Ele é composto por duas páginas principais:

1.  **Página Inicial (`index.html`):** Uma landing page visualmente impactante com vídeo de fundo, servindo como um hub de links para o menu e canais de contato.
2.  **Menu (`menu.html`):** Um catálogo detalhado dos bolos, onde os clientes podem selecionar sabores e tamanhos/embalagens.

A principal funcionalidade é o sistema de carrinho de compras que utiliza o `localStorage` do navegador para persistir as escolhas do cliente e gera uma mensagem de pedido formatada para o WhatsApp.

## ✨ Funcionalidades

- **Design Responsivo:** Totalmente adaptável para desktops, tablets e dispositivos móveis.
- **Página de Bio:**
  - Vídeo de fundo para uma experiência imersiva.
  - Links diretos para grupos VIP e contato no WhatsApp.
  - Simulação de "Dynamic Island" (para iPhones) com o @ do Instagram.
- **Menu Interativo:**
  - Grade de produtos com imagens, descrições e preços.
  - Opções de seleção de tamanho e embalagem para cada item.
  - Modais informativos com políticas da loja, cuidados com o produto e informações de pagamento.
- **Carrinho de Compras:**
  - Adição de itens ao carrinho diretamente do menu.
  - O carrinho é salvo no navegador, permitindo que o cliente continue o pedido mesmo que feche a aba.
  - Painel lateral deslizante para visualização rápida do carrinho.
  - Capacidade de remover itens do carrinho.
- **Checkout via WhatsApp:**
  - O botão "Encomendar" gera um link `api.whatsapp.com` com uma mensagem pré-formatada contendo todos os itens do carrinho, simplificando o processo de pedido para o cliente e para a confeitaria.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica do site.
- **TailwindCSS:** Framework CSS para estilização rápida e responsiva.
- **JavaScript (Vanilla):** Manipulação do DOM e toda a lógica do carrinho de compras.
- **Google Fonts:** Para as fontes `Playfair Display` e `Poppins`.

## 📂 Estrutura dos Arquivos

```
.
├── Avatar/               # Imagens de avatar e fundo do carrinho
├── Logo/                 # Logo da empresa
├── VideoFundo/           # Vídeo para a página inicial
├── sabores/              # Imagens dos bolos
├── index.html            # Página inicial (link na bio)
├── menu.html             # Página do menu de produtos
├── carrinho.html         # Página dedicada ao carrinho (alternativa)
├── carrinho.js           # Lógica principal do carrinho de compras
├── menu.css              # Estilos customizados para o menu
└── README.md             # Este arquivo
```

## 🚀 Como Executar

Este é um projeto de site estático. Para executá-lo localmente:

1.  Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```
2.  Navegue até a pasta do projeto:
    ```sh
    cd seu-repositorio
    ```
3.  Abra o arquivo `index.html` diretamente no seu navegador.

> **Nota:** Para uma melhor experiência e para garantir que todos os recursos (como o vídeo) carreguem corretamente, é recomendado usar um servidor local. Uma maneira fácil é usar a extensão **Live Server** no Visual Studio Code.

## ⚙️ Customização

### Alterar o Número do WhatsApp

O número de telefone para onde os pedidos são enviados está no arquivo `carrinho.js`.

```javascript
// Em c:\WIR GAMES\codigos\Codding\Nova pasta\carrinho.js, linha 95
const phone = "554499024212";
```

### Adicionar/Editar Produtos

Os produtos (bolos) são adicionados diretamente no arquivo `menu.html`. Para adicionar um novo bolo, copie a estrutura de um dos `div`s de produto existentes e altere as informações como imagem, nome, descrição e as opções no `<select>`.

### Alterar Links e Textos

Todos os textos, links e informações de contato podem ser editados diretamente nos arquivos `.html` correspondentes.
