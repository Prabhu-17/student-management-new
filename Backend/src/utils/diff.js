export const diffObjects = (before = {}, after = {}) => {
  const changed = {}
  const keys = new Set([...Object.keys(before), ...Object.keys(after)])
  for (const k of keys) {
    if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) {
      changed[k] = { before: before[k], after: after[k] }
    }
  }
  return changed
}
