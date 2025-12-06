# Roadmap de Execução: Xibo Player (Ionic/Vue)

## Fase 1: Fundação e Conectividade (Semanas 1-2)
**Objetivo:** O App deve abrir, registrar-se no CMS e saber que existe.

1.  **Configuração da Store (Pinia):**
    * Criar `settingsStore` para armazenar: `cmsUrl`, `cmsKey`, `displayId`.
2.  **Motor SOAP (Service Layer):**
    * Implementar `RegisterDisplay` SOAP call.
    * **Teste de Sucesso:** O Display deve aparecer na lista de "Displays" do CMS Xibo aguardando autorização.
3.  **Heartbeat:**
    * Implementar chamada recorrente `RegisterDisplay` (a cada 60s) para manter o status "Online" no CMS.

## Fase 2: Sincronização e Download (Semanas 3-4)
**Objetivo:** Baixar as instruções do que exibir.

1.  **Required Files (XMDS):**
    * Implementar chamada `RequiredFiles` que retorna o XML de dependências.
    * Criar fila de download (Queue) na Store.
2.  **Abstração de Armazenamento (O Grande Desafio):**
    * Criar `StorageService.ts`.
    * *Implementação Web:* Baixar o blob e salvar no IndexedDB.
    * *Implementação Electron:* Baixar stream e salvar em disco.
    * **Validação:** Verificar MD5 do arquivo baixado (usar `crypto-js`).
3.  **Parsing de Layout:**
    * Ler o arquivo XLF (Layout XML) baixado.
    * Converter para estrutura JSON compreensível pelo Vue.

## Fase 3: A Engine de Renderização (Semanas 5-7)
**Objetivo:** Colocar pixels na tela.

1.  **Layout Renderer:**
    * Criar componente que lê o JSON do layout e desenha o background e as dimensões.
2.  **Region Orchestrator:**
    * Lógica para processar as "Timelines" de cada região.
    * Gerenciar duração de cada item (ex: Imagem mostra por 10s, depois troca).
3.  **Widgets Básicos:**
    * Implementar `ImageWidget` (apenas `<img>`).
    * Implementar `VideoWidget` (tag `<video>` com autoplay/mute).
    * Implementar `TextWidget` (parse de HTML simples).

## Fase 4: Recursos Nativos e Polimento (Semanas 8+)
**Objetivo:** Paridade de funcionalidades com a versão Windows.

1.  **Watchdog (Electron apenas):**
    * Processo separado que verifica se o renderer do Electron travou e o reinicia.
2.  **Screenshot:**
    * Usar `html2canvas` (Web) ou captura nativa do Electron para enviar provas de execução (Proof of Play) para o CMS.
3.  **Overlay Web:**
    * Garantir que conteúdo web (widgets de clima, notícias) funcionem dentro de iframes seguros.

## Checklist de Validação Técnica (PoC)

- [ ] Consigo registrar o player num CMS Xibo v3/v4/v7?
- [ ] O Player baixa o `schedule.xml`?
- [ ] O Player interpreta que precisa baixar `video.mp4`?
- [ ] O Player toca `video.mp4` sem interface do navegador (controles escondidos)?
- [ ] O Player sobrevive a uma queda de internet (cache offline)?