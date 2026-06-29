# SecureNet AI

A production-style machine learning platform for detecting phishing URLs with explainable predictions, robust data validation, and deployment-ready infrastructure.

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-S3%20%7C%20EC2-232F3E?logo=amazonaws&logoColor=white) ![MLflow](https://img.shields.io/badge/MLflow-Tracking-0194E2?logo=mlflow&logoColor=white) ![Scikit-learn](https://img.shields.io/badge/scikit--learn-Modeling-F7931E?logo=scikitlearn&logoColor=white)

---

## Project Overview

This project builds an end-to-end phishing detection system that analyzes URL-based features and predicts whether a website is likely phishing or legitimate. The solution combines machine learning, data validation, API serving, and cloud deployment practices into a single workflow suitable for real-world use.

It matters because phishing attacks remain one of the most common and costly forms of cyber threats. A fast, reliable classifier can help users, security teams, and product teams reduce exposure to deceptive websites.

---

### Model Selected

The classification model selected for production inference is a Random Forest classifier, trained on engineered URL-based features with preprocessing handled through a KNN imputer pipeline.

### Metrics

| Split | F1 Score | Precision | Recall |
| --- | ---: | ---: | ---: |
| Training | 99.15 | 98.8 | 99.49 |
| Test | 97.32 | 96.81 | 97.83 |

## Live Demo

<div align="center">
  <img src="https://img.shields.io/badge/Live%20Demo-Coming%20Soon-4F46E5?style=for-the-badge&logo=rocket&logoColor=white" alt="Live Demo Badge" />
</div>

A working demo of the application is available through the frontend experience, where users can enter URL-related features and receive an instant phishing/legitimate classification along with confidence, reasons, and recommendations.

> Replace the placeholder below with your deployment URL when ready:
>
> **Live Demo:** http://3.110.41.79:3000

## Dataset Overview

The project uses a structured phishing URL dataset with engineered features such as URL length, presence of IP addresses, SSL state, domain registration length, DNS information, and traffic-related attributes. These features are used to train and evaluate the classifier in a supervised setting.

---

## Features

- [x] End-to-end phishing URL classification pipeline
- [x] Data ingestion, validation, and drift detection
- [x] Feature preprocessing and model training workflow
- [x] FastAPI-based prediction API with health checks
- [x] Explainable prediction output with reasons and recommendations
- [x] Docker support for reproducible deployment
- [x] AWS S3 integration for artifact and model syncing
- [x] MLflow tracking for experiment monitoring
- [x] Modern frontend for interactive prediction use cases

---

## Project Architecture

The system is organized as a layered architecture that separates data processing, model training, inference, and user interaction.

```text
User
↓
Frontend
↓
FastAPI Backend
↓
Prediction Pipeline
↓
Model
↓
AWS S3
```

### Flow

1. A user submits URL-related features through the frontend.
2. The FastAPI backend validates the request and routes it to the prediction pipeline.
3. The trained model processes the input and returns a phishing/legitimate prediction.
4. The system generates supporting reasons and recommendations for the user.
5. Training artifacts and models can be stored and synced to AWS S3.

---

## Tech Stack

| Category | Technologies |
| --- | --- |
| Backend | FastAPI, Uvicorn, Pydantic |
| Machine Learning | Scikit-learn, NumPy, Pandas, MLflow |
| Frontend | Lovable |
| Data & Storage | CSV datasets, AWS S3, MongoDB-compatible persistence |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Experiment Tracking | MLflow, DagsHub |

---

## Project Structure

```text
.
├── app.py                  # FastAPI application entrypoint
├── main.py                 # Training execution entrypoint
├── requirements.txt        # Python dependencies
├── Dockerfile              # Container definition
├── setup.py                # Package configuration
├── data_schema/            # Dataset schema definition
├── final_model/            # Serialized model and preprocessing objects
├── frontend/               # React + Vite user interface
├── networksecurity/        # Core package for training and prediction logic
│   ├── components/         # Data ingestion, validation, transformation, training
│   ├── pipeline/           # Training and prediction workflows
│   ├── entity/             # Configuration and artifact entities
│   ├── utils/              # Utility functions and model helpers
│   └── cloud/              # AWS/S3 integration helpers
├── Artifacts/              # Local training artifacts and reports
└── logs/                   # Runtime and training logs
```

### Key folders

- `networksecurity/components`: Implements the modular ML pipeline stages.
- `networksecurity/pipeline`: Orchestrates training and inference workflows.
- `frontend`: Contains the interactive web experience for end users.
- `Artifacts`: Stores generated datasets, validation reports, and transformed data.
- `final_model`: Holds the production-ready trained model artifacts.

---

## Installation

<details>
<summary>Quick start</summary>

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

</details>

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Create a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows:

```bash
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the backend

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Docker

Build and run the application inside a container for consistent environments.

```bash
docker build -t network-security-predictor .
docker run -p 8000:8000 network-security-predictor
```

The backend will be available at:

```text
http://localhost:8000/docs
```

---

## CI/CD Pipeline

The repository is structured to support a robust continuous integration and deployment workflow through GitHub Actions.

A typical pipeline includes:

- Build: install dependencies and validate the project environment
- Test: run unit and integration checks for the Python backend and frontend
- Docker Build: construct the application container image
- Push Image: publish the image to a registry such as AWS ECR
- Deploy: release the application to an EC2 instance or container platform

This setup improves reliability, reproducibility, and deployment speed across environments.

---

## Model Training

The training workflow follows a structured machine learning lifecycle:

1. Data Validation
   - Verifies schema consistency and validates incoming data.
   - Detects dataset drift between training and validation sets.

2. Data Transformation
   - Applies preprocessing steps such as imputation and feature preparation.
   - Produces transformed train and test arrays for model learning.

3. Model Training
   - Trains multiple candidate classifiers.
   - Evaluates them using standard classification metrics.

4. Model Evaluation
   - Tracks performance with MLflow.
   - Stores the best-performing model artifact for inference.

5. Prediction Pipeline
   - Loads the trained preprocessor and classifier.
   - Serves predictions through the FastAPI endpoint with confidence and explanation output.

---

## AWS Deployment

The project is designed with cloud deployment in mind and can be deployed using industry-standard AWS services.

Recommended deployment flow:

- ECR: store the Docker image for containerized deployment
- EC2: host the FastAPI backend and frontend build output
- S3: store model artifacts, training outputs, and deployment assets
- IAM: manage secure access to AWS resources with least-privilege permissions

This approach provides a scalable path from local development to production-grade hosting.

---

## Future Improvements

Planned enhancements include:

- Add automated model monitoring and drift alerts
- Expand the feature set with richer URL and domain intelligence
- Improve explainability with SHAP-based insights
- Introduce user authentication and role-based access
- Add batch inference and scheduled retraining workflows

---

## Learning Outcomes

Building this project strengthened practical experience in:

- End-to-end machine learning system design
- FastAPI backend development
- Model packaging and deployment workflows
- Data validation and experiment tracking
- Dockerization and cloud deployment concepts
- Frontend integration for ML-powered applications

---

## Author

Built and maintained by Vedant Thakar.

- LinkedIn: [Vedant Thakr](https://www.linkedin.com/in/vedant-thakar-4ba561292/)
- GitHub: [vedant070206](https://github.com/vedant070206)
- Email: thakar2006@gmail.com
