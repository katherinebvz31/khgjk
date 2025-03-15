import { useState } from "react";

export default function Home() {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [salidas, setSalidas] = useState([]);

  const handleAgregarSalida = () => {
    if (!codigo || !cantidad) return;
    const nuevaSalida = { codigo, cantidad };
    setSalidas([...salidas, nuevaSalida]);
    setCodigo("");
    setCantidad("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Registro de Salidas de Almacén</h1>
      <div>
        <label>Código del producto:</label>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
      </div>
      <div>
        <label>Cantidad retirada:</label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </div>
      <button onClick={handleAgregarSalida}>Agregar Salida</button>

      <h2>Salidas Registradas</h2>
      <ul>
        {salidas.map((salida, index) => (
          <li key={index}>
            Código: {salida.codigo}, Cantidad: {salida.cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
}
