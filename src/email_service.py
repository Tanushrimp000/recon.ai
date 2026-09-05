# src/email_service.py

import os
import smtplib
from dotenv import load_dotenv
from email.message import EmailMessage

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# RECON.AI frontend
DASHBOARD_URL = "http://localhost:5173"
HUMAN_REVIEW_URL = f"{DASHBOARD_URL}/human-review"


def send_human_review_email(
    investigator_email,
    transaction,
    investigation,
    evidence,
    decision
):
    """
    Send a human-review notification to the assigned investigator.
    """

    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("Email configuration missing. Email was not sent.")
        return False

    transaction_id = transaction.get(
        "transaction_id",
        transaction.get("order_id", "Unknown")
    )

    severity = transaction.get("severity", "UNKNOWN")

    root_cause = investigation.get(
        "root_cause",
        "Not available"
    )

    financial_impact = investigation.get(
        "financial_impact",
        "Not available"
    )

    confidence = investigation.get(
        "confidence",
        "Not available"
    )

    recommended_action = investigation.get(
        "recommended_action",
        "Not available"
    )

    # --------------------------------------------------
    # CREATE EMAIL
    # --------------------------------------------------

    message = EmailMessage()

    message["Subject"] = (
        f"RECON.AI — Human Review Required | {transaction_id}"
    )

    message["From"] = SMTP_EMAIL
    message["To"] = investigator_email

    # --------------------------------------------------
    # PLAIN TEXT VERSION
    # --------------------------------------------------

    body = f"""
RECON.AI — HUMAN REVIEW REQUIRED

A financial reconciliation exception requires your review.

----------------------------------------
TRANSACTION
----------------------------------------

Transaction ID:
{transaction_id}

Severity:
{severity}

Decision:
{decision}

----------------------------------------
AI INVESTIGATION
----------------------------------------

Root Cause:
{root_cause}

Financial Impact:
{financial_impact}

AI Confidence:
{confidence}

Recommended Action:
{recommended_action}

----------------------------------------
EVIDENCE
----------------------------------------

{evidence}

----------------------------------------

OPEN HUMAN REVIEW DASHBOARD

{HUMAN_REVIEW_URL}

Please review this case in the RECON.AI dashboard
and record the final human decision.

RECON.AI
AI-Powered Financial Reconciliation
"""

    message.set_content(body)

    # --------------------------------------------------
    # HTML VERSION WITH BUTTON
    # --------------------------------------------------

    html_body = f"""
<html>
<body style="
    margin: 0;
    padding: 0;
    background-color: #0f172a;
    font-family: Arial, Helvetica, sans-serif;
">

<div style="
    max-width: 650px;
    margin: 30px auto;
    background-color: #111827;
    border: 1px solid #334155;
    border-radius: 12px;
    overflow: hidden;
">

    <!-- HEADER -->

    <div style="
        padding: 28px;
        background-color: #172033;
        border-bottom: 1px solid #334155;
    ">

        <h1 style="
            margin: 0;
            color: #f8fafc;
            font-size: 24px;
        ">
            RECON.AI
        </h1>

        <p style="
            margin: 8px 0 0;
            color: #94a3b8;
            font-size: 14px;
        ">
            AI-Powered Financial Reconciliation
        </p>

    </div>


    <!-- CONTENT -->

    <div style="padding: 28px;">

        <h2 style="
            margin-top: 0;
            color: #f8fafc;
            font-size: 20px;
        ">
            Human Review Required
        </h2>

        <p style="
            color: #cbd5e1;
            font-size: 14px;
            line-height: 1.6;
        ">
            A financial reconciliation exception has been
            flagged by RECON.AI and requires human review.
        </p>


        <!-- TRANSACTION -->

        <div style="
            margin-top: 24px;
            padding: 18px;
            background-color: #1e293b;
            border-radius: 8px;
        ">

            <h3 style="
                margin-top: 0;
                color: #f8fafc;
                font-size: 15px;
            ">
                Transaction
            </h3>

            <p style="color: #cbd5e1; font-size: 14px;">
                <strong>Transaction ID:</strong>
                {transaction_id}
            </p>

            <p style="color: #cbd5e1; font-size: 14px;">
                <strong>Severity:</strong>
                {severity}
            </p>

            <p style="color: #cbd5e1; font-size: 14px;">
                <strong>Decision:</strong>
                {decision}
            </p>

        </div>


        <!-- AI INVESTIGATION -->

        <div style="
            margin-top: 18px;
            padding: 18px;
            background-color: #1e293b;
            border-radius: 8px;
        ">

            <h3 style="
                margin-top: 0;
                color: #f8fafc;
                font-size: 15px;
            ">
                AI Investigation
            </h3>

            <p style="
                color: #cbd5e1;
                font-size: 14px;
                line-height: 1.6;
            ">
                <strong>Root Cause:</strong><br>
                {root_cause}
            </p>

            <p style="
                color: #cbd5e1;
                font-size: 14px;
            ">
                <strong>Financial Impact:</strong>
                {financial_impact}
            </p>

            <p style="
                color: #cbd5e1;
                font-size: 14px;
            ">
                <strong>AI Confidence:</strong>
                {confidence}
            </p>

            <p style="
                color: #cbd5e1;
                font-size: 14px;
                line-height: 1.6;
            ">
                <strong>Recommended Action:</strong><br>
                {recommended_action}
            </p>

        </div>


        <!-- BUTTON -->

        <div style="
            text-align: center;
            margin: 32px 0;
        ">

            <a href="{HUMAN_REVIEW_URL}"
               style="
                   display: inline-block;
                   padding: 14px 28px;
                   background-color: #2563eb;
                   color: #ffffff;
                   text-decoration: none;
                   border-radius: 8px;
                   font-size: 14px;
                   font-weight: bold;
               ">
                Open Human Review Dashboard
            </a>

        </div>


        <!-- EVIDENCE -->

        <div style="
            padding: 18px;
            background-color: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
        ">

            <h3 style="
                margin-top: 0;
                color: #f8fafc;
                font-size: 15px;
            ">
                Evidence
            </h3>

            <pre style="
                white-space: pre-wrap;
                color: #94a3b8;
                font-size: 12px;
                line-height: 1.6;
            ">{evidence}</pre>

        </div>


        <p style="
            margin-top: 28px;
            color: #64748b;
            font-size: 12px;
            line-height: 1.5;
        ">
            Please review the case in the RECON.AI dashboard
            and record the final human decision.
        </p>

    </div>


    <!-- FOOTER -->

    <div style="
        padding: 20px 28px;
        background-color: #0f172a;
        border-top: 1px solid #334155;
        text-align: center;
    ">

        <p style="
            margin: 0;
            color: #64748b;
            font-size: 12px;
        ">
            RECON.AI — AI-Powered Financial Reconciliation
        </p>

    </div>

</div>

</body>
</html>
"""

    # Add HTML version
    message.add_alternative(html_body, subtype="html")

    # --------------------------------------------------
    # SEND EMAIL
    # --------------------------------------------------

    try:

        with smtplib.SMTP(
            SMTP_HOST,
            SMTP_PORT
        ) as server:

            server.starttls()

            server.login(
                SMTP_EMAIL,
                SMTP_PASSWORD
            )

            server.send_message(message)

        print(
            f"Human review email sent to {investigator_email}"
        )

        print(
            f"Dashboard link: {HUMAN_REVIEW_URL}"
        )

        return True

    except Exception as e:

        print(
            f"Failed to send human review email: {e}"
        )

        return False