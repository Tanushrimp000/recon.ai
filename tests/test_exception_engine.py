from src.exception_engine import analyze_exception


def test_amount_mismatch():

    result = analyze_exception("AMOUNT_MISMATCH")

    assert result["severity"] == "HIGH"
    assert result["category"] == "FINANCIAL"


def test_duplicate_payment():

    result = analyze_exception("DUPLICATE_PAYMENT")

    assert result["severity"] == "HIGH"
    assert result["category"] == "PAYMENT"


def test_unknown_exception():

    result = analyze_exception("UNKNOWN")

    assert result["severity"] == "MEDIUM"