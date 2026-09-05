import json

from src.email_service import send_human_review_email
from src.investigator_assignment import assign_investigator
from src.evidence_builder import build_evidence
from src.llm_engine import investigate_transaction
from src.policy_engine import evaluate_policy


def run_recon_agent(transaction, send_notification=False):

    # ========================================================
    # 1. BUILD EVIDENCE
    # ========================================================

    evidence = build_evidence(transaction)

    # ========================================================
    # 2. AI INVESTIGATION
    # ========================================================

    investigation_text = investigate_transaction(evidence)

    investigation = json.loads(investigation_text)

    # ========================================================
    # 3. GET TRANSACTION SEVERITY
    # ========================================================

    severity = transaction.get(
        "severity",
        "MEDIUM"
    )

    # ========================================================
    # 4. DETERMINISTIC POLICY EVALUATION
    # ========================================================

    policy_result = evaluate_policy(
        investigation["financial_impact"],
        investigation["confidence"],
        investigation["human_review_required"],
        severity
    )

    # ========================================================
    # 5. EXTRACT FINAL POLICY DECISION
    # ========================================================

    decision = policy_result["decision"]

    policy_reason = policy_result["reason"]

    # ========================================================
    # 6. INVESTIGATOR ASSIGNMENT
    # ========================================================

    investigator = None

    email_sent = False

    if decision == "HUMAN_REVIEW":

        # Assign the case to the demo investigator
        investigator = assign_investigator()

        # ----------------------------------------------------
        # Send email ONLY when explicitly requested
        #
        # /investigate:
        #     send_notification=True
        #
        # /evaluation:
        #     send_notification=False
        # ----------------------------------------------------

        if send_notification:

            email_sent = send_human_review_email(
                investigator_email=
                    investigator["investigator_email"],

                transaction=transaction,

                investigation=investigation,

                evidence=evidence,

                decision=decision
            )

    # ========================================================
    # 7. RETURN COMPLETE AGENT RESULT
    # ========================================================

    return {

        "order_id":
            transaction["order_id"],

        "investigation": {

            **investigation,

            "expected_amount":
                transaction["expected_amount"],

            "payment_amount":
                transaction.get("payment_amount"),

            "settlement_amount":
                transaction["settlement_amount"],

            "severity":
                severity
        },

        "decision":
            decision,

        "policy_reason":
            policy_reason,

        "financial_impact":
            investigation["financial_impact"],

        "investigator":
            investigator,

        "email_notification": {

            "sent":
                email_sent
        }
    }