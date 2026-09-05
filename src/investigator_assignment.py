# src/investigator_assignment.py

INVESTIGATOR = {
    "id": "INV-001",
    "name": "Demo Investigator",
    "role": "Financial Operations Investigator",
    "email": "investigatorone.01@gmail.com"
}


def assign_investigator():
    """
    Assign the human-review case to the configured investigator.
    """

    return {
        "investigator_id": INVESTIGATOR["id"],
        "investigator_name": INVESTIGATOR["name"],
        "investigator_role": INVESTIGATOR["role"],
        "investigator_email": INVESTIGATOR["email"]
    }