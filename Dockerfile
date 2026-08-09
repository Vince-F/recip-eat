# Use Playwright's official image for a stable browser test environment.
# This image already includes the required Chromium/Firefox/WebKit browsers and system deps.
FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /usr/src/app

# Copy package metadata first to leverage Docker layer caching.
COPY package.json package-lock.json ./

# Install project dependencies.
RUN npm ci

# Copy project sources.
COPY . ./

# Ensure the Playwright test result directory exists and can be mounted by the host.
RUN mkdir -p /usr/src/app/test-results
VOLUME ["/usr/src/app/test-results"]

# Expose the Vite default development port and make test artifacts visible.
EXPOSE 5173

# Default command to run Playwright E2E tests inside the container.
CMD ["npx", "playwright", "test"]
