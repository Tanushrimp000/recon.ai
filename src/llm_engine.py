import requests


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen3:4b"


def ask_llm(prompt: str) -> str:

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "think": False,
        "format": "json",
        "options": {
            "temperature": 0.1,
            "num_predict": 200
        }
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload,
        timeout=120
    )

    response.raise_for_status()

    data = response.json()


    return data.get("response", "")


def investigate_transaction(evidence: str) -> str:

    prompt = f"""
Analyze this transaction evidence.

Return a JSON object with exactly these fields:

root_cause
financial_impact
confidence
recommended_action
human_review_required

Rules:
- financial_impact = numeric difference between expected amount and settlement amount
- confidence = number between 0 and 1
- human_review_required = true for HIGH severity
- Do not explain your reasoning
- Return JSON only

Evidence:
{evidence}
"""

    return ask_llm(prompt)