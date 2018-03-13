init:
	make build
	make deploy
build:
	docker build -t hub.donanimhaber.com:5000/dh-chat-socket-server:1.0-beta -f ../src/Dockerfile ../src/
deploy:
	docker stack deploy -c ../docker/docker-compose.yml dh_chat
