# Use a slim version of Python to keep the image small
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /code

# Copy the requirements file and install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the app folder and the main entry point
COPY ./app /code/app
COPY ./main.py /code/main.py

# Run the FastAPI server
# We use 0.0.0.0 so it can be reached from outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]