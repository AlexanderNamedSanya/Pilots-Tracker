import { useEffect, useState } from 'react'

export default function Home({ roles }) {
  const [pilotName, setPilotName] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [ships, setShips] = useState([])
  const [selectedShips, setSelectedShips] = useState([])

  // Подгрузка кораблей по выбранной роли
  useEffect(() => {
    if (!selectedRole) {
      setShips([])
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Ships&role=${encodeURIComponent(selectedRole)}`)
      .then(res => res.json())
      .then(data => {
        const shipsForRole = data
          .filter(r => r.Role === selectedRole)
          .map(r => r.Ship)
        setShips(shipsForRole)
      })
      .catch(err => console.error('Ошибка загрузки кораблей:', err))
  }, [selectedRole])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pilotName || !selectedRole) return alert('Заполните имя и роль!')
    const payload = { pilotName, role: selectedRole, ships: selectedShips }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Pilots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      alert('Данные сохранены!')
      setSelectedRole('')
      setSelectedShips([])
      setPilotName('')
    } catch (err) {
      console.error(err)
      alert('Ошибка при сохранении данных')
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo">🦀</div>
        <h1>4Crabs Pilot Tracker</h1>
      </div>

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
            onChange={e => {
              setSelectedRole(e.target.value)
              setSelectedShips([])
            }}
            required
          >
            <option value="">-- Выберите роль --</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>

        {ships.length > 0 && (
          <div className="card">
            <label>Выберите корабли:</label><br/>
            {ships.map(ship => (
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

// --------------------------
// Серверный fetch ролей
// --------------------------
export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Roles`)
    const data = await res.json()
    const roles = data.map(r => r.Role) // Только поле Role
    return { props: { roles } }
  } catch (err) {
    console.error('Ошибка загрузки ролей:', err)
    return { props: { roles: [] } }
  }
}
