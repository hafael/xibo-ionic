# Estrutura de Diretórios Sugerida (src/)

/src
  /assets           # Imagens estáticas (logos, fallbacks)
  /components
    /config         # Componentes da tela de configurações (Inputs, Botões)
    /widgets        # Componentes que renderizam o conteúdo do Xibo
      ImageWidget.vue
      VideoWidget.vue
      TextWidget.vue
      WebWidget.vue
  /composables      # Lógica reutilizável (Vue Composition API)
    useXiboClient.ts  # Comms com a API
    useStorage.ts     # Abstração de salvamento de arquivos
    useHardware.ts    # Info da máquina (MAC Address, Resolução)
  /interfaces       # Tipagem TypeScript (Xibo Layouts, Media Items)
  /services
    /api            # Axios instances e SOAP parsers
    /soap           # Tratamento específico dos envelopes SOAP do Xibo
  /stores           # Pinia Stores
    playerStore.ts  # Estado atual (O que está tocando?)
    configStore.ts  # Configurações (URL do CMS, Key)
    queueStore.ts   # Fila de reprodução e pré-carregamento
  /utils            # Helpers puros (Formatadores de data, XML Parsers)
  /views
    PlayerView.vue  # A tela preta cheia onde o conteúdo roda
    SetupView.vue   # Tela inicial para configurar o CMS
    ErrorView.vue   # Tela de fallback caso tudo falhe
  App.vue           # Root (gerencia transição Setup -> Player)
  main.ts           # Entry point