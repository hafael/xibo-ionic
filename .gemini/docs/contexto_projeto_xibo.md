# Contexto do Projeto: Migração Xibo Player

Este documento descreve o escopo do projeto, a arquitetura legada de referência e os repositórios oficiais utilizados como base para a engenharia reversa e reimplementação.

## 1. O Ecossistema Xibo
O **Xibo** é uma solução de Sinalização Digital (Digital Signage) Open Source. A arquitetura é dividida em duas partes:
1.  **CMS (Server):** Uma aplicação web (PHP/MySQL) onde o conteúdo é gerenciado e agendado.
2.  **Player (Client):** Aplicação que roda no dispositivo final (tela), conecta-se ao CMS via SOAP/HTTP, baixa conteúdos e os exibe.

**Nosso foco é exclusivamente o desenvolvimento do PLAYER.**

## 2. O Projeto Legado (Referência)
Estamos migrando/reescrevendo o cliente Windows oficial.
* **Tecnologia Original:** C# .NET, Windows Presentation Foundation (WPF), Windows Forms.
* **Arquitetura:** Aplicação Desktop Nativa ("Thick Client"). Depende estritamente do Windows e suas bibliotecas.
* **Limitação Atual:** Não roda nativamente em navegadores (Web) e tem portabilidade limitada para outros sistemas sem emulação.

### Repositório Fonte (Legacy)
O código fonte de referência para entender a lógica de negócios (XMDS, Agendamento, Layouts) está localizado em:
* **Xibo for Windows:** [https://github.com/xibosignage/xibo-windows](https://github.com/xibosignage/xibo-windows)
* *Nota:* A lógica de comunicação SOAP (`XiboClient`) e parsing de XML deve ser estudada a partir deste repositório.

## 3. O Novo Projeto (Target)
O objetivo é criar um **Xibo Player Web-First**.
* **Framework:** Ionic + Vue.js 3.
* **Engine:** Capacitor (para ponte nativa) + Electron (para empacotamento Desktop).
* **Objetivo Principal:** O mesmo código base deve rodar como um **Web App (PWA)** em um navegador comum e como uma aplicação **Desktop (Windows/Linux)** instalável.

### Diferenciais Técnicos Exigidos
1.  **Abstração de Storage:** O código deve decidir inteligentemente entre usar `FileSystem` (quando no Electron) ou `IndexedDB/CacheAPI` (quando no Browser).
2.  **Renderização HTML5:** Substituição dos controles WPF proprietários por tags HTML5 padrão (`<video>`, `<img>`, `<iframe>`).
3.  **Cross-Platform:** Capacidade de gerar builds para Web, Windows e Android a partir do mesmo código fonte.

## 4. Links Úteis e Referências
* **Documentação da API Xibo (XMDS):** [https://xibosignage.com/docs/developers](https://xibosignage.com/docs/developers)
* **Repositório CMS (Para entender o Server-Side):** [https://github.com/xibosignage/xibo-cms](https://github.com/xibosignage/xibo-cms)
* **Documentação da API Xibo (Criando um player):** [https://xibosignage.com/docs/developer/creating-a-player](https://xibosignage.com/docs/developer/creating-a-player)