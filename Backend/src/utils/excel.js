import XLSX from 'xlsx'
import Student from '../models/Student.js'

export const exportStudentsXlsx = async () => {
  const students = await Student.find().lean()
  const rows = students.map((s) => ({
    Name: s.name,
    Email: s.email || '',
    Class: s.className,
    Gender: s.gender,
    ProfilePhotoUrl: s.profilePhotoUrl || '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Students')
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  return buf
}

export const importStudentsXlsx = async (buffer) => {
  const wb = XLSX.read(buffer, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const json = XLSX.utils.sheet_to_json(ws, { defval: '' })

  const results = { created: 0, skipped: 0, errors: [] }

  for (let i = 0; i < json.length; i++) {
    const r = json[i]
    const name = String(r.Name || '').trim()
    const className = String(r.Class || '').trim()
    const gender = String(r.Gender || '').trim()
    const email = String(r.Email || '')
      .trim()
      .toLowerCase()
    const profilePhotoUrl = String(r.ProfilePhotoUrl || '').trim()

    if (!name || !className || !gender) {
      results.skipped++
      results.errors.push({
        row: i + 2,
        reason: 'Missing required fields (Name, Class, Gender)',
      })
      continue
    }

    // Avoid duplicates by email if present, else by (name+class)
    const dupQuery = email ? { email } : { name, className }
    const existing = await Student.findOne(dupQuery)
    if (existing) {
      results.skipped++
      continue
    }

    await Student.create({
      name,
      email: email || undefined,
      className,
      gender,
      profilePhotoUrl,
    })
    results.created++
  }

  return results
}
