[
	{
		"name": "${container_name}",
		"image": "${image}",
		"portMappings": [
			{
				"containerPort": ${port},
				"hostPort": ${port}
			},
			{
				"containerPort": 443,
				"hostPort": 443
			}
		],
		"memory": 300,
		"networkMode": "awsvpc",
		"logConfiguration": {
			"logDriver": "awslogs",
			"options": {
				"awslogs-group": "${log_group_name}",
				"awslogs-region": "us-east-1",
				"awslogs-stream-prefix": "web"
			}
		},
		"secrets": [
     {
				"name": "AWS_SECRET_ACCESS_KEY",
				"valueFrom": "${aws_credentials_secrets_arn}:SecretKey::"
			},
			{
				"name": "AWS_ACCESS_KEY_ID",
				"valueFrom": "${aws_credentials_secrets_arn}:AccessKey::"
			}
    ],
		"environment": [
			{
				"name": "ENVIRONMENT",
				"value": "${environment}"
			},
			{
				"name": "LOG_LEVEL",
				"value": "${log_level}"
			},
			{
				"name": "PORT",
				"value": "${port}"
			},
      {
        "name": "LOGGER_LEVEL",
        "value": "${logger_level}"
      },
      {
        "name": "SHARED_DATABASE_URL",
        "value": "${rds_shared_database_connection_string}"
      },
      {
        "name": "COGNITO_USER_POOL_ID",
        "value": "${cognito_user_pool_id}"
      },
      {
        "name": "COGNITO_CLIENT_ID",
        "value": "${cognito_client_id}"
      },
			{
				"name": "AWS_REGION",
				"value": "${aws_region}"
			}
		],
		"healthcheck": {
			"retries": 10,
			"command": ["CMD-SHELL", "curl -f http://localhost:8010/healthCheck || exit 1"],
			"timeout": 5,
			"interval": 10,
			"startPeriod": 5
		}
	}
]
