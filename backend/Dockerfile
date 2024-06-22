# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.10.12
FROM python:${PYTHON_VERSION}-slim as base

# Environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Working directory
WORKDIR /app

# Create necessary directories
RUN mkdir -p /app/media/programs

# Add a non-root user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Install system dependencies, Go, and C++ compiler
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Go
RUN curl -OL https://golang.org/dl/go1.17.3.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf go1.17.3.linux-amd64.tar.gz \
    && rm go1.17.3.linux-amd64.tar.gz

ENV PATH="/usr/local/go/bin:${PATH}"

# Install Python dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.dev.txt,target=requirements.dev.txt \
    python -m pip install -r requirements.dev.txt

# Copy project files
COPY . .

# Expose the port
EXPOSE 8000

# Default command
CMD python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000
