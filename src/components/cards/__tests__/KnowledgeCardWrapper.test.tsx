import { render, screen, fireEvent } from '@testing-library/react'
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
    expect(screen.getByText(/SAS/)).toBeInTheDocument()
  })

  it('calls onDismiss when card complete button clicked', () => {
    const onDismiss = vi.fn()
    render(
      <KnowledgeCardWrapper cardId="congruent_sas" onDismiss={onDismiss} />
    )
    fireEvent.click(screen.getByText(/回到题目/))
    expect(onDismiss).toHaveBeenCalled()
  })
})
