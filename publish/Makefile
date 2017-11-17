init:
	sudo apt-get update -y
	sudo ./linux/scripts/nodejs.install.sh
	sudo ./linux/scripts/docker.install.sh
	sudo ./linux/scripts/docker-compose.install.sh
	sudo make up
publish:
	gulp 
up:
	docker-compose up -d --build
down:
	docker-compose down
