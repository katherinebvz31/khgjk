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
    const cargarProductos = async () => {
      try {
        const response = await fetch("/productos.xlsx");
        if (!response.ok) throw new Error("No se pudo cargar productos.xlsx");
        
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const productosMap = {};
        jsonData.forEach((producto) => {
          productosMap[producto.Codigo] = {
            Nombre: producto.Nombre,
            Unidad: producto.Unidad,
          };
        });

        setProductos(productosMap);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, []);

  const agregarSalida = () => {
    if (!productos[codigo] || !cantidad) return;
    
    const nuevoRegistro = {
      fecha: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      codigo,
      nombre: productos[codigo].Nombre,
      unidad: productos[codigo].Unidad,
      cantidad,
    };
    
    setSalidas([...salidas, nuevoRegistro]);
    setCodigo("");
    setCantidad("");
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-4" style={{ backgroundImage: "url('/fondo.jpg')" }}>
      <h1 className="text-white text-3xl font-bold">Registro de Salidas</h1>
      
      <div className="mt-4">
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="p-2 border rounded"
        />
        <button onClick={agregarSalida} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Agregar</button>
      </div>

      {productos[codigo] && (
        <div className="mt-4 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold">{productos[codigo].Nombre}</h2>
          <p>Unidad: {productos[codigo].Unidad}</p>
          <Image src={`/imagenes/${codigo}.jpg`} width={100} height={100} alt="Producto" />
        </div>
      )}

      <table className="mt-4 w-full bg-white rounded shadow-md">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Unidad</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {salidas.map((salida, index) => (
            <tr key={index}>
              <td>{salida.fecha}</td>
              <td>{salida.codigo}</td>
              <td>{salida.nombre}</td>
              <td>{salida.unidad}</td>
              <td>{salida.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
