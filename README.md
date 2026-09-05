# RECON.AI

### AI-Powered Financial Reconciliation & Exception Intelligence

RECON.AI is an AI-powered financial reconciliation and exception intelligence platform that compares orders, payments, and settlements, detects financial exceptions, investigates their root causes using an AI agent, evaluates deterministic business policies, and routes high-risk cases to human investigators.

The system is designed around a simple principle:

> **The LLM investigates. The Policy Engine controls. Humans make the final decision when required.**

---

## 🚀 Features

* Automated reconciliation of orders, payments, and settlements
* Financial exception detection and classification
* Amount mismatch and payment/settlement exception identification
* Evidence-based transaction investigation
* AI-powered root-cause analysis
* Local LLM-powered investigation using **Qwen3:4b**
* AI confidence scoring
* Financial impact calculation
* Recommended corrective actions
* Severity classification
* Deterministic policy evaluation
* `AUTO_RESOLVE` and `HUMAN_REVIEW` decisions
* Human-in-the-loop review workflow
* Investigator assignment
* Automated human-review email notifications
* Direct email link to the Human Review dashboard
* Batch evaluation of multiple transactions
* Evaluation metrics and performance analysis
* Interactive React dashboard
* Transaction search and filtering
* Evidence monitoring
* Policy monitoring
* Dark / Light mode
* REST APIs using FastAPI
* Automated testing using Pytest

---

# 🔄 End-to-End Workflow

```text
Orders / Payments / Settlements
              ↓
      Reconciliation Engine
              ↓
       Exception Detection
              ↓
        Evidence Builder
              ↓
      AI Investigation Agent
              ↓
        Policy Evaluation
          ↙            ↘
 AUTO_RESOLVE       HUMAN_REVIEW
                       ↓
              Investigator Assignment
                       ↓
              Email Notification
                       ↓
              Human Review Dashboard
                       ↓
                Final Decision
```

RECON.AI combines automated financial processing with AI investigation and controlled human oversight.

---

# 🧠 AI Investigation Agent

When an exception is detected, the AI Investigation Agent receives structured transaction evidence and analyzes the case.

The investigation produces:

* **Root Cause**
* **Financial Impact**
* **AI Confidence**
* **Recommended Action**
* **Human Review Requirement**

The investigation is returned as structured data so that the downstream policy engine can evaluate it reliably.

### Example

```text
Transaction:
Expected Amount  → ₹1500
Payment Amount   → ₹1500
Settlement       → ₹1250

Financial Impact → ₹250

AI Investigation
        ↓
Root Cause
Financial Impact
Confidence
Recommended Action
Human Review Requirement
        ↓
Policy Engine
```

The AI does **not** directly decide whether a transaction should be automatically resolved.

Instead:

```text
AI Investigation
       ↓
Policy Engine
       ↓
Business Decision
```

This separation helps keep business-critical decisions deterministic and controllable.

---

# 🛡️ Policy Engine

The Policy Engine applies deterministic business rules to the AI investigation.

Possible decisions are:

```text
AUTO_RESOLVE
HUMAN_REVIEW
```

A case can be routed to human review when:

* Human review is explicitly required
* Transaction severity is `HIGH`
* AI confidence is below the automation threshold
* Financial impact exceeds the configured automatic-resolution limit

Example:

```text
AI Confidence < 90%
        ↓
HUMAN_REVIEW
```

or:

```text
Severity = HIGH
        ↓
HUMAN_REVIEW
```

The Policy Engine acts as the control layer between AI analysis and financial automation.

---

# 👤 Human-in-the-Loop Review

High-risk or uncertain transactions are automatically routed to a Human Review workflow.

When a transaction requires human review, RECON.AI:

```text
Exception
   ↓
AI Investigation
   ↓
Policy Engine
   ↓
HUMAN_REVIEW
   ↓
Investigator Assignment
   ↓
Email Notification
   ↓
Human Review Dashboard
```

The assigned investigator can review:

* Transaction details
* Severity
* AI root cause
* Financial impact
* AI confidence
* Recommended action
* Evidence
* Policy decision

The investigator can then choose:

```text
APPROVE RESOLUTION
REJECT RESOLUTION
REQUEST MORE INVESTIGATION
```

The final human decision is recorded in the dashboard.

This creates a **human-in-the-loop architecture** where AI assists investigation while humans retain control over sensitive financial decisions.

