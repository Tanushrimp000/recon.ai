from src.agent import run_recon_agent


def process_transactions(transactions):

    results = []

    for transaction in transactions:
        result = run_recon_agent(transaction)
        results.append(result)

    return results