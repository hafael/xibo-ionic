# Stack Tecnológica e Dependências

## Core
- **Framework:** Vue 3 (Composition API + Script Setup)
- **UI Toolkit:** Ionic Framework 7+ (Componentes visuais para a tela de Setup)
- **Build Tool:** Vite

## Estado e Rotas
- **Router:** Vue Router 4
- **State:** Pinia (Substituto moderno do Vuex)

## Integração Nativa
- **Engine:** Capacitor 5+
- **Electron Adapter:** @capacitor-community/electron

## Bibliotecas Específicas do Projeto
- **HTTP:** Axios (Para chamadas REST/Download de arquivos)
- **XML Parsing:** fast-xml-parser (Para ler os layouts e agendamentos do Xibo, que vêm em XML)
- **SOAP:** (Nativa ou biblioteca leve de helper, já que Xibo usa SOAP para registro)
- **Crypto:** crypto-js (Para gerar o hash MD5 de verificação de arquivos)

## Dev Tools Recomendadas
- **ESLint:** Configuração padrão Vue
- **Prettier:** Formatação automática
- **Vue DevTools:** Extensão de navegador