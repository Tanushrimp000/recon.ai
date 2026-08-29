import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "raw"


def load_data():

    orders = pd.read_csv(DATA_DIR / "orders.csv")
    payments = pd.read_csv(DATA_DIR / "payments.csv")
    settlements = pd.read_csv(DATA_DIR / "settlements.csv")

    return orders, payments, settlements


def reconcile_transactions():

    orders, payments, settlements = load_data()

    results = []

    for _, order in orders.iterrows():

        order_id = order["order_id"]
        expected_amount = float(order["amount"])

        order_payments = payments[
            payments["order_id"] == order_id
        ]

        order_settlements = settlements[
            settlements["order_id"] == order_id
        ]

        # Check duplicate payments
        if len(order_payments) > 1:

            results.append({
                "order_id": order_id,
                "status": "DUPLICATE_PAYMENT",
                "expected_amount": expected_amount,
                "payment_amount": order_payments["amount"].sum(),
                "settlement_amount": 0,
                "difference": 0
            })

            continue

        # Check missing payment
        if len(order_payments) == 0:

            results.append({
                "order_id": order_id,
                "status": "MISSING_PAYMENT",
                "expected_amount": expected_amount,
                "payment_amount": 0,
                "settlement_amount": 0,
                "difference": expected_amount
            })

            continue

        payment = order_payments.iloc[0]

        payment_amount = float(payment["amount"])

        # Check payment failure
        if payment["status"] != "SUCCESS":

            results.append({
                "order_id": order_id,
                "status": "PAYMENT_FAILED",
                "expected_amount": expected_amount,
                "payment_amount": payment_amount,
                "settlement_amount": 0,
                "difference": expected_amount
            })

            continue

        # Check missing settlement
        if len(order_settlements) == 0:

            results.append({
                "order_id": order_id,
                "status": "MISSING_SETTLEMENT",
                "expected_amount": expected_amount,
                "payment_amount": payment_amount,
                "settlement_amount": 0,
                "difference": payment_amount
            })

            continue

        settlement = order_settlements.iloc[0]

        settlement_amount = float(
            settlement["settlement_amount"]
        )

        # Check settlement status
        if settlement["settlement_status"] != "SETTLED":

            results.append({
                "order_id": order_id,
                "status": "SETTLEMENT_EXCEPTION",
                "expected_amount": expected_amount,
                "payment_amount": payment_amount,
                "settlement_amount": settlement_amount,
                "difference": payment_amount - settlement_amount
            })

            continue

        # Check payment amount
        if payment_amount != expected_amount:

            results.append({
                "order_id": order_id,
                "status": "PAYMENT_AMOUNT_MISMATCH",
                "expected_amount": expected_amount,
                "payment_amount": payment_amount,
                "settlement_amount": settlement_amount,
                "difference": expected_amount - payment_amount
            })

            continue

        # Check settlement amount
        if settlement_amount != expected_amount:

            results.append({
                "order_id": order_id,
                "status": "AMOUNT_MISMATCH",
                "expected_amount": expected_amount,
                "payment_amount": payment_amount,
                "settlement_amount": settlement_amount,
                "difference": expected_amount - settlement_amount
            })

            continue

        # If everything matches
        results.append({
            "order_id": order_id,
            "status": "MATCHED",
            "expected_amount": expected_amount,
            "payment_amount": payment_amount,
            "settlement_amount": settlement_amount,
            "difference": 0
        })

    return pd.DataFrame(results)

if __name__ == "__main__":

    results = reconcile_transactions()

    print("\n===== RECON.AI RECONCILIATION REPORT =====\n")

    print(f"Total Transactions: {len(results)}")

    print("\nStatus Summary:")

    print(
        results["status"]
        .value_counts()
        .to_string()
    )

    print("\nExceptions:")

    exceptions = results[
        results["status"] != "MATCHED"
    ]

    print(
        exceptions.to_string(index=False)
    )

print("RECONCILIATION FILE IS RUNNING")