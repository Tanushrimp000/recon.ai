import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BrainCircuit,
  Search,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Loader2,
} from 'lucide-react'

import './Investigations.css'

function Investigations() {
  const location = useLocation()
  const navigate = useNavigate()

  const selectedOrderId = location.state?.order_id || ''

  const [transactions, setTransactions] = useState([])
  const [orderId, setOrderId] = useState(selectedOrderId)
  const [investigation, setInvestigation] = useState(null)

  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [investigating, setInvestigating] = useState(false)

  const [error, setError] = useState(null)

  /*
   * Load transactions
   */
  useEffect(() => {
    fetch('http://127.0.0.1:8000/transactions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load transactions')
        }

        return response.json()
      })
      .then((result) => {
        setTransactions(result.transactions || [])
        setLoadingTransactions(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setLoadingTransactions(false)
      })
  }, [])

  /*
   * Automatically investigate when an order
   * is passed from another page.
   */
  useEffect(() => {
    if (selectedOrderId && !loadingTransactions) {
      investigateTransaction()
    }
  }, [selectedOrderId, loadingTransactions])


  /*
   * Run AI investigation
   */
  const investigateTransaction = async () => {
    if (!orderId) {
      setError('Please select or enter an Order ID.')
      return
    }

    setInvestigating(true)
    setInvestigation(null)
    setError(null)

    try {

      /*
       * STEP 1
       * Get complete transaction details
       */
      const transactionResponse = await fetch(
        `http://127.0.0.1:8000/transaction/${orderId}`
      )

      if (!transactionResponse.ok) {
        throw new Error(
          'Failed to load transaction details'
        )
      }

      const transaction =
        await transactionResponse.json()

      if (transaction.error) {
        throw new Error(transaction.error)
      }


      /*
       * STEP 2
       * Send transaction to AI investigation endpoint
       */
      const response = await fetch(
        'http://127.0.0.1:8000/investigate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transaction),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
          `Investigation request failed: ${errorText}`
        )
      }


      /*
       * STEP 3
       * Receive investigation result
       */
      const result = await response.json()

      console.log(
        'Investigation result:',
        result
      )

      setInvestigation(result)


      /*
       * STEP 4
       * If policy requires human review,
       * save the case for the Human Review page.
       *
       * This currently uses localStorage as a temporary
       * frontend persistence layer.
       */
      if (
        result.decision === 'HUMAN_REVIEW'
      ) {

        const existingCases =
          JSON.parse(
            localStorage.getItem(
              'recon-human-review-cases'
            ) || '[]'
          )


        /*
         * Build the Human Review case
         */
        const newCase = {

          /*
           * Transaction information
           */
          order_id:
            transaction.order_id,

          exception_type:
            transaction.exception_type,

          status:
            transaction.status,

          expected_amount:
            transaction.expected_amount,

          payment_amount:
            transaction.payment_amount,

          settlement_amount:
            transaction.settlement_amount,

          amount_difference:
            transaction.amount_difference,

          severity:
            transaction.severity,


          /*
           * AI investigation
           */
          investigation:
            result.investigation,


          /*
           * Policy result
           */
          decision:
            result.decision,

          policy_reason:
            result.policy_reason,

          financial_impact:
            result.financial_impact,


          /*
           * Assigned investigator
           */
          investigator:
            result.investigator || {
              investigator_id:
                'INV-001',

              investigator_name:
                'Demo Investigator',

              investigator_role:
                'Financial Operations Investigator',

              investigator_email:
                '',
            },


          /*
           * Email status
           */
          email_notification:
            result.email_notification || {
              sent: false,
            },


          /*
           * Evidence
           */
          evidence:
            result.evidence ||
            'Evidence generated by RECON.AI investigation engine.',


          /*
           * Human review state
           */
          review_status:
            'PENDING',

          human_decision:
            null,

          human_decision_timestamp:
            null,

          created_at:
            new Date().toISOString(),
        }


        /*
         * Remove an older version of the same
         * transaction so we don't create duplicates.
         */
        const filteredCases =
          existingCases.filter(
            (item) =>
              item.order_id !==
              transaction.order_id
          )


        /*
         * Save newest case
         */
        localStorage.setItem(
          'recon-human-review-cases',
          JSON.stringify([
            ...filteredCases,
            newCase,
          ])
        )


        console.log(
          'Human review case created:',
          newCase
        )
      }

    } catch (err) {

      console.error(
        'Investigation error:',
        err
      )

      setError(
        err.message ||
          'Unable to complete investigation.'
      )

    } finally {

      setInvestigating(false)

    }
  }


  /*
   * Find selected transaction
   */
  const selectedTransaction =
    transactions.find(
      (item) =>
        item.order_id === orderId
    )


  return (
    <div className="investigations-page">


      {/* ================================
          HEADER
      ================================= */}

      <motion.div
        className="investigation-header"
        initial={{
          opacity: 0,
          y: -15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >

        <div>

          <p className="eyebrow">
            AI EXCEPTION INTELLIGENCE
          </p>

          <h1>
            Investigations
          </h1>

          <p className="page-subtitle">
            Analyze transaction exceptions using
            the RECON.AI investigation agent.
          </p>

        </div>


        <div className="ai-status">

          <span className="ai-status-dot"></span>

          AI ENGINE READY

        </div>

      </motion.div>


      {/* ================================
          TRANSACTION SELECTOR
      ================================= */}

      <motion.div
        className="investigation-selector"
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
        }}
      >

        <div className="selector-icon">

          <Search size={19} />

        </div>


        <div className="selector-content">

          <label>
            Select Transaction
          </label>


          <div className="selector-controls">

            <select
              value={orderId}
              onChange={(e) => {

                setOrderId(
                  e.target.value
                )

                setInvestigation(null)

                setError(null)

              }}
              disabled={
                loadingTransactions ||
                investigating
              }
            >

              <option value="">

                {loadingTransactions
                  ? 'Loading transactions...'
                  : 'Select an Order ID'}

              </option>


              {transactions.map(
                (transaction) => (

                  <option
                    key={
                      transaction.order_id
                    }
                    value={
                      transaction.order_id
                    }
                  >

                    {transaction.order_id}
                    {' — '}
                    {transaction.status}

                  </option>

                )
              )}

            </select>


            <motion.button
              className="investigate-action"
              onClick={
                investigateTransaction
              }
              disabled={
                investigating ||
                !orderId
              }
              whileHover={{
                scale:
                  investigating
                    ? 1
                    : 1.02,
              }}
              whileTap={{
                scale:
                  investigating
                    ? 1
                    : 0.97,
              }}
            >

              {investigating ? (

                <>

                  <Loader2
                    size={17}
                    className="spinner"
                  />

                  Investigating...

                </>

              ) : (

                <>

                  <BrainCircuit
                    size={17}
                  />

                  Run Investigation

                </>

              )}

            </motion.button>

          </div>

        </div>

      </motion.div>


      {/* ================================
          ERROR
      ================================= */}

      {error && (

        <motion.div
          className="investigation-error"
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >

          <AlertTriangle
            size={18}
          />

          <span>
            {error}
          </span>

        </motion.div>

      )}


      {/* ================================
          SELECTED TRANSACTION
      ================================= */}

      {selectedTransaction && (

        <motion.div
          className="selected-transaction"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >

          <div>

            <span>
              Selected Order
            </span>

            <strong>
              {
                selectedTransaction.order_id
              }
            </strong>

          </div>


          <div>

            <span>
              Status
            </span>

            <strong>
              {
                selectedTransaction.status
              }
            </strong>

          </div>


          <div>

            <span>
              Amount Difference
            </span>

            <strong>
              {
                selectedTransaction
                  .amount_difference ??
                '—'
              }
            </strong>

          </div>

        </motion.div>

      )}


      {/* ================================
          INVESTIGATION PROCESSING
      ================================= */}

      {investigating && (

        <motion.div
          className="investigation-processing"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >

          <div className="processing-animation">

            <BrainCircuit
              size={30}
            />

          </div>


          <h2>
            RECON.AI is investigating...
          </h2>


          <p>
            Building evidence, analyzing the
            exception and evaluating policy.
          </p>


          <div className="processing-steps">

            <span>
              Evidence
            </span>

            <span>
              AI Analysis
            </span>

            <span>
              Policy Evaluation
            </span>

          </div>

        </motion.div>

      )}


      {/* ================================
          INVESTIGATION RESULTS
      ================================= */}

      {investigation &&
        !investigating && (

          <motion.div
            className="investigation-results"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >


            {/* RESULT HEADER */}

            <div className="results-header">

              <div>

                <p className="eyebrow">
                  INVESTIGATION COMPLETE
                </p>

                <h2>
                  AI Investigation Result
                </h2>

              </div>


              <div
                className={`decision-badge ${
                  investigation.decision ===
                  'AUTO_RESOLVE'
                    ? 'auto'
                    : 'review'
                }`}
              >

                {investigation.decision ===
                'AUTO_RESOLVE' ? (

                  <CheckCircle2
                    size={17}
                  />

                ) : (

                  <ShieldAlert
                    size={17}
                  />

                )}

                {
                  investigation.decision ||
                  'UNKNOWN'
                }

              </div>

            </div>


            {/* RESULT GRID */}

            <div className="result-grid">


              {/* ROOT CAUSE */}

              <div className="result-card">

                <span>
                  Root Cause
                </span>

                <strong>

                  {
                    investigation
                      .investigation
                      ?.root_cause ||
                    'Not available'
                  }

                </strong>

              </div>


              {/* FINANCIAL IMPACT */}

              <div className="result-card">

                <span>
                  Financial Impact
                </span>

                <strong>

                  ₹
                  {
                    investigation
                      .investigation
                      ?.financial_impact ??
                    '0'
                  }

                </strong>

              </div>


              {/* AI CONFIDENCE */}

              <div className="result-card">

                <span>
                  AI Confidence
                </span>

                <strong>

                  {(
                    (
                      investigation
                        .investigation
                        ?.confidence ??
                      0
                    ) * 100
                  ).toFixed(0)}

                  %

                </strong>

              </div>


              {/* HUMAN REVIEW */}

              <div className="result-card">

                <span>
                  Human Review
                </span>

                <strong>

                  {
                    investigation
                      .investigation
                      ?.human_review_required
                      ? 'Required'
                      : 'Not Required'
                  }

                </strong>

              </div>

            </div>


            {/* ================================
                RECOMMENDATION
            ================================= */}

            <div className="recommendation-card">

              <div className="recommendation-icon">

                <BrainCircuit
                  size={20}
                />

              </div>


              <div>

                <span>
                  Recommended Action
                </span>

                <p>

                  {
                    investigation
                      .investigation
                      ?.recommended_action ||
                    'No recommendation available.'
                  }

                </p>

              </div>

            </div>


            {/* ================================
                POLICY DECISION
            ================================= */}

            <div className="policy-card">

              <div>

                <span>
                  Policy Decision
                </span>

                <strong>
                  {
                    investigation.decision ||
                    'UNKNOWN'
                  }
                </strong>

              </div>


              <p>

                {
                  investigation
                    .investigation
                    ?.human_review_required

                  ? 'Human review is required based on the investigation and policy evaluation.'

                  : 'Transaction qualifies for automated resolution based on the current policy.'
                }

              </p>

            </div>


            {/* ================================
                SEVERITY
            ================================= */}

            <div className="policy-card">

              <div>

                <span>
                  Severity
                </span>

                <strong>

                  {
                    investigation
                      .investigation
                      ?.severity ||
                    'MEDIUM'
                  }

                </strong>

              </div>


              <p>
                Investigation severity assigned
                to this transaction.
              </p>

            </div>


            {/* ================================
                TRANSACTION FINANCIAL DETAILS
            ================================= */}

            <div className="selected-transaction">

              <div>

                <span>
                  Expected Amount
                </span>

                <strong>

                  ₹
                  {
                    investigation
                      .investigation
                      ?.expected_amount ??
                    '—'
                  }

                </strong>

              </div>


              <div>

                <span>
                  Payment Amount
                </span>

                <strong>

                  ₹
                  {
                    investigation
                      .investigation
                      ?.payment_amount ??
                    '—'
                  }

                </strong>

              </div>


              <div>

                <span>
                  Settlement Amount
                </span>

                <strong>

                  ₹
                  {
                    investigation
                      .investigation
                      ?.settlement_amount ??
                    '—'
                  }

                </strong>

              </div>


              <div>

                <span>
                  Financial Impact
                </span>

                <strong>

                  ₹
                  {
                    investigation
                      .financial_impact ??
                    '0'
                  }

                </strong>

              </div>

            </div>


            {/* ================================
                HUMAN REVIEW NOTICE
            ================================= */}

            {investigation.decision ===
              'HUMAN_REVIEW' && (

              <motion.div
                className="human-review-notice"
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >

                <div className="human-review-notice-icon">

                  <ShieldAlert
                    size={20}
                  />

                </div>


                <div>

                  <strong>
                    Human Review Required
                  </strong>

                  <p>
                    This exception has been
                    escalated to the assigned
                    investigator. A notification
                    has been sent and the case is
                    available in the Human Review
                    workspace.
                  </p>

                </div>


                <button
                  onClick={() =>
                    navigate(
                      '/human-review'
                    )
                  }
                >
                  Open Human Review
                </button>

              </motion.div>

            )}

          </motion.div>

        )}


      {/* ================================
          EMPTY STATE
      ================================= */}

      {!investigation &&
        !investigating &&
        !error && (

          <motion.div
            className="investigation-empty"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >

            <div className="empty-icon">

              <BrainCircuit
                size={32}
              />

            </div>


            <h2>
              Ready for investigation
            </h2>


            <p>
              Select a transaction above to
              begin AI-powered exception analysis.
            </p>

          </motion.div>

        )}


      {/* ================================
          BACK BUTTON
      ================================= */}

      <button
        className="back-button"
        onClick={() =>
          navigate('/transactions')
        }
      >

        <ArrowLeft
          size={15}
        />

        Back to Transactions

      </button>

    </div>
  )
}

export default Investigations