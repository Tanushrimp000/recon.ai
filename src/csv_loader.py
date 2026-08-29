import pandas as pd


def load_transactions_from_csv(file_path: str) -> list[dict]:
    df = pd.read_csv(file_path)

    return df.to_dict(orient="records")