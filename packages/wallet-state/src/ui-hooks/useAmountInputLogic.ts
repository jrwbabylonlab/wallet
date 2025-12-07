import { useEffect, useState } from 'react'

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
  const [validAmount, setValidAmount] = useState(props.value || '')

  useEffect(() => {
    onAmountInputChange(validAmount)
  }, [validAmount])

  useEffect(() => {
    handleInputAmount(props.value || '')
  }, [props.value])

  const handleInputAmount = (e: { target: { value: string } } | string) => {
    const value = typeof e === 'string' ? e : e.target.value
    if (disableDecimal) {
      if (/^[1-9]\d*$/.test(value) || value === '') {
        setValidAmount(value)
        setInputValue(value)
      }
    } else {
      if (enableBrc20Decimal) {
        if (/^(0(\.\d{0,18})?|[1-9]\d*\.?\d{0,18})$/.test(value) || value === '') {
          setValidAmount(value)
          setInputValue(value)
        }
      } else if (runesDecimal !== undefined) {
        const regex = new RegExp(
          `^(0(\\.\\d{0,${runesDecimal}})?|[1-9]\\d*\\.?\\d{0,${runesDecimal}})$`
        )
        if (regex.test(value) || value === '') {
          setValidAmount(value)
          setInputValue(value)
        }
      } else {
        if (/^(0(\.\d{0,8})?|[1-9]\d*\.?\d{0,8})$/.test(value) || value === '') {
          setValidAmount(value)
          setInputValue(value)
        }
      }
    }
  }

  const handleStepUp = () => {
    const currentVal = parseFloat(props.value!) || 0
    const decimal = runesDecimal !== undefined ? runesDecimal : 2
    const newVal = (currentVal + step).toFixed(decimal)
    setValidAmount(newVal)
    setInputValue(newVal)
  }

  const handleStepDown = () => {
    const currentVal = parseFloat(props.value!) || 0
    const decimal = runesDecimal !== undefined ? runesDecimal : 2
    const newVal = Math.max(min, currentVal - step).toFixed(decimal)
    setValidAmount(newVal)
    setInputValue(newVal)
  }

  const handleReset = () => {
    setValidAmount('')
    setInputValue('')
  }

  return {
    handleInputAmount,
    handleStepUp,
    handleStepDown,
    handleReset,
    inputValue,
    validAmount,
  }
}
