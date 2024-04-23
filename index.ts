import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Erstelle ein neues VPC
const vpc = new aws.ec2.Vpc("myVpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
});

const igw = new aws.ec2.InternetGateway("pull-igw", {
    vpcId: vpc.id,
});

const routeTable = new aws.ec2.RouteTable("pull-rt", {
    routes: [
        {
            cidrBlock: "0.0.0.0/0",
            gatewayId: igw.id
        },
    ],
    vpcId: vpc.id
});

// Erstelle ein öffentliches Subnetz
const subnet = new aws.ec2.Subnet("Subnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.2.0/24", 
    mapPublicIpOnLaunch: true,
    availabilityZone: "eu-central-1a"
});

new aws.ec2.RouteTableAssociation("pull-rt-assoc", {
    routeTableId: routeTable.id,
    subnetId: subnet.id
});

// Erstelle eine Sicherheitsgruppe für die EC2-Instanz
const securityGroup = new aws.ec2.SecurityGroup("instanceSecurityGroup", {
    vpcId: vpc.id,
    ingress: [{
        protocol: "tcp",
        fromPort: 80,
        toPort: 80,
        cidrBlocks: ["0.0.0.0/0"], // Erlaube HTTP-Zugriff von überall
    }, {
        protocol: "tcp",
        fromPort: 22,
        toPort: 22,
        cidrBlocks: ["0.0.0.0/0"], // Erlaube SSH-Zugriff von überall
    }],
    egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"], // Egress
    }]
});

// Erstelle eine EC2-Instanz
const instance = new aws.ec2.Instance("myInstance", {
    instanceType: "t2.micro",
    vpcSecurityGroupIds: [securityGroup.id],
    subnetId: subnet.id,
    associatePublicIpAddress: true,
    ami: "ami-0f7204385566b32d0",
    userData: `#!/bin/bash
        sudo yum update -y
        sudo yum install docker -y
        sudo service docker start
        usermod -a -G docker ec2-user
        chkconfig docker on
        docker pull stefanprodan/podinfo
        sudo docker run -d -p 80:9898 stefanprodan/podinfo
    `,
});

// Exportiere die öffentliche IP-Adresse der Instanz
export const publicIp = instance.publicIp;
// Exportiere die VPC ID
export const vpcId = vpc.id;
