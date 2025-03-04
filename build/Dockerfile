# Use a base image with Node.js (match your project's Node version)
FROM node:18

# Install Java (OpenJDK is commonly used)
RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-17-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Android SDK Command Line Tools
# (Using a specific version for stability; you might need to adjust this)
ARG ANDROID_SDK_VERSION=11438593
RUN mkdir -p /opt/android/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip -O /tmp/cmdline-tools.zip && \
    unzip /tmp/cmdline-tools.zip -d /opt/android/cmdline-tools && \
    mv /opt/android/cmdline-tools/cmdline-tools /opt/android/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Set environment variables
ENV ANDROID_HOME=/opt/android
ENV ANDROID_SDK_ROOT=/opt/android
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install SDK components (platform, build-tools, etc.)
# (Adjust platform and build-tools versions as needed)
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" && \
    sdkmanager "platforms;android-34" && \
    sdkmanager "build-tools;34.0.0"

# Install EAS CLI globally
RUN npm install -g eas-cli

# Set the working directory inside the container
WORKDIR /app

# Copy the project files into the container
COPY . /app/

# Install project dependencies (do this *after* copying to leverage Docker layer caching)
# First, copy only the package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install

# Expose necessary ports (if needed for debugging, etc.)
# EXPOSE 19000 19001 19002

# The default command (you'll likely override this when running the container)
CMD ["bash"]
