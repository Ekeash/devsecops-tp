FROM python:3.12-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends iputils-ping \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir flask==3.0.3
COPY app.py .
COPY templates/ templates/
EXPOSE 5000
CMD ["python", "app.py"]