---

# 📧 Human Review Email Notifications

When a case requires human review, RECON.AI can automatically send an email notification to the assigned investigator.

The email contains:

* Transaction ID
* Severity
* Policy decision
* AI root cause
* Financial impact
* AI confidence
* Recommended action
* Investigation evidence
* Direct link to the Human Review dashboard

Example workflow:

```text
Policy Engine
     ↓
HUMAN_REVIEW
     ↓
Investigator Assigned
     ↓
Email Sent
     ↓
"Open Human Review Dashboard"
     ↓
Human Decision
```

Email notifications are intentionally disabled during batch evaluation to prevent sending large numbers of test emails.

---

# 📊 Dashboard

The RECON.AI dashboard provides an overview of the reconciliation system.

### Dashboard metrics include:

* Total Transactions
* Matched Transactions
* Exceptions
* High-Severity Cases
* Total Financial Impact
* Transaction Activity
* Recent Exceptions
* System Status

The dashboard provides a centralized view of the financial reconciliation pipeline.

---

# 🔎 Transaction Monitoring

The Transactions page provides transaction-level monitoring.

Users can:

* Search transactions by Order ID
* View reconciliation status
* Identify matched transactions
* Identify exceptions
* View amount differences
* View transaction severity
* Start an AI investigation

Example:

```text
Order ID: ORD-1010
Status: PAYMENT_FAILED
Severity: HIGH
```

A transaction can be selected and sent through the AI investigation pipeline.

---

# 🔬 Investigation Dashboard

The Investigations page displays AI-generated investigation results.

For each investigated transaction, users can view:

* Root Cause
* Financial Impact
* AI Confidence
* Recommended Action
* Human Review Requirement
* Policy Decision
* Severity
* Expected Amount
* Payment Amount
* Settlement Amount

The page also identifies transactions requiring human review.

---

# 🧾 Evidence Builder

Before the AI investigation begins, RECON.AI builds a structured evidence summary from the transaction data.

The evidence can include:

```text
Transaction ID
Expected Amount
Payment Amount
Settlement Amount
Payment Status
Settlement Status
Exception Type
Severity
Amount Difference
```

The evidence builder creates the factual context used by the AI investigation agent.

This helps the AI reason from transaction data instead of relying only on an unstructured prompt.

---

# 📚 Evidence Monitoring

The Evidence page provides visibility into the evidence used during transaction investigations.

The purpose of the Evidence layer is to make the AI investigation more traceable and explainable.

```text
Transaction
     ↓
Evidence
     ↓
AI Investigation
     ↓
Policy Decision
```

---

# 📜 Policy Monitoring

The Policies page displays the business rules used to determine whether an exception can be automatically resolved or must be reviewed by a human.

The system separates:

```text
AI Reasoning
      +
Deterministic Business Rules
```

This provides an additional control layer for financial automation.

---

# 🧪 Batch Evaluation

RECON.AI includes a Batch Evaluation workflow for evaluating the AI investigation and decision pipeline across multiple transactions.

Instead of investigating transactions manually one at a time, the evaluation system processes a batch of transactions.

```text
Multiple Transactions
        ↓
Batch Processing
        ↓
AI Investigation
        ↓
Policy Evaluation
        ↓
Evaluation Metrics
```

Batch evaluation can be used to analyze:

* Total transactions evaluated
* Successful investigations
* Failed investigations
* Human review decisions
* Auto-resolved decisions
* Confidence values
* Financial impact
* Processing results

The evaluation workflow uses:

```text
send_notification=False
```

so that batch testing does not send human-review emails for every transaction.

This makes it suitable for testing and evaluating the complete decision pipeline.

---

# 📈 Evaluation Workflow

The Evaluation page provides a way to inspect how the system performs across a collection of transactions.

The evaluation pipeline is:

```text
Transaction Dataset
        ↓
Reconciliation
        ↓
Exception Detection
        ↓
Evidence Generation
        ↓
AI Investigation
        ↓
Policy Evaluation
        ↓
Evaluation Results
```

This allows the system to be tested beyond a single transaction.

---

# 🎨 Dark / Light Mode

RECON.AI supports both:

```text
🌙 Dark Mode
☀️ Light Mode
```

Users can switch between themes directly from the dashboard.

