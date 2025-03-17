import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { format } from "date-fns";

const Home = () => {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [productos, setProductos] = useState({});
  const [salidas, setSalidas] = useState([]);

  useEffect(() => {
    fetch("/productos.xlsx")
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const productosMap = {};
        jsonData.forEach((producto) => {
          productosMap[producto.CÓDIGO] = producto;
        });
        setProductos(productosMap);
      });
  }, []);

  const agregarSalida = () => {
    if (!productos[codigo] || !cantidad) {
      console.warn("⚠️ Código no encontrado en la base de datos o cantidad vacía");
      return;
    }
    const nuevoRegistro = {
      id: Date.now(),
      fecha: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      codigo,
      nombre: productos[codigo].PRODUCTO,
      unidad: productos[codigo].UNIDAD,
      cantidad,
    };
    setSalidas([...salidas, nuevoRegistro]);
    setCodigo("");
    setCantidad("");
  };

  // ✅ Función para eliminar un registro
  const eliminarSalida = (id) => {
    const nuevasSalidas = salidas.filter((salida) => salida.id !== id);
    setSalidas(nuevasSalidas);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-montserrat text-white"
      style={{ backgroundImage: "url('/fondo.jpg')" }}
    >
      <h1 className="text-4xl font-bold">Registro de Salidas</h1>

      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <button 
          onClick={agregarSalida} 
          className="bg-black text-white px-4 py-2 rounded transition duration-300 hover:bg-white hover:text-black border-2 border-black"
        >
          Agregar
        </button>
      </div>

      {productos[codigo] && (
        <div className="mt-4 bg-white p-4 rounded shadow-md text-black flex flex-col items-center">
          <h2 className="text-xl font-bold">{productos[codigo].PRODUCTO}</h2>
          <p>Unidad: {productos[codigo].UNIDAD}</p>
          <Image src={`/imagenes/${codigo}.jpg`} width={100} height={100} alt="Producto" />
        </div>
      )}

      <div className="mt-6 w-full bg-white text-black rounded shadow-md p-4">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-lg">
              <th className="p-3">Fecha</th>
              <th className="p-3">Código</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Unidad</th>
              <th className="p-3">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {salidas.map((salida) => (
              <tr key={salida.id} className="border-b border-gray-300 relative">
                <td className="p-3">{salida.fecha}</td>
                <td className="p-3">{salida.codigo}</td>
                <td className="p-3">{salida.nombre}</td>
                <td className="p-3">{salida.unidad}</td>
                <td className="p-3 flex justify-between">
                  {salida.cantidad}
                  {/* ❌ Botón de eliminar fuera de la tabla */}
                  <button 
                    onClick={() => eliminarSalida(salida.id)} 
                    className="text-red-500 text-xs opacity-50 hover:opacity-100 hover:text-red-700 transition ml-4"
                    title="Eliminar"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });

