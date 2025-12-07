# Roadmap de Execução: Xibo Player (Ionic/Vue)

## Fase 1: Fundação e Conectividade (Semanas 1-2)
**Objetivo:** O App deve abrir, registrar-se no CMS e saber que existe.

1.  **Configuração da Store (Pinia):** (COMPLETED)
    * Criar `settingsStore` para armazenar: `cmsUrl`, `cmsKey`, `displayId`.
2.  **Motor SOAP (Service Layer):** (COMPLETED)
    * Implementar `RegisterDisplay` SOAP call.
    * **Teste de Sucesso:** O Display deve aparecer na lista de "Displays" do CMS Xibo aguardando autorização. (VERIFIED)
3.  **Heartbeat:** (COMPLETED)
    * Implementar chamada recorrente `RegisterDisplay` (a cada 60s) para manter o status "Online" no CMS.

## Fase 2: Sincronização e Download (Semanas 3-4)
**Objetivo:** Baixar as instruções do que exibir.

1.  **Required Files (XMDS):** (COMPLETED)
    * Implementar chamada `RequiredFiles` que retorna o XML de dependências.
    * Criar fila de download (Queue) na Store. (COMPLETED)
2.  **Abstração de Armazenamento (O Grande Desafio):** (COMPLETED)
    * Criar `StorageService.ts`. (COMPLETED)
    * *Implementação Web:* Baixar o blob e salvar no IndexedDB. (COMPLETED)
    * *Implementação Electron:* Baixar stream e salvar em disco. (PENDING - FOR ELECTRON, NOT WEB)
    * **Validação:** Verificar MD5 do arquivo baixado (usar `spark-md5`). (COMPLETED)
3.  **Parsing de Layout:** (COMPLETED)
    * Ler o arquivo XLF (Layout XML) baixado.
    * Converter para estrutura JSON compreensível pelo Vue. (COMPLETED)

## Fase 3: A Engine de Renderização (Semanas 5-7)
**Objetivo:** Colocar pixels na tela.

1.  **Layout Renderer:** (COMPLETED)
    * Criar componente que lê o JSON do layout e desenha o background e as dimensões.
2.  **Region Orchestrator:** (COMPLETED)
    * Lógica para processar as "Timelines" de cada região.
    * Gerenciar duração de cada item (ex: Imagem mostra por 10s, depois troca).
3.  **Widgets Básicos:** (IN PROGRESS)
    * Implementar `ImageWidget` (apenas `<img>`). (COMPLETED)
    * Implementar `VideoWidget` (tag `<video>` com autoplay/mute). (COMPLETED)
    * Implementar `TextWidget` (parse de HTML simples via GetResource). (COMPLETED)
    * Implementar `ClockWidget` (lógica client-side). (COMPLETED)
    * Implementar `GlobalWidget` (PENDING)

## Fase 4: Recursos Nativos e Polimento (Semanas 8+)
**Objetivo:** Paridade de funcionalidades com a versão Windows.

1.  **Watchdog (Electron apenas):** (PENDING)
    * Processo separado que verifica se o renderer do Electron travou e o reinicia.
2.  **Screenshot:** (PENDING)
    * Usar `html2canvas` (Web) ou captura nativa do Electron para enviar provas de execução (Proof of Play) para o CMS.
3.  **Overlay Web:** (PENDING)
    * Garantir que conteúdo web (widgets de clima, notícias) funcionem dentro de iframes seguros.

## Checklist de Validação Técnica (PoC)

- [x] Consigo registrar o player num CMS Xibo v3/v4/v7?
- [x] O Player baixa o `schedule.xml`? (Referente ao 1.xlf)
- [x] O Player interpreta que precisa baixar `video.mp4`?
- [x] O Player toca `video.mp4` sem interface do navegador (controles escondidos)?
- [ ] O Player sobrevive a uma queda de internet (cache offline)? (IMPLICITAMENTE: sim, pois usa IndexedDB para arquivos, mas não explicitamente testado para toda a operação)
