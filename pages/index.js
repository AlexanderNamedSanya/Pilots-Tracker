import { useEffect, useState } from 'react'

export default function Home() {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [ships, setShips] = useState([])
  const [selectedShips, setSelectedShips] = useState([])
  const [pilotName, setPilotName] = useState('')

  // Загрузка ролей из Google Sheets через API
  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Roles`)
    .then(res => res.json())
    .then(data => {
      // data = [{"Role":"DPS"}, {"Role":"Логист"}, ...]
      const rolesArray = data.map(r => r.Role)  // <-- обязательно берём свойство Role
      setRoles(rolesArray)
    })
    .catch(err => console.error('Error loading roles:', err))
}, [])

  // Подгрузка кораблей в зависимости от выбранной роли
  useEffect(() => {
    if (!selectedRole) return
    fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Ships&role=${selectedRole}`)
      .then(res => res.json())
      .then(data => setShips(data))
      .catch(err => console.error('Error loading ships:', err))
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
    } catch (err) {
      console.error(err)
      alert('Ошибка при сохранении')
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
          <label>Выберите роль:</label><br/>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} required>
            <option value="">-- Выберите роль --</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>

        </div>

        {ships.length > 0 && (
          <div className="card">
            <label>Выберите корабли, которые умеете летать:</label><br/>
            {ships.map(ship => (
              <div key={ship}>
                <input
                  type="checkbox"
                  id={ship}
                  value={ship}
                  checked={selectedShips.includes(ship)}
                  onChange={e => {
                    const checked = e.target.checked
                    setSelectedShips(prev => checked ? [...prev, ship] : prev.filter(s => s !== ship))
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
