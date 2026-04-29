import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { KnowledgeCardWrapper } from '../KnowledgeCardWrapper'

describe('KnowledgeCardWrapper', () => {
  it('renders nothing when cardId is null', () => {
    const { container } = render(
      <KnowledgeCardWrapper cardId={null} onDismiss={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders correct card for congruent_sas', () => {
    render(
      <KnowledgeCardWrapper cardId="congruent_sas" onDismiss={vi.fn()} />
    )
    expect(screen.getAllByText(/SAS/).length).toBeGreaterThan(0)
  })

  it('calls onDismiss when card complete button clicked', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(
      <KnowledgeCardWrapper cardId="congruent_sas" onDismiss={onDismiss} />
    )
    // Bring sliders to matched values: a'=80, b'=100, θ=55
    const [sliderA, sliderB, sliderAngle] = screen.getAllByRole('slider')
    fireEvent.change(sliderA, { target: { value: '80' } })
    fireEvent.change(sliderB, { target: { value: '100' } })
    fireEvent.change(sliderAngle, { target: { value: '55' } })
    fireEvent.click(screen.getByText(/回到题目/))
    act(() => { vi.advanceTimersByTime(1300) })
    expect(onDismiss).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