The selected theme is stored in browser `localStorage`, allowing the preference to persist across page refreshes.

Theme switching is implemented at the application level so that the dashboard, transactions, investigations, policies, evidence, evaluation, and human-review pages can follow the selected theme.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │    Raw CSV Data     │
                    │ Orders / Payments /  │
                    │     Settlements     │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │ Reconciliation      │
                    │      Engine         │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │ Exception Detection │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │   Evidence Builder  │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │ AI Investigation    │
                    │   Qwen3:4b / Ollama │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │    Policy Engine    │
                    └──────────┬──────────┘
                         ↙             ↘
               AUTO_RESOLVE        HUMAN_REVIEW
                                      ↓
                           ┌──────────────────┐
                           │ Investigator     │
                           │ Assignment       │
                           └────────┬─────────┘
                                    ↓
                           ┌──────────────────┐
                           │ Email Notification│
                           └────────┬─────────┘
                                    ↓
                           ┌──────────────────┐
                           │ Human Review     │
                           │ Dashboard        │
                           └──────────────────┘
```

---

# 🏛️ Application Architecture

```text
Frontend
React + Vite
     │
     │ REST API
     ↓
FastAPI Backend
     │
     ├── Reconciliation Engine
     │
     ├── Exception Engine
     │
     ├── Evidence Builder
     │
     ├── AI Investigation Agent
     │        │
     │        ↓
     │      Ollama
     │        │
     │        ↓
     │     Qwen3:4b
     │
     ├── Policy Engine
     │
     ├── Investigator Assignment
     │
     └── Email Service
```

---

# 📁 Project Structure

```text
recon-ai/
│
├── data/
│   ├── raw/
│   │   ├── orders.csv
│   │   ├── payments.csv
│   │   └── settlements.csv
│   │
│   └── transactions.csv
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Investigations.jsx
│   │   │   ├── Evidence.jsx
│   │   │   ├── Policies.jsx
│   │   │   ├── Evaluation.jsx
│   │   │   └── HumanReview.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── src/
│   ├── agent.py
│   ├── batch_processor.py
│   ├── email_service.py
│   ├── evidence_builder.py
│   ├── exception_engine.py
│   ├── investigator.py
│   ├── investigator_assignment.py
│   ├── llm_engine.py
│   ├── main.py
│   ├── pipeline.py
│   ├── policy_engine.py
│   ├── reconciliation.py
│   ├── schemas.py
│   └── validation.py
│
├── tests/
│   ├── test_reconciliation.py
│   ├── test_exception_engine.py
│   └── ...
│
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

> `.env` contains private configuration such as SMTP credentials and should never be committed to GitHub.

---

# ⚙️ Technology Stack

## Backend

* Python
* FastAPI
* Pandas
* Pydantic
* Uvicorn

## AI / Agent

* Local LLM
* Qwen3:4b
* Ollama
* Evidence-based investigation
* Structured AI output
* AI confidence scoring

## Frontend

* React
* Vite
* JavaScript
* CSS
* React Router
* Framer Motion
* Lucide React

## Email

* Python SMTP
* Gmail SMTP
* HTML email notifications

## Testing

* Pytest

## Data

* CSV
* Pandas

---

# 🔌 API Endpoints

Current API functionality includes:

```text
GET  /transactions
GET  /transaction/{order_id}
POST /investigate
GET  /evaluation
```

The FastAPI backend also provides automatic interactive API documentation.

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

# ▶️ Run Locally

## 1. Clone the Repository

```bash
git clone https://github.com/Tanushrimp000/recon.ai.git
cd recon.ai
```

---

## 2. Create Virtual Environment

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

---

## 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

# 🤖 4. Install and Run Ollama

RECON.AI uses Ollama to run the local Qwen3:4b model.

Make sure Ollama is installed and the required model is available.

Check the model:

```bash
ollama list
```

If required, pull the model:

```bash
ollama pull qwen3:4b
```

Start the Ollama server:

```bash
ollama serve
```

Keep this terminal running.

The default Ollama API is:

```text
http://localhost:11434
```

---

# 🔐 5. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
```

The SMTP password should be a Gmail **App Password**, not your normal Gmail password.

Never commit `.env` to GitHub.

---

# 🚀 6. Start the Backend

From the project root:

```bash
python -m uvicorn src.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 7. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Testing

Run all tests:

```bash
pytest
```

Run a specific test:

