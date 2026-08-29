from src.agent import run_recon_agent


def test_recon_agent():

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

    result = run_recon_agent(transaction)

    assert isinstance(result, dict)
    assert result["order_id"] == "ORD-1042"
    assert len(result["investigation"]) > 0
    assert result["decision"] == "HUMAN_REVIEW"
    assert result["financial_impact"] == 250