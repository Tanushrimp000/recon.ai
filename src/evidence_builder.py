def build_evidence(transaction: dict) -> str:
    """
    Convert a reconciliation transaction into a structured
    evidence summary for the LLM.
    """

    return f"""
RECON.AI FINANCIAL INVESTIGATION

Transaction ID:
{transaction.get("order_id", "Unknown")}

Expected Amount:
₹{transaction.get("expected_amount", 0)}

Payment Amount:
₹{transaction.get("payment_amount", 0)}

Settlement Amount:
₹{transaction.get("settlement_amount", 0)}

Payment Status:
{transaction.get("payment_status", "Unknown")}

Settlement Status:
{transaction.get("settlement_status", "Unknown")}

Exception Type:
{transaction.get("exception_type", "Unknown")}

Exception Severity:
{transaction.get("severity", "Unknown")}
""".strip()
