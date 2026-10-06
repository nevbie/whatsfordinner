export function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange(v: number): void; label: string }) {
  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <button className="icon-btn" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label} −`}>
        −
      </button>
      <span className="stepper-value">{value}</span>
      <button className="icon-btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label} +`}>
        +
      </button>
    </div>
  )
}
