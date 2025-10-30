export default function ShipSelector({ roles, rolesData, selectedShips, setSelectedShips }) {
  const shipsToShow = roles.flatMap(role => rolesData.find(r=>r.Роль===role)?.Корабли || []);

  const toggleShip = (ship) => {
    if(selectedShips.includes(ship)){
      setSelectedShips(selectedShips.filter(s=>s!==ship));
    } else {
      setSelectedShips([...selectedShips, ship]);
    }
  }

  if(!shipsToShow.length) return null;

  return (
    <div>
      <h4>Выберите корабли</h4>
      {shipsToShow.map(ship => (
        <div key={ship}>
          <input type="checkbox" id={ship} checked={selectedShips.includes(ship)} onChange={()=>toggleShip(ship)} />
          <label htmlFor={ship}>{ship}</label>
        </div>
      ))}
    </div>
  )
}
