locals {
  base_name = "${var.environment}-${var.project_name}"
}


resource "aws_ecs_service" "user-management_service" {
  name            = "${local.base_name}-${var.service_name.code_name}"
  task_definition = "${aws_ecs_task_definition.api_task_definition.family}:${"${aws_ecs_task_definition.api_task_definition.revision}"}"
  desired_count   = var.ecs_service.desired_count
  launch_type     = "FARGATE"
  cluster         = var.ecs_service.cluster_id

  network_configuration {
    security_groups = var.ecs_service.network_configuration.security_groups
    subnets         = var.ecs_service.network_configuration.subnets

  }

  load_balancer {
    target_group_arn = var.ecs_service.target_group_arn
    container_name   = var.service_name.code_name
    container_port   = var.task_definition.environment.port
  }
}

data "aws_secretsmanager_secret" "aws_credentials" {
  name = var.task_definition.aws_credentials_secrets_name
}

resource "aws_ecs_task_definition" "api_task_definition" {
  family = "${local.base_name}_${var.service_name.code_name}_web"
  container_definitions = templatefile("${path.module}/tasks/web_task_definition.json.tpl", {
    container_name                        = var.service_name.code_name
    image                                 = "${var.task_definition.ecr_image_registry}:${var.task_definition.ecr_image_tag}",
    aws_credentials_secrets_arn           = data.aws_secretsmanager_secret.aws_credentials.arn
    environment                           = var.task_definition.environment.environment,
    port                                  = var.task_definition.environment.port,
    log_level                             = "prod"
    logger_level                          = var.task_definition.environment.logger_level
    rds_shared_database_connection_string = var.task_definition.environment.rds_shared_database_connection_string
    cognito_user_pool_id                  = var.task_definition.environment.cognito_user_pool_id
    cognito_client_id                     = var.task_definition.environment.cognito_client_id
    aws_region                            = var.task_definition.environment.aws_region
    log_group_name                        = var.task_definition.log_group_name
    }
  )
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_definition.cpu
  memory                   = var.task_definition.memory
  execution_role_arn       = var.task_definition.execution_role_arn
  task_role_arn            = var.task_definition.task_role_arn
}


