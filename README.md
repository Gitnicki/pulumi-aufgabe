## EC2-Instanz mithilfe von Pulumi erstellen
Erstelle mit Pulumi eine EC2 Instanz in einem (auch mit Pulumi erstellten) VPC mit einem public Subnet. Die EC2 Instanz soll eine public IP-Adresse bekommen und über Pulumi (oder auch Ansible) so konfiguriert werden, dass der Podfinfo Docker Container (https://github.com/stefanprodan/podinfo) auf der Instanz läuft und die Weboberfläche des Containers über die IP abrufbar ist.

https://www.pulumi.com/ai/answers/3s7BiGuNmhtgA93CwhkUe9/deploying-python-docker-image-with-aws-ec2-and-typescript