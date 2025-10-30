import { useEffect, useState } from 'react'

export default function Admin() {
  const [pilots, setPilots] = useState([])
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [editPilot, setEditPilot] = useState(null)
  const [editShips, setEditShips] = useState([])

  useEffect(() => {
    if (authenticated) {
      fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Pilots`)
        .then(res => res.json())
        .then(data => setPilots(data))
        .catch(err => console.error('Error loading pilots:', err))
    }
  }, [authenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true)
    } else {
      alert('Неверный пароль')
    }
  }

  const startEdit = (pilot) => {
    setEditPilot(pilot)
    setEditShips(pilot.ships)
  }

  const saveEdit = async () => {
    const updated = { ...editPilot, ships: editShips }
    try {
      await fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Pilots`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      alert('Данные сохранены')
      setEditPilot(null)
      setAuthenticated(false) // Перезагрузим список
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Ошибка при сохранении')
    }
  }

  if (!authenticated) {
    return (
      <div className="container">
        <div className="card">
          <h2>Вход для администратора</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              required
            /><br/><br/>
            <button type="submit" className="button">Войти</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo">🦀</div>
        <h1>Админская панель 4Crabs</h1>
      </div>

      {editPilot ? (
        <div className="card">
          <h2>Редактирование: {editPilot.pilotName}</h2>
          <label>Корабли:</label><br/>
          {editPilot.ships.map(ship => (
            <div key={ship}>
              <input
                type="checkbox"
                value={ship}
                checked={editShips.includes(ship)}
                onChange={e => {
                  const checked = e.target.checked
                  setEditShips(prev => checked ? [...prev, ship] : prev.filter(s => s !== ship))
                }}
              />
              <label style={{ marginLeft: '8px' }}>{ship}</label>
            </div>
          ))}
          <br/>
          <button className="button" onClick={saveEdit}>Сохранить</button>
          <button className="button" style={{marginLeft:'10px', background:'#777'}} onClick={() => setEditPilot(null)}>Отмена</button>
        </div>
      ) : (
        pilots.map(pilot => (
          <div key={pilot.pilotName} className="card">
            <h3>{pilot.pilotName}</h3>
            <p><strong>Роль:</strong> {pilot.role}</p>
            <p><strong>Корабли:</strong> {pilot.ships.join(', ') || '-'}</p>
            <button className="button" onClick={() => startEdit(pilot)}>Редактировать</button>
          </div>
        ))
      )}
    </div>
  )
}
