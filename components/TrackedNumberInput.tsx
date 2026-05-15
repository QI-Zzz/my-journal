import { useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { Colors } from '../constants/theme'

interface Props {
  value: number          // always stored as decimal hours e.g. 1.5 = 1h 30m
  onChange: (num: number) => void
  style?: object
  decimal?: boolean
  timeFormat?: boolean   // shows "Xh Ym" input instead of decimal number
}

// ─── Time format helpers ───────────────────────────────────────────────────────
// We store time as decimal hours everywhere in storage.
// timeFormat just changes HOW the user inputs it — still saves as decimal.
// e.g. user types "2h 30m" → saved as 2.5

const toHoursMinutes = (decimal: number): { hours: number; minutes: number } => {
  const h = Math.floor(decimal)
  const m = Math.round((decimal - h) * 60)
  return { hours: h, minutes: m }
}

const toDecimal = (hours: number, minutes: number): number => {
  return hours + minutes / 60
}

// ─── Time Format Input ─────────────────────────────────────────────────────────
function TimeFormatInput({ value, onChange, style }: {
  value: number
  onChange: (num: number) => void
  style?: object
}) {
  const { hours, minutes } = toHoursMinutes(value)
  const [hText, setHText] = useState(hours.toString())
  const [mText, setMText] = useState(minutes.toString().padStart(2, '0'))

  useEffect(() => {
    const { hours: h, minutes: m } = toHoursMinutes(value)
    setHText(h.toString())
    setMText(m.toString().padStart(2, '0'))
  }, [value])

  const commit = (newH: string, newM: string) => {
    const h = parseInt(newH, 10) || 0
    const m = Math.min(59, Math.max(0, parseInt(newM, 10) || 0))
    onChange(toDecimal(h, m))
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, maxWidth: 110 }}>
      <TextInput
        style={[style, { minWidth: 28, textAlign: 'right' }]}
        value={hText}
        onChangeText={(t) => {
          setHText(t)
          const h = parseInt(t, 10)
          if (!isNaN(h)) commit(t, mText)
        }}
        onBlur={() => {
          if (isNaN(parseInt(hText, 10))) {
            setHText('0')
            commit('0', mText)
          }
        }}
        keyboardType="number-pad"
        selectTextOnFocus
        placeholder="0"
        placeholderTextColor={Colors.textMuted}
      />
      <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>h</Text>
      <TextInput
        style={[style, { minWidth: 28, textAlign: 'right' }]}
        value={mText}
        onChangeText={(t) => {
          setMText(t)
          const m = parseInt(t, 10)
          if (!isNaN(m)) commit(hText, t)
        }}
        onBlur={() => {
          const m = parseInt(mText, 10)
          if (isNaN(m)) {
            setMText('00')
            commit(hText, '0')
          } else {
            setMText(m.toString().padStart(2, '0'))
          }
        }}
        keyboardType="number-pad"
        selectTextOnFocus
        placeholder="00"
        placeholderTextColor={Colors.textMuted}
      />
      <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>m</Text>
    </View>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function TrackedNumberInput({ value, onChange, style, decimal = false, timeFormat = false }: Props) {
  if (timeFormat) {
    return <TimeFormatInput value={value} onChange={onChange} style={style} />
  }

  const [text, setText] = useState(value?.toString() ?? '0')

  useEffect(() => {
    setText(value?.toString() ?? '0')
  }, [value])

  return (
    <TextInput
      style={style}
      value={text}
      onChangeText={(t) => {
        setText(t)
        const num = decimal ? parseFloat(t) : parseInt(t, 10)
        if (!isNaN(num)) onChange(num)
      }}
      onBlur={() => {
        const num = decimal ? parseFloat(text) : parseInt(text, 10)
        if (isNaN(num)) {
          setText('0')
          onChange(0)
        } else {
          setText(num.toString())
        }
      }}
      keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
      selectTextOnFocus
      placeholder="0"
      placeholderTextColor={Colors.textMuted}
    />
  )
}