from src.policy_engine import evaluate_policy


def test_high_severity_requires_human_review():

    result = evaluate_policy(
        financial_impact=100,
        confidence=0.98,
        human_review_required=False,
        severity="HIGH"
    )

    assert result["decision"] == "HUMAN_REVIEW"


def test_low_risk_exception_can_auto_resolve():

    result = evaluate_policy(
        financial_impact=100,
        confidence=0.95,
        human_review_required=False,
        severity="LOW"
    )

    assert result["decision"] == "AUTO_RESOLVE"


def test_low_confidence_requires_review():

    result = evaluate_policy(
        financial_impact=100,
        confidence=0.70,
        human_review_required=False,
        severity="LOW"
    )

    assert result["decision"] == "HUMAN_REVIEW"


def test_large_financial_impact_requires_review():

    result = evaluate_policy(
        financial_impact=1000,
        confidence=0.98,
        human_review_required=False,
        severity="LOW"
    )

    assert result["decision"] == "HUMAN_REVIEW"