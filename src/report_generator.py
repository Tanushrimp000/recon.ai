def generate_report(results):

    total_transactions = len(results)

    human_review_count = sum(
        1 for result in results
        if result["decision"] == "HUMAN_REVIEW"
    )

    auto_resolve_count = sum(
        1 for result in results
        if result["decision"] == "AUTO_RESOLVE"
    )

    total_financial_impact = sum(
        result["financial_impact"]
        for result in results
    )

    total_expected_amount = sum(
        result["investigation"].get("expected_amount", 0)
        for result in results
    )

    total_settlement_amount = sum(
        result["investigation"].get("settlement_amount", 0)
        for result in results
    )

    return {
        "total_transactions": total_transactions,
        "human_review_required": human_review_count,
        "auto_resolved": auto_resolve_count,
        "total_financial_impact": total_financial_impact,
        "total_expected_amount": total_expected_amount,
        "total_settlement_amount": total_settlement_amount,
        "total_unreconciled_amount": (
            total_expected_amount - total_settlement_amount
        ),
        "transactions": results
    }