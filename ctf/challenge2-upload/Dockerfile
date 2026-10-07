FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir flask==3.0.3
COPY app.py .
COPY templates/ templates/
RUN mkdir -p /app/plugins
EXPOSE 5000
CMD ["python", "app.py"]
