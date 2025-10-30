import { useState, useEffect } from "react";
import { getPilot, upsertPilot } from "../utils/api";
import RoleSelector from "../components/RoleSelector";

export default function PilotForm() {
  const [nick, setNick] = useState("");
  const [roles, setRoles] = useState([]);
  const [ships, setShips] = useState([]);
  const [notes, setNotes] = useState("");
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState("");

  const loadData = async () => {
    if(nick){
      const data = await getPilot(nick);
      if(data){
        setRoles(data["Роли"]?.split(", ") || []);
        setShips(data["Корабли"]?.split(", ") || []);
        setNotes(data["Примечания"] || "");
        setLevel(data["Уровень подготовки"] || 1);
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await upsertPilot({
      "Ник пилота": nick,
      "Роли": roles.join(", "),
      "Корабли": ships.join(", "),
      "Примечания": notes,
      "Уровень подготовки": level
    });
    setStatus("Данные сохранены!");
  }

  useEffect(()=>{ loadData() }, [nick]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2>Форма пилота</h2>
      <form onSubmit={handleSubmit}>
        <label>Ник пилота</label>
        <input type="text" value={nick} onChange={e=>setNick(e.target.value)} required />
        <RoleSelector selectedRoles={roles} setSelectedRoles={setRoles} selectedShips={ships} setSelectedShips={setShips} />
        <label>Примечания</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} />
        <label>Уровень подготовки (1–5)</label>
        <input type="number" value={level} min={1} max={5} onChange={e=>setLevel(e.target.value)} />
        <button type="submit">Сохранить</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}
