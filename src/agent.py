import json

from src.evidence_builder import build_evidence
from src.llm_engine import investigate_transaction
from src.policy_engine import evaluate_policy


def run_recon_agent(transaction):

    evidence = build_evidence(transaction)

    investigation_text = investigate_transaction(evidence)

    investigation = json.loads(investigation_text)

    severity = transaction.get("severity", "medium")

    decision = evaluate_policy(
        investigation["financial_impact"],
        investigation["confidence"],
        investigation["human_review_required"],
        severity
    )

    return {
        "order_id": transaction["order_id"],
        "investigation": {
            **investigation,
            "expected_amount": transaction["expected_amount"],
            "settlement_amount": transaction["settlement_amount"],
            "severity": severity
        },
        "decision": decision["decision"],
        "financial_impact": investigation["financial_impact"]
    }