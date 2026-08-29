from src.csv_loader import load_transactions_from_csv


def test_load_transactions_from_csv():

    transactions = load_transactions_from_csv(
        "data/transactions.csv"
    )

    assert isinstance(transactions, list)
    assert len(transactions) == 3
    assert transactions[0]["order_id"] == "ORD-1042"