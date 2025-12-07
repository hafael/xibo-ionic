# Xibo Player (Ionic/Vue)

An unofficial, community-driven Xibo player built with the Ionic Framework, Vue.js, and Capacitor. This project aims to provide a modern, cross-platform client for the Xibo Digital Signage CMS.

## ⚠️ Disclaimer

This project is not officially affiliated with or endorsed by Xibo Signage. It is a community project created to explore alternative client technologies for the Xibo platform.

## ✨ Features

*   **Cross-Platform:** Runs on Android, iOS, and as a Progressive Web App (PWA) using Capacitor.
*   **Modern Tech Stack:** Built with Vue 3, Ionic Framework, and Vite for a fast and efficient development experience.
*   **Widget Support:** Renders common Xibo widgets, with a component-based architecture for easy extension.
    *   Text
    *   Image
    *   Video
    *   Clock
*   **Offline Capability:** Caches layout and media files using IndexedDB for offline playback.
*   **Xibo CMS Integration:** Communicates with the Xibo CMS via its SOAP API.

## 🚀 Technology Stack

*   **Frameworks:** [Ionic Framework](https://ionicframework.com/) v8 & [Vue.js](https://vuejs.org/) v3
*   **Mobile Runtime:** [Capacitor](https://capacitorjs.com/) v7
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **State Management:** [Pinia](https://pinia.vuejs.org/)
*   **Routing:** [Vue Router](https://router.vuejs.org/)
*   **Offline Storage:** [idb](https://github.com/jakearchibald/idb) (IndexedDB wrapper)
*   **API Communication:** [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) for SOAP messaging

## 📂 Project Structure

The project follows a standard Vue 3 + Vite structure, adapted for Ionic and Capacitor.

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable Vue components (Widgets, Layout)
│   ├── services/        # Core services (SOAP API, DB, Storage)
│   ├── stores/          # Pinia stores for state management
│   ├── views/           # Page components (routed by Vue Router)
│   ├── theme/           # Global styles and CSS variables
│   ├── router/          # Vue Router configuration
│   └── main.ts          # Application entry point
├── tests/               # Unit (Vitest) and E2E (Cypress) tests
├── capacitor.config.ts  # Capacitor native project configuration
├── ionic.config.json    # Ionic CLI configuration
└── package.json         # Project dependencies and scripts
```

## 🏁 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version is recommended)
*   A package manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Ionic CLI](https://ionicframework.com/docs/cli) (optional, but recommended)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd xibo-player
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Development Server

To start the development server with hot-reloading, run:

```bash
npm run dev
```

This will make the app available in your browser, typically at `http://localhost:5173`. You can also use `ionic serve`.

### Build

To compile and build the application for production:

```bash
npm run build
```

### Testing

*   **Unit Tests:**
    ```bash
    npm run test:unit
    ```
*   **End-to-End Tests:**
    ```bash
    npm run test:e2e
    ```

### Linting

To lint the codebase and check for style issues:
```bash
npm run lint
```

### Mobile Development (with Capacitor)

1.  **Add a platform (iOS or Android):**
    ```bash
    npx cap add android
    # or
    npx cap add ios
    ```

2.  **Build the web assets and sync them to the native platform:**
    ```bash
    npm run build
    npx cap sync
    ```

3.  **Open the native IDE (Android Studio or Xcode) to build and run the app:**
    ```bash
    npx cap open android
    # or
    npx cap open ios
    ```

## 📄 License

This project is licensed under the MIT License. Please see the `LICENSE` file for more details.
