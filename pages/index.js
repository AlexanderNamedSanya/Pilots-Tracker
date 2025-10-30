import { useState } from 'react'

export default function Home({ roles, shipsData }) {
  const [pilotName, setPilotName] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedShips, setSelectedShips] = useState([])

  // Фильтруем корабли по выбранной роли
  const shipsForRole = selectedRole
    ? shipsData.filter(s => s.Role === selectedRole).map(s => s.Ship)
    : []

  const handleSubmit = async (e) => {
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
      if (data.status === 'ok') {
        alert('Данные сохранены!')
        setPilotName('')
        setSelectedRole('')
        setSelectedShips([])
      } else {
        alert('Ошибка: ' + data.message)
      }
    } catch (err) {
      console.error(err)
      alert('Ошибка при сохранении данных')
    }
  }

  return (
    <div className="container">
      <h1>4Crabs Pilot Tracker</h1>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <label>Имя пилота:</label><br/>
          <input
            type="text"
            value={pilotName}
            onChange={e => setPilotName(e.target.value)}
            placeholder="Введите ник"
            required
          />
        </div>

        <div className="card">
          <label>Роль:</label><br/>
          <select
            value={selectedRole}
            onChange={e => { setSelectedRole(e.target.value); setSelectedShips([]) }}
            required
          >
            <option value="">-- Выберите роль --</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {shipsForRole.length > 0 && (
          <div className="card">
            <label>Выберите корабли:</label><br/>
            {shipsForRole.map(ship => (
              <div key={ship}>
                <input
                  type="checkbox"
                  id={ship}
                  value={ship}
                  checked={selectedShips.includes(ship)}
                  onChange={e => {
                    const checked = e.target.checked
                    setSelectedShips(prev =>
                      checked ? [...prev, ship] : prev.filter(s => s !== ship)
                    )
                  }}
                />
                <label htmlFor={ship} style={{ marginLeft: '8px' }}>{ship}</label>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <button type="submit" className="button">Сохранить</button>
        </div>
      </form>
    </div>
  )
}

// ---------------------------
// Серверный fetch ролей и кораблей
// ---------------------------
export async function getServerSideProps() {
  try {
    const rolesRes = await fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Roles`)
    const rolesData = await rolesRes.json()
    const roles = rolesData.map(r => r.Role)

    const shipsRes = await fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Ships`)
    const shipsData = await shipsRes.json()

    return { props: { roles, shipsData } }
  } catch (err) {
    console.error('Ошибка загрузки данных:', err)
    return { props: { roles: [], shipsData: [] } }
  }
}
