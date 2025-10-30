// pages/index.js
import { useState, useEffect } from 'react'

export default function Home({ roles }) {
  const [pilotName, setPilotName] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [ships, setShips] = useState([])
  const [selectedShips, setSelectedShips] = useState([])

  // Динамическая подгрузка кораблей по роли
  useEffect(() => {
    if (!selectedRole) return setShips([])

    fetch(`/api/proxy?sheet=Ships&role=${encodeURIComponent(selectedRole)}`)
      .then(res => res.json())
      .then(data => {
        const shipsForRole = data.filter(r => r.Role === selectedRole).map(r => r.Ship)
        setShips(shipsForRole)
      })
      .catch(err => console.error(err))
  }, [selectedRole])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!pilotName || !selectedRole) return alert('Заполните имя и роль!')

    const payload = { pilotName, role: selectedRole, ships: selectedShips }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Pilots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.status === 'ok') alert('Данные сохранены!')
      else alert('Ошибка: ' + data.message)
    } catch (err) {
      console.error(err)
      alert('Ошибка при сохранении данных')
    }
  }

  return (
    <div className="container">
      <h1>4Crabs Pilot Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input value={pilotName} onChange={e => setPilotName(e.target.value)} placeholder="Ник пилота" required />
        <select value={selectedRole} onChange={e => {setSelectedRole(e.target.value); setSelectedShips([])}} required>
          <option value="">-- Выберите роль --</option>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        {ships.length > 0 && ships.map(ship => (
          <label key={ship}>
            <input type="checkbox" value={ship} checked={selectedShips.includes(ship)}
                   onChange={e => {
                     const checked = e.target.checked
                     setSelectedShips(prev => checked ? [...prev, ship] : prev.filter(s => s !== ship))
                   }} />
            {ship}
          </label>
        ))}

        <button type="submit">Сохранить</button>
      </form>
    </div>
  )
}

// ---------------------------
// fetch ролей на сервере
// ---------------------------
export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Roles`)
    const data = await res.json()
    const roles = data.map(r => r.Role)
    return { props: { roles } }
  } catch (err) {
    console.error(err)
    return { props: { roles: [] } }
  }
}
