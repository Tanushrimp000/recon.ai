import time
from collections import Counter

import pandas as pd
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.evidence_builder import build_evidence
from src.reconciliation import reconcile_transactions
from src.exception_engine import analyze_exception
from src.investigator import investigate_exception
from src.agent import run_recon_agent
from src.batch_processor import process_transactions
from src.pipeline import run_pipeline
from src.validation import validate_transaction


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="RECON.AI",
    description="AI-powered financial reconciliation and exception intelligence",
    version="0.1.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "project": "RECON.AI",
        "status": "online",
        "version": "0.1.0"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ============================================================
# RECONCILIATION
# ============================================================

@app.get("/reconcile")
def reconcile():

    results = reconcile_transactions()

    exception_results = []

    for _, row in results.iterrows():

        if row["status"] != "MATCHED":

            analysis = analyze_exception(row["status"])

            investigation = investigate_exception(
                exception_type=row["status"],
                order_id=row.get("order_id"),
                amount_difference=row.get("difference")
            )

            exception_results.append({
                "order_id": row.get("order_id"),
                "status": row["status"],
                "severity": analysis["severity"],
                "category": analysis["category"],
                "recommended_action": analysis["recommended_action"],
                "investigation": investigation
            })

    return {
        "total_transactions": len(results),
        "matched": int(
            (results["status"] == "MATCHED").sum()
        ),
        "exceptions": len(exception_results),
        "exception_details": exception_results
    }


# ============================================================
# TRANSACTIONS
# ============================================================

@app.get("/transactions")
def get_transactions():

    results = reconcile_transactions()

    transactions = []

    for _, row in results.iterrows():

        difference = row.get("difference")

        if pd.isna(difference):
            difference = None

        elif hasattr(difference, "item"):
            difference = difference.item()

        status = row.get("status")

        if status == "MATCHED":

            severity = "LOW"

        elif status in [
            "PAYMENT_FAILED",
            "MISSING_PAYMENT",
            "MISSING_SETTLEMENT",
            "SETTLEMENT_EXCEPTION",
            "AMOUNT_MISMATCH",
            "DUPLICATE_PAYMENT"
        ]:

            severity = "HIGH"

        else:

            severity = "MEDIUM"

        transactions.append({
            "order_id": row.get("order_id"),
            "status": status,
            "expected_amount": row.get("expected_amount"),
            "payment_amount": row.get("payment_amount"),
            "settlement_amount": row.get("settlement_amount"),
            "amount_difference": difference,
            "severity": severity
        })

    return {
        "total": len(transactions),
        "transactions": transactions
    }


# ============================================================
# SINGLE TRANSACTION DETAILS
# ============================================================

@app.get("/transaction/{order_id}")
def get_transaction(order_id: str):

    base_dir = Path(__file__).resolve().parent.parent
    data_dir = base_dir / "data" / "raw"

    orders = pd.read_csv(data_dir / "orders.csv")
    payments = pd.read_csv(data_dir / "payments.csv")
    settlements = pd.read_csv(data_dir / "settlements.csv")

    order = orders[orders["order_id"] == order_id]

    if order.empty:

        return {
            "error": "Transaction not found"
        }

    order_row = order.iloc[0]

    payment_rows = payments[
        payments["order_id"] == order_id
    ]

    settlement_rows = settlements[
        settlements["order_id"] == order_id
    ]

    expected_amount = float(order_row["amount"])

    payment_amount = (
        float(payment_rows.iloc[0]["amount"])
        if not payment_rows.empty
        else 0
    )

    settlement_amount = (
        float(settlement_rows.iloc[0]["settlement_amount"])
        if not settlement_rows.empty
        else 0
    )

    payment_status = (
        str(payment_rows.iloc[0]["status"])
        if not payment_rows.empty
        else "MISSING"
    )

    settlement_status = (
        str(settlement_rows.iloc[0]["settlement_status"])
        if not settlement_rows.empty
        else "MISSING"
    )

    # Determine exception type and severity

    if len(payment_rows) > 1:

        exception_type = "DUPLICATE_PAYMENT"
        severity = "HIGH"

    elif payment_rows.empty:

        exception_type = "MISSING_PAYMENT"
        severity = "HIGH"

    elif payment_status != "SUCCESS":

        exception_type = "PAYMENT_FAILED"
        severity = "HIGH"

    elif settlement_rows.empty:

        exception_type = "MISSING_SETTLEMENT"
        severity = "HIGH"

    elif settlement_status != "SETTLED":

        exception_type = "SETTLEMENT_EXCEPTION"
        severity = "HIGH"

    elif payment_amount != expected_amount:

        exception_type = "PAYMENT_AMOUNT_MISMATCH"
        severity = "MEDIUM"

    elif settlement_amount != expected_amount:

        exception_type = "AMOUNT_MISMATCH"
        severity = "HIGH"

    else:

        exception_type = "MATCHED"
        severity = "LOW"

    return {
        "order_id": order_id,
        "expected_amount": expected_amount,
        "payment_amount": payment_amount,
        "settlement_amount": settlement_amount,
        "payment_status": payment_status,
        "settlement_status": settlement_status,
        "exception_type": exception_type,
        "severity": severity
    }


