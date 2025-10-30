import { useState, useEffect } from "react";
import ShipSelector from "./ShipSelector";
import { getRoles } from "../utils/api";

export default function RoleSelector({ selectedRoles, setSelectedRoles, selectedShips, setSelectedShips }) {
  const [rolesData, setRolesData] = useState([]);

  useEffect(() => {
    getRoles().then(data => setRolesData(data));
  }, []);

  const toggleRole = (role) => {
    if(selectedRoles.includes(role)){
      setSelectedRoles(selectedRoles.filter(r=>r!==role));
      setSelectedShips(selectedShips.filter(ship => !rolesData.find(r=>r.Роль===role).Корабли.includes(ship)));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  }

  return (
    <div>
      <h3>Выберите роли</h3>
      {rolesData.map(r => (
        <div key={r.Роль}>
          <input type="checkbox" id={r.Роль} checked={selectedRoles.includes(r.Роль)} onChange={()=>toggleRole(r.Роль)} />
          <label htmlFor={r.Роль}>{r.Роль}</label>
        </div>
      ))}
      <ShipSelector roles={selectedRoles} rolesData={rolesData} selectedShips={selectedShips} setSelectedShips={setSelectedShips} />
    </div>
  )
}
