from typing import Dict


def investigate_exception(
    exception_type: str,
    order_id: str | None = None,
    amount_difference: float | None = None
) -> Dict:

    if exception_type == "AMOUNT_MISMATCH":

        explanation = (
            "The transaction contains an amount difference between "
            "the expected order value and the recorded financial amount."
        )

        if amount_difference is not None:
            explanation += (
                f" The detected difference is ₹{abs(amount_difference):.2f}."
            )

        return {
            "order_id": order_id,
            "exception": exception_type,
            "likely_cause": "Financial amount discrepancy",
            "explanation": explanation,
            "confidence": 0.92,
            "next_action": (
                "Compare the order, payment and settlement records "
                "and verify the amount with the payment provider."
            )
        }

    if exception_type == "DUPLICATE_PAYMENT":

        return {
            "order_id": order_id,
            "exception": exception_type,
            "likely_cause": "Multiple payment records for one order",
            "explanation": (
                "More than one payment record appears to be associated "
                "with the same order."
            ),
            "confidence": 0.95,
            "next_action": (
                "Verify whether the customer was charged more than once "
                "and initiate a refund if the duplicate is confirmed."
            )
        }

    if exception_type == "PAYMENT_FAILED":

        return {
            "order_id": order_id,
            "exception": exception_type,
            "likely_cause": "Payment processing failure",
            "explanation": (
                "The payment record indicates that the payment did not "
                "complete successfully."
            ),
            "confidence": 0.94,
            "next_action": (
                "Review the payment provider response and determine "
                "whether the customer should retry the payment."
            )
        }

    if exception_type == "MISSING_SETTLEMENT":

        return {
            "order_id": order_id,
            "exception": exception_type,
            "likely_cause": "Settlement record unavailable",
            "explanation": (
                "A successful payment does not have a corresponding "
                "settlement record."
            ),
            "confidence": 0.90,
            "next_action": (
                "Check the settlement batch and payment provider records."
            )
        }

    return {
        "order_id": order_id,
        "exception": exception_type,
        "likely_cause": "Unknown reconciliation issue",
        "explanation": (
            "The exception does not match a predefined investigation pattern."
        ),
        "confidence": 0.60,
        "next_action": "Review the transaction manually."
    }