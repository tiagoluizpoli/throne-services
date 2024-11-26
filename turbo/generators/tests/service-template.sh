#! /bin/bash

SERVICE_NAME="new-service"
SERVICE_PORT="8010"

function clean(){
  # Remove the generated service
  rm -rf apps/$SERVICE_NAME

  # Ensure all files are removed from the directory
  find apps/$SERVICE_NAME -type f -exec rm -f {} \;

  # Remove the directory
  rm -rf apps/$SERVICE_NAME
}

# Generate the new service
turbo gen service --args $SERVICE_NAME "api" "Service description" $SERVICE_PORT

# Install dependencies
pnpm install -F $SERVICE_NAME

# Generate Prisma client
pnpm prisma:generate -F $SERVICE_NAME

# Start the development server in the background and capture its PID
pnpm dev:api -F $SERVICE_NAME > /dev/null 2>&1 &
DEV_API_PID=$!

# Try to curl the service, retrying up to 5 times if it fails
MAX_RETRIES=10
RETRY_DELAY=2

for i in $(seq 1 $MAX_RETRIES); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$SERVICE_PORT | grep -q "200"; then
        kill $DEV_API_PID

        clean

        echo "Service is up and running."
        break
    else
        if [ $i -eq $MAX_RETRIES ]; then
            kill $DEV_API_PID

            clean

            echo "Service did not respond after $MAX_RETRIES attempts, exiting."
            exit 1
        else
            echo "Service not responding, retrying in $RETRY_DELAY second(s)..."
            sleep $RETRY_DELAY
        fi
    fi
done
