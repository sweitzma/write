### self-documenting
.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

### NGINX Webserver
.PHONY: build start stop
build: ## build nginx image
	docker-compose build

start: ## start up nginx container
	docker-compose up --no-recreate -d nginx
	open -a firefox 'http://localhost:8080'

stop: ## bring down nginx container
	docker-compose down
