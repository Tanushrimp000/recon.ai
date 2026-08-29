from src.csv_loader import load_transactions_from_csv
from src.batch_processor import process_transactions
from src.report_generator import generate_report


def run_pipeline(file_path: str):

    transactions = load_transactions_from_csv(file_path)

    results = process_transactions(transactions)

    report = generate_report(results)

    return report