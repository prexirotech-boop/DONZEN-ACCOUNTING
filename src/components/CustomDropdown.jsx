import { useState, useRef, useEffect } from 'react'

/**
 * Custom styled dropdown component to replace native <select>
 * Meets strict SaaS design system standards with zero browser chrome.
 */
export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  label = null,
  helperText = null,
  disabled = false,
  error = null,
  style = {},
  buttonStyle = {}
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedOption = options.find(opt => String(opt.value) === String(value))

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', ...style }}>
      {label && (
        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: disabled ? '#f8fafc' : '#ffffff',
          border: `1.5px solid ${error ? '#ef4444' : isOpen ? '#ff1717' : '#cbd5e1'}`,
          borderRadius: 6,
          fontSize: 13.5,
          color: selectedOption ? '#0f172a' : '#94a3b8',
          fontWeight: selectedOption ? 600 : 400,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(255, 23, 23, 0.15)' : 'none',
          transition: 'all 0.15s ease',
          boxSizing: 'border-box',
          ...buttonStyle
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.icon && <span style={{ fontSize: 16 }}>{selectedOption.icon}</span>}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>

        {/* Chevron Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isOpen ? '#ff1717' : '#64748b'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: 8
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 10000,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            maxHeight: 240,
            overflowY: 'auto',
            animation: 'dropdownFadeIn 0.15s ease-out'
          }}
        >
          <div style={{ padding: 4 }}>
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value)
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 12px',
                    borderRadius: 6,
                    background: isSelected ? '#fff5f5' : 'transparent',
                    color: isSelected ? '#ff1717' : '#1e293b',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                    marginBottom: 2
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#f8fafc'
                      e.currentTarget.style.color = '#0f172a'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#1e293b'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {opt.icon && <span style={{ fontSize: 15 }}>{opt.icon}</span>}
                    <div>
                      <div>{opt.label}</div>
                      {opt.description && (
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 400 }}>{opt.description}</div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <span style={{ color: '#ff1717', fontWeight: 800, fontSize: 14 }}>✓</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {helperText && !error && (
        <p style={{ fontSize: 11.5, color: '#64748b', marginTop: 4, marginBottom: 0 }}>
          {helperText}
        </p>
      )}

      {error && (
        <p style={{ fontSize: 11.5, color: '#ef4444', marginTop: 4, marginBottom: 0 }}>
          {error}
        </p>
      )}
    </div>
  )
}
