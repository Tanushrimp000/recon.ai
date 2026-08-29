import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ArrowLeftRight,
  BrainCircuit,
  FileSearch,
  ShieldCheck,
  Activity,
} from 'lucide-react'

import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Investigations from './pages/Investigations'
import Evidence from './pages/Evidence'
import Policies from './pages/Policies'

import './App.css'

const navigation = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Transactions',
    path: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    name: 'Investigations',
    path: '/investigations',
    icon: BrainCircuit,
  },
  {
    name: 'Evidence',
    path: '/evidence',
    icon: FileSearch,
  },
  {
    name: 'Policies',
    path: '/policies',
    icon: ShieldCheck,
  },
]

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* SIDEBAR */}
        <motion.aside
          className="sidebar"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          {/* LOGO */}
          <div className="logo">
            <div className="logo-mark">
              R
            </div>

            <div>
              <span className="logo-title">
                RECON<span>.AI</span>
              </span>

              <small>
                Intelligence Platform
              </small>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="navigation">

            <p className="nav-label">
              WORKSPACE
            </p>

            {navigation.map(({ name, path, icon: Icon }) => (

              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >

                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.3 : 1.8}
                    />

                    <span>
                      {name}
                    </span>

                    {isActive && (
                      <motion.div
                        className="active-indicator"
                        layoutId="active-indicator"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </>
                )}

              </NavLink>

            ))}

          </nav>

          {/* SYSTEM STATUS */}
          <div className="sidebar-bottom">

            <div className="system-card">

              <div className="system-header">

                <div className="system-icon">
                  <Activity size={16} />
                </div>

                <span>
                  System Status
                </span>

              </div>

              <div className="system-status">

                <span className="status-dot" />

                <span>
                  All systems operational
                </span>

              </div>

            </div>

            <p className="sidebar-description">
              AI-powered transaction reconciliation
              and exception intelligence.
            </p>

            <div className="version">
              RECON.AI v0.1.0
            </div>

          </div>

        </motion.aside>

        {/* MAIN CONTENT */}
        <main className="main">

          <motion.div
            className="page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/transactions"
                element={<Transactions />}
              />

              <Route
                path="/investigations"
                element={<Investigations />}
              />

              <Route
                path="/evidence"
                element={<Evidence />}
              />

              <Route
                path="/policies"
                element={<Policies />}
              />

            </Routes>

          </motion.div>

        </main>

      </div>
    </BrowserRouter>
  )
}

export default App