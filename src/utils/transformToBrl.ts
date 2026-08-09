import { formatCurrency } from './currency'

export function transformToBrl(value: number, onlyDecimal: boolean = false) {
  return formatCurrency(value, onlyDecimal)
}
