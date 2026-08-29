from src.reconciliation import reconcile_transactions


def test_reconciliation_runs():

    results = reconcile_transactions()

    assert len(results) > 0


def test_results_have_status():

    results = reconcile_transactions()

    assert "status" in results.columns


def test_matched_transactions_exist():

    results = reconcile_transactions()

    assert "MATCHED" in results["status"].values