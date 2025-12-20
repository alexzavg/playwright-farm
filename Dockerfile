# Use official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (browsers already included in base image)
RUN npm ci

# Copy project files
COPY . .

# Default command - can be overridden in CI/CD
CMD ["npx", "playwright", "test"]
