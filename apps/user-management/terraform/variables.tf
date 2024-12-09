variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "service_name" {
  type = object({
    name      = string
    code_name = string
  })
}

variable "ecs_service" {
  type = object({
    cluster_id    = string
    desired_count = number
    network_configuration = object({
      security_groups = list(string)
      subnets         = list(string)
    })

    target_group_arn = string
  })
}

variable "task_definition" {
  type = object({
    ecr_image_registry           = string
    ecr_image_tag                = string
    aws_credentials_secrets_name = string
    environment = object({
      environment                           = string
      port                                  = number
      logger_level                          = string
      rds_shared_database_connection_string = string
      cognito_user_pool_id                  = string
      cognito_client_id                     = string
      aws_region                            = string

    })
    cpu                = string
    memory             = string
    execution_role_arn = string
    task_role_arn      = string
    log_group_name     = string
  })
}
