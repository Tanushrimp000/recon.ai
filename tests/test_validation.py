from src.validation import validate_transaction


def test_valid_transaction():

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

    result = validate_transaction(transaction)

    assert result["valid"] is True


def test_missing_field():

    transaction = {
        "order_id": "ORD-1042",
        "expected_amount": 1500
    }

    result = validate_transaction(transaction)

    assert result["valid"] is False
    assert "Missing fields" in result["error"]


def test_negative_amount():

    transaction = {
        "order_id": "ORD-1042",
        "expected_amount": -1500,
        "payment_amount": 1500,
        "settlement_amount": 1250,
        "payment_status": "SUCCESS",
        "settlement_status": "PARTIAL",
        "exception_type": "AMOUNT_MISMATCH",
        "severity": "HIGH"
    }

    result = validate_transaction(transaction)

    assert result["valid"] is False