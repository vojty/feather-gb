import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { FullscreenLoader } from './common/FullscreenLoader'

import { Landing } from './pages/Landing'

const Play = lazy(() => import('./pages/Play'))
const Debugger = lazy(() => import('./pages/Debugger'))
const TestResults = lazy(() => import('./pages/TestResults'))

export function AppRouter() {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Routes>
        <Route path="/debug" element={<Debugger />} />
        <Route path="/test-results" element={<TestResults />} />
        <Route path="/play" element={<Play />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </Suspense>
  )
}
