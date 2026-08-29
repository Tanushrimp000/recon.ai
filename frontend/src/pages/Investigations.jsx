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

  useEffect(() => {
  if (selectedOrderId && !loadingTransactions) {
    investigateTransaction()
  }
}, [selectedOrderId, loadingTransactions])


  const investigateTransaction = async () => {
    if (!orderId) {
      setError('Please select or enter an Order ID.')
      return
    }

    setInvestigating(true)
    setInvestigation(null)
    setError(null)

    try {
      // First get the complete transaction
      const transactionResponse = await fetch(
        `http://127.0.0.1:8000/transaction/${orderId}`
      )

      if (!transactionResponse.ok) {
        throw new Error('Failed to load transaction details')
      }

      const transaction = await transactionResponse.json()

      if (transaction.error) {
        throw new Error(transaction.error)
      }

      // Then send the complete transaction to the AI investigation endpoint
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

      const result = await response.json()

      console.log('Investigation result:', result)

      setInvestigation(result)
    } catch (err) {
      console.error('Investigation error:', err)

      setError(
        err.message ||
          'Unable to complete investigation.'
      )
    } finally {
      setInvestigating(false)
    }
  }

  const selectedTransaction = transactions.find(
    (item) => item.order_id === orderId
  )

  return (
    <div className="investigations-page">

      <motion.div
        className="investigation-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="eyebrow">AI EXCEPTION INTELLIGENCE</p>

          <h1>Investigations</h1>

          <p className="page-subtitle">
            Analyze transaction exceptions using the RECON.AI investigation agent.
          </p>
        </div>

        <div className="ai-status">
          <span className="ai-status-dot"></span>
          AI ENGINE READY
        </div>
      </motion.div>

      <motion.div
        className="investigation-selector"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="selector-icon">
          <Search size={19} />
        </div>

        <div className="selector-content">

          <label>Select Transaction</label>

          <div className="selector-controls">

            <select
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value)
                setInvestigation(null)
                setError(null)
              }}
              disabled={loadingTransactions || investigating}
            >
              <option value="">
                {loadingTransactions
                  ? 'Loading transactions...'
                  : 'Select an Order ID'}
              </option>

              {transactions.map((transaction) => (
                <option
                  key={transaction.order_id}
                  value={transaction.order_id}
                >
                  {transaction.order_id} — {transaction.status}
                </option>
              ))}
            </select>

            <motion.button
              className="investigate-action"
              onClick={investigateTransaction}
              disabled={investigating || !orderId}
              whileHover={{
                scale: investigating ? 1 : 1.02,
              }}
              whileTap={{
                scale: investigating ? 1 : 0.97,
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
                  <BrainCircuit size={17} />
                  Run Investigation
                </>
              )}
            </motion.button>

          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="investigation-error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      {selectedTransaction && (
        <motion.div
          className="selected-transaction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <span>Selected Order</span>
            <strong>{selectedTransaction.order_id}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{selectedTransaction.status}</strong>
          </div>

          <div>
            <span>Amount Difference</span>
            <strong>
              {selectedTransaction.amount_difference ?? '—'}
            </strong>
          </div>
        </motion.div>
      )}

      {investigating && (
        <motion.div
          className="investigation-processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="processing-animation">
            <BrainCircuit size={30} />
          </div>

          <h2>RECON.AI is investigating...</h2>

          <p>
            Building evidence, analyzing the exception and evaluating policy.
          </p>

          <div className="processing-steps">
            <span>Evidence</span>
            <span>AI Analysis</span>
            <span>Policy Evaluation</span>
          </div>
        </motion.div>
      )}

      {investigation && !investigating && (
        <motion.div
          className="investigation-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="results-header">

            <div>
              <p className="eyebrow">INVESTIGATION COMPLETE</p>

              <h2>AI Investigation Result</h2>
            </div>

            <div
              className={`decision-badge ${
                investigation.decision === 'AUTO_RESOLVE'
                  ? 'auto'
                  : 'review'
              }`}
            >
              {investigation.decision === 'AUTO_RESOLVE' ? (
                <CheckCircle2 size={17} />
              ) : (
                <ShieldAlert size={17} />
              )}

              {investigation.decision || 'UNKNOWN'}
            </div>

          </div>

          <div className="result-grid">

            <div className="result-card">
              <span>Root Cause</span>

              <strong>
                {investigation.investigation?.root_cause ||
                  'Not available'}
              </strong>
            </div>

            <div className="result-card">
              <span>Financial Impact</span>

              <strong>
                ₹
                {investigation.investigation
                  ?.financial_impact ?? '0'}
              </strong>
            </div>

            <div className="result-card">
              <span>AI Confidence</span>

              <strong>
                {(
                  (investigation.investigation
                    ?.confidence ?? 0) * 100
                ).toFixed(0)}
                %
              </strong>
            </div>

            <div className="result-card">
              <span>Human Review</span>

              <strong>
                {investigation.investigation
                  ?.human_review_required
                  ? 'Required'
                  : 'Not Required'}
              </strong>
            </div>

          </div>

          <div className="recommendation-card">

            <div className="recommendation-icon">
              <BrainCircuit size={20} />
            </div>

            <div>
              <span>Recommended Action</span>

              <p>
                {investigation.investigation
                  ?.recommended_action ||
                  'No recommendation available.'}
              </p>
            </div>

          </div>

          <div className="policy-card">

            <div>
              <span>Policy Decision</span>

              <strong>
                {investigation.decision || 'UNKNOWN'}
              </strong>
            </div>

            <p>
              {investigation.investigation
                ?.human_review_required
                ? 'Human review is required based on the investigation and policy evaluation.'
                : 'Transaction qualifies for automated resolution based on the current policy.'}
            </p>

          </div>

          <div className="policy-card">

            <div>
              <span>Severity</span>

              <strong>
                {investigation.investigation?.severity ||
                  'MEDIUM'}
              </strong>
            </div>

            <p>
              Investigation severity assigned to this transaction.
            </p>

          </div>

          <div className="selected-transaction">

            <div>
              <span>Expected Amount</span>

              <strong>
                ₹{investigation.investigation?.expected_amount ?? '—'}
              </strong>
            </div>

            <div>
              <span>Settlement Amount</span>

              <strong>
                ₹{investigation.investigation?.settlement_amount ?? '—'}
              </strong>
            </div>

            <div>
              <span>Financial Impact</span>

              <strong>
                ₹{investigation.financial_impact ?? '0'}
              </strong>
            </div>

          </div>

        </motion.div>
      )}

      {!investigation &&
        !investigating &&
        !error && (
          <motion.div
            className="investigation-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">
              <BrainCircuit size={32} />
            </div>

            <h2>Ready for investigation</h2>

            <p>
              Select a transaction above to begin AI-powered
              exception analysis.
            </p>
          </motion.div>
        )}

      <button
        className="back-button"
        onClick={() => navigate('/transactions')}
      >
        <ArrowLeft size={15} />
        Back to Transactions
      </button>

    </div>
  )
}

export default Investigations