import { useEffect, useState } from "react";
import { getAllPilots, upsertPilot } from "../utils/api";

const ADMIN_PASSWORD = "4crabs"; // можно вынести в ENV

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [pilots, setPilots] = useState([]);

  useEffect(()=>{
    if(authenticated){
      getAllPilots().then(setPilots);
    }
  },[authenticated]);

  const handleLogin = e => {
    e.preventDefault();
    if(password === ADMIN_PASSWORD) setAuthenticated(true);
  }

  const updatePilot = async (pilot) => {
    await upsertPilot(pilot);
    alert("Сохранено!");
  }

  if(!authenticated){
    return (
      <form onSubmit={handleLogin}>
        <input type="password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Войти</button>
      </form>
    )
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2>Админка</h2>
      {pilots.map(p=>(
        <div key={p["Ник пилота"]} className="border p-2 my-2">
          <p><b>{p["Ник пилота"]}</b></p>
          <p>Роли: <input value={p["Роли"]} onChange={e=>p["Роли"]=e.target.value} /></p>
          <p>Корабли: <input value={p["Корабли"]} onChange={e=>p["Корабли"]=e.target.value} /></p>
          <p>Примечания: <input value={p["Примечания"]} onChange={e=>p["Примечания"]=e.target.value} /></p>
          <p>Уровень: <input value={p["Уровень подготовки"]} onChange={e=>p["Уровень подготовки"]=e.target.value} /></p>
          <button onClick={()=>updatePilot(p)}>Сохранить</button>
        </div>
      ))}
    </div>
  )
}
