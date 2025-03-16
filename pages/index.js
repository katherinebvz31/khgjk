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

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: "url('/fondo.jpg')", backgroundSize: "cover", backgroundPosition: "center", height: "100vh" }}
    >
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
          <h2 className="text-xl font-bold">{productos[codigo].PRODUCTO}</h2>
          <p>Unidad: {productos[codigo].UNIDAD}</p>
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
