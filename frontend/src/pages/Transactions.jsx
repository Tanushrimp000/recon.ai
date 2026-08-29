import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpDown,
} from 'lucide-react'

import './Transactions.css'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const navigate = useNavigate()

  const fetchTransactions = () => {
    setLoading(true)
    setError(null)

    fetch('http://127.0.0.1:8000/transactions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch transactions')
        }

        return response.json()
      })
      .then((result) => {
        setTransactions(result.transactions || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.order_id
          ?.toLowerCase()
          .includes(search.toLowerCase())

      const matchesFilter =
        filter === 'ALL' ||
        (filter === 'MATCHED' &&
          transaction.status === 'MATCHED') ||
        (filter === 'EXCEPTION' &&
          transaction.status !== 'MATCHED')

      return matchesSearch && matchesFilter
    })
  }, [transactions, search, filter])

  const getStatusIcon = (status) => {
    if (status === 'MATCHED') {
      return <CheckCircle2 size={16} />
    }

    if (status === 'PAYMENT_FAILED') {
      return <XCircle size={16} />
    }

    return <AlertTriangle size={16} />
  }

  const getStatusClass = (status) => {
    if (status === 'MATCHED') {
      return 'matched'
    }

    if (status === 'PAYMENT_FAILED') {
      return 'failed'
    }

    return 'exception'
  }

  return (
    <div className="transactions-page">

      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="eyebrow">TRANSACTION MONITORING</p>

          <h1>Transactions</h1>

          <p className="page-subtitle">
            Monitor and review reconciled financial transactions.
          </p>
        </div>

        <motion.button
          className="refresh-button"
          onClick={fetchTransactions}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <RefreshCw size={16} />
          Refresh
        </motion.button>
      </motion.div>

      <div className="transaction-toolbar">

        <div className="search-box">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-buttons">

          <button
            className={filter === 'ALL' ? 'active' : ''}
            onClick={() => setFilter('ALL')}
          >
            All
          </button>

          <button
            className={filter === 'MATCHED' ? 'active' : ''}
            onClick={() => setFilter('MATCHED')}
          >
            Matched
          </button>

          <button
            className={filter === 'EXCEPTION' ? 'active' : ''}
            onClick={() => setFilter('EXCEPTION')}
          >
            Exceptions
          </button>

        </div>

      </div>

      {loading && (
        <div className="transactions-state">
          <RefreshCw className="loading-icon" size={22} />
          Loading transactions...
        </div>
      )}

      {error && (
        <div className="transactions-state error-state">
          <AlertTriangle size={22} />

          <div>
            <strong>Unable to load transactions</strong>

            <p>
              Make sure FastAPI is running on port 8000.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <motion.div
          className="transaction-table-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="table-header">
            <div>
              <h2>Transaction Ledger</h2>

              <p>
                Showing {filteredTransactions.length} of{' '}
                {transactions.length} transactions
              </p>
            </div>

            <div className="table-count">
              {filteredTransactions.length}
            </div>
          </div>

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>
                    <span>
                      Order ID
                      <ArrowUpDown size={13} />
                    </span>
                  </th>

                  <th>Status</th>

                  <th>Amount Difference</th>

                  <th>Reconciliation</th>
                </tr>
              </thead>

              <tbody>

                {filteredTransactions.map(
                  (transaction, index) => (
                    <motion.tr
                      key={transaction.order_id}
                      initial={{
                        opacity: 0,
                        x: -8,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: Math.min(index * 0.015, 0.3),
                      }}
                    >

                      <td>
                        <strong>
                          {transaction.order_id}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            transaction.status
                          )}`}
                        >
                          {getStatusIcon(
                            transaction.status
                          )}

                          {transaction.status}
                        </span>
                      </td>

                      <td>
                        {transaction.amount_difference !== null &&
                        transaction.amount_difference !== undefined
                          ? `₹${transaction.amount_difference}`
                          : '—'}
                      </td>

                      <td>
  {transaction.status === 'MATCHED' ? (
    <span className="reconciliation-ok">
      Reconciled
    </span>
  ) : (
    <button
      className="investigate-button"
      onClick={() => navigate('/investigations', {
        state: {
          order_id: transaction.order_id
        }
      })}
    >
      Investigate
    </button>
  )}
</td>

                    </motion.tr>
                  )
                )}

              </tbody>

            </table>

            {filteredTransactions.length === 0 && (
              <div className="empty-transactions">
                No transactions match your search.
              </div>
            )}

          </div>

        </motion.div>
      )}

    </div>
  )
}

export default Transactions