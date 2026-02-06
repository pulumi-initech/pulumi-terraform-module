# Pulumi Terraform Module Example

This project demonstrates how to use existing Terraform modules directly within Pulumi programs, leveraging the Pulumi Terraform Module provider to create AWS infrastructure using popular community modules.

## Overview

This example creates a complete AWS infrastructure stack using Terraform modules:
- **RDS**: A MySQL RDS instance with managed master password using the [terraform-aws-modules/rds](https://registry.terraform.io/modules/terraform-aws-modules/rds/aws) module
- **Security Group**: Native Pulumi AWS resources to control RDS access

## Key Benefits

Using Terraform modules in Pulumi provides:
- **Access to Ecosystem**: Leverage thousands of tested modules from the Terraform Registry without recreating them
- **Gradual Migration**: Adopt Pulumi incrementally while maintaining existing Terraform modules
- **Native Integration**: Module outputs work seamlessly with native Pulumi resources and dependencies

## Module Imports

The Terraform modules are declared in [Pulumi.yaml](Pulumi.yaml#L8-L22) and automatically imported:

```yaml
packages:
  rdsmod:
    source: terraform-module
    version: 0.2.0
    parameters:
      - terraform-aws-modules/rds/aws
      - 6.10.0
      - rdsmod
```

### How Module Import Works

1. **Module Declaration**: Modules are specified in `Pulumi.yaml` under the `packages` section
2. **SDK Generation**: Pulumi generates TypeScript SDKs in the `sdks/` directory
3. **Native Usage**: Import and use modules like any other Pulumi package
4. **Automatic Management**: Pulumi handles OpenTofu installation and state management

### Adding Modules Manually

You can also add modules using the CLI:

```bash
# Add a module from Terraform Registry
pulumi package add terraform-module <source> <version> <name>

# Add a local module
pulumi package add terraform-module ./path/to/module localmod
```

## Prerequisites

- [Pulumi CLI](https://www.pulumi.com/docs/install/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- AWS account with permissions to create VPC, RDS, and security group resources

## Running the Program

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create a new Pulumi stack** (optional):
   ```bash
   pulumi stack init dev
   ```

3. **Set AWS region**:
   ```bash
   pulumi config set aws:region us-west-2
   ```

4. **Preview the infrastructure**:
   ```bash
   pulumi preview
   ```

5. **Deploy the infrastructure**:
   ```bash
   pulumi up
   ```

6. **Clean up resources**:
   ```bash
   pulumi destroy
   ```

## Configuration

You can customize the deployment by setting the `prefix` configuration value:

```bash
pulumi config set prefix myapp
```

This will prefix resource names (default is the stack name).

## Program Structure

The [index.ts](index.ts) file demonstrates:

- **Module Usage** (lines 21-35): Creating a VPC using the Terraform module with calculated subnet CIDRs
- **Resource Dependencies** (lines 38-48): Creating security groups using native Pulumi AWS resources
- **Cross-Module References** (line 65): Using VPC module outputs in the RDS module configuration
- **Utility Functions** (lines 74-80): Helper to calculate subnet CIDRs using the `@pulumi/std` provider

## How It Works

The Terraform Module provider:
1. Automatically installs and manages OpenTofu (open-source Terraform-compatible tool)
2. Translates Pulumi resource declarations into Terraform configurations
3. Manages state through standard Pulumi backends
4. Exposes module outputs as native Pulumi outputs

Resource dependencies work automatically - outputs from Terraform modules integrate seamlessly with native Pulumi resources in the same program.

## Learn More

- [Pulumi Terraform Module Documentation](https://www.pulumi.com/docs/iac/guides/building-extending/using-existing-tools/use-terraform-module/)
- [Pulumi AWS Provider](https://www.pulumi.com/registry/packages/aws/)
- [Terraform AWS Modules](https://registry.terraform.io/namespaces/terraform-aws-modules)