```bash
pytest tests/test_reconciliation.py
```

Testing covers core components such as:

* Reconciliation
* Exception detection
* Validation
* AI investigation
* Pipeline functionality

---

# 🔁 Example Investigation

Consider a transaction:

```text
Order ID          : ORD-1042
Expected Amount   : 1500
Payment Amount    : 1500
Settlement Amount : 1250

Payment Status    : SUCCESS
Settlement Status : PARTIAL

Exception Type    : AMOUNT_MISMATCH
Severity          : HIGH
```

The system processes it as:

```text
ORD-1042
   ↓
Exception Detected
   ↓
Evidence Built
   ↓
AI Investigation
   ↓
Financial Impact Calculated
   ↓
AI Confidence Generated
   ↓
Policy Evaluation
   ↓
HUMAN_REVIEW
```

The investigator can then review the case through the Human Review dashboard.

---

# 🔐 Security Considerations

RECON.AI uses environment variables for sensitive configuration.

The following files should not be committed:

```text
.env
.venv/
__pycache__/
node_modules/
dist/
```

The `.gitignore` file should contain:

```gitignore
.env
.venv/
__pycache__/
*.pyc
node_modules/
dist/
```

Do not commit:

* Gmail passwords
* Gmail App Passwords
* API keys
* Authentication tokens
* Private credentials

---

# 🎯 Design Principles

RECON.AI follows several important design principles.

### 1. Evidence Before AI

The AI receives structured transaction evidence before performing an investigation.

### 2. AI Does Not Control Business Rules

The LLM produces investigation results, but deterministic policies make the automation decision.

### 3. Human Oversight

High-risk and uncertain cases can be escalated to human investigators.

### 4. Explainability

The system exposes:

```text
Evidence
   ↓
Root Cause
   ↓
Financial Impact
   ↓
Confidence
   ↓
Recommendation
   ↓
Policy Decision
```

### 5. Controlled Automation

The system does not blindly automate every exception.

Instead:

```text
Low Risk + High Confidence
          ↓
      AUTO_RESOLVE

High Risk / Low Confidence
          ↓
      HUMAN_REVIEW
```

---

# 🌟 Key Differentiator

RECON.AI is not simply an AI chatbot for financial data.

It is an **end-to-end AI-assisted financial operations workflow**.

The system combines:

```text
Financial Reconciliation
          +
Exception Detection
          +
Evidence Generation
          +
AI Investigation
          +
Deterministic Policies
          +
Automated Routing
          +
Human Review
          +
Email Notification
          +
Evaluation
```

This creates a controlled workflow where AI assists investigation while deterministic policies and human oversight control financial decisions.

---

# 🚧 Future Improvements

Potential future improvements include:

* Real-time transaction processing
* PostgreSQL integration
* Payment gateway integrations
* Advanced anomaly detection
* Agent observability and tracing
* Persistent human-review records
* Automated remediation
* Comprehensive audit logs
* Cloud deployment
* Multi-agent investigation
* Role-based access control
* Production-grade authentication
* Advanced evaluation benchmarks
* LLM evaluation and hallucination detection

---

# 📌 Project Status

**Project Status: Functional Prototype**

RECON.AI currently includes:

* Financial reconciliation
* Exception detection
* Evidence generation
* AI-powered investigation
* Qwen3:4b local LLM integration
* Deterministic policy evaluation
* Auto-resolution decisioning
* Human-review workflow
* Investigator assignment
* Email notifications
* Human final decisions
* Batch evaluation
* REST APIs
* Automated tests
* Interactive React dashboard
* Evidence monitoring
* Policy monitoring
* Dark / Light mode

---

# 🎓 Project Purpose

RECON.AI demonstrates how AI agents can be integrated into financial operations while maintaining deterministic controls and human oversight.

The project focuses on building a practical architecture for:

```text
AI-Assisted Investigation
        +
Controlled Automation
        +
Human-in-the-Loop Decisions
```

---

# 👩‍💻 Author

**Tanushri Mahesh Palleda**

Computer Science Engineering
Atria Institute of Technology, Bengaluru

**Interests:**
AI/ML | AI Agents | Python | Software Development | DSA

---

This project is developed for educational, research, hackathon, and demonstration purposes.

---

## 🔗 Repository

GitHub:

https://github.com/Tanushrimp000/recon.ai
