export type GuideStep = {
  text: string
  image: string
  width: number
  height: number
}

export type GuideSection = {
  id: string
  title: string
  intro: string
  steps: GuideStep[]
}

const IMAGE_BASE = "/guide/meta-connect"

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "acesso-pagina-facebook",
    title: "1. Acesso à página do Facebook — Meta Business Suite",
    intro:
      "Vamos começar verificando a permissão que você tem na sua página do Facebook. Para publicar anúncios pelo Tri Anúncios, você precisa ter controle total da página.",
    steps: [
      {
        text: "No seu perfil pessoal do Facebook, abra o menu principal e clique em Páginas.",
        image: `${IMAGE_BASE}/secao1-passo1.png`,
        width: 697,
        height: 903,
      },
      {
        text: "Clique na página que você quer conectar ao Tri Anúncios.",
        image: `${IMAGE_BASE}/secao1-passo2.png`,
        width: 1563,
        height: 755,
      },
      {
        text: "No canto esquerdo, acesse o Meta Business Suite.",
        image: `${IMAGE_BASE}/secao1-passo3.png`,
        width: 1889,
        height: 841,
      },
      {
        text: "Abra o menu de contas no canto superior esquerdo.",
        image: `${IMAGE_BASE}/secao1-passo4.png`,
        width: 1523,
        height: 881,
      },
      {
        text: "Clique no ícone de engrenagem ao lado do portfólio empresarial.",
        image: `${IMAGE_BASE}/secao1-passo5.png`,
        width: 1537,
        height: 871,
      },
      {
        text: "Na tela Usuários > Pessoas, clique no seu usuário.",
        image: `${IMAGE_BASE}/secao1-passo6.png`,
        width: 1894,
        height: 856,
      },
      {
        text: "Clique em Gerenciar em frente ao nome da página.",
        image: `${IMAGE_BASE}/secao1-passo7.png`,
        width: 1877,
        height: 891,
      },
      {
        text: "Confira se a permissão Controle total está liberada.",
        image: `${IMAGE_BASE}/secao1-passo8.png`,
        width: 1844,
        height: 828,
      },
    ],
  },
  {
    id: "acesso-conta-instagram",
    title: "2. Acesso à conta do Instagram — Meta Business Suite",
    intro:
      "Agora certifique-se de que o seu acesso à conta do Instagram também está ativo no Meta Business Suite.",
    steps: [
      {
        text: "Na mesma tela Usuários > Pessoas, clique em Gerenciar na conta do Instagram.",
        image: `${IMAGE_BASE}/secao2-passo1.png`,
        width: 1877,
        height: 891,
      },
      {
        text: "Confirme se o Controle total está ativado.",
        image: `${IMAGE_BASE}/secao2-passo2.png`,
        width: 1453,
        height: 687,
      },
    ],
  },
  {
    id: "configuracoes-de-ativos",
    title: "3. Configurações de ativos — Meta Business Suite",
    intro:
      "Se a sua página ainda não faz parte de um portfólio empresarial, siga os passos abaixo para criar o portfólio e reivindicar a página como um ativo do seu negócio.",
    steps: [
      {
        text: "Depois de criar a página, clique em Meta Business Suite.",
        image: `${IMAGE_BASE}/secao3-passo1.png`,
        width: 721,
        height: 337,
      },
      {
        text: "Abra o menu de contas no canto superior esquerdo.",
        image: `${IMAGE_BASE}/secao3-passo2.png`,
        width: 1027,
        height: 497,
      },
      {
        text: "Clique em Criar um portfólio empresarial.",
        image: `${IMAGE_BASE}/secao3-passo3.png`,
        width: 1025,
        height: 490,
      },
      {
        text: "Reivindique o acesso à página para o portfólio.",
        image: `${IMAGE_BASE}/secao3-passo4.png`,
        width: 1206,
        height: 598,
      },
      {
        text: "Se quiser, adicione outros usuários (opcional).",
        image: `${IMAGE_BASE}/secao3-passo5.png`,
        width: 1252,
        height: 617,
      },
      {
        text: "Você será direcionado às configurações do portfólio.",
        image: `${IMAGE_BASE}/secao3-passo6.png`,
        width: 1897,
        height: 887,
      },
      {
        text: "Acesse Ativos de negócios e clique em Adicionar, escolhendo Página do Facebook.",
        image: `${IMAGE_BASE}/secao3-passo7.png`,
        width: 1882,
        height: 892,
      },
      {
        text: "Clique em Reivindicar uma Página do Facebook existente.",
        image: `${IMAGE_BASE}/secao3-passo8.png`,
        width: 1889,
        height: 899,
      },
      {
        text: "Busque a página pelo nome ou pela URL.",
        image: `${IMAGE_BASE}/secao3-passo9.png`,
        width: 1890,
        height: 854,
      },
      {
        text: "Marque a concordância com os Termos de Serviço da Meta.",
        image: `${IMAGE_BASE}/secao3-passo10.png`,
        width: 1889,
        height: 856,
      },
      {
        text: "Clique em Reivindicar Página.",
        image: `${IMAGE_BASE}/secao3-passo11.png`,
        width: 1894,
        height: 851,
      },
      {
        text: "Confira a validação na aba Pessoas.",
        image: `${IMAGE_BASE}/secao3-passo12.png`,
        width: 1912,
        height: 900,
      },
      {
        text: "Clique em Gerenciar na página e valide o Controle total.",
        image: `${IMAGE_BASE}/secao3-passo13.png`,
        width: 1891,
        height: 858,
      },
    ],
  },
  {
    id: "ativo-conta-instagram",
    title: "4. Ativo da conta do Instagram",
    intro:
      "Por fim, adicione a conta do Instagram como um ativo do portfólio e garanta o controle total sobre ela.",
    steps: [
      {
        text: "Nas configurações do portfólio, acesse a aba Contas do Instagram.",
        image: `${IMAGE_BASE}/secao4-passo1.png`,
        width: 1888,
        height: 853,
      },
      {
        text: "Clique em Adicionar.",
        image: `${IMAGE_BASE}/secao4-passo2.png`,
        width: 1875,
        height: 856,
      },
      {
        text: "Concorde com os Termos do Instagram e clique em Reivindicar.",
        image: `${IMAGE_BASE}/secao4-passo3.png`,
        width: 1894,
        height: 853,
      },
      {
        text: "Informe os dados de login da conta do Instagram.",
        image: `${IMAGE_BASE}/secao4-passo4.png`,
        width: 1060,
        height: 513,
      },
      {
        text: "Clique em Atribuir pessoas.",
        image: `${IMAGE_BASE}/secao4-passo5.png`,
        width: 1874,
        height: 899,
      },
      {
        text: "Selecione o seu nome, habilite o Controle total e clique em Atribuir.",
        image: `${IMAGE_BASE}/secao4-passo6.png`,
        width: 1244,
        height: 997,
      },
      {
        text: "Pronto — o acesso à conta do Instagram está finalizado.",
        image: `${IMAGE_BASE}/secao4-passo7.png`,
        width: 1853,
        height: 847,
      },
    ],
  },
]
