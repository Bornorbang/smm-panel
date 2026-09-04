export function StatusPill({status}:{status:string}){const kind=status.toLowerCase().replaceAll(" ","-");return <span className={`status-pill status-${kind}`}>{status}</span>}
