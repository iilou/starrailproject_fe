# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory inside the container to the backend folder
WORKDIR /app/backend

# Copy the requirements.txt into the container at /app/backend
COPY backend/requirements.txt /app/backend/

# Install the dependencies from requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy the backend code into the container
COPY backend /app/backend

# Expose port 8000 for FastAPI
EXPOSE 8000

# Set environment variables if needed (adjust according to your FastAPI app)
ENV PYTHONPATH=/app/backend

# Run the FastAPI application with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
