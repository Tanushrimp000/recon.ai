import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react'

import './Evidence.css'

function Evidence() {
  const [transactions, setTransactions] = useState([])
  const [orderId, setOrderId] = useState('')
  const [evidence, setEvidence] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(true)
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

  const loadEvidence = async () => {
    if (!orderId) {
      setError('Please select a transaction.')
      return
    }

    setLoading(true)
    setEvidence(null)
    setError(null)

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/evidence/${orderId}`
      )

      if (!response.ok) {
        throw new Error('Failed to load evidence')
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setEvidence(result)
    } catch (err) {
      console.error('Evidence error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    if (status === 'MATCHED') {
      return <CheckCircle2 size={17} />
    }

    if (status === 'FAILED') {
      return <AlertTriangle size={17} />
    }

    return <ShieldAlert size={17} />
  }

  return (
    <div className="evidence-page">

      <motion.div
        className="evidence-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="eyebrow">INVESTIGATION EVIDENCE</p>

          <h1>Evidence</h1>

          <p className="page-subtitle">
            Review the financial evidence collected for transaction
            investigations.
          </p>
        </div>

        <div className="evidence-status">
          <span className="evidence-status-dot"></span>
          EVIDENCE ENGINE READY
        </div>
      </motion.div>

      <motion.div
        className="evidence-selector"
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
                setEvidence(null)
                setError(null)
              }}
              disabled={loadingTransactions || loading}
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
              className="evidence-action"
              onClick={loadEvidence}
              disabled={loading || !orderId}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
            >
              {loading ? (
                <>
                  <RefreshCw
                    size={17}
                    className="loading-icon"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <FileSearch size={17} />
                  View Evidence
                </>
              )}
            </motion.button>

          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          className="evidence-error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      {loading && (
        <motion.div
          className="evidence-processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FileSearch size={32} />

          <h2>Collecting evidence...</h2>

          <p>
            Retrieving transaction records and reconciliation evidence.
          </p>
        </motion.div>
      )}

      {evidence && !loading && (
        <motion.div
          className="evidence-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="results-header">

            <div>
              <p className="eyebrow">EVIDENCE COLLECTED</p>

              <h2>{evidence.order_id}</h2>
            </div>

            <div
              className={`severity-badge ${
                evidence.evidence?.severity?.toLowerCase()
              }`}
            >
              <ShieldAlert size={16} />

              {evidence.evidence?.severity || 'UNKNOWN'}
            </div>

          </div>

          <div className="evidence-grid">

            <div className="evidence-card">
              <span>Transaction ID</span>

              <strong>
                {evidence.evidence?.transaction_id || '—'}
              </strong>
            </div>

            <div className="evidence-card">
              <span>Exception Type</span>

              <strong>
                {evidence.evidence?.exception_type || '—'}
              </strong>
            </div>

            <div className="evidence-card">
              <span>Expected Amount</span>

              <strong>
                ₹{evidence.evidence?.expected_amount ?? '—'}
              </strong>
            </div>

            <div className="evidence-card">
              <span>Payment Amount</span>

              <strong>
                ₹{evidence.evidence?.payment_amount ?? '—'}
              </strong>
            </div>

            <div className="evidence-card">
              <span>Settlement Amount</span>

              <strong>
                ₹{evidence.evidence?.settlement_amount ?? '—'}
              </strong>
            </div>

            <div className="evidence-card">
              <span>Payment Status</span>

              <strong className="status-value">
                {getStatusIcon(evidence.evidence?.payment_status)}

                {evidence.evidence?.payment_status || '—'}
              </strong>
            </div>

            <div className="evidence-card">
              <span>Settlement Status</span>

              <strong className="status-value">
                {getStatusIcon(
                  evidence.evidence?.settlement_status
                )}

                {evidence.evidence?.settlement_status || '—'}
              </strong>
            </div>

            <div className="evidence-card">
              <span>Severity</span>

              <strong>
                {evidence.evidence?.severity || '—'}
              </strong>
            </div>

          </div>

          <div className="evidence-summary">

            <div className="summary-header">
              <FileSearch size={20} />

              <div>
                <span>Evidence Summary</span>

                <p>
                  Structured evidence generated by the RECON.AI
                  evidence builder.
                </p>
              </div>
            </div>

            <pre>{evidence.summary}</pre>

          </div>

        </motion.div>
      )}

      {!evidence &&
        !loading &&
        !error && (
          <motion.div
            className="evidence-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">
              <FileSearch size={32} />
            </div>

            <h2>Evidence ready</h2>

            <p>
              Select a transaction above to review its
              reconciliation evidence.
            </p>
          </motion.div>
        )}

    </div>
  )
}

export default Evidence