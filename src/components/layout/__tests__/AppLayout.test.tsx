import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../../../App'

describe('App layout', () => {
  it('renders problem panel and interaction panel side by side', () => {
    render(<App />)
    expect(screen.getByTestId('problem-panel')).toBeInTheDocument()
    expect(screen.getByTestId('interaction-panel')).toBeInTheDocument()
  })

  it('problem panel contains expected content', () => {
    render(<App />)
    expect(screen.getByText('题目')).toBeInTheDocument()
    expect(screen.getByText('已知条件：')).toBeInTheDocument()
  })
})
