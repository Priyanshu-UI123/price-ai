# Use official Python 3.11 image
FROM python:3.11

# Set the working directory
WORKDIR /code

# Copy the requirements file into the container
COPY ./requirements.txt /code/requirements.txt

# Install the Python dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# THE MAGIC FIX: Install Playwright's Chromium browser and its OS dependencies
RUN playwright install chromium --with-deps

# Copy the rest of your application code
COPY . /code

# Start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]