# ============================================================
# POLICIES
# ============================================================

@app.get("/policies")
def get_policies():

    return {
        "policies": [

            {
                "id": "POL-001",
                "name": "Human Review Override",
                "description": (
                    "Transactions explicitly flagged by the AI "
                    "investigation for human review cannot be "
                    "automatically resolved."
                ),
                "condition": "human_review_required = true",
                "decision": "HUMAN_REVIEW",
                "priority": 1
            },

            {
                "id": "POL-002",
                "name": "High Severity Protection",
                "description": (
                    "High-severity financial exceptions always "
                    "require human review."
                ),
                "condition": "severity = HIGH",
                "decision": "HUMAN_REVIEW",
                "priority": 2
            },

            {
                "id": "POL-003",
                "name": "AI Confidence Threshold",
                "description": (
                    "Automatic resolution requires a sufficiently "
                    "confident AI investigation."
                ),
                "condition": "confidence < 0.90",
                "decision": "HUMAN_REVIEW",
                "priority": 3
            },

            {
                "id": "POL-004",
                "name": "Financial Impact Limit",
                "description": (
                    "Exceptions with a financial impact above "
                    "₹500 cannot be automatically resolved."
                ),
                "condition": "abs(financial_impact) > ₹500",
                "decision": "HUMAN_REVIEW",
                "priority": 4
            },

            {
                "id": "POL-005",
                "name": "Automatic Resolution",
                "description": (
                    "An exception may be automatically resolved "
                    "only when all human-review policies are satisfied."
                ),
                "condition": "All previous policies passed",
                "decision": "AUTO_RESOLVE",
                "priority": 5
            }

        ]
    }


# ============================================================
# EVIDENCE
# ============================================================

@app.get("/evidence/{order_id}")
def get_evidence(order_id: str):

    base_dir = Path(__file__).resolve().parent.parent
    data_dir = base_dir / "data" / "raw"

    orders = pd.read_csv(data_dir / "orders.csv")
    payments = pd.read_csv(data_dir / "payments.csv")
    settlements = pd.read_csv(data_dir / "settlements.csv")

    order = orders[orders["order_id"] == order_id]

    if order.empty:

        return {
            "error": "Transaction not found"
        }

    order_row = order.iloc[0]

    payment_rows = payments[
        payments["order_id"] == order_id
    ]

    settlement_rows = settlements[
        settlements["order_id"] == order_id
    ]

    expected_amount = float(order_row["amount"])

    payment_amount = (
        float(payment_rows.iloc[0]["amount"])
        if not payment_rows.empty
        else 0
    )

    settlement_amount = (
        float(settlement_rows.iloc[0]["settlement_amount"])
        if not settlement_rows.empty
        else 0
    )

    payment_status = (
        str(payment_rows.iloc[0]["status"])
        if not payment_rows.empty
        else "MISSING"
    )

    settlement_status = (
        str(settlement_rows.iloc[0]["settlement_status"])
        if not settlement_rows.empty
        else "MISSING"
    )

    if len(payment_rows) > 1:

        exception_type = "DUPLICATE_PAYMENT"
        severity = "HIGH"

    elif payment_rows.empty:

        exception_type = "MISSING_PAYMENT"
        severity = "HIGH"

    elif payment_status != "SUCCESS":

        exception_type = "PAYMENT_FAILED"
        severity = "HIGH"

    elif settlement_rows.empty:

        exception_type = "MISSING_SETTLEMENT"
        severity = "HIGH"

    elif settlement_status != "SETTLED":

        exception_type = "SETTLEMENT_EXCEPTION"
        severity = "HIGH"

    elif payment_amount != expected_amount:

        exception_type = "PAYMENT_AMOUNT_MISMATCH"
        severity = "MEDIUM"

    elif settlement_amount != expected_amount:

        exception_type = "AMOUNT_MISMATCH"
        severity = "HIGH"

    else:

        exception_type = "MATCHED"
        severity = "LOW"

    transaction = {

        "order_id": order_id,

        "expected_amount": expected_amount,

        "payment_amount": payment_amount,

        "settlement_amount": settlement_amount,

        "payment_status": payment_status,

        "settlement_status": settlement_status,

        "exception_type": exception_type,

        "severity": severity
    }

    evidence = build_evidence(transaction)

    return {

        "order_id": order_id,

        "evidence": {

            "transaction_id": order_id,

            "expected_amount": expected_amount,

            "payment_amount": payment_amount,

            "settlement_amount": settlement_amount,

            "payment_status": payment_status,

            "settlement_status": settlement_status,

            "exception_type": exception_type,

            "severity": severity
        },

        "summary": evidence
    }


