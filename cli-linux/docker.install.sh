DISTNAME=$(lsb_release -a | grep Codename | cut -d':' -f2 | tr -d "\t") 

sudo apt-get update -y

sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
echo "deb https://apt.dockerproject.org/repo ubuntu-$DISTNAME main " | sudo tee /etc/apt/sources.list.d/docker.list

sudo apt-get update -y
sudo apt-get purge lxc-docker
sudo apt-cache policy docker-engine
sudo apt-get upgrade 
sudo apt-get install linux-image-extra $(uname-r) -y
sudo apt-get install docker-engine -y
sudo service docker restart