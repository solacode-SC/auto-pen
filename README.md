# Polish

> AI-Powered Text Improvement Web Application

Polish is an AI-powered text improvement web application designed to refine, enhance, and transform your writing with precision. Powered by DeepSeek's advanced LLM models, Polish delivers smart rewriting, grammar and style adjustments, tone customization, and concise editing through a clean, modern user interface.

## Features

- **Smart Text Enhancement**: Polish sentences, paragraphs, or full essays with intelligent context-aware suggestions.
- **Multiple Writing Tones & Modes**: Adjust tone between professional, casual, academic, persuasive, or creative.
- **Grammar & Syntax Correction**: Fix spelling errors, grammatical mistakes, and punctuation with accurate explanations.
- **Concise & Clarity Rewriting**: Eliminate wordiness, passive voice, and improve readability.
- **Real-Time Streaming**: Fast AI responses streamed directly to the editor.
- **Docker-Ready**: Fully containerized multi-stage production builds and simple local deployment.

## Requirements

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Docker**: Engine 24+ (optional, for containerized deployment)
- **Docker Compose**: v2+ (optional, for container orchestration)
- **Make**: Standard GNU Make

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd auto-pen
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Configure your API key**:
   Open `.env` and add your DeepSeek API key:
   ```env
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

4. **Install dependencies**:
   ```bash
   make install
   # or: npm install
   ```

5. **Start development server**:
   ```bash
   make dev
   # or: npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker

Run Polish using Docker and Docker Compose without requiring a local Node.js environment:

- **Build Docker image**:
  ```bash
  make docker-build
  # or: docker compose build
  ```

- **Start Docker services**:
  ```bash
  make docker-up
  # or: docker compose up -d
  ```

- **View container logs**:
  ```bash
  make docker-logs
  # or: docker compose logs -f
  ```

- **Stop Docker services**:
  ```bash
  make docker-down
  # or: docker compose down
  ```

## Development

Common development workflows:

- **Start dev server**:
  ```bash
  make dev
  ```

- **Run tests**:
  ```bash
  make test
  ```

- **Run TypeScript type checking**:
  ```bash
  make typecheck
  ```

- **Run linter**:
  ```bash
  make lint
  ```

- **Run all verification checks** (lint, typecheck, test, build):
  ```bash
  make verify
  ```

## Available Commands

All primary development and deployment commands are managed via `Makefile`:

| Command | Description |
|---|---|
| `make help` | Show available Makefile commands |
| `make install` | Install project dependencies via `npm install` |
| `make dev` | Start development server with hot-reload |
| `make build` | Build production application bundle |
| `make start` | Start production server |
| `make stop` | Stop running production server |
| `make restart` | Restart production server |
| `make logs` | Show application logs |
| `make test` | Run test suites |
| `make lint` | Run ESLint checks |
| `make typecheck` | Run TypeScript type checking |
| `make verify` | Run all quality checks (`lint`, `typecheck`, `test`, `build`) |
| `make docker-build` | Build Docker image |
| `make docker-up` | Start Docker services in detached mode |
| `make docker-down` | Stop Docker services |
| `make docker-logs` | Stream Docker container logs |
| `make clean` | Remove generated files (`.next`, `node_modules`, `coverage`, `out`, `build`) |

## Environment Variables

Configure the application using the following environment variables:

| Variable | Required | Default | Description |
|---|---|---|---|
| `DEEPSEEK_API_KEY` | **Yes** | — | API key for authenticating with DeepSeek API |
| `DEEPSEEK_MODEL` | No | `deepseek-chat` | DeepSeek LLM model identifier |
| `DEEPSEEK_BASE_URL` | No | `https://api.deepseek.com` | Base URL for the DeepSeek API endpoint |

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: CSS Modules
- **AI Integration**: DeepSeek API
- **Containerization**: Docker & Docker Compose
- **Task Runner**: Make

## License

MIT
