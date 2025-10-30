import { useEffect, useState } from "react";
import { getAllPilots } from "../utils/api";

export default function Stats() {
  const [pilots, setPilots] = useState([]);

  useEffect(()=>{
    getAllPilots().then(setPilots);
  },[]);

  const roleCounts = {};
  const shipCounts = {};
  pilots.forEach(p=>{
    p["Роли"]?.split(", ").forEach(r=> roleCounts[r] = (roleCounts[r]||0)+1);
    p["Корабли"]?.split(", ").forEach(s=> shipCounts[s] = (shipCounts[s]||0)+1);
  });

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2>Статистика пилотов</h2>
      <h3>Роли</h3>
      <ul>{Object.entries(roleCounts).map(([role,count])=><li key={role}>{role}: {count}</li>)}</ul>
      <h3>Корабли</h3>
      <ul>{Object.entries(shipCounts).map(([ship,count])=><li key={ship}>{ship}: {count}</li>)}</ul>
    </div>
  )
}