# ============================================================
# AI INVESTIGATION
# ============================================================

@app.post("/investigate")
def investigate(transaction: dict):

    # Individual investigation.
    # Email notification is ENABLED.
    result = run_recon_agent(
        transaction,
        send_notification=True
    )

    return result


# ============================================================
# BATCH INVESTIGATION
# ============================================================

@app.post("/batch-investigate")
def batch_investigate(transactions: list[dict]):

    # Batch processing should not automatically
    # send emails for every human-review case.
    return process_transactions(transactions)


# ============================================================
# FULL PIPELINE
# ============================================================

@app.post("/run-pipeline")
def run_full_pipeline():

    return run_pipeline("data/transactions.csv")


# ============================================================
# VALIDATE TRANSACTION
# ============================================================

@app.post("/validate-transaction")
def validate_transaction_api(transaction: dict):

    result = validate_transaction(transaction)

    if not result["valid"]:

        return {
            "status": "INVALID",
            "error": result["error"]
        }

    return {
        "status": "VALID",
        "message": "Transaction passed validation."
    }


# ============================================================
# EVALUATION
# ============================================================

@app.get("/evaluation")
def evaluation():

    start_time = time.perf_counter()

    # --------------------------------------------------------
    # RUN MULTI-SOURCE RECONCILIATION
    # --------------------------------------------------------

    results = reconcile_transactions()

    reconciliation_time = time.perf_counter() - start_time

    total = len(results)

    if total == 0:

        return {

            "transactions_processed": 0,

            "processing_time_seconds": 0,

            "throughput": 0,

            "accuracy": None,

            "classification": {

                "matched": 0,

                "payment_failed": 0,

                "amount_mismatch": 0,

                "missing_settlement": 0,

                "duplicate_payment": 0,

                "other_exceptions": 0
            },

            "ai": {

                "investigated": 0,

                "high_confidence": 0,

                "auto_resolve": 0,

                "human_review": 0
            },

            "exception_breakdown": {},

            "human_review_transactions": []
        }

    # --------------------------------------------------------
    # STATUS COUNTS
    # --------------------------------------------------------

    status_counts = results["status"].value_counts().to_dict()

    matched = int(
        status_counts.get("MATCHED", 0)
    )

    payment_failed = int(
        status_counts.get("PAYMENT_FAILED", 0)
    )

    amount_mismatch = int(
        status_counts.get("AMOUNT_MISMATCH", 0)
    )

    missing_settlement = int(
        status_counts.get("MISSING_SETTLEMENT", 0)
    )

    duplicate_payment = int(
        status_counts.get("DUPLICATE_PAYMENT", 0)
    )

    # --------------------------------------------------------
    # OTHER EXCEPTIONS
    # --------------------------------------------------------

    known_statuses = {

        "MATCHED",

        "PAYMENT_FAILED",

        "AMOUNT_MISMATCH",

        "MISSING_SETTLEMENT",

        "DUPLICATE_PAYMENT"
    }

    other_exceptions = sum(

        int(count)

        for status, count in status_counts.items()

        if status not in known_statuses
    )

    # --------------------------------------------------------
    # EXCEPTION BREAKDOWN
    # --------------------------------------------------------

    exception_breakdown = {

        str(status): int(count)

        for status, count in status_counts.items()

        if status != "MATCHED"
    }

    # --------------------------------------------------------
    # AI INVESTIGATION
    # --------------------------------------------------------

    ai_investigated = 0

    high_confidence = 0

    auto_resolve = 0

    human_review = 0

    human_review_transactions = []

    # Only exceptions need AI investigation.
    # Matched transactions do not need investigation.

    for _, row in results.iterrows():

        status = str(
            row.get("status", "")
        )

        if status == "MATCHED":

            continue

        # ----------------------------------------------------
        # BUILD TRANSACTION FOR AI AGENT
        # ----------------------------------------------------

        transaction = {

            "order_id": row.get("order_id"),

            "expected_amount": row.get(
                "expected_amount",
                row.get("order_amount", 0)
            ),

            "payment_amount": row.get(
                "payment_amount",
                0
            ),

            "settlement_amount": row.get(
                "settlement_amount",
                0
            ),

            "payment_status": row.get(
                "payment_status",
                ""
            ),

            "settlement_status": row.get(
                "settlement_status",
                ""
            ),

            "exception_type": status,

            "severity": (

                "HIGH"

                if status in {

                    "PAYMENT_FAILED",

                    "MISSING_PAYMENT",

                    "MISSING_SETTLEMENT",

                    "SETTLEMENT_EXCEPTION",

                    "AMOUNT_MISMATCH",

                    "DUPLICATE_PAYMENT"

                }

                else "MEDIUM"
            )
        }

        # ----------------------------------------------------
        # RUN AI AGENT
        # ----------------------------------------------------

        try:

            # IMPORTANT:
            # Evaluation does NOT send emails.
            # Otherwise every HUMAN_REVIEW case would
            # send an email during dashboard evaluation.

            agent_result = run_recon_agent(
                transaction,
                send_notification=False
            )

            investigation = agent_result.get(
                "investigation"
            )

            decision = agent_result.get(
                "decision"
            )

            # ------------------------------------------------
            # SUCCESSFUL AI INVESTIGATION
            # ------------------------------------------------

            if investigation:

                ai_investigated += 1

                confidence = float(
                    investigation.get(
                        "confidence",
                        0
                    )
                )

                if confidence >= 0.90:

                    high_confidence += 1

            # ------------------------------------------------
            # POLICY DECISION
            # ------------------------------------------------

            if decision == "AUTO_RESOLVE":

                auto_resolve += 1

            elif decision == "HUMAN_REVIEW":

                human_review += 1

                human_review_transactions.append({

                    "order_id":
                        transaction["order_id"],

                    "exception_type":
                        status,

                    "severity":
                        transaction["severity"],

                    "decision":
                        decision,

                    "investigator":
                        agent_result.get(
                            "investigator"
                        ),

                    "email_notification":
                        agent_result.get(
                            "email_notification"
                        )
                })

        except Exception as exc:

            # ------------------------------------------------
            # AI FAILURE = HUMAN REVIEW
            # ------------------------------------------------

            human_review += 1

            human_review_transactions.append({

                "order_id":
                    transaction["order_id"],

                "exception_type":
                    status,

                "severity":
                    transaction["severity"],

                "decision":
                    "HUMAN_REVIEW",

                "investigator":
                    None,

                "email_notification": {

                    "sent": False
                }
            })

            print(
                f"AI investigation failed for "
                f"{transaction['order_id']}: {exc}"
            )

    # --------------------------------------------------------
    # TOTAL EVALUATION TIME
    # --------------------------------------------------------

    processing_time = (
        time.perf_counter() - start_time
    )

    throughput = (

        total / processing_time

        if processing_time > 0

        else 0
    )

    # --------------------------------------------------------
    # RETURN EVALUATION
    # --------------------------------------------------------

    return {

        "transactions_processed":
            total,

        "processing_time_seconds":
            round(
                processing_time,
                4
            ),

        "throughput":
            round(
                throughput,
                2
            ),

        # No independent ground-truth dataset yet.
        "accuracy":
            None,

        "classification": {

            "matched":
                matched,

            "payment_failed":
                payment_failed,

            "amount_mismatch":
                amount_mismatch,

            "missing_settlement":
                missing_settlement,

            "duplicate_payment":
                duplicate_payment,

            "other_exceptions":
                other_exceptions
        },

        "ai": {

            "investigated":
                ai_investigated,

            "high_confidence":
                high_confidence,

            "auto_resolve":
                auto_resolve,

            "human_review":
                human_review
        },

        "exception_breakdown":
            exception_breakdown,

        "human_review_transactions":
            human_review_transactions
    }