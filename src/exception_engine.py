from typing import Dict


EXCEPTION_RULES = {
    "DUPLICATE_PAYMENT": {
        "severity": "HIGH",
        "category": "PAYMENT",
        "action": "Review duplicate payment and initiate refund if confirmed."
    },
    "MISSING_PAYMENT": {
        "severity": "HIGH",
        "category": "PAYMENT",
        "action": "Verify payment gateway records and retry reconciliation."
    },
    "PAYMENT_FAILED": {
        "severity": "MEDIUM",
        "category": "PAYMENT",
        "action": "Check payment failure reason and notify customer if required."
    },
    "MISSING_SETTLEMENT": {
        "severity": "HIGH",
        "category": "SETTLEMENT",
        "action": "Verify settlement batch and contact payment provider if unresolved."
    },
    "AMOUNT_MISMATCH": {
        "severity": "HIGH",
        "category": "FINANCIAL",
        "action": "Investigate amount difference before settlement approval."
    },
    "PAYMENT_AMOUNT_MISMATCH": {
        "severity": "HIGH",
        "category": "FINANCIAL",
        "action": "Verify payment amount against the original order."
    },
    "SETTLEMENT_EXCEPTION": {
        "severity": "MEDIUM",
        "category": "SETTLEMENT",
        "action": "Review settlement status and provider response."
    }
}


def analyze_exception(exception_type: str) -> Dict:

    rule = EXCEPTION_RULES.get(
        exception_type,
        {
            "severity": "MEDIUM",
            "category": "UNKNOWN",
            "action": "Review transaction manually."
        }
    )

    return {
        "exception_type": exception_type,
        "severity": rule["severity"],
        "category": rule["category"],
        "recommended_action": rule["action"]
    }