from src.evidence_builder import build_evidence


def test_evidence_builder():

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

    assert "ORD-1042" in evidence
    assert "1500" in evidence
    assert "1250" in evidence
    assert "AMOUNT_MISMATCH" in evidence
    assert "HIGH" in evidence