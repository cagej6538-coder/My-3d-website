import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; onError: () => void }
type State = { failed: boolean }

export class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('3D scene failed; switching to film fallback.', error, info)
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
