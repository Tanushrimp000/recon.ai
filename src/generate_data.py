import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "raw"

DATA_DIR.mkdir(parents=True, exist_ok=True)

random.seed(42)

NUM_TRANSACTIONS = 100

payment_methods = [
    "UPI",
    "CARD",
    "NETBANKING",
    "WALLET"
]

statuses = [
    "SUCCESS",
    "FAILED"
]


def generate_orders():
    orders = []

    start_date = datetime(2026, 8, 1)

    for i in range(1, NUM_TRANSACTIONS + 1):

        order_id = f"ORD-{1000 + i}"

        amount = random.choice([
            199,
            299,
            499,
            799,
            999,
            1499,
            1999,
            2499,
            4999
        ])

        order_date = start_date + timedelta(
            minutes=random.randint(0, 60 * 24 * 20)
        )

        orders.append({
            "order_id": order_id,
            "amount": amount,
            "currency": "INR",
            "order_date": order_date.strftime("%Y-%m-%d %H:%M:%S")
        })

    return orders


def generate_payments(orders):
    payments = []

    for order in orders:

        payment_id = f"PAY-{order['order_id'].split('-')[1]}"

        status = random.choices(
            statuses,
            weights=[95, 5]
        )[0]

        payments.append({
            "payment_id": payment_id,
            "order_id": order["order_id"],
            "amount": order["amount"],
            "payment_method": random.choice(payment_methods),
            "status": status
        })

    return payments


def generate_settlements(orders, payments):
    settlements = []

    for order, payment in zip(orders, payments):

        settlement_id = f"SET-{order['order_id'].split('-')[1]}"

        settlement_amount = order["amount"]

        settlements.append({
            "settlement_id": settlement_id,
            "payment_id": payment["payment_id"],
            "order_id": order["order_id"],
            "settlement_amount": settlement_amount,
            "settlement_status": "SETTLED"
        })

    return settlements


def introduce_exceptions(orders, payments, settlements):

    # Exception 1: Amount mismatch
    settlements[4]["settlement_amount"] -= 100

    # Exception 2: Missing payment
    payments[9]["status"] = "FAILED"

    # Exception 3: Duplicate payment
    duplicate_payment = payments[19].copy()
    duplicate_payment["payment_id"] = "PAY-DUP-1020"
    payments.append(duplicate_payment)

    # Exception 4: Missing settlement
    settlements[29]["settlement_status"] = "MISSING"

    # Exception 5: Wrong settlement mapping
    settlements[39]["payment_id"] = payments[40]["payment_id"]


def save_csv(filename, rows, fieldnames):

    filepath = DATA_DIR / filename

    with open(filepath, "w", newline="", encoding="utf-8") as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()
        writer.writerows(rows)

    print(f"Created: {filepath}")


def main():

    print("Generating RECON.AI synthetic financial data...")

    orders = generate_orders()

    payments = generate_payments(orders)

    settlements = generate_settlements(
        orders,
        payments
    )

    introduce_exceptions(
        orders,
        payments,
        settlements
    )

    save_csv(
        "orders.csv",
        orders,
        [
            "order_id",
            "amount",
            "currency",
            "order_date"
        ]
    )

    save_csv(
        "payments.csv",
        payments,
        [
            "payment_id",
            "order_id",
            "amount",
            "payment_method",
            "status"
        ]
    )

    save_csv(
        "settlements.csv",
        settlements,
        [
            "settlement_id",
            "payment_id",
            "order_id",
            "settlement_amount",
            "settlement_status"
        ]
    )

    print("\nDataset generation complete!")


if __name__ == "__main__":
    main()