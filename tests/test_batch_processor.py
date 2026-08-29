from src.batch_processor import process_transactions


def test_process_transactions():

    transactions = [
        {
            "order_id": "ORD-1042",
            "expected_amount": 1500,
            "payment_amount": 1500,
            "settlement_amount": 1250,
            "payment_status": "SUCCESS",
            "settlement_status": "PARTIAL",
            "exception_type": "AMOUNT_MISMATCH",
            "severity": "HIGH"
        },
        {
            "order_id": "ORD-2001",
            "expected_amount": 1000,
            "payment_amount": 1000,
            "settlement_amount": 990,
            "payment_status": "SUCCESS",
            "settlement_status": "PARTIAL",
            "exception_type": "AMOUNT_MISMATCH",
            "severity": "LOW"
        }
    ]

    results = process_transactions(transactions)

    assert isinstance(results, list)
    assert len(results) == 2
    assert results[0]["order_id"] == "ORD-1042"
    assert results[1]["order_id"] == "ORD-2001"