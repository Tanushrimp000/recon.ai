import { useEffect, useState } from "react";
import "./evaluation.css";

function Evaluation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/evaluation")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch evaluation data");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Evaluation API:", result);
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load evaluation metrics.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="evaluation-page">
        <h1>Batch Evaluation</h1>
        <p>Running evaluation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evaluation-page">
        <h1>Batch Evaluation</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="evaluation-page">
        <h1>Batch Evaluation</h1>
        <p>No evaluation data available.</p>
      </div>
    );
  }

  // Backend currently returns "ai_investigation"
  const aiData = data.ai_investigation || data.ai || {
    investigated: 0,
    high_confidence: 0,
    auto_resolve: 0,
    human_review: 0,
  };

  return (
    <div className="evaluation-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Batch Evaluation</h1>
          <p>
            Performance, accuracy and exception analysis across the transaction
            batch.
          </p>
        </div>
      </div>

      {/* ================= MAIN METRICS ================= */}
      <div className="evaluation-grid">
        <div className="evaluation-card">
          <span>Transactions Processed</span>
          <strong>{data.transactions_processed}</strong>
        </div>

        <div className="evaluation-card">
          <span>Processing Time</span>
          <strong>
            {Number(data.processing_time_seconds).toFixed(3)}s
          </strong>
        </div>

        <div className="evaluation-card">
          <span>Throughput</span>
          <strong>
            {Number(data.throughput).toFixed(2)} txn/sec
          </strong>
        </div>

        <div className="evaluation-card">
          <span>Accuracy</span>
          <strong>
            {data.accuracy !== null && data.accuracy !== undefined
              ? `${data.accuracy}%`
              : "N/A"}
          </strong>
        </div>
      </div>

      {/* ================= RECONCILIATION RESULTS ================= */}
      <div className="evaluation-section">
        <h2>Reconciliation Results</h2>

        <div className="result-grid">
          <div className="result-card">
            <span>Matched</span>
            <strong>{data.classification.matched}</strong>
          </div>

          <div className="result-card">
            <span>Payment Failed</span>
            <strong>{data.classification.payment_failed}</strong>
          </div>

          <div className="result-card">
            <span>Amount Mismatch</span>
            <strong>{data.classification.amount_mismatch}</strong>
          </div>

          <div className="result-card">
            <span>Missing Settlement</span>
            <strong>{data.classification.missing_settlement}</strong>
          </div>

          <div className="result-card">
            <span>Duplicate Payment</span>
            <strong>{data.classification.duplicate_payment}</strong>
          </div>

          <div className="result-card">
            <span>Other Exceptions</span>
            <strong>{data.classification.other_exceptions}</strong>
          </div>
        </div>
      </div>

      {/* ================= AI INVESTIGATION ================= */}
      <div className="evaluation-section">
        <h2>AI Investigation</h2>

        <div className="result-grid">
          <div className="result-card">
            <span>AI Investigated</span>
            <strong>{aiData.investigated}</strong>
          </div>

          <div className="result-card">
            <span>High Confidence</span>
            <strong>{aiData.high_confidence}</strong>
          </div>

          <div className="result-card">
            <span>Auto Resolve</span>
            <strong>{aiData.auto_resolve}</strong>
          </div>

          <div className="result-card">
            <span>Human Review</span>
            <strong>{aiData.human_review}</strong>
          </div>
        </div>
      </div>

      {/* ================= EXCEPTION BREAKDOWN ================= */}
      <div className="evaluation-section">
        <h2>Exception Breakdown</h2>

        <div className="exception-table">
          <div className="table-header">
            <span>Exception Type</span>
            <span>Count</span>
            <span>Percentage</span>
          </div>

          {Object.entries(data.exception_breakdown || {}).map(
            ([type, count]) => (
              <div className="table-row" key={type}>
                <span>{type.replaceAll("_", " ")}</span>

                <span>{count}</span>

                <span>
                  {data.transactions_processed > 0
                    ? (
                        (count / data.transactions_processed) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  %
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* ================= HONEST EXCEPTION LIST ================= */}
      <div className="evaluation-section">
        <h2>Honest Exception List</h2>

        <p className="section-description">
          Transactions that were not safely resolved automatically are surfaced
          for human attention.
        </p>

        <div className="exception-list">
          {data.human_review_transactions &&
          data.human_review_transactions.length > 0 ? (
            data.human_review_transactions.map((transaction) => (
              <div
                className="exception-item"
                key={transaction.order_id}
              >
                {/* Left side */}
                <div className="exception-main">
                  <strong>{transaction.order_id}</strong>

                  <span>
                    {transaction.exception_type
                      ? transaction.exception_type.replaceAll("_", " ")
                      : "EXCEPTION"}
                  </span>
                </div>

                {/* Right side */}
                <div className="exception-meta">
                  <span>
                    Severity:{" "}
                    <strong>
                      {transaction.severity || "UNKNOWN"}
                    </strong>
                  </span>

                  <span>
                    Decision:{" "}
                    <strong>
                      {transaction.decision ||
                        transaction.policy_decision ||
                        "HUMAN_REVIEW"}
                    </strong>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No transactions currently require human review.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Evaluation;