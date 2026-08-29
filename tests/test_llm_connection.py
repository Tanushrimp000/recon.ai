from src.llm_engine import ask_llm


def test_llm_connection():

    response = ask_llm(
        "In one sentence, explain what a payment reconciliation exception is."
    )

    assert isinstance(response, str)
    assert len(response) > 0