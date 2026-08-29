# RECON.AI

### AI-Powered Financial Reconciliation & Exception Intelligence

RECON.AI is an AI-powered financial reconciliation platform that compares orders, payments, and settlements, detects financial exceptions, investigates their root causes using AI, and applies policy-based decisions for automated resolution or human review.

---

## 🚀 Features

- Automated reconciliation of orders, payments, and settlements
- Exception detection and classification
- AI-powered transaction investigation
- Evidence-based root-cause analysis
- Financial impact calculation
- AI confidence scoring
- Recommended corrective actions
- Severity classification
- Policy-based decision making
- AUTO_RESOLVE and HUMAN_REVIEW decisions
- Interactive React dashboard
- Transaction search and filtering
- Evidence and policy monitoring
- Automated testing with Pytest

---

## 🔄 End-to-End Workflow

```text
Orders / Payments / Settlements
              ↓
     Reconciliation Engine
              ↓
       Exception Engine
              ↓
        Evidence Builder
              ↓
    AI Investigation Agent
              ↓
       Policy Engine
         ↙          ↘
AUTO_RESOLVE     HUMAN_REVIEW
         ↘          ↙
       React Dashboard
```

---

## 🧠 AI Investigation

For each exception, the AI Investigation Agent analyzes transaction evidence and determines:

- Root Cause
- Financial Impact
- AI Confidence
- Recommended Action
- Human Review Requirement
- Severity

The AI investigation result is passed to the Policy Engine rather than directly determining the final business decision.
---

## 🛡️ Policy Engine

The Policy Engine applies deterministic business rules to the AI investigation results.

Possible decisions:

```text
AUTO_RESOLVE
HUMAN_REVIEW
```
High-risk or uncertain transactions can be escalated for human review.

---

## 📊 Dashboard

The RECON.AI dashboard provides:

- Total Transactions
- Matched Transactions
- Exceptions
- Human Review / High-Severity Cases
- Total Financial Impact
- Transaction Activity
- System Status
- Recent Exceptions

---

## 🔎 Transaction Monitoring

The Transactions page allows users to:

- Search transactions by Order ID
- Filter matched transactions
- Filter exceptions
- View reconciliation status
- View amount differences
- Start an AI investigation

---

## 🔬 Investigation Dashboard

The Investigations page displays:

- Root Cause
- Financial Impact
- AI Confidence
- Recommended Action
- Human Review
- Policy Decision
- Severity
- Expected Amount
- Settlement Amount

---

## 🏗️ System Architecture

```text
Raw CSV Data
    ↓
Reconciliation Engine
    ↓
Exception Detection
    ↓
Evidence Builder
    ↓
AI Investigation Agent
    ↓
Policy Engine
    ↓
React Dashboard
```
---

## 📁 Project Structure

```text
recon-ai/
├── data/
│   ├── raw/
│   │   ├── orders.csv
│   │   ├── payments.csv
│   │   └── settlements.csv
│   └── transactions.csv
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Transactions.jsx
│       │   ├── Investigations.jsx
│       │   ├── Evidence.jsx
│       │   └── Policies.jsx
│       ├── App.jsx
│       └── index.css
│
├── src/
│   ├── agent.py
│   ├── evidence_builder.py
│   ├── exception_engine.py
│   ├── investigator.py
│   ├── llm_engine.py
│   ├── main.py
│   ├── pipeline.py
│   ├── policy_engine.py
│   ├── reconciliation.py
│   ├── schemas.py
│   └── validation.py
│
├── tests/
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚙️ Technology Stack
### Backend

- Python
- FastAPI
- Pandas
- Pydantic
- Uvicorn

### AI

- LLM-powered investigation
- AI agents
- Evidence-based reasoning
- Structured investigation output

### Frontend

- React
- Vite
- JavaScript
- CSS
- Framer Motion
- Lucide React
- React Router

### Testing

- Pytest

---

## ▶️ Run Locally

### Backend

From the project root:

```python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---


## 🧪 Testing

Run all tests:

```powershell
pytest
```

Run a specific test:

```powershell
pytest tests/test_reconciliation.py
```

## 🔌 API Endpoints

```text
GET  /transactions
GET  /transaction/{order_id}
POST /investigate
```

---

## 📌 Example Exception

**Order ID:** `ORD-1010`
**Status:** `PAYMENT_FAILED`
**Severity:**  `HIGH`

The transaction can be investigated by the AI agent, analyzed using transaction evidence, and evaluated by the Policy Engine for:

```text
AUTO_RESOLVE
        or
HUMAN_REVIEW
```

---

## 🎯 Project Goal

RECON.AI demonstrates how AI agents can assist financial operations while keeping business decisions controlled through deterministic policies.

The system combines:

```text
Financial Reconciliation
        +
Exception Detection
        +
AI Investigation
        +
Policy-Based Decisions
        +
Human Oversight
```

---

## 🚧 Future Improvements

- Real-time transaction processing
- PostgreSQL integration
- Payment gateway integrations
- Advanced anomaly detection
- Agent observability and tracing
- Human approval workflows
- Automated remediation
- Audit logs
- Cloud deployment
- Multi-agent investigation

---

## 📌 Project Status

**Project Status: Functional Prototype**

RECON.AI currently includes reconciliation, exception detection, evidence generation, AI investigation, policy evaluation, REST APIs, automated tests, and a React-based monitoring dashboard.

---

### 👩‍💻 Author

**Tanushri Mahesh Palleda**

Computer Science Engineering
Atria Institute of Technology, Bengaluru

**Interests:** AI/ML | AI Agents | Python | Software Development | DSA

---

This project is developed for educational, research, and demonstration purposes.

