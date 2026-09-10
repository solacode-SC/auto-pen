.PHONY: help install dev build start stop restart logs test lint typecheck verify docker-build docker-up docker-down docker-logs clean

.DEFAULT_GOAL := help

help: ## Show this help message
	@echo ""
	@echo "Polish development commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-16s %s\n", $$1, $$2}'
	@echo ""

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build production application
	npm run build

start: ## Start production server
	npm run start

stop: ## Stop production server
	@echo "Stopping server..."
	@-pkill -f "next start" 2>/dev/null || true

restart: stop start ## Restart production server

logs: ## Show application logs
	@echo "Logs are output to stdout in development mode"

test: ## Run tests
	npm test

lint: ## Run ESLint
	npm run lint

typecheck: ## Run TypeScript type checking
	npm run typecheck

verify: lint typecheck test build ## Run all checks (lint, typecheck, test, build)
	@echo ""
	@echo "✓ All checks passed!"

docker-build: ## Build Docker image
	docker compose build

docker-up: ## Start Docker services
	docker compose up -d

docker-down: ## Stop Docker services
	docker compose down

docker-logs: ## Show Docker logs
	docker compose logs -f

clean: ## Remove generated files
	rm -rf .next node_modules coverage out build
	@echo "Cleaned generated files"
