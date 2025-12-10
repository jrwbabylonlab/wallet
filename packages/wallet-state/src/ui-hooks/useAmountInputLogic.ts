import { useCallback, useEffect, useRef, useState } from 'react'

export interface AmountInputProps {}

export function useAmountInputLogic(props: {
  value?: string
  runesDecimal?: number
  disableDecimal?: boolean
  enableBrc20Decimal?: boolean
  onAmountInputChange?: (amount: string) => void

  min?: number
  step?: number
}) {
  const { disableDecimal, enableBrc20Decimal, runesDecimal, onAmountInputChange, min, step } = props

  const [inputValue, setInputValue] = useState(props.value || '')

  useEffect(() => {
    onAmountInputChange(inputValue)
  }, [inputValue])

  const propValueRef = useRef(props.value)
  useEffect(() => {
    if (props.value !== propValueRef.current) {
      propValueRef.current = props.value
      setInputValue(props.value || '')
    }
  }, [props.value])

  const handleInputAmount = useCallback(
    (e: { target: { value: string } } | string) => {
      const raw = typeof e === 'string' ? e : e.target.value

      let regex: RegExp
      if (disableDecimal) {
        regex = /^[1-9]\d*$/
      } else if (enableBrc20Decimal) {
        regex = /^(0(\.\d{0,18})?|[1-9]\d*\.?\d{0,18})$/
      } else if (runesDecimal !== undefined) {
        regex = new RegExp(`^(0(\\.\\d{0,${runesDecimal}})?|[1-9]\\d*\\.?\\d{0,${runesDecimal}})$`)
      } else {
        regex = /^(0(\.\d{0,8})?|[1-9]\d*\.?\d{0,8})$/
      }

      if (regex.test(raw) || raw === '') {
        setInputValue(raw)
      }
    },
    [disableDecimal, enableBrc20Decimal, runesDecimal]
  )

  const handleStepUp = useCallback(() => {
    setInputValue(prev => {
      const currentVal = parseFloat(prev) || 0
      const decimal = runesDecimal ?? 2
      return (currentVal + step).toFixed(decimal)
    })
  }, [step, runesDecimal])

  const handleStepDown = useCallback(() => {
    setInputValue(prev => {
      const currentVal = parseFloat(prev) || 0
      const decimal = runesDecimal ?? 2
      return Math.max(min, currentVal - step).toFixed(decimal)
    })
  }, [step, min, runesDecimal])

  const handleReset = useCallback(() => {
    setInputValue('')
  }, [])

  return {
    handleInputAmount,
    handleStepUp,
    handleStepDown,
    handleReset,
    inputValue,
  }
}
