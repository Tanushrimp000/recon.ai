def evaluate_policy(
    financial_impact: float,
    confidence: float,
    human_review_required: bool,
    severity: str
) -> dict:
    """
    Deterministic policy layer for RECON.AI.

    The LLM can recommend an action, but this policy
    determines whether automatic resolution is allowed.
    """

    if human_review_required:
        return {
            "decision": "HUMAN_REVIEW",
            "reason": "AI investigation requires human review."
        }

    if severity.upper() == "HIGH":
        return {
            "decision": "HUMAN_REVIEW",
            "reason": "High-severity financial exception."
        }

    if confidence < 0.90:
        return {
            "decision": "HUMAN_REVIEW",
            "reason": "AI confidence is below the automation threshold."
        }

    if abs(financial_impact) > 500:
        return {
            "decision": "HUMAN_REVIEW",
            "reason": "Financial impact exceeds the automatic-resolution limit."
        }

    return {
        "decision": "AUTO_RESOLVE",
        "reason": "Exception satisfies all automatic-resolution policies."
    }