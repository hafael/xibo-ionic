# Arquitetura Técnica: Xibo Player (Ionic/Vue)

## Visão Geral
O projeto é um Player de Sinalização Digital "Web-First". O código base é 100% Web (Vue 3), rodando dentro de um contêiner Capacitor.
- **Web (Browser):** Funciona como PWA. Persistência via IndexedDB/Cache API.
- **Desktop (Windows):** Funciona via Electron. Persistência via Sistema de Arquivos (fs) nativo.

## Diagrama de Camadas

[Xibo CMS] <--- (HTTP/SOAP) ---> [Service Layer]
                                      |
                               [Pinia Store (State)]
                                      |
                              [Controller/Logic]
                               /              \
                    (Browser Run)            (Electron Run)
                   [Web Adaptor]            [Native Adaptor]
                         |                        |
                   [Browser API]            [NodeJS/FS]

## Módulos Principais

### 1. Core Engine (O Coração)
Responsável por orquestrar o ciclo de vida do player.
- **Heartbeat:** Envia sinal "Estou vivo" para o CMS.
- **Scheduler:** Verifica se há novos conteúdos a baixar.
- **Watchdog:** Monitora se a renderização travou.

### 2. Xibo Parser
Interpreta os arquivos XLF (Layouts do Xibo).
- Transforma XML de regiões em Componentes Vue dinâmicos.
- Mapeia: `<region type="video">` -> `<VideoWidget />`.

### 3. Storage Abstraction Layer (SAL)
Interface unificada para salvar arquivos. O componente Vue não sabe se está salvando no disco ou no browser.
- `saveFile(path, blob)`:
  - Se `Platform.is('electron')` -> Usa `fs.writeFile`.
  - Se `Platform.is('web')` -> Usa `FileSytem API` (OPFS) ou `IndexedDB`.