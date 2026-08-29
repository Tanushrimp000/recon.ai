import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  IndianRupee,
  RefreshCw,
} from 'lucide-react'

import './Dashboard.css'

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = () => {
    setLoading(true)
    setError(null)

    fetch('http://127.0.0.1:8000/transactions')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch transaction data')
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

  const metrics = useMemo(() => {
    const total = transactions.length

    const matched = transactions.filter(
      (transaction) => transaction.status === 'MATCHED'
    ).length

    const exceptions = transactions.filter(
      (transaction) => transaction.status !== 'MATCHED'
    )

    const highSeverity = exceptions.filter(
      (transaction) => transaction.severity === 'HIGH'
    ).length

    const financialImpact = exceptions.reduce(
      (totalImpact, transaction) =>
        totalImpact +
        Math.abs(Number(transaction.amount_difference) || 0),
      0
    )

    return {
      total,
      matched,
      exceptionCount: exceptions.length,
      highSeverity,
      financialImpact,
    }
  }, [transactions])

  const recentExceptions = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.status !== 'MATCHED')
      .slice(0, 5)
  }, [transactions])

  /*
   * Create a simple activity visualization from the actual
   * transaction statuses instead of using hardcoded values.
   */
  const activityData = useMemo(() => {
    if (transactions.length === 0) {
      return [0, 0, 0, 0, 0, 0]
    }

    const chunkSize = Math.ceil(transactions.length / 6)

    return Array.from({ length: 6 }, (_, index) => {
      const start = index * chunkSize
      const end = start + chunkSize

      const chunk = transactions.slice(start, end)

      const exceptions = chunk.filter(
        (transaction) => transaction.status !== 'MATCHED'
      ).length

      return Math.max(
        15,
        Math.min(100, (exceptions / Math.max(chunk.length, 1)) * 100)
      )
    })
  }, [transactions])

  const stats = [
    {
      title: 'Total Transactions',
      value: metrics.total.toLocaleString(),
      change: 'Live data',
      positive: true,
      icon: Activity,
    },
    {
      title: 'Matched',
      value: metrics.matched.toLocaleString(),
      change:
        metrics.total > 0
          ? `${Math.round(
              (metrics.matched / metrics.total) * 100
            )}% reconciled`
          : '0% reconciled',
      positive: true,
      icon: CheckCircle2,
    },
    {
      title: 'Exceptions',
      value: metrics.exceptionCount.toLocaleString(),
      change: 'Requires attention',
      positive: false,
      icon: AlertTriangle,
    },
    {
      title: 'Human Review',
      value: metrics.highSeverity.toLocaleString(),
      change: 'High severity',
      positive: false,
      icon: Clock3,
    },
  ]

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <RefreshCw className="loading-icon" size={20} />
          Loading RECON.AI intelligence...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-error">
          <AlertTriangle size={20} />

          <div>
            <strong>
              Unable to connect to RECON.AI backend.
            </strong>

            <p>
              Make sure FastAPI is running on port 8000.
            </p>

            <button onClick={fetchTransactions}>
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">

      {/* HEADER */}

      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="eyebrow">
            FINANCIAL INTELLIGENCE
          </p>

          <h1>Reconciliation Dashboard</h1>

          <p className="subtitle">
            Real-time transaction reconciliation and exception
            monitoring.
          </p>
        </div>

        <div className="dashboard-header-actions">

          <button
            className="dashboard-refresh"
            onClick={fetchTransactions}
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          <div className="live-indicator">
            <span className="status-dot"></span>
            LIVE
          </div>

        </div>
      </motion.div>

      {/* STAT CARDS */}

      <div className="stats-grid">

        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <motion.div
              className="stat-card"
              key={stat.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
            >

              <div className="stat-top">

                <span className="stat-title">
                  {stat.title}
                </span>

                <div className="stat-icon">
                  <Icon size={18} />
                </div>

              </div>

              <div className="stat-value">
                {stat.value}
              </div>

              <div
                className={`stat-change ${
                  stat.positive
                    ? 'positive'
                    : 'negative'
                }`}
              >

                {stat.positive ? (
                  <ArrowUpRight size={15} />
                ) : (
                  <ArrowDownRight size={15} />
                )}

                {stat.change}

              </div>

            </motion.div>
          )
        })}

      </div>

      {/* FINANCIAL IMPACT */}

      <motion.div
        className="financial-impact-card"
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
          delay: 0.3,
        }}
      >

        <div className="financial-impact-icon">
          <IndianRupee size={19} />
        </div>

        <div>
          <span>
            TOTAL FINANCIAL IMPACT
          </span>

          <strong>
            ₹{metrics.financialImpact.toLocaleString()}
          </strong>
        </div>

        <p>
          Aggregate absolute difference across
          detected exceptions.
        </p>

      </motion.div>

      {/* MAIN GRID */}

      <div className="dashboard-grid">

        {/* ACTIVITY */}

        <motion.section
          className="dashboard-card activity-card"
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
            delay: 0.35,
          }}
        >

          <div className="card-header">

            <div>
              <h2>Transaction Activity</h2>

              <p>
                Exception activity across the transaction
                dataset
              </p>
            </div>

            <Activity size={20} />

          </div>

          <div className="activity-chart">

            {activityData.map((value, index) => (

              <motion.div
                key={index}
                className="activity-bar"
                initial={{
                  height: 0,
                }}
                animate={{
                  height: `${value}%`,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.05,
                }}
              />

            ))}

          </div>

          <div className="chart-labels">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
          </div>

        </motion.section>

        {/* SYSTEM STATUS */}

        <motion.section
          className="dashboard-card"
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
            delay: 0.45,
          }}
        >

          <div className="card-header">

            <div>
              <h2>System Status</h2>

              <p>RECON.AI services</p>
            </div>

            <div className="system-online">
              Operational
            </div>

          </div>

          <div className="system-status-list">

            <div className="system-status-item">
              <span>FastAPI Backend</span>
              <strong>ONLINE</strong>
            </div>

            <div className="system-status-item">
              <span>Reconciliation Engine</span>
              <strong>ONLINE</strong>
            </div>

            <div className="system-status-item">
              <span>AI Investigation Engine</span>
              <strong>ONLINE</strong>
            </div>

            <div className="system-status-item">
              <span>Policy Engine</span>
              <strong>ONLINE</strong>
            </div>

          </div>

        </motion.section>

      </div>

      {/* RECENT EXCEPTIONS */}

      <motion.section
        className="dashboard-card exceptions-card"
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
          delay: 0.55,
        }}
      >

        <div className="card-header">

          <div>
            <h2>Recent Exceptions</h2>

            <p>
              Latest reconciliation anomalies
            </p>
          </div>

          <span className="exception-count">
            {metrics.exceptionCount} total
          </span>

        </div>

        {recentExceptions.length === 0 ? (

          <div className="empty-state">
            <CheckCircle2 size={18} />
            No exceptions detected.
          </div>

        ) : (

          <div className="exception-list">

            {recentExceptions.map(
              (exception, index) => (

                <motion.div
                  className="exception-row"
                  key={
                    exception.order_id ?? index
                  }
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.08,
                  }}
                >

                  <div>
                    <strong>
                      {exception.order_id}
                    </strong>

                    <span>
                      {exception.status}
                    </span>
                  </div>

                  <div>
                    <span className="exception-category">
                      {exception.exception_type ||
                        exception.status}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`severity ${
                        exception.severity?.toLowerCase() ||
                        'high'
                      }`}
                    >
                      {exception.severity ||
                        'REVIEW'}
                    </span>
                  </div>

                </motion.div>

              )
            )}

          </div>

        )}

      </motion.section>

    </div>
  )
}

export default Dashboard