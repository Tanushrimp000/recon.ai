from src.pipeline import run_pipeline


def test_run_pipeline():

    report = run_pipeline("data/transactions.csv")

    assert isinstance(report, dict)
    assert report["total_transactions"] > 0
    assert "human_review_required" in report
    assert "auto_resolved" in report
    assert "total_financial_impact" in report
    assert "transactions" in report