REQUIRED_FIELDS = [
    "order_id",
    "expected_amount",
    "payment_amount",
    "settlement_amount",
    "payment_status",
    "settlement_status",
    "exception_type",
    "severity"
]


def validate_transaction(transaction):

    missing_fields = [
        field for field in REQUIRED_FIELDS
        if field not in transaction
    ]

    if missing_fields:
        return {
            "valid": False,
            "error": f"Missing fields: {', '.join(missing_fields)}"
        }

    if transaction["expected_amount"] < 0:
        return {
            "valid": False,
            "error": "Expected amount cannot be negative."
        }

    if transaction["payment_amount"] < 0:
        return {
            "valid": False,
            "error": "Payment amount cannot be negative."
        }

    if transaction["settlement_amount"] < 0:
        return {
            "valid": False,
            "error": "Settlement amount cannot be negative."
        }

    return {
        "valid": True,
        "error": None
    }