# Cancer Risk Prediction App

> This project uses a pre-trained model to predict Cancer Risk based on data filled in the frontend.

This project consists of a Python FastAPI backend that serves the AI model and a React frontend application for interaction.

## 📋 Prerequisites

Before you begin, ensure you have the following tools installed on your system:

* [Python 3.8+](https://www.python.org/) (which includes `pip`)
* [Node.js](https://nodejs.org/) (LTS version recommended)
* [pnpm](https://pnpm.io/installation) (You can typically install this with `npm install -g pnpm`)

## ⚡ Getting Started

To get the application running, you'll need to start both the backend API and the frontend service in separate terminal windows.

### 1. Run the API (FastAPI)

1.  Navigate to the API directory:
    ```bash
    cd ./api
    ```
2.  Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the development server:
    ```bash
    fastapi dev main.py
    ```
    *Keep this terminal running. The API will likely be available at `http://127.0.0.1:8000`.*

### 2. Run the Frontend

1.  Open a **new terminal window** (leave the API running in the first one).
2.  Navigate to the frontend directory:
    ```bash
    cd ./frontend
    ```
3.  Install the Node.js dependencies:
    ```bash
    pnpm install
    ```
4.  Start the frontend development server:
    ```bash
    pnpm run dev
    ```
    *This will likely open the application in your browser, or provide a URL (like `http://localhost:5173`) to open.*

---

## 🧠 A Note on the Model

This repository includes a pre-trained model. You **do not** need to train the model yourself to use the application. The `./models` directory and any training scripts can be ignored for basic setup and use.
