import * as pulumi from '@pulumi/pulumi';
import * as rdsmod from '@pulumi/rdsmod';
import * as aws from '@pulumi/aws';

const cfg = new pulumi.Config();
const prefix = cfg.get("prefix") ?? pulumi.getStack();
const vpcId = cfg.require("VpcId");
const cidrBlock = cfg.require("CidrBlock");
const databaseSubnetGroupName = cfg.require("DatabaseSubnetGroupName");

// Create a security group for the RDS instance
const rdsSecurityGroup = new aws.ec2.SecurityGroup('test-rds-sg', {
  vpcId: vpcId,
});

new aws.vpc.SecurityGroupIngressRule('test-rds-sg-ingress', {
  ipProtocol: 'tcp',
  securityGroupId: rdsSecurityGroup.id,
  cidrIpv4: cidrBlock,
  fromPort: 3306,
  toPort: 3306,
});

// Create an explicty instance of the RDS module provider to ensure a specific AWS region
const rdsProvider = new rdsmod.Provider("rds-provider", {
    aws: {
        "region": "us-east-1"
    }
});

// Create an RDS instance using the terraform-aws-modules/rds module
const rds = new rdsmod.Module("test-rds", {
  engine: "mysql",
  identifier: `test-rds-${prefix}`,
  manage_master_user_password: true,
  publicly_accessible: false,
  allocated_storage: 20,
  max_allocated_storage: 100,
  instance_class: "db.t4g.large",
  engine_version: "8.0",
  family: "mysql8.0",
  db_name: "completeMysql",
  username: "complete_mysql",
  port: '3306',
  multi_az: true,
  db_subnet_group_name: databaseSubnetGroupName,
  vpc_security_group_ids: [rdsSecurityGroup.id],
  skip_final_snapshot: true,
  deletion_protection: false,
  create_db_option_group: false,
  create_db_parameter_group: false,
}, { provider: rdsProvider });

// Export RDS outputs for monitoring stack to reference
export const rdsInstanceId = rds.db_instance_identifier;
export const rdsInstanceArn = rds.db_instance_arn;
export const awsAccountId = aws.getCallerIdentityOutput({}).accountId;