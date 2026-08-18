interface Props { name: string; className?: string; style?: React.CSSProperties }
export default function MatIcon({ name, className = '', style }: Props) {
  return <span className={`mat-icon ${className}`} style={style}>{name}</span>
}
