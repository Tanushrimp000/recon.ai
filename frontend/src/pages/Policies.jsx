import { motion } from 'framer-motion'
import {
  ShieldCheck,
  UserRoundCheck,
  BrainCircuit,
  IndianRupee,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

import './Policies.css'

function Policies() {
  const policies = [
    {
      title: 'Human Review Override',
      description:
        'Exceptions requiring human review cannot be automatically resolved.',
      rule: 'human_review_required = true',
      action: 'HUMAN_REVIEW',
      icon: UserRoundCheck,
    },
    {
      title: 'High Severity Protection',
      description:
        'High-severity financial exceptions always require manual review.',
      rule: 'severity = HIGH',
      action: 'HUMAN_REVIEW',
      icon: AlertTriangle,
    },
    {
      title: 'AI Confidence Threshold',
      description:
        'Automatic resolution is allowed only when AI confidence is at least 90%.',
      rule: 'confidence >= 0.90',
      action: 'AUTO_RESOLVE',
      icon: BrainCircuit,
    },
    {
      title: 'Financial Impact Limit',
      description:
        'Transactions with financial impact above ₹500 require human review.',
      rule: '|financial_impact| <= ₹500',
      action: 'AUTO_RESOLVE',
      icon: IndianRupee,
    },
  ]

  return (
    <div className="policies-page">

      <motion.div
        className="policies-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="eyebrow">AUTOMATION GOVERNANCE</p>

          <h1>Policy Engine</h1>

          <p className="page-subtitle">
            Deterministic rules controlling automatic resolution
            and human review decisions.
          </p>
        </div>

        <div className="policy-status">
          <span className="policy-status-dot"></span>
          POLICY ENGINE ACTIVE
        </div>
      </motion.div>

      <div className="policy-overview">

        <motion.div
          className="policy-overview-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="overview-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <span>Policy Status</span>
            <strong>ACTIVE</strong>
          </div>
        </motion.div>

        <motion.div
          className="policy-overview-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <div className="overview-icon">
            <BrainCircuit size={22} />
          </div>

          <div>
            <span>AI Confidence</span>
            <strong>90% Minimum</strong>
          </div>
        </motion.div>

        <motion.div
          className="policy-overview-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          <div className="overview-icon">
            <IndianRupee size={22} />
          </div>

          <div>
            <span>Auto-Resolve Limit</span>
            <strong>₹500</strong>
          </div>
        </motion.div>

        <motion.div
          className="policy-overview-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
        >
          <div className="overview-icon">
            <UserRoundCheck size={22} />
          </div>

          <div>
            <span>High Severity</span>
            <strong>Manual Review</strong>
          </div>
        </motion.div>

      </div>

      <motion.section
        className="policies-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >

        <div className="section-header">
          <div>
            <h2>Active Policies</h2>

            <p>
              Deterministic rules applied after AI investigation.
            </p>
          </div>

          <span className="policy-count">
            {policies.length} Active Rules
          </span>
        </div>

        <div className="policy-list">

          {policies.map((policy, index) => {
            const Icon = policy.icon

            return (
              <motion.div
                className="policy-card"
                key={policy.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.35 + index * 0.08,
                }}
              >

                <div className="policy-icon">
                  <Icon size={20} />
                </div>

                <div className="policy-content">

                  <div className="policy-title-row">
                    <h3>{policy.title}</h3>

                    <span className="active-badge">
                      <CheckCircle2 size={13} />
                      ACTIVE
                    </span>
                  </div>

                  <p>
                    {policy.description}
                  </p>

                  <div className="policy-rule">
                    <span>RULE</span>
                    <code>{policy.rule}</code>
                  </div>

                </div>

                <div className="policy-action">
                  <span>DECISION</span>

                  <strong>
                    {policy.action}
                  </strong>
                </div>

              </motion.div>
            )
          })}

        </div>

      </motion.section>

      <motion.div
        className="policy-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <ShieldCheck size={18} />

        <div>
          <strong>Deterministic Policy Layer</strong>

          <p>
            The AI investigation agent can recommend an action,
            but the policy engine determines whether automatic
            resolution is permitted.
          </p>
        </div>
      </motion.div>

    </div>
  )
}

export default Policies