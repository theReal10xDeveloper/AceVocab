#!/bin/bash

# Build the Docker image (from the project root)
docker build -t expo-android-build -f build/Dockerfile .

# Run the build command inside the container
docker run --rm -it \
    -v $(pwd):/app \
    expo-android-build \
    eas build --platform android --profile preview --local

# Clean up (optional)
# docker container prune -f
