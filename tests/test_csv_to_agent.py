from src.csv_loader import load_transactions_from_csv
from src.batch_processor import process_transactions


def test_csv_to_agent():

    transactions = load_transactions_from_csv(
        "data/transactions.csv"
    )

    results = process_transactions(transactions)

    assert isinstance(results, list)
    assert len(results) == len(transactions)

    for result in results:
        assert "order_id" in result
        assert "investigation" in result
        assert "decision" in result
        assert "financial_impact" in result
        