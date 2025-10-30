import { useEffect, useState } from 'react'

export default function Stats() {
  const [pilots, setPilots] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_GSHEET_API}?sheet=Pilots`)
      .then(res => res.json())
      .then(data => setPilots(data))
      .catch(err => console.error('Error loading pilots:', err))
  }, [])

  // Считаем статистику по ролям
  const roleStats = pilots.reduce((acc, pilot) => {
    if (pilot.role) acc[pilot.role] = (acc[pilot.role] || 0) + 1
    return acc
  }, {})

  return (
    <div className="container">
      <div className="header">
        <div className="logo">🦀</div>
        <h1>Статистика пилотов 4Crabs</h1>
      </div>

      <div className="card">
        <h2>Общее количество пилотов: {pilots.length}</h2>
        <ul>
          {Object.entries(roleStats).map(([role, count]) => (
            <li key={role}>{role}: {count}</li>
          ))}
        </ul>
      </div>

      {pilots.map(pilot => (
        <div key={pilot.pilotName} className="card">
          <h3>{pilot.pilotName}</h3>
          <p><strong>Роль:</strong> {pilot.role}</p>
          <p><strong>Корабли:</strong> {pilot.ships.join(', ') || '-'}</p>
        </div>
      ))}
    </div>
  )
}
