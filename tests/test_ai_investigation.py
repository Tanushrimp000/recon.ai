from src.evidence_builder import build_evidence
from src.llm_engine import investigate_transaction


def test_ai_investigation():

    transaction = {
        "order_id": "ORD-1042",
        "expected_amount": 1500,
        "payment_amount": 1500,
        "settlement_amount": 1250,
        "payment_status": "SUCCESS",
        "settlement_status": "PARTIAL",
        "exception_type": "AMOUNT_MISMATCH",
        "severity": "HIGH"
    }

    evidence = build_evidence(transaction)

    result = investigate_transaction(evidence)

    assert isinstance(result, str)
    assert len(result) > 0