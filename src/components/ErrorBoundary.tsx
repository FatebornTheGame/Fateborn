import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children:    ReactNode
  screenName?: string
}

interface State {
  hasError: boolean
  message:  string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', this.props.screenName, error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-felt text-gold gap-4 p-8">
          <p className="font-cinzel text-lg">
            {this.props.screenName ?? 'FATEBORN'} — Error inesperado
          </p>
          <p className="text-sm text-muted max-w-md text-center">{this.state.message}</p>
          <button
            className="mt-4 px-6 py-2 border border-gold text-gold font-cinzel text-sm hover:bg-gold hover:text-felt transition-colors"
            onClick={() => window.location.reload()}
          >
            REINICIAR
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
