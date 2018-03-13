init:
	make build
	make deploy
build:
	docker build -t hub.donanimhaber.com:5000/dh-chat-socket-server:1.0-beta -f ../src/Dockerfile ../src/
	docker tag hub.donanimhaber.com:5000/dh-chat-socket-server:1.0-beta hub.donanimhaber.com:5000/dh-chat-socket-server:1.0-beta
	docker push hub.donanimhaber.com:5000/dh-chat-socket-server:1.0-beta
deploy:
	docker login -u donanimhaberdev -p standart123* hub.donanimhaber.com:5000/mailbouncer && docker stack deploy -c ../docker/docker-cloud.yml dh_chat --with-registry-auth
