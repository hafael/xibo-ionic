# Sumário do Projeto: Xibo Player Ionic/Vue

Este documento é um sumário gerado a partir dos arquivos de contexto do projeto, fornecendo uma visão geral sobre o objetivo, arquitetura e estado atual do desenvolvimento.

## 1. Visão Geral do Projeto

O objetivo é desenvolver um **Player de Sinalização Digital (Digital Signage) "Web-First"** para o ecossistema Xibo. O projeto consiste em uma reescrita moderna do player legado (C#/.NET/WPF), utilizando tecnologias web para garantir portabilidade.

- **Tecnologias Base:** Ionic, Vue.js 3, Capacitor.
- **Plataformas Alvo:**
    1.  **Web (PWA):** Funciona diretamente no navegador com persistência via IndexedDB e Cache API.
    2.  **Desktop (Windows/Linux):** Empacotado com Electron, utilizando o sistema de arquivos nativo (`fs`) para persistência.

O player é responsável por se conectar a um **Xibo CMS**, baixar agendamentos e mídias, e renderizá-los na tela de um dispositivo.

## 2. Arquitetura e Stack

A arquitetura é projetada em camadas para desacoplar a lógica de negócios da plataforma de execução.

- **Camadas Principais:**
    - **Service Layer:** Comunicação com a API do CMS (SOAP/HTTP).
    - **Pinia Store:** Gerenciamento de estado centralizado (configurações, fila de download, estado do player).
    - **Controller/Logic:** Orquestração do ciclo de vida (heartbeat, scheduler, parser de layout).
    - **Storage Abstraction Layer (SAL):** Interface única para salvar/ler arquivos, seja no disco ou no browser.

- **Stack Tecnológica:**
    - **Core:** Vue 3 (Composition API), Ionic 7+, Vite.
    - **Estado e Rotas:** Pinia, Vue Router 4.
    - **Integração:** Capacitor 5+, Axios, `fast-xml-parser`.

## 3. Lógica de Negócios Essencial

A lógica do player replica o comportamento do cliente Windows original:

1.  **Registro e Heartbeat:** O player se registra no CMS enviando sua `hardwareKey` e envia "heartbeats" periódicos para se manter online. A comunicação é feita via envelopes **XML SOAP**.
2.  **Sincronização de Arquivos:** O player solicita a lista de arquivos necessários (`RequiredFiles`) e os baixa. O MD5 de cada arquivo é verificado para garantir a integridade.
3.  **Parsing e Renderização:** O arquivo de layout (`schedule.xml` e `.xlf`) é baixado, convertido de XML para JSON, e armazenado. A engine de renderização utiliza componentes Vue dinâmicos (`<component :is="...">`) para exibir cada *widget* (vídeo, imagem, texto) dentro de suas respectivas regiões.

## 4. API e Servidor

- **API do CMS:** A comunicação com o Xibo CMS é feita primariamente via **SOAP (para registro e agendamento)** e **REST (para outros recursos)**. A especificação da API REST está documentada em um arquivo `swagger.json`.
- **Servidor de Desenvolvimento:** O CMS para desenvolvimento está acessível em `http://localhost:80`.

## 5. Estado Atual do Projeto (Roadmap)

O desenvolvimento está em andamento, com as seguintes fases concluídas ou em progresso:

- **FASE 1 (Concluída):** Fundação e Conectividade (Registro no CMS, Heartbeat).
- **FASE 2 (Concluída):** Sincronização e Download (Lógica de `RequiredFiles`, abstração de storage para web, parsing de XML).
- **FASE 3 (Em Progresso):** Engine de Renderização (Renderizador de Layout, orquestrador de regiões e implementação da maioria dos widgets básicos como Imagem, Vídeo, Texto e Relógio).
- **FASE 4 (Pendente):** Recursos Nativos e Polimento (Watchdog para Electron, Screenshots "Proof of Play", overlays).
