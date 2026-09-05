import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
  BrainCircuit,
  FileSearch,
  AlertTriangle,
  Clock3,
} from 'lucide-react'

import './HumanReview.css'

function HumanReview() {
  const [cases, setCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [decision, setDecision] = useState(null)

  const loadCases = () => {
    const storedCases =
      JSON.parse(
        localStorage.getItem('recon-human-review-cases') || '[]'
      )

    setCases(storedCases)

    if (storedCases.length > 0) {
      setSelectedCase(storedCases[0])
    }
  }

  useEffect(() => {
    loadCases()
  }, [])

  const handleDecision = (finalDecision) => {
    if (!selectedCase) return

    const updatedCase = {
      ...selectedCase,
      human_decision: finalDecision,
      human_decision_timestamp: new Date().toISOString(),
      review_status: 'COMPLETED',
    }

    const updatedCases = cases.map((item) =>
      item.order_id === selectedCase.order_id
        ? updatedCase
        : item
    )

    setCases(updatedCases)
    setSelectedCase(updatedCase)
    setDecision(finalDecision)

    localStorage.setItem(
      'recon-human-review-cases',
      JSON.stringify(updatedCases)
    )
  }

  return (
    <div className="human-review-page">

      {/* HEADER */}

      <motion.div
        className="human-review-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="eyebrow">
            HUMAN-IN-THE-LOOP
          </p>

          <h1>Human Review</h1>

          <p className="page-subtitle">
            Review high-risk reconciliation exceptions escalated
            by the RECON.AI policy engine.
          </p>
        </div>

        <div className="review-status">
          <span className="review-status-dot"></span>
          INVESTIGATOR WORKSPACE
        </div>
      </motion.div>


      {/* SUMMARY */}

      <div className="review-summary-grid">

        <motion.div
          className="review-summary-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="summary-icon">
            <Clock3 size={18} />
          </div>

          <div>
            <span>Pending Reviews</span>
            <strong>
              {
                cases.filter(
                  (item) =>
                    item.review_status !== 'COMPLETED'
                ).length
              }
            </strong>
          </div>
        </motion.div>


        <motion.div
          className="review-summary-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="summary-icon">
            <ShieldAlert size={18} />
          </div>

          <div>
            <span>Escalated Cases</span>
            <strong>{cases.length}</strong>
          </div>
        </motion.div>


        <motion.div
          className="review-summary-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className="summary-icon">
            <UserCheck size={18} />
          </div>

          <div>
            <span>Investigator</span>
            <strong>INV-001</strong>
          </div>
        </motion.div>

      </div>


      {/* MAIN REVIEW AREA */}

      <div className="human-review-layout">

        {/* CASE LIST */}

        <motion.section
          className="dashboard-card review-case-list"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
        >

          <div className="card-header">

            <div>
              <h2>Review Queue</h2>

              <p>
                Cases requiring human attention
              </p>
            </div>

            <button
              className="review-refresh"
              onClick={loadCases}
            >
              <RefreshCw size={15} />
            </button>

          </div>


          {cases.length === 0 ? (

            <div className="review-empty">

              <div className="review-empty-icon">
                <CheckCircle2 size={28} />
              </div>

              <h3>No cases awaiting review</h3>

              <p>
                Human-review cases will appear here when
                RECON.AI escalates an exception.
              </p>

            </div>

          ) : (

            <div className="review-case-items">

              {cases.map((reviewCase) => (

                <button
                  key={reviewCase.order_id}
                  className={`review-case-item ${
                    selectedCase?.order_id ===
                    reviewCase.order_id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedCase(reviewCase)
                    setDecision(
                      reviewCase.human_decision || null
                    )
                  }}
                >

                  <div className="case-item-top">

                    <strong>
                      {reviewCase.order_id}
                    </strong>

                    <span
                      className={`case-severity ${
                        reviewCase.investigation
                          ?.severity
                          ?.toLowerCase() || 'high'
                      }`}
                    >
                      {reviewCase.investigation
                        ?.severity || 'HIGH'}
                    </span>

                  </div>

                  <span className="case-item-type">
                    {reviewCase.investigation
                      ?.exception_type ||
                      reviewCase.exception_type ||
                      'Financial Exception'}
                  </span>

                  <span
                    className={`case-review-status ${
                      reviewCase.review_status ===
                      'COMPLETED'
                        ? 'completed'
                        : 'pending'
                    }`}
                  >
                    {reviewCase.review_status ===
                    'COMPLETED'
                      ? 'REVIEW COMPLETED'
                      : 'PENDING REVIEW'}
                  </span>

                </button>

              ))}

            </div>

          )}

        </motion.section>


        {/* CASE DETAILS */}

        <motion.section
          className="dashboard-card review-details"
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >

          {!selectedCase ? (

            <div className="review-no-selection">

              <FileSearch size={30} />

              <h2>Select a review case</h2>

              <p>
                Choose an exception from the review queue
                to inspect the AI investigation.
              </p>

            </div>

          ) : (

            <>

              {/* CASE HEADER */}

              <div className="review-details-header">

                <div>

                  <p className="eyebrow">
                    CASE REQUIRES HUMAN REVIEW
                  </p>

                  <h2>
                    {selectedCase.order_id}
                  </h2>

                </div>

                <div className="human-review-badge">
                  <ShieldAlert size={16} />
                  HUMAN REVIEW
                </div>

              </div>


              {/* INVESTIGATOR */}

              <div className="assigned-investigator">

                <div className="investigator-icon">
                  <UserCheck size={19} />
                </div>

                <div>

                  <span>
                    ASSIGNED INVESTIGATOR
                  </span>

                  <strong>
                    {
                      selectedCase.investigator
                        ?.investigator_name ||
                      'Demo Investigator'
                    }
                  </strong>

                  <small>
                    {
                      selectedCase.investigator
                        ?.investigator_role ||
                      'Financial Operations Investigator'
                    }
                  </small>

                </div>

                <div className="assignment-id">
                  {
                    selectedCase.investigator
                      ?.investigator_id ||
                    'INV-001'
                  }
                </div>

              </div>


              {/* AI FINDINGS */}

              <div className="review-section">

                <div className="review-section-title">

                  <BrainCircuit size={18} />

                  <h3>AI Investigation</h3>

                </div>


                <div className="review-findings-grid">

                  <div className="finding-card">

                    <span>Root Cause</span>

                    <strong>
                      {
                        selectedCase.investigation
                          ?.root_cause ||
                        'Not available'
                      }
                    </strong>

                  </div>


                  <div className="finding-card">

                    <span>Financial Impact</span>

                    <strong>
                      ₹
                      {
                        selectedCase.investigation
                          ?.financial_impact ??
                        selectedCase.financial_impact ??
                        0
                      }
                    </strong>

                  </div>


                  <div className="finding-card">

                    <span>AI Confidence</span>

                    <strong>
                      {(
                        (selectedCase.investigation
                          ?.confidence || 0) * 100
                      ).toFixed(0)}
                      %
                    </strong>

                  </div>


                  <div className="finding-card">

                    <span>Severity</span>

                    <strong className="severity-text">
                      {
                        selectedCase.investigation
                          ?.severity ||
                        'HIGH'
                      }
                    </strong>

                  </div>

                </div>

              </div>


              {/* RECOMMENDATION */}

              <div className="review-section">

                <div className="review-section-title">

                  <AlertTriangle size={18} />

                  <h3>
                    AI Recommended Action
                  </h3>

                </div>

                <div className="ai-recommendation">

                  {
                    selectedCase.investigation
                      ?.recommended_action ||
                    'No recommendation available.'
                  }

                </div>

              </div>


              {/* EVIDENCE */}

              <div className="review-section">

                <div className="review-section-title">

                  <FileSearch size={18} />

                  <h3>Evidence</h3>

                </div>

                <div className="evidence-box">

                  {selectedCase.evidence ||
                    'Evidence summary not available.'}

                </div>

              </div>


              {/* HUMAN DECISION */}

              <div className="review-decision">

                <div>

                  <p className="eyebrow">
                    FINAL HUMAN DECISION
                  </p>

                  <h3>
                    Investigator Action
                  </h3>

                  <p>
                    The AI recommendation is advisory.
                    The investigator makes the final
                    decision.
                  </p>

                </div>


                {decision ? (

                  <div className="decision-completed">

                    <CheckCircle2 size={20} />

                    <div>
                      <strong>
                        {decision}
                      </strong>

                      <span>
                        Human review completed
                      </span>
                    </div>

                  </div>

                ) : (

                  <div className="decision-actions">

                    <button
                      className="approve-button"
                      onClick={() =>
                        handleDecision(
                          'APPROVED'
                        )
                      }
                    >
                      <CheckCircle2 size={17} />
                      Approve Resolution
                    </button>

                    <button
                      className="reject-button"
                      onClick={() =>
                        handleDecision(
                          'REJECTED'
                        )
                      }
                    >
                      <XCircle size={17} />
                      Reject Resolution
                    </button>

                    <button
                      className="investigate-button"
                      onClick={() =>
                        handleDecision(
                          'MORE_INVESTIGATION_REQUIRED'
                        )
                      }
                    >
                      <BrainCircuit size={17} />
                      Request More Investigation
                    </button>

                  </div>

                )}

              </div>

            </>

          )}

        </motion.section>

      </div>

    </div>
  )
}

export default HumanReview