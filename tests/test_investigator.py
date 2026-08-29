from src.investigator import investigate_exception


def test_amount_mismatch_investigation():

    result = investigate_exception(
        "AMOUNT_MISMATCH",
        "ORD-1001",
        250.0
    )

    assert result["exception"] == "AMOUNT_MISMATCH"
    assert result["confidence"] > 0.8
    assert result["order_id"] == "ORD-1001"


def test_duplicate_payment_investigation():

    result = investigate_exception(
        "DUPLICATE_PAYMENT",
        "ORD-1002"
    )

    assert result["likely_cause"] == (
        "Multiple payment records for one order"
    )


def test_unknown_exception():

    result = investigate_exception(
        "UNKNOWN",
        "ORD-1003"
    )

    assert result["confidence"] == 0.60