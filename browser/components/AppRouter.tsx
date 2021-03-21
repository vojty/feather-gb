import { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router'
import { FullscreenLoader } from './common/FullscreenLoader'

import { Landing } from './pages/Landing'

const Play = lazy(() => import('./pages/Play'))
const Debugger = lazy(() => import('./pages/Debugger'))
const TestResults = lazy(() => import('./pages/TestResults'))

export function AppRouter() {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Switch>
        <Route path="/debug">
          <Debugger />
        </Route>
        <Route path="/test-results">
          <TestResults />
        </Route>
        <Route path="/play">
          <Play />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </Suspense>
  )
}
