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
    <div className="container mx-auto p-6 text-white bg-black min-h-screen font-sans">
      <h1 className="text-3xl mb-6">4Crabs Pilot Tracker</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="card p-4 bg-gray-900 rounded shadow">
          <label className="block mb-1">Имя пилота:</label>
          <input
            type="text"
            value={pilotName}
            onChange={e => setPilotName(e.target.value)}
            placeholder="Введите ник"
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
        </div>

        <div className="card p-4 bg-gray-900 rounded shadow">
          <label className="block mb-1">Роль:</label>
          <select
            value={selectedRole}
            onChange={e => { setSelectedRole(e.target.value); setSelectedShips([]) }}
            required
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
          >
            <option value="">-- Выберите роль --</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {shipsForRole.length > 0 && (
          <div className="card p-4 bg-gray-900 rounded shadow">
            <label className="block mb-2">Выберите корабли:</label>
            <div className="grid grid-cols-2 gap-2">
              {shipsForRole.map(ship => (
                <label key={ship} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={ship}
                    checked={selectedShips.includes(ship)}
                    onChange={e => {
                      const checked = e.target.checked
                      setSelectedShips(prev =>
                        checked ? [...prev, ship] : prev.filter(s => s !== ship)
                      )
                    }}
                    className="w-4 h-4"
                  />
                  <span>{ship}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="card p-4 bg-gray-900 rounded shadow">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-bold"
          >
            Сохранить
          </button>
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
