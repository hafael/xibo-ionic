# Análise de Migração: Xibo Windows (.NET) -> Ionic/Vue

## 1. Análise do Repositório Original (`xibosignage/xibo-windows`)

O player Windows original opera sob a seguinte lógica crítica que precisa ser replicada:

### A. Comunicação (XMDS - Xibo Media Distribution Service)
* **Original (C#):** Utiliza `SoapClient` para se comunicar com o CMS. As trocas são envelopes XML SOAP.
* **Desafio JS:** Navegadores modernos e `fetch`/`axios` preferem JSON REST. O Xibo CMS suporta SOAP, mas o tratamento de XML em JS é mais verboso.
* **Solução Vue:** Implementar um `XmdsService.ts` que monta manualmente os envelopes SOAP (ou usa uma lib leve) para as funções críticas: `RegisterDisplay`, `RequiredFiles`, `GetFile`, `SubmitStats`.

### B. O Loop de Agendamento (The Schedule Loop)
* **Original:** Baixa um arquivo `schedule.xml`. O C# faz o parse deste XML, verifica datas de início/fim e determina qual layout deve ser exibido.
* **Solução Vue:** O `schedule.xml` deve ser convertido para um Objeto JSON (via `fast-xml-parser`) e armazenado na **Pinia Store**. Um `Watcher` ou `setInterval` verificará a cada segundo se o layout atual ainda é válido.

### C. Renderização (WPF vs DOM)
* **Original:** Usa controles WPF (`MediaElement` para vídeo, `WebBrowser` para HTML). Isso é pesado e depende do IE/Edge instalado.
* **Solução Vue:**
    * O "Layout" é a View principal.
    * As "Regiões" são componentes `<div>` com posicionamento absoluto (CSS `top`, `left`, `width`, `height`, `z-index`).
    * O conteúdo são componentes Vue dinâmicos (`<component :is="widgetType">`).

### D. Persistência de Arquivos
* **Original:** Salva arquivos físicos na pasta de documentos do usuário.
* **Solução Vue (Híbrida):**
    * **Web:** Usa a **Cache API** (ótima para requests de mídia) ou **Origin Private File System (OPFS)**.
    * **Electron:** Usa o `fs` do Node.js através da ponte do Capacitor.

---

## 2. Mapeamento de Classes (C# -> Vue Component/Composable)

| Conceito Legacy (C#) | Equivalente Moderno (Vue/TS) | Responsabilidade |
| :--- | :--- | :--- |
| `XiboClient.cs` | `useXmds.ts` (Composable) | Falar com a API SOAP. |
| `HardwareKey` | `useDevice.ts` | Gerar/Armazenar UUID único no LocalStorage. |
| `Scheduler.cs` | `stores/scheduler.ts` (Pinia) | Lógica de "O que devo tocar agora?". |
| `Layout.cs` | `components/LayoutRenderer.vue` | O container visual que desenha regiões. |
| `Region.cs` | `components/RegionContainer.vue` | O container CSS que segura o Widget. |
| `MediaNode` | `components/widgets/*` | Componentes individuais (Video, Imagem). |
| `Blacklist` | `stores/mediaErrors.ts` | Lista de mídias que falharam download. |