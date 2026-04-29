import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ChatInput } from '../ChatInput'

describe('ChatInput', () => {
  it('calls onSend with trimmed text when send button clicked', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} disabled={false} />)
    const textarea = screen.getByPlaceholderText(/说说你的想法/)
    fireEvent.change(textarea, { target: { value: '  hello  ' } })
    fireEvent.click(screen.getByText('发送'))
    expect(onSend).toHaveBeenCalledWith('hello')
  })

  it('calls onSend on Enter key (not Shift+Enter)', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} disabled={false} />)
    const textarea = screen.getByPlaceholderText(/说说你的想法/)
    fireEvent.change(textarea, { target: { value: 'test' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    expect(onSend).toHaveBeenCalledWith('test')
  })

  it('does not call onSend on Shift+Enter', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} disabled={false} />)
    const textarea = screen.getByPlaceholderText(/说说你的想法/)
    fireEvent.change(textarea, { target: { value: 'test' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()
  })

  it('clears input after send', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} disabled={false} />)
    const textarea = screen.getByPlaceholderText(/说说你的想法/) as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'hello' } })
    fireEvent.click(screen.getByText('发送'))
    expect(textarea.value).toBe('')
  })

  it('disables send button when disabled prop is true', () => {
    render(<ChatInput onSend={vi.fn()} disabled={true} />)
    expect(screen.getByText('发送')).toBeDisabled()
  })
})
