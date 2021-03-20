import { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router'
import { FullscreenLoader } from './FullscreenLoader'

import { Landing } from './Landing'

const Standalone = lazy(() => import('./Standalone'))
const Debugger = lazy(() => import('./Debugger'))

export function AppRouter() {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Switch>
        <Route path="/debug">
          <Debugger />
        </Route>
        <Route path="/play">
          <Standalone />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </Suspense>
  )
}
