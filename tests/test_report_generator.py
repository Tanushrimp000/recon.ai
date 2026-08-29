from src.report_generator import generate_report


def test_generate_report():

    results = [
        {
            "order_id": "ORD-1042",
            "investigation": {
                "root_cause": "Partial settlement",
                "financial_impact": 250,
                "confidence": 0.95,
                "recommended_action": "Review settlement",
                "human_review_required": True
            },
            "decision": "HUMAN_REVIEW",
            "financial_impact": 250
        },
        {
            "order_id": "ORD-2001",
            "investigation": {
                "root_cause": "Settlement mismatch",
                "financial_impact": 10,
                "confidence": 0.98,
                "recommended_action": "Resolve automatically",
                "human_review_required": False
            },
            "decision": "AUTO_RESOLVE",
            "financial_impact": 10
        }
    ]

    report = generate_report(results)

    assert report["total_transactions"] == 2
    assert report["human_review_required"] == 1
    assert report["auto_resolved"] == 1
    assert report["total_financial_impact"] == 260
    assert len(report["transactions"]) == 